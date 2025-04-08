module.exports = {
  extends: ['../../.eslintrc.cjs'],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['backend/erxes-shared/tsconfig.{json,*.json}'],
      },
      rules: {
        '@nx/dependency-checks': 'error',
      },
    },
  ],
};
