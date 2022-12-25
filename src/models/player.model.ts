import { Socket } from 'socket.io';
import { Room } from './room.model';

export class Player {
  socket?: Socket;
  score = 0;

  get connected() {
    return !!this.socket?.connected;
  }

  constructor(public readonly room: Room, public nickname: string) {}

  connect(socket: Socket) {
    socket.data.player = this;
    this.socket = socket;
  }
}
