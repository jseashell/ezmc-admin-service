import { Capability, CloudFormationClient, CreateStackCommand } from '@aws-sdk/client-cloudformation';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export async function up(stackName) {
  const path = resolve('./src/functions/up/template.yml');
  const templateBody = readFileSync(path).toString();

  const client = new CloudFormationClient({ region: process.env.REGION });
  return client.send(
    new CreateStackCommand({
      StackName: stackName,
      Capabilities: [Capability.CAPABILITY_IAM],
      TemplateBody: templateBody,
    }),
  );
}
