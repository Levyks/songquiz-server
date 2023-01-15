import {
  CallableDefinition,
  GenericCallableDefinition,
} from '@/typings/callables';
import { ZodSchema } from 'zod';

export const metadataKeys = {
  callables: 'callables',
} as const;

export function getCallables(target: object): GenericCallableDefinition[] {
  return Reflect.getMetadata(metadataKeys.callables, target) || [];
}

export function setCallables(
  target: object,
  callables: GenericCallableDefinition[]
): void {
  Reflect.defineMetadata(metadataKeys.callables, callables, target);
}

export function addCallable<
  PayloadSchema extends ZodSchema,
  ReturnSchema extends ZodSchema
>(
  target: object,
  callable: CallableDefinition<PayloadSchema, ReturnSchema>
): void {
  const callables = getCallables(target);
  callables.push(callable as GenericCallableDefinition);
  setCallables(target, callables);
}
