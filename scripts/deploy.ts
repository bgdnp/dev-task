#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../infra/stacks';
import { HostingStack } from '../infra/stacks/hosting-stack';

const app = new cdk.App();

const hosting = new HostingStack(app, 'StarWarsHosting', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1', // certificates must be in us-east-1
  },
});

const api = new ApiStack(app, 'StarWarsSearchApi', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'eu-central-1',
  },
  crossRegionReferences: true,
  hosting,
});

api.addDependency(hosting);
