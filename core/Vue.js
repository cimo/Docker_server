"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startup = void 0;

var ChildProcess = _interopRequireWildcard(require("child_process"));

var Config = _interopRequireWildcard(require("./Config"));

var Helper = _interopRequireWildcard(require("./Helper"));

var startup = function startup() {
  if (Config.data.port.vue) {
    ChildProcess.exec("vue ui --headless --host ".concat(Config.data.ip, " --port ").concat(Config.data.port.vue), function (error, stdout, stderr) {
      if (error) {
        Helper.writeLog("Vue error => ".concat(error));
      } else {
        Helper.writeLog("Vue output => ".concat(stdout, " - ").concat(stderr));
      }
    });
  }
};

exports.startup = startup;