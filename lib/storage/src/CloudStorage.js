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
