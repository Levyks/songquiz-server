import { config } from '@/config';
import { RoomRoundsType, RoomStatus } from '@/enums/game.enums';
import { SocketIoServer } from '@/socket/typings.socket';
import { Player } from './player.model';

export class Room {
  channel: ReturnType<SocketIoServer['to']>;
  leader: Player;

  status = RoomStatus.InLobby;
  roundsType = RoomRoundsType.Both;
  numberOfRounds = config.room.numberOfRounds.default;
  secondsPerRound = config.room.secondsPerRound.default;

  private playersMap = new Map<string, Player>();

  get players() {
    return Array.from(this.playersMap.values());
  }

  constructor(io: SocketIoServer, public code: string, leaderNickname: string) {
    this.channel = io.to(`room:${code}`);
    this.leader = new Player(this, leaderNickname);
    this.playersMap.set(leaderNickname, this.leader);
  }

  joinPlayer(nickname: string) {
    if (this.playersMap.has(nickname))
      throw new Error('Nickname already taken');

    const player = new Player(this, nickname);
    this.playersMap.set(nickname, player);
    //this.channel.emit('playerJoined', nickname);
    return player;
  }

  onPlayerDisconnected(player: Player) {
    this.channel.emit('playerDisconnected', player.nickname);
  }
}
