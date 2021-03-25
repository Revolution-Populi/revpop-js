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
 import {sha256} from "../../ecc/src/hash";
 
 /**
  * Memory client adapter for CloudStorage class.
  * Implemented for testing purposes.
  */
class MemoryAdapter extends Adapter {
    /**
     * @param {*} options required options: {}
     */
    constructor(options = {}) {
        super(options);
        this.memory = {};
    }

    /**
     * Store the passed value
     *
     * @param {string|Buffer} val
     * @param {Object} options
     * @returns {Promise<String>}
     */
    async put(val, options = {}) {
        const id = sha256(val, 'hex');
        this.memory[id] = val;

        return id;
    }

    /**
     * Retrieve the value for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<Buffer>}
     */
    async get(key, options = {}) {
        return this.memory[key];
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
            delete this.memory[key];
            resolve();
        });
    }
}

export default MemoryAdapter;
 