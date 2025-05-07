import { ModuleFederationConfig } from '@nx/rspack/module-federation';

const coreLibraries = new Set([
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'erxes-ui',
  '@apollo/client',
  'jotai',
  'ui-modules',
  'react-i18next',
]);

const config: ModuleFederationConfig = {
  name: 'sample_ui',
  exposes: {
    './config': './src/config.ts',
    './sampleFirst': './src/modules/sample-first/Main.tsx',
    './sampleFirstSettings': './src/modules/sample-first/Settings.tsx',
    './sampleSecond': './src/modules/sample-second/Main.tsx',
    './sampleSecondSettings': './src/modules/sample-second/Settings.tsx',
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
