import {
    StorageConnection, StorageConnectionAmazonS3Node, StorageConnectionAmazonS3Web, StorageConnectionGoogleDriveNode,
    StorageConnectionGoogleDriveWeb, StorageConnectionIpfs
} from "../index";
import {AdapterType} from "./AdapterType";
import AmazonS3NodeStorageFactory from "./AmazonS3NodeStorageFactory";
import AmazonS3WebStorageFactory from "./AmazonS3WebStorageFactory";
import CloudStorage from "./CloudStorage";
import GoogleDriveNodeStorageFactory from "./GoogleDriveNodeStorageFactory";
import GoogleDriveWebStorageFactory from "./GoogleDriveWebStorageFactory";
import IPFSStorageFactory from "./IPFSStorageFactory";

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
            case AdapterType.AMAZON_S3_NODE:
                return await (new AmazonS3NodeStorageFactory()).create(connection as StorageConnectionAmazonS3Node)
        }
    }
}

export default new CloudStorageFactory();
