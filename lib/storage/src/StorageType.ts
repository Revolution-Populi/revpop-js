export enum StorageType {
    IPFS = 'ipfs',
    GD = 'google_drive',
    S3 = 's3'
}

export function fromString(storage: string): StorageType {
    switch (storage) {
        case "IPFS":
            return StorageType.IPFS
        case "GD":
            return StorageType.GD
        case "S3":
            return StorageType.S3
    }

    throw new Error(`Invalid storage type: ${storage}`)
}


