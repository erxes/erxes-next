const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');
const { createBackendPlugin } = require('./create-backend-plugin');

async function createPlugin() {
  const answers = await prompt([
    {
      type: 'input',
      name: 'pluginName',
      message: 'What is the name of your plugin?',
      required: true,
      validate: (input) => {
        if (!input) return 'Plugin name is required';
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(input)) {
          return 'Plugin name must start with a letter and contain only letters and numbers';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'moduleName',
      message: 'What is the name of your module?',
      required: true,
      validate: (input) => {
        if (!input) return 'Module name is required';
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(input)) {
          return 'Module name must start with a letter and contain only letters and numbers';
        }
        return true;
      },
    },
  ]);

  const { pluginName, moduleName } = answers;

  // Convert plugin name to kebab case
  const kebabCaseName = pluginName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

  // Convert module name to kebab case
  const kebabCaseModuleName = moduleName
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
    'src/assets',
    'src/modules',
    `src/modules/${kebabCaseModuleName}`,
    'src/pages',
    `src/pages/${kebabCaseModuleName}`,
    'src/widgets',
    `src/widgets/${kebabCaseModuleName}Widget`,
  ];

  frontendDirectories.forEach((dir) => {
    fs.mkdirSync(path.join(frontendPluginDir, dir), { recursive: true });
  });

  // Create config.ts
  const configContent = `import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui/types';

export const CONFIG: IUIConfig = {
  name: '${kebabCaseName}',
  icon: IconSandbox,
  modules: [
    {
      name: '${moduleName}',
      icon: IconSandbox,
      path: '${kebabCaseModuleName}',
      hasSettings: true,
      hasWidgets: true,
    },
  ],
};
`;

  fs.writeFileSync(
    path.join(frontendPluginDir, 'src', 'config.ts'),
    configContent,
  );

  // Create Main.tsx for the module
  const mainContent = `import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const IndexPage = lazy(() =>
  import('~/pages/${kebabCaseModuleName}/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const ${kebabCaseModuleName}Main = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
      </Routes>
    </Suspense>
  );
};

export default ${kebabCaseModuleName}Main;
`;

  fs.writeFileSync(
    path.join(
      frontendPluginDir,
      'src',
      'modules',
      kebabCaseModuleName,
      'Main.tsx',
    ),
    mainContent,
  );

  // Create Settings.tsx for the module
  const settingsContent = `const ${kebabCaseModuleName}Settings = () => {
  return (
    <div>
      <h1>${moduleName} Settings</h1>
    </div>
  );
};

export default ${kebabCaseModuleName}Settings;
`;

  fs.writeFileSync(
    path.join(
      frontendPluginDir,
      'src',
      'modules',
      kebabCaseModuleName,
      'Settings.tsx',
    ),
    settingsContent,
  );

  const moduleIndexPageContent = `import {
  IconCaretDownFilled,
  IconSandbox,
  IconSettings,
} from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';

export const IndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/settings/${kebabCaseModuleName}">
                    <IconSandbox />
                    ${moduleName}
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/${kebabCaseModuleName}">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button>
            More <IconCaretDownFilled />
          </Button>
        </PageHeader.End>
      </PageHeader>
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden flex-auto">
          <h1>Samplsdsadasdjakljkljklsade</h1>
        </div>
      </div>
    </div>
  );
};
`;

  fs.writeFileSync(
    path.join(
      frontendPluginDir,
      'src',
      'pages',
      kebabCaseModuleName,
      'IndexPage.tsx',
    ),
    moduleIndexPageContent,
  );

  // Create module-federation.config.ts
  const moduleFederationConfig = `import { ModuleFederationConfig } from '@nx/rspack/module-federation';

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
    './${kebabCaseModuleName}': './src/modules/${kebabCaseModuleName}/Main.tsx',
    './${kebabCaseModuleName}Settings': './src/modules/${kebabCaseModuleName}/Settings.tsx',
  },

  shared: (libraryName, defaultConfig) => {
    if (coreLibraries.has(libraryName)) {
      return defaultConfig;
    }

    // Returning false means the library is not shared.
    return false;
  },
};

export default config;
`;

  fs.writeFileSync(
    path.join(frontendPluginDir, 'module-federation.config.ts'),
    moduleFederationConfig,
  );

  // Create project.json
  const projectJson = {
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
          tsConfig:
            'frontend/plugins/' + kebabCaseName + '_ui/tsconfig.app.json',
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
    JSON.stringify(projectJson, null, 2),
  );

  // Create tsconfig.json
  const tsConfig = {
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
    path.join(frontendPluginDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2),
  );

  // Create tsconfig.app.json
  const tsConfigApp = {
    extends: './tsconfig.json',
    compilerOptions: {
      outDir: '../../../dist/out-tsc',
      types: [
        'node',
        '@nx/react/typings/cssmodule.d.ts',
        '@nx/react/typings/image.d.ts',
      ],
    },
    exclude: [
      'jest.config.ts',
      'src/**/*.spec.ts',
      'src/**/*.test.ts',
      'src/**/*.spec.tsx',
      'src/**/*.test.tsx',
      'src/**/*.spec.js',
      'src/**/*.test.js',
      'src/**/*.spec.jsx',
      'src/**/*.test.jsx',
    ],
    include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
  };

  fs.writeFileSync(
    path.join(frontendPluginDir, 'tsconfig.app.json'),
    JSON.stringify(tsConfigApp, null, 2),
  );

  // Create tsconfig.spec.json
  const tsConfigSpec = {
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
    JSON.stringify(tsConfigSpec, null, 2),
  );

  // Create jest.config.ts
  const jestConfig = `/* eslint-disable */
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

  fs.writeFileSync(path.join(frontendPluginDir, 'jest.config.ts'), jestConfig);

  // Create rspack.config.ts
  const rspackConfig = `import { composePlugins, withNx, withReact } from '@nx/rspack';
import { withModuleFederation } from '@nx/rspack/module-federation';

import baseConfig from './module-federation.config';

const config = {
  ...baseConfig,
};

export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config, { dts: false }),
);
`;

  fs.writeFileSync(
    path.join(frontendPluginDir, 'rspack.config.ts'),
    rspackConfig,
  );

  // Create rspack.config.prod.ts
  const rspackConfigProd = `export default require('./rspack.config');`;

  fs.writeFileSync(
    path.join(frontendPluginDir, 'rspack.config.prod.ts'),
    rspackConfigProd,
  );

  // Create eslint.config.js
  const eslintConfig = `const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../../eslint.config.js');

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
];
`;

  fs.writeFileSync(
    path.join(frontendPluginDir, 'eslint.config.js'),
    eslintConfig,
  );

  // Create main.ts
  const mainTsContent = `import('./bootstrap');`;

  fs.writeFileSync(
    path.join(frontendPluginDir, 'src', 'main.ts'),
    mainTsContent,
  );

  // Create bootstrap.tsx
  const bootstrapContent = `import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <div>App</div>
  </StrictMode>,
);
`;

  createBackendPlugin(pluginName, moduleName);

  fs.writeFileSync(
    path.join(frontendPluginDir, 'src', 'bootstrap.tsx'),
    bootstrapContent,
  );

  console.log(`Plugin "${kebabCaseName}" created successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. cd frontend/plugins/${kebabCaseName}_ui && pnpm install`);
  console.log(`2. Start developing your plugin!`);
}

createPlugin();
