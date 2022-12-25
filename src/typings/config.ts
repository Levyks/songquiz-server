export type Config = {
  server: {
    port: number;
  };
  socket: {
    token: {
      length: number;
    };
  };
  room: {
    numberOfRounds: {
      min: number;
      max: number;
      default: number;
    };
    secondsPerRound: {
      min: number;
      max: number;
      default: number;
    };
    nickname: {
      minLength: number;
      maxLength: number;
    };
    code: {
      length: number;
      maxAttempts: number;
    };
  };
};
