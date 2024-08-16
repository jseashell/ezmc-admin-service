import { DescribeInstancesCommand } from '@aws-sdk/client-ec2';
import { DescribeContainerInstancesCommand, ListContainerInstancesCommand } from '@aws-sdk/client-ecs';
import { CacheFactory } from '@cache';
import { status } from '@commands';
import { clusterArn } from '@utils';
import { catchError, combineLatestWith, filter, from, iif, map, Observable, of, switchMap } from 'rxjs';

export function ip(serverName: string): Observable<string | unknown> {
  return from(status(serverName)).pipe(
    switchMap((status) => {
      return iif(
        () => status != 'running',
        of('server is not running'),
        from(clusterArn(serverName)).pipe(
          switchMap((cluster) => {
            return CacheFactory.getInstance().aws.clients.ecs.send(
              new ListContainerInstancesCommand({
                cluster: cluster,
              }),
            );
          }),
          filter((res) => res?.containerInstanceArns?.length > 0),
          map((res) => res.containerInstanceArns[0]),
          combineLatestWith(from(clusterArn(serverName))),
          switchMap(([container, cluster]) => {
            return CacheFactory.getInstance().aws.clients.ecs.send(
              new DescribeContainerInstancesCommand({
                cluster: cluster,
                containerInstances: [container],
              }),
            );
          }),
          filter((res) => res?.containerInstances?.length > 0),
          map((res) => res.containerInstances[0].ec2InstanceId),
          filter((instanceId) => !!instanceId),
          switchMap((instanceId) => {
            return CacheFactory.getInstance().aws.clients.ec2.send(
              new DescribeInstancesCommand({
                Filters: [
                  {
                    Name: 'instance-id',
                    Values: [instanceId],
                  },
                ],
              }),
            );
          }),
          map((res): string => res.Reservations?.[0].Instances?.[0].PublicIpAddress || ''),
          catchError((): string => {
            // don't log error. let parent decide how to handle empty string
            return '';
          }),
        ),
      );
    }),
  );
}
