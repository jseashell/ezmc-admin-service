import { program } from 'commander';
import { status } from './commands/status.js';
import { up } from './commands/up.js';

program.name('ezmc').description('CLI for self-hosting a Minecraft Java server with AWS ECS').version('0.1.0');

/**
 * Formats the given accountId and server name into a valid stack name (alphanumeric, only hyphens)
 * @param accountId
 * @param serverName
 * @return normalized stack na me
 */
function formatStackName(accountId, serverName) {
  const normalizedServerName = serverName.toLowerCase().replaceAll('_', '-').replaceAll(' ', '-');
  return `ezmc-${accountId}-${normalizedServerName}`;
}

program
  .command('up')
  .description('Spins up a new server.')
  .requiredOption('-n --name', 'name of the server')
  .requiredOption('-a --account', 'account identifier')
  .action(async (options) => {
    const stackName = formatStackName(options.account, options.name);

    try {
      await up(stackName);
    } catch (err) {
      console.error(err);
      return;
    }

    let statusStr = '';
    let exit = false;
    let count = 0;

    while (!exit) {
      statusStr = await status(stackName);
      count += 1;

      if (statusStr.toLowerCase().includes('running')) {
        exit = true;
      } else if (count <= 10) {
        await new Promise((res) => {
          setTimeout(() => {
            res();
          }, 1000);
        });
      }
    }
  });

program
  .command('status')
  .description('Displays the current running status of a server.')
  .requiredOption('-c', '--cluster', 'name of the cluster')
  .action(async (options) => {
    return;
  });

program.parse();
