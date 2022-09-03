import { SingleSidedLiquidityMiningCampaign } from '@swapr/sdk'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../../hooks'
import { useSWPRToken } from '../../../hooks/swpr/useSWPRToken'
import { AggregatedPairs } from '../../../hooks/useAllPairsWithLiquidityAndMaximumApyAndStakingIndicator'
import { useIsMobileByMedia } from '../../../hooks/useIsMobileByMedia'
import { useNativeCurrencyUSDPrice } from '../../../hooks/useNativeCurrencyUSDPrice'
import { usePage } from '../../../hooks/usePage'
import { useResponsiveItemsPerPage } from '../../../hooks/useResponsiveItemsPerPage'
import { getStakedAmountUSD } from '../../../utils/liquidityMining'
import { ButtonPrimary } from '../../Button'
import { Pagination } from '../../Pagination'
import { UndecoratedLink } from '../../UndercoratedLink'
import { DimBlurBgBox } from '../DimBlurBgBox/styleds'
import { PairsFilterType } from '../ListFilter'
import { LoadingList } from './LoadingList'
import { Pair as PairCard } from './Pair'

interface PairsListProps {
  aggregatedPairs: AggregatedPairs[]
  singleSidedStake?: SingleSidedLiquidityMiningCampaign
  hasActiveCampaigns?: boolean
  filter?: PairsFilterType
  loading?: boolean
  hasSingleSidedStake?: boolean
}

export function PairsList({ aggregatedPairs, loading, filter, singleSidedStake }: PairsListProps) {
  const { chainId } = useActiveWeb3React()
  const [page, setPage] = useState(1)
  const responsiveItemsPerPage = useResponsiveItemsPerPage()
  const itemsPage = usePage(aggregatedPairs, responsiveItemsPerPage, page, 0)
  const SWPRToken = useSWPRToken()
  const swprAddress = SWPRToken?.address ?? undefined
  const { loading: loadingNativeCurrencyUsdPrice, nativeCurrencyUSDPrice } = useNativeCurrencyUSDPrice()
  const { t } = useTranslation('pool')
  const isMobile = useIsMobileByMedia()

  useEffect(() => {
    // reset page when connected chain or selected filter changes
    setPage(1)
  }, [chainId, filter, aggregatedPairs])
  const isSWPRSingleSidedStake =
    swprAddress && singleSidedStake?.stakeToken.address.toLowerCase() === swprAddress.toLowerCase()

  return (
    <Flex flexDirection="column">
      <DimBlurBgBox>
        {loading ? (
          <LoadingList />
        ) : itemsPage.length > 0 || singleSidedStake ? (
          <ListLayout>
            {!isMobile && (
              <HeaderText>
                <Header justifyContent="space-between" paddingX="22px" paddingY="12px">
                  <Flex flex="25%">{t('pairsList.pair')}</Flex>
                  <Flex flex="25%">{t('campaigns')}</Flex>
                  <Flex flex="45%">
                    <Flex flex="30%">{t('TVL')}</Flex>
                    <Flex flex="30%">{t('24hVolume')}</Flex>
                    <Flex flex="10%">{t('APY')}</Flex>
                  </Flex>
                </Header>
              </HeaderText>
            )}
            {singleSidedStake && !loadingNativeCurrencyUsdPrice && page === 1 && (
              <StyledUndecoratedLink
                key={singleSidedStake.address}
                to={
                  isSWPRSingleSidedStake
                    ? '/rewards'
                    : `/pools/${singleSidedStake.stakeToken.address}/${singleSidedStake.address}/singleSidedStaking`
                }
              >
                <PairCard
                  token0={singleSidedStake.stakeToken}
                  pairOrStakeAddress={singleSidedStake.stakeToken.address}
                  usdLiquidity={getStakedAmountUSD(
                    singleSidedStake.staked.nativeCurrencyAmount,
                    nativeCurrencyUSDPrice
                  )}
                  apy={singleSidedStake.apy}
                  hasFarming={true}
                  isSingleSidedStakingCampaign={true}
                />
              </StyledUndecoratedLink>
            )}
            {itemsPage.length > 0 &&
              itemsPage.map(aggregatedPair => {
                return (
                  <StyledUndecoratedLink
                    key={aggregatedPair.pair.liquidityToken.address}
                    to={`/pools/${aggregatedPair.pair.token0.address}/${aggregatedPair.pair.token1.address}`}
                  >
                    <PairCard
                      token0={aggregatedPair.pair.token0}
                      token1={aggregatedPair.pair.token1}
                      pairOrStakeAddress={aggregatedPair.pair.liquidityToken.address}
                      usdLiquidity={aggregatedPair.liquidityUSD}
                      apy={aggregatedPair.maximumApy}
                      containsKpiToken={aggregatedPair.containsKpiToken}
                      hasFarming={aggregatedPair.hasFarming}
                    />
                  </StyledUndecoratedLink>
                )
              })}
          </ListLayout>
        ) : (
          <Flex alignItems="center" justifyContent="center" flexDirection={'column'} my="50px">
            <Text fontSize="16px" color="#BCB3F0" mb="24px">
              {t('pairsList.noPoolsFound')}
            </Text>
            <div>
              <ButtonPrimary to="/pools/create" as={Link}>
                {t('pairsList.createAPool')}
              </ButtonPrimary>
            </div>
          </Flex>
        )}
      </DimBlurBgBox>
      {aggregatedPairs.length > responsiveItemsPerPage && (
        <PaginationRow>
          <Box>
            <Pagination
              page={page}
              totalItems={aggregatedPairs.length + 1}
              itemsPerPage={responsiveItemsPerPage}
              onPageChange={setPage}
            />
          </Box>
        </PaginationRow>
      )}
    </Flex>
  )
}

export const ListLayout = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-gap: 0;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 10px 16px;
  `};
`

export const HeaderText = styled(Text)`
  font-weight: 600;
  font-size: 10px;
  color: ${({ theme }) => theme.purple3};
  text-transform: uppercase;
`

export const Header = styled(Flex)`
  border-bottom: 2px solid ${({ theme }) => theme.bg3};
`

const PaginationRow = styled(Flex)`
  width: 100%;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-content: center;
  `};

  & ul {
    margin: 22px 0;
  }
`

const StyledUndecoratedLink = styled(UndecoratedLink)`
  :not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.bg3};
  }
`
