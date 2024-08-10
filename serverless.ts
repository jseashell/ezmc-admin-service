import type { AWS } from '@serverless/typescript';

import { down, ipAddress, start, status, stop, up } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'ezmc-admin-service',
  frameworkVersion: '3',
  plugins: ['serverless-bundle', 'serverless-offline'],
  custom: {
    deploymentBucket: 'deployments-${aws:accountId}-${self:provider.region}',
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-east-1',
    stage: "${opt:stage, 'main'}",
    deploymentBucket: {
      name: '${self:custom.deploymentBucket}',
    },
    stackTags: {
      stage: '${sls:stage}',
      region: '${self:provider.region}',
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      AWS_ACCOUNT_ID: '${aws:accountId}',
      REGION: '${self:provider.region}',
    },
    logs: {
      frameworkLambda: true,
      restApi: {
        accessLogging: true,
        executionLogging: true,
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'cloudformation:CreateStack',
              'cloudformation:DeleteStack',
              'ec2:DescribeImages',
              'ec2:DescribeInstances',
              'ecs:DescribeContainerInstances',
              'ecs:DescribeServices',
              'ecs:DescribeTasks',
              'ecs:ListContainerInstances',
              'ecs:ListServices',
              'ecs:ListTasks',
              'ecs:UpdateService',
              'elasticfilesystem:CreateFileSystem',
              'elasticfilesystem:DeleteFileSystem',
              'ssm:GetParameters',
              'ec2:AssociateRouteTable',
              'ec2:AttachInternetGateway',
              'ec2:CreateRoute',
              'ec2:CreateSubnet',
              'ec2:CreateVpc',
              'ec2:CreateRouteTable',
              'ec2:CreateRoute',
              'ec2:CreateInternetGateway',
              'ec2:DeleteRoute',
              'ec2:DeleteRouteTable',
              'ec2:DescribeAvailabilityZones',
              'ec2:ModifyVpcAttribute',
              'ec2:ReplaceRoute',
            ],
            Resource: ['*'],
          },
        ],
      },
    },
  },
  package: { individually: true },
  // import the function via paths
  functions: { down, ipAddress, start, status, stop, up },
};

module.exports = serverlessConfiguration;
