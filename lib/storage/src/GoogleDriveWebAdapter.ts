import {Adapter, PutResponse} from "../index";

export default class GoogleDriveWebAdapter implements Adapter {
    private readonly auth: any;
    private readonly folder: string;

    constructor(auth: any, folder: string) {
        this.auth = auth;
        this.folder = folder;
    }

    close(): Promise<void> {
        return Promise.resolve(undefined);
    }

    open(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async put(val: Uint8Array): Promise<PutResponse> {
        console.log(this.auth);
        console.log(this.folder);
        console.log(val);

        const response: PutResponse = {
            url: 'webContentLink',
            storage_data: JSON.stringify([
                "GOOGLE_DRIVE", "", "Key"
            ])
        }

        return new Promise((resolve) => {
            resolve(response)
        })
    }

    async get(key: string): Promise<Uint8Array> {
        console.log(key);
        return Promise.resolve(new Uint8Array());
    }

    remove(key: string): Promise<boolean> {
        console.log(key);
        return Promise.resolve(false);
    }
}
