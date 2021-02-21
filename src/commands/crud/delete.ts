import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';

export default class Delete extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'Delete a record using REST from a JSON file'
  public static examples = [
    `$ sfdx crud:delete -s Account -i 001S000001LGtY3IAL -u my-org-alias
    `
  ]

  protected static flagsConfig = {
    sobject: flags.string({
      required: true,
      char: 's', 
      description: 'sobject type Account, CustomObject__c, ...' 
    }),
    id: flags.filepath({
      required: true,
      char: 'i', 
      description: 'record id'
    })
  };


  public async run(): Promise<AnyJson> {

    console.log(this.flags)

    const c = this.org.getConnection();
    const result = await c.sobject(this.flags.sobject).destroy(this.flags.id)

    console.log(result)

    return <AnyJson><unknown>result

  }
}
