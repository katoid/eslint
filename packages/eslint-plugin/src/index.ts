import {
    rule as ktdPrefixRule,
    RULE_NAME as ktdPrefixRuleName,
} from './rules/prefix-exported-code';

const rules = {
    [ktdPrefixRuleName]: ktdPrefixRule,
};

export { rules };
