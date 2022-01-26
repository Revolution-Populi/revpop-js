/**
 * The Revolution Populi Project
 * Copyright (C) 2022 Revolution Populi Limited
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

import secureRandom from "secure-random";
import { hash, Signature } from '../../ecc';

var clone=(function(t,s,c){for(c=0;c<t.length;)t[c++]=s.call(new t[c++]());return c=function(o,h,i,r,x){h=h||[];if(o&&typeof o=="object"){for(i=0;i<h.length;i++)if(h[i]===o)return h[i+1];r={};x=s.call(o);for(i=0;i<t.length;i+=2)if(t[i]==x)r=i?new t[i+1](o):[];h.push(o,r);for(i in o)if(h.hasOwnProperty.call(o,i))r[i]=c(o[i],h)}return r||o}})([,Array,,Date,,Number,,String,,Boolean],({}).toString);
var makeSalt=(function(){return secureRandom.randomBuffer(8).toString('base64');});
const currentVer = 1;

// DTO structure

// {
//  ver: 1,
//  dto: [
//     { val: {first: 'James', last: 'Bond', middle: '', title: 'Mr'}, salt: 'wfwbBbaFGUI='},
//     { val: 'bond@mi5.gov.uk', salt: 'BQGTnGIQum4=' },
//     { val: '+44123456789',    salt: 'q3o24fsLblE=' },
//     { val: { url: 'url', type: 'image/png', hash: 'hash', storage_data: 'storage_data' }, salt: 'Rm4vmhbJhmY=' }
// ]}

const fields = [ 'name',  'email',  'phone',  'photo' ];

class PersonalData {
    constructor() {
        this.dto = PersonalData._makeEmptyDto();
        this.ver = currentVer;
    }

    getVer() {
        return this.ver;
    }    

    getDTO() {
        return this.dto;
    }

    setDTO(dto) {
        this.dto = dto;
    }

    stringify() {
        return `{"ver":${this.ver},"dto":` + JSON.stringify(this.dto) + '}';
    }

    parse(pd_str) {
        const pd = JSON.parse(pd_str);
        this.ver = pd.ver;
        this.setDTO(pd.dto);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create personal data part
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    static makeReference(url, type, hash, storageData) {
        return {
            url: url || '',
            type: type || '',
            hash: hash || '',
            storage_data: storageData || '',
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Setters for known parts of the personal data.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    setName(first_name, last_name, middle_name, name_title) {
        this.setFirstName(first_name);
        this.setLastName(last_name);
        this.setMiddleName(middle_name);
        this.setNameTitle(name_title);
    }

    setFirstName(first_name) {
        return this._setTypedValue('name', 'string', first_name, 'first');
    }

    setLastName(last_name) {
        return this._setTypedValue('name', 'string', last_name, 'last');
    }

    setMiddleName(middle_name) {
        return this._setTypedValue('name', 'string', middle_name, 'middle');
    }

    setNameTitle(name_title) {
        return this._setTypedValue('name', 'string', name_title, 'title');
    }

    setEmail(email) {
        return this._setTypedValue('email', 'string', email)
    }

    setPhone(phone) {
        return this._setTypedValue('phone', 'string', phone)
    }

    setPhoto(photo) {
        return this._setTypedValue('photo', 'object', photo)
    }

    _setTypedValue(fieldName, type, value, partName) {
        if (typeof value != type)
            return false;

        const fieldIndex = fields.indexOf(fieldName);
        this._checkAndUpgradeDtoIfNeeded(fieldIndex);
        if (this._getStringifiedVal(partName === undefined ? this.dto[fieldIndex].val : this.dto[fieldIndex].val[partName])
         != this._getStringifiedVal(value)) {
            if (partName === undefined)
                this.dto[fieldIndex].val = value;
            else
                this.dto[fieldIndex].val[partName] = value;
            this.dto[fieldIndex].salt = makeSalt();
            return true;
        }
        return false;
    }

    _checkAndUpgradeDtoIfNeeded(fieldIndex) {
        if (this.dto.length <= fieldIndex) {
            this.version = currentVer;
            const emptyDto = PersonalData._makeEmptyDto();
            for (let i = this.dto.length ; i < fields.length; i++) {
                this.dto.push(emptyDto[i]);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Getters for known parts of the personal data.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getFirstName() {
        return this._getFieldVal('name', 'first');
    }

    getLastName() {
        return this._getFieldVal('name', 'last');
    }

    getMiddleName() {
        return this._getFieldVal('name', 'middle');
    }

    getNameTitle() {
        return this._getFieldVal('name', 'title');
    }

    getEmail() {
        return this._getFieldVal('email');
    }

    getPhone() {
        return this._getFieldVal('phone');
    }

    getPhoto() {
        return this._getFieldVal('photo');
    }

    _getFieldVal(fieldName, partName) {
        const fieldIndex = fields.indexOf(fieldName);
        if (fieldIndex == -1 ||
            this.dto[fieldIndex] === undefined ||
            this.dto[fieldIndex].val === undefined) {
            return undefined;
        }
        return partName === undefined ? this.dto[fieldIndex].val : this.dto[fieldIndex].val[partName];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Compute hash of personal data
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getRootHash() {
        let hashes = [];
        for (const field of this.dto) {
            hashes.push(this._getFieldHash(field));
        }

        let currentNumberOfHashes = hashes.length;
        while (currentNumberOfHashes > 1) {
            // hash ID's in pairs
            const i_max = currentNumberOfHashes - (currentNumberOfHashes & 1);
            let k = 0;

            for (let i = 0; i < i_max; i += 2)
                hashes[k++] = this._computeSha256(`${hashes[i]}:${hashes[i + 1]}`);

            if (currentNumberOfHashes & 1)
                hashes[k++] = hashes[i_max];
            currentNumberOfHashes = k;
        }

        return hashes[0];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create partial personal data object, that has same hash
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    makePartial(limited_parts) {
        const partial = new PersonalData();
        partial.dto = clone(this.dto);

        for (let i = 0; i < partial.dto.length; i++) {
            if (i >= fields.length || !limited_parts.includes(fields[i])) {
                let field = partial.dto[i];
                field.hash = this._getFieldHash(field);
                field.val = undefined;
                field.salt = undefined;
            }
        }

        return partial;
    }

    _getFieldHash(field) {
        if (field.hash !== undefined)
            return field.hash;
        else
            return this._computeSha256(`${field.salt}:${this._getStringifiedVal(field.val)}`);        
    }

    _getStringifiedVal(val) {
        if (typeof val === 'object')
            return JSON.stringify(this._deepSortObjKeys(val));
        else
            return JSON.stringify(val);
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Compute SHA256 hash of string
    // Return hex lowercase representation of hash
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    _computeSha256(str) {
        const buf = Buffer.from(str.toString(), 'utf-8');
        const ret = hash.sha256(buf).toString('hex');
        return ret;
    }    

    static _makeEmptyDto() {
        return [
            { val: {first: '', last: '', middle: '', title: ''}, salt: makeSalt() },
            { val: '', salt: makeSalt() },
            { val: '', salt: makeSalt() },
            { val: PersonalData.makeReference(), salt: makeSalt() }
        ];
    }

}

export default PersonalData;
