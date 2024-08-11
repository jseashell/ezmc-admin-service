import { Capability, CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export async function newServer(serverName) {
  const path = resolve('./src/templates/default.yml');
  const templateBody = readFileSync(path).toString();

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  const client = new CloudFormationClient({ region: region });
  return client.send(
    new CreateStackCommand({
      StackName: `ezmc-${serverName}`,
      Capabilities: [Capability.CAPABILITY_IAM],
      TemplateBody: templateBody,
    }),
  );
}
