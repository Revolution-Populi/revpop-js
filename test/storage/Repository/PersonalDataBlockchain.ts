import PersonalDataBlockchainRepository from "../../../lib/storage/src/Repository/PersonalDataBlockchain";
import Transaction from "../../../lib/storage/src/Model/Transaction";
import {expect} from "chai";
import sinon from "sinon";

describe("PersonalDataBlockchainRepository", () => {
    describe("getTransaction", async () => {
        it('should return correct Transaction object', async () => {
            const account: Map<string, string> = new Map()
            account.set('id', 'fake_id')

            const storageData = ["IPFS", "1.0", "QmSrqHzTkGgbmggMmJQ2q1ikNg1dGLFQYCxZD9vxmAcqhm"];
            const apisResponse: any = {
                "id": "1.27.12",
                "subject_account": "1.2.7",
                "operator_account": "1.2.7",
                "url": "https://ipfs.io/ipfs/QmSrqHzTkGgbmggMmJQ2q1ikNg1dGLFQYCxZD9vxmAcqhm",
                "hash": "0f810505b5a157973923e047cce04c137bd9d4d87266bbed342079213c24c5fb",
                "storage_data": JSON.stringify(storageData)
            };
            const execFake = sinon.fake.returns(apisResponse);
            const Apis: any = {
                db_api: () => ({
                    exec: execFake
                })
            }

            const personalDataBlockchainRepository = new PersonalDataBlockchainRepository(Apis)
            const tx = await personalDataBlockchainRepository.getTransaction(account, account)

            expect(execFake.calledOnceWith('get_last_personal_data_v2', account.get('id'), account.get('id')))
            expect(tx).is.instanceof(Transaction)
            expect(tx.hash).is.equal(apisResponse.hash)
            expect(tx.storageData.storage).is.equal('ipfs')
            expect(tx.storageData.version).is.equal(storageData[1])
            expect(tx.storageData.key).is.equal(storageData[2])
        })
    })
});
