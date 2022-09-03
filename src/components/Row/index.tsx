import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

const Row = styled(Box)<{
  align?: string
  padding?: string
  border?: string
  borderRadius?: string
  flex?: string
  justify?: string
  gap?: string
}>`
  width: 100%;
  display: flex;
  padding: 0;
  flex: ${({ flex }) => (flex ? flex : '0 1 auto')};
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  justify-content: ${({ justify }) => justify && justify};
  gap: ${({ gap }) => gap && gap};
`

export const RowBetween = styled(Row)<{ gap?: number }>`
  justify-content: space-between;
  ${({ gap }) => gap && `gap: ${gap}px;`}
`

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};
  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`
export const AutoRowCleanGap = styled.div<{ gap: number }>`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${({ gap }) => `${gap}px`};
  margin: ${({ gap }) => -(gap / 2)}px;
`
export const RowFixed = styled(Row)<{ gap?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`

export default Row
