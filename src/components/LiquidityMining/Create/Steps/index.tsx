import { ReactNode } from 'react'
import styled from 'styled-components'

import { TYPE } from '../../../../theme'
import { AutoColumn } from '../../../Column'

interface StepProps {
  disabled: boolean
  index: number
  title: string
  children: ReactNode
}

const Root = styled(AutoColumn)<{ disabled: boolean }>`
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  transition: opacity 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  z-index: auto;
  text-transform: capitalize;
`

export default function Step({ disabled, index, title, children, ...rest }: StepProps) {
  return (
    <Root gap="31px" disabled={disabled} {...rest}>
      <TYPE.SubHeader fontSize={18} lineHeight="22px" color="text2">
        {index + 1}. {title}
      </TYPE.SubHeader>
      {children}
    </Root>
  )
}
