import { Capability, CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import type { ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { formatJsonError, formatJsonResponse } from '@libs/api-gateway';
import { formatStackName } from '@libs/ecs';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const up: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('EVENT', event);

  const accountId = event.body.accountId;
  const serverName = event.body.serverName;
  const stackName = formatStackName(accountId, serverName);

  const client = new CloudFormationClient({ region: process.env.REGION });
  return client
    .send(
      new CreateStackCommand({
        StackName: stackName,
        Capabilities: [Capability.CAPABILITY_IAM],
        TemplateURL: 'https://ezmc-cf-templates.s3.amazonaws.com/game-server.yml',
        Tags: [
          {
            Key: 'AccountId',
            Value: accountId,
          },
          {
            Key: 'ServerName',
            Value: serverName,
          },
        ],
      }),
    )
    .then((res) => {
      console.log('Created new server', accountId, serverName);
      return formatJsonResponse({
        message: 'Success',
        data: res,
      });
    })
    .catch((err) => {
      console.error(err);
      return formatJsonError(err);
    });
};

export const main = middyfy(up);
