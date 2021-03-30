"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrypt = exports.encrypt = exports.digestCheck = exports.writeLog = exports.pathStatic = void 0;

var Path = _interopRequireWildcard(require("path"));

var Fs = _interopRequireWildcard(require("fs"));

var HttpAuth = _interopRequireWildcard(require("http-auth"));

var Crypto = _interopRequireWildcard(require("crypto"));

var Config = _interopRequireWildcard(require("./Config"));

var _this = void 0;

var httpAuth = HttpAuth.digest({
  realm: Config.data.digest.realm,
  file: "".concat(Config.data.digest.path, "/.digest_htpasswd")
});
var cryptAlgorithm = "aes-256-cbc";
var cryptKey = Crypto.createHash("sha256").update(String(Config.data.crypt.key)).digest("base64").substr(0, 32);
var cryptIv = Crypto.randomBytes(16);
var pathStatic = "".concat(Path.dirname(__dirname)).concat(Config.data.pathStatic);
exports.pathStatic = pathStatic;

var writeLog = function writeLog(message) {
  if (Config.data.debug === "on") {
    Fs.appendFile("".concat(pathStatic, "/debug.log"), "".concat(message, "\n"), function () {
      console.log("writeLog => ".concat(message));
    });
  }
};

exports.writeLog = writeLog;

var digestCheck = function digestCheck(callback) {
  if (Config.data.digest.active === "on") {
    return httpAuth.check(function (req, res) {
      callback.apply(_this, [req, res]);
    });
  } else {
    return function (req, res) {
      callback.apply(_this, [req, res]);
    };
  }
};

exports.digestCheck = digestCheck;

var encrypt = function encrypt(text) {
  if (text !== "") {
    var cipher = Crypto.createCipheriv(cryptAlgorithm, cryptKey, cryptIv);
    var encrypted = Buffer.concat([cipher.update(text), cipher["final"]()]);
    return cryptIv.toString("hex") + ":" + encrypted.toString("hex");
  }

  return "";
};

exports.encrypt = encrypt;

var decrypt = function decrypt(hex) {
  var hexSplit = hex.split(":");

  if (hexSplit.length == 2) {
    try {
      var decipher = Crypto.createDecipheriv(cryptAlgorithm, cryptKey, Buffer.from(hexSplit[0], "hex"));
      var decrypted = Buffer.concat([decipher.update(Buffer.from(hexSplit[1], "hex")), decipher["final"]()]);
      return decrypted.toString();
    } catch (error) {
      return "";
    }
  }

  return "";
};

exports.decrypt = decrypt;