import { ModuleFederationConfig } from '@nx/rspack/module-federation';

const coreLibraries = new Set([
  'react',
  'react-dom',
  'react-router-dom',
  'erxes-ui',
  'recoil',
  'erxes-ui-shared-states',
]);

const config: ModuleFederationConfig = {
  name: 'inbox_ui',
  exposes: {
    './Config': './src/app/config.ts',
    './Module': './src/remote-entry.ts',
    './Settings': './src/app/settings.tsx',
  },

  shared: (libraryName, defaultConfig) => {
    if (coreLibraries.has(libraryName)) {
      return defaultConfig;
    }

    // Returning false means the library is not shared.
    return false;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
