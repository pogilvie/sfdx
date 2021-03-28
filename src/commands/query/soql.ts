import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import * as fs from 'fs'
const columnify = require('columnify');

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


export default class Soql extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'Issue soql query from a file'
  public static examples = [
    `$ sfdx query:soql  -f ./accounts.soql -u my-org-alias

    account.soql:
    SELECT Id, Name
    FROM Account
    WHERE Name like '%Sara%'

    output:
    ID                 NAME        
    001S000001LGtY3IAL Sara Account
    001S000001LGdorIAD Sara Account
    001S000001LGdowIAD Sara Account
    `
  ]

  protected static flagsConfig = {
    file: flags.filepath({
      required: true,
      char: 'f', 
      description: 'soql file'
    })
  };

  public async run(): Promise<AnyJson> {

    const c = this.org.getConnection();
    const result = await c.query(this.file2query(this.flags.file))

    // console.log(JSON.stringify(result, null, 4))
    const simpleRows = simplifyQuery(result)
    
    const rows = []
    simpleRows.forEach(r => {
      rows.push(flatten(null, r))
    })

    console.log(columnify(rows))

    return <AnyJson><unknown>result
  }

  fillRow(record: any) : any {
    const row = {}

    for (let property in record) {
      if (property != 'attributes') {
        row[property] = record[property]
      }
    }
    return row
  }

  file2query(filePath: string) : string {
    const soql :string = fs.readFileSync(filePath, 'utf8')
    return soql.replace('\n', ' ')
  }
}
