import GoogleDriveNodeStorageFactory, {NodeCredentials} from "../../lib/storage/src/GoogleDriveNodeStorageFactory";
import {World, setWorldConstructor} from "@cucumber/cucumber";
import {CloudStorage} from "../../lib";
import {Credentials} from "google-auth-library/build/src/auth/credentials";

export class StorageWorld extends World {
    public credentials: NodeCredentials;
    public clientId: string;
    public apiKey: string;
    public googleDriveNodeStorageFactory: GoogleDriveNodeStorageFactory;
    public googleDriveWebStorageFactory: GoogleDriveNodeStorageFactory;
    public storage: CloudStorage;
    public tokenFile: string;
    public fakeToken: Credentials;
}

setWorldConstructor(StorageWorld);