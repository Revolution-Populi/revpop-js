import Adapter from "./Adapter";
import {Readable} from "stream";
import {drive} from "@googleapis/drive";

const GD_VERSION = "1.0"

/**
 * Google Drive client adapter for CloudStorage class.
 */
export default class GoogleDriveNodeAdapter extends Adapter {
    constructor(auth, folder) {
        super();

        this.folder = folder;
        this.drive = drive({version: 'v3', auth});
    }

    close() {
        return Promise.resolve(undefined);
    }

    open() {
        return Promise.resolve(undefined);
    }

    async put(val) {
        let folder_id = await this.searchFolder(this.drive, this.folder);

        if (!folder_id) {
            try {
                folder_id = await this.createFolder(this.drive, this.folder);
            } catch (err) {
                console.log('Google Drive folder creation error: ', err);
                return null;
            }
        }

        let file;
        try {
            file = await this.uploadToFolder(this.drive, val, folder_id);
        }  catch (err) {
            console.log('Google Drive file upload error: ', err);
            return null;
        }

        let webContentLink;
        try {
            await this.shareFile(this.drive, file.data.id);

            webContentLink = await this.drive.files.get({
                fileId: file.data.id,
                fields: 'webContentLink'
            }).then(response => response.data.webContentLink);
        } catch (err) {
            console.log('Google Drive share file error: ', err);
            return null;
        }

        const ret = {
            url: webContentLink,
            storage_data: "[\"GD\",\"" + `${GD_VERSION}` + "\",\"" + `${file.data.id}` + "\"]"
        }
        return ret;
    }

    async get(key) {
        return await this.downloadFile(this.drive, key);
    }

    async remove(key) {
        try {
            await this.drive.files.delete({fileId: key});
            return true;
        } catch (err) {
            console.log('Google Drive file deleting error: ', err);
            return false;
        }
    }

    /**
     * Searches for a folder in Drive.
     * @param {Object} googleDrive Initialized google.drive object with auth.
     * @param {string} folderName folder name to search in user Google Drive
     * @return {Promise} A promise to return folder id.
     */
    async searchFolder(googleDrive, folderName) {
        return new Promise((resolve, reject) => {
            googleDrive.files.list({
                q: `mimeType='application/vnd.google-apps.folder' and name = '${folderName}'`,
                fields: 'files(id, name)',
                spaces: 'drive',
            }).then(response => {
                const files = response.result.files;
                if (files.length > 0) {
                    resolve(files[0].id);
                } else {
                    resolve(null);
                }
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    /**
     * Creates a Drive folder.
     * @param {Object} googleDrive Initialized google.drive object with auth.
     * @param {string} folderName folder name to create in user Google Drive
     * @return {Promise} A promise to return the folder ID.
     */
    async createFolder(googleDrive, folderName) {
        return new Promise((resolve, reject) => {
            googleDrive.files.create({
                resource: {
                    name: `${folderName}`,
                    mimeType: 'application/vnd.google-apps.folder',
                },
                fields: 'id',
            }, (err, file) => {
                if (err) {
                    // Handle error
                    console.error(err);
                    reject(err);
                } else {
                    // console.log('Folder Id: ', file.data.id);
                    resolve(file.data.id);
                }
            });
        })
    }

    /**
     * Upload a buffer to a file to a Google Drive folder.
     * File name would be creation date/time like 2021-12-03T08:35:30.455Z
     * @param {Object} googleDrive Initialized google.drive object with auth.
     * @param {string|Buffer} val buffer to write
     * @param {string} folderId The folder ID.
     * @return {Promise} A promise to return a Google Drive file.
     */
    async uploadToFolder(googleDrive, val, folderId) {
        return new Promise((resolve, reject) => {
            const readable = Readable.from(val);
            const resource = {
                name: new Date().toISOString(),
                parents: [folderId],
            };
            const media = {
                body: readable,
            };
            googleDrive.files.create({
                resource,
                media,
                fields: 'id',
            }).then(file => {
                resolve(file);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Shares a file to anyone who has link.
     * @param {Object} googleDrive Initialized google.drive object with auth.
     * @param {string} fileId The file ID.
     * @return {Promise} A promise to return the permission IDs.
     */
    async shareFile(googleDrive, fileId) {
        return new Promise((resolve, reject) => {
            let ids = [];
            const permissions = {
                type: 'anyone',
                role: 'reader',
            };
            googleDrive.permissions.create({
                resource: permissions,
                fileId: fileId,
                fields: 'id',
            }, (err, res) => {
                if (err) {
                    // Handle error...
                    console.error(err);
                    reject(err);
                } else {
                    // console.log('Permission ID: ', res.id);
                    resolve(res.id)
                }
            });
        });
    }

    /**
     * Downloads a file and returns the contents in a Promise.
     * @param {Object} googleDrive Initialized google.drive object with auth.
     * @param {string} fileId A Drive file ID.
     * @return {Promise} A promise to return the Drive file as a string.
     */
    async downloadFile(googleDrive, fileId) {
        return googleDrive.files
            .get({fileId, alt: 'media'}, {responseType: 'stream'})
            .then(res => {
                return new Promise((resolve, reject) => {
                    const buffers = [];
                    res.data
                        .on('end', () => {
                            console.log('Done downloading file.');
                            resolve(Buffer.concat(buffers));
                        })
                        .on('error', err => {
                            console.error('Error downloading file.');
                            resolve(null);
                        })
                        .on('data', chunk => {
                            buffers.push(chunk);
                        })
                });
            });
    }
}
