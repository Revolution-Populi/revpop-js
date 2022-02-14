export declare class Adapter {
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

export declare class GoogleDriveAdapter implements Adapter {
    constructor(options?: any);
    folder: any;
    drive: any;

    close(): Promise<void>;

    open(): Promise<void>;

    /**
     * Store the passed value
     *
     * @param {string|Buffer} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    put(val: Uint8Array, options?: Object): Promise<string>;

    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Buffer>}
     */
    get(key: string, options?: Object): Promise<Buffer>;

    remove(key: string, options?: Object): Promise<boolean>;
}