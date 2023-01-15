import { services } from '@/services';
import { config } from '@/config';
import { Room } from '@/models/room.model';
import { RandomService } from '@/services';

export interface RoomVaultService {
  retrieve(roomCode: string): Room;
  getAvailableCode(): string;
  store(room: Room): void;
  getNumberOfRooms(): number;
}

export class RoomVaultServiceImpl implements RoomVaultService {
  private rooms = new Map<string, Room>();
  private reservedCodes = new Set<string>();
  private readonly randomService: RandomService = services.random.get();

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
      const code = this.randomService.generateNumericString(codeLength);

      if (!this.rooms.has(code) && !this.reservedCodes.has(code)) {
        this.reservedCodes.add(code);
        return code;
      }
    } while (++currentAttempt < maxAttempts);

    throw new Error('Unable to generate a unique room code');
  }

  store(room: Room) {
    this.rooms.set(room.code, room);
    this.reservedCodes.delete(room.code);
  }

  getNumberOfRooms() {
    return this.rooms.size;
  }
}
