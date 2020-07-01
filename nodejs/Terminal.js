"use strict";

/* global */

const {exec} = require("child_process");

let socketTag = "t_";

exports.socketEvent = async(socketIo, socket) => {
    socket.on(`${socketTag}command`, async(data) => {
        if (data.cmd !== undefined) {
            exec(data.cmd, (error, stdout, stderror) => {
                if (error)
                    socket.emit(`${socketTag}command`, error);
                else
                    socket.emit(`${socketTag}command`, {'stdout': stdout, 'stderror': stderror});
            });
        }
        else
            socket.emit(`${socketTag}command`, "cmd is undefined!");
    });
};