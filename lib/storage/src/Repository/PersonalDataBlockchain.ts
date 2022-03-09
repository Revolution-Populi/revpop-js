import Transaction from "../Model/Transaction";

export default class PersonalDataBlockchain {
    //TODO: create d.ts for @revolutionpopuli/revpopjs-ws
    api: any

    constructor(api: any) {
        this.api = api
    }

    async getTransaction(subjectAccount: any, operatorAccount: any): Promise<Transaction> {
        const transaction = await this.loadFromBlockchain(subjectAccount, operatorAccount);
        return Promise.resolve(Transaction.fromBlockchainTransaction(transaction));
    }

    private async loadFromBlockchain(subjectAccount: any, operatorAccount: any) {
        return await this.api.db_api().exec(
            'get_last_personal_data_v2',
            [subjectAccount.get("id"), operatorAccount.get("id")]
        );
    }
}
