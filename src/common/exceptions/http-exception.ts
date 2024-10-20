import { ErrorCode, HttpCode } from '@common/enums';
import { Exception } from './exception';

type HttpExceptionProps = {
  status: HttpCode;
  code: ErrorCode;
  message: string;
  cause?: Error;
};

export class HttpException extends Exception {
  readonly status: HttpCode;

  constructor(props: HttpExceptionProps) {
    super(props);

    this.status = props.status;
  }
}
