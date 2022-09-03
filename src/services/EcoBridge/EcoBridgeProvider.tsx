import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import { useActiveWeb3React } from '../../hooks'
import store from '../../state'
import { EcoBridge } from './EcoBridge'
import { ecoBridgeConfig } from './EcoBridge.config'

export const EcoBridgeContext = createContext<EcoBridge | null>(null)

export function EcoBridgeProvider({ children }: { children: ReactNode }) {
  const { library, account, chainId } = useActiveWeb3React()
  const [ecoBridge, setEcoBridge] = useState<EcoBridge | null>(null)

  useEffect(() => {
    const initEcoBridge = async () => {
      if (!ecoBridge) {
        const ecoBridgeInstance = new EcoBridge(store, ecoBridgeConfig)
        setEcoBridge(ecoBridgeInstance)
      }

      if (ecoBridge && account && library && chainId) {
        if (!ecoBridge.ready) {
          await ecoBridge.init({
            account,
            activeChainId: chainId,
            activeProvider: library,
          })
        } else {
          await ecoBridge.updateSigner({
            account,
            activeChainId: chainId,
            activeProvider: library,
          })
        }
      }
    }
    initEcoBridge()
  }, [account, chainId, library, ecoBridge])

  return <EcoBridgeContext.Provider value={ecoBridge}>{children}</EcoBridgeContext.Provider>
}

export const useEcoBridge = () => {
  const ecoBridge = useContext(EcoBridgeContext)
  if (!ecoBridge) {
    throw new Error('This hook must be used in context of EcoBridge provider')
  }

  return ecoBridge
}
