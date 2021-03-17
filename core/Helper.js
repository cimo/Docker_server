"use strict";

/* global */

const fs = require("fs");
const crypto = require("crypto");

const env = require("./Env");
const config = require("./Config");

const cryptAlgorithm = "aes-256-cbc";
const cryptKey = crypto.createHash("sha256").update(String(env.data.crypt.key)).digest("base64").substr(0, 32);
const cryptIv = crypto.randomBytes(16);

const writeLog = (message) => {
    if (config.setting.debug) {
        fs.appendFile("./debug.log", `${message}\n`, () => {
            console.log(`writeLog => ${message}`);
        });
    }
};

const digestCheck = (digest, callback) => {
    const self = this;

    if (config.setting.digest.enabled) {
        return digest.check((req, res) => {
            callback.apply(self, [req, res]);
        });
    }
    else {
        return (req, res) => {
            callback.apply(self, [req, res]);
        };
    }
};

const encrypt = (text) => {
    if (text !== "") {
        const cipher = crypto.createCipheriv(cryptAlgorithm, cryptKey, cryptIv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return cryptIv.toString("hex") + ":" + encrypted.toString("hex");
    }

    return "";
};

const decrypt = (hex) => {
    const hexSplit = hex.split(":");

    if (hexSplit.length == 2) {
        try {
            const decipher = crypto.createDecipheriv(cryptAlgorithm, cryptKey, Buffer.from(hexSplit[0], "hex"));
            const decrpyted = Buffer.concat([decipher.update(Buffer.from(hexSplit[1], "hex")), decipher.final()]);

            return decrpyted.toString();
        }
        catch (error) {
            return "";
        }
    }

    return "";
};

exports.writeLog = writeLog;
exports.digestCheck = digestCheck;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
