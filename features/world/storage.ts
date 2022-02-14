import {setWorldConstructor, World} from '@cucumber/cucumber';
import GoogleDriveAdapterFactory from "../../lib/storage/src/GoogleDriveAdapterFactory";

export class StorageWorld extends World {
    public credentials: string;
    public googleDriveAdapterFactory: GoogleDriveAdapterFactory;
}

setWorldConstructor(StorageWorld);