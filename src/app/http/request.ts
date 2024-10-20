export class Request {
  readonly query: Record<string, string>;

  constructor(event: Http.LambdaEvent) {
    this.query = (event.queryStringParameters as Record<string, string>) ?? {};
  }
}
