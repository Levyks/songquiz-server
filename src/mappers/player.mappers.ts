import { PlayerDto } from '@/dtos/player.dtos';
import { Player } from '@/models/player.model';

export const mapPlayerToPlayerDto = (player: Player): PlayerDto => ({
  nickname: player.nickname,
  score: player.score,
  connected: player.connected,
});
