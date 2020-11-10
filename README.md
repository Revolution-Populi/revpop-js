# RevPopJS (revpopjs)

Pure JavaScript RevPop library for node.js and browsers. Can be used to construct, sign and broadcast transactions in JavaScript, and to easily obtain data from the blockchain via public apis.

## Setup

This library can be obtained through npm:

```
npm install @revolutionpopuli/revpopjs
```

## Usage

Three sub-libraries are included: `ECC`, `Chain` and `Serializer`. Generally only the `ECC` and `Chain` libraries need to be used directly.

### Chain

This library provides utility functions to handle blockchain state as well as a login class that can be used for simple login functionality using a specific key seed.

#### Login

The login class uses the following format for keys:

```
keySeed = accountName + role + password
```

Using this seed, private keys are generated for either the default roles `active, owner, memo`, or as specified. A minimum password length of 12 characters is enforced, but an even longer password is recommended. Three methods are provided:

```
generateKeys(account, password, [roles])
checkKeys(account, password, auths)
signTransaction(tr)
```

The auths object should contain the auth arrays from the account object. An example is this:

```
{
    active: [
        ["REV8S63oDiWRUUgrgvnVqpZbgcrmhNWsJ2EFbow1PtTPkfGagZkqT", 1]
    ]
}
```

If checkKeys is successful, you can use signTransaction to sign a TransactionBuilder transaction using the private keys for that account.

#### State container

The Chain library contains a complete state container called the ChainStore. The ChainStore will automatically configure the `set_subscribe_callback` and handle any incoming state changes appropriately. It uses Immutable.js for storing the state, so all objects are returned as immutable objects. It has its own `subscribe` method that can be used to register a callback that will be called whenever a state change happens.

The ChainStore has several useful methods to retrieve, among other things, objects, assets and accounts using either object ids or asset/account names. These methods are synchronous and will return `undefined` to indicate fetching in progress, and `null` to indicate that the object does not exist.

```
import {Apis} from "@revolutionpopuli/revpopjs-ws";
var {ChainStore} = require("revpopjs");

Apis.instance("wss://localhost", true).init_promise.then((res) => {
    console.log("connected to:", res[0].network);
    ChainStore.init().then(() => {
        ChainStore.subscribe(updateState);
    });
});

let dynamicGlobal = null;
function updateState(object) {
    dynamicGlobal = ChainStore.getObject("2.1.0");
    console.log("ChainStore object update\n", dynamicGlobal ? dynamicGlobal.toJS() : dynamicGlobal);
}
```

### ECC

The ECC library contains all the crypto functions for private and public keys as well as transaction creation/signing.

#### Private keys

As a quick example, here's how to generate a new private key from a seed (a brainkey for example):

```
var {PrivateKey, key} = require("revpopjs");

let seed = "THIS IS A TERRIBLE BRAINKEY SEED WORD SEQUENCE";
let pkey = PrivateKey.fromSeed( key.normalize_brainKey(seed) );

console.log("\nPrivate key:", pkey.toWif());
console.log("Public key :", pkey.toPublicKey().toString(), "\n");
```

#### Transactions

TODO transaction signing example

## ESDoc (beta)

```bash
npm i -g esdoc esdoc-es7-plugin
esdoc -c ./esdoc.json
open out/esdoc/index.html
```

## Binaries / Browserified bundles

Please have a [look here](https://github.com/Revolution-Populi/revpop-js/releases) to find your desired release.

If you want to build the binaries yourself you can clone this repository and run `npm install`. It will
create

-   Browserified version `build/revpopjs.js`
-   Browserified and minified (babel) version `build/revpopjs.min.js`
-   CommonJS version using wepback `build/revpopjs.cjs`

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
