const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          allowCircularSelfDependency: true,
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // 1. React imports first
            ['^react', '^react-dom'],
            ['^@?\\w'],
            // 4. Absolute imports from workspace (adjust based on your scope)
            ['erxes-ui/(.*)$'],
            // 5. Relative imports
            ['^\\./', '^\\.\\.\\/'],
            // 6. Type imports (TypeScript)
            ['^.+\\.d\\.ts$'],
            // 7. Side effect imports
            ['^\\u0000']
          ]
        },
      ],
      'simple-import-sort/exports': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
    },
  },
];
