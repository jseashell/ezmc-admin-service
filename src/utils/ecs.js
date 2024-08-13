import { ECSClient, ListServicesCommand } from '@aws-sdk/client-ecs';

/**
 * Gets the arn of the first service for the given cluster
 * @param clusterName
 * @returns service arn
 */
export async function serviceArn(clusterName) {
  const client = new ECSClient({ region: process.env.AWS_REGION });
  return client
    .send(
      new ListServicesCommand({
        cluster: clusterArn(clusterName),
      }),
    )
    .then((res) => {
      return res.serviceArns?.[0] || '';
    });
}

export function clusterName(serverName) {
  return `ezmc-${serverName}-cluster`;
}
/**
 * @param serverName
 * @returns arn for this region/account for the given cluster
 */
export function clusterArn(serverName) {
  return `arn:aws:ecs:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:cluster/${clusterName(serverName)}`;
}

export function serviceName(serverName) {
  return `ezmc-${serverName}-ecs-service`;
}
