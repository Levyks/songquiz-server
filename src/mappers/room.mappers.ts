import { RoomDto } from '@/dtos/room.dtos';
import { Room } from '@/models/room.model';
import { mapPlayerToPlayerDto } from './player.mappers';

export const mapRoomToRoomDto = (room: Room): RoomDto => ({
  code: room.code,
  players: room.players.map(mapPlayerToPlayerDto),
  leader: room.leader.nickname,
  status: room.status,
  roundsType: room.roundsType,
  numberOfRounds: room.numberOfRounds,
  secondsPerRound: room.secondsPerRound,
});
