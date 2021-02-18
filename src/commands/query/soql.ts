import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import * as fs from 'fs'
const columnify = require('columnify');

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

    const rows = []

    result.records.forEach(record => {
      let r = <any>record
      let row = { Id: r.Id, Name: r.Name }
      rows.push(row)
    })

    console.log(columnify(rows))

    return <AnyJson><unknown>result

  }

  file2query(filePath: string) : string {
    const soql :string = fs.readFileSync(filePath, 'utf8')
    return soql.replace('\n', ' ')
  }
}
