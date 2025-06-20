import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SecurityStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an IAM Role that can be used by EC2 instances
    const demoRole = new iam.Role(this, 'DemoRole', {
      assumedBy: new cdk.aws_iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    demoRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')
    );

    //Use CfnOutput to make use of this role in the Webserver Stack
    const demoIam = new cdk.CfnOutput(this, 'DemoIamRole', {
      value: demoRole.roleArn,
      description: 'The IAM Role ARN for EC2 instances',
      exportName: 'DemoIamRoleArn',});
    }
} 
