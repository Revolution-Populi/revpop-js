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

    async findBySubjectAndOperator(subjectAccount: any, operatorAccount: any): Promise<PersonalData> {
        const personalDataBlockchain = await this.loadFromBlockchain(subjectAccount, operatorAccount);
        const personalDataCid = this.getPersonalDataCid(personalDataBlockchain.storage_data);
        const personalDataBuffer = this.loadPersonalDataFromStorage(personalDataCid, subjectAccount, operatorAccount)

        return PersonalData.fromBuffer(personalDataBuffer);
    }

    private async loadFromBlockchain(subjectAccount: any, operatorAccount: any) {
        return await this.api.db_api().exec(
            'get_last_personal_data_v2',
            subjectAccount.id,
            operatorAccount.id
        );
    }

    private getPersonalDataCid(storageData: string): string {
        const personalDataStorageData = JSON.parse(storageData);
        return personalDataStorageData[2]
    }

    private loadPersonalDataFromStorage(cid: string, subjectAccount: any, operatorAccount: any) {
        return this.storage.crypto_load_buffer(
            cid,
            subjectAccount.key.toPublicKey(),
            operatorAccount.key
        )
    }
}
