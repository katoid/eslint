import { ruleTester } from '../rule-tester';
import { rule } from '../../../src/rules/prefix-exported-code';

ruleTester.run(`Code should be prefixed with ktd`, rule, {
    valid: [
        // Test valid exported and non-exported function
        {
            options: [{ prefix: 'ktd' }],
            code: `function test() {}`,
        },
        {
            options: [{ prefix: 'ktd' }],
            code: `export function ktdTest() {}`,
        },

        // Test valid exported and non-exported interface
        {
            options: [{ prefix: 'ktd' }],
            code: `interface Test {}`,
        },
        {
            options: [{ prefix: 'ktd' }],
            code: `export interface KtdTest {}`,
        },

        // Test valid exported and non-exported classes
        {
            options: [{ prefix: 'ktd' }],
            code: `class Test {}`,
        },
        {
            options: [{ prefix: 'ktd' }],
            code: `export class KtdTest {}`,
        },

        // Test valid exported and non-exported variables
        {
            options: [{ prefix: 'ktd' }],
            code: `const test = {}`,
        },
        {
            options: [{ prefix: 'ktd' }],
            code: `export const ktdTest = {}`,
        },
        {
            name: 'Non directly exported variables should be prefixed',
            options: [{ prefix: 'ktd' }],
            code: `
                const test = 0;
                export { test as ktdTest };
            `,
        },
    ],
    invalid: [
        {
            name: 'Exported functions should be prefixed',
            options: [{ prefix: 'ktd' }],
            code: `export function test() {}`,
            errors: [{ messageId: 'ktdPrefixMessage' }],
        },
        {
            name: 'Exported interfaces should be prefixed',
            options: [{ prefix: 'ktd' }],
            code: `export interface Test {}`,
            errors: [{ messageId: 'ktdPrefixMessage' }],
        },
        {
            name: 'Exported classes should be prefixed',
            options: [{ prefix: 'ktd' }],
            code: `export class Test {}`,
            errors: [{ messageId: 'ktdPrefixMessage' }],
        },
        {
            name: 'Exported variables should be prefixed',
            options: [{ prefix: 'ktd' }],
            code: `export const test = {}`,
            errors: [{ messageId: 'ktdPrefixMessage' }],
        },
        {
            name: 'Non directly exported variables should be prefixed',
            options: [{ prefix: 'ktd' }],
            code: `
                const test = 0;
                export { test };
            `,
            errors: [{ messageId: 'ktdPrefixMessage' }],
        },
    ],
});
