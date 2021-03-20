"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startup = void 0;

var Helper = _interopRequireWildcard(require("./Helper"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var connectionCount = 0;

var serverTime = function serverTime(socket) {
  var currentDate = new Date();
  var month = currentDate.getMonth() + 1;
  month = parseInt(month < 10 ? "0".concat(month) : "".concat(month));
  var day = currentDate.getDate();
  day = parseInt(day < 10 ? "0".concat(day) : "".concat(day));
  var date = "".concat(currentDate.getFullYear(), "/").concat(month, "/").concat(day);
  var minute = currentDate.getMinutes();
  minute = parseInt(minute < 10 ? "0".concat(minute) : "".concat(minute));
  var time = "".concat(currentDate.getHours(), ":").concat(minute);
  socket.emit("serverTime", "".concat(date, " ").concat(time));
};

var startup = function startup(server, socket, type) {
  var address = JSON.stringify(socket.handshake.address);
  Helper.writeLog("".concat(address, " connected to ").concat(type, " server."));
  connectionCount++;
  server.emit("broadcast", "".concat(connectionCount, " clients connected to ").concat(type, " server."));
  var intervalEvent = setInterval(function () {
    serverTime(socket);
  }, 1000);
  socket.emit("message", "Connected to ".concat(type, " server."));
  socket.on("disconnect", function () {
    Helper.writeLog("".concat(address, " disconnected from ").concat(type, " client."));
    connectionCount--;
    server.emit("broadcast", "".concat(connectionCount, " clients disconnected from ").concat(type, " server."));

    if (connectionCount === 0) {
      clearInterval(intervalEvent);
    }

    socket.emit("message", "Disconnected from ".concat(type, " server."));
  });
};

exports.startup = startup;