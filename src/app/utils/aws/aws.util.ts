import { DescribeStacksCommand, UpdateStackCommand } from '@aws-sdk/client-cloudformation';
import { DescribeServicesCommand, ListServicesCommand } from '@aws-sdk/client-ecs';
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
  const arn = await clusterArn(clusterName);
  return CacheFactory.getInstance()
    .aws.clients.ecs.send(new ListServicesCommand({ cluster: arn }))
    .then((res) => {
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
  const cache = CacheFactory.getInstance();
  return `arn:aws:ecs:${cache.aws.region}:${cache.aws.accountId}:cluster/${clusterName(serverName)}`;
}

export function serviceName(serverName: string) {
  return `ezmc-${serverName}-ecs-service`;
}

export const stackExistsOrThrow = async (serverName: string): Promise<void> => {
  try {
    const response = await CacheFactory.getInstance().aws.clients.cfn.send(
      new DescribeStacksCommand({
        StackName: 'ezmc-' + serverName,
      }),
    );

    if (response.Stacks && response.Stacks.length > 0) {
      return;
    } else {
      throw new Error(`${serverName} does not exist`);
    }
  } catch (error: any) {
    if (error.name === 'ValidationError' && error.message.includes('does not exist')) {
      throw new Error(`${serverName} does not exist`);
    } else {
      throw error;
    }
  }
};

export async function serviceExists(serverName) {
  return CacheFactory.getInstance()
    .aws.clients.ecs.send(
      new DescribeServicesCommand({
        cluster: clusterName(serverName),
        services: [serviceName(serverName)],
      }),
    )
    .then((res) => res?.services?.length > 0);
}

export const stack = async (serverName: string) => {
  const command = new DescribeStacksCommand({ StackName: stackName(serverName) });
  const response = await CacheFactory.getInstance().aws.clients.cfn.send(command);
  if (response.Stacks && response.Stacks.length > 0) {
    return response.Stacks[0];
  } else {
    throw new Error(`${serverName} not found`);
  }
};

export const stackStatus = async (serverName: string): Promise<string> => {
  return stack(serverName)
    .then((stack) => {
      return stack?.StackStatus?.toLowerCase() || 'unknown';
    })
    .catch(() => {
      return 'unknown';
    });
};

export async function getStackParameter(serverName: string, key: string) {
  try {
    const res = await CacheFactory.getInstance().aws.clients.cfn.send(
      new DescribeStacksCommand({ StackName: stackName(serverName) }),
    );
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
  try {
    await CacheFactory.getInstance().aws.clients.cfn.send(
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
