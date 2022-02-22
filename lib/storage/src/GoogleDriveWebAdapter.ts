import {Adapter} from "../../index";

/**
 * TODO:complete this adapter
 */
export default class GoogleDriveWebAdapter implements Adapter {
    private readonly auth: any;
    private readonly folder: string;

    constructor(auth: any, folder: string) {
        this.auth = auth;
        this.folder = folder;
    }

    close(): Promise<void> {
        return Promise.resolve(undefined);
    }

    open(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async put(val: Uint8Array): Promise<string> {
        console.log(this.auth);
        console.log(this.folder);
        console.log(val);
        return new Promise((resolve) => {
            resolve('Ok')
        })
    }

    async get(key: string): Promise<Uint8Array> {
        console.log(key);
        return Promise.resolve(new Uint8Array());
    }

    remove(key: string): Promise<boolean> {
        console.log(key);
        return Promise.resolve(false);
    }
}
