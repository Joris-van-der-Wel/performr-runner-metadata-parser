'use strict';

const {describe, it} = require('mocha-sugar-free');
const {assert} = require('chai');

const metaDataParser = require('../');

describe('performr-runner-metadata-parser', () => {
    it('should parse DirectiveLiteral and StringLiteral-ExpressionStatement at the top of the script', () => {
        const script = `
        'use strict';
        'abc: def';
        //'abc: deffg';
        'Foo:    Bar   Baz    ';
        doStuff('abc: fegwgw');
        'Foo: quux';
        ['Foo: quuxxxxxx'];
        'Empty:'
        const stuff = 'Foo: asdf';

        async function doStuff() {
            'Oof: Zab Rab';
            'Foo: quux';
            await delay(123);
        }

        // await delay(123);

        return 1234; // performr-runner wraps the script in an async function
        `;

        const result = metaDataParser(script);

        assert.deepEqual(result, [
            {key: 'abc', value: 'def'},
            {key: 'Foo', value: 'Bar   Baz'},
            {key: 'Foo', value: 'quux'},
            {key: 'Empty', value: ''},
        ]);
    })
});
