import {setWorldConstructor, World} from "@cucumber/cucumber";
import {Credentials} from "google-auth-library/build/src/auth/credentials";
import {CloudStorage} from "../../lib";
import GoogleDriveNodeStorageFactory, {NodeCredentials} from "../../lib/storage/src/GoogleDriveNodeStorageFactory";

export class StorageWorld extends World {
    public credentials: NodeCredentials;
    public googleDriveNodeStorageFactory: GoogleDriveNodeStorageFactory;
    public storage: CloudStorage;
    public tokenFile: string;
    public fakeToken: Credentials;
}

setWorldConstructor(StorageWorld);