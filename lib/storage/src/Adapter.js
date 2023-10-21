class Adapter {
    constructor(options = {}) {
    }

    async open() {
        return Promise.resolve();
    }

    async close() {
        return Promise.resolve();
    }

    /**
     * Store the passed value under the passed key
     *
     * @param {Uint8Array} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    async put(val, options = {}) { // eslint-disable-line require-await
    }

    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Uint8Array>}
     */
    async get(key, options = {}) { // eslint-disable-line require-await
    }

    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    async delete (key, options = {}) { // eslint-disable-line require-await
    }
}

export default Adapter;
