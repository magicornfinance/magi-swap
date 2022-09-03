import { darken, lighten, transparentize } from 'polished'
import { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight } from 'react-feather'
import { Link } from 'react-router-dom'
import { Box, Flex, Text } from 'rebass'
import { ButtonProps, Button as RebassButton } from 'rebass/styled-components'
import styled, { useTheme } from 'styled-components'

import border8pxRadius from '../../assets/images/border-8px-radius.png'
import { ReactComponent as CarrotIcon } from '../../assets/svg/carrot.svg'
import { ExternalLink } from '../../theme'
import { gradients } from '../../utils/theme'
import { NumberBadge } from '../NumberBadge'

interface BaseProps {
  /**
   * Padding of the buttons default is 18px
   */
  children?: ReactNode
  padding?: string
  /**
   * Width and default is 100%
   */
  width?: string
  /**
   * Border radius and default is 12px
   */
  borderRadius?: string
  altDisabledStyle?: boolean
  disabled?: boolean
}

export const Base = styled(RebassButton)<BaseProps>`
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '12px')};
  outline: none;
  border: none;
  color: ${({ theme }) => theme.white};
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.purple5};
    color: ${({ theme }) => transparentize(0.28, theme.purpleBase)};
    cursor: not-allowed;
    box-shadow: none;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export const ButtonSecondary = styled(Base)`
  border: 2px solid ${({ theme }) => theme.text5};
  color: ${({ theme }) => theme.text5};
  background-color: transparent;
  font-size: 16px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonGrey = styled(Base)`
  border: 2px solid #2a2f42;
  background-color: ${props => props.theme.bg1And2};
  color: ${({ theme }) => theme.text5};
  font-size: 16px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:disabled {
    opacity: 50%;
  }
`

export const ButtonPurpleDim = styled(Base)`
  padding: 8px 24px;
  border: 2px solid ${({ theme }) => theme.purple5};

  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text4};

  background: ${gradients.purpleDim};
  backdrop-filter: blur(25px);
  background-blend-mode: overlay, normal;

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonInvisible = styled.button`
  border: none;
  outline: none;
  background: transparent;
`

export const ButtonDark = styled(Base)`
  border: 2px solid #252237;
  background-color: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.text5};
  font-size: 16px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonDark1 = styled(Base)`
  background-color: ${({ theme }) => theme.dark1};
  color: ${({ theme }) => theme.white};
  padding: 8.5px 26px;
  width: fit-content;
  transition: background-color 0.3s ease;
  border: 2px solid ${({ theme }) => theme.dark1};
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.dark2)};
  }
  &:active {
    background-color: ${({ theme }) => darken(0.1, theme.dark2)};
  }
`
export const ButtonPurple = styled(Base)`
  background: linear-gradient(90deg, #7345ff -24.77%, #ff428b 186.93%);
  color: ${({ theme }) => theme.white};
  padding: 8.5px 26px;
  width: fit-content;
  transition: background-color 0.3s ease;
  border: 2px solid ${({ theme }) => theme.dark1};
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.dark2)};
  }
  &:active {
    background-color: ${({ theme }) => darken(0.1, theme.dark2)};
  }
`
export const ButtonDark2 = styled(Base)`
  background-color: ${({ theme }) => theme.dark2};
  color: ${({ theme }) => theme.white};
  transition: background-color 0.3s ease;
  border: 2px solid ${({ theme }) => theme.bg3};
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.dark2)};
  }
  &:active {
    background-color: ${({ theme }) => darken(0.1, theme.dark2)};
  }
`

export const ButtonOutlined = styled(Base)`
  border: 8px solid;
  border-image: url(${border8pxRadius}) 8;
  background-color: ${({ theme }) => transparentize(0.28, theme.purpleBase)};
  color: ${({ theme }) => theme.text1};
  text-transform: initial;
  cursor: pointer;
  &:disabled {
    opacity: 50%;
    cursor: not-allowed;
  }
`

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: underline;
  }
  &:active {
    text-decoration: underline;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.green1)};
  color: ${({ theme }) => theme.green1};
  border: 2px solid ${({ theme }) => theme.green1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red1};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
  }
`
export interface ButtonConfirmedProps extends ButtonProps {
  confirmed?: boolean
  altDisabledStyle?: boolean
}
export function ButtonConfirmed({ confirmed, altDisabledStyle, children, ...rest }: ButtonConfirmedProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest}>{children}</ButtonConfirmedStyle>
  } else {
    return (
      <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle}>
        {children}
      </ButtonPrimary>
    )
  }
}
export interface ButtonErrorProps extends ButtonProps {
  /**
   * If true style changes to reflect error is present
   */
  error?: boolean
  /**
   * Content to be displayed in button
   */
  children: ReactNode
}
export function ButtonError({ error, children, ...rest }: ButtonErrorProps) {
  if (error) {
    return <ButtonErrorStyle {...rest}>{children}</ButtonErrorStyle>
  } else {
    return <ButtonPrimary {...rest}>{children}</ButtonPrimary>
  }
}
export interface ButtonLinkProps {
  /**
   * Link that opens up new page
   */
  link?: string
  /**
   * Content to be displayed in button
   */
  children?: ReactNode
  /**
   * Any additional style to be added to button wrapper
   */
  style?: CSSProperties
}

export function ButtonWithExternalLink({ link, children, style }: ButtonLinkProps) {
  return (
    <ButtonSecondary
      id="join-pool-button"
      as="a"
      style={{ padding: '10px 20px', borderRadius: '8px', ...style }}
      href={link}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Text fontWeight={700} fontSize={12} lineHeight="15px">
        {children} <span style={{ fontSize: '11px', marginLeft: '4px' }}>↗</span>
      </Text>
    </ButtonSecondary>
  )
}

export function ButtonExternalLink({
  link,
  children,
  disabled = false,
  style,
}: {
  link: string
  disabled?: boolean
  children: ReactNode
  style?: CSSProperties
}) {
  const theme = useTheme()
  return (
    <ButtonPurpleDim
      disabled={disabled}
      as={disabled ? ButtonPurpleDim : ExternalLink}
      href={!disabled ? link : ''}
      style={style}
    >
      {children}
      <Box ml={2}>
        <ArrowUpRight size="14px" color={theme.purple2} />
      </Box>
    </ButtonPurpleDim>
  )
}

export function ButtonBadge({
  to,
  children,
  number,
  color = 'orange',
  disabled = false,
}: {
  to: string
  number: number
  children: ReactNode
  disabled?: boolean
  color?: 'orange' | 'green' | 'red'
}) {
  return (
    <ButtonPurpleDim width="fit-content" as={disabled ? ButtonPurpleDim : Link} to={to} disabled={disabled}>
      <Flex alignItems="center">
        {children}
        <Box ml={1}>
          <NumberBadge badgeTheme={color}>{number}</NumberBadge>
        </Box>
      </Flex>
    </ButtonPurpleDim>
  )
}

const CarrotIconWithMargin = styled(CarrotIcon)`
  margin-right: 4px;
`

const CarrotButtonText = styled(Text)`
  white-space: nowrap;
  color: #fff;
`

const StyledButtonSecondary = styled(ButtonSecondary)`
  padding: 0px 6px;
  border-radius: 4px;
  background-color: #ffc800;
  width: auto;
  height: 22px;
  border: none;
`

export function CarrotButton({ link, children, style }: ButtonLinkProps) {
  return (
    <StyledButtonSecondary as="a" style={style} href={link} rel="noopener noreferrer" target="_blank">
      <CarrotIconWithMargin />
      <CarrotButtonText fontWeight={700} fontSize={10} lineHeight="9px" letterSpacing="4%">
        {children}
      </CarrotButtonText>
    </StyledButtonSecondary>
  )
}

export const AddSWPRToMetamaskButton = styled(Base)<{ active?: boolean }>`
  max-width: 190px;
  padding: 6px 8px;
  font-size: 10px;
  line-height: 10px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${props => (props.active ? props.theme.white : '#c0baf7')};
  background: ${props =>
    props.active ? `linear-gradient(90deg, ${props.theme.primary1} -24.77%, #fb52a1 186.93%)` : props.theme.bg8};
  border-radius: 8px;
  border: none;
  box-shadow: ${props => (props.active ? '0px 0px 42px rgba(165, 58, 196, 0.35)' : 'none')};
`

export const StyledButtonsArray = [
  Base,
  ButtonPrimary,
  ButtonSecondary,
  ButtonGrey,
  ButtonInvisible,
  ButtonDark1,
  ButtonPurple,
  ButtonDark2,
  ButtonOutlined,
  ButtonEmpty,
  AddSWPRToMetamaskButton,
]
