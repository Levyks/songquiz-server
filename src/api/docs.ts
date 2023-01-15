import { HttpResponse } from 'uWebSockets.js';
import zodToJsonSchema from 'zod-to-json-schema';

import { getCallables } from '@/socket/metadata.socket';
import { SocketHandler } from '@/socket/handler.socket';

export function getDocs(res: HttpResponse) {
  const callables = getCallables(SocketHandler);
  //callable.payloadSchema
  const docs = callables.map((callable) => ({
    eventName: callable.eventName,
    payloadSchema: zodToJsonSchema(callable.payloadSchema),
    returnSchema: zodToJsonSchema(callable.returnSchema),
  }));

  res.writeHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(docs));
}
