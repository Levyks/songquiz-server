import { after, before, afterEach } from 'mocha';
import { io } from 'socket.io-client';
import { SocketIoClient } from '../typings/socket-io';
import { config } from '@/config';
import { startServer } from '@/server';
import { emit } from './socket';
import { SocketIoServer, SocketIoSocket } from '@/typings/socket-io';

export function useServer() {
  let io: SocketIoServer | undefined;
  let stopServer: () => void;

  const getIo = () => {
    if (!io) throw new Error('Server is not started');
    return io;
  };

  const getServerSocket = (clientSocket: SocketIoClient): SocketIoSocket => {
    const io = getIo();
    const serverSocket = io.sockets.sockets.get(clientSocket.id);
    if (!serverSocket) throw new Error('Server socket not found');
    return serverSocket;
  };

  before(async () => {
    ({ io, stopServer } = await startServer(config.server.port));
  });

  after(() => {
    stopServer();
  });

  return { getIo, getServerSocket };
}

export function useSockets() {
  const sockets: SocketIoClient[] = [];

  const newSocket = (token?: string) => {
    const port = config.server.port;
    const socket: SocketIoClient = io(`http://localhost:${port}`, {
      auth: { token },
    });
    sockets.push(socket);
    return socket;
  };

  const newSocketWaitForSyncToken = (token?: string) => {
    return new Promise<{
      socket: SocketIoClient;
      token: string;
    }>((resolve) => {
      const socket = newSocket(token);
      socket.on('syncToken', (token) => resolve({ socket, token }));
    });
  };

  afterEach(() => {
    sockets.forEach((socket) => socket.disconnect());
    sockets.length = 0;
  });

  return { newSocket, newSocketWaitForSyncToken };
}

export function useRooms() {
  const { newSocket } = useSockets();

  const newRoom = async (leaderNickname = 'leader') => {
    const socket = newSocket();
    const room = await emit(socket, 'createRoom', {
      nickname: leaderNickname,
    });
    return { socket, roomCode: room.code };
  };

  return { newRoom };
}

export function usePlayers() {
  const { newSocket } = useSockets();

  const newPlayer = async (roomCode: string, nickname = 'player') => {
    const socket = newSocket();

    await emit(socket, 'joinRoom', {
      roomCode,
      nickname,
    });

    return { socket };
  };

  return { newPlayer };
}
