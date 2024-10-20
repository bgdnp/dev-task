import { Exception, HttpException, InternalServerException } from '@common/exceptions';
import { Response } from './response';
import { Request } from './request';

export function createLambdaHandler(handler: Http.Handler): Http.LambdaHandler {
  return async (event) => {
    try {
      const request = new Request(event);

      return await handler(request);
    } catch (err) {
      console.log(err);

      if (err instanceof HttpException) {
        return Response.failure(err);
      }

      if (err instanceof Exception) {
        return Response.failure(new InternalServerException(err.message, err));
      }

      return Response.failure(new InternalServerException());
    }
  };
}

export function lambdaToExpressAdapter(handler: Http.LambdaHandler): Http.ExpressHandler {
  return (req, res) => {
    handler({ queryStringParameters: req.query } as Http.LambdaEvent).then((result) => {
      res.status(result.statusCode).contentType('application/json').send(result.body);
    });
  };
}
