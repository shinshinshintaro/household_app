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

export const MonthlySummaryCard = ({
  titleMonthKey,
  monthly,
  income,
  expense,
  balance,
}: Props) => {
  // 収支の色はCSS側に寄せる（人間が直しやすい）
  const balanceClass = balance >= 0 ? 'summaryGreen' : 'summaryRed'

  // recharts用に表示文字列だけ整形
  const chartData = useMemo(
    () =>
      monthly.map(m => ({
        month: formatMonthJP(m.monthKey),
        balance: m.balance,
      })),
    [monthly],
  )

  return (
    <section className="panel">
      <h2 className="panelTitle">月次サマリ</h2>

      {/* 最新月の集計（ALL表示でも、ここは「最新月」を渡す運用） */}
      <div className="summaryBlock">
        <div className="summaryTitle">{formatMonthJP(titleMonthKey)}の収支</div>

        <div className="summaryRow">
          <span className="summaryLabel">収入</span>
          <span className="summaryValue">{yen(income)}</span>
        </div>

        <div className="summaryRow">
          <span className="summaryLabel">支出</span>
          <span className="summaryValue">{yen(expense)}</span>
        </div>

        <div className="summaryRow">
          <span className="summaryLabel">収支</span>
          <span className={`summaryValue ${balanceClass}`}>{yen(balance)}</span>
        </div>
      </div>

      {/* 折れ線グラフ（全期間ベース） */}
      <div className="chartWrap">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v: number) => yen(Number(v))} />
            <Tooltip formatter={(v: unknown) => yen(Number(v))} />
            <Legend />
            <Line type="monotone" dataKey="balance" name="収支" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
