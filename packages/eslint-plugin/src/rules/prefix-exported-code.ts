import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export const RULE_NAME = 'prefix-exported-code';

const createRule = ESLintUtils.RuleCreator(name => `https://example.com/rule/${name}`);

// Type: RuleModule<"uppercase", ...>
export const rule = createRule({
    name: RULE_NAME,
    defaultOptions: [{ prefix: '' }],
    create(context, [{ prefix }]) {
        prefix = prefix || '';

        function getModuleExportName(node: any): string {
            if (node.type === 'Identifier') {
                return node.name;
            }

            // string literal
            return node.value;
        }

        /**
         * Checks and reports given exported name.
         * @param node exported `Identifier` or string `Literal` node to check.
         * @returns {void}
         */
        function checkExportedName(node: any) {
            const name = getModuleExportName(node);

            if (!name.toLowerCase().startsWith(prefix.toLowerCase())) {
                context.report({
                    node,
                    messageId: 'ktdPrefixMessage',
                    data: { name },
                });
            }
        }

        return {
            ExportNamedDeclaration(node) {
                const { declaration } = node;

                if (declaration) {
                    if (
                        declaration.type === 'FunctionDeclaration' ||
                        declaration.type === 'ClassDeclaration' ||
                        declaration.type === 'TSInterfaceDeclaration'
                    ) {
                        checkExportedName(declaration.id);
                    } else if (declaration.type === 'VariableDeclaration') {
                        context
                            .getDeclaredVariables(declaration)
                            .map(v => v.defs.find(d => d.parent === declaration))
                            .map(d => d?.name) // Identifier nodes
                            .forEach(checkExportedName);
                    }
                } else {
                    console.log('Else specifiers', node.specifiers);
                    node.specifiers.map(s => s.exported).forEach(checkExportedName);
                }
            },
        };
    },
    meta: {
        docs: {
            recommended: 'error',
            description: `Forces to add the {{prefix}} to every class/interface/function/constant that is exported and consumed in other modules`,
        },
        messages: {
            ktdPrefixMessage:
                'Exported class/interface/function/constant should be prefixed with {{prefix}}',
        },
        type: 'suggestion',

        schema: [
            {
                type: 'object',
                properties: {
                    prefix: {
                        oneOf: [{ type: 'string' }, { type: 'array' }],
                    },
                },
                additionalProperties: false,
            },
        ],
    },
});
