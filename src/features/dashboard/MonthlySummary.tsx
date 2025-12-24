import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import type { MonthlyBalancePoint } from '../../selectors/accountSelectors'
import { formatMonthJP } from '../../selectors/accountSelectors'

type Props = {
  titleMonthKey: string
  monthly: MonthlyBalancePoint[]
  income: number
  expense: number
  balance: number
}

const yen = (n: number) => `¥${n.toLocaleString()}`
export const hoverLift = {
  transition: 'transform 160ms ease, box-shadow 160ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 6,
  },
}

export const MonthlySummaryCard = ({
  titleMonthKey,
  monthly,
  income,
  expense,
  balance,
}: Props) => {
  const chartData = useMemo(
    () =>
      monthly.map(m => ({
        month: formatMonthJP(m.monthKey),
        balance: m.balance,
      })),
    [monthly],
  )

  return (
    <Card variant="outlined" sx={hoverLift}>
      <CardHeader title="月次サマリ" />

      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {formatMonthJP(titleMonthKey)}の収支
            </Typography>

            <Stack spacing={1} sx={{ mt: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">収入</Typography>
                <Typography variant="body1">{yen(income)}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">支出</Typography>
                <Typography variant="body1">{yen(expense)}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">収支</Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700 }}
                  color={balance >= 0 ? 'success.main' : 'error.main'}
                >
                  {yen(balance)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v: number) => yen(Number(v))} />
                <Tooltip formatter={(v: unknown) => yen(Number(v))} />
                <Legend />
                <Line type="monotone" dataKey="balance" name="収支" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
