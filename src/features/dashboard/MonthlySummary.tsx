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

  // ✅ Y軸のラベルが何桁になっても見切れないように、最大値から幅を動的に計算
  const yAxisWidth = useMemo(() => {
    if (chartData.length === 0) return 56

    const maxAbs = Math.max(...chartData.map(d => Math.abs(d.balance ?? 0)))
    const label = yen(maxAbs) // 例: "¥1,234,567"
    // だいたい「1文字=8px」くらいで見積もって余白を足す
    return Math.max(56, label.length * 8 + 12)
  }, [chartData])

  return (
    <Card sx={{ width: '100%', ...hoverLift }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={800}>
            月次サマリ
          </Typography>
        } />
      <CardContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {formatMonthJP(titleMonthKey)}の収支
        </Typography>

        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">収入</Typography>
            <Typography variant="body2">{yen(income)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">支出</Typography>
            <Typography variant="body2">{yen(expense)}</Typography>
          </Stack>

          <Divider sx={{ my: 0.5 }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">収支</Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: balance >= 0 ? 'success.main' : 'error.main',
              }}
            >
              {yen(balance)}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                width={yAxisWidth}
                tickFormatter={v => yen(Number(v))}
              />
              <Tooltip formatter={v => yen(Number(v))} />
              <Legend />

              {/* ✅ 直線にする：type="linear"（monotone を使わない） */}
              <Line
                type="linear"
                dataKey="balance"
                name="収支"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}
