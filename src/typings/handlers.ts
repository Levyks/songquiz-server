import { z } from 'zod';
import { Server, Socket } from 'socket.io';

type Context = { io: Server; socket: Socket };

export type Middleware<Schema extends z.Schema> = (
  context: Context,
  data: z.infer<Schema>
) => void | Promise<void>;

export type Handler<
  ArgSchema extends z.Schema,
  ReturnSchema extends z.Schema
> = (
  context: Context,
  data: z.infer<ArgSchema>
) => z.infer<ReturnSchema> | Promise<z.infer<ReturnSchema>>;

export type HandlerDefinition<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ArgSchema extends z.Schema = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReturnSchema extends z.Schema = any
> = {
  argSchema: ArgSchema;
  returnSchema: ReturnSchema;
  handler: Handler<ArgSchema, ReturnSchema>;
  middleware: Middleware<ArgSchema>[];
};
