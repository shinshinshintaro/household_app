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
    <>
      <div className="card">
        <h2 style={{ margin: 0, fontSize: 18 }}>支出の円グラフ（{periodLabel}）</h2>
        <div className="pieWrap">
          <ExpensePie data={expensePieData} total={expenseTotal} />
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: 0, fontSize: 18 }}>収入の円グラフ（{periodLabel}）</h2>
        <div className="pieWrap">
          <IncomePie data={incomePieData} total={incomeTotal} />
        </div>
      </div>
    </>
  )
}
