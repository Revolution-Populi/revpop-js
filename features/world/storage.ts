import {setWorldConstructor, World} from '@cucumber/cucumber';
import GoogleDriveAdapterFactory, { NodeCredentials } from "../../lib/storage/src/GoogleDriveAdapterFactory";

export class StorageWorld extends World {
    public credentials: NodeCredentials;
    public googleDriveAdapterFactory: GoogleDriveAdapterFactory;
}

setWorldConstructor(StorageWorld);