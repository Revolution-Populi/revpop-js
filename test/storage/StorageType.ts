import {StorageType, fromString} from "../../lib/storage/src/StorageType";
import {expect} from "chai";

describe("StorageType", () => {
    describe("fromString", () => {
        const cases: {storage: string, storageType?: StorageType, error?: boolean}[] = [
            { storage: "IPFS", storageType: StorageType.IPFS },
            { storage: "GD", storageType: StorageType.GD },
            { storage: "S3", storageType: StorageType.S3 },
            { storage: "Invalid", storageType: undefined, error: true },
        ];

        cases.forEach(({storage, storageType, error}) => {
            describe(`When called with ${storage}`, () => {
                if (!error) {
                    it(`should return ${storageType}`, () => {
                        expect(fromString(storage)).to.be.equal(storageType)
                    })
                } else {
                    it(`should raise exception`, () => {
                        expect(fromString.bind(storage)).to.throw
                    })
                }
            })
        })
    })
});
