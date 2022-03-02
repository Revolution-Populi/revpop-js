import {CloudStorage} from "../../../lib";
import MemoryAdapter from "../../../lib/storage/src/MemoryAdapter";
import PersonalDataRepository from "../../../lib/storage/src/Repository/PersonalData";
// import {PrivateKey} from "../../../lib/ecc";
import {expect} from "chai";
import sinon from "sinon";

describe("PersonalDataRepository", () => {
    describe("findBySubjectAndOperator", async () => {
        const account: Map<string, string> = new Map()
        account.set('id', 'fake_id')

        const apisResponse: any = {
            "id": "1.27.12",
            "subject_account": "1.2.7",
            "operator_account": "1.2.7",
            "url":"https://ipfs.io/ipfs/QmSrqHzTkGgbmggMmJQ2q1ikNg1dGLFQYCxZD9vxmAcqhm",
            "hash":"0f810505b5a157973923e047cce04c137bd9d4d87266bbed342079213c24c5fb",
            "storage_data": JSON.stringify(["IPFS", "1.0", "QmSrqHzTkGgbmggMmJQ2q1ikNg1dGLFQYCxZD9vxmAcqhm"])
        };
        const execFake = sinon.fake.returns(apisResponse);
        const Apis: any = {
            db_api: () => ({
                exec: execFake
            })
        }

        const storage: CloudStorage = new CloudStorage(new MemoryAdapter())
        sinon.replace(storage, "crypto_load_buffer" as any, sinon.fake.returns(JSON.stringify(
            {
                "ver":1,
                "dto":[
                    {
                        "val": {"first": "James", "last": "Bond", "middle": "", "title": ""},
                        "salt":"ELI5pi2gP3k="
                    },
                    {
                        "val":"bond@mi5.gov.uk",
                        "salt":"QIGJY3LGQBY="
                    },
                    {
                        "val":"+44123456789",
                        "salt":"qgAGk1RKEms="
                    },
                    {
                        "val":
                            {
                                "url":"https://ipfs.io/ipfs/QmTw56GGGwVSneSMGzxCQgySg1FwAkzeY8g1aYcKNtywEu",
                                "type":"image/png","hash":"0c6f1d68b7a4593804cbe0e53bf7d7f2eff3cb0ce0547a2ae6bf6a4fefa05125",
                                "storage_data":"[\"IPFS\",\"1.0\",\"QmTw56GGGwVSneSMGzxCQgySg1FwAkzeY8g1aYcKNtywEu\"]"
                            },
                        "salt":"0sGLJJ4kky4="
                    }
                ]}
        )));

        const personalDataRepository: PersonalDataRepository = new PersonalDataRepository(Apis, storage)
        const personalData = await personalDataRepository.findBySubjectAndOperator(account, "", account, "");

        expect(execFake.callCount).to.equal(1);
        expect(execFake.getCall(0).firstArg).to.equal('get_last_personal_data_v2');
        expect(execFake.calledOnceWith('get_last_personal_data_v2', account.get('id'), account.get('id'))).to.be.true

        expect(personalData.getFirstName()).to.equal('James');
        expect(personalData.getLastName()).to.equal('Bond');
        expect(personalData.getMiddleName()).to.equal('');
        expect(personalData.getEmail()).to.equal('bond@mi5.gov.uk');
        expect(personalData.getPhone()).to.equal('+44123456789');
    })
});
