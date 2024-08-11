import { CloudFormationClient, DeleteStackCommand } from '@aws-sdk/client-cloudformation';

export async function down(stackName) {
  return new CloudFormationClient({ region: process.env.REGION }).send(
    new DeleteStackCommand({
      StackName: stackName,
    }),
  );
}
