"use strict";

const os = require("os");
const fs = require("fs");
const path = require("path");
const pty = require("node-pty");
const childProcess = require("child_process");

const config = require("./Config");

const writeStreamEncoding = "utf-8";

const socketEvent = async(helper, socket, type) => {
    helper.writeLog(`Terminal listen on ${type}`);

    _pty(helper, socket);

    _exec(helper, socket);

    _crypt(helper, socket);
};

const _pty = (helper, socket) => {
    const ptySpawnList = [];

    socket.on("t_pty_start", (dataStart) => {
        helper.writeLog(`Terminal ${dataStart.tag} start`);

        const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

        ptySpawnList[dataStart.tag] = pty.spawn(shell, [], {
            name: "xterm-color",
            cols: dataStart.size[0],
            rows: dataStart.size[1],
            cwd: config.setting.cwd,
            env: config.setting.env
        });

        ptySpawnList[dataStart.tag].on("data", (data) => {
            helper.writeLog(`Terminal t_pty_o_${dataStart.tag} => ${data}`);

            socket.emit(`t_pty_o_${dataStart.tag}`, {tag: dataStart.tag, cmd: data});
        });

        ptySpawnList[dataStart.tag].on("exit", () => {
            if (ptySpawnList[dataStart.tag] !== undefined) {
                helper.writeLog(`Terminal t_pty_o_${dataStart.tag} => xterm_reset`);

                socket.emit(`t_pty_o_${dataStart.tag}`, {tag: dataStart.tag, cmd: "xterm_reset"});

                ptySpawnList[dataStart.tag].destroy();

                delete ptySpawnList[dataStart.tag];
            }
        });
    });

    socket.on("t_pty_i", (data) => {
        if (ptySpawnList[data.tag] !== undefined && data.tag !== undefined && data.cmd !== undefined) {
            helper.writeLog(`Terminal t_pty_i => ${data.tag} - ${data.cmd}`);

            ptySpawnList[data.tag].write(data.cmd);
        }
    });

    socket.on("t_pty_resize", (data) => {
        if (ptySpawnList[data.tag] !== undefined && data.tag !== undefined && data.size !== undefined) {
            helper.writeLog(`Terminal t_pty_resize => ${data.tag}`);

            ptySpawnList[data.tag].resize(data.size[0], data.size[1]);
        }
    });

    socket.on("t_pty_close", (data) => {
        if (ptySpawnList[data.tag] !== undefined && data.tag !== undefined) {
            helper.writeLog(`Terminal t_pty_close => ${data.tag}`);

            ptySpawnList[data.tag].destroy();

            delete ptySpawnList[data.tag];
        }
    });
};

const _exec = (helper, socket) => {
    socket.on("t_exec_i", (dataStart) => {
        if (dataStart.tag !== undefined && dataStart.cmd !== undefined) {
            helper.writeLog(`Terminal t_exec_i => ${dataStart.tag} - ${dataStart.cmd}`);

            const execResult = childProcess.exec(dataStart.cmd);
            
            execResult.stdout.on("data", (data) => {
                helper.writeLog(`t_exec_o_${dataStart.tag} => stdout: ${data}`);

                socket.emit(`t_exec_o_${dataStart.tag}`, {out: data});
            });

            execResult.stderr.on("data", (data) => {
                helper.writeLog(`t_exec_o_${dataStart.tag} => stderr: ${data}`);

                socket.emit(`t_exec_o_${dataStart.tag}`, {err: data});
            });

            if (dataStart.closeEnabled === undefined && dataStart.closeEnabled !== false) {
                execResult.on("close", (data) => {
                    helper.writeLog(`t_exec_o_${dataStart.tag} => close: ${data}`);

                    socket.emit(`t_exec_o_${dataStart.tag}`, {close: data});
                });
            }
        }
    });

    socket.on("t_exec_stream_i", (dataStart) => {
        if (dataStart.tag !== undefined && dataStart.cmd !== undefined && dataStart.path !== undefined) {
            helper.writeLog(`Terminal t_exec_stream_i => ${dataStart.tag} - ${dataStart.cmd} - ${dataStart.path} - ${dataStart.content}`);

            const directory = path.dirname(dataStart.path);

            if (fs.existsSync(directory) === true) {
                if (dataStart.cmd === "write" && dataStart.content !== undefined) {
                    const stream = fs.createWriteStream(dataStart.path, {flags: "w", encoding: writeStreamEncoding, mode: "0664"});

                    stream.write(dataStart.content);

                    stream.end();

                    stream.on("finish", () => {
                        helper.writeLog(`Write t_exec_stream_o_${dataStart.tag} => finish`);

                        socket.emit(`t_exec_stream_o_${dataStart.tag}`, {chunk: "end"});
                    });
                }
                else if (dataStart.cmd === "read") {
                    if (fs.existsSync(dataStart.path) === true) {
                        const stream = fs.createReadStream(dataStart.path, {flags: "r", encoding: writeStreamEncoding});

                        stream.on("data", (data) => {
                            const chunk = data.toString();

                            helper.writeLog(`Read t_exec_stream_o_${dataStart.tag} => ${chunk}`);

                            socket.emit(`t_exec_stream_o_${dataStart.tag}`, {chunk: chunk});
                        });

                        stream.on("close", () => {
                            helper.writeLog(`Read t_exec_stream_o_${dataStart.tag} => close`);

                            socket.emit(`t_exec_stream_o_${dataStart.tag}`, {chunk: "end"});
                        });
                    }
                }
            }
        }
    });
};

const _crypt = (helper, socket) => {
    socket.on("t_crypt_encrypt_i", (dataStart) => {
        if (dataStart.tag !== undefined && dataStart.text !== undefined) {
            helper.writeLog(`Execute t_crypt_encrypt_i => ${dataStart.tag} - ${dataStart.text}`);

            socket.emit(`t_crypt_encrypt_o_${dataStart.tag}`, {out: helper.encrypt(dataStart.text)});
        }
    });

    socket.on("t_crypt_decrypt_i", (dataStart) => {
        if (dataStart.tag !== undefined && dataStart.hex !== undefined) {
            helper.writeLog(`Execute t_crypt_decrypt_i => ${dataStart.tag} - ${dataStart.hex}`);

            socket.emit(`t_crypt_decrypt_o_${dataStart.tag}`, {out: helper.decrypt(dataStart.hex)});
        }
    });
};

exports.socketEvent = socketEvent;
