import CloudStorage from "./CloudStorage";
import IPFSAdapter from "./IPFSAdapter";
import {StorageConnectionIpfs} from "../index";

export default class IPFSStorageFactory {
    public async create(connection: StorageConnectionIpfs): Promise<CloudStorage> {
        return new Promise((resolve) => {
            resolve(new CloudStorage(new IPFSAdapter(connection)));
        });
    }
}
