import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'

export class NetworkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create a basic VPC with one public subnet and CIDR - 10.0.0.0/16
    const demoNetworkVpc = new ec2.Vpc(this, 'DemoVpcLID', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 1, // Default is all AZs in the region
      vpcName : "NetworkVPC",
    });
    
  }
}
