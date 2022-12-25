import { config } from '@/config';
import { randomService } from '@/services';
import { SocketIoSocket } from '@/typings/socket-io';

export const generateTokenIfNeededMiddleware = async (
  socket: SocketIoSocket,
  next: (err?: Error) => void
) => {
  const tokenLength = config.socket.token.length;
  const handshakeToken = socket.handshake.auth.token;

  if (
    handshakeToken &&
    typeof handshakeToken === 'string' &&
    handshakeToken.length === tokenLength
  ) {
    socket.data = {
      ...socket.data,
      token: handshakeToken,
      isTokenFromHandshake: true,
    };
    return next();
  }

  const token = await randomService.generateSecureBase64String(tokenLength);

  socket.data = {
    ...socket.data,
    token,
    isTokenFromHandshake: false,
  };

  return next();
};

export const syncToken = (socket: SocketIoSocket) => {
  if (socket.data.token) socket.emit('syncToken', socket.data.token);
};
