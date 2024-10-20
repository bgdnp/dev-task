import { ErrorCode, HttpCode } from '@common/enums';
import { Exception } from './exception';
import { HttpException } from './http-exception';

export class CacheException extends Exception {
  constructor(message: string, cause?: Error) {
    super({ code: ErrorCode.CacheFailed, message, cause });
  }
}

export class InternalServerException extends HttpException {
  constructor(message?: string, cause?: Error) {
    super({
      status: HttpCode.InternalServerError,
      code: cause instanceof Exception ? cause.code : ErrorCode.InternalServerError,
      message: message ?? 'Internal server error.',
      cause,
    });
  }
}

export { Exception } from './exception';
export { HttpException } from './http-exception';
