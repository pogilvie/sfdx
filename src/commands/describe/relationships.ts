import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
const columnify = require('columnify');

export default class Relationships extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'List relationships defined for an sobject'
  public static examples = [
    `$ sfdx desribe:relationships -s Account -u my-org-alias
    `
  ]

  protected static flagsConfig = {
    sobject: flags.string({
      required: true,
      char: 's', 
      description: 'sobject type Account, CustomObject__c, ...' 
    })
  };


  public async run(): Promise<AnyJson> {

    console.log(this.flags)

    const c = this.org.getConnection();
    const result = await c.describe(this.flags.sobject)
    
    const rows = []

    result.childRelationships.forEach(record => {
      let r = <any>record
      let row = { 
        RelationshipName: r.relationshipName,
        ChildSobject: r.childSObject, 
        Field: r.field,
        CascaseDelete: r.cascadeDelete,
        RestrictedDelete: r.restrictedDelete
      }
      rows.push(row)
    })

    console.log(columnify(rows))

    // console.log(result)

    return <AnyJson><unknown>result

  }
}
