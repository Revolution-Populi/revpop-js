import {
    StorageConnection, StorageConnectionGoogleDriveNode,
    StorageConnectionGoogleDriveWeb, StorageConnectionIpfs
} from "../../index";
import CloudStorage from "./CloudStorage";
import GoogleDriveNodeStorageFactory from "./GoogleDriveNodeStorageFactory";
import GoogleDriveWebStorageFactory from "./GoogleDriveWebStorageFactory";
import IPFSStorageFactory from "./IPFSStorageFactory";

export enum AdapterType {
    IPFS = 'ipfs',
    GOOGLE_DRIVE_WEB = 'google_drive_web',
    GOOGLE_DRIVE_NODE = 'google_drive_node'
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
        }
    }
}

export default new CloudStorageFactory();