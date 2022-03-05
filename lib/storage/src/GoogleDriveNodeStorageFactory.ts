import "colors";
import CloudStorage from "./CloudStorage";
import {Credentials} from "google-auth-library/build/src/auth/credentials";
import GoogleDriveNodeAdapter from "./GoogleDriveNodeAdapter";
import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";
import {StorageConnectionGoogleDriveNode} from "../../index";
import {auth} from "@googleapis/drive";
import fs from "fs";
import readline from "readline";

/**
 * Google Drive client adapter for CloudStorage class.
 */
export default class GoogleDriveNodeStorageFactory {
    public async create(credentials: StorageConnectionGoogleDriveNode, tokenPath: string): Promise<CloudStorage> {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        if (fs.existsSync(tokenPath)) {
            const token: Buffer = fs.readFileSync(tokenPath);
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
            return new CloudStorage(new GoogleDriveNodeAdapter(oAuth2Client, "revpop"));
        }

        const tokens = await this.getAccessToken(oAuth2Client);

        try {
            fs.writeFileSync(tokenPath, JSON.stringify(tokens));
        } catch (error) {
            throw('An error occurred while saving token.');
        }

        return new CloudStorage(new GoogleDriveNodeAdapter(oAuth2Client, "revpop"));
    }

    private async getAccessToken(oAuth2Client: OAuth2Client): Promise<Credentials> {
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/drive.file',
        });
        console.log('Authorize this app by visiting this url:'.green, authorizeUrl);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        process.stdout.write('Enter the code from that page here: '.green);

        let code;

        for await (const line of rl) {
            code = line;
            break;
        }

        if (undefined === code || !code.trim()) {
            throw('Empty code value.');
        }

        return (await oAuth2Client.getToken(code)).tokens;
    }
}
