import { z } from 'zod';
import { zodNickname } from './commons.zod';

export const zodCreateRoomPayload = z.object({
  nickname: zodNickname,
});

export type CreateRoomPayload = z.infer<typeof zodCreateRoomPayload>;
