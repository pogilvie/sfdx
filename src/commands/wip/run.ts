import { flags, SfdxCommand } from '@salesforce/command'
import { AnyJson } from '@salesforce/ts-types'
import  json2object  from '../../json2object'
const { MongoClient } = require("mongodb")

enum Opcode {
  NOOP = 'noop',
  START = 'start',
  CREATE = 'create'
}

type Action = {
  opcode : Opcode,
  sobject : string,
  name: string,
  payload: any
}

function getOpcode(input: string) : Opcode {

  switch (input) {
    case 'start': return Opcode.START
    case 'create': return Opcode.CREATE
    default: throw `Error: illegal opcode ${input}`
  }
}

function getAction(input: any) : Action {

  const action = {
    opcode: Opcode.NOOP,
    sobject: 'none',
    name: 'noname',
    payload: null
  }


  if (Array.isArray(input)) {
    throw 'ERROR: input a single action my not be an array'
  }

  for (let property in input) {

    switch (property) {
      case 'opcode': 
        action.opcode = getOpcode(input[property])
      break

      case 'sobject': 
      case 'name':
        if (typeof input[property] != 'string') {
          throw `ERROR: ${property} value must be of type string: ${typeof input[property]}`
        }
        action[property] = input[property]
      break

      case 'payload':
        if (typeof input[property] != 'object')  {
          throw `ERROR: payload value must be of type object: ${typeof input[property]}`
        }
        action.payload = input[property]
      break

      default:
        throw `ERROR: unknown property ${property}`
    }
  }
  return action
}

function getActions(input: any) : Action[] {
  const output = [] as Action[]

  if (!input.actions) {
    console.log('ERROR: input missing actions')
    return null
  }

  if (!Array.isArray(input.actions)) {
    console.log('ERROR: input acctions must be an array')
  }

  input.actions.forEach(element => {
    output.push(getAction(element))
  })
  return output
}

export default class Run extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'Run a WIP command'
  public static examples = [
    `$ sfdx wip:run -r run001 -f ./setup.json -u my-org-alias
    where account.json looks like
    { 
      "actions" : [
        {
          "option" : "create",
          "sojbect" : "Account",
          "name" : "DoeAccount",
          "payload" : {
            "Name": "Doe Account",
            "Phone": "123-555-1212",
            "BillingStreet" : "123 Main Street",
            "BillingCity" : "Any Town",
            "BillingState" : "CA",  
            "BillingCountry": "US"
          }
        }
      ]
    }
    `
  ]

  protected static flagsConfig = {
    runid: flags.string({
      required: true,
      char: 'r', 
      description: 'all steps in a test share a runid' 
    }),
    file: flags.filepath({
      required: true,
      char: 'f', 
      description: 'json file'
    })
  };

  public async run(): Promise<AnyJson> {
    console.log(this.flags)
    
    const actions = getActions(json2object(this.flags.file))

    actions.forEach(action => {
      switch (action.opcode) {
        case Opcode.CREATE:
          this.create(action.sobject, action.name, action.payload)
        break
      }
      console.log(action)
    })
    return <AnyJson><unknown>null
  }

  async start(name: string) {

    // jsforce
    const sfdc = this.org.getConnection();

    // monogo
    const uri = "mongodb://localhost:27017";
    const options = { useUnifiedTopology: true }
    const client = new MongoClient(uri, options);
    await client.connect();
    const database = client.db('test');
    const run = database.collection('run');

    run.insertOne({runid: this.flags.runid})

    return [sfdc, client, run]
  }

  async create(sobject : string, name: string, payload : any) {
    const [sfdc, client, run] = await this.start(name)

    const s_result = await sfdc.sobject(sobject).create(payload)
    console.log('salesforce result:', s_result)

    // mongo
    const update = {}
    update[name] = s_result.id
    const u_result = await run.updateOne({runid: this.flags.runid}, {$set: update})
    console.log('u_result', u_result.result)

    await client.close();
  }
}
