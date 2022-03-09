import {StorageType} from "./StorageType";

export enum AdapterType {
    IPFS = 'ipfs',
    GOOGLE_DRIVE_WEB = 'google_drive_web',
    GOOGLE_DRIVE_NODE = 'google_drive_node',
    AMAZON_S3_WEB = 'amazon_s3_web',
    AMAZON_S3_NODE = 'amazon_s3_node'
}

export function webFromStorage(storageType: StorageType): AdapterType {
    switch (storageType) {
        case StorageType.IPFS:
            return AdapterType.IPFS
        case StorageType.GD:
            return AdapterType.GOOGLE_DRIVE_WEB
        case StorageType.S3:
            return AdapterType.AMAZON_S3_WEB
    }

    throw new Error(`Invalid storage type: ${storageType}`)
}
