declare class Adapter {
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * Store the passed value under the passed key
     *
     * @param {Uint8Array} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    put(val: Uint8Array, options?: Object): Promise<string>;
    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Uint8Array>}
     */
    get(key: string, options?: Object): Promise<Uint8Array>;
    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    remove(key: string, options?: Object): Promise<boolean>;
}

export default Adapter