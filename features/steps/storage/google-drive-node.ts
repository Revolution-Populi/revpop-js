import { StorageWorld } from '../../world';
import {Given, Then, When} from '@cucumber/cucumber';
import GoogleDriveAdapterFactory from "../../../lib/storage/src/GoogleDriveAdapterFactory";
// @ts-ignore
// import assert from 'assert';

Given('I have a credentials in json format', async function (this: StorageWorld) {
    this.credentials = 'credentials'
});

Given('google drive storage factory', async function (this: StorageWorld) {
    this.googleDriveAdapterFactory = new GoogleDriveAdapterFactory()
});

When('I create storage', async function (this: StorageWorld) {

});

Then('I should get storage with google drive adapter', function (this: StorageWorld) {

});