import { DescribeTasksCommand, ECSClient, ListTasksCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { clusterArn, serviceExists, serviceName } from '@utils';

export async function status(serverName: string): Promise<string> {
  if ((await serviceExists(serverName)) == false) {
    console.log(`${serverName} does not exist`);
    return '';
  }

  const cache = await CacheFactory.getInstance();
  const client = new ECSClient({ region: cache.aws.region });
  const arn = await clusterArn(serverName);
  const res = await client.send(new ListTasksCommand({ cluster: arn, serviceName: serviceName(serverName) }));

  if (res?.taskArns?.length == 0) {
    return 'STOPPED';
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

    return res?.tasks?.[0]?.lastStatus || 'LAUNCHING';
  } catch (err) {
    return 'STOPPED';
  }
}
