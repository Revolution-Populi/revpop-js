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

import "colors";
import {CloudStorage, StorageConnectionGoogleDriveWeb} from "../../index";
import GoogleDriveWebAdapter from "./GoogleDriveWebAdapter";

/**
 * TODO:complete this factory
 */
export default class GoogleDriveWebStorageFactory {
    credentials: StorageConnectionGoogleDriveWeb

    public async create(credentials: StorageConnectionGoogleDriveWeb): Promise<CloudStorage> {
        await new Promise((resolve) => {
            gapi.load('client:auth2', resolve);
        });
        await gapi.client.init({
            apiKey: credentials.apiKey,
            clientId: credentials.clientId,
            scope: 'https://www.googleapis.com/auth/drive.file',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        })

        const googleAuth = gapi.auth2.getAuthInstance();
        if (!googleAuth.isSignedIn.get()) {
            await googleAuth.signIn()
        }

        return new CloudStorage(new GoogleDriveWebAdapter(googleAuth, 'revpop'));
    }

    // private async authenticate {
    //     const { gapi } = window;
    //     try {
    //         await gapi.auth2.init({ clientId });
    //         console.log('authenticated');
    //     } catch (error) {
    //         throw Error(`Error authenticating gapi client: ${error}`);
    //     }
    // };
}