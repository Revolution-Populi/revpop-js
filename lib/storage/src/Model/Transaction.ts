import {StorageType, fromString as StorageTypeFromString} from "../StorageType";

interface StorageData {
    storage: StorageType,
    version: string,
    key: string
}

class Transaction {
    hash: string;
    storageData: StorageData

    constructor(hash: string, storageData: StorageData) {
        this.hash = hash;
        this.storageData = storageData
    }

    static fromBlockchainTransaction(transaction: any): Transaction {
        const parsedStorageData: string[] = JSON.parse(transaction.storage_data)

        const storageData: StorageData = {
            storage: StorageTypeFromString(parsedStorageData[0]),
            version: parsedStorageData[1],
            key: parsedStorageData[2],
        }

        return new Transaction(transaction.hash, storageData)
    }
}

export default Transaction;
