import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
const  request = require('request')

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export default class Call extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'Call UPI on salesforce record'
  public static examples = [ ]
  protected static flagsConfig = { 
    sobject: flags.string( { char: 's', description: 'API name of sobject', required: true } ),
    recordtypeid: flags.string( { char: 'r', description: 'RecordTypeId', required: true } ),
    picklist: flags.string( {char: 'p', description: 'API name of picklist field', required: true})
  };

  url() : string {
    const 
      c = this.org.getConnection(),
      domain = c.instanceUrl + '/services/data/v50.0',
      uri = `/ui-api/object-info/${this.flags.sobject}/picklist-values/${this.flags.recordtypeid}`
    
      return domain + uri
  }

  headers() {
    return {
      Authorization: 'Bearer ' + this.org.getConnection().accessToken,
      "X-PrettyPrint": 1 
    }
  }

  public async run(): Promise<AnyJson> {
    console.log(this.flags)
    
    request({ url: this.url(), method: 'GET', headers: this.headers() },  (e, r, body) => {
      if (e) {
        console.log('error:', e)
        return
      }
      if (r.statusCode)
      console.log('response code: ', r.statusCode);
      
      const payload = JSON.parse(body)
      
      const picklist = payload.picklistFieldValues[this.flags.picklist]
      console.log('picklist: ', picklist)
  
      let controllerValues = picklist.controllerValues
      let values = picklist.values
      console.log('controller values: ', controllerValues)
      values.forEach(e => {
        const validFor = []
        console.log(e.label)
        if (e.validFor.length) {
          e.validFor.forEach( value => { 
            validFor.push(getKeyByValue(controllerValues, value))
            console.log('valid for: ', getKeyByValue(controllerValues, value))
          })
          console.log('valid for', validFor)
        }
      });
    })
    return <AnyJson><unknown>null
  }
}
