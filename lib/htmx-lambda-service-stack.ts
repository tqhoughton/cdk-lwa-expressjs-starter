import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WebAdapterLambda } from './constructs/webAdapterLambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class HtmxLambdaServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HtmxLambdaServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const serviceLambda = new WebAdapterLambda(this, 'WebAdapterLambda', {})

    new cdk.CfnOutput(this, 'FunctionUrl', {
      description: 'The http url to invoke the service through',
      value: serviceLambda.url.url
    })
  }
}
