import {CloudStorage} from "../../index";
import PersonalData from "../PersonalData"

export default class PersonalDataRepository {
    //TODO: create d.ts for @revolutionpopuli/revpopjs-ws
    api: any
    storage: CloudStorage

    constructor(api: any, storage: CloudStorage) {
        this.api = api
        this.storage = storage
    }

    async findBySubjectAndOperator(subjectAccount: any, subjectPublicKey: any,
                                   operatorAccount: any, operatorPrivateKey: any): Promise<PersonalData> {
        const personalDataBlockchain = await this.loadFromBlockchain(subjectAccount, operatorAccount);
        const personalDataCid = this.getPersonalDataCid(personalDataBlockchain.storage_data);
        const personalDataBuffer = await this.loadPersonalDataFromStorage(
            personalDataCid,
            subjectPublicKey,
            operatorPrivateKey
        )

        return PersonalData.fromBuffer(personalDataBuffer);
    }

    private async loadFromBlockchain(subjectAccount: any, operatorAccount: any) {
        return await this.api.db_api().exec(
            'get_last_personal_data_v2',
            [subjectAccount.get("id"), operatorAccount.get("id")]
        );
    }

    private getPersonalDataCid(storageData: string): string {
        const personalDataStorageData = JSON.parse(storageData);
        return personalDataStorageData[2]
    }

    private async loadPersonalDataFromStorage(cid: string, subjectPublicKey: any, operatorPrivateKey: any) {
        return await this.storage.crypto_load_buffer(
            cid,
            subjectPublicKey,
            operatorPrivateKey
        )
    }
}
