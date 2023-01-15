import { z, ZodSchema } from 'zod';
import { addCallable } from './metadata.socket';

import { Middleware } from '@/typings/callables';

export function Callable<
  PayloadSchema extends ZodSchema,
  ReturnSchema extends ZodSchema
>(
  payloadSchema: PayloadSchema,
  returnSchema: ReturnSchema,
  middleware: Middleware<PayloadSchema>[] | Middleware<PayloadSchema> = []
) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<
      (payload: z.infer<PayloadSchema>) => z.infer<ReturnSchema>
    >
  ) {
    if (!descriptor.value || typeof descriptor.value !== 'function')
      throw new Error('Callable decorator can only be used on methods');

    addCallable(target.constructor, {
      eventName: propertyKey,
      payloadSchema,
      returnSchema,
      method: descriptor.value,
      middleware: Array.isArray(middleware) ? middleware : [middleware],
    });
  };
}
