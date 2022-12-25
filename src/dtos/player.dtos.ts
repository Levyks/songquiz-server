import { zodNickname } from '@/helpers/validation';
import { z } from 'zod';

export const zodPlayerDto = z.object({
  nickname: zodNickname,
  score: z.number(),
  connected: z.boolean(),
});

export type PlayerDto = z.infer<typeof zodPlayerDto>;
