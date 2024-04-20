#!/usr/bin/env node
import 'source-map-support/register';
import dotenv from 'dotenv';
import assert from 'assert';
import * as cdk from 'aws-cdk-lib';
import { HtmxLambdaServiceStack } from '../lib/htmx-lambda-service-stack';

dotenv.config();

const app = new cdk.App();

assert(process.env.ISSUER_BASE_URL);
assert(process.env.CLIENT_ID);
assert(process.env.SECRET);

const { ISSUER_BASE_URL, CLIENT_ID, SECRET } = process.env;

new HtmxLambdaServiceStack(app, 'HtmxLambdaServiceStack', {
  stackName: 'htmx-lambda-starter',
  env: { region: 'us-west-2' },
  oidc: { ISSUER_BASE_URL, CLIENT_ID, SECRET }
});
