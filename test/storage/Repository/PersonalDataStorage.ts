import {CloudStorage} from "../../../lib";
import MemoryAdapter from "../../../lib/storage/src/MemoryAdapter";
import PersonalDataStorageRepository from "../../../lib/storage/src/Repository/PersonalDataStorage";
import {expect} from "chai";
import sinon from "sinon";

describe("PersonalDataStorageRepository", () => {
    describe("getTransaction", async () => {
        it('should return correct PersonalData object', async () => {
            const storage: CloudStorage = new CloudStorage(new MemoryAdapter())

            const response = {
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
                ]
            }

            sinon.replace(storage, "crypto_load_buffer" as any, sinon.fake.returns(JSON.stringify(response)));

            const personalDataStorageRepository = new PersonalDataStorageRepository(storage)
            const personalData = await personalDataStorageRepository.getByKey("hash", "", "")

            expect(personalData.getFirstName()).to.equal((response.dto[0].val as any).first);
            expect(personalData.getLastName()).to.equal((response.dto[0].val as any).last);
            expect(personalData.getMiddleName()).to.equal((response.dto[0].val as any).middle);
            expect(personalData.getEmail()).to.equal(response.dto[1].val);
            expect(personalData.getPhone()).to.equal(response.dto[2].val);
        })
    })
});
