"use strict";

/* global */

exports.settings = {
    'certificates': {
        'key': `/home/${process.env.WWW_USER_NAME}/root/certificate/${process.env.CERTIFICATE_KEY}`,
        'cert': `/home/${process.env.WWW_USER_NAME}/root/certificate/${process.env.CERTIFICATE_FILE}`
    },
    'digest': {
        'realm': "Auth - Digest",
        'path': `/home/${process.env.WWW_USER_NAME}/root/web_space`,
        'enable': process.env.NODEJS_DIGEST_ENABLE
    }
};

exports.digestCheck = (digest, callback) => {
    let self = this;

    if (process.env.NODEJS_DIGEST_ENABLE === true) {
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