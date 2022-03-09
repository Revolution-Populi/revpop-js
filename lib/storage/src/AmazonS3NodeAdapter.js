import Adapter from "./Adapter";
import {sha256} from "../../ecc/src/hash";
const S3_VERSION = "1.0"

class S3Adapter extends Adapter {
    constructor(s3, bucketName) {
        super()
        this.s3 = s3
        this.bucketName = bucketName
    }

    async put(val, options = {}) {
        const id = sha256(val, 'hex');
        const params = {
            Body: val,
            Key: id,
            ACL: "public-read"
        };

        const s3_data = await this.client.upload(params, function(err, data) {
            if (err) {
                // Handle error
                console.error(err);
                reject(err);
              } else {
                  resolve(data);
              }            
        }).promise();

        const link = s3_data.Location;
        const ret = { url: link, storage_data: "[\"S3\",\"" + `${S3_VERSION}` + "\",\"" + `${s3_data.Key}` + "\"]" };
        return ret;
    }

    async get(key, options = {}) {
        const params = {
            Key: key,
        };
        return new Promise((resolve, reject) => {
            this.client.getObject(params).promise()
                .then((data) => {
                    resolve(data.Body);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    async delete (key, options = {}) {
        const params = {
            Key: key,
        };
        return new Promise((resolve, reject) => {
            this.client.deleteObject(params).promise()
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default S3Adapter;
