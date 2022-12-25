import { z } from 'zod';
import { defineHandler as h } from '@/helpers/handlers.helper';
import { roomVaultService } from '@/services';
import { Room } from '@/models/room.model';
import { zodNickname, zodRoomCode } from '@/helpers/validation';
import { mapRoomToRoomDto } from '@/mappers/room.mappers';
import { zodRoomDto } from '@/dtos/room.dtos';

export const roomsHandlers = {
  createRoom: h(
    z.object({ nickname: zodNickname }),
    ({ io, socket }, { nickname }) => {
      const code = roomVaultService.getAvailableCode();
      const room: Room = new Room(io, code, nickname);
      const player = room.leader;
      player.connect(socket);
      roomVaultService.store(room);

      return mapRoomToRoomDto(room);
    },
    zodRoomDto
  ),
  joinRoom: h(
    z.object({ roomCode: zodRoomCode, nickname: zodNickname }),
    ({ socket }, { roomCode, nickname }) => {
      const room = roomVaultService.retrieve(roomCode);
      room.joinPlayer(nickname).connect(socket);
    },
    z.void()
  ),
} as const;
