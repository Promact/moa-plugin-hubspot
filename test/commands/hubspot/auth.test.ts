import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {HubSpotAdapter} from '../../../src/lib/adapters/hubspot-adapter.js'

describe('hubspot:auth', () => {
    let authenticateStub: sinon.SinonStub

    beforeEach(() => {
        authenticateStub = sinon.stub(HubSpotAdapter.prototype, 'authenticate').resolves()
    })

    afterEach(() => {
        sinon.restore()
    })

    it('runs hubspot:auth', async () => {
        const {stdout} = await runCommand('hubspot:auth')
        sinon.assert.calledOnce(authenticateStub)
        expect(stdout).to.contain('Authentication setup complete.')
    })
})
