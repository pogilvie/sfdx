import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import  json2object  from '../../json2object'


export default class Create extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'POST to an apexrest endpoint with a payload specified by a JSON file'
  public static examples = [
    `$ sfdx apexrest:post  -e /newaccount -f ./payload.json -u my-org-alias
    where account.json looks like
    { 
      "Name": "Doe Account",
      "Phone": "123-555-1212",
      "BillingStreet" : "123 Main Street",
      "BillingCity" : "Any Town",
      "BillingState" : "CA",  
      "BillingCountry": "US"
    }
    `
  ]

  protected static flagsConfig = {
    endpoint: flags.string({
      required: true,
      char: 'e', 
      description: 'resource path of the apexrest service' 
    }),
    file: flags.filepath({
      required: true,
      char: 'f', 
      description: 'json file'
    })
  };


  public async run(): Promise<AnyJson> {

    console.log(this.flags)

    const c = this.org.getConnection();
    const o = json2object(this.flags.file)
    const result = await c.apex.post(this.flags.endpoint, o)

    console.log(result)

    return <AnyJson><unknown>result

  }
}
