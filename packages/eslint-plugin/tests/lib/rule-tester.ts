import { RuleTester } from '@typescript-eslint/experimental-utils/dist/eslint-utils';

const ruleTester = new RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 2018, sourceType: 'module', ecmaFeatures: { jsx: true } },
});

export { ruleTester, RuleTester };
