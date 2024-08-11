import { ECSClient, ListClustersCommand } from '@aws-sdk/client-ecs';

export async function list() {
  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('Invalid AWS region');
  }

  return new ECSClient({
    region: region,
  })
    .send(new ListClustersCommand({}))
    .then((res) => {
      return res.clusterArns
        .filter((arn) => {
          const clusterName = arn.split('/').pop();
          return clusterName.startsWith('ezmc');
        })
        .map((cluster) => {
          // Ex: 'arn:aws:ecs:us-east-1:008908697155:cluster/ezmc-server-1-cluster'
          return cluster.split('ezmc-')[1].split('-cluster')[0];
        })
        .join('\n');
    });
}
