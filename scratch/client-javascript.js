
const columnify = require('columnify');


rows = [
  { name: 'appple', kind: 'fruit' },
  { name: 'banana', kind: 'fruit' },
  { name: 'peas', kind: 'vegatable' }
];

console.log(columnify(rows))