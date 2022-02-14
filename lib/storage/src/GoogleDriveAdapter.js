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

import {Readable} from "stream"
import Adapter from "./Adapter";

/**
 * Google Drive client adapter for CloudStorage class.
 */
export default class GoogleDriveAdapter extends Adapter {
    GD_VERSION = "1.0"

    constructor(options = {}) {
        super();
        this.folder = options.folder;

        if (options.auth === undefined) {
            throw new Error("Undefined expecting param - options.auth (oAuth2Client - initialized OAuth2 object)");
        }

        const {drive} = require('@googleapis/drive/v3');
        const auth = options.auth;
        this.drive = drive({version: 'v3', auth});
    }

    /**
     * Store the passed value
     *
     * @param {string|Buffer} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    async put(val, options = {}) {
        try {
            var folder_id = await this.searchFolder(this.drive, this.folder);
            if (folder_id.length === 0)
                folder_id = await createFolder(this.drive, this.folder);

            const file = await uploadToFolder(this.drive, val, folder_id);
            await shareFile(this.drive, file.data.id);

            const webContentLink = await this.drive.files.get({
                fileId: file.data.id,
                fields: 'webContentLink'
            }).then(response => response.data.webContentLink);

            // console.log('Link to download: ', webContentLink);
            const ret = {
                url: webContentLink,
                storage_data: "[\"GD\",\"" + `${this.GD_VERSION}` + "\",\"" + `${file.data.id}` + "\"]"
            };
            return ret;

        } catch (err) {
            console.log('Google Drive file upload error: ', err);
            return "";
        }
    }

    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Buffer>}
     */
    async get(key, options = {}) {
        return await downloadFile(this.drive, key);
    }

    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    async remove(key, options = {}) {
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
            }, (err, res) => {
                if (err) {
                    // Handle error
                    console.error(err);
                    reject(err);
                } else {
                    if (res.data.files.length > 0) {
                        // console.log('Found folder: ', res.data.files[0].name, res.data.files[0].id);
                        resolve(res.data.files[0].id);
                    } else
                        resolve("");
                }
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
            }, (err, file) => {
                if (err) {
                    // Handle error
                    console.error(err);
                    reject(err);
                } else {
                    // console.log('File Id: ', file.data.id);
                    resolve(file);
                }
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
