# performr-runner-metadata-parser

```javascript
const metaDataParser = require('performr-runner-metadata-parser');
const assert = require('assert');

const script = `
'use strict';
'abc: def';
'Foo:    Bar   Baz    ';
'Foo: quux';
'Empty:'

function doStuff() {
    'Oof: Zab Rab';
    'Foo: quux';
}
`;

const result = metaDataParser(script);

assert.deepEqual(result, [ 
    {key: 'abc', value: 'def'},
    {key: 'Foo', value: 'Bar   Baz'},
    {key: 'Foo', value: 'quux'},
    {key: 'Empty', value: ''} 
]);
```
