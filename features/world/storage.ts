import {setWorldConstructor, World} from '@cucumber/cucumber';

export class StorageWorld extends World {
    public credentials: string;
}

setWorldConstructor(StorageWorld);