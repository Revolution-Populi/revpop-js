import "colors";
import AWS from 'aws-sdk';
import AmazonS3WebAdapter from "./AmazonS3WebAdapter";
import CloudStorage from "./CloudStorage";
import {StorageConnectionAmazonS3Web} from "../index";

export default class AmazonS3WebStorageFactory {
    public async create(credentials: StorageConnectionAmazonS3Web): Promise<CloudStorage> {
        AWS.config.region = credentials.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: credentials.identity_pool_id,
        });

        const s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            params: { Bucket: credentials.bucket }
        });

        return new CloudStorage(new AmazonS3WebAdapter(s3, credentials.bucket));
    }
}
