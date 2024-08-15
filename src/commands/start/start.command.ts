import { updateStackParameter } from '@utils';

export async function start(serverName: string) {
  try {
    updateStackParameter(serverName, 'ServerState', 'Running');
  } catch (error: any) {
    console.error(`${serverName} failed to start.`, error.message.toLowerCase());
  }
}
