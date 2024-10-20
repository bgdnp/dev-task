declare namespace Http {
  type LambdaEvent = import('aws-lambda').APIGatewayProxyEventV2;
  type Result = Required<
    Pick<import('aws-lambda').APIGatewayProxyStructuredResultV2, 'body' | 'statusCode'>
  >;

  type Handler = (request: import('@app/http').Request) => Promise<Result>;
  type LambdaHandler = (event: LambdaEvent) => Promise<Result>;
  type ExpressHandler = (req: import('express').Request, res: import('express').Response) => void;
}
