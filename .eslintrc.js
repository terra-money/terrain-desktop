module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['extensions/**/*'],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'max-len': ['error', { code: 175 }],
    '@typescript-eslint/no-unused-vars': ['error'],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/jsx-props-no-spreading': 0,
    camelcase: 0,
    'import/no-unresolved': 0,
    'react/function-component-definition': 0,
    'react/jsx-no-useless-fragment': 0,
    'react/no-unstable-nested-components': 'warn',
    'class-methods-use-this': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'no-param-reassign': 0,
    'import/no-extraneous-dependencies': 0,
    'no-nested-ternary': 0,
    'react/no-array-index-key': 0,
    'react/destructuring-assignment': 0,
    'consistent-return': 0,
    'no-use-before-define': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
