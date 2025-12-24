import { Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import { ExpensePie } from './Pie/ExpensePie'
import { IncomePie } from './Pie/IncomePie'

type Props = {
  periodLabel: string
  expensePieData: { name: string; value: number }[]
  expenseTotal: number
  incomePieData: { name: string; value: number }[]
  incomeTotal: number
}

export const hoverLift = {
  transition: 'transform 160ms ease, box-shadow 160ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 6,
  },
}

export function PiePanel({ periodLabel, expensePieData, expenseTotal, incomePieData, incomeTotal }: Props) {
  return (
    <Card variant="outlined" sx={hoverLift}>
      <CardHeader title={`円グラフ（${periodLabel}）`} />

      <CardContent>
        <Stack spacing={2}>
          <div>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              支出
            </Typography>
            <ExpensePie data={expensePieData} total={expenseTotal} />
          </div>

          <Divider />

          <div>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              収入
            </Typography>
            <IncomePie data={incomePieData} total={incomeTotal} />
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}
