import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import * as fs from 'fs'
import  json2object  from '../../json2object'


export default class Create extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;

  protected static flagsConfig = {
    sobject: flags.string({
      required: true,
      char: 's', 
      description: 'sobject type Account, CustomObject__c, ...' 
    }),
    file: flags.filepath({
      required: true,
      char: 'f', 
      description: 'json file'
    })
  };


  public async run(): Promise<AnyJson> {

    console.log(this.flags)
    console.log(json2object('/one/two/three'))

    const c = this.org.getConnection();
    const o = this.file2Object(this.flags.file)
    const result = await c.sobject(this.flags.sobject).create(o)

    console.log(result)

    return <AnyJson><unknown>result

  }

  file2Object(filePath: string): Object {
    console.log(filePath)
    const data = fs.readFileSync(filePath, 'utf8')
    const r = JSON.parse(data)
    console.log(r)
    return r
  }
}
