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
