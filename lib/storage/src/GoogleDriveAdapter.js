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

import Adapter from "./Adapter";
const { google } = require('googleapis');
const async = require('async');
const { Readable } = require("stream")
const GD_VERSION = "1.0"

/**
 * IPFS client adapter for CloudStorage class.
 */
class GoogleDriveAdapter extends Adapter {
  /**
   * @param {*} options required options: {}
   */
  constructor(options = {}) {
    super(options);
    this.folder = options.folder;
    const auth = options.auth;
    this.drive = google.drive({ version: 'v3', auth });
  }

  /**
   * Store the passed value
   *
   * @param {string|Buffer} val
   * @param {Object} options
   * @returns {Promise<String>}
   */
  async put(val, options = {}) {
    var folder_id = await searchFolder(this.drive, this.folder);
    if (folder_id.length == 0) {
      folder_id = await createFolder(this.drive, this.folder);
      if (folder_id.length == 0) 
        return "";
  }

    const file = await uploadToFolder(this.drive, val, folder_id);
    const ids = await shareFile(this.drive, file.data.id);

    const webViewLink = await this.drive.files.get({
      fileId: file.data.id,
      fields: 'webViewLink'
    }).then(response =>
      response.data.webViewLink
    );
    // console.log('Link to download: ', webViewLink);
    const ret = {url: webViewLink, storage_data: "[\"GD\",\"" + `${GD_VERSION}` + "\",\"" + `${file.data.id}` + "\"]"};
    return ret;
  }

  /**
   * Retrieve the value for the passed key
   *
   * @param {String} key
   * @param {Object} options
   * @returns {Promise<Buffer>}
   */
  async get(key, options = {}) {
    const chunks = [];
    for await (const chunk of this.client.cat(key)) {
      chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  /**
   * Remove the record for the passed key
   *
   * @param {String} key
   * @param {Object} options
   * @returns {Promise<boolean>}
   */
  async delete(key, options = {}) {
    return new Promise((resolve, reject) => {
      reject('GoogleDriveAdapter doesn\'t implement delete function');
    });
  }
}

/**
 * Searches for a folder in Drive.
 * @return {Promise} A promise to return folder id.
 */
 async function searchFolder(googleDrive, folderName) {
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
 * @return {Promise} A promise to return the folder ID.
 */
async function createFolder(googleDrive, folderName) {
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
  });
}

/**
 * Upload a file to a Google Drive folder.
 * @param {string} folderId The folder ID.
 * @return {Promise} A promise to return a Google Drive file.
 */
async function uploadToFolder(googleDrive, val, folderId) {
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
 * @param {string} realFileId The file ID.
 * @param {string} realUser The user ID.
 * @param {string} realDomain The domain of the new permission.
 * @return {Promise} A promise to return the permission IDs.
 */
async function shareFile(googleDrive, fileId) {
  return new Promise((resolve, reject) => {
    let ids = [];
    const permissions = [{
      type: 'anyone',
      role: 'reader',
    }];
    // Using the NPM module 'async'
    async.eachSeries(permissions, (permission, permissionCallback) => {
      googleDrive.permissions.create({
        resource: permission,
        fileId: fileId,
        fields: 'id',
      }, (err, res) => {
        if (err) {
          // Handle error...
          console.error(err);
          permissionCallback(err);
        } else {
          // console.log('Permission ID: ', res.data.id);
          ids.push(res.id);
          permissionCallback();
        }
      });
    }, (err) => {
      if (err) {
        // Handle error
        console.error(err);
        reject(err);
      } else {
        // All permissions inserted
        resolve(ids);
      }
    });
  });
}


export default GoogleDriveAdapter;
