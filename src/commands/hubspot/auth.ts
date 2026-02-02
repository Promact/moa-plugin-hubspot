import {Command} from '@oclif/core'
import {HubSpotAdapter} from '../../lib/adapters/hubspot-adapter.js'

export default class HubspotAuth extends Command {
    static description = 'Authenticate with HubSpot'

    static examples = ['<%= config.bin %> <%= command.id %>']

    public async run(): Promise<void> {
        const adapter = new HubSpotAdapter()
        try {
            await adapter.authenticate()
            this.log('Authentication setup complete.')
        } catch (error: unknown) {
            this.error((error as Error).message)
        }
    }
}
