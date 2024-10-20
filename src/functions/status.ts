import { createLambdaHandler, Response } from '@app/http';

export const handler = createLambdaHandler(async () => {
  return Response.ok({ status: 'ok' });
});
