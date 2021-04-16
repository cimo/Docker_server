"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Helper = _interopRequireWildcard(require("./Helper"));

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

var startup = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(server, socket, type) {
    var address, intervalEvent;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            address = JSON.stringify(socket.handshake.address);
            Helper.writeLog("".concat(address, " connected to ").concat(type, " server."));
            connectionCount++;
            server.emit("broadcast", "".concat(connectionCount, " clients connected to ").concat(type, " server."));
            intervalEvent = setInterval(function () {
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

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function startup(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.startup = startup;