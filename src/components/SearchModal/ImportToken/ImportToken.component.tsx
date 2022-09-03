import { Token } from '@swapr/sdk'

import { useContext } from 'react'
import { Text } from 'rebass'

import { WrappedTokenInfo } from '../../../state/lists/wrapped-token-info'
import { useAddUserToken } from '../../../state/user/hooks'
import { CloseIcon, TYPE } from '../../../theme'
import { AutoColumn } from '../../Column'
import { RowBetween } from '../../Row'
import { TokenWarningCard } from '../../TokenWarningModal'
import { CurrencySearchModalContext } from '../CurrencySearchModal/CurrencySearchModal.context'
import { GoBackIcon } from '../GoBackIcon'
import { PaddedColumn } from '../shared'
import { BottomSectionContainer, SpacedButtonError, Wrapper } from './ImportToken.styles'
import { ImportTokenProps } from './ImportToken.types'

export const ImportToken = ({ onBack, onDismiss, onCurrencySelect }: ImportTokenProps) => {
  const addToken = useAddUserToken()
  const { importToken } = useContext(CurrencySearchModalContext)
  const list = importToken instanceof WrappedTokenInfo ? importToken.list : undefined
  const tokens = [importToken] as Token[]

  return (
    <Wrapper data-testid="unknown-token-warning">
      <PaddedColumn gap="14px" style={{ width: '100%', flex: '1 1' }}>
        <RowBetween>
          <GoBackIcon onClick={onBack} />
          <Text fontWeight={500} fontSize={16}>
            Import unknown {tokens.length > 1 ? 'tokens' : 'token'}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>
      <AutoColumn>
        <AutoColumn gap="16px" style={{ padding: '20px', paddingTop: '12px' }}>
          <TYPE.Body fontSize="14px" fontWeight="400" lineHeight="22px" letterSpacing="-0.02em" color="text4">
            Anyone can create an ERC20 token on Ethereum with <em>any</em> name, including creating fake versions of
            existing tokens and tokens that claim to represent projects that do not have a token.
          </TYPE.Body>
          <TYPE.Body fontSize="14px" fontWeight="400" lineHeight="22px" letterSpacing="-0.02em" color="text4">
            This interface can load arbitrary tokens by token addresses. Please take extra caution and do your research
            when interacting with arbitrary ERC20 tokens.
          </TYPE.Body>
          <TYPE.Body fontSize="14px" fontWeight="400" lineHeight="22px" letterSpacing="-0.02em" color="text4">
            If you purchase an arbitrary token, <strong>you may be unable to sell it back.</strong>
          </TYPE.Body>
        </AutoColumn>
        <BottomSectionContainer>
          <AutoColumn gap="2px">
            {tokens.map(token => {
              return <TokenWarningCard key={token.address} token={token} list={list} />
            })}
            <SpacedButtonError
              data-testid="confirm-import-button"
              error
              onClick={() => {
                tokens.map(token => addToken(token))
                onCurrencySelect && onCurrencySelect(tokens[0])
              }}
            >
              Import
            </SpacedButtonError>
          </AutoColumn>
        </BottomSectionContainer>
      </AutoColumn>
    </Wrapper>
  )
}
