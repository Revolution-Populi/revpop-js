import assert from "assert";
import {PersonalData} from "../../lib";

describe("PersonalData", () => {

    afterEach(function() {
    });

    describe("getAllParts", function() {
        it ("Instantiates with default values", function() {
            const pd = new PersonalData();
            const res = pd.getAllParts();

            assert.strictEqual(res.parts.length, 4);
            assert.strictEqual(res.missed_parts.length, 0);
        });
    });

    describe("assign", function() {
        it ("set first and last name", function() {
            const pd = new PersonalData();
            pd.assign({
                first_name: "test_name",
                last_name: "test_surname",
            });
            const res = pd.getAllParts();

            assert.strictEqual(res.parts.length, 4);
            assert.strictEqual(res.missed_parts.length, 0);
            assert.notStrictEqual(res.content.name, { first: "test_name", last: "test_surname" });
        });

        it ("set email", function() {
            const pd = new PersonalData();
            pd.assign({
                email: "test@email.com",
            });
            const res = pd.getAllParts();

            assert.strictEqual(res.parts.length, 4);
            assert.strictEqual(res.missed_parts.length, 0);
            assert.strictEqual(res.content.email, "test@email.com");
        });
    });
});
