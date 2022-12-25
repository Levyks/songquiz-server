import { handlers } from '@/handlers';
import { z } from 'zod';

import { RawEmit, SocketIoClient } from '../typings/socket-io';

export const emit = async <Ev extends keyof typeof handlers>(
  socket: SocketIoClient,
  event: Ev,
  data: z.infer<typeof handlers[Ev]['argSchema']>
): Promise<z.infer<typeof handlers[Ev]['returnSchema']>> => {
  return new Promise((resolve, reject) => {
    (socket.emit as RawEmit<Ev>)(event, data, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
};

const socket = null as unknown as SocketIoClient;

emit(socket, 'createRoom', { nickname: 'a' });
