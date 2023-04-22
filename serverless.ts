import type { AWS } from '@serverless/typescript';

import { down, ipAddress, start, status, stop, up } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'ezmc-admin-service',
  frameworkVersion: '3',
  plugins: ['serverless-bundle', 'serverless-offline'],
  custom: {
    deploymentBucket: 'deployments-${self:provider.region}',
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-east-1',
    stage: "${opt:stage, 'main'}",
    stackTags: {
      Stage: '${self:provider.stage}',
      Region: '${self:provider.region}',
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
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
            ],
            Resource: ['*'],
          },
          {
            Effect: 'Allow',
            Action: ['s3:GetObject'],
            Resource: ['arn:aws:s3:::ezmc-cf-templates/game-server.yml'],
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
