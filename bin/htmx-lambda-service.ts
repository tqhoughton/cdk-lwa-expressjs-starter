#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HtmxLambdaServiceStack } from '../lib/htmx-lambda-service-stack';

const app = new cdk.App();

new HtmxLambdaServiceStack(app, 'HtmxLambdaServiceStack', {
  stackName: 'htmx-lambda-starter',
  env: { region: 'us-west-2' }
});
