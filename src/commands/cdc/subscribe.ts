import { SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import { CometD } from 'cometd';
import { adapt } from 'cometd-nodejs-client';

export default class Subscribe extends SfdxCommand {
  
  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = "Subscribe to an org's change data capture stream"
  public static examples = [
    `$ sfdx cdc:subscribe  -u my-org-alias
    `
  ]
  
  public async run(): Promise<AnyJson> {
    
    const c = this.org.getConnection()
    
    adapt()

    const cometd = new CometD();

    cometd.configure({
      url: c.instanceUrl + '/cometd/44.0',
      requestHeaders: {
        Authorization: 'Bearer ' + c.accessToken
      },
      appendMessageTypeToURL: false
    })

    cometd.handshake( handshake => {
      if (handshake.successful) {
        console.log('ComedD handshake successful')
        cometd.subscribe('/data/ChangeEvents', msg => {
          console.log(JSON.stringify(msg, null, 4))
        })
      }
    })
  
    return <AnyJson><unknown>null

  }
}
