import {AfterAll, Before, BeforeAll} from "@cucumber/cucumber";
import {StorageWorld} from "../world";

Before({tags: "@ignore"}, async function() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return "skipped" as any;
});

Before({tags: "@debug"}, async function(this: StorageWorld) {

});

BeforeAll(async function() {
    // eslint-disable-next-line no-console
    console.log("Before All");
});

AfterAll(async function() {
    // eslint-disable-next-line no-console
    console.log("After All");
});
