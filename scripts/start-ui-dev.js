// scripts/start-dev.js
require('dotenv').config();

const { PLUGINS } = process.env;
const { execSync } = require('child_process');

let devRemotesArg = '';
if (PLUGINS) {
  try {
    const remotes = PLUGINS.split(',').map((plugin) => `${plugin}_ui`);

    devRemotesArg = `--devRemotes="${remotes}"`;
  } catch (error) {
    console.error('Error parsing DEV_REMOTES:', error);
    process.exit(1);
  }
}

const command = `nx serve core-ui ${devRemotesArg} --verbose`;
console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
