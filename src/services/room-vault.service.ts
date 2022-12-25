import { config } from '@/config';
import { Room } from '@/models/room.model';
import { randomService } from '.';

export interface RoomVaultService {
  retrieve: (roomCode: string) => Room;
  getAvailableCode: () => string;
  store: (room: Room) => void;
  getNumberOfRooms: () => number;
}

export class RoomVaultServiceImpl implements RoomVaultService {
  private rooms = new Map<string, Room>();
  private reservedCodes = new Set<string>();

  retrieve(roomCode: string) {
    const room = this.rooms.get(roomCode);
    if (!room) throw new Error('Room not found');
    return room;
  }

  getAvailableCode() {
    const codeLength = config.room.code.length;
    const maxAttempts = config.room.code.maxAttempts;

    let currentAttempt = 0;

    do {
      const code = randomService.generateNumericString(codeLength);

      if (!this.rooms.has(code) && !this.reservedCodes.has(code)) {
        this.reservedCodes.add(code);
        return code;
      }
    } while (++currentAttempt < maxAttempts);

    throw new Error('Unable to generate a unique room code');
  }

  store(room: Room) {
    this.reservedCodes.delete(room.code);
    this.rooms.set(room.code, room);
  }

  getNumberOfRooms() {
    return this.rooms.size;
  }
}
