import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';

export default class Read extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'Read a record using REST using a recordId'
  public static examples = [
    `$ sfdx crud:read -s Account, -i 00102000007GstXAAS  -u my-org-alias
    $ sfdx crud:read -s Account, -i 00102000007GstXAAS,00102000007GsveAAC -u my-org-alias
    `
  ]

  protected static flagsConfig = {
    sobject: flags.string({
      required: true,
      char: 's', 
      description: 'sobject type Account, CustomObject__c, ...' 
    }),
    ids: flags.string({
      required: true,
      char: 'i', 
      description: 'record id or ids comma separated with no spaces' 
    })
  };

  public async run(): Promise<AnyJson> {

    console.log(this.flags)
    const ids = this.flags.ids.split(',')

    const c = this.org.getConnection();
    const result = await c.sobject(this.flags.sobject).retrieve(ids) as Array<object>

    result.forEach( r => {
      for (let field in r) {
        if (r[field] && field != 'attributes') {
          console.log(`${field}: ${r[field]}`)
        }
      }
    })
    return <AnyJson><unknown>result
  }
}
