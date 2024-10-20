import { HttpCode } from '@common/enums';
import { HttpException } from '@common/exceptions';

export class Response {
  static success(status: HttpCode, body: Record<string, any>): Http.Result {
    return {
      statusCode: status,
      body: JSON.stringify(body),
    };
  }

  static ok(body: Record<string, any>): Http.Result {
    return this.success(HttpCode.OK, body);
  }

  static failure(exception: HttpException): Http.Result {
    return {
      statusCode: exception.status,
      body: exception.json(),
    };
  }
}
