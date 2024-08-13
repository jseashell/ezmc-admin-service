import { ECSClient, ListServicesCommand } from '@aws-sdk/client-ecs';

/**
 * Gets the arn of the first service for the given cluster
 * @param clusterName
 * @returns service arn
 */
export async function getServiceArn(clusterName) {
  const client = new ECSClient({ region: process.env.AWS_REGION });
  return client
    .send(
      new ListServicesCommand({
        cluster: buildClusterArn(clusterName),
      }),
    )
    .then((res) => {
      return res.serviceArns?.[0] || '';
    });
}

/**
 * @param serverName
 * @returns arn for this region/account for the given cluster
 */
export function buildClusterArn(serverName) {
  const clusterName = `ezmc-${serverName}-cluster`;
  return `arn:aws:ecs:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:cluster/${clusterName}`;
}
