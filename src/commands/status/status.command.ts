import { DescribeTasksCommand, ECSClient, ListTasksCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { checkStackStatus, clusterArn, serviceExists, serviceName } from '@utils';

export async function status(serverName: string): Promise<string> {
  const stackStatus = await checkStackStatus(serverName);
  if (stackStatus.toLowerCase() != 'update_complete' || stackStatus.toLowerCase() != 'create_complete') {
    return stackStatus.toLowerCase();
  }

  const exists = await serviceExists(serverName);
  if (!exists) {
    return 'stopped';
  }

  const cache = await CacheFactory.getInstance();
  const client = new ECSClient({ region: cache.aws.region });
  const arn = await clusterArn(serverName);
  const res = await client.send(new ListTasksCommand({ cluster: arn, serviceName: serviceName(serverName) }));

  if (res?.taskArns?.length == 0) {
    return 'stopped';
  }

  const taskArn = res?.taskArns?.[0] || '';

  try {
    const arn = await clusterArn(serverName);
    const res = await client.send(
      new DescribeTasksCommand({
        cluster: arn,
        tasks: [taskArn],
      }),
    );

    return res?.tasks?.[0]?.lastStatus?.toLowerCase() || 'launching';
  } catch (err) {
    return 'stopped';
  }
}
