import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run plugin_inbox:serve',
        production: 'nx run plugin_inbox:serve:production',
      },
      ciWebServerCommand: 'nx run plugin_inbox:serve-static',
    }),
    baseUrl: 'http://localhost:3002',
  },
});
