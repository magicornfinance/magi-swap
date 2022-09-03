import { Store } from '@reduxjs/toolkit'
import { BigNumber } from 'ethers'
import { gql } from 'graphql-request'

import { AppState } from '../../../state'
import { clearBridgeTxs } from '../../../state/bridgeTransactions/actions'
import { SupportedChainsConfig } from '../EcoBridge.types'
import { createArbitrumSlice } from './ArbitrumBridge.reducer'

export const migrateBridgeTransactions = (
  store: Store<AppState>,
  actions: ReturnType<typeof createArbitrumSlice>['actions'],
  supportedChains: SupportedChainsConfig
) => {
  const { bridgeTransactions } = store.getState()
  const { from, to } = supportedChains

  const fromTxs = bridgeTransactions[from]
  const toTxs = bridgeTransactions[to]

  if (!fromTxs || !toTxs || !Object.keys(fromTxs).length || !Object.keys(toTxs).length) return

  store.dispatch(actions.migrateTxs({ [from]: fromTxs, [to]: toTxs }))
  store.dispatch(clearBridgeTxs([from, to]))
}

export const QUERY_ETH_PRICE = gql`
  query {
    bundle(id: "1") {
      nativeCurrencyPrice
    }
  }
`

export const MAX_SUBMISSION_PRICE_PERCENT_INCREASE = BigNumber.from(400)
