import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
import PQueue from 'p-queue'

function *example() : Generator<any> {
  let count = 0
  while (1) {
    yield {
      msg: "Hello, World!",
      value: count++
    }
  }
}

export default class Run extends SfdxCommand {

  protected static requiresUsername = true;
  protected static requiresProject = false;
  public static description = 'Test performance / correctness of a apex rest endpoint'
  public static examples = [ ]
  protected static flagsConfig = { 
    endpoint: flags.string( { char: 'e', description: 'API name of sobject', required: true } ),
    iterations: flags.integer( { char: 'i', description: 'iterations', default: 5 } ),
    interval: flags.integer( {char: 't', description: 'interval time in msec', default: 1000}),
    concurrency: flags.integer( {char: 'c', description: 'number of requests per interval', default: 5})
  };

  public async run(): Promise<AnyJson> {
    console.log(this.flags)

    const queue = new PQueue({ 
      concurrency: this.flags.concurrency,
      intervalCap: this.flags.concurrency,
      interval: this.flags.interval,
      carryoverConcurrencyCount: true 
    });

    const iterator = example()

    console.log('Hello, World!')
    
    let  min = 1000000000, max = 0, total = 0, successes = 0, failures = 0
    
    const c = this.org.getConnection()
  
    for (let i = 0; i < this.flags.iterations; i++) {
      queue.add( async () => {
        console.log(`start ${i}`)
        const start = Date.now()
        try {
          const result = await c.apex.post(this.flags.endpoint, iterator.next().value)
          successes += 1
        } catch (e) {
          failures += 1
          console.log(`Failed ${i}:`, e)
        } finally {
          const delta = Date.now() - start
          total += delta
          min = (delta < min) ? delta : min
          max = (delta > max) ? delta : max
          console.log(`end ${i} ${delta}`)
        }
      })
    }
    queue.onIdle().then( () => console.log(`min:${min} max:${max} ave:${total/this.flags.iterations} succ:${successes} fail:${failures}`) )
    
    return <AnyJson><unknown>null
  }
}
