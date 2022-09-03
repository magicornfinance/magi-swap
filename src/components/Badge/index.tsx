import { MouseEvent } from 'react'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import { TYPE } from '../../theme'

const Root = styled(Flex)`
  height: 20px;
  text-transform: uppercase;
  background: rgba(96, 93, 130, 0.1);
  border-radius: 4px;
  padding: 0px 4px;
`

const IconBox = styled(Box)`
  cursor: pointer;
`

interface BadgeProps {
  icon?: any
  label: any
  onClick?: (event: MouseEvent) => void
}

export const Badge = ({ icon: FeatherIcon, label, onClick }: BadgeProps) => {
  return (
    <Root alignItems="center" onClick={onClick}>
      {label && (
        <Box>
          <TYPE.Body fontWeight="600" fontSize="8px">
            {label}
          </TYPE.Body>
        </Box>
      )}
      {FeatherIcon && (
        <Flex ml="4px" alignItems="center">
          <IconBox>
            <TYPE.Body>
              <FeatherIcon size="12px" />
            </TYPE.Body>
          </IconBox>
        </Flex>
      )}
    </Root>
  )
}
