"use strict";

/* global */

let connectionCount = 0;

const startup = async(helper, server, socket, type) => {
    const address = JSON.stringify(socket.handshake.address);

    helper.writeLog(`${address} connected to ${type} server.`);

    connectionCount ++;

    server.emit("broadcast", `${connectionCount} clients connected to ${type} server.`);

    const intervalEvent = setInterval(() => {
        serverTime(socket);
    }, 1000);

    socket.emit("message", `Connected to ${type} server.`);

    socket.on("disconnect", () => {
        helper.writeLog(`${address} disconnected from ${type} client.`);

        connectionCount --;

        server.emit("broadcast", `${connectionCount} clients disconnected from ${type} server.`);

        if (connectionCount === 0)
            clearInterval(intervalEvent);

        socket.emit("message", `Disconnected from ${type} server.`);
    });
};

const serverTime = (socket) => {
    const currentDate = new Date();

    let month = currentDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : `${month}`;

    let day = currentDate.getDate();
    day = day < 10 ? `0${day}` : `${day}`;

    const date = `${currentDate.getFullYear()}/${month}/${day}`;

    let minute = currentDate.getMinutes();
    minute = minute < 10 ? `0${minute}` : `${minute}`;

    const time = `${currentDate.getHours()}:${minute}`;
    
    socket.emit("serverTime", `${date} ${time}`);
};

exports.startup = startup;