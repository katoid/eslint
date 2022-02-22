import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export const createRule = ESLintUtils.RuleCreator(
    name => `https://github.com/katoid/eslint/tree/main/packages/eslint-plugin/docs/rules/${name}.md`,
);
