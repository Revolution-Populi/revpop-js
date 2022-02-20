import {
    CloudStorage,
    StorageConnectionIpfs
} from "../../../lib";
import {Given, Then, When} from "@cucumber/cucumber";
import {IPFSAdapter} from "../../../lib";
import IPFSStorageFactory from "../../../lib/storage/src/IPFSFactory";
import {StorageWorld} from "../../world";
import {expect} from "chai";
import {ipfs} from "./credentials";

Given('I have a credentials for IPFS adapter', async function (this: StorageWorld) {
    this.credentials = ipfs;
})

Given('IPFS storage factory', async function (this: StorageWorld) {
    this.IPFSStorageFactory = new IPFSStorageFactory();
});

When('I create IPFS storage', async function (this: StorageWorld) {
    this.storage = await this.IPFSStorageFactory.create(
        <StorageConnectionIpfs>this.credentials
    )
});

Then('I should get storage with IPFS adapter', function (this: StorageWorld) {
    expect(this.storage).to.be.instanceof(CloudStorage);
    expect(this.storage.client).to.be.instanceof(IPFSAdapter);
});
