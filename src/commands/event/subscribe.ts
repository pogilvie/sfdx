import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';

export default class Subscribe extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'Subscribe to a platform event channel'
  public static examples = [
    `$ sfdx event:subscribe -e event__c -u my-org-alias
    `
  ]

  protected static flagsConfig = {
    event: flags.string({
      required: true,
      char: 'e', 
      description: 'event type CustomEvent__e' 
    })
  };

  public async run(): Promise<AnyJson> {

    console.log(this.flags)

    const c = this.org.getConnection();
    c.streaming.topic(`/event/${this.flags.event}`)
    .subscribe( msg => {
      console.log(msg)
    })

    return <AnyJson><unknown>null
  }
}
