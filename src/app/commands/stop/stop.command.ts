import { stackExistsOrThrow, updateStackParameter } from '@utils';

export async function stop(serverName: string): Promise<void> {
  return stackExistsOrThrow(serverName)
    .then(() => {
      updateStackParameter(serverName, 'ServerState', 'Stopped');
    })
    .catch((error: any) => {
      console.error(`${serverName} failed to stop.`, error.message);
    });
}
