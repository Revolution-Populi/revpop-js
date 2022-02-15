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

import Adapter from "./Adapter";
import { create } from "ipfs-http-client";

const IPFS_VERSION = "1.0"

/**
 * IPFS client adapter for CloudStorage class.
 */
class IPFSAdapter extends Adapter {
    /**
     * @param {*} options required options: {}
     */
    constructor(options = {}) {
        super();
        this.client = create(options);
    }

    /**
     * Store the passed value
     *
     * @param {string|Buffer} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    async put(val, options = {}) {
        const { cid } = await this.client.add(val);

        const link = `https://ipfs.io/ipfs/${cid}`;
        const ret = { url: link, storage_data: "[\"IPFS\",\"" + `${IPFS_VERSION}` + "\",\"" + `${cid}` + "\"]" };
        return ret;
    }

    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Buffer>}
     */
    async get(key, options = {}) {
        const chunks = [];
        for await (const chunk of this.client.cat(key)) {
            chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
        }

        return Buffer.concat(chunks);
    }

    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    async delete(key, options = {}) {
        return new Promise((resolve, reject) => {
            reject('IPFSAdapter doesn\'t implement delete function');
        });
    }
}

export default IPFSAdapter;
