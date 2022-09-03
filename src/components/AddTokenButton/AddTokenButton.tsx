import { SWPR } from '@swapr/sdk'

import { useCallback, useMemo } from 'react'

import swprLogo from '../../assets/images/swpr-logo.png'
import { useActiveWeb3React } from '../../hooks'
import { AddSWPRToMetamaskButton } from '../Button'

export const AddTokenButton = ({ active }: { active?: boolean }) => {
  const { chainId } = useActiveWeb3React()

  const swpr = useMemo(() => (chainId ? SWPR[chainId] : undefined), [chainId])

  const addTokenToMetamask = useCallback(() => {
    if (!window.ethereum || !window.ethereum.isMetaMask || !window.ethereum.request) return
    window.ethereum
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: swpr?.address,
            symbol: swpr?.symbol,
            decimals: swpr?.decimals,
            image: swprLogo,
          },
        },
      })
      .catch(console.error)
  }, [swpr])

  if (!window.ethereum || !window.ethereum.isMetaMask || !swpr) return null

  return (
    <AddSWPRToMetamaskButton onClick={addTokenToMetamask} active={active}>
      + Add SWPR to Metamask
    </AddSWPRToMetamaskButton>
  )
}
