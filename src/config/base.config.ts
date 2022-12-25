import { Config } from '@/typings/config';

export const baseConfig: Config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  },
  socket: {
    token: {
      length: 32,
    },
  },
  room: {
    numberOfRounds: {
      min: 1,
      max: 20,
      default: 10,
    },
    secondsPerRound: {
      min: 5,
      max: 30,
      default: 15,
    },
    nickname: {
      minLength: 3,
      maxLength: 32,
    },
    code: {
      length: 4,
      maxAttempts: Math.pow(10, 9),
    },
  },
};
