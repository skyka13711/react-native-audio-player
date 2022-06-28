module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
        version: 'detect',
    },
  },
  "ignorePatterns": ["**/*.js"],
  rules: {
    'prettier/prettier': 0,
    'no-plusplus': 0,
    "@typescript-eslint/explicit-function-return-type": {
      "allowExpressions": true,
    },
    'object-curly-spacing': [0, 'arraysInObjects'],
    'import/prefer-default-export': 0,
    'no-continue': 0,
    'consistent-return': 0,
    'semi': [2, 'never'],
    'prefer-arrow-callback': 'off',
    'func-names': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'src//*.spec.ts',
        'src//*.spec.js',
      ],
    }],
    "no-nested-ternary": "error",
    "react/prop-types": 0,
    "no-invalid-this": 0,
    "require-jsdoc": 0,
    '@typescript-eslint/no-var-requires': 0,
    'import/extensions': 0,
    'import/no-unresolved': 'off',
    "@typescript-eslint/no-unused-vars": "off",
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  plugins: ['import', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:react-hooks/recommended",
    "plugin:react/recommended"
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
}
