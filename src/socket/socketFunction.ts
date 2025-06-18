import { getIO } from './socket';

export const forceLogoutUserById = (userId: string) => {
    const io = getIO();
    for (const [id, socket] of io.sockets.sockets) {
        if ((socket as any).userId === userId) {
            socket.emit('logout');
            socket.disconnect();
        }
    }
};
