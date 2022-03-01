import S3, {PutObjectRequest} from "aws-sdk/clients/s3";
import {Adapter, PutResponse} from "../../index";

const AMAZON_S3_VERSION = "1.0"

export default class AmazonS3WebAdapter implements Adapter {
    s3: S3
    bucketName: string

    constructor(s3: S3, bucketName: string) {
        this.s3 = s3
        this.bucketName = bucketName
    }

    close(): Promise<void> {
        return Promise.resolve(undefined);
    }

    open(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async put(val: Uint8Array): Promise<PutResponse> {
        const request: PutObjectRequest = {
            Key: 'qwer',
            Bucket: this.bucketName,
            Body: val
        }
        const managedUpload = await this.s3.upload(request)
        const sendData = await managedUpload.promise()

        const response: PutResponse = {
            url: 'webContentLink',
            storage_data: JSON.stringify([
                "AMAZON_S3", AMAZON_S3_VERSION, sendData.Key
            ])
        }

        return response;
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
