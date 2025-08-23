// scripts/start-dev.js
require('dotenv').config();

const { ENABLED_PLUGINS } = process.env;
const { execSync } = require('child_process');

const DEFAULT_SERVICES = ['automations', 'logs', 'notifications'];

const services = DEFAULT_SERVICES.map((service) => `${service}-service`).join(
  ' ',
);

// preapare plugins
let plugins = '';
let pluginsCount = 2;

if (ENABLED_PLUGINS) {
  try {
    plugins = ENABLED_PLUGINS.split(',')
      .map((plugin) => `${plugin}_api`)
      .join(' ');

    pluginsCount += plugins.split(' ').length;
  } catch (error) {
    console.error('Error parsing DEV_REMOTES:', error);
    process.exit(1);
  }
}

const totalProjectsCount = pluginsCount + DEFAULT_SERVICES.length;
const totalProjects = `${plugins} ${services}`;

const command = `npx nx run-many -t serve -p core-api ${totalProjects} gateway --verbose --parallel=${totalProjectsCount}`;
console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
