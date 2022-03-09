import {AdapterType} from "../../lib/storage/src/AdapterType";
import AmazonS3NodeStorageFactory from "../../lib/storage/src/AmazonS3NodeStorageFactory";
import AmazonS3WebStorageFactory from "../../lib/storage/src/AmazonS3WebStorageFactory";
import CloudStorageFactory from "../../lib/storage/src/CloudStorageFactory";
import GoogleDriveNodeStorageFactory from "../../lib/storage/src/GoogleDriveNodeStorageFactory";
import GoogleDriveWebStorageFactory from "../../lib/storage/src/GoogleDriveWebStorageFactory";
import IPFSStorageFactory from "../../lib/storage/src/IPFSStorageFactory";
import {expect} from "chai";
import {getCredentials} from "./credentials";
import sinon from "sinon";

describe("CloudStorageFactory", () => {
    describe("create", () => {
        const cases: {adapterType: AdapterType, factory: any}[] = [
            {
                adapterType: AdapterType.IPFS,
                factory: IPFSStorageFactory,
            },
            {
                adapterType: AdapterType.GOOGLE_DRIVE_WEB,
                factory: GoogleDriveWebStorageFactory,
            },
            {
                adapterType: AdapterType.GOOGLE_DRIVE_NODE,
                factory: GoogleDriveNodeStorageFactory,
            },
            {
                adapterType: AdapterType.AMAZON_S3_WEB,
                factory: AmazonS3WebStorageFactory,
            },
            {
                adapterType: AdapterType.AMAZON_S3_NODE,
                factory: AmazonS3NodeStorageFactory,
            }
        ];

        cases.forEach(({adapterType, factory}) => {
            const fake = sinon.replace(factory['prototype'], 'create' as any, sinon.fake.returns(null))
            const credentials = getCredentials(adapterType)

            describe( `When send ${adapterType} adapterType to CloudStorageFactory:create`, () => {
                it(`should call ${factory.name}:create method with appropriate connection settings`, async () => {
                    await CloudStorageFactory.create(adapterType, credentials)
                    expect(fake.calledOnceWith(credentials)).to.be.true;
                })
            })
        });
    })
});
