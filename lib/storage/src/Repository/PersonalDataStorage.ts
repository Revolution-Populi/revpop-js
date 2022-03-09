import {CloudStorage} from "../../index";
import PersonalData from "../PersonalData"

export default class PersonalDataStorage {
    storage: CloudStorage

    constructor(storage: CloudStorage) {
        this.storage = storage
    }

    async getByKey(key: string, subjectPublicKey: any, operatorPrivateKey: any): Promise<PersonalData> {
        const personalDataBuffer = await this.loadPersonalDataFromStorage(
            key,
            subjectPublicKey,
            operatorPrivateKey
        )

        return PersonalData.fromBuffer(personalDataBuffer);
    }

    // async deleteBySubjectAndOperator(key: string): Promise<boolean> {
    //     console.log(key);

        // if (!personalDataBlockchain) {
        //     return Promise.resolve(false);
        // }
        //
        // console.log(personalDataBlockchain);
        //
        // const txb = new TransactionBuilder();
        // txb.add_type_operation("personal_data_remove", {
        //     fee: {
        //         amount: 0,
        //         asset_id: 0
        //     },
        //     subject_account: subject_account.get("id"),
        //     operator_account: operator_account.get("id"),
        //     hash: bdata.hash
        // });
        // await WalletDb.process_transaction(txb, null, true);
        //
        // if (!txb.tr_buffer) {
        //     throw "Something went finalization the transaction, this should not happen";
        // }


        // return Promise.resolve(false)
    // }

    private async loadPersonalDataFromStorage(key: string, subjectPublicKey: any, operatorPrivateKey: any) {
        return await this.storage.crypto_load_buffer(
            key,
            subjectPublicKey,
            operatorPrivateKey
        )
    }
}
