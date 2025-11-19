"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.initSocketIO = initSocketIO;
const socket_io_1 = require("socket.io");
const socket_handlers_1 = require("./socket.handlers");
let io;
function initSocketIO(httpServer) {
    exports.io = io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    (0, socket_handlers_1.initSocketHandlers)(io);
    return io;
}
