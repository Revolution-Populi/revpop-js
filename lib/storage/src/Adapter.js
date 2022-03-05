//TODO::change to interface
class Adapter {
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
     * @returns {Promise<String>}
     */
    async put(val) { // eslint-disable-line require-await
    }

    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @returns {Promise<Uint8Array>}
     */
    async get(key) { // eslint-disable-line require-await
    }

    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @returns {Promise<boolean>}
     */
    async remove (key) { // eslint-disable-line require-await
    }
}

export default Adapter;
