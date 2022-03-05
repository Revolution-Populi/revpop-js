import {CloudStorage, PrivateKey} from "../../lib";
import MemoryAdapter from "../../lib/storage/src/MemoryAdapter";
import assert from "assert";
import secureRandom from "secure-random";

describe("CloudStorage", () => {

    const pk = PrivateKey.fromWif('5KXbCDyCPL3eGX6xX5uJHVwoAYheF7L5fKf67oQocgJA8kNvVHF');
    const pk2 = PrivateKey.fromWif('5JbUcrw6SawrNBFADoSvHX8mxGgWgWaywEwEeV4gaktbcwUHCB2');

    afterEach(function() {
    });

    describe("crypto_load_buffer", function() {
        it ("correct load previously saved content using the same key", async function() {
            const storage = new CloudStorage(new MemoryAdapter());
            const test_data = Buffer.from('test data for a single key');
            const id = await storage.crypto_save_buffer(test_data, pk, pk.toPublicKey());
            const load_data = await storage.crypto_load_buffer(id, pk.toPublicKey(), pk);
            assert.notStrictEqual(load_data, test_data);
        });

        it ("correct load previously saved content using two keys", async function() {
            const storage = new CloudStorage(new MemoryAdapter());
            const test_data = Buffer.from('test data for different keys');
            const id = await storage.crypto_save_buffer(test_data, pk, pk2.toPublicKey());
            const load_data = await storage.crypto_load_buffer(id, pk.toPublicKey(), pk2);
            assert.notStrictEqual(load_data, test_data);
        });
    });

    describe("crypto_load_buffer", function() {
        it ("correct load previously saved content using the symmetric key", async function() {
            const storage = new CloudStorage(new MemoryAdapter());
            const test_data = Buffer.from('test data for a single key');
            const symmetric_key = secureRandom.randomBuffer(32).toString('hex');
            const content_key = {algo: 'aes-256-cbc', key: symmetric_key, iv: secureRandom.randomBuffer(16).toString('hex')};
            const id = await storage.crypto_save_content(test_data, content_key);
            const load_data = await storage.crypto_load_content(id, content_key);
            assert.notStrictEqual(load_data, null);
            assert.strictEqual(load_data.toString('hex'), test_data.toString('hex'));
        });
    });
});
