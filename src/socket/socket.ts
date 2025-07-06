// socket.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import config from '@/config/env.config';
let io: Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: config.client_uri,
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('No token provided'));

        try {
            const decoded = jwt.verify(token, config.jwt.accessTokenKey);

            if (typeof decoded === 'string') {
                return next(new Error('Invalid token format'));
            }

            (socket as any).userId = decoded.userId;
            next();
        } catch (err) {
            return next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = (socket as any).userId;
        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });
    });
};

export const getIO = () => {
    if (!io) throw new Error('Socket.IO chưa được khởi tạo');
    return io;
};
