"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrypt = exports.encrypt = exports.digestCheck = exports.writeLog = exports.urlRoot = void 0;

var Path = _interopRequireWildcard(require("path"));

var Fs = _interopRequireWildcard(require("fs"));

var Crypto = _interopRequireWildcard(require("crypto"));

var Config = _interopRequireWildcard(require("./Config"));

var _this = void 0;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var cryptAlgorithm = "aes-256-cbc";
var cryptKey = Crypto.createHash("sha256").update(String(Config.data.crypt.key)).digest("base64").substr(0, 32);
var cryptIv = Crypto.randomBytes(16);
var urlRoot = "".concat(Path.dirname(__dirname), "/dist");
exports.urlRoot = urlRoot;

var writeLog = function writeLog(message) {
  if (Config.data.debug === "on") {
    Fs.appendFile("".concat(urlRoot, "/debug.log"), "".concat(message, "\n"), function () {
      console.log("writeLog => ".concat(message));
    });
  }
};

exports.writeLog = writeLog;

var digestCheck = function digestCheck(digest, callback) {
  if (Config.data.digest.active === "on") {
    return digest.check(function (req, res) {
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