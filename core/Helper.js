"use strict";

/* global */

const fs = require("fs");

const config = require("./Config");

const writeLog = (message) => {
    if (config.setting.debug === true) {
        fs.appendFile("./debug.log", `${message}\n`, () => {
            console.log(`writeLog => ${message}`);
        });
    }
};

const digestCheck = (digest, callback) => {
    let self = this;

    if (config.setting.digest.enable === true) {
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

exports.writeLog = writeLog;
exports.digestCheck = digestCheck;