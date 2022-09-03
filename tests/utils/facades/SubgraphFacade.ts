import { LiquidityCampaign, Transaction } from '../TestTypes'
import { LIQUIDITY_CAMPAIGNS_QUERY, TOKENS_QUERY, TRANSACTIONS_QUERY } from './SubgraphQueries'

export class SubgraphFacade {
  private static SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-rinkeby'
  static transaction(txid: string, retries = 0): Transaction | Cypress.Chainable {
    return cy
      .request({
        method: 'POST',
        url: this.SUBGRAPH_URL,
        body: {
          query: TRANSACTIONS_QUERY(txid),
        },
      })
      .then(resp => {
        try {
          expect(resp.body.data.transactions).to.have.length.greaterThan(0)
        } catch (err) {
          console.log('Subgraph response: ', resp)
          cy.wait(1000)
          if (retries > 200) {
            throw new Error('Retried too many times')
          }
          return this.transaction(txid, ++retries)
        }
        return resp
      })
  }
  static tokens() {
    return cy.request({
      method: 'POST',
      url: this.SUBGRAPH_URL,
      body: {
        query: TOKENS_QUERY,
      },
    })
  }
  static liquidityCampaign(owner: string, startsAt: number, retries = 0): LiquidityCampaign | Cypress.Chainable {
    return cy
      .request({
        method: 'POST',
        url: this.SUBGRAPH_URL,
        body: {
          query: LIQUIDITY_CAMPAIGNS_QUERY(owner, startsAt),
        },
      })
      .then(resp => {
        try {
          console.log('Subgraph response: ', resp)
          expect(resp.body.data.liquidityMiningCampaigns).to.have.length.greaterThan(0)
        } catch (err) {
          if (retries > 200) {
            throw new Error('Retried too many times')
          }
          cy.wait(500)
          return this.liquidityCampaign(owner, startsAt, ++retries)
        }
        return resp
      })
  }
}
