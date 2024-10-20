# dev-task

## Running locally

Install dependencies with `npm install` and start server with `npm run dev`.
Local environment by default use filesystem caching. Cache strategy is built behind an interface so any other strategies (like in memory, redis etc) can be implemented.

## Deployment

Service is built as serverless api. It can be deployed with `npm run deploy`. In cloud environment, I choose s3 as cache layer for pricing reasons, but as for local any other strategy can be implemented.
Already deployed version can be found on `https://deversity.bgdn.dev/api/search`

## Usage

Api exposes endpoint `/api/search` which can accept optional 'keyword' query parameter, like `/api/search?keyword=Skywalker`
