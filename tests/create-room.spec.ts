import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import { useServer, useSockets } from './helpers/hooks';
import chaiAsPromised from 'chai-as-promised';
import { config } from '@/config';
import { emit } from './helpers/socket';
import { roomVaultService } from '@/services';
import { zodRoomDto } from '@/dtos/room.dtos';

chai.use(chaiAsPromised);

describe('Create room', () => {
  useServer();

  const { newSocketWaitForSyncToken } = useSockets();

  it('should create a room', async () => {
    const { socket } = await newSocketWaitForSyncToken();

    const nickname = 'nickname';

    const numberOfRooms = roomVaultService.getNumberOfRooms();

    const room = await emit(socket, 'createRoom', { nickname });

    console.log('room', room);

    expect(zodRoomDto.safeParse(room)).to.have.property('success', true);

    expect(room.leader).to.equal(nickname);

    expect(roomVaultService.getNumberOfRooms()).to.equal(numberOfRooms + 1);
  });

  it('should not create a room if nickname is not provided', async () => {
    const { socket } = await newSocketWaitForSyncToken();

    const numberOfRooms = roomVaultService.getNumberOfRooms();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(emit(socket, 'createRoom', {} as any)).to.eventually.be.rejected;

    expect(roomVaultService.getNumberOfRooms()).to.equal(numberOfRooms);
  });

  it('should not create a room if nickname is not a string', async () => {
    const { socket } = await newSocketWaitForSyncToken();

    const numberOfRooms = roomVaultService.getNumberOfRooms();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(emit(socket, 'createRoom', { nickname: 1 as any })).to.eventually.be
      .rejected;

    expect(roomVaultService.getNumberOfRooms()).to.equal(numberOfRooms);
  });

  it('should not create a room if nickname is too short', async () => {
    const { socket } = await newSocketWaitForSyncToken();

    const numberOfRooms = roomVaultService.getNumberOfRooms();

    expect(
      emit(socket, 'createRoom', {
        nickname: 'a'.repeat(config.room.nickname.minLength - 1),
      })
    ).to.eventually.be.rejected;

    expect(roomVaultService.getNumberOfRooms()).to.equal(numberOfRooms);
  });

  it('should not create a room if nickname is too long', async () => {
    const { socket } = await newSocketWaitForSyncToken();

    const numberOfRooms = roomVaultService.getNumberOfRooms();

    expect(
      emit(socket, 'createRoom', {
        nickname: 'a'.repeat(config.room.nickname.maxLength + 1),
      })
    ).to.eventually.be.rejected;

    expect(roomVaultService.getNumberOfRooms()).to.equal(numberOfRooms);
  });
});
