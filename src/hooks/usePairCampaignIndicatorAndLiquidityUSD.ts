import { parseUnits } from '@ethersproject/units'
import { CurrencyAmount, Pair, USD } from '@swapr/sdk'

import Decimal from 'decimal.js-light'
import { useMemo } from 'react'

import { ZERO_USD } from '../constants'
import { useGetPairLiquidityMiningCampaingsQuery } from '../graphql/generated/schema'

export function usePairCampaignIndicatorAndLiquidityUSD(pair?: Pair | null): {
  loading: boolean
  liquidityUSD: CurrencyAmount
  numberOfCampaigns: number
} {
  const timestamp = useMemo(() => Math.floor(Date.now() / 1000), [])

  const { loading, data, error } = useGetPairLiquidityMiningCampaingsQuery({
    variables: { pairId: pair?.liquidityToken.address.toLowerCase() || '', endsAtLowerLimit: timestamp },
  })

  return useMemo(() => {
    if (loading) return { loading: true, liquidityUSD: ZERO_USD, numberOfCampaigns: 0 }
    if (!data || !data.pair || !data.pair.reserveUSD || error || !data.pair.liquidityMiningCampaigns)
      return { loading, liquidityUSD: ZERO_USD, numberOfCampaigns: 0 }
    return {
      loading,
      liquidityUSD: CurrencyAmount.usd(
        parseUnits(new Decimal(data.pair.reserveUSD).toFixed(USD.decimals), USD.decimals).toString()
      ),
      numberOfCampaigns: data.pair.liquidityMiningCampaigns.length,
    }
  }, [data, error, loading])
}
