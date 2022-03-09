import {AdapterType, webFromStorage} from "../../lib/storage/src/AdapterType";
import {StorageType} from "../../lib/storage/src/StorageType";
import {expect} from "chai";

describe("AdapterType", () => {
    describe("webFromStorage", () => {
        const cases: {storage: StorageType; adapterType: AdapterType; error?: boolean}[] = [
            { storage: StorageType.IPFS, adapterType: AdapterType.IPFS},
            { storage: StorageType.GD, adapterType: AdapterType.GOOGLE_DRIVE_WEB },
            // { storage: "S3", adapterType: StorageType.S3 },
            // { storage: "Invalid", adapterType: undefined, error: StorageType.S3 },
        ];

        cases.forEach(({storage, adapterType, error}) => {
            describe(`When called with ${storage}`, () => {
                if (!error) {
                    it(`should return ${adapterType}`, () => {
                        expect(webFromStorage(storage)).to.be.equal(adapterType)
                    })
                } else {
                    it(`should raise exception`, () => {
                        expect(webFromStorage.bind(storage)).to.throw
                    })
                }
            })
        })
    })
});
