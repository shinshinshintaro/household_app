import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import type { MonthlyBalancePoint } from '../../selectors/accountSelectors'
import { formatMonthJP } from '../../selectors/accountSelectors'

type Props = {
  titleMonthKey: string
  monthly: MonthlyBalancePoint[]
  income: number
  expense: number
  balance: number
  targetSavings: number
}

const yen = (n: number) => `¥${n.toLocaleString()}`

export const MonthlySummaryCard = ({
  titleMonthKey,
  monthly,
  income,
  expense,
  balance,
  targetSavings,
}: Props) => {
  const diff = balance - targetSavings
  const balanceClass = balance >= 0 ? 'summaryGreen' : 'summaryRed'
  const diffClass = diff >= 0 ? 'summaryGreen' : 'summaryRed'

  const chartData = useMemo(() => {
    return monthly.map(m => ({
      month: formatMonthJP(m.monthKey),
      balance: m.balance,
    }))
  }, [monthly])

  return (
    <div className="card">
      <h2>月次サマリ</h2>

      <div className="subText" style={{ marginBottom: 8 }}>
        最新月（{formatMonthJP(titleMonthKey)}）の収支
      </div>

      {/* ②：一覧側から移設（色・フォントはクラスで維持） */}
      <div className="summaryRow" style={{ marginBottom: 10 }}>
        <span className="summaryItem summaryGreen">
          収入：<b>{yen(income)}</b>
        </span>
        <br />
        <span className="summaryItem summaryRed">
          支出：<b>{yen(expense)}</b>
        </span>
        <br />
        <span className={`summaryItem ${balanceClass}`}>
          収支：<b>{yen(balance)}</b>
        </span>
        <br />
        <span className="summaryItem summaryBlue">
          目標貯金：<b>{yen(targetSavings)}</b>
        </span>
        <br />
        <span className={`summaryItem ${diffClass}`}>
          差額：<b>{yen(diff)}</b>
        </span>
      </div>

      {/* ③④⑤：¥付き・折れ線・細め・鮮やか・凡例に「収支表」 */}
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `¥${Number(v).toLocaleString()}`} // ③
            />
            <Tooltip formatter={(v: any) => yen(Number(v))} />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              name="収支表" // ⑤
              stroke="#2563eb" // ④（鮮やか）
              strokeWidth={2} // ④（太すぎ防止）
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
