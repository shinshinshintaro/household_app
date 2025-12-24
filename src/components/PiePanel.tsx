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
    <section className="panel">
      <h2 className="panelTitle">円グラフ（{periodLabel}）</h2>

      <div className="pieBlock">
        <h3 className="subTitle">支出</h3>
        <ExpensePie data={expensePieData} total={expenseTotal} />
      </div>

      <div className="pieBlock">
        <h3 className="subTitle">収入</h3>
        <IncomePie data={incomePieData} total={incomeTotal} />
      </div>
    </section>
  )
}
