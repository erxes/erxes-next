// scripts/start-dev.js
require('dotenv').config();

const { ENABLED_PLUGINS } = process.env;
const { execSync } = require('child_process');

const SERVICES = ['automations', 'logs', 'notifications'];

let plugins = '';
let pluginsCount = 2;

if (ENABLED_PLUGINS) {
  try {
    plugins = ENABLED_PLUGINS.split(',')
      .map((plugin) =>
        SERVICES.includes(plugin) ? `${plugin}-service` : `${plugin}_api`,
      )
      .join(' ');

    pluginsCount += plugins.split(' ').length;
  } catch (error) {
    console.error('Error parsing DEV_REMOTES:', error);
    process.exit(1);
  }
}

const command = `npx nx run-many -t serve -p core-api ${plugins} gateway --verbose --parallel=${pluginsCount}`;
console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
