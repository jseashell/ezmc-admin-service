import { getStackParameter, updateStackParameter } from '@utils';

export async function addop(serverName: string, playerName: string) {
  try {
    const adminPlayerNames = ((await getStackParameter(serverName, 'AdminPlayerNames')) || '').split(',');
    adminPlayerNames.push(playerName);
    const temp = adminPlayerNames.filter((name) => !!name).join(',');
    updateStackParameter(serverName, 'AdminPlayerNames', temp);
    console.log('new admin player list:', temp);
  } catch (err: any) {
    console.error(`failed to promote ${playerName}. ${err.message.toLowerCase()}`);
  }
}
