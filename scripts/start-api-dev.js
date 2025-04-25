// scripts/start-dev.js
require('dotenv').config();

const { PLUGINS } = process.env;
const { execSync } = require('child_process');

let plugins = '';
if (PLUGINS) {
  try {
    plugins = PLUGINS.split(',')
      .map((plugin) => `${plugin}_api`)
      .join(' ');
  } catch (error) {
    console.error('Error parsing DEV_REMOTES:', error);
    process.exit(1);
  }
}

const command = `npx nx run-many -t serve -p core-api ${plugins} gateway --verbose`;
console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
