

const columnify = require('columnify');
const input = require('./output.json')

function isA(x) {
  if (x && typeof x == 'object') {
    if (x['records']) {
      return 'query'
    } else {
      return 'object'
    }
  } else {
    return 'simple'
  }
}

function simplify(record) {
  const r = {}
  
  for (let property in record) {
    if (property == 'attributes') {
      continue
    } else if (isA(record[property]) == 'object') {
      r[property] = simplify(record[property])
    } else if (isA(record[property]) == 'query') {
      r[property] = simplifyQuery(record[property])
    } 
    else {
      r[property] = record[property]
    }
  }
  return r
}

function simplifyQuery(query) {
  const rows = []

  query.records.forEach(record => {
    rows.push(simplify(record))
  })
  return rows
}

function flatten(parent, obj) {
  const flattened = {}
  
  Object.keys(obj).forEach((key) => {
    let path = parent ? parent + '.' + key : key
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        flattened[path] = JSON.stringify(obj[key])
      } else {
        Object.assign(flattened, flatten(path, obj[key]))
      }
    } else {
      flattened[path] = obj[key]
    }
  })

  return flattened
}

console.log('*** simple ***')
const simpleRows = simplifyQuery(input)
const [simple] = simpleRows
console.log(JSON.stringify(simple, null, 4))

console.log('*** flattened ***')
console.log(flatten(null, simple))

console.log('*** columnify ***\n')

const rows = []
simpleRows.forEach(r => {
  rows.push(flatten(null, r))
})

console.log(columnify(rows))
