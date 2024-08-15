import { getStackParameter, updateStackParameter } from '@utils';

export async function addop(serverName: string, playerName: string) {
  try {
    const adminPlayerNames = ((await getStackParameter(serverName, 'AdminPlayerNames')) || '').split(',');
    adminPlayerNames.push(playerName);
    updateStackParameter(serverName, 'AdminPlayerNames', adminPlayerNames.join(','));
    console.log('new admin player list:', adminPlayerNames);
  } catch (err: any) {
    console.error(`failed to promote ${playerName}. ${err.message.toLowerCase()}`);
  }
}
