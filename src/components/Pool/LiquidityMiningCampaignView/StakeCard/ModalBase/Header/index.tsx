import { Pair, PricedTokenAmount, Token, TokenAmount } from '@swapr/sdk'

import { useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import { tryParseAmount } from '../../../../../../state/swap/hooks'
import { TYPE } from '../../../../../../theme'
import { AutoColumn } from '../../../../../Column'
import Countdown from '../../../../../Countdown'
import { CurrencyInputPanel } from '../../../../../CurrencyInputPanel'

const AlertIcon = styled(AlertTriangle)`
  color: ${props => props.theme.red1};
`

interface ConfirmStakeModalHeaderProps {
  stakablePair?: Token | Pair
  maximumAmount?: TokenAmount | PricedTokenAmount
  timelocked?: boolean
  endingTimestamp?: number
  onAmountChange: (amount: TokenAmount) => void
}

export default function ConfirmStakingWithdrawingModalHeader({
  stakablePair,
  maximumAmount,
  timelocked,
  endingTimestamp,
  onAmountChange,
}: ConfirmStakeModalHeaderProps) {
  const [typedAmount, setTypedAmount] = useState('')

  return (
    <AutoColumn gap="md" style={{ marginTop: '20px' }}>
      {timelocked && endingTimestamp && (
        <Flex>
          <Box mr="4px">
            <AlertIcon size="18px" />
          </Box>
          <Box>
            <TYPE.Body fontWeight="500" lineHeight="19.5px" color="red1">
              Tokens will be locked for <Countdown to={endingTimestamp} />
            </TYPE.Body>
          </Box>
        </Flex>
      )}

      <CurrencyInputPanel
        value={typedAmount}
        onUserInput={input => {
          if (!stakablePair) return
          setTypedAmount(input)
          const parsedAmount = tryParseAmount(
            input,
            stakablePair instanceof Token ? stakablePair : stakablePair.liquidityToken
          ) as TokenAmount | undefined
          if (parsedAmount) {
            onAmountChange(parsedAmount)
          }
        }}
        onMax={() => {
          if (!maximumAmount) return
          setTypedAmount(maximumAmount.toExact())
          onAmountChange(new TokenAmount(maximumAmount.token, maximumAmount.raw))
        }}
        currency={stakablePair instanceof Token ? stakablePair : undefined}
        pair={stakablePair instanceof Pair ? stakablePair : undefined}
        id="staked-amount"
        disableCurrencySelect
        customBalanceText="Stakable: "
        balance={maximumAmount}
      />
    </AutoColumn>
  )
}
