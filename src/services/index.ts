import { container, inject } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';
import { RandomService, RandomServiceImpl } from './random.service';
import { RoomVaultService, RoomVaultServiceImpl } from './room-vault.service';

type ServiceDefinition<T> = {
  key: string;
  impl: constructor<T>;
  get: () => T;
};

function def<T>(key: string, impl: constructor<T>): ServiceDefinition<T> {
  return {
    key,
    impl,
    get: () => {
      console.log('key', key);
      return container.resolve<T>(key);
    },
  };
}

export const services = {
  roomVault: def<RoomVaultService>('roomVaultService', RoomVaultServiceImpl),
  random: def<RandomService>('randomService', RandomServiceImpl),
} as const;

export function registerServices() {
  for (const def of Object.values(services)) {
    container.register(def.key, {
      useClass: def.impl as constructor<unknown>,
    });
  }
}

export function injectService<T>(service: ServiceDefinition<T>) {
  return inject(service.key);
}

export { RandomService, RoomVaultService };
