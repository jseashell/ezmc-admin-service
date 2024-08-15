import { updateStackParameter } from '@utils';

export async function maxp(serverName: string, maxPlayers: string): Promise<void> {
  if (maxPlayers.match(/[0-9]*/g)) {
    try {
      updateStackParameter(serverName, 'MaxPlayers', String(maxPlayers));
    } catch (err) {
      console.error(`failed to update max players. ${err.message.toLowerCase()}`);
    }
  } else {
    console.error('input must be a number');
  }
}
