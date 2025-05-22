const fs = require('fs');
const path = require('path');

function createBackendPlugin(pluginName, moduleName) {
  // Convert plugin name to kebab case
  const kebabCaseName = pluginName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

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
    `src/modules/${moduleName}/models`,
    `src/modules/${moduleName}/types`,
  ];

  backendDirectories.forEach((dir) => {
    fs.mkdirSync(path.join(backendPluginDir, dir), { recursive: true });
  });

  // Create package.json
  const packageJson = {
    name: kebabCaseName + '_api',
    version: '1.0.0',
    description: `${pluginName} API Plugin`,
    main: 'src/main.ts',
    scripts: {
      build: 'tsc',
      dev: 'ts-node-dev --respawn src/main.ts',
      test: 'jest',
    },
    dependencies: {
      '@erxes/api-utils': '^1.0.0',
      '@trpc/server': '^10.0.0',
      'apollo-server-express': '^3.0.0',
      graphql: '^16.8.1',
      'graphql-tools': '^9.0.0',
      mongoose: '^7.0.0',
      zod: '^3.0.0',
    },
    devDependencies: {
      '@types/node': '^18.0.0',
      'ts-node-dev': '^2.0.0',
      typescript: '^5.0.0',
      '@types/jest': '^29.0.0',
      jest: '^29.0.0',
      'ts-jest': '^29.0.0',
    },
  };

  fs.writeFileSync(
    path.join(backendPluginDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );

  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'es2018',
      module: 'commonjs',
      lib: ['es2018', 'esnext.asynciterable'],
      skipLibCheck: true,
      sourceMap: true,
      outDir: './dist',
      moduleResolution: 'node',
      removeComments: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noImplicitThis: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      resolveJsonModule: true,
      baseUrl: '.',
      paths: {
        '@/*': ['src/*'],
      },
    },
    exclude: ['node_modules'],
    include: ['./src/**/*.ts'],
  };

  fs.writeFileSync(
    path.join(backendPluginDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2),
  );

  // Create main.ts
  const mainContent = `import { generateModels } from '@erxes/api-utils/src/core';
import { IModels } from './modules/${moduleName}/types';
import { loadApolloServer } from './apollo/apolloServer';
import { initTRPC } from './trpc/init-trpc';

export const loadPlugin = async (models: IModels) => {
  const apolloServer = await loadApolloServer(models);
  const trpc = initTRPC(models);

  return {
    apolloServer,
    trpc,
  };
};

export const generateAllModels = async (subdomain: string) => {
  const models = await generateModels(subdomain, '${kebabCaseName}_api');
  return models;
};

export default {
  loadPlugin,
  generateAllModels,
};
`;

  fs.writeFileSync(path.join(backendPluginDir, 'src', 'main.ts'), mainContent);

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
import { IModels } from '../modules/${moduleName}/types';

export const initTRPC = (models: IModels) => {
  const t = initTRPC.create();

  const router = t.router;
  const publicProcedure = t.procedure;

  return {
    router,
    publicProcedure,
    models,
  };
};
`;

  fs.writeFileSync(
    path.join(backendPluginDir, 'src', 'trpc', 'init-trpc.ts'),
    initTrpcContent,
  );

  // Create modules/${moduleName}/types/index.ts
  const moduleTypesContent = `import { Document } from 'mongoose';

export interface IModels {
  // Add your model interfaces here
}

export interface IContext {
  subdomain: string;
  models: IModels;
  user: any;
}
`;

  fs.writeFileSync(
    path.join(
      backendPluginDir,
      'src',
      'modules',
      moduleName,
      'types',
      'index.ts',
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
