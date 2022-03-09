import "colors";
import AWS from 'aws-sdk';
import AmazonS3NodeAdapter from "./AmazonS3NodeAdapter";
import CloudStorage from "./CloudStorage";
import {StorageConnectionAmazonS3Node} from "../index";

export default class AmazonS3NodeStorageFactory {
    public async create(credentials: StorageConnectionAmazonS3Node): Promise<CloudStorage> {
        AWS.config.region = credentials.region;
        AWS.config.credentials = new AWS.Credentials({
            accessKeyId: credentials.access_key_id,
            secretAccessKey: credentials.secret_access_key
        });

        const s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            params: { Bucket: credentials.bucket }
        });

        return new CloudStorage(new AmazonS3NodeAdapter(s3, credentials.bucket));
    }
}
