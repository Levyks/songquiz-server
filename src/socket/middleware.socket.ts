import { config } from '@/config';
import { services } from '@/services';
import { SocketIoSocket } from '@/socket/typings.socket';

export async function ensureSocketHasToken(
  socket: SocketIoSocket,
  next: (err?: Error) => void
) {
  const tokenLength = config.socket.token.length;
  const handshakeToken = socket.handshake.auth.token;
  const randomService = services.random.get();

  const isHandshakeTokenValid: boolean =
    typeof handshakeToken === 'string' && handshakeToken.length === tokenLength;

  socket.data.token = isHandshakeTokenValid
    ? handshakeToken
    : await randomService.generateSecureBase64String(tokenLength);

  return next();
}
