import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
export default class Hello extends SfdxCommand {
    static description: string;
    static examples: string[];
    static args: {
        name: string;
    }[];
    protected static requiresUsername: boolean;
    protected static supportsDevhubUsername: boolean;
    protected static requiresProject: boolean;
    protected static flagsConfig: {
        name: flags.Discriminated<flags.Option<string>>;
        force: flags.Discriminated<flags.Boolean<boolean>>;
    };
    run(): Promise<AnyJson>;
}
