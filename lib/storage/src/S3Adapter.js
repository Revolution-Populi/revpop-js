/*
 * Copyright (c) 2018-202 Revolution Populi Limited, and contributors.
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
import S3 from "aws-sdk/clients/s3";
import {sha256} from "../../ecc/src/hash";

/**
 * S3 client adapter for CloudStorage class.
 */
class S3Adapter extends Adapter {
    /**
     * @param {*} options required options: {region, credentials: {}, params: {Bucket}}
     */
    constructor(options = {}) {
        super(options);
        const opts = { apiVersion: "2006-03-01", ...options };
        this.client = new S3(opts);
    }

    /**
     * Store the passed value under the passed key
     *
     * @param {string|Buffer} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    async put(val, options = {}) {
        const id = sha256(val, 'hex');
        const params = {
            Body: val,
            Key: id,
        };
        return new Promise((resolve, reject) => {
            this.client.putObject(params).promise()
                .then(() => {
                    resolve(id);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Buffer>}
     */
    async get(key, options = {}) {
        const params = {
            Key: key,
        };
        return new Promise((resolve, reject) => {
            this.client.getObject(params).promise()
                .then((data) => {
                    resolve(data.Body);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    async delete (key, options = {}) {
        const params = {
            Key: key,
        };
        return new Promise((resolve, reject) => {
            this.client.deleteObject(params).promise()
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default S3Adapter;
