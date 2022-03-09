import {
    StorageConnection, StorageConnectionAmazonS3Node, StorageConnectionAmazonS3Web,
    StorageConnectionGoogleDriveNode,
    StorageConnectionGoogleDriveWeb,
    StorageConnectionIpfs
} from "../../lib/storage";
import {AdapterType} from "../../lib/storage/src/AdapterType";
import os from "os";

const ipfs: StorageConnectionIpfs = {
    host: "localhost",
    port: 5001,
    protocol: "http"
}

const googleDriveNode: StorageConnectionGoogleDriveNode = {
    tokenPath: `${os.tmpdir()}/google_token.json`,
    installed: {
        client_id: "000000000000-here-should-be-real-client-id.apps.googleusercontent.com",
        project_id: "real-project-id-000000",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_secret: "real-client-secret",
        redirect_uris: [
            "urn:ietf:wg:oauth:2.0:oob",
            "http://localhost"
        ]
    }
}

const googleDriveWeb: StorageConnectionGoogleDriveWeb = {
    apiKey: 'fake_api_key',
    clientId: 'fake_client_id',
}

const amazonS3Node: StorageConnectionAmazonS3Node = {
    region: 'fake_region',
    access_key_id: 'fake_access_key_id',
    secret_access_key: 'fake_secret_access_key',
    bucket: 'bucket'
}

const amazonS3Web: StorageConnectionAmazonS3Web = {
    region: 'fake_region',
    identity_pool_id: 'fake_identity_pool_id',
    bucket: 'bucket'
}

export function getCredentials(type: AdapterType): StorageConnection {
    switch (type) {
        case AdapterType.IPFS:
            return ipfs;
        case AdapterType.GOOGLE_DRIVE_NODE:
            return googleDriveNode;
        case AdapterType.GOOGLE_DRIVE_WEB:
            return googleDriveWeb;
        case AdapterType.AMAZON_S3_NODE:
            return amazonS3Node;
        case AdapterType.AMAZON_S3_WEB:
            return amazonS3Web;
    }

    throw new Error(`Invalid AdapterType: ${AdapterType}`)
}
