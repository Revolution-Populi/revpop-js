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

import { randomBytes } from 'crypto';
import { hash, Signature } from '../../ecc';

class PersonalData {
    constructor() {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // List of personal data parts
        // Personal data can be shared only by parts
        // Each part specified by fields path inside of whole personal data
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        this.PERSONAL_DATA_PART_PATHS = [
            'name',
            'email',
            'phone',
            'photo',
        ].sort();

        this.full_structure = this._defaultValue();
        this.enabled_parts = this.PERSONAL_DATA_PART_PATHS;
        this.salts = {};
        this.missings = {};
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Return a new PersonalData object from the result of PersonalData.getAllParts.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    static fromAllParts(data) {
        const inst = new PersonalData();
        inst.full_structure = JSON.parse(JSON.stringify(data.content));
        inst.enabled_parts = [];
        inst.salts = {};
        inst.missings = {};
        inst.PERSONAL_DATA_PART_PATHS.forEach(part_path => {
            const part = data.parts.find(obj => obj.path === part_path);
            if (typeof part !== 'undefined') {
                inst.enabled_parts.push(part_path);
                inst.salts[part_path] = part.salt;
            }
            const missed_part = data.missed_parts.find(obj => obj.path === part_path);
            if (typeof missed_part !== 'undefined') {
                inst.enabled_parts.push(part_path);
                inst.missings[part_path] = missed_part.hash;
            }
        });

        return inst;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create personal data part
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    static makeReference(url, type, hash) {
        return {
            url: url || '',
            type: type || '',
            hash: hash || '',
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Update PD fields from a flat object. Missing fields will be overwriten with default values.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    assign(props) {
        this.setName(props.first_name, props.last_name);
        this.setEmail(props.email);
        this.setPhone(props.phone);
        this.setPhoto(props.photo);
    }

    setName(first_name, last_name) {
        this.full_structure.name.first = first_name || '';
        this.full_structure.name.last = last_name || '';
    }

    setEmail(email) {
        this.full_structure.email = email || '';
    }

    setPhone(phone) {
        this.full_structure.phone = phone || '';
    }

    setPhoto(photo) {
        this.full_structure.photo = photo || null;
    }

    getPhoto() {
        return this.full_structure.photo;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create full personal data from its content
    // Return personal data structure
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getAllParts() {
        const content = this._deepSortObjKeys(this.full_structure);
        const res = {
            content: {},
            parts: [],
            missed_parts: []
        };
        this.enabled_parts.forEach(part_path => {
            const missed_hash = this._getMissed(part_path);
            if (typeof missed_hash !== 'undefined') {
                res.missed_parts.push({
                    path: part_path,
                    hash: missed_hash
                });
            } else {
                let part_content = this._getObjPart(content, part_path);
                if (part_content === undefined) {
                    part_content = null;
                }
                this._putObjPart(res.content, part_path, part_content);
                res.parts.push({
                    path: part_path,
                    salt: this._getSalt(part_path)
                });
            }
        });
        return res;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Compute hash of personal data
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getRootHash() {
        const pd = this.getAllParts();
        const all_parts = pd.parts.concat(pd.missed_parts).sort((a, b) => a.path.localeCompare(b.path));
        return this._computeSha256(all_parts.map(part => {
            return part.salt ?
                this._computeSha256(`${part.salt}:${JSON.stringify(this._getObjPart(pd.content, part.path))}`) :
                part.hash;
        }).join());
    }

    makePartial(limited_parts) {
        const inst = new PersonalData();
        inst.enabled_parts = this.enabled_parts;

        this.PERSONAL_DATA_PART_PATHS.forEach(part_path => {
            if (limited_parts.indexOf(part_path) >= 0) {
                inst.full_structure[part_path] = this._deepClone(this.full_structure[part_path]);
                inst.salts[part_path] = this._getSalt(part_path);
            } else {
                const miss = this._getMissed(part_path);
                if (typeof miss !== 'undefined') {
                    inst.missings[part_path] = miss;
                } else {
                    inst.missings[part_path] = this._computeHash(part_path);
                }
            }
        });
        // console.log('makePartial 1', this);
        // console.log('makePartial 2', inst);

        return inst;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Return new object with sorted keys/values pairs from input object (handle nested objects too)
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    _deepSortObjKeys(obj) {
        if (typeof(obj) !== 'object' || obj === null) {
            return obj;
        }
        const keys = Object.keys(obj).sort();
        let ret = {};
        for (const key of keys) {
            let val = obj[key];
            ret[key] = this._deepSortObjKeys(val);
        }
        return ret;
    }

    _defaultValue() {
        return {
            name: {
                first: '',
                last: '',
            },
            email: '',
            phone: '',
            photo: null,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Returns part of object with specified path
    // Path must contains period-delimited field names
    // For empty path returns input object
    // Returns undefined if path not found
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    _getObjPart(obj, part_path) {
        let ret = obj;
        if (part_path) {
            for (const elem of part_path.split('.')) {
                if (elem in ret) {
                    ret = ret[elem];
                } else {
                    ret = undefined;
                    break;
                }
            }
        }
        return ret;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Set part of object with specified path
    // Path must contains period-delimited field names
    // For empty path channges input object
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    _putObjPart(obj, part_path, part) {
        const part_path_elems = part_path ? part_path.split('.') : [];
        if (part_path_elems.length > 0) {
            let dst = obj;
            const prefix_elems = part_path_elems.slice(0, -1);
            for (const elem of prefix_elems) {
                if (elem in dst) {
                    dst = dst[elem];
                } else {
                    dst = dst[elem] = {};
                    break;
                }
            }
            const last_elem = part_path_elems[part_path_elems.length - 1];
            dst[last_elem] = part;
        } else {
            const old_keys = Object.keys(obj);
            for (const k of old_keys) {
                if (Object.prototype.hasOwnProperty.call(obj, k)) {
                    delete obj[k];
                }
            }
            const new_keys = Object.keys(part);
            for (const k of new_keys) {
                if (Object.prototype.hasOwnProperty.call(part, k)) {
                    obj[k] = part[k];
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Compute SHA256 hash of string
    // Return hex lowercase representation of hash
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    _computeSha256(str) {
        const buf = Buffer.from(str.toString(), 'utf-8');
        return hash.sha256(buf).toString('hex');
    }

    _getSalt(path) {
        if (typeof this.salts[path] === 'undefined') {
            this.salts[path] = randomBytes(8).toString('base64');
        }

        return this.salts[path];
    }

    _getMissed(path) {
        return this.missings[path];
    }

    _computeHash(path) {
        const salt = this._getSalt(path);
        const content = this._deepSortObjKeys(this._getObjPart(this.full_structure, path));
        return this._computeSha256(`${salt}:${JSON.stringify(content)}`);
    }

    _deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}

export default PersonalData;
