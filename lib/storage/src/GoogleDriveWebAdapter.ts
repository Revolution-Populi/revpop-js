/**
 * The Revolution Populi Project
 * Copyright (C) 2020 Revolution Populi Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
