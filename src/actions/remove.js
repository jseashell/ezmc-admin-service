import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';

export async function remove(serverName) {
  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  return new CloudFormationClient({ region: region }).send(
    new DeleteStackCommand({
      StackName: 'ezmc-' + serverName,
    }),
  );
}
