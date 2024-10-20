import { createLambdaHandler, Response } from '@app/http';
import { SwapiService } from '@services/swapi';

export const handler = createLambdaHandler(async (request) => {
  const service = new SwapiService();

  const people = await service.searchPeople(request.query['keyword']);

  return Response.ok(people);
});
