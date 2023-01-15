import { Server, Socket } from 'socket.io';
import { z, ZodSchema } from 'zod';
import { SocketHandler } from './handler.socket';

export type AckCallback<Data = unknown> = (
  ...args: [unknown, null] | [null, Data]
) => void;

export interface ServerToClientEvents {
  playerDisconnected: (nickname: string) => void;
  syncToken: (token: string) => void;
}

type ClientToServerEvents = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InterServerEvents {}

interface SocketData {
  handler: SocketHandler;
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

export type Middleware<PayloadSchema extends ZodSchema> = (
  data: z.infer<PayloadSchema>
) => void | Promise<void>;

export type CallableDefinition<
  PayloadSchema extends ZodSchema,
  ReturnSchema extends ZodSchema
> = {
  eventName: string;
  payloadSchema: ZodSchema;
  returnSchema: ZodSchema;
  method: (
    payload: z.infer<PayloadSchema>
  ) => z.infer<ReturnSchema> | Promise<z.infer<ReturnSchema>>;
  middleware: Middleware<PayloadSchema>[];
};

export type GenericCallableDefinition = CallableDefinition<
  ZodSchema,
  ZodSchema
>;
