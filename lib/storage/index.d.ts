import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";

export declare interface Adapter {
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * Store the passed value under the passed key
     *
     * @param {Uint8Array} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    put(val: Uint8Array, options?: any): Promise<PutResponse>;
    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Uint8Array>}
     */
    get(key: string, options?: any): Promise<Uint8Array>;
    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    remove(key: string, options?: any): Promise<boolean>;
}

declare class IPFSAdapter implements Adapter {
    close(): Promise<void>;

    open(): Promise<void>;

    /**
     * Store the passed value
     *
     * @param {string|Buffer} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    put(val: Uint8Array, options?: any): Promise<any>;
    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Buffer>}
     */
    get(key: string, options?: any): Promise<Buffer>;
    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    remove(key: string, options?: any): Promise<boolean>;
}

export declare class GoogleDriveNodeAdapter implements Adapter {
    folder: string;
    auth: OAuth2Client;

    constructor(auth: OAuth2Client, folder: string);

    close(): Promise<void>;

    open(): Promise<void>;

    /**
     * Store the passed value
     *
     * @param {string|Buffer} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    put(val: Uint8Array, options?: any): Promise<PutResponse>;

    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Buffer>}
     */
    get(key: string, options?: any): Promise<Buffer>;

    remove(key: string, options?: any): Promise<boolean>;
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

export declare class Storage {
    public id: string;
    public name: string;
    type: string;
    active: boolean;
    options: StorageConnection;
}

declare type StorageConnection = StorageConnectionIpfs | StorageConnectionGoogleDriveWeb |
    StorageConnectionGoogleDriveNode | StorageConnectionAmazonS3Web | StorageConnectionAmazonS3Node;

declare interface StorageConnectionIpfs {
    host: string;
    port: number;
    protocol: string;
    headers?: {
        authorization: string
    }
}

declare interface StorageConnectionGoogleDriveWeb {
    apiKey: string;
    clientId: string;
}

export interface StorageConnectionGoogleDriveNode {
    tokenPath: string,
    installed: {
        client_id: string,
        project_id: string,
        auth_uri: string,
        token_uri: string,
        auth_provider_x509_cert_url: string,
        client_secret: string,
        redirect_uris: Array<string>
    }
}

export interface StorageConnectionAmazonS3Web {
    region: string,
    identity_pool_id: string,
    bucket: string
}

export interface StorageConnectionAmazonS3Node {
    region: string,
    access_key_id: string,
    secret_access_key: string,
    bucket: string
}

export interface PutResponse {
    url: string,
    storage_data: string
}
