import { Capability, CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import type { ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { formatJsonError, formatJsonResponse } from '@libs/api-gateway';
import { formatStackName } from '@libs/ecs';
import { middyfy } from '@libs/lambda';

import { readFileSync } from 'fs';
import { resolve } from 'path';
import schema from './schema';

const up: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  const accountId = event.body.accountId;
  const serverName = event.body.serverName;
  const stackName = formatStackName(accountId, serverName);

  const path = resolve('./src/functions/up/template.yml');
  const templateBody = readFileSync(path).toString();

  const client = new CloudFormationClient({ region: process.env.REGION });
  return client
    .send(
      new CreateStackCommand({
        StackName: stackName,
        Capabilities: [Capability.CAPABILITY_IAM],
        TemplateBody: templateBody,
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
