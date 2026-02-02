import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {HubSpotAdapter} from '../../../src/lib/adapters/hubspot-adapter.js'

describe('hubspot:contacts', () => {
    let listEntitiesStub: sinon.SinonStub

    beforeEach(() => {
        // Mock the adapter method
        listEntitiesStub = sinon.stub(HubSpotAdapter.prototype, 'listEntities').resolves([
            {
                id: '1',
                properties: {
                    firstname: 'Alice',
                    lastname: 'Smith',
                    email: 'alice@example.com',
                },
                associations: undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
                archived: false,
            },
        ])
    })

    afterEach(() => {
        sinon.restore()
    })

    it('runs hubspot:contacts and lists contacts', async () => {
        const {stdout} = await runCommand('hubspot:contacts')
        sinon.assert.calledOnce(listEntitiesStub)
        expect(stdout).to.contain('Alice Smith (alice@example.com) [ID: 1]')
    })

    it('runs hubspot:contacts --json', async () => {
        const {stdout} = await runCommand('hubspot:contacts --json')
        sinon.assert.calledOnce(listEntitiesStub)
        const output = JSON.parse(stdout)
        expect(output).to.be.an('array')
        expect(output[0].properties.firstname).to.equal('Alice')
    })
})
