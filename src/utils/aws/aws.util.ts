import { CloudFormationClient, DescribeStacksCommand, UpdateStackCommand } from '@aws-sdk/client-cloudformation';
import { DescribeServicesCommand, ECSClient, ListServicesCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';

export function stackName(serverName: string) {
  return `ezmc-${serverName}`;
}

/**
 * Gets the arn of the first service for the given cluster
 * @param clusterName
 * @returns service arn
 */
export async function serviceArn(clusterName: string) {
  const cache = await CacheFactory.getInstance();
  const client = new ECSClient({ region: cache.aws.region });
  const arn = await clusterArn(clusterName);
  return client.send(new ListServicesCommand({ cluster: arn })).then((res) => {
    return res.serviceArns?.[0] || '';
  });
}

export function clusterName(serverName: string) {
  return `ezmc-${serverName}-cluster`;
}

/**
 * @param serverName
 * @returns arn for this region/account for the given cluster
 */
export async function clusterArn(serverName: string) {
  const cache = await CacheFactory.getInstance();
  return `arn:aws:ecs:${cache.aws.region}:${cache.aws.accountId}:cluster/${clusterName(serverName)}`;
}

export function serviceName(serverName: string) {
  return `ezmc-${serverName}-ecs-service`;
}

export const stackExists = async (serverName: string) => {
  try {
    const cache = await CacheFactory.getInstance();
    const client = new CloudFormationClient({ region: cache.aws.region });
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

export async function serviceExists(serverName) {
  const cache = await CacheFactory.getInstance();
  const client = new ECSClient({ region: cache.aws.region });
  return client
    .send(
      new DescribeServicesCommand({
        cluster: clusterName(serverName),
        services: [serviceName(serverName)],
      }),
    )
    .then((res) => res?.services?.length > 0);
}

export const checkStackStatus = async (serverName: string) => {
  const cache = await CacheFactory.getInstance();
  const client = new CloudFormationClient({ region: cache.aws.region });

  try {
    const command = new DescribeStacksCommand({ StackName: stackName(serverName) });
    const response = await client.send(command);

    if (response.Stacks && response.Stacks.length > 0) {
      const stackStatus = response.Stacks[0].StackStatus || 'UNKNOWN';
      return stackStatus.toLowerCase();
    } else {
      return 'unknown';
    }
  } catch (error) {
    return 'unknown';
  }
};

export async function getStackParameter(serverName: string, key: string) {
  const cache = await CacheFactory.getInstance();
  const client = new CloudFormationClient({ region: cache.aws.region });

  try {
    const res = await client.send(new DescribeStacksCommand({ StackName: stackName(serverName) }));
    const parameters = res.Stacks[0].Parameters;
    const parameter = parameters.find((param) => param.ParameterKey === key);
    if (parameter) {
      return parameter.ParameterValue;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function updateStackParameter(serverName: string, key: string, value: string) {
  const cache = await CacheFactory.getInstance();
  const client = new CloudFormationClient({ region: cache.aws.region });

  try {
    await client.send(
      new UpdateStackCommand({
        StackName: stackName(serverName),
        UsePreviousTemplate: true,
        Parameters: [
          {
            ParameterKey: key,
            ParameterValue: value,
          },
        ],
        Capabilities: ['CAPABILITY_NAMED_IAM'],
      }),
    );
  } catch (error: any) {
    console.error('failed to update server');
  }
}
