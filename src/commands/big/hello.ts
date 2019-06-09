import { flags, SfdxCommand }  from '@salesforce/command';
import { Messages }            from '@salesforce/core';
import { AnyJson }             from '@salesforce/ts-types';

Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('@pogilvie/sfdx', 'big');

export default class Hello extends SfdxCommand {

    public static               description = messages.getMessage('command-description');
    public static                  examples = [ messages.getMessage('command-example') ];
    public static                      args = [{name: 'file'}];
    protected static       requiresUsername = true;
    protected static supportsDevhubUsername = false;
    protected static        requiresProject = false;

    protected static  flagsConfig = {
         name: flags.string(  {char: 'n', description: messages.getMessage('name-flag')} ),
        force: flags.boolean( {char: 'f', description: messages.getMessage('f-flag')} )
    };

    public async run(): Promise<AnyJson> {

        const c = this.org.getConnection();

         c.sobject('ev__e').insert([{
            opcode__c: 'HELLO',
            msg__c: 'Hello World!'
        }], function (err, ret) {
            console.log(`err ${err} ret ${JSON.stringify(ret)}`)
        })
        return null;
    }
}
