import { RoomRoundsType, RoomStatus } from '@/enums/game.enums';
import {
  zodNumberOfRounds,
  zodRoomCode,
  zodSecondsPerRound,
} from '@/helpers/validation';
import { z } from 'zod';
import { zodPlayerDto } from './player.dtos';

export const zodRoomDto = z.object({
  code: zodRoomCode,
  players: zodPlayerDto.array(),
  leader: z.string(),
  status: z.nativeEnum(RoomStatus),
  roundsType: z.nativeEnum(RoomRoundsType),
  numberOfRounds: zodNumberOfRounds,
  secondsPerRound: zodSecondsPerRound,
});

export type RoomDto = z.infer<typeof zodRoomDto>;
