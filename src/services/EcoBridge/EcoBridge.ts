import { ChainId } from '@swapr/sdk'

import { Store } from '@reduxjs/toolkit'

import { AppState } from '../../state'
import { initiateEcoBridgeProviders } from './EcoBridge.providers'
import {
  BridgeList,
  Bridges,
  EcoBridgeChangeHandler,
  EcoBridgeConstructorParams,
  EcoBridgeProviders,
} from './EcoBridge.types'
import { EcoBridgeChildBase } from './EcoBridge.utils'
import { selectBridgeCollectableTx, selectSupportedBridges } from './store/EcoBridge.selectors'
export class EcoBridge {
  public readonly staticProviders: EcoBridgeProviders
  public readonly store: EcoBridgeConstructorParams['store']
  public readonly bridges: Bridges
  private _initialized = false
  private _asyncInit: { promise: Promise<void>; resolve: () => void }
  private _account: string | undefined
  private _activeChainId: ChainId | undefined // Assumed that activeChainId === activeProvider.getChain(), so if activeChain changes then signer changes

  private get _activeBridgeId() {
    return this.store.getState().ecoBridge.common.activeBridge
  }

  private _callForEachBridge = async (method: (bridgeKey: BridgeList) => Promise<any>, errorText: string) => {
    const promises = (Object.keys(this.bridges) as BridgeList[]).map(bridgeKey => {
      return new Promise<BridgeList>(async (res, rej) => {
        try {
          await method(bridgeKey)
          res(bridgeKey)
        } catch (e) {
          rej(bridgeKey)
        }
      })
    })

    const callStatuses = await Promise.allSettled(promises)

    callStatuses.forEach(res => {
      if (res.status === 'rejected') {
        console.warn(`EcoBridge: ${errorText} ${res.reason}`)
      }
    })
  }

  public get ready() {
    return this._initialized
  }

  constructor(store: Store<AppState>, config: EcoBridgeChildBase[]) {
    const bridges = config.reduce((total, bridge) => {
      total[bridge.bridgeId] = bridge
      return total
    }, {} as { [k in BridgeList]: EcoBridgeChildBase })

    this.store = store
    this.bridges = bridges

    this.staticProviders = initiateEcoBridgeProviders()

    let resolve = () => undefined as void

    const promise = new Promise<void>(res => {
      resolve = res
    })

    this._asyncInit = {
      promise,
      resolve,
    }
  }

  public updateSigner = async (signerData: Omit<EcoBridgeChangeHandler, 'previousChainId'>) => {
    const previousChainId = this._activeChainId
    this._activeChainId = signerData.activeChainId
    this._account = signerData.account

    const signerChangeCall = (bridgeKey: BridgeList) =>
      this.bridges[bridgeKey].onSignerChange({ previousChainId, ...signerData })

    await this._callForEachBridge(signerChangeCall, 'onSignerChange() failed for')
  }

  public fetchDynamicLists = async () => {
    await this._asyncInit.promise

    const fetchDynamicListsCall = (bridgeKey: BridgeList) => this.bridges[bridgeKey].fetchDynamicLists()

    await this._callForEachBridge(fetchDynamicListsCall, 'fetchDynamicList() failed for')
  }

  public init = async ({ account, activeProvider, activeChainId }: EcoBridgeChangeHandler) => {
    if (this._initialized) return

    this._activeChainId = activeChainId
    this._account = account

    const initCall = (bridgeKey: BridgeList) =>
      this.bridges[bridgeKey].init({
        account,
        activeChainId,
        activeProvider,
        staticProviders: this.staticProviders,
        store: this.store,
      })
    await this._callForEachBridge(initCall, 'init() failed for')

    const staticListsCall = (bridgeKey: BridgeList) => this.bridges[bridgeKey].fetchStaticLists()
    await this._callForEachBridge(staticListsCall, 'fetchStaticLists() failed for')

    this._initialized = true
    this._asyncInit.resolve()
  }

  public getSupportedBridges = () => {
    const supportedBridges = selectSupportedBridges(this.store.getState())

    supportedBridges.forEach(bridge => {
      this.bridges[bridge.bridgeId].getBridgingMetadata()
    })
  }

  // ADAPTERS
  public triggerBridging = async () => {
    if (!this._initialized || !this._activeBridgeId) return
    return this.bridges[this._activeBridgeId].triggerBridging()
  }

  public approve = async () => {
    if (!this._initialized || !this._activeBridgeId) return
    return this.bridges[this._activeBridgeId].approve()
  }

  public collect = async () => {
    if (!this._account) return
    const l2Tx = selectBridgeCollectableTx(this.store.getState(), this._account)
    if (!this._initialized || !l2Tx) return
    return this.bridges[l2Tx.bridgeId].collect(l2Tx)
  }

  public validate = async () => {
    if (!this._initialized || !this._activeBridgeId) return
    return this.bridges[this._activeBridgeId].validate()
  }
}
