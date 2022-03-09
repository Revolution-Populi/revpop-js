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
      * @param {Uint8Array} val
      * @param {Object} options
      * @returns {Promise<PutResponse>}
      */
    async put(val, options) {
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
    async get(key, options ) {
        return this.memory[key];
    }

    /**
     * Remove the record for the passed key
     *
     * @param {String} key
     * @param {Object} options
     * @returns {Promise<boolean>}
     */
    async delete(key, options) {
        return new Promise((resolve, reject) => {
            delete this.memory[key];
            resolve();
        });
    }
}

export default MemoryAdapter;
