import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import path from "path"

export interface WebAdapterLambdaProps {
  
}

export class WebAdapterLambda extends Construct {
  public readonly url: lambda.CfnUrl

  constructor(
    scope: Construct,
    id: string,
    props: WebAdapterLambdaProps
  ) {
    super(scope, id);
    
    const webAdapterFn = new lambda.DockerImageFunction(this, "DockerImageLambda", {
      memorySize: 256,
      environment: {
        RUST_LOG: "info",
        AWS_LWA_INVOKE_MODE: "response_stream"
      },
      code: lambda.DockerImageCode.fromImageAsset(path.resolve(__dirname, "../../app"))
    })

    this.url = new lambda.CfnUrl(this, "DockerImageLambdaUrl", {
      targetFunctionArn: webAdapterFn.functionArn,
      authType: 'NONE',
      invokeMode: 'RESPONSE_STREAM'
    })
  }
}
