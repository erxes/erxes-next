import { composePlugins, withNx, withReact } from '@nx/rspack';
import {
  withModuleFederation,
  ModuleFederationConfig,
} from '@nx/rspack/module-federation';

import baseConfig from './module-federation.config';
import { DefinePlugin } from '@rspack/core';

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
