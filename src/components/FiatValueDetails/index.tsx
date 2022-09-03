import { CurrencyAmount, JSBI, Percent } from '@swapr/sdk'

import styled from 'styled-components'

import { PRICE_IMPACT_HIGH } from '../../constants'
import { TYPE } from '../../theme'
import { simpleWarningSeverity } from '../../utils/prices'

interface FiatValueDetailsProps {
  fiatValue?: CurrencyAmount | null
  priceImpact?: Percent
  isFallback?: boolean
}

const StyledPriceImpact = styled.span<{ warning?: boolean }>`
  color: ${({ theme, warning }) => (warning ? theme.red1 : theme.text5)};
  margin-left: 8px;
`

export function FiatValueDetails({ fiatValue, priceImpact, isFallback }: FiatValueDetailsProps) {
  if (fiatValue) {
    const fiatPriceImpactSeverity = simpleWarningSeverity(priceImpact)

    return (
      <TYPE.Body fontWeight="600" fontSize="11px" lineHeight="13px" letterSpacing="0.08em">
        {isFallback && '~'}${fiatValue.toFixed(2, { groupSeparator: ',' })}
        {priceImpact && (
          <StyledPriceImpact warning={fiatPriceImpactSeverity === PRICE_IMPACT_HIGH}>
            {priceImpact.multiply(JSBI.BigInt(-100)).toSignificant(3)}%
          </StyledPriceImpact>
        )}
      </TYPE.Body>
    )
  }

  return null
}
