import {setWorldConstructor, World} from '@cucumber/cucumber';
import GoogleDriveAdapterFactory, { NodeCredentials } from "../../lib/storage/src/GoogleDriveAdapterFactory";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { Adapter } from "../../lib";

export class StorageWorld extends World {
    public credentials: NodeCredentials;
    public googleDriveAdapterFactory: GoogleDriveAdapterFactory;
    public adapter: Adapter;
    public tokenFile: string;
    public fakeToken: Credentials;
}

setWorldConstructor(StorageWorld);