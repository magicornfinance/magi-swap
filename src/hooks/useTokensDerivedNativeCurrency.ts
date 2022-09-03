import { parseUnits } from '@ethersproject/units'
import { Price, PricedToken, PricedTokenAmount, TokenAmount } from '@swapr/sdk'

import Decimal from 'decimal.js-light'
import { useMemo } from 'react'

import { useGetDerivedNativeCurrencyTokensQuery } from '../graphql/generated/schema'
import { useKpiTokens } from './useKpiTokens'
import { useNativeCurrency } from './useNativeCurrency'

import { useActiveWeb3React } from './index'

export function useNativeCurrencyPricedTokenAmounts(tokenAmounts?: TokenAmount[] | null): {
  loading: boolean
  pricedTokenAmounts: PricedTokenAmount[]
} {
  const { chainId } = useActiveWeb3React()
  const nativeCurrency = useNativeCurrency()
  const tokenIds = useMemo(() => {
    return tokenAmounts ? tokenAmounts.map(tokenAmount => tokenAmount.token.address.toLowerCase()) : []
  }, [tokenAmounts])
  const { loading: loadingKpiTokens, kpiTokens } = useKpiTokens(tokenIds)
  const { loading, data, error } = useGetDerivedNativeCurrencyTokensQuery({ variables: { tokenIds } })

  return useMemo(() => {
    if (loading || loadingKpiTokens) return { loading: true, pricedTokenAmounts: [] }
    if (!tokenAmounts || tokenAmounts.length === 0 || !data || !chainId || error)
      return { loading: false, pricedTokenAmounts: [] }
    const pricedTokenAmounts = []
    for (const rewardTokenAmount of tokenAmounts) {
      const kpiToken = kpiTokens.find(kpiToken => kpiToken.equals(rewardTokenAmount.token))
      const priceData = data.tokens.find(
        token => token.address.toLowerCase() === rewardTokenAmount.token.address.toLowerCase()
      )
      if (priceData) {
        const price = new Price({
          baseCurrency: rewardTokenAmount.token,
          quoteCurrency: nativeCurrency,
          denominator: parseUnits('1', nativeCurrency.decimals).toString(),
          numerator: parseUnits(
            new Decimal(priceData.derivedNativeCurrency).toFixed(nativeCurrency.decimals),
            nativeCurrency.decimals
          ).toString(),
        })
        pricedTokenAmounts.push(
          new PricedTokenAmount(
            new PricedToken(
              chainId,
              rewardTokenAmount.token.address,
              rewardTokenAmount.token.decimals,
              price,
              rewardTokenAmount.token.symbol,
              rewardTokenAmount.token.name
            ),
            rewardTokenAmount.raw
          )
        )
      } else if (kpiToken) {
        // the reward token is a kpi token, we need to price it by looking at the collateral
        pricedTokenAmounts.push(new PricedTokenAmount(kpiToken, rewardTokenAmount.raw))
      }
    }
    return {
      loading: false,
      pricedTokenAmounts: pricedTokenAmounts,
    }
  }, [chainId, data, error, kpiTokens, loading, loadingKpiTokens, nativeCurrency, tokenAmounts])
}
