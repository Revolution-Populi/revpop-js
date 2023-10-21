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
