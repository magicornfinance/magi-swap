import { CurrencyAmount, Percent, RoutablePlatform, Trade, TradeType, UniswapV2Trade } from '@swapr/sdk'

import { useCallback, useEffect, useState } from 'react'
import { ChevronsDown } from 'react-feather'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { Box, Flex } from 'rebass'
import styled, { useTheme } from 'styled-components'

import { ONE_BIPS, PRICE_IMPACT_MEDIUM, ROUTABLE_PLATFORM_LOGO } from '../../constants'
import useDebounce from '../../hooks/useDebounce'
import { useGasFeesUSD } from '../../hooks/useGasFeesUSD'
import { useIsMobileByMedia } from '../../hooks/useIsMobileByMedia'
import { useSwapsGasEstimations } from '../../hooks/useSwapsGasEstimate'
import { useSwapState } from '../../state/swap/hooks'
import { Field } from '../../state/swap/types'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  limitNumberOfDecimalPlaces,
  simpleWarningSeverity,
} from '../../utils/prices'
import { AutoColumn } from '../Column'
import { CurrencyLogo } from '../CurrencyLogo'
import {
  SelectionListDetails,
  SelectionListLabel,
  SelectionListLabelWrapper,
  SelectionListName,
  SelectionListOption,
  SelectionListReceiveAmount,
  SelectionListWindowWrapper,
} from '../SelectionList'
import WarningHelper from '../WarningHelper'
import { PlatformSelectorLoader } from './SwapPlatformSelectorLoader'
import SwapRoute from './SwapRoute'

export interface SwapPlatformSelectorProps {
  allPlatformTrades: (Trade | undefined)[] | undefined
  selectedTrade?: Trade
  onSelectedPlatformChange: (newPlatform: RoutablePlatform) => void
  isLoading: boolean
}

interface GasFeeProps {
  loading: boolean
  gasFeeUSD: CurrencyAmount | null
}

const StyledFlex = styled(Flex)`
  gap: 4px;
`

const StyledRouteFlex = styled(Flex)`
  align-items: center;
  background-color: rgba(25, 26, 36, 0.55);
  boarder: 2px solid ${({ theme }) => theme.purple6};
  border-radius: 12px;
  padding: 18px 16px;
  margin-bottom: 16px !important;
`

const MoreMarketsButton = styled(Flex)`
  cursor: pointer;
  text-transform: uppercase;
`

function GasFee({ loading, gasFeeUSD }: GasFeeProps) {
  if (loading) {
    return <Skeleton width="36px" height="12px" />
  }
  if (gasFeeUSD) {
    return (
      <TYPE.Main color="text4" fontSize="10px" lineHeight="12px">
        ${gasFeeUSD.toFixed(2)}
      </TYPE.Main>
    )
  }
  return <WarningHelper text="Could not estimate gas fee. Please make sure you've approved the traded token." />
}

const PriceImpact = ({ priceImpact }: { priceImpact?: Percent }) => {
  return (
    <TYPE.Main
      color={simpleWarningSeverity(priceImpact) >= PRICE_IMPACT_MEDIUM ? 'red1' : 'text4'}
      fontSize="10px"
      lineHeight="12px"
    >
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </TYPE.Main>
  )
}

export function SwapPlatformSelector({
  isLoading,
  allPlatformTrades,
  selectedTrade,
  onSelectedPlatformChange,
}: SwapPlatformSelectorProps) {
  const isMobileByMedia = useIsMobileByMedia()
  const { t } = useTranslation('swap')
  const theme = useTheme()

  const [showAllPlatformsTrades, setShowAllPlatformsTrades] = useState(false)
  const allowedSlippage = useUserSlippageTolerance()
  const { recipient, independentField } = useSwapState()
  const { loading: loadingTradesGasEstimates, estimations } = useSwapsGasEstimations(
    allowedSlippage,
    recipient,
    allPlatformTrades
  )
  const { loading: loadingGasFeesUSD, gasFeesUSD } = useGasFeesUSD(
    estimations.map(estimation => (estimation && estimation.length > 0 ? estimation[0] : null))
  )
  const loadingGasFees = loadingGasFeesUSD || loadingTradesGasEstimates
  const debouncedLoadingGasFees = useDebounce(loadingGasFees, 2000)

  useEffect(() => {
    setShowAllPlatformsTrades(false)
  }, [allPlatformTrades?.length])

  const showGasFees = estimations.length === allPlatformTrades?.length

  const handleSelectedTradeOverride = useCallback(
    (platformName: string) => {
      const newTrade = allPlatformTrades?.find(trade => trade?.platform.name === platformName)
      if (!newTrade) return
      onSelectedPlatformChange(newTrade.platform)
    },
    [allPlatformTrades, onSelectedPlatformChange]
  )

  const displayedPlatformTrade = showAllPlatformsTrades ? allPlatformTrades : allPlatformTrades?.slice(0, 3)

  return (
    <AutoColumn>
      {selectedTrade instanceof UniswapV2Trade && selectedTrade.route.path.length > 2 && (
        <StyledRouteFlex>
          {!isMobileByMedia && (
            <TYPE.Body fontSize="14px" lineHeight="15px" fontWeight="400" minWidth="auto" color={theme.purple2}>
              Route
            </TYPE.Body>
          )}
          <Box flex="1">
            <SwapRoute trade={selectedTrade} />
          </Box>
        </StyledRouteFlex>
      )}
      <SelectionListWindowWrapper>
        <SelectionListLabelWrapper>
          <SelectionListLabel justify={true} flex={showGasFees ? '30%' : '45%'}>
            {t('platfromSelector.exchange')}
          </SelectionListLabel>
          <SelectionListLabel>
            {isMobileByMedia ? t('platfromSelector.pImp') : t('platfromSelector.pImpact')}
          </SelectionListLabel>
          <SelectionListLabel>{t('platfromSelector.fee')}</SelectionListLabel>
          {showGasFees && <SelectionListLabel>{t('platfromSelector.gas')}</SelectionListLabel>}
          <SelectionListLabel flex="25%">
            {independentField === Field.OUTPUT ? t('platfromSelector.maxSent') : t('platfromSelector.minReceived')}
          </SelectionListLabel>
        </SelectionListLabelWrapper>
        {isLoading && allPlatformTrades?.length === 0 ? (
          <PlatformSelectorLoader showGasFeeColumn={showGasFees} />
        ) : (
          displayedPlatformTrade?.map((trade, i) => {
            if (!trade) return null // some platforms might not be compatible with the currently selected network
            const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
            const gasFeeUSD = gasFeesUSD[i]
            const { realizedLPFee, priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
            const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade)
            const tokenAmount = limitNumberOfDecimalPlaces(
              isExactIn ? slippageAdjustedAmounts[Field.OUTPUT] : slippageAdjustedAmounts[Field.INPUT]
            )

            return (
              <SelectionListOption
                role="button"
                key={trade.platform.name}
                isSelected={selectedTrade?.platform.name === trade.platform.name}
                onClick={() => handleSelectedTradeOverride(trade.platform.name)}
                data-testid={`${trade.platform.name.replace(/\s+/g, '-').toLowerCase()}-platform-selector`}
              >
                <SelectionListName
                  flex={showGasFees ? '30%' : '45%'}
                  isSelected={selectedTrade?.platform.name === trade.platform.name}
                >
                  <StyledFlex alignItems="center">
                    {ROUTABLE_PLATFORM_LOGO[trade.platform.name]}
                    {trade.platform.name}
                  </StyledFlex>
                </SelectionListName>
                <SelectionListDetails>
                  <PriceImpact priceImpact={priceImpactWithoutFee} />
                </SelectionListDetails>
                <SelectionListDetails>{realizedLPFee ? `${realizedLPFee.toFixed(2)}%` : '-'}</SelectionListDetails>
                {showGasFees && (
                  <SelectionListDetails>
                    <GasFee loading={debouncedLoadingGasFees} gasFeeUSD={gasFeeUSD} />
                  </SelectionListDetails>
                )}
                <SelectionListReceiveAmount flex="25%">
                  <TYPE.SubHeader color="white" fontSize="12px" fontWeight="600">
                    {tokenAmount === '0' ? '<0.0000001' : tokenAmount || '-'}
                  </TYPE.SubHeader>
                  <CurrencyLogo
                    currency={isExactIn ? trade.outputAmount.currency : trade.inputAmount.currency}
                    size="14px"
                    marginLeft={4}
                  />
                </SelectionListReceiveAmount>
              </SelectionListOption>
            )
          })
        )}
      </SelectionListWindowWrapper>
      {allPlatformTrades && allPlatformTrades.length > 3 && (
        <Flex justifyContent="center">
          {!showAllPlatformsTrades && (
            <MoreMarketsButton alignItems="center" onClick={() => setShowAllPlatformsTrades(true)}>
              <TYPE.Main fontWeight={600} color={'purple3'} fontSize="10px" mr="8px">
                {t('platfromSelector.showMore')}
              </TYPE.Main>
              <ChevronsDown size={15} color={theme.purple3} />
            </MoreMarketsButton>
          )}
        </Flex>
      )}
    </AutoColumn>
  )
}
