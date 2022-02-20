import {After, Given, Then, When} from "@cucumber/cucumber";
import cloudStorageFactory, {AdapterType} from "../../../lib/storage/src/CloudStorageFactory";
import {googleDriveNode, googleDriveWeb, ipfs} from "./credentials";
import GoogleDriveNodeStorageFactory from "../../../lib/storage/src/GoogleDriveNodeStorageFactory";
import GoogleDriveWebStorageFactory from "../../../lib/storage/src/GoogleDriveWebStorageFactory";
import IPFSFactory from "../../../lib/storage/src/IPFSFactory";
import {StorageConnection} from "../../../lib";
import {StorageWorld} from "../../world";
import {expect} from "chai";
import sinon from "sinon";

After(async function (this: StorageWorld) {
    sinon.restore();
})

Given(/^There is adapter (.*) with credentials$/, async function (this: StorageWorld, type: AdapterType) {
    this.adapterType = type;
    this.credentials = getCredentials(type)
});

When(/^I use storage factory to create cloud storage$/, async function (this: StorageWorld) {
    let fakeCreate;
    
    switch (this.adapterType) {
        case AdapterType.IPFS:
            fakeCreate = sinon.replace(IPFSFactory.prototype, 'create' as any, sinon.fake.returns(null));
            break;
        case AdapterType.GOOGLE_DRIVE_WEB:
            fakeCreate = sinon.replace(GoogleDriveWebStorageFactory.prototype, 'create' as any, sinon.fake.returns(null));
            break;
        case AdapterType.GOOGLE_DRIVE_NODE:
            fakeCreate = sinon.replace(GoogleDriveNodeStorageFactory.prototype, 'create' as any, sinon.fake.returns(null));
            break;
    }

    this.storage = await cloudStorageFactory.create(this.adapterType, this.credentials)

    expect(fakeCreate.callCount).to.be.equals(1);
});

Then(/^It should use appropriate storage factory$/, async function (this: StorageWorld) {
    // expect(this.storage).to.be.instanceof(CloudStorage);
    //
    // switch (this.adapterType) {
    //     case AdapterType.IPFS:
    //         expect(this.storage.client).to.be.instanceof(IPFSAdapter);
    //         break;
    //     case AdapterType.GOOGLE_DRIVE_WEB:
    //         expect(this.storage.client).to.be.instanceof(GoogleDriveWebAdapter);
    //         break;
    //     case AdapterType.GOOGLE_DRIVE_NODE:
    //         expect(this.storage.client).to.be.instanceof(GoogleDriveNodeAdapter);
    //         break;
    // }
});

function getCredentials(type: AdapterType): StorageConnection {
    let credentials: StorageConnection = ipfs;

    switch (type) {
        case AdapterType.GOOGLE_DRIVE_NODE:
            credentials = googleDriveNode;
            break;
        case AdapterType.GOOGLE_DRIVE_WEB:
            credentials = googleDriveWeb;
            break;
    }

    return credentials;
}