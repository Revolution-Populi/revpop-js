import "colors";
import CloudStorage from "./CloudStorage";
import GoogleDriveWebAdapter from "./GoogleDriveWebAdapter";
import {StorageConnectionGoogleDriveWeb} from "../index";

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
