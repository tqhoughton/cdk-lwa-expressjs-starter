import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WebAdapterLambda } from './constructs/webAdapterLambda';

export interface HtmxLambdaServiceStackProps extends cdk.StackProps {
  oidc: {
    ISSUER_BASE_URL: string
    CLIENT_ID: string
    SECRET: string
  }
}

export class HtmxLambdaServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HtmxLambdaServiceStackProps) {
    super(scope, id, props);

    const serviceLambda = new WebAdapterLambda(this, 'WebAdapterLambda', {
      env: props.oidc
    });

    new cdk.CfnOutput(this, 'FunctionUrl', {
      description: 'The http url to invoke the service through',
      value: serviceLambda.fnUrl.url
    });
  }
}
