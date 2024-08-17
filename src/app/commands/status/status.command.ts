import { DescribeTasksCommand, ListTasksCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { clusterArn, serviceExists, serviceName, stackStatus } from '@utils';

export async function status(serverName: string): Promise<string> {
  const status = await stackStatus(serverName);
  if (status == 'update_complete') {
    return 'stopped. update complete';
  }

  if (status == 'create_complete') {
    return 'created';
  }

  const exists = await serviceExists(serverName);
  if (!exists) {
    return 'stopped';
  }

  const arn = await clusterArn(serverName);
  const res = await CacheFactory.getInstance().aws.clients.ecs.send(
    new ListTasksCommand({ cluster: arn, serviceName: serviceName(serverName) }),
  );

  if (res?.taskArns?.length == 0) {
    return 'stopped';
  }

  const taskArn = res?.taskArns?.[0] || '';

  try {
    const arn = await clusterArn(serverName);
    const res = await CacheFactory.getInstance().aws.clients.ecs.send(
      new DescribeTasksCommand({
        cluster: arn,
        tasks: [taskArn],
      }),
    );

    return res?.tasks?.[0]?.lastStatus?.toLowerCase().replace('_', ' ') || 'launching';
  } catch (err) {
    return 'stopped';
  }
}
