import { ErrorCode } from '@common/enums';

type ExceptionProps = {
  code: ErrorCode;
  message: string;
  cause?: Error;
};

export class Exception extends Error {
  readonly code: ErrorCode;

  constructor(props: ExceptionProps) {
    super(props.message, { cause: props.cause });

    this.code = props.code;
  }

  body() {
    return {
      code: this.code,
      message: this.message,
    };
  }

  json() {
    return JSON.stringify(this.body());
  }
}
