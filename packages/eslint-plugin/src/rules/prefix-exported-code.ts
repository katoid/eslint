import { createRule } from '../utils/create-eslint-rule';

export const RULE_NAME = 'prefix-exported-code';
type Types = 'class' | 'interface' | 'function' | 'variable';

export const rule = createRule({
    name: RULE_NAME,
    defaultOptions: [{prefix: '', types: []} as { prefix: string, types?: Types[] }],
    create(context, [{prefix, types}]) {
        prefix = prefix || '';
        types = types || [];

        const targetTypes: { [P in Types]?: 1 } = types.length === 0
            ? {class: 1, interface: 1, function: 1, variable: 1}
            : types.reduce((acc, cur) => ({...acc, [cur]: 1}), {})

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

            // Check if node name starts with the specified prefix. Note that it is case-insensitive.
            if (!name.toLowerCase().startsWith(prefix.toLowerCase())) {
                context.report({
                    node,
                    messageId: 'ktdPrefixMessage',
                    data: {prefix},
                });
            }
        }

        return {
            ExportNamedDeclaration(node) {
                const {declaration} = node;

                if (declaration) {
                    if (
                        (targetTypes['function'] && declaration.type === 'FunctionDeclaration') ||
                        (targetTypes['class'] && declaration.type === 'ClassDeclaration') ||
                        (targetTypes['interface'] && declaration.type === 'TSInterfaceDeclaration')
                    ) {
                        checkExportedName(declaration.id);
                    } else if (targetTypes['variable'] && declaration.type === 'VariableDeclaration') {
                        context
                            .getDeclaredVariables(declaration)
                            .map(v => v.defs.find(d => d.parent === declaration))
                            .map(d => d?.name) // Identifier nodes
                            .forEach(checkExportedName);
                    }
                } else {
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
                'Exported class/interface/function/constant should be prefixed with "{{prefix}}"',
        },
        type: 'suggestion',
        schema: [
            {
                type: 'object',
                properties: {
                    prefix: {type: 'string'},
                    types: {
                        type: 'array',
                        items: {
                            enum: ['class', 'interface', 'function', 'variable']
                        }
                    },
                },
                additionalProperties: false,
            },
        ],
    },
});
