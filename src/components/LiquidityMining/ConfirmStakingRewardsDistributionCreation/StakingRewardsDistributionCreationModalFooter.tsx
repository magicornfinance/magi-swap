import { Pair, Token, TokenAmount } from '@swapr/sdk'

import { DateTime } from 'luxon'
import { Text } from 'rebass'

import { TYPE } from '../../../theme'
import { ButtonError } from '../../Button'
import { AutoColumn } from '../../Column'
import QuestionHelper from '../../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../../Row'

interface StakingRewardsDistributionCreationModalFooterProps {
  stakeToken?: Token
  stakePair?: Pair
  startTime: Date | null
  endTime: Date | null
  rewards: TokenAmount[] | null
  timelocked: boolean
  stakingCap: TokenAmount | null
  unlimitedPool: boolean
  onConfirm: () => void
}

export default function StakingRewardsDistributionCreationModalFooter({
  stakePair,
  stakeToken,
  startTime,
  endTime,
  rewards,
  timelocked,
  stakingCap,
  unlimitedPool,
  onConfirm,
}: StakingRewardsDistributionCreationModalFooterProps) {
  const tokenOrPair = stakePair
    ? `${stakePair.token0.symbol}/${stakePair.token1.symbol}`
    : stakeToken
    ? stakeToken.symbol
    : '-'
  return (
    <AutoColumn gap="0px">
      <RowBetween align="center" mb="6px">
        <TYPE.Body fontWeight={400} fontSize="13px" color="text5">
          Pool {stakePair ? 'Pair' : 'Token'}
        </TYPE.Body>
        <TYPE.Body
          fontWeight={500}
          fontSize="12px"
          color="text5"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            textAlign: 'right',
            paddingLeft: '10px',
          }}
        >
          {tokenOrPair}
        </TYPE.Body>
      </RowBetween>

      <RowBetween align="center" mb="6px">
        <TYPE.Body fontWeight={400} fontSize="13px" color="text5">
          Total reward
        </TYPE.Body>
        <TYPE.Body
          fontWeight={500}
          fontSize="12px"
          color="text5"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            textAlign: 'right',
            paddingLeft: '10px',
          }}
        >
          {rewards ? rewards.map(reward => `${reward.toExact()} ${reward.token.symbol}`).join(', ') : '-'}
        </TYPE.Body>
      </RowBetween>

      <RowBetween align="center" mb="6px">
        <TYPE.Body fontWeight={400} fontSize="13px" color="text5">
          Max pool size
        </TYPE.Body>
        <TYPE.Body
          fontWeight={500}
          fontSize="12px"
          color="text5"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            textAlign: 'right',
            paddingLeft: '10px',
          }}
        >
          {unlimitedPool ? 'Unlimited' : `${stakingCap?.toSignificant(4)} ${tokenOrPair} LP`}
        </TYPE.Body>
      </RowBetween>

      <RowBetween mb="6px">
        <RowFixed>
          <TYPE.Body fontWeight={400} fontSize="13px" color="text5">
            Starts
          </TYPE.Body>
        </RowFixed>
        <RowFixed>
          <TYPE.Body fontWeight={500} fontSize="12px" color="text5">
            {startTime ? DateTime.fromJSDate(startTime).toFormat('dd-MM-yyyy HH:mm') : '-'}
          </TYPE.Body>
        </RowFixed>
      </RowBetween>

      <RowBetween mb="6px">
        <RowFixed>
          <TYPE.Body fontWeight={400} fontSize="13px" color="text5">
            Ends
          </TYPE.Body>
          <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
        </RowFixed>
        <RowFixed>
          <TYPE.Body fontWeight={500} fontSize="12px" color="text5">
            {endTime ? DateTime.fromJSDate(endTime).toFormat('dd-MM-yyyy HH:mm') : '-'}
          </TYPE.Body>
        </RowFixed>
      </RowBetween>

      <RowBetween mb="6px">
        <RowFixed>
          <TYPE.Body fontWeight={400} fontSize="13px" color="text5">
            Timelock
          </TYPE.Body>
          <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
        </RowFixed>
        <RowFixed>
          <TYPE.Body fontWeight={500} fontSize="12px" color="text5">
            {timelocked ? 'Yes' : 'No'}
          </TYPE.Body>
        </RowFixed>
      </RowBetween>

      <AutoRow>
        <ButtonError onClick={onConfirm} style={{ margin: '10px 0 0 0' }} data-testid="modal-confirm-button">
          <Text fontSize={13} fontWeight={600}>
            Confirm
          </Text>
        </ButtonError>
      </AutoRow>
    </AutoColumn>
  )
}
