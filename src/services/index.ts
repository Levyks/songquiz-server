import { RandomService, RandomServiceImpl } from './random.service';
import { RoomVaultService, RoomVaultServiceImpl } from './room-vault.service';

export const roomVaultService: RoomVaultService = new RoomVaultServiceImpl();
export const randomService: RandomService = new RandomServiceImpl();
