// scripts/start-dev.js
require('dotenv').config();

const { ENABLED_PLUGINS } = process.env;
const { execSync } = require('child_process');

let plugins = '';
if (ENABLED_PLUGINS) {
  try {
    plugins = ENABLED_PLUGINS.split(',')
      .map((plugin) => (plugin === 'logs' ? plugin : `${plugin}_api`))
      .join(' ');
  } catch (error) {
    console.error('Error parsing DEV_REMOTES:', error);
    process.exit(1);
  }
}

const command = `npx nx run-many -t serve -p core-api ${plugins} gateway --verbose`;
console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
