"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var Fs = _interopRequireWildcard(require("fs"));

var _express = _interopRequireDefault(require("express"));

var Http = _interopRequireWildcard(require("http"));

var Https = _interopRequireWildcard(require("https"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _csurf = _interopRequireDefault(require("csurf"));

var SocketIo = _interopRequireWildcard(require("socket.io"));

var Config = _interopRequireWildcard(require("./Config"));

var Helper = _interopRequireWildcard(require("./Helper"));

var Sio = _interopRequireWildcard(require("./Sio"));

var Terminal = _interopRequireWildcard(require("./Terminal"));

var Vue = _interopRequireWildcard(require("./Vue"));

var originList = ["http://".concat(Config.data.socketIo.domain), "https://".concat(Config.data.socketIo.domain), "http://".concat(Config.data.socketIo.domain, ":").concat(Config.data.port.http), "https://".concat(Config.data.socketIo.domain, ":").concat(Config.data.port.https)];

if (Config.data.port.vue) {
  originList.push("http://".concat(Config.data.socketIo.domain, ":").concat(Config.data.port.vue));
}

if (Config.data.port.range) {
  var portRangeSplit = Config.data.port.range.split("-");
  var portRangeCount = parseInt(portRangeSplit[1]) - parseInt(portRangeSplit[0]);

  for (var i = 0; i <= portRangeCount; i++) {
    var port = parseInt(portRangeSplit[0]) + i;
    originList.push("http://".concat(Config.data.socketIo.domain, ":").concat(port));
    originList.push("https://".concat(Config.data.socketIo.domain, ":").concat(port));
  }
}

var corsOption = {
  originList: originList,
  methodList: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  optionsSuccessStatus: 200
};
var app = (0, _express.default)();
app.use(_express.default.static(Helper.pathStatic));
app.use(_express.default.urlencoded({
  extended: true
}));
app.use(_express.default.json());
app.use((0, _cookieParser.default)());
app.use((0, _cors.default)({
  origin: corsOption.originList,
  methods: corsOption.methodList,
  optionsSuccessStatus: corsOption.optionsSuccessStatus
}));
app.use((0, _csurf.default)({
  cookie: true
}));
app.get("/", Helper.digestCheck(function (request, result) {
  result.send("");
}));
var serverHttp = Http.createServer(app);
var serverHttps = Https.createServer({
  key: Fs.readFileSync(Config.data.certificate.key),
  cert: Fs.readFileSync(Config.data.certificate.cert)
}, app);
var socketIoServerHttp = new SocketIo.Server(serverHttp, {
  cors: {
    origin: corsOption.originList,
    methods: corsOption.methodList
  },
  transports: ["websocket"],
  pingTimeout: 60000,
  pingInterval: 8000,
  cookie: false
});
var socketIoServerHttps = new SocketIo.Server(serverHttps, {
  cors: {
    origin: corsOption.originList,
    methods: corsOption.methodList
  },
  transports: ["websocket"],
  pingTimeout: 60000,
  pingInterval: 8000,
  cookie: false
});
var portHttp = Config.data.port.http ? parseInt(Config.data.port.http) : 0;
var portHttps = Config.data.port.https ? parseInt(Config.data.port.https) : 0;
serverHttp.listen(portHttp, Config.data.ip, 0, function () {
  Helper.writeLog("Listen on http://".concat(Config.data.ip, ":").concat(Config.data.port.http));
  Vue.startup();
});
serverHttps.listen(portHttps, Config.data.ip, 0, function () {
  Helper.writeLog("Listen on https://".concat(Config.data.ip, ":").concat(Config.data.port.https));
}); // noinspection TypeScriptValidateTypes

socketIoServerHttp.on("connection", function (socket) {
  Terminal.socketEvent(socket, "http").then(function () {});
  Sio.startup(socketIoServerHttp, socket, "http").then(function () {});
}); // noinspection TypeScriptValidateTypes

socketIoServerHttps.on("connection", function (socket) {
  Terminal.socketEvent(socket, "https").then(function () {});
  Sio.startup(socketIoServerHttps, socket, "https").then(function () {});
});