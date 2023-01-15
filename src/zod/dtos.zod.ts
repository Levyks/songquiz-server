import { z } from 'zod';
import {
  zodNickname,
  zodNumberOfRounds,
  zodRoomCode,
  zodScore,
  zodSecondsPerRound,
} from '@/zod/commons.zod';
import { zodRoomRoundsType, zodRoomStatus } from '@/zod/enums.zod';

export const zodPlayerDto = z.object({
  nickname: zodNickname,
  score: zodScore,
  connected: z.boolean(),
});

export type PlayerDto = z.infer<typeof zodPlayerDto>;

export const zodRoomDto = z.object({
  code: zodRoomCode,
  players: zodPlayerDto.array(),
  leader: zodNickname,
  status: zodRoomStatus,
  roundsType: zodRoomRoundsType,
  numberOfRounds: zodNumberOfRounds,
  secondsPerRound: zodSecondsPerRound,
});

export type RoomDto = z.infer<typeof zodRoomDto>;
