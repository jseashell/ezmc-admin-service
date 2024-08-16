import { ip } from '@commands';
import copy from 'copy-to-clipboard';
import { firstValueFrom } from 'rxjs';

export async function copyIpAddress(serverName: string): Promise<void> {
  return firstValueFrom(ip(serverName)).then((ip: string) => {
    copy(ip);
    console.log(`copied ${ip}`);
  });
}
