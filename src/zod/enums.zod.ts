import { z } from 'zod';

// Room
export const zodRoomStatus = z.enum(['InLobby', 'InGame', 'Results']);
export type RoomStatus = z.infer<typeof zodRoomStatus>;

export const zodRoomRoundsType = z.enum(['Both', 'Song', 'Artist']);
export type RoomRoundsType = z.infer<typeof zodRoomRoundsType>;

// Round
export const zodRoundStatus = z.enum(['Waiting', 'InProgress', 'Ended']);
export type RoundStatus = z.infer<typeof zodRoundStatus>;

export const zodRoundType = z.enum(['Song', 'Artist']);
export type RoundType = z.infer<typeof zodRoundType>;
