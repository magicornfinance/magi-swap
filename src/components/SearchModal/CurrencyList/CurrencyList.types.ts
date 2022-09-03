import { Currency, CurrencyAmount, Token } from '@swapr/sdk'

import { CSSProperties, MutableRefObject } from 'react'
import { FixedSizeList } from 'react-window'

import { TokenAddressMap } from '../../../state/lists/hooks'

export const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE

export function isBreakLine(x: string): x is BreakLine {
  return x === BREAK_LINE
}

export interface CurrencyListProps {
  currencies: Currency[]
  fixedListRef?: MutableRefObject<FixedSizeList>
  otherCurrency?: Currency[] | null
  setImportToken: (token: Token) => void
  showImportView: () => void
  otherListTokens: Token[]
  onCurrencySelect: (currency: Currency) => void
  selectedCurrency?: Currency | null
  selectedTokenList: TokenAddressMap
  hideBalance?: boolean
}

export interface CurrencyRowProps {
  style: CSSProperties
  balance: CurrencyAmount | undefined
  onSelect: () => void
  currency: Currency
  isSelected: boolean
  otherSelected: boolean
  selectedTokenList: TokenAddressMap
  hideBalance?: boolean
}
