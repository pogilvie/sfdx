"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@salesforce/command");
const core_1 = require("@salesforce/core");
core_1.Messages.importMessagesDirectory(__dirname);
const messages = core_1.Messages.loadMessages('@pogilvie/sfdx', 'big');
class Hello extends command_1.SfdxCommand {
    async run() {
        const c = this.org.getConnection();
        c.sobject('ev__e').insert([{
                opcode__c: 'HELLO',
                msg__c: 'Hello World!'
            }], function (err, ret) {
            console.log(`err ${err} ret ${JSON.stringify(ret)}`);
        });
        return null;
    }
}
Hello.description = messages.getMessage('command-description');
Hello.examples = [messages.getMessage('command-example')];
Hello.args = [{ name: 'file' }];
Hello.requiresUsername = true;
Hello.supportsDevhubUsername = false;
Hello.requiresProject = false;
Hello.flagsConfig = {
    name: command_1.flags.string({ char: 'n', description: messages.getMessage('name-flag') }),
    force: command_1.flags.boolean({ char: 'f', description: messages.getMessage('f-flag') })
};
exports.default = Hello;
//# sourceMappingURL=hello.js.map