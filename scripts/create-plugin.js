const fs = require('fs');
const path = require('path');

const pluginName = process.argv[2];

if (!pluginName) {
  console.error('Please provide a plugin name');
  process.exit(1);
}

// Convert plugin name to kebab case
const kebabCaseName = pluginName
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/[\s_]+/g, '-')
  .toLowerCase();

// Create frontend plugin
const frontendPluginDir = path.join(
  __dirname,
  '..',
  'frontend',
  'plugins',
  kebabCaseName + '_ui',
);

// Create frontend plugin directory structure
const frontendDirectories = [
  '',
  'src',
  'src/components',
  'src/hooks',
  'src/utils',
  'src/types',
  'src/constants',
  'src/api',
  'src/store',
  'src/styles',
];

frontendDirectories.forEach((dir) => {
  fs.mkdirSync(path.join(frontendPluginDir, dir), { recursive: true });
});

// Create frontend project.json
const frontendProjectJson = {
  name: kebabCaseName + '_ui',
  $schema: '../../../node_modules/nx/schemas/project-schema.json',
  sourceRoot: 'frontend/plugins/' + kebabCaseName + '_ui/src',
  projectType: 'application',
  tags: [],
  targets: {
    build: {
      executor: '@nx/rspack:rspack',
      outputs: ['{options.outputPath}'],
      defaultConfiguration: 'production',
      options: {
        target: 'web',
        outputPath: 'dist/frontend/plugins/' + kebabCaseName + '_ui',
        main: 'frontend/plugins/' + kebabCaseName + '_ui/src/main.ts',
        tsConfig: 'frontend/plugins/' + kebabCaseName + '_ui/tsconfig.app.json',
        rspackConfig:
          'frontend/plugins/' + kebabCaseName + '_ui/rspack.config.ts',
        assets: ['frontend/plugins/' + kebabCaseName + '_ui/src/assets'],
      },
      configurations: {
        development: {
          mode: 'development',
        },
        production: {
          mode: 'production',
          optimization: true,
          sourceMap: false,
          rspackConfig:
            'frontend/plugins/' + kebabCaseName + '_ui/rspack.config.prod.ts',
        },
      },
    },
    serve: {
      executor: '@nx/rspack:module-federation-dev-server',
      options: {
        buildTarget: kebabCaseName + '_ui:build:development',
        port: 3005,
      },
      configurations: {
        development: {},
        production: {
          buildTarget: kebabCaseName + '_ui:build:production',
        },
      },
    },
    'serve-static': {
      executor: '@nx/rspack:module-federation-static-server',
      defaultConfiguration: 'production',
      options: {
        serveTarget: kebabCaseName + '_ui:serve',
      },
      configurations: {
        development: {
          serveTarget: kebabCaseName + '_ui:serve:development',
        },
        production: {
          serveTarget: kebabCaseName + '_ui:serve:production',
        },
      },
    },
  },
};

fs.writeFileSync(
  path.join(frontendPluginDir, 'project.json'),
  JSON.stringify(frontendProjectJson, null, 2),
);

// Create frontend tsconfig.json
const frontendTsConfig = {
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    module: 'commonjs',
    forceConsistentCasingInFileNames: true,
    strict: true,
    noImplicitOverride: true,
    noPropertyAccessFromIndexSignature: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    outDir: '../../dist/plugins/' + kebabCaseName + '_ui',
  },
  include: ['src/**/*.ts', 'src/**/*.tsx'],
  exclude: [
    'node_modules',
    'dist',
    'jest.config.ts',
    'src/**/*.spec.ts',
    'src/**/*.test.ts',
  ],
};

fs.writeFileSync(
  path.join(frontendPluginDir, 'tsconfig.json'),
  JSON.stringify(frontendTsConfig, null, 2),
);

// Create frontend tsconfig.app.json
const frontendTsConfigApp = {
  compilerOptions: {
    jsx: 'react-jsx',
    allowJs: false,
    esModuleInterop: false,
    allowSyntheticDefaultImports: true,
    strict: true,
    paths: {
      'erxes-ui/*': ['frontend/libs/erxes-ui/src/*'],
      'erxes-ui': ['frontend/libs/erxes-ui/src'],
      '~/*': ['frontend/plugins/' + kebabCaseName + '_ui/src/*'],
      '~': ['frontend/plugins/' + kebabCaseName + '_ui/src'],
      '@/*': ['frontend/plugins/' + kebabCaseName + '_ui/src/modules/*'],
      '@': ['frontend/plugins/' + kebabCaseName + '_ui/src/modules'],
      'ui-modules/*': ['frontend/libs/ui-modules/src/*'],
      'ui-modules': ['frontend/libs/ui-modules/src'],
    },
  },
  files: [],
  include: [],
  references: [
    {
      path: './tsconfig.app.json',
    },
    {
      path: './tsconfig.spec.json',
    },
  ],
  extends: '../../../tsconfig.base.json',
};

fs.writeFileSync(
  path.join(frontendPluginDir, 'tsconfig.app.json'),
  JSON.stringify(frontendTsConfigApp, null, 2),
);

// Create frontend tsconfig.spec.json
const frontendTsConfigSpec = {
  extends: './tsconfig.json',
  compilerOptions: {
    outDir: '../../../dist/out-tsc',
    module: 'commonjs',
    moduleResolution: 'node10',
    jsx: 'react-jsx',
    types: [
      'jest',
      'node',
      '@nx/react/typings/cssmodule.d.ts',
      '@nx/react/typings/image.d.ts',
    ],
  },
  include: [
    'jest.config.ts',
    'src/**/*.test.ts',
    'src/**/*.spec.ts',
    'src/**/*.test.tsx',
    'src/**/*.spec.tsx',
    'src/**/*.test.js',
    'src/**/*.spec.js',
    'src/**/*.test.jsx',
    'src/**/*.spec.jsx',
    'src/**/*.d.ts',
  ],
};

fs.writeFileSync(
  path.join(frontendPluginDir, 'tsconfig.spec.json'),
  JSON.stringify(frontendTsConfigSpec, null, 2),
);

// Create frontend jest.config.ts
const frontendJestConfig = `/* eslint-disable */
export default {
  displayName: '${kebabCaseName}-ui',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/plugins/${kebabCaseName}_ui',
};
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'jest.config.ts'),
  frontendJestConfig,
);

// Create frontend rspack.config.ts
const frontendRspackConfig = `import { composePlugins, withNx, withReact } from '@nx/rspack';
import { withModuleFederation } from '@nx/rspack/module-federation';

import baseConfig from './module-federation.config';

const config = {
  ...baseConfig,
};

// Nx plugins for rspack to build config object from Nx options and context.
/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config, { dts: false }),
);
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'rspack.config.ts'),
  frontendRspackConfig,
);

// Create frontend rspack.config.prod.ts
const frontendRspackConfigProd = `export default require('./rspack.config');`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'rspack.config.prod.ts'),
  frontendRspackConfigProd,
);

// Create frontend module-federation.config.ts
const frontendModuleFederationConfig = `import { ModuleFederationConfig } from '@nx/rspack/module-federation';

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
  name: '${kebabCaseName}_ui',
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

`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'module-federation.config.ts'),
  frontendModuleFederationConfig,
);

// Create frontend eslint.config.js
const frontendEslintConfig = `const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../../eslint.config.js');

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'eslint.config.js'),
  frontendEslintConfig,
);

// Create frontend index.ts
const frontendIndexContent = `export * from './components';
export * from './types';
export * from './constants';
export * from './api';
export * from './store';
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'src', 'index.ts'),
  frontendIndexContent,
);

// Create frontend components/index.ts
const frontendComponentsIndex = `export * from './Plugin';
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'src', 'components', 'index.ts'),
  frontendComponentsIndex,
);

// Create frontend Plugin.tsx
const frontendPluginComponent = `'use client';

import { FC } from 'react';

interface PluginProps {
  // Add your plugin props here
}

export const Plugin: FC<PluginProps> = (props) => {
  return (
    <div className="plugin-container">
      {/* Add your plugin content here */}
    </div>
  );
};
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'src', 'components', 'Plugin.tsx'),
  frontendPluginComponent,
);

// Create frontend types/index.ts
const frontendTypesContent = `export interface PluginConfig {
  // Add your plugin configuration types here
}

export interface PluginState {
  // Add your plugin state types here
}
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'src', 'types', 'index.ts'),
  frontendTypesContent,
);

// Create frontend constants/index.ts
const frontendConstantsContent = `export const PLUGIN_NAME = '${kebabCaseName}';
export const PLUGIN_VERSION = '0.0.1';
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'src', 'constants', 'index.ts'),
  frontendConstantsContent,
);

// Create frontend api/index.ts
const frontendApiContent = `import { gql } from '@apollo/client';

export const queries = {
  // Add your GraphQL queries here
};

export const mutations = {
  // Add your GraphQL mutations here
};
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'src', 'api', 'index.ts'),
  frontendApiContent,
);

// Create frontend store/index.ts
const frontendStoreContent = `import { atom } from 'jotai';
import { PluginState } from '../types';

export const pluginStateAtom = atom<PluginState>({
  // Add your initial state here
});
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'src', 'store', 'index.ts'),
  frontendStoreContent,
);

// Create frontend styles/index.css
const frontendStylesContent = `.plugin-container {
  /* Add your plugin styles here */
}
`;

fs.writeFileSync(
  path.join(frontendPluginDir, 'src', 'styles', 'index.css'),
  frontendStylesContent,
);

// Create backend plugin
const backendPluginDir = path.join(
  __dirname,
  '..',
  'backend',
  'plugins',
  kebabCaseName + '_api',
);

// Create backend plugin directory structure
const backendDirectories = [
  '',
  'src',
  'src/models',
  'src/resolvers',
  'src/typeDefs',
  'src/utils',
];

backendDirectories.forEach((dir) => {
  fs.mkdirSync(path.join(backendPluginDir, dir), { recursive: true });
});

// Create backend project.json
const backendProjectJson = {
  name: `${kebabCaseName}-api`,
  $schema: '../../node_modules/nx/schemas/project-schema.json',
  sourceRoot: `${backendPluginDir}/src`,
  projectType: 'library',
  targets: {
    build: {
      executor: '@nx/js:tsc',
      outputs: ['{options.outputPath}'],
      options: {
        outputPath: `dist/plugins/${kebabCaseName}_api`,
        main: `${backendPluginDir}/src/index.ts`,
        tsConfig: `${backendPluginDir}/tsconfig.build.json`,
        assets: ['${backendPluginDir}/src/**/*.json'],
      },
    },
    lint: {
      executor: '@nx/eslint:lint',
      outputs: ['{options.outputFile}'],
    },
    test: {
      executor: '@nx/jest:jest',
      outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
      options: {
        jestConfig: `${backendPluginDir}/jest.config.ts`,
      },
    },
  },
  tags: [],
};

fs.writeFileSync(
  path.join(backendPluginDir, 'project.json'),
  JSON.stringify(backendProjectJson, null, 2),
);

// Create backend package.json
const backendPackageJson = {
  name: `@erxes/plugin-${kebabCaseName}-api`,
  version: '0.0.1',
  private: true,
  main: './src/index.ts',
  types: './src/index.ts',
  dependencies: {
    '@erxes/api-utils': 'workspace:*',
    graphql: '^16.9.0',
    mongoose: '^8.9.6',
  },
};

fs.writeFileSync(
  path.join(backendPluginDir, 'package.json'),
  JSON.stringify(backendPackageJson, null, 2),
);

// Create backend tsconfig.json
const backendTsConfig = {
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    module: 'commonjs',
    forceConsistentCasingInFileNames: true,
    strict: true,
    noImplicitOverride: true,
    noPropertyAccessFromIndexSignature: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    outDir: '../../dist/plugins/' + kebabCaseName + '_api',
  },
  include: ['src/**/*.ts'],
  exclude: [
    'node_modules',
    'dist',
    'jest.config.ts',
    'src/**/*.spec.ts',
    'src/**/*.test.ts',
  ],
};

fs.writeFileSync(
  path.join(backendPluginDir, 'tsconfig.json'),
  JSON.stringify(backendTsConfig, null, 2),
);

// Create backend tsconfig.build.json
const backendTsConfigBuild = {
  extends: './tsconfig.json',
  exclude: ['jest.config.ts', 'src/**/*.spec.ts', 'src/**/*.test.ts'],
};

fs.writeFileSync(
  path.join(backendPluginDir, 'tsconfig.build.json'),
  JSON.stringify(backendTsConfigBuild, null, 2),
);

// Create backend index.ts
const backendIndexContent = `import { generateModels } from '@erxes/api-utils';
import { IModels } from './models';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

export default {
  name: '${kebabCaseName}',
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers: await resolvers(),
    };
  },
  apolloServerContext: async (context, req) => {
    const models = await generateModels<IModels>(req);

    context.models = models;

    return context;
  },
};
`;

fs.writeFileSync(
  path.join(backendPluginDir, 'src', 'index.ts'),
  backendIndexContent,
);

// Create backend models/index.ts
const backendModelsContent = `import { Document, Model } from 'mongoose';

export interface IModels {
  // Add your model interfaces here
}

export interface IModelParams {
  // Add your model parameters here
}

export interface IModelDocument extends Document {
  // Add your document interfaces here
}

export interface IModelModel extends Model<IModelDocument> {
  // Add your model methods here
}
`;

fs.writeFileSync(
  path.join(backendPluginDir, 'src', 'models', 'index.ts'),
  backendModelsContent,
);

// Create backend resolvers/index.ts
const backendResolversContent = `export default async () => {
  return {
    Query: {
      // Add your queries here
    },
    Mutation: {
      // Add your mutations here
    },
  };
};
`;

fs.writeFileSync(
  path.join(backendPluginDir, 'src', 'resolvers', 'index.ts'),
  backendResolversContent,
);

// Create backend typeDefs/index.ts
const backendTypeDefsContent = `export default async () => {
  return \`
    type Query {
      # Add your query types here
    }

    type Mutation {
      # Add your mutation types here
    }
  \`;
};
`;

fs.writeFileSync(
  path.join(backendPluginDir, 'src', 'typeDefs', 'index.ts'),
  backendTypeDefsContent,
);

console.log(`Plugin "${kebabCaseName}" created successfully!`);
console.log(`\nNext steps:`);
console.log(`1. cd frontend/plugins/${kebabCaseName}_ui && pnpm install`);
console.log(
  `2. cd ../../../backend/plugins/${kebabCaseName}_api && pnpm install`,
);
console.log(`3. Start developing your plugin!`);
