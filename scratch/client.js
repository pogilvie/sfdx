var columnify = require('columnify');
var rows = [
    { name: 'appple', kind: 'fruit' },
    { name: 'banana', kind: 'fruit' },
    { name: 'peas', kind: 'vegatable' }
];
console.log(columnify(rows));
