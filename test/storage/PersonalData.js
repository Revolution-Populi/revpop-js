import assert from "assert";
import {PersonalData} from "../../lib";

describe("PersonalData", () => {

    afterEach(function() {
    });

    describe("Setters", function() {
        let pd1 = new PersonalData();
        it ("Instantiates with default values", function() {
            assert.strictEqual(pd1.dto.length, 4);
        });

        it ("Check setters", function() {
            assert.strictEqual(pd1.setFirstName('John'), true);
            assert.strictEqual(pd1.setLastName('Doe'), true);
            pd1.setName('First', 'Last', '', 'Mr'); // don't check all return valuse, so don't returns value
            assert.strictEqual(pd1.setFirstName('James'), true);
            assert.strictEqual(pd1.setLastName('Bond'), true);
            assert.strictEqual(pd1.setEmail('bond@mi5.gov.uk'), true);
            assert.strictEqual(pd1.setPhone('+44123456789'), true);
            assert.strictEqual(pd1.setPhoto(PersonalData.makeReference('url', 'image/png', 'hash', 'storage_data')), true);
            assert.strictEqual(pd1.setPhoto(PersonalData.makeReference('url2', 'image/png', 'hash', 'storage_data')), true);
            // set photo value (object) that is equal to current - should fail
            assert.strictEqual(pd1.setPhoto(PersonalData.makeReference('url2', 'image/png', 'hash', 'storage_data')), false);
            assert.strictEqual(pd1.setFirstName(), false); // set undefined first name value - should fail
            assert.strictEqual(pd1.setFirstName(2), false); // set first name value of wrong type - should fail
            assert.strictEqual(pd1.setPhone('+44123456789'), false); // set phone value that is equal to current - should fail
        });

        it ("Check getters", function() {
            // check getters and also check as previous test set field values
            assert.strictEqual(pd1.getFirstName(), 'James');
            assert.strictEqual(pd1.getLastName(), 'Bond');
            assert.strictEqual(pd1.getMiddleName(), '');
            assert.strictEqual(pd1.getNameTitle(), 'Mr');
            assert.strictEqual(pd1.getEmail(), 'bond@mi5.gov.uk');
            assert.strictEqual(pd1.getPhone(), '+44123456789');
            assert.deepStrictEqual(pd1.getPhoto(), PersonalData.makeReference('url2', 'image/png', 'hash', 'storage_data'));
        });

        it ("Serialization / deserialization", function() {
            const pd1_hash = pd1.getRootHash();
            const serialized = pd1.stringify();
            let pd2 = new PersonalData();
            pd2.parse(serialized);
            // serialized and deserialized object should have same data and hash
            assert.strictEqual(pd2.getFirstName(), 'James');
            assert.strictEqual(pd2.getLastName(), 'Bond');
            assert.strictEqual(pd2.getMiddleName(), '');
            assert.strictEqual(pd2.getNameTitle(), 'Mr');
            assert.strictEqual(pd2.getEmail(), 'bond@mi5.gov.uk');
            assert.strictEqual(pd2.getPhone(), '+44123456789');            
            assert.strictEqual(pd2.getRootHash(), pd1_hash);
        });

        it ("Check partial data", function() {
            // make partial and also ask for unknown field - it should be ignored
            const partial = pd1.makePartial([ 'name', 'email', 'address' ]);
            // this fields should be undefined
            assert.strictEqual(partial.getPhone(), undefined);
            assert.strictEqual(partial.getPhoto(), undefined);
            // but root hash should remain the same
            assert.equal(pd1.getRootHash(), partial.getRootHash());
            const partial_serialized = partial.stringify();
            const partial_deserialized = new PersonalData();
            partial_deserialized.parse(partial_serialized);
            // deserialized partial object should remain the same
            // this fields should be undefined
            assert.strictEqual(partial_deserialized.getPhone(), undefined);
            assert.strictEqual(partial_deserialized.getPhoto(), undefined);
            // but root hash should remain the same
            assert.equal(pd1.getRootHash(), partial_deserialized.getRootHash());
        });

        it ("Check unknown fields (next version imitation)", function() {
            const pd1_hash = pd1.getRootHash();
            // Add new field address and subfield 'Third' to field 'name'
            pd1.dto[0].val.third = 'Third';
            pd1.dto.push({ val: { index: 12345, city: 'London', country: 'England', address: 'Some address' }, salt: 'XfeMKvRoCoE=' });
            // after adding unknown fields hash changed - they calculated also
            assert.notStrictEqual(pd1.getRootHash(), pd1_hash);
            const serialized = pd1.stringify();
            let pd2 = new PersonalData();
            pd2.parse(serialized);
            // after serialization/deserialization with unknown fields hash not changed - they serialized also
            assert.strictEqual(pd2.getRootHash(), pd1.getRootHash());            
        });

        it ("Check lack of fields (previous version imitation)", function() {
            let pd2 = new PersonalData();
            pd2.setDTO([
                { val: {first: '', last: '', middle: '', title: ''}, salt: 'H2ydYDNhQo0=' },
                { val: '', salt: 'H2ydYDNhQo0=' }
            ]);
            // at this moment fields 'phone' and 'photo' does not exists in the pd2
            assert.strictEqual(pd2.getPhone(), undefined);
            assert.strictEqual(pd2.getPhoto(), undefined);
            // now object upgraded as we set undefined but known field
            // personal data version setup to current version
            // and all undefined fields add and set to default values
            pd2.setPhone('+44123456789');
            // now 'phone' has value that was just set
            assert.strictEqual(pd2.getPhone(), '+44123456789');
            // and 'photo' also exists and set to default value 
            assert.deepStrictEqual(pd2.getPhoto(), PersonalData.makeReference('', '', '', ''));
        });
    });
});
