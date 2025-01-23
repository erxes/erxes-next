import { composePlugins, withNx, withReact } from '@nx/rspack';
import {
  withModuleFederation,
  ModuleFederationConfig,
} from '@nx/rspack/module-federation';
import { DefinePlugin } from '@rspack/core';

import baseConfig from './module-federation.config.prod';

const config: ModuleFederationConfig = {
  ...baseConfig,
  remotes: ['plugin_task', 'plugin_inbox'],
};

export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config, { dts: false }),
  (config) => {
    // Define environment variables
    config.plugins?.push(
      new DefinePlugin({
        'process.env.REACT_APP_API_URL': JSON.stringify(
          process.env.REACT_APP_API_URL
        ),
      })
    );
    return config;
  }
);
