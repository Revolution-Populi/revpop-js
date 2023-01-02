/*
 * Copyright (c) 2018-2023 Revolution Populi Limited, and contributors.
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import Adapter from "./Adapter";
import createClient from "ipfs-http-client";

/**
 * IPFS client adapter for CloudStorage class.
 */
class IPFSAdapter extends Adapter {
    /**
     * @param {*} options required options: {}
     */
    constructor(options = {}) {
        super(options);
        this.client = new createClient(options);
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

        return cid.toString();
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
