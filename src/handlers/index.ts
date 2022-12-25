import { registerHandler } from '@/helpers/handlers.helper';
import { HandlerDefinition } from '@/typings/handlers';
import { SocketIoServer } from '@/typings/socket-io';
import { Socket } from 'socket.io';
import { onDisconnect } from './misc.handlers';
import { roomsHandlers } from './rooms.handlers';

export const handlers = {
  ...roomsHandlers,
} as const;

const handlersEntries = Object.entries(handlers);

export const registerHandlers = (io: SocketIoServer, socket: Socket) => {
  for (const [eventName, handler] of handlersEntries) {
    registerHandler(io, socket, eventName, handler as HandlerDefinition);
  }

  socket.on('disconnect', onDisconnect.bind(null, io, socket));
};
