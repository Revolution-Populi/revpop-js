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

import Adapter from './Adapter';
import { encrypt_buffer, decrypt_buffer, encrypt_content, decrypt_content, encrypt_object, decrypt_object } from './crypto';

class CloudStorage {
    /**
     * 
     * @param {Adapter} adapter
     */
    constructor(adapter) {
        this.client = adapter;
    }

    async connect() {
        return this.client.open();
    }

    async disconnect() {
        return this.client.close();
    }

    async crypto_save_object(obj, subject_private_key, operator_public_key) {
        const crypto_str = encrypt_object(obj, subject_private_key, operator_public_key);
        return this.client.put(crypto_str);
    }

    async crypto_load_object(id, subject_public_key, operator_private_key) {
        const crypto_buf = await this.client.get(id);
        const crypto_str = crypto_buf.toString();
        return crypto_str ? decrypt_object(crypto_str, subject_public_key, operator_private_key) : null;
    }

    async crypto_save_buffer(buf, subject_private_key, operator_public_key) {
        const crypto_buf = encrypt_buffer(buf, subject_private_key, operator_public_key);
        return this.client.put(crypto_buf);
    }

    async crypto_load_buffer(id, subject_public_key, operator_private_key) {
        const crypto_buf = await this.client.get(id);
        return crypto_buf ? decrypt_buffer(crypto_buf, subject_public_key, operator_private_key) : null;
    }

    async crypto_save_content(content_buf, content_key) {
        const crypto_buf = encrypt_content(content_buf, content_key);
        return this.client.put(crypto_buf);
    }

    async crypto_load_content(id, content_key) {
        const crypto_buf = await this.client.get(id);
        return crypto_buf ? decrypt_content(crypto_buf, content_key) : null;
    }

    async del(id) {
        return this.client.delete(id);
    }
}

export default CloudStorage;
