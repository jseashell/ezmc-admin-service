import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';

export function stackName(serverName: string) {
  return `ezmc-${serverName}`;
}

export const stackExists = async (serverName: string) => {
  try {
    const client = new CloudFormationClient({ region: process.env.AWS_REGION });
    const response = await client.send(
      new DescribeStacksCommand({
        StackName: 'ezmc-' + serverName,
      }),
    );

    if (response.Stacks && response.Stacks.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error.name === 'ValidationError' && error.message.includes('does not exist')) {
      return false;
    } else {
      throw error;
    }
  }
};

const checkStackStatus = async (stackName: string) => {
  const client = new CloudFormationClient({ region: 'us-east-1' });

  try {
    const command = new DescribeStacksCommand({ StackName: stackName });
    const response = await client.send(command);

    if (response.Stacks && response.Stacks.length > 0) {
      const stackStatus = response.Stacks[0].StackStatus || 'UNKNOWN';
      const rollbackStates = [
        'ROLLBACK_IN_PROGRESS',
        'ROLLBACK_COMPLETE',
        'ROLLBACK_FAILED',
        'UPDATE_ROLLBACK_IN_PROGRESS',
        'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
        'UPDATE_ROLLBACK_FAILED',
        'UPDATE_ROLLBACK_COMPLETE',
      ];

      if (stackStatus === 'DELETE_FAILED' || rollbackStates.includes(stackStatus)) {
        return stackStatus;
        // Handle the error or rollback accordingly
      } else {
        return 'HEALTHY';
      }
    } else {
      return 'UNKNOWN';
    }
  } catch (error) {
    return 'UNKNOWN';
  }
};
