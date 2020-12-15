import assert from "assert";
import {CloudStorage, MemoryAdapter, PrivateKey} from "../../lib";

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
});
