import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class SsmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a basic SSM Parameter Store parameter
    const demoSSM = new ssm.StringParameter(this, 'demoSsmLID', {
      parameterName: '/vpc/NetworkVPC',
      stringValue: 'vpc-08416406807c76ea7'
    });
  }
}
