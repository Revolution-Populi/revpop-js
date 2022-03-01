import {
    StorageConnection, StorageConnectionAmazonS3Web, StorageConnectionGoogleDriveNode,
    StorageConnectionGoogleDriveWeb, StorageConnectionIpfs
} from "../../index";
import AmazonS3WebStorageFactory from "./AmazonS3WebStorageFactory";
import CloudStorage from "./CloudStorage";
import GoogleDriveNodeStorageFactory from "./GoogleDriveNodeStorageFactory";
import GoogleDriveWebStorageFactory from "./GoogleDriveWebStorageFactory";
import IPFSStorageFactory from "./IPFSStorageFactory";

export enum AdapterType {
    IPFS = 'ipfs',
    GOOGLE_DRIVE_WEB = 'google_drive_web',
    GOOGLE_DRIVE_NODE = 'google_drive_node',
    AMAZON_S3_WEB = 'amazon_s3_web'
}

class CloudStorageFactory {
    async create(type: AdapterType, connection: StorageConnection): Promise<CloudStorage> {
        switch (type) {
            case AdapterType.IPFS:
                return await (new IPFSStorageFactory()).create(<StorageConnectionIpfs>connection)
            case AdapterType.GOOGLE_DRIVE_WEB:
                return await (new GoogleDriveWebStorageFactory()).create(<StorageConnectionGoogleDriveWeb>connection)
            case AdapterType.GOOGLE_DRIVE_NODE:
                connection = <StorageConnectionGoogleDriveNode>connection;
                return await (new GoogleDriveNodeStorageFactory()).create(
                    <StorageConnectionGoogleDriveNode>connection,
                    connection.tokenPath
                )
            case AdapterType.AMAZON_S3_WEB:
                return await (new AmazonS3WebStorageFactory()).create(connection as StorageConnectionAmazonS3Web)
        }
    }
}

export default new CloudStorageFactory();
