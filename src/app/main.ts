import { CacheFactory } from '@cache';
import { copyIpAddress, getParams, ip, list, newServer, rm, setParams, start, status, stop } from '@commands';
import { program } from 'commander';
import { firstValueFrom } from 'rxjs';

export async function bootstrapApplication(): Promise<void> {
  program.name('ezmc').description('CLI for self-hosting a Minecraft Java server with AWS ECS.').version('0.1.0');

  program
    .command('cip')
    .description("copies a server's ip address to the clipboard")
    .argument('<string>', 'server name')
    .action((serverName) => copyIpAddress(serverName));

  program
    .command('ip')
    .description("displays a server's ip address")
    .argument('<string>', 'server name')
    .action(async (serverName) => {
      await firstValueFrom(ip(serverName)).then((ip) => {
        console.log(ip);
      });
    });

  program
    .command('ls')
    .description('lists your servers')
    .action(() => list().then((res) => console.log(res)));

  program
    .command('new')
    .description('creates a new server. wait 5 minutes for commands like `ipaddr` or `status`')
    .argument('<string>', 'server name. alphanumeric and hyphens only. must start with alpha character')
    .action((serverName) => newServer(serverName));

  program
    .command('params')
    .description('get/set server parameters')
    .argument(`<string>`, '[get|set]')
    .argument('<string>', 'server name')
    .option('-a, --admins', 'list of admin player names. comma-delimited, no spaces')
    .option('-d, --difficulty', '[peaceful|easy|normal|hard]')
    .option('-g, --gamemode', '[creative|survival|adventue|spectator]')
    .option('-m, --mem', '[1G|2G|4G|8G|16G] amount of memory to allocate')
    .option('-p, --playermax', '1 - 100')
    .option('-s, --state', '[running|stopped] server state')
    .option('-v, --viewdist', '1-20')
    .option('-w, --whitelist', 'list of whitelisted player names. comma-delimited, no spaces')
    .option('-z, --timezone', "the server's timezone. use the canonical name of the format, e.g. America/New_York")
    .action((action, serverName, options) => {
      if (action == 'get') {
        getParams(serverName);
      } else if (action == 'set') {
        setParams(serverName, options);
      }
    });

  program
    .command('rm')
    .description('removes a server (cannot be undone)')
    .argument('<string>', 'server name')
    .action((serverName) => rm(serverName));

  program
    .command('start')
    .description('starts a server')
    .argument('<string>', 'server name')
    .action(async (serverName) => start(serverName));

  program
    .command('status')
    .description("displays a server's status")
    .argument('<string>', 'server name')
    .action(async (serverName) => status(serverName).then((res) => console.log(res)));

  program
    .command('stop')
    .description('stops a server')
    .argument('<string>', 'server name')
    .action(async (serverName) => stop(serverName));

  program.configureOutput({
    outputError: (str, write) => write(`\x1b[31m${str}\x1b[0m`),
  });

  CacheFactory.getInstance()
    .init()
    .then(() => {
      program.parse();
    });
}
