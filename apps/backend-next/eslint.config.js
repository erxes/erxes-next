import { configs } from 'eslint-plugin-cypress/flat';
import baseConfig from '../../eslint.config.js';

export default [
  configs['recommended'],

  ...baseConfig,
  {
    // Override or add rules here
    rules: {},
  },
];
