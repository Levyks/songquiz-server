import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/typings/socket-io';
import { handlers } from '@/handlers';
import { z } from 'zod';

export type SocketIoClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export type RawEmit<Ev extends keyof typeof handlers> = (
  event: Ev,
  data: z.infer<typeof handlers[Ev]['argSchema']>,
  cb: (
    error: unknown,
    data: z.infer<typeof handlers[Ev]['returnSchema']>
  ) => void
) => void;
