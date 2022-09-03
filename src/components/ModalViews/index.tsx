import { ArrowUpCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import Circle from '../../assets/images/blue-loader.svg'
import { useActiveWeb3React } from '../../hooks'
import { CloseIcon, CustomLightSpinner, TYPE } from '../../theme'
import { ExternalLink } from '../../theme/components'
import { getExplorerLink } from '../../utils'
import { AutoColumn, ColumnCenter } from '../Column'
import { RowBetween } from '../Row'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        <TYPE.SubHeader>Confirm this transaction in your wallet</TYPE.SubHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({
  children,
  onDismiss,
  hash,
}: {
  children: any
  onDismiss: () => void
  hash: string | undefined
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation('common')

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        {chainId && hash && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')} style={{ marginLeft: '4px' }}>
            <TYPE.SubHeader>{t('viewTransactionOnBlockExplorer')}</TYPE.SubHeader>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
