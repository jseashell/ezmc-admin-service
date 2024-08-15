import { getStackParameter, updateStackParameter } from '@utils';

export async function rmop(serverName: string, playerName: string) {
  try {
    const adminPlayerNames = (await getStackParameter(serverName, 'AdminPlayerNames')).split(',') || [];
    const i = adminPlayerNames.indexOf(playerName);
    const temp = [...adminPlayerNames.slice(0, i), ...adminPlayerNames.slice(i + 1, adminPlayerNames.length)];
    updateStackParameter(serverName, 'AdminPlayerNames', temp.join(','));
    console.log('new admin player list');
    console.log(temp);
  } catch (err: any) {
    console.error(`failed to demote ${playerName}. ${err.message.toLowerCase()}`);
  }
}
