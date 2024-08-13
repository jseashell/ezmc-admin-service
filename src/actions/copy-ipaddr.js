import copy from 'copy-to-clipboard';
import { ipAddress } from './ipaddr.js';

export async function copyIpAddress(serverName) {
  const ip = await ipAddress(serverName);
  copy(ip);
  console.log(`copied ${ip}`);
}
