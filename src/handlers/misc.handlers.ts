import { SocketIoServer, SocketIoSocket } from '@/typings/socket-io';

export const onDisconnect = (io: SocketIoServer, socket: SocketIoSocket) => {
  const player = socket.data.player;
  if (!player) return;

  player.socket = undefined;
  player.room.onPlayerDisconnected(player);
};
