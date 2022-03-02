import {Adapter, PutResponse} from "../index";
import S3, {PutObjectRequest} from "aws-sdk/clients/s3";
import {sha1} from "../../ecc/src/hash";

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
            Key: sha1(val.toString(), 'hex'),
            Bucket: this.bucketName,
            Body: val
        }
        const managedUpload = await this.s3.upload(request)
        const sendData = await managedUpload.promise()

        const response: PutResponse = {
            url: sendData.Location,
            storage_data: JSON.stringify([
                "AMAZON_S3", AMAZON_S3_VERSION, sendData.Key
            ])
        }

        return response;
    }

    async get(key: string): Promise<Uint8Array> {
        const params = {
            Bucket: this.bucketName,
            Key: key
        };
        const request = await this.s3.getObject(params);
        const result = await request.promise();

        return Promise.resolve(result.Body as Uint8Array);
    }

    async remove(key: string): Promise<boolean> {
        const params = {
            Bucket: this.bucketName,
            Key: key
        };
        const request = await this.s3.deleteObject(params);
        const result = await request.promise();

        return Promise.resolve(true);
    }
}
