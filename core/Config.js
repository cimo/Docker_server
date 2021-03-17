"use strict";

/* global process */

const setting = {
    debug: false,
    ip: process.env.NODEJS_IP,
    cwd: process.env.HOME,
    env: process.env,
    socketIo: {
        domain: process.env.NODEJS_DOMAIN
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
        enabled: process.env.NODEJS_DIGEST_ENABLED
    }
};

exports.setting = setting;
