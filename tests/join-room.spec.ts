import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import { useRooms, useServer, useSockets } from './helpers/hooks';
import chaiAsPromised from 'chai-as-promised';
import { config } from '@/config';
import { emit } from './helpers/socket';
import { roomVaultService } from '@/services';

chai.use(chaiAsPromised);

describe('Join room', () => {
  const { getServerSocket } = useServer();
  const { newRoom } = useRooms();

  const { newSocketWaitForSyncToken } = useSockets();

  it('should join a room', async () => {
    const { roomCode } = await newRoom();

    const { socket } = await newSocketWaitForSyncToken();

    const nickname = 'nickname';
    await emit(socket, 'joinRoom', { roomCode, nickname });

    const serverSocket = getServerSocket(socket);

    expect(serverSocket.data.player?.nickname).to.equal(nickname);
    expect(serverSocket.data.player?.room?.code).to.equal(roomCode);
  });

  it('should not join a room if room code is not provided', async () => {
    const { socket } = await newSocketWaitForSyncToken();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(emit(socket, 'joinRoom', { nickname: 'nickname' } as any)).to
      .eventually.be.rejected;

    expect(getServerSocket(socket).data.player).to.be.undefined;
  });

  it('should not join a room if room code is not a string', async () => {
    const { socket } = await newSocketWaitForSyncToken();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      emit(socket, 'joinRoom', { roomCode: 1 as any, nickname: 'nickname' })
    ).to.eventually.be.rejected;

    expect(getServerSocket(socket).data.player).to.be.undefined;
  });

  it('should not join a room if room with code does not exist', async () => {
    const roomCode = roomVaultService.getAvailableCode();

    const { socket } = await newSocketWaitForSyncToken();

    expect(emit(socket, 'joinRoom', { roomCode, nickname: 'nickname' })).to
      .eventually.be.rejected;

    expect(getServerSocket(socket).data.player).to.be.undefined;
  });

  it('should not join a room if nickname is not provided', async () => {
    const { roomCode } = await newRoom();

    const { socket } = await newSocketWaitForSyncToken();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(emit(socket, 'joinRoom', { roomCode } as any)).to.eventually.be
      .rejected;

    expect(getServerSocket(socket).data.player).to.be.undefined;
  });

  it('should not create a room if nickname is not a string', async () => {
    const { roomCode } = await newRoom();

    const { socket } = await newSocketWaitForSyncToken();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(emit(socket, 'joinRoom', { roomCode, nickname: 1 as any })).to
      .eventually.be.rejected;

    expect(getServerSocket(socket).data.player).to.be.undefined;
  });

  it('should not create a room if nickname is too short', async () => {
    const { roomCode } = await newRoom();
    const { socket } = await newSocketWaitForSyncToken();

    expect(
      emit(socket, 'joinRoom', {
        roomCode,
        nickname: 'a'.repeat(config.room.nickname.minLength - 1),
      })
    ).to.eventually.be.rejected;

    expect(getServerSocket(socket).data.player).to.be.undefined;
  });

  it('should not create a room if nickname is too long', async () => {
    const { roomCode } = await newRoom();
    const { socket } = await newSocketWaitForSyncToken();

    expect(
      emit(socket, 'joinRoom', {
        roomCode,
        nickname: 'a'.repeat(config.room.nickname.maxLength + 1),
      })
    ).to.eventually.be.rejected;

    expect(getServerSocket(socket).data.player).to.be.undefined;
  });
});
