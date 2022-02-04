/* Serializer */
import Serializer from "./serializer/src/serializer";
import fp from "./serializer/src/FastParser";
import types from "./serializer/src/types";
import * as ops from "./serializer/src/operations";
import template from "./serializer/src/template";
import SerializerValidation from "./serializer/src/SerializerValidation";

export { Serializer, fp, types, ops, template, SerializerValidation };

/* ECC */
import Address from "./ecc/src/address";
import Aes from "./ecc/src/aes";
import PrivateKey from "./ecc/src/PrivateKey";
import PublicKey from "./ecc/src/PublicKey";
import Signature from "./ecc/src/signature";
import brainKey from "./ecc/src/BrainKey";
import * as hash from "./ecc/src/hash";
import key from "./ecc/src/KeyUtils";

export { Address, Aes, PrivateKey, PublicKey, Signature, brainKey, hash, key };

/* Chain */
import ChainStore from "./chain/src/ChainStore";
import TransactionBuilder  from "./chain/src/TransactionBuilder";
import ChainTypes from "./chain/src/ChainTypes";
import ObjectId from "./chain/src/ObjectId";
import NumberUtils from "./chain/src/NumberUtils";
import TransactionHelper from "./chain/src/TransactionHelper";
import ChainValidation from "./chain/src/ChainValidation";
import EmitterInstance from "./chain/src/EmitterInstance";
import Login from "./chain/src/AccountLogin";

const {FetchChainObjects, FetchChain} = ChainStore;

export {ChainStore, TransactionBuilder, FetchChainObjects, ChainTypes, EmitterInstance,
    ObjectId, NumberUtils, TransactionHelper, ChainValidation, FetchChain, Login }

/* Reexport revpopjs-ws module to keep its single instance */
import * as Chain from '@revolutionpopuli/revpopjs-ws';

export {Chain}

import Adapter from "./storage/src/Adapter"
import CloudStorage from "./storage/src/CloudStorage"
import GoogleDriveAdapter from './storage/src/GoogleDriveAdapter'
import IPFSAdapter from "./storage/src/IPFSAdapter"
import MemoryAdapter from "./storage/src/MemoryAdapter"
import PersonalData from "./storage/src/PersonalData"
import S3Adapter from './storage/src/S3Adapter'

export { Adapter, CloudStorage, GoogleDriveAdapter, IPFSAdapter, MemoryAdapter, PersonalData, S3Adapter }
