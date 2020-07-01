"use strict";

/* global __dirname */

const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const https = require("https");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const httpAuth = require("http-auth");
const socketIo = require("socket.io");

const config = require("./Config");
const helper = require("./Helper");
const sio = require("./Sio");
const terminal = require("./Terminal");

const portHttp = process.env.NODEJS_PORT_HTTP;
const portHttps = process.env.NODEJS_PORT_HTTPS;

const urlRoot = `${path.dirname(__dirname)}/public`;

const certificates = {
    'key': fs.readFileSync(config.settings.certificates.key),
    'cert': fs.readFileSync(config.settings.certificates.cert)
};

const digest = httpAuth.digest({
    realm: config.settings.digest.realm,
    file: `${config.settings.digest.path}.digest_htpasswd`
});

const app = express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(certificates, app);

const socketIoServer = socketIo(httpServer);
const socketIosServer = socketIo(httpsServer);

app.use(express.static(urlRoot));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({'cookie': true}));

app.get("/", config.digestCheck(digest, (request, result) => {
    result.send("");
}));

httpServer.listen(portHttp, () => {
    helper.writeLog(`Listen on ${portHttp}`);
});
httpsServer.listen(portHttps, () => {
    helper.writeLog(`Listen on ${portHttps}`);
});

socketIoServer.on("connection", (socket) => {
    sio.startup(socketIoServer, socket, "http");

    terminal.socketEvent(socketIosServer, socket);
});
socketIosServer.on("connection", (socket) => {
    sio.startup(socketIosServer, socket, "https");

    terminal.socketEvent(socketIosServer, socket);
});