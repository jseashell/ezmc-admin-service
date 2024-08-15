import { updateStackParameter } from '@utils';

export async function stop(serverName: string) {
  try {
    updateStackParameter(serverName, 'ServerState', 'Stopped');
  } catch (error: any) {
    console.error(`${serverName} failed to stop.`, error.message.toLowerCase());
  }
}
