// scripts/start-dev.js
require('dotenv').config();

const { ENABLED_PLUGINS } = process.env;
const { execSync } = require('child_process');

const SERVICES = ['automations', 'logs'];

let plugins = '';
let pluginsCount = 2;

if (ENABLED_PLUGINS) {
  try {
<<<<<<< HEAD
    plugins =
      // ENABLED_PLUGINS
      ''
        .split(',')
        .map((plugin) => `${plugin}_api`)
        .join(' ');
=======
    plugins = ENABLED_PLUGINS.split(',')
      .map((plugin) => (SERVICES.includes(plugin) ? plugin : `${plugin}_api`))
      .join(' ');
>>>>>>> 10c6034f6e1fec611e7f757a1294ab1e8d434831

    pluginsCount += plugins.split(' ').length;
  } catch (error) {
    console.error('Error parsing DEV_REMOTES:', error);
    process.exit(1);
  }
}

const command = `npx nx run-many -t serve -p core-api gateway --verbose --parallel=${pluginsCount}`;
console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
