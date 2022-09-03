import { ChainId, SWPR } from '@swapr/sdk'

import { useEffect, useMemo, useState } from 'react'
import { ChevronUp } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import { ReactComponent as GasInfoSvg } from '../../assets/svg/gas-info.svg'
import { useActiveWeb3React, useUnsupportedChainIdError } from '../../hooks'
import { useSwaprSinglelSidedStakeCampaigns } from '../../hooks/singleSidedStakeCampaigns/useSwaprSingleSidedStakeCampaigns'
import { useGasInfo } from '../../hooks/useGasInfo'
import { useLiquidityMiningCampaignPosition } from '../../hooks/useLiquidityMiningCampaignPosition'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleShowClaimPopup, useToggleShowExpeditionsPopup } from '../../state/application/hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { breakpoints } from '../../utils/theme'
import ClaimModal from '../claim/ClaimModal'
import ExpeditionsModal from '../expeditions/ExpeditionsModal'
import { UnsupportedNetworkPopover } from '../NetworkUnsupportedPopover'
import Row, { RowFixed, RowFlat } from '../Row'
import { Settings } from '../Settings'
import { SwaprVersionLogo } from '../SwaprVersionLogo'
import Web3Status from '../Web3Status'
import { Balances } from './Balances'
import { HeaderButton } from './HeaderButton'
import { HeaderLink, HeaderMobileLink } from './HeaderLink'
import { HeaderLinkBadge } from './HeaderLinkBadge'
import MobileOptions from './MobileOptions'
import { Amount } from './styled'

const HeaderFrame = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    width: calc(100%);
    position: relative;
  `};
  height: 100px;
`

const HeaderControls = styled.div<{ isConnected: boolean }>`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: fixed;
    bottom: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: 'space-between';
    width: 100%;
    height: 72px;
    padding: 1rem;
    z-index: 99;
    background-color: ${({ theme }) => theme.bg2};
    transition: 0.35s ease-in-out all;
    &.hidden {
      bottom: -72px;
      opacity: 0;
    }
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
  `};
`

const MoreLinksIcon = styled(HeaderElement)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: flex;
    width:100%;
    justify-content: flex-start;

  `};
`

const HeaderRow = styled(RowFixed)<{ isDark: boolean }>`
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
  `};
`

const HeaderSubRow = styled(RowFlat)`
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
     margin-top: 0px;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: start;
  gap: 40px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const Title = styled(Link)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  margin-left: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0px;
  `};
  :hover {
    cursor: pointer;
  }
`

const GasInfo = styled.div<{ hide: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  margin-left: 6px;
  padding: 6px 8px;
  border: 2px solid rgba(242, 153, 74, 0.65);
  background: rgba(242, 153, 74, 0.08);
  border-radius: 8px;

  div {
    color: ${({ theme }) => theme.orange1};
  }

  align-items: center;
`
const GasColor = {
  fast: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  normal: {
    color: '#F2994A',
    backgroundColor: 'rgba(242, 153, 74, 0.3);',
  },
  slow: {
    color: '#FF4F84',
    backgroundColor: 'rgba(255, 79, 132, 0.3);',
  },
}
const ColoredGas = styled.div<{ color: 'fast' | 'slow' | 'normal' }>`
  display: flex;
  font-size: 10px;
  height: 16.39px;
  font-weight: 600;
  color: ${props => GasColor[props.color].color};
  background-color: ${props => GasColor[props.color].backgroundColor};
  padding: 3px 4px;
  line-height: 11px;

  border-radius: 4.26px;
`
const Divider = styled.div`
  height: 24px;
  width: 1px;
  background-color: ${({ theme }) => theme.purple3};
  margin-left: 40px;
  @media (max-width: 1080px) and (min-width: 960px) {
    width: 0;
    margin-left: 0px;
  }
`

const AdditionalDataWrap = styled.div`
  margin-left: auto;
  gap: 10px;
  display: flex;
  flex-direction: column;
  justify-content: end;

  @media screen and (max-width: ${breakpoints.s}) {
    gap: 15px;
  }
`
const StyledChevron = styled(ChevronUp)<{ open: boolean }>`
  stroke: ${({ theme }) => theme.orange1};
  transform: ${({ open }) => (open ? 'rotate(0deg)' : 'rotate(180deg)')};
`

function Header() {
  const { account, chainId } = useActiveWeb3React()

  const { t } = useTranslation('common')
  const [isGasInfoOpen, setIsGasInfoOpen] = useState(false)
  const { gas } = useGasInfo()
  const [isDark] = useDarkModeManager()
  const { loading, data } = useSwaprSinglelSidedStakeCampaigns()
  const { stakedTokenAmount } = useLiquidityMiningCampaignPosition(data, account ? account : undefined)

  const toggleClaimPopup = useToggleShowClaimPopup()
  const toggleExpeditionsPopup = useToggleShowExpeditionsPopup()
  const accountOrUndefined = useMemo(() => account || undefined, [account])
  const newSwpr = useMemo(() => (chainId ? SWPR[chainId] : undefined), [chainId])
  const newSwprBalance = useTokenBalance(accountOrUndefined, newSwpr)
  const isUnsupportedNetworkModal = useModalOpen(ApplicationModal.UNSUPPORTED_NETWORK)
  const isUnsupportedChainIdError = useUnsupportedChainIdError()

  const networkWithoutSWPR = !newSwpr

  const onScrollHander = () => {
    const headerControls = document.getElementById('header-controls')
    if (headerControls) {
      if (window.scrollY > 0) {
        headerControls.classList.add('hidden')
      } else {
        headerControls.classList.remove('hidden')
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScrollHander)

    return () => {
      window.removeEventListener('scroll', onScrollHander)
    }
  }, [])

  return (
    <HeaderFrame>
      <ClaimModal
        onDismiss={toggleClaimPopup}
        newSwprBalance={newSwprBalance}
        stakedAmount={stakedTokenAmount?.toFixed(3)}
        singleSidedCampaignLink={
          data && !loading ? `/rewards/single-sided-campaign/${data.stakeToken.address}/${data.address}` : undefined
        }
      />
      <ExpeditionsModal onDismiss={toggleExpeditionsPopup} />
      <HeaderRow isDark={isDark}>
        <Title to="/swap">
          <SwaprVersionLogo />
        </Title>
        <HeaderLinks>
          <Divider />
          <HeaderLink data-testid="swap-nav-link" id="swap-nav-link" to="/swap">
            {t('swap')}
          </HeaderLink>
          <HeaderLink
            data-testid="pool-nav-link"
            id="pool-nav-link"
            to="/pools"
            disabled={
              networkWithoutSWPR && chainId !== ChainId.ARBITRUM_GOERLI
            } /* // FIXME: fix this once SWPR is on Arb Goerli */
          >
            {t('liquidity')}
            {networkWithoutSWPR && <HeaderLinkBadge label="NOT&nbsp;AVAILABLE" />}
          </HeaderLink>
          <HeaderLink data-testid="rewards-nav-link" id="rewards-nav-link" to="/rewards" disabled={networkWithoutSWPR}>
            {t('rewards')}
            {networkWithoutSWPR && <HeaderLinkBadge label="NOT&nbsp;AVAILABLE" />}
          </HeaderLink>
          <HeaderLink data-testid="bridge-nav-link" id="bridge-nav-link" to="/bridge">
            <>
              {t('bridge')}
              <HeaderLinkBadge label="BETA" />
            </>
          </HeaderLink>
          <HeaderLink id="vote-nav-link" href={`https://snapshot.org/#/swpr.eth`}>
            {t('vote')}
          </HeaderLink>
          <HeaderLink id="charts-nav-link" href={`https://dxstats.eth.limo/#/?chainId=${chainId}`}>
            <>
              {t('charts')}
              <Text ml="4px" fontSize="11px">
                ↗
              </Text>
            </>
          </HeaderLink>
        </HeaderLinks>
      </HeaderRow>
      <AdditionalDataWrap>
        <HeaderSubRow>
          <Web3Status />
          <Settings />
        </HeaderSubRow>

        <Flex maxHeight={'22px'} justifyContent={'end'}>
          {account && (
            <>
              <HeaderButton onClick={toggleExpeditionsPopup} style={{ marginRight: '7px' }}>
                &#10024;&nbsp;Expeditions
              </HeaderButton>
              <Balances />
            </>
          )}
          <UnsupportedNetworkPopover show={isUnsupportedNetworkModal}>
            {isUnsupportedChainIdError && (
              <Amount data-testid="unsupported-network-warning" zero>
                {'UNSUPPORTED NETWORK'}
              </Amount>
            )}
          </UnsupportedNetworkPopover>
          {gas.normal !== 0.0 && (
            <GasInfo onClick={() => setIsGasInfoOpen(!isGasInfoOpen)} hide={!account || isUnsupportedChainIdError}>
              <GasInfoSvg />
              <Text marginLeft={'4px'} marginRight={'2px'} fontSize={10} fontWeight={600} lineHeight={'9px'}>
                {gas.normal}
              </Text>
              {gas.fast === 0 && gas.slow === 0 ? '' : <StyledChevron open={isGasInfoOpen} size={12} />}
            </GasInfo>
          )}
        </Flex>
        {gas.fast !== 0 && gas.slow !== 0 && (
          <HeaderSubRow
            style={{
              visibility: isGasInfoOpen ? 'visible' : 'hidden',
              gap: '4px',
            }}
          >
            <ColoredGas color={'fast'}>FAST {gas.fast}</ColoredGas>
            <ColoredGas color={'normal'}>NORMAL {gas.normal}</ColoredGas>
            <ColoredGas color={'slow'}>SLOW {gas.slow}</ColoredGas>
          </HeaderSubRow>
        )}
      </AdditionalDataWrap>
      <HeaderControls isConnected={!!account}>
        <Flex style={{ gap: '26px' }} minWidth={'unset'}>
          <HeaderMobileLink id="swap-nav-link" to="/swap">
            {t('swap')}
          </HeaderMobileLink>
          {!networkWithoutSWPR && (
            <HeaderMobileLink id="pool-nav-link" to="/pools">
              {t('liquidity')}
            </HeaderMobileLink>
          )}
          {!networkWithoutSWPR && (
            <HeaderMobileLink id="rewards-nav-link" to="/rewards">
              {t('rewards')}
            </HeaderMobileLink>
          )}
          <HeaderMobileLink id="bridge-nav-link" to="/bridge">
            {t('bridge')}
          </HeaderMobileLink>
          <HeaderMobileLink id="vote-nav-link" href={`https://snapshot.org/#/swpr.eth`}>
            {t('vote')}
          </HeaderMobileLink>
          <HeaderMobileLink id="stake-nav-link" href={`https://dxstats.eth.limo/#/?chainId=${chainId}`}>
            <>
              {t('charts')}
              <Text ml="4px" fontSize="11px">
                ↗
              </Text>
            </>
          </HeaderMobileLink>
        </Flex>

        <MoreLinksIcon>
          <MobileOptions />
        </MoreLinksIcon>
      </HeaderControls>
    </HeaderFrame>
  )
}

export default Header
