import { ExpensePie } from './Pie/ExpensePie'
import { IncomePie } from './Pie/IncomePie'

type PieDatum = { name: string; value: number }

type Props = {
  periodLabel: string
  expensePieData: PieDatum[]
  expenseTotal: number
  incomePieData: PieDatum[]
  incomeTotal: number
}

export function PiePanel({ periodLabel, expensePieData, expenseTotal, incomePieData, incomeTotal }: Props) {
  return (
    <>
      <div className="card">
        <h2>支出の円グラフ（{periodLabel}）</h2>
        <div className="pieWrap">
          <ExpensePie data={expensePieData} total={expenseTotal} />
        </div>
      </div>

      <div className="card">
        <h2>収入の円グラフ（{periodLabel}）</h2>
        <div className="pieWrap">
          <IncomePie data={incomePieData} total={incomeTotal} />
        </div>
      </div>
    </>
  )
}
