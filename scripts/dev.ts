import { lambdaToExpressAdapter } from '@app/http';
import express from 'express';
import { handler as statusHandler } from '../src/functions/status';
import { handler as getSearchResultHandler } from '../src/functions/get-search-result';

const app = express();

app.get('/api/status', lambdaToExpressAdapter(statusHandler));
app.get('/api/search', lambdaToExpressAdapter(getSearchResultHandler));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`);
});
