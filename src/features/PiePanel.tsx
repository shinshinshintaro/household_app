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

export function PiePanel({
  periodLabel,
  expensePieData,
  expenseTotal,
  incomePieData,
  incomeTotal,
}: Props) {
  return (
    <Card variant="outlined">
      <CardHeader title={`円グラフ（${periodLabel}）`} />
      <CardContent>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <div>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              支出
            </Typography>
            <ExpensePie data={expensePieData} total={expenseTotal} />
          </div>

          <div>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              収入
            </Typography>
            <IncomePie data={incomePieData} total={incomeTotal} />
          </div>
        </Stack>
      </CardContent>
    </Card>
  )
}
