/**
 * The Revolution Populi Project
 * Copyright (C) 2020 Revolution Populi Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import fs from "fs";
import readline from "readline";
import {auth} from '@googleapis/drive';
import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";
import {Credentials} from "google-auth-library/build/src/auth/credentials";
import "colors"
import GoogleDriveAdapter from "./GoogleDriveAdapter";

export interface NodeCredentials {
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

/**
 * Google Drive client adapter for CloudStorage class.
 */
class GoogleDriveAdapterFactory {
    public async create(credentials: NodeCredentials, tokenPath: string): Promise<GoogleDriveAdapter> {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        try {
            const token: Buffer = fs.readFileSync(tokenPath);
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
        } catch (err) {
            const tokens = await this.getAccessToken(oAuth2Client);

            try {
                fs.writeFileSync(tokenPath, JSON.stringify(tokens));
            } catch (error) {
                throw('An error occurred while saving token.');
            }
        }

        return new GoogleDriveAdapter({ auth: oAuth2Client, folder: "revpop" })
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

export default GoogleDriveAdapterFactory;
