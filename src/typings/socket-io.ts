/* eslint-disable @typescript-eslint/no-empty-interface */
import { Player } from '@/models/player.model';
import { Server, Socket } from 'socket.io';

import { handlers } from '@/handlers';
import { z } from 'zod';

export interface ServerToClientEvents {
  playerDisconnected: (nickname: string) => void;
  syncToken: (token: string) => void;
}

export type ClientToServerEvents = {
  [EventName in keyof typeof handlers]: (
    data: z.infer<typeof handlers[EventName]['argSchema']>,
    cb: (
      error: unknown,
      data: z.infer<typeof handlers[EventName]['returnSchema']>
    ) => void
  ) => void;
};

interface InterServerEvents {}

interface SocketData {
  player: Player;
  token: string;
  isTokenFromHandshake: boolean;
}

export type SocketIoServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type SocketIoSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
