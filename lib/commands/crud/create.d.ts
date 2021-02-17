import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
export default class Create extends SfdxCommand {
    protected static requiresUsername: boolean;
    protected static requiresProject: boolean;
    static description: string;
    static examples: string[];
    protected static flagsConfig: {
        sobject: flags.Discriminated<flags.Option<string>>;
        file: flags.Discriminated<flags.Option<string>>;
    };
    run(): Promise<AnyJson>;
}
