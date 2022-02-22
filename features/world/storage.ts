import {CloudStorage, StorageConnection} from "../../lib";
import {World, setWorldConstructor} from "@cucumber/cucumber";
import {AdapterType} from "../../lib/storage/src/CloudStorageFactory";
import {Credentials} from "google-auth-library/build/src/auth/credentials";
import GoogleDriveNodeStorageFactory from "../../lib/storage/src/GoogleDriveNodeStorageFactory";
import IPFSStorageFactory from "../../lib/storage/src/IPFSStorageFactory";

export class StorageWorld extends World {
    public credentials: StorageConnection;
    public IPFSStorageFactory: IPFSStorageFactory;
    public googleDriveNodeStorageFactory: GoogleDriveNodeStorageFactory;
    public googleDriveWebStorageFactory: GoogleDriveNodeStorageFactory;
    public storage: CloudStorage;
    public adapterType: AdapterType;
    public tokenFile: string;
    public fakeToken: Credentials;
}

setWorldConstructor(StorageWorld);
