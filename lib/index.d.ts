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

export declare class CloudStorage {
    constructor(adapter: Adapter);
    client: Adapter;
    connect(): Promise<any>;
    disconnect(): Promise<any>;
    crypto_save_object(obj: any, subject_private_key: any, operator_public_key: any): Promise<any>;
    crypto_load_object(id: any, subject_public_key: any, operator_private_key: any): Promise<any>;
    crypto_save_buffer(buf: any, subject_private_key: any, operator_public_key: any): Promise<any>;
    crypto_load_buffer(id: any, subject_public_key: any, operator_private_key: any): Promise<any>;
    crypto_save_content(content_buf: any, content_key: any): Promise<any>;
    crypto_load_content(id: any, content_key: any): Promise<any>;
    del(id: any): Promise<any>;
}