const fs = require('fs');
const path = require('path');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createBackendPlugin(pluginName, moduleName) {
  // Convert plugin name to kebab case
  const kebabCaseName = pluginName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

  // Capitalize first letter of moduleName
  const capitalizedModuleName = capitalizeFirstLetter(moduleName);

  // Create backend plugin directory
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
    'src/apollo',
    'src/apollo/resolvers',
    'src/apollo/schema',
    'src/trpc',
    'src/modules',
    `src/modules/${moduleName}`,
    `src/modules/${moduleName}/graphql`,
    `src/modules/${moduleName}/graphql/schemas`,
    `src/modules/${moduleName}/graphql/resolvers`,
    `src/modules/${moduleName}/db`,
    `src/modules/${moduleName}/db/models`,
    `src/modules/${moduleName}/db/definitions`,
    `src/modules/${moduleName}/@types`,
  ];

  backendDirectories.forEach((dir) => {
    fs.mkdirSync(path.join(backendPluginDir, dir), { recursive: true });
  });

  // Create package.json
  const packageJson = {
    name: kebabCaseName + '_api',
    version: '1.0.0',
    description: '',
    main: 'index.js',
    scripts: {
      dev: 'tsx watch src/main.ts',
      build:
        'tsc --project tsconfig.build.json && tsc-alias -p tsconfig.build.json',
      start: 'node -r tsconfig-paths/register dist/src/main.js',
    },
    keywords: [],
    author: '',
    license: 'ISC',
    dependencies: {
      'erxes-api-shared': 'workspace:^',
    },
    devDependencies: {},
  };

  fs.writeFileSync(
    path.join(backendPluginDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );

  const tsConfigBuild = {
    extends: './tsconfig.json',
    compilerOptions: {
      rootDir: '.',
      paths: {
        '~/*': ['./src/*'],
        '@/*': ['./src/modules/*'],
      },
      types: ['node'],
    },
    exclude: ['node_modules', 'dist', '**/*spec.ts'],
  };

  fs.writeFileSync(
    path.join(backendPluginDir, 'tsconfig.build.json'),
    JSON.stringify(tsConfigBuild, null, 2),
  );

  // Create tsconfig.json
  const tsConfig = {
    extends: '../../../tsconfig.base.json',
    compilerOptions: {
      baseUrl: '.',
      module: 'commonjs',
      declaration: true,
      removeComments: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      allowSyntheticDefaultImports: true,
      allowUnreachableCode: false,
      esModuleInterop: true,
      target: 'es2017',
      sourceMap: true,
      inlineSources: true,
      outDir: './dist',
      incremental: true,
      skipLibCheck: true,
      strictNullChecks: true,
      alwaysStrict: true,
      noImplicitAny: false,
      strictBindCallApply: false,
      forceConsistentCasingInFileNames: false,
      noFallthroughCasesInSwitch: false,
      resolveJsonModule: true,
      types: ['jest', 'node'],
      paths: {
        '~/*': ['./src/*'],
        '@/*': ['./src/modules/*'],
        'erxes-api-shared/*': ['../../erxes-api-shared/src/*'],
      },
    },
    'ts-node': {
      files: true,
      require: ['tsconfig-paths/register'],
    },
    exclude: ['dist', 'frontend/**/*'],
    include: ['src/**/*.ts', 'src/**/*.tsx'],
  };

  fs.writeFileSync(
    path.join(backendPluginDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2),
  );

  const projectJson = {
    name: kebabCaseName + '_api',
    $schema: '../../../node_modules/nx/schemas/project-schema.json',
    sourceRoot: 'backend/plugins/' + kebabCaseName + '_api/src',
    projectType: 'application',
    tags: [],
    targets: {
      build: {
        executor: 'nx:run-commands',
        cache: true,
        options: {
          cwd: 'backend/plugins/' + kebabCaseName + '_api',
          commands: ['pnpm build'],
        },
        dependsOn: ['^build', 'build:packageJson'],
      },

      'build:packageJson': {
        executor: '@nx/js:tsc',
        options: {
          main: 'backend/plugins/' + kebabCaseName + '_api/dist/src/main.js',
          tsConfig:
            'backend/plugins/' + kebabCaseName + '_api/tsconfig.build.json',
          outputPath: 'backend/plugins/' + kebabCaseName + '_api/dist',
          updateBuildableProjectDepsInPackageJson: true,

          buildableProjectDepsInPackageJsonType: 'dependencies',
        },
      },

      start: {
        executor: 'nx:run-commands',
        dependsOn: ['typecheck', 'build'],
        options: {
          cwd: 'backend/plugins/' + kebabCaseName + '_api',
          command: 'NODE_ENV=development node dist/src/main.js',
        },
      },

      serve: {
        executor: 'nx:run-commands',

        options: {
          cwd: 'backend/plugins/' + kebabCaseName + '_api',
          command: 'NODE_ENV=development pnpm dev',
        },
      },

      'docker-build': {
        dependsOn: ['build'],
        command:
          'docker build -f backend/plugins/' +
          kebabCaseName +
          '_api/Dockerfile . -t erxes/erxes-next-' +
          kebabCaseName +
          '_api',
      },
    },
  };

  fs.writeFileSync(
    path.join(backendPluginDir, 'project.json'),
    JSON.stringify(projectJson, null, 2),
  );

  // Create main.ts
  const mainContent = `import { startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/trpc/init-trpc';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';

startPlugin({
  name: '${kebabCaseName}',
  port: 33010,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  apolloServerContext: async (subdomain, context) => {
    const models = await generateModels(subdomain);

    context.models = models;

    return context;
  },
  trpcAppRouter: {
    router: appRouter,
    createContext: async (subdomain, context) => {
      const models = await generateModels(subdomain);

      context.models = models;

      return context;
    },
  },
});

`;

  fs.writeFileSync(path.join(backendPluginDir, 'src', 'main.ts'), mainContent);

  const connectionResolversContent = `import { createGenerateModels } from 'erxes-api-shared/utils';
import { IMainContext } from 'erxes-api-shared/core-types';
import { I${capitalizedModuleName}Document } from '@/${moduleName}/@types/${moduleName}';

import mongoose from 'mongoose';

import { load${capitalizedModuleName}Class, I${capitalizedModuleName}Model } from '@/${moduleName}/db/models/${moduleName}';

export interface IModels {
  ${capitalizedModuleName}: I${capitalizedModuleName}Model;
}

export interface IContext extends IMainContext {
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  const models = {} as IModels;

  models.${capitalizedModuleName} = db.model<I${capitalizedModuleName}Document, I${capitalizedModuleName}Model>(
    '${moduleName}',
    load${capitalizedModuleName}Class(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
`;

  fs.writeFileSync(
    path.join(backendPluginDir, 'src', 'connectionResolvers.ts'),
    connectionResolversContent,
  );

  // Create apollo/apolloServer.ts
  const apolloServerContent = `import { ApolloServer } from 'apollo-server-express';
import { IModels } from '../modules/${moduleName}/types';
import { typeDefs } from './schema/schema';
import { resolvers } from './resolvers';

export const loadApolloServer = async (models: IModels) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      models,
      subdomain: req.headers.subdomain,
      user: req.user,
    }),
  });

  return server;
};
`;

  fs.writeFileSync(
    path.join(backendPluginDir, 'src', 'apollo', 'apolloServer.ts'),
    apolloServerContent,
  );

  // Create apollo/schema/schema.ts
  const schemaContent = `import { TypeExtensions } from '../../modules/${moduleName}/graphql/schemas/extensions';

export const types = \`
  \${TypeExtensions}
\`;

export default { types };
`;

  fs.writeFileSync(
    path.join(backendPluginDir, 'src', 'apollo', 'schema', 'schema.ts'),
    schemaContent,
  );

  // Create trpc/init-trpc.ts
  const initTrpcContent = `import { initTRPC } from '@trpc/server';

import { ITRPCContext } from 'erxes-api-shared/utils';

const t = initTRPC.context<ITRPCContext>().create();

export const appRouter = t.router({
  sample: {
    hello: t.procedure.query(() => {
      return 'Hello Sample';
    }),
  },
});

export type AppRouter = typeof appRouter;
`;

  fs.writeFileSync(
    path.join(backendPluginDir, 'src', 'trpc', 'init-trpc.ts'),
    initTrpcContent,
  );

  const trpcClientsContent = `import { httpBatchLink, createTRPCUntypedClient } from '@trpc/client';
import { getPlugin, isEnabled } from 'erxes-api-shared/utils';

export const coreTRPCClient = async (): Promise<
  ReturnType<typeof createTRPCUntypedClient>
> => {
  const isCoreEnabled = await isEnabled('core');

  if (!isCoreEnabled) {
    throw new Error('Core plugin is not enabled');
  }

  const core = await getPlugin('core');

  const client = createTRPCUntypedClient({
    links: [httpBatchLink({ url: core.address + '/trpc' })],
  });

  return client;
};
`;

  fs.writeFileSync(
    path.join(backendPluginDir, 'src', 'trpc', 'trpcClients.ts'),
    trpcClientsContent,
  );

  // Create modules/${moduleName}/types/index.ts
  const moduleTypesContent = `import { Document } from 'mongoose';

export interface I${capitalizedModuleName} {
  name?: string;
}

export interface I${capitalizedModuleName}Document extends I${capitalizedModuleName}, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
`;

  fs.writeFileSync(
    path.join(
      backendPluginDir,
      'src',
      'modules',
      moduleName,
      '@types',
      `${moduleName}.ts`,
    ),
    moduleTypesContent,
  );

  // Create modules/${moduleName}/graphql/schemas/extensions.ts
  const extensionsContent = `export const TypeExtensions = \`
  type Query {
    hello: String
  }

  type Mutation {
    hello: String
  }
\`;`;

  fs.writeFileSync(
    path.join(
      backendPluginDir,
      'src',
      'modules',
      moduleName,
      'graphql',
      'schemas',
      'extensions.ts',
    ),
    extensionsContent,
  );

  // Create .gitignore
  const gitignoreContent = `node_modules
dist
.env
*.log
`;

  fs.writeFileSync(path.join(backendPluginDir, '.gitignore'), gitignoreContent);

  console.log(`\nNext steps:`);
  console.log(`1. cd backend/plugins/${kebabCaseName}_api`);
  console.log(`2. npm install`);
  console.log(`3. Start developing your plugin!`);
}

module.exports = { createBackendPlugin };
