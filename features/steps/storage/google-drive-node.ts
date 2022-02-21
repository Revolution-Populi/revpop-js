import {After, Given, Then, When} from "@cucumber/cucumber";
import {CloudStorage} from "../../../lib/storage";
import {Credentials} from "aws-sdk";
import GoogleDriveNodeAdapter from "../../../lib/storage/src/GoogleDriveNodeAdapter";
import GoogleDriveNodeStorageFactory from "../../../lib/storage/src/GoogleDriveNodeStorageFactory";
import {StorageConnectionGoogleDriveNode} from "../../../lib";
import {StorageWorld} from "../../world";
import {expect} from "chai";
import fs from "fs";
import {googleDriveNode} from "./credentials";
import sinon from "sinon";

After(async function (this: StorageWorld) {
    if (fs.existsSync(this.tokenFile)) {
        fs.unlinkSync(this.tokenFile)
    }
})

Given('I have a credentials for Google Drive node adapter', async function (this: StorageWorld) {
    this.credentials = googleDriveNode;
    this.tokenFile = this.credentials.tokenPath;
})

Given('Google Drive node storage factory', async function (this: StorageWorld) {
    this.googleDriveNodeStorageFactory = new GoogleDriveNodeStorageFactory();
    this.fakeToken = {
        "access_token": "fake_access_token",
        "refresh_token": "fake_refresh_token",
        "scope": "https://www.googleapis.com/auth/drive.file",
        "token_type": "Bearer",
        "expiry_date": 1644338594649,
    }
    sinon.replace(this.googleDriveNodeStorageFactory, 'getAccessToken' as any, sinon.fake.returns(this.fakeToken));
});

When('I create Google Drive node storage', async function (this: StorageWorld) {
    this.storage = await this.googleDriveNodeStorageFactory.create(
        <StorageConnectionGoogleDriveNode>this.credentials,
        this.tokenFile
    )
});

Then('I should get storage with Google Drive node adapter', function (this: StorageWorld) {
    expect(fs.existsSync(this.tokenFile)).to.be.true

    const token: Credentials = JSON.parse(fs.readFileSync(this.tokenFile).toString())
    expect(token).to.deep.equal(this.fakeToken)

    expect(this.storage).to.be.instanceof(CloudStorage);
    expect(this.storage.client).to.be.instanceof(GoogleDriveNodeAdapter);
});
