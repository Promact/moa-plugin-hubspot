import {Client} from '@hubspot/api-client'
import {SimplePublicObjectWithAssociations} from '@hubspot/api-client/lib/codegen/crm/companies/index.js'
import * as inquirer from '@inquirer/prompts'
import {AuthManager, SaasProvider} from '@promactinfo/moa-cli'

export class HubSpotAdapter implements SaasProvider {
    name = 'hubspot'
    private client: Client | null = null
    private authManager: AuthManager

    constructor() {
        // We get the singleton instance from the core library
        // Note: In a real plugin scenario, you might depend on dependency injection
        // or access these via a shared runtime if exported correctly.
        // For now, assuming direct import works (with local linking or correct package structure).
        this.authManager = new AuthManager()
    }

    async authenticate(): Promise<void> {
        const authMethod = await inquirer.select({
            message: 'Select authentication method for HubSpot:',
            choices: [
                {name: 'Private App Token (Recommended)', value: 'token'},
                // OAuth flow would be more complex requiring a callback server, skipping for MVP/Phase 2 unless specified
            ],
        })

        if (authMethod === 'token') {
            const token = await inquirer.password({
                message: 'Enter your HubSpot Private App Access Token:',
            })

            // Verify token by making a lightweight call
            try {
                const testClient = new Client({accessToken: token})
                await testClient.crm.contacts.basicApi.getPage(1) // Standard test connection

                await this.authManager.setCredentials(this.name, {
                    token,
                    tokenType: 'bearer',
                })

                console.log('✅ Successfully authenticated with HubSpot!')
            } catch (error: unknown) {
                throw new Error(`Authentication failed: ${(error as Error).message}`)
            }
        }
    }

    private async getClient(): Promise<Client> {
        if (this.client) {
            return this.client
        }

        const token = await this.authManager.getToken(this.name)
        if (!token) {
            throw new Error('Not authenticated. Please run "moa hubspot:auth" first.')
        }

        this.client = new Client({accessToken: token})
        return this.client
    }

    async getEntity(entityType: string, id: string): Promise<SimplePublicObjectWithAssociations> {
        const client = await this.getClient()

        switch (entityType.toLowerCase()) {
            case 'contact': {
                const contact = await client.crm.contacts.basicApi.getById(id, ['email', 'firstname', 'lastname'])
                return contact
            }
            case 'deal': {
                const deal = await client.crm.deals.basicApi.getById(id)
                return deal
            }
            case 'company': {
                const company = await client.crm.companies.basicApi.getById(id)
                return company
            }
            default:
                throw new Error(`Unsupported entity type: ${entityType}`)
        }
    }

    async listEntities(entityType: string, filters: unknown = {}): Promise<SimplePublicObjectWithAssociations[]> {
        const client = await this.getClient()
        const limit = (filters as {limit?: number}).limit || 10
        const after = (filters as {cursor?: string}).cursor

        let response

        switch (entityType.toLowerCase()) {
            case 'contact':
                // Note: Properties to fetch can be configured or passed in filters
                response = await client.crm.contacts.basicApi.getPage(limit, after, ['email', 'firstname', 'lastname'])
                return response.results
            case 'deal':
                response = await client.crm.deals.basicApi.getPage(limit, after)
                return response.results
            case 'company':
                response = await client.crm.companies.basicApi.getPage(limit, after)
                return response.results
            default:
                throw new Error(`Unsupported entity type: ${entityType}`)
        }
    }
}
