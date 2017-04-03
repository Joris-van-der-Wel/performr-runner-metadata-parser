'use strict';

const babylon = require('babylon');

const BABYLON_OPTIONS = Object.freeze({
    sourceType: 'script',
});

// foo: Bar baz
const META_FORMAT = /^\s*([^:]+?)\s*:\s*(.*?)\s*$/;

const metaDataParser = scriptContent => {
    const ast = babylon.parse(`(async () => { ${scriptContent} })`, BABYLON_OPTIONS);
    const result = [];

    const parseLiteral = literalValue => {
        const matches = META_FORMAT.exec(literalValue);
        if (!matches) {
            return;
        }

        const [, key, value] = matches;
        result.push({key, value});
    };

    for (const programBodyItem of ast.program.body) {
        if (programBodyItem.type === 'ExpressionStatement' && programBodyItem.expression.type === 'ArrowFunctionExpression') {

            for (const item of programBodyItem.expression.body.directives) {
                if (item.type === 'Directive' && item.value.type === 'DirectiveLiteral') {
                    parseLiteral(item.value.value);
                }
            }

            for (const item of programBodyItem.expression.body.body) {
                if (item.type === 'ExpressionStatement' && item.expression.type === 'StringLiteral') {
                    parseLiteral(item.expression.value);
                }
            }

            break;
        }
    }

    return result;
};

module.exports = metaDataParser;
