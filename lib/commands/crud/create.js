"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@salesforce/command");
const json2object_1 = require("../../json2object");
class Create extends command_1.SfdxCommand {
    async run() {
        console.log(this.flags);
        const c = this.org.getConnection();
        const o = json2object_1.default(this.flags.file);
        const result = await c.sobject(this.flags.sobject).create(o);
        console.log(result);
        return result;
    }
}
exports.default = Create;
Create.requiresUsername = true;
Create.requiresProject = false;
Create.description = 'Insert a record useing REST from a JSON file';
Create.examples = [
    `$ sfdx crud:create -s Account -f ./account.json -u my-org-alias
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
];
Create.flagsConfig = {
    sobject: command_1.flags.string({
        required: true,
        char: 's',
        description: 'sobject type Account, CustomObject__c, ...'
    }),
    file: command_1.flags.filepath({
        required: true,
        char: 'f',
        description: 'json file'
    })
};
//# sourceMappingURL=create.js.map