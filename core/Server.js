"use strict";

/* global __dirname */

const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const https = require("https");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const httpAuth = require("http-auth");
const cors = require("cors");
const csrf = require("csurf");
const socketIo = require("socket.io");

const config = require("./Config");
const helper = require("./Helper");
const sio = require("./Sio");
const terminal = require("./Terminal");

const urlRoot = `${path.dirname(__dirname)}/public`;

const certificate = {
    key: fs.readFileSync(config.setting.certificate.key),
    cert: fs.readFileSync(config.setting.certificate.cert)
};

const httpAuthOption = httpAuth.digest({
    realm: config.setting.digest.realm,
    file: `${config.setting.digest.path}.digest_htpasswd`
});

const corsOption = {
	origin: [`http://${config.setting.socketIo.domain}`],
	methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
	optionsSuccessStatus: 200
};

const app = express();

app.use(express.static(urlRoot));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use(csrf({cookie: true}));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(certificate, app);

const socketIoHttpServer = socketIo(httpServer, {
    cors: {
		origin: [`http://${config.setting.socketIo.domain}`],
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
	},
	cookie: {
        name: "docker_server_socketIo",
        httpOnly: true,
        path: "/"
    }
});
const socketIoHttpsServer = socketIo(httpsServer, {
	cors: {
		origin: [`https://${config.setting.socketIo.domain}`],
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
	},
    cookie: {
        name: "docker_server_socketIo",
        httpOnly: true,
        path: "/"
    }
});

app.get("/", helper.digestCheck(httpAuthOption, (request, result) => {
    result.send("");
}));

httpServer.listen(config.setting.port.http, config.setting.ip, () => {
    helper.writeLog(`Listen on http://${config.setting.ip}:${config.setting.port.http}`);
});
httpsServer.listen(config.setting.port.https, config.setting.ip, () => {
    helper.writeLog(`Listen on https://${config.setting.ip}:${config.setting.port.https}`);
});

socketIoHttpServer.on("connection", (socket) => {
    sio.startup(helper, socketIoHttpServer, socket, "http");

    terminal.socketEvent(helper, socket, "http");
});
socketIoHttpsServer.on("connection", (socket) => {
    sio.startup(helper, socketIoHttpsServer, socket, "https");

    terminal.socketEvent(helper, socket, "https");
});