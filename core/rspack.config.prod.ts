import { composePlugins, withNx, withReact } from '@nx/rspack';
import {
  ModuleFederationConfig,
  withModuleFederation,
} from '@nx/rspack/module-federation';
import { DefinePlugin } from '@rspack/core';

import baseConfig from './module-federation.config.prod';

const prodConfig: ModuleFederationConfig = {
  ...baseConfig,
};

export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(prodConfig, { dts: false }),
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
