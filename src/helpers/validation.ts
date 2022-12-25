import { z } from 'zod';
import { config } from '@/config';

export const zodNickname = z
  .string()
  .min(config.room.nickname.minLength)
  .max(config.room.nickname.maxLength);
export const zodRoomCode = z.string().length(config.room.code.length);

export const zodNumberOfRounds = z
  .number()
  .min(config.room.numberOfRounds.min)
  .max(config.room.numberOfRounds.max);

export const zodSecondsPerRound = z
  .number()
  .min(config.room.secondsPerRound.min)
  .max(config.room.secondsPerRound.max);
