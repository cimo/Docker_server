"use strict";

/* global process */

const setting = {
    debug: false,
    ip: "0.0.0.0",
    cwd: process.env.HOME,
    env: process.env,
    socketIo: {
        domain: "localhost"
    },
    port: {
        http: process.env.NODEJS_PORT_HTTP,
        https: process.env.NODEJS_PORT_HTTPS
    },
    certificate: {
        key: `/home/${process.env.WWW_USER_NAME}/root/certificate/${process.env.CERTIFICATE_KEY}`,
        cert: `/home/${process.env.WWW_USER_NAME}/root/certificate/${process.env.CERTIFICATE_FILE}`
    },
    digest: {
        realm: "Auth - Digest",
        path: `/home/${process.env.WWW_USER_NAME}/root${process.env.WEB_PATH}`,
        enable: process.env.NODEJS_DIGEST_ENABLE
    }
};

exports.setting = setting;