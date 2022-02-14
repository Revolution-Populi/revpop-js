import { StorageWorld } from '../../world';
import {Given, Then, When} from '@cucumber/cucumber';
import GoogleDriveAdapterFactory from "../../../lib/storage/src/GoogleDriveAdapterFactory";
import * as os from "os";
// @ts-ignore
// import assert from 'assert';

Given('I have a credentials in json format', async function (this: StorageWorld) {
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
});

Given('google drive storage factory', async function (this: StorageWorld) {
    this.googleDriveAdapterFactory = new GoogleDriveAdapterFactory()
});

When('I create storage', async function (this: StorageWorld) {
    this.googleDriveAdapterFactory.create(this.credentials, `${os.tmpdir()}/google_token.json`)
});

Then('I should get storage with google drive adapter', function (this: StorageWorld) {

});