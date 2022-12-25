import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import { useServer, useSockets } from './helpers/hooks';
import chaiAsPromised from 'chai-as-promised';
import { config } from '@/config';

chai.use(chaiAsPromised);

describe('Token', () => {
  const token = 'a'.repeat(config.socket.token.length);
  const { getServerSocket } = useServer();
  const { newSocket, newSocketWaitForSyncToken } = useSockets();

  it('a token should be generated if not provided', async () => {
    const syncTokenPromise = new Promise<string>((resolve) => {
      const socket = newSocket();
      socket.on('syncToken', (token) => resolve(token));
    });

    expect(syncTokenPromise).to.eventually.be.a('string');
  });

  it('a token should not be generated if provided', () => {
    const syncTokenPromise = new Promise<string>((resolve) => {
      const socket = newSocket(token);
      socket.on('syncToken', (token) => resolve(token));
    });

    expect(syncTokenPromise).to.eventually.equal(token);
  });

  it('a provided token should be stored', async () => {
    const { socket, token: syncedToken } = await newSocketWaitForSyncToken(
      token
    );

    expect(syncedToken).to.equal(token);

    expect(getServerSocket(socket).data.token).to.equal(token);
  });
});
