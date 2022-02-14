import {StorageWorld} from "../../world";
import {After, Given, Then, When} from "@cucumber/cucumber";
import sinon from "sinon";
import fs from "fs";
import os from "os";
import {expect} from "chai";
import {Credentials} from "aws-sdk";
import {CloudStorage, GoogleDriveAdapter} from "../../../lib";
import GoogleDriveNodeStorageFactory from "../../../lib/storage/src/GoogleDriveNodeStorageFactory";

After(async function (this: StorageWorld) {
    if (fs.existsSync(this.tokenFile)) {
        fs.unlinkSync(this.tokenFile)
    }
})

Given('I have a credentials in json format', async function (this: StorageWorld) {
    this.tokenFile = `${os.tmpdir()}/google_token.json`;
    this.credentials = {
        installed: {
            client_id: "000000000000-here-should-be-real-client-id.apps.googleusercontent.com",
            project_id: "real-project-id-000000",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_secret: "real-client-secret",
            redirect_uris: [
                "urn:ietf:wg:oauth:2.0:oob",
                "http://localhost"
            ]
        }
    }
})

Given('google drive storage factory', async function (this: StorageWorld) {
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

When('I create storage', async function (this: StorageWorld) {
    this.storage = await this.googleDriveNodeStorageFactory.create(
        this.credentials,
        this.tokenFile
    )
});

Then('I should get storage with google drive adapter', function (this: StorageWorld) {
    expect(fs.existsSync(this.tokenFile)).to.be.true

    const token: Credentials = JSON.parse(fs.readFileSync(this.tokenFile).toString())
    expect(token).to.deep.equal(this.fakeToken)

    expect(this.storage).to.be.instanceof(CloudStorage);
    expect(this.storage.client).to.be.instanceof(GoogleDriveAdapter);
});