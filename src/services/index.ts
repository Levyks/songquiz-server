import { RandomService, RandomServiceImpl } from './random.service';
import { RandomServiceTestImpl } from 'tests/overrides/services/random.service.test';
import { RoomVaultService, RoomVaultServiceImpl } from './room-vault.service';

const env = process.env.NODE_ENV;

export const roomVaultService: RoomVaultService = new RoomVaultServiceImpl();
export const randomService: RandomService =
  env === 'test' ? new RandomServiceTestImpl() : new RandomServiceImpl();
