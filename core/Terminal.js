"use strict";

const os = require("os");
const fs = require("fs");
const path = require("path");
const pty = require("node-pty");
const childProcess = require("child_process");

const config = require("./Config");

const encoding = "utf-8";

const socketEvent = async(helper, socket, type) => {
    helper.writeLog(`Terminal listen on ${type}`);

    _pty(helper, socket);

    _exec(helper, socket);
};

const _pty = (helper, socket) => {
    let ptySpawnList = [];

    socket.on("t_pty_start", (dataStart) => {
        helper.writeLog(`Terminal ${dataStart.tag} start`);

        let shell = os.platform() === "win32" ? "powershell.exe" : "bash";

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

            let execResult = childProcess.exec(dataStart.cmd);
            
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

            let directory = path.dirname(dataStart.path);

            if (fs.existsSync(directory) === true) {
                if (dataStart.cmd === "write" && dataStart.content !== undefined) {
                    let stream = fs.createWriteStream(dataStart.path, {flags: "w", encoding: encoding, mode: "0664"});

                    stream.write(dataStart.content);

                    stream.end();

                    stream.on("finish", () => {
                        helper.writeLog(`Write t_exec_stream_o_${dataStart.tag} => finish`);

                        socket.emit(`t_exec_stream_o_${dataStart.tag}`, {chunk: "end"});
                    });
                }
                else if (dataStart.cmd === "read") {
                    if (fs.existsSync(dataStart.path) === true) {
                        let stream = fs.createReadStream(dataStart.path, {flags: "r", encoding: encoding});

                        stream.on("data", (data) => {
                            let chunk = data.toString();

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

exports.socketEvent = socketEvent;
