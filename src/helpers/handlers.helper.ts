import { z } from 'zod';
import { Handler, HandlerDefinition, Middleware } from '@/typings/handlers';
import { Socket } from 'socket.io';
import { SocketIoServer } from '@/typings/socket-io';

export const defineHandler = <
  ArgSchema extends z.Schema,
  ReturnSchema extends z.Schema
>(
  argSchema: ArgSchema,
  handler: Handler<ArgSchema, ReturnSchema>,
  returnSchema: ReturnSchema,
  middleware?: Middleware<ArgSchema> | Middleware<ArgSchema>[]
) => {
  const middlewareArray = middleware
    ? Array.isArray(middleware)
      ? middleware
      : [middleware]
    : [];
  return {
    argSchema,
    returnSchema,
    handler,
    middleware: middlewareArray,
  };
};
export const registerHandler = <
  ArgSchema extends z.Schema,
  ReturnSchema extends z.Schema
>(
  io: SocketIoServer,
  socket: Socket,
  eventName: string,
  handlerDefinition: HandlerDefinition<ArgSchema, ReturnSchema>
) => {
  const context = { io, socket };

  socket.on(eventName, async (...args: unknown[]) => {
    const callback = args.pop() as (error: unknown, result: unknown) => void;

    if (typeof callback !== 'function') return;

    try {
      if (args.length !== 1) throw new Error('Invalid args');

      const parsed = handlerDefinition.argSchema.parse(args[0]);

      for (const middleware of handlerDefinition.middleware) {
        const middlewareResult = middleware(context, parsed);
        if (middlewareResult instanceof Promise) await middlewareResult;
      }

      const handlerResult = handlerDefinition.handler(context, parsed);

      if (handlerResult instanceof Promise)
        return callback(null, await handlerResult);

      callback(null, handlerResult);
    } catch (error) {
      callback(error, null);
    }
  });
};
