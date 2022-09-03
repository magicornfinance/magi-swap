import { AbstractConnector } from '@web3-react/abstract-connector'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import { injected } from '../../connectors'
import { SUPPORTED_WALLETS } from '../../constants'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { Loader } from '../Loader'

const PendingSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  border: solid 1px ${({ theme }) => theme.text5};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  & > * {
    width: 100%;
  }
`

const StyledLoader = styled(Loader)`
  margin-right: 1rem;
  path {
    stroke: ${({ theme }) => theme.text5};
  }
`

const LoadingMessage = styled.div<{ error?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap};
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme, error }) => (error ? theme.red1 : theme.text1)};
`

const ErrorGroup = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  flex-direction: column;
  justify-content: center;
`

const LoadingWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: center;
  width: 100%;
`

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
}: {
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector) => void
}) {
  const isMetamask = window?.ethereum?.isMetaMask

  return (
    <PendingSection>
      {Object.keys(SUPPORTED_WALLETS).map(key => {
        const option = SUPPORTED_WALLETS[key]
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Flex key={key} mb="28px" justifyContent="center">
              <Box mr="10px">
                <img src={option.iconName} alt="logo" width="24px" height="24px" />
              </Box>
              <Box>
                <TYPE.Body color="white" fontWeight="500" fontSize="22px" lineHeight="27px">
                  {option.name}
                </TYPE.Body>
              </Box>
            </Flex>
          )
        }
        return null
      })}
      <LoadingMessage error={error}>
        <LoadingWrapper>
          {error ? (
            <ErrorGroup>
              <TYPE.Body
                color="red1"
                fontWeight="500"
                fontSize="20px"
                lineHeight="24px"
                letterSpacing="-0.01em"
                marginBottom="24px"
              >
                Error connecting.
              </TYPE.Body>
              <ButtonPrimary
                padding="8px 14px"
                onClick={() => {
                  setPendingError(false)
                  connector && tryActivation(connector)
                }}
              >
                Try Again
              </ButtonPrimary>
            </ErrorGroup>
          ) : (
            <>
              <StyledLoader />
              <TYPE.Body color="text4" fontWeight="500" fontSize="20px" lineHeight="24px" letterSpacing="-0.01em">
                Initializing...
              </TYPE.Body>
            </>
          )}
        </LoadingWrapper>
      </LoadingMessage>
    </PendingSection>
  )
}
