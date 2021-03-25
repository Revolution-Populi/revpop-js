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
