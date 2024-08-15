import copy from 'copy-to-clipboard';
import { ipaddr } from '../ipaddr/ipaddr.command';

export async function copyIpAddress(serverName: string) {
  const ip = await ipaddr(serverName);
  copy(ip);
  console.log(`copied ${ip}`);
}
