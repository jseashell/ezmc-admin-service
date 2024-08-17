import { stackExistsOrThrow, updateStackParameter } from '@utils';

export async function start(serverName: string): Promise<void> {
  return stackExistsOrThrow(serverName)
    .then(() => {
      updateStackParameter(serverName, 'ServerState', 'Running');
    })
    .catch((error: any) => {
      console.error(`${serverName} failed to start.`, error.message);
    });
}
