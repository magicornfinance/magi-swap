import { ReactNode } from 'react'
import { Box, Flex } from 'rebass'

interface EmptyProps {
  children: ReactNode
}

export function Empty({ children }: EmptyProps) {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width="100%" height="100%">
      <Box>{children}</Box>
    </Flex>
  )
}
