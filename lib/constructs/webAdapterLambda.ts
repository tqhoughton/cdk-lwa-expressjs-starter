import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib"
import path from "path"

export interface WebAdapterLambdaProps {
  
}

export class WebAdapterLambda extends Construct {
  url: lambda.IFunctionUrl

  constructor(
    scope: Construct,
    id: string,
    props: WebAdapterLambdaProps
  ) {
    super(scope, id);
    
    const webAdapterFn = new lambda.DockerImageFunction(this, "DockerImageLambda", {
      functionName: "htmx-lambda-service",
      timeout: cdk.Duration.seconds(29),
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      environment: {
        RUST_LOG: "info",
        AWS_LWA_INVOKE_MODE: "response_stream"
      },
      code: lambda.DockerImageCode.fromImageAsset(path.resolve(__dirname, "../../"))
    })

    this.url = webAdapterFn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM
    })
  }
}
