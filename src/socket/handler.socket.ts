import { ZodSchema } from 'zod';
import { Room } from '@/models/room.model';
import { mapRoomToRoomDto } from '@/mappers/room.mappers';
import { services } from '@/services';
import { Callable } from '@/socket/decorators.socket';
import { getCallables } from '@/socket/metadata.socket';
import { CreateRoomPayload, zodCreateRoomPayload } from '@/zod/payloads.zod';
import { zodRoomDto } from '@/zod/dtos.zod';
import {
  AckCallback,
  SocketIoServer,
  SocketIoSocket,
  CallableDefinition,
} from '@/socket/typings.socket';

export class SocketHandler {
  private readonly roomVaultService = services.roomVault.get();

  private get token() {
    return this.socket.data.token!;
  }

  constructor(public io: SocketIoServer, public socket: SocketIoSocket) {}

  onConnection() {
    this.socket.emit('syncToken', this.token);
  }

  // Callables

  @Callable(zodCreateRoomPayload, zodRoomDto)
  createRoom({ nickname }: CreateRoomPayload) {
    const code = this.roomVaultService.getAvailableCode();
    const room: Room = new Room(this.io, code, nickname);
    const player = room.leader;
    player.connect(this.socket);
    this.roomVaultService.store(room);

    return mapRoomToRoomDto(room);
  }

  // Inner workings to register all callables

  private registerCallable<
    PayloadSchema extends ZodSchema,
    ReturnSchema extends ZodSchema
  >(def: CallableDefinition<PayloadSchema, ReturnSchema>) {
    const callback = async (...args: unknown[]) => {
      const ack = args.pop() as AckCallback<ReturnSchema>;
      if (typeof ack !== 'function') return;

      try {
        const payload = def.payloadSchema.parse(args[0]);

        for (const middleware of def.middleware)
          await middleware.call(this, payload);

        const result = def.method.call(this, payload);

        ack(null, result instanceof Promise ? await result : result);
      } catch (err) {
        ack(err, null);
      }
    };

    this.socket.on(def.eventName, callback);
  }

  private registerAllCallables() {
    const callables = getCallables(this.constructor);
    callables.forEach(this.registerCallable.bind(this));
  }

  static register(io: SocketIoServer, socket: SocketIoSocket): SocketHandler {
    const handler = new SocketHandler(io, socket);
    socket.data.handler = handler;
    handler.registerAllCallables();
    handler.onConnection();
    return handler;
  }
}
