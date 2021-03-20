"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socketEvent = void 0;

var Os = _interopRequireWildcard(require("os"));

var Fs = _interopRequireWildcard(require("fs"));

var Path = _interopRequireWildcard(require("path"));

var Pty = _interopRequireWildcard(require("node-pty"));

var ChildProcess = _interopRequireWildcard(require("child_process"));

var Config = _interopRequireWildcard(require("./Config"));

var Helper = _interopRequireWildcard(require("./Helper"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var writeStreamEncoding = "utf-8";

var eventPty = function eventPty(socket) {
  var ptySpawnList = [];
  socket.on("t_pty_start", function (dataStart) {
    if (dataStart.tag) {
      Helper.writeLog("Terminal ".concat(dataStart.tag, " start"));
      var shell = Os.platform() === "win32" ? "powershell.exe" : "bash";

      if (dataStart.size) {
        ptySpawnList[dataStart.tag] = Pty.spawn(shell, [], {
          name: "xterm-color",
          cols: dataStart.size[0],
          rows: dataStart.size[1],
          cwd: Config.data.cwd,
          env: Config.data.env
        });
      }

      ptySpawnList[dataStart.tag].on("data", function (data) {
        Helper.writeLog("Terminal t_pty_o_".concat(dataStart.tag, " => ").concat(data));
        socket.emit("t_pty_o_".concat(dataStart.tag), {
          tag: dataStart.tag,
          cmd: data
        });
      });
      ptySpawnList[dataStart.tag].on("exit", function () {
        if (dataStart.tag && ptySpawnList[dataStart.tag]) {
          Helper.writeLog("Terminal t_pty_o_".concat(dataStart.tag, " => xterm_reset"));
          socket.emit("t_pty_o_".concat(dataStart.tag), {
            tag: dataStart.tag,
            cmd: "xterm_reset"
          });
          ptySpawnList[dataStart.tag].destroy();
          delete ptySpawnList[dataStart.tag];
        }
      });
    }
  });
  socket.on("t_pty_i", function (data) {
    if (data.tag && data.cmd && ptySpawnList[data.tag]) {
      Helper.writeLog("Terminal t_pty_i => ".concat(data.tag, " - ").concat(data.cmd));
      ptySpawnList[data.tag].write(data.cmd);
    }
  });
  socket.on("t_pty_resize", function (data) {
    if (data.tag && data.size && ptySpawnList[data.tag]) {
      Helper.writeLog("Terminal t_pty_resize => ".concat(data.tag));
      ptySpawnList[data.tag].resize(data.size[0], data.size[1]);
    }
  });
  socket.on("t_pty_close", function (data) {
    if (data.tag && ptySpawnList[data.tag]) {
      Helper.writeLog("Terminal t_pty_close => ".concat(data.tag));
      ptySpawnList[data.tag].destroy();
      delete ptySpawnList[data.tag];
    }
  });
};

var eventExec = function eventExec(socket) {
  socket.on("t_exec_i", function (dataStart) {
    if (dataStart.tag && dataStart.cmd) {
      Helper.writeLog("Terminal t_exec_i => ".concat(dataStart.tag, " - ").concat(dataStart.cmd));
      var execResult = ChildProcess.exec(dataStart.cmd);

      if (execResult && execResult.stdout && execResult.stderr) {
        execResult.stdout.on("data", function (data) {
          Helper.writeLog("t_exec_o_".concat(dataStart.tag, " => stdout: ").concat(data));
          socket.emit("t_exec_o_".concat(dataStart.tag), {
            out: data
          });
        });
        execResult.stderr.on("data", function (data) {
          Helper.writeLog("t_exec_o_".concat(dataStart.tag, " => stderr: ").concat(data));
          socket.emit("t_exec_o_".concat(dataStart.tag), {
            err: data
          });
        });

        if (dataStart.closeEnabled) {
          execResult.on("close", function (data) {
            Helper.writeLog("t_exec_o_".concat(dataStart.tag, " => close: ").concat(data));
            socket.emit("t_exec_o_".concat(dataStart.tag), {
              close: data
            });
          });
        }
      }
    }
  });
  socket.on("t_exec_stream_i", function (dataStart) {
    if (dataStart.tag && dataStart.cmd && dataStart.path) {
      Helper.writeLog("Terminal t_exec_stream_i => ".concat(dataStart.tag, " - ").concat(dataStart.cmd, " - ").concat(dataStart.path, " - ").concat(dataStart.content));
      var directory = Path.dirname(dataStart.path);

      if (Fs.existsSync(directory)) {
        if (dataStart.cmd === "write" && dataStart.content) {
          var stream = Fs.createWriteStream(dataStart.path, {
            flags: "w",
            encoding: writeStreamEncoding,
            mode: 436
          });
          stream.write(dataStart.content);
          stream.end();
          stream.on("finish", function () {
            Helper.writeLog("Write t_exec_stream_o_".concat(dataStart.tag, " => finish"));
            socket.emit("t_exec_stream_o_".concat(dataStart.tag), {
              chunk: "end"
            });
          });
        } else if (dataStart.cmd === "read") {
          if (Fs.existsSync(dataStart.path)) {
            var _stream = Fs.createReadStream(dataStart.path, {
              flags: "r",
              encoding: writeStreamEncoding
            });

            _stream.on("data", function (data) {
              var chunk = data.toString();
              Helper.writeLog("Read t_exec_stream_o_".concat(dataStart.tag, " => ").concat(chunk));
              socket.emit("t_exec_stream_o_".concat(dataStart.tag), {
                chunk: chunk
              });
            });

            _stream.on("close", function () {
              Helper.writeLog("Read t_exec_stream_o_".concat(dataStart.tag, " => close"));
              socket.emit("t_exec_stream_o_".concat(dataStart.tag), {
                chunk: "end"
              });
            });
          }
        }
      }
    }
  });
};

var eventCrypt = function eventCrypt(socket) {
  socket.on("t_crypt_encrypt_i", function (dataStart) {
    if (dataStart.tag && (dataStart.text === "" || dataStart.text)) {
      Helper.writeLog("Execute t_crypt_encrypt_i => ".concat(dataStart.tag, " - ").concat(dataStart.text));
      socket.emit("t_crypt_encrypt_o_".concat(dataStart.tag), {
        out: Helper.encrypt(dataStart.text)
      });
    }
  });
  socket.on("t_crypt_decrypt_i", function (dataStart) {
    if (dataStart.tag && (dataStart.hex === "" || dataStart.hex)) {
      Helper.writeLog("Execute t_crypt_decrypt_i => ".concat(dataStart.tag, " - ").concat(dataStart.hex));
      socket.emit("t_crypt_decrypt_o_".concat(dataStart.tag), {
        out: Helper.decrypt(dataStart.hex)
      });
    }
  });
};

var socketEvent = function socketEvent(socket, type) {
  Helper.writeLog("Terminal listen on ".concat(type));
  eventPty(socket);
  eventExec(socket);
  eventCrypt(socket);
};

exports.socketEvent = socketEvent;