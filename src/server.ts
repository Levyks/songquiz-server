import { App, TemplatedApp, us_listen_socket_close } from 'uWebSockets.js';
import { Server } from 'socket.io';
import signale from 'signale';
import { SocketIoServer } from './socket/typings.socket';
import { SocketHandler } from './socket/handler.socket';
import { getDocs } from './api/docs';
import { ensureSocketHasToken } from '@/socket/middleware.socket';

const createIoServer = (uwsApp: TemplatedApp): SocketIoServer => {
  const io: SocketIoServer = new Server({
    cors: {
      origin: '*',
    },
  });

  io.attachApp(uwsApp);

  io.use(ensureSocketHasToken);

  io.on('connection', SocketHandler.register.bind(SocketHandler, io));

  return io;
};

export const startServer = (
  port: number
): Promise<{
  app: TemplatedApp;
  stopServer: () => void;
  io: SocketIoServer;
}> => {
  const app = App();

  app.get('/docs', getDocs);

  const io = createIoServer(app);

  return new Promise((resolve, reject) => {
    app.listen(port, (token) => {
      if (!token) return reject('Port is already in use');
      signale.start(`Server is running on port ${port}`);
      const stopServer = () => {
        signale.complete('Server stopped');
        us_listen_socket_close(token);
      };
      resolve({ app, stopServer, io });
    });
  });
};
