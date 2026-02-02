import {AuthManager} from '@promactinfo/moa-cli'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {HubSpotAdapter} from '../../../src/lib/adapters/hubspot-adapter.js'
import {IPrompter} from '../../../src/lib/prompter.js'

describe('HubSpotAdapter', () => {
    let adapter: HubSpotAdapter
    let sandbox: sinon.SinonSandbox
    let setCredentialsStub: sinon.SinonStub
    let createClientInstanceStub: sinon.SinonStub
    let mockPrompter: sinon.SinonStubbedInstance<IPrompter>

    beforeEach(() => {
        sandbox = sinon.createSandbox()

        // Stub AuthManager prototype methods
        setCredentialsStub = sandbox.stub(AuthManager.prototype, 'setCredentials').resolves()
        sandbox.stub(AuthManager.prototype, 'getToken').resolves('mock-token')

        mockPrompter = {
            // biome-ignore lint/suspicious/noExplicitAny: Mocking strict types
            select: sandbox.stub() as any,
            // biome-ignore lint/suspicious/noExplicitAny: Mocking strict types
            password: sandbox.stub() as any,
        }

        adapter = new HubSpotAdapter(mockPrompter)

        // Mock the createClientInstance method to return a mock client
        const mockClient = {
            crm: {
                contacts: {
                    basicApi: {
                        getPage: sandbox.stub().resolves({results: []}),
                        getById: sandbox.stub().resolves({
                            properties: {firstname: 'John', lastname: 'Doe', email: 'john@example.com'},
                            id: '123',
                        }),
                    },
                },
                deals: {
                    basicApi: {
                        getPage: sandbox.stub().resolves({results: []}),
                        getById: sandbox.stub().resolves({id: 'deal-1'}),
                    },
                },
                companies: {
                    basicApi: {
                        getPage: sandbox.stub().resolves({results: []}),
                        getById: sandbox.stub().resolves({id: 'company-1'}),
                    },
                },
            },
        }
        // @ts-ignore
        createClientInstanceStub = sandbox.stub(adapter, 'createClientInstance').returns(mockClient)
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('authenticate', () => {
        it('should successfully authenticate with a valid token', async () => {
            mockPrompter.select.resolves('token')
            mockPrompter.password.resolves('valid-token')

            await adapter.authenticate()

            sinon.assert.calledWith(createClientInstanceStub, 'valid-token')
            sinon.assert.calledWith(setCredentialsStub, 'hubspot', {
                token: 'valid-token',
                tokenType: 'bearer',
            })
        })
    })

    describe('getEntity', () => {
        it('should get a contact', async () => {
            const contact = await adapter.getEntity('contact', '123')
            expect(contact.id).to.equal('123')
            // @ts-ignore
            expect(contact.properties.firstname).to.equal('John')
        })

        it('should throw error for unsupported entity', async () => {
            try {
                await adapter.getEntity('unknown', '123')
                expect.fail('Should have thrown error')
                // biome-ignore lint/suspicious/noExplicitAny: Testing error handling
            } catch (error: any) {
                expect(error.message).to.contain('Unsupported entity type')
            }
        })
    })

    describe('listEntities', () => {
        it('should list contacts', async () => {
            const result = await adapter.listEntities('contact')
            expect(result).to.be.an('array')
        })
    })
})
