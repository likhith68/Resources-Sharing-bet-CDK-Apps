import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as fs from 'fs';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';

export class WebserverStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use the VPC ID from SSm Parameter Store
    const vpcId = ssm.StringParameter.valueFromLookup(this, '/vpc/NetworkVPC');
    const vpcFromSSM = ec2.Vpc.fromLookup(this, 'VPCPickedFromSSM', { vpcId:vpcId });


    // Import the IAM Role ARN from the Security Stack
    const importedRoleArn = iam.Role.fromRoleArn(this, 'ImportedRoleArn', cdk.Fn.importValue('DemoIamRoleArn'));

    //Create a security group
    const demoSecurityGroup = new ec2.SecurityGroup(this, 'DemoSecurityGroup', {
      vpc: vpcFromSSM,
      description: 'Demo Security Group',
      allowAllOutbound: true,
    });

    // Add an ingress rule to allow HTTP traffic
    demoSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic from anywhere'
    );

    // Create an EC2 instance in the VPC with the security group
    const demoInstance = new ec2.Instance(this, 'DemoInstanceLID', {
      vpc: vpcFromSSM,
      instanceType: new ec2.InstanceType('t2.micro'),
      role: importedRoleArn,
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        edition: ec2.AmazonLinuxEdition.STANDARD,
        virtualization: ec2.AmazonLinuxVirt.HVM,
        storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
      }),
      securityGroup: demoSecurityGroup,
      associatePublicIpAddress: true, 
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

 const userDataScript = fs.readFileSync(path.join(__dirname, 'userdata.sh'), 'utf8');
  userDataScript.split('\n').forEach(line => {
    demoInstance.userData.addCommands(line);
  });
  
  demoInstance.userData.addCommands(userDataScript);
  }
}
