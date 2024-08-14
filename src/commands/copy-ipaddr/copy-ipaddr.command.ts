import copy from 'copy-to-clipboard';
import { ipAddress } from '../ipaddr/ipaddr.command';

export async function copyIpAddress(serverName: string) {
  const ip = await ipAddress(serverName);
  copy(ip);
  console.log(`copied ${ip}`);
}
