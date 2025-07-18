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
  name: 'frontline_ui',
  exposes: {
    './config': './src/config.ts',
    './inbox': './src/modules/inbox/Main.tsx',
    './ticket': './src/modules/ticket/Main.tsx',
    './inboxSettings': './src/modules/inbox/Settings.tsx',
    './ticketSettings': './src/modules/ticket/Settings.tsx',
    './automations':
      './src/widgets/automations/components/AutomationRemoteEntry.tsx',
    './relationWidget': './src/widgets/RelationWidget.tsx',
    './floatingWidget': './src/widgets/FloatingWidget.tsx',
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
