import { ListClustersCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';

export async function list() {
  const servers = await CacheFactory.getInstance()
    .aws.clients.ecs.send(new ListClustersCommand({}))
    .then((res) => {
      return res?.clusterArns
        ?.filter((arn) => {
          const clusterName = arn.split('/').pop();
          return clusterName?.startsWith('ezmc');
        })
        .map((cluster) => {
          // Ex: 'arn:aws:ecs:us-east-1:008908697155:cluster/ezmc-server-1-cluster'
          return cluster.split('ezmc-')[1].split('-cluster')[0];
        })
        .sort((a, b) => a.localeCompare(b));
    });

  return (await Promise.all(servers)).join('\n');
}
