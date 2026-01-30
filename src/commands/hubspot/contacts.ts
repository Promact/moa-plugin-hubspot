
import { Command, Flags } from '@oclif/core'
import { HubSpotAdapter } from '../../lib/adapters/hubspot-adapter.js'
import { Table } from 'cli-table3'

// Workaround for cli-table3 import if needed, but standard import usually works with esModuleInterop
// or use 'cli-table3' directly if configured. 
// moa-cli-core uses cli-table3, but we need to add it to this plugin's package.json or use it from there?
// Better to add it to this package.json for safety.

export default class HubspotContacts extends Command {
    static description = 'List contacts from HubSpot'

    static flags = {
        limit: Flags.integer({ char: 'l', description: 'max number of contacts to list', default: 10 }),
        json: Flags.boolean({ char: 'j', description: 'output as json' }),
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(HubspotContacts)

        const adapter = new HubSpotAdapter()
        try {
            const contacts = await adapter.listEntities('contact', { limit: flags.limit })

            if (flags.json) {
                this.log(JSON.stringify(contacts, null, 2))
            } else {
                // simple list output for now, skipping complex table for brevity unless requested
                // or import cli-table3
                if (contacts.length === 0) {
                    this.log('No contacts found.')
                    return
                }

                this.log('Contacts:')
                for (const contact of contacts) {
                    this.log(`- ${contact.firstname} ${contact.lastname} (${contact.email}) [ID: ${contact.id}]`)
                }
            }
        } catch (error: any) {
            this.error(error.message)
        }
    }
}
