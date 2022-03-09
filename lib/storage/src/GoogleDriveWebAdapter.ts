import {Adapter, PutResponse} from "../index";
import MultiPartBuilder from "./Multipart";
import {sha1} from "../../ecc/src/hash";

const GD_VERSION = "1.0"

export default class GoogleDriveWebAdapter implements Adapter {
    private readonly client: any;

    constructor(client: any) {
        this.client = client;
    }

    close(): Promise<void> {
        return Promise.resolve(undefined);
    }

    open(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async put(val: Uint8Array): Promise<PutResponse> {
        const fileId = await this.upload(val)

        await this.shareFile(fileId)
            .catch(() => {
                throw new Error('Google Drive file share error.')
            })

        const webLink = await this.getWebLink(fileId)
            .catch((err) => {
                console.log(err)
                throw new Error('Google Drive file share error.')
            })

        const response: PutResponse = {
            url: webLink,
            storage_data: JSON.stringify([
                "GD", GD_VERSION, fileId
            ])
        }

        return response
    }

    async get(key: string): Promise<Uint8Array> {
        try {
            const response = await this.client.drive.files.get({
                fileId: key,
                alt: 'media'
            })

            return response.body;
        } catch (err) {
            console.log(err);
            throw new Error('Google Drive file load error.')
        }
    }

    async remove(key: string): Promise<boolean> {
        try {
            await this.client.drive.files.delete({
                fileId: key
            });
            return true;
        } catch (err) {
            throw new Error('Google Drive file deleting error.')
        }
    }

    private async shareFile(fileId: string): Promise<boolean> {
        const permissions = {
            type: 'anyone',
            role: 'reader',
        };

        await this.client.drive.permissions.create({
            resource: permissions,
            fileId: fileId,
            fields: 'id',
        });

        return true;
    }

    private async upload(val: Uint8Array): Promise<string> {
        const metadata = {
            name: sha1(val.toString(), 'hex'),
            mimeType: 'application/octet-stream'
        }

        const multipart = new MultiPartBuilder()
            .append('application/json', JSON.stringify(metadata))
            .append('application/octet-stream', Buffer.from(val).toString('base64'))
            .finish();

        return new Promise((resolve) => {
            gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: {
                    uploadType: 'multipart',
                    supportsTeamDrives: true,
                },
                headers: {
                    'Content-Type': multipart.type
                },
                body: multipart.body
            }).execute(jsonResp => {
                console.log(jsonResp);
                resolve(jsonResp.id)
            })
        })
    }

    private async getWebLink(fileId: string): Promise<string> {
        const response = await this.client.drive.files.get({
            fileId: fileId,
            fields: 'webContentLink'
        });

        return response.result.webContentLink as string;
    }
}
