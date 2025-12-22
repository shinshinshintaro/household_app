import type { Account } from '../../types/Account'
import type { MonthKey, SortKey, ViewMode } from '../../selectors/accountSelectors'
import { formatMonthJP, getRowKey } from '../../selectors/accountSelectors'

type Totals = { income: number; expense: number; balance: number }

type Props = {
  modeLabel: string
  periodLabel: string

  totals: Totals

  viewMode: ViewMode
  setViewMode: (v: ViewMode) => void

  monthKey: MonthKey
  setMonthKey: (v: MonthKey) => void

  sortKey: SortKey
  setSortKey: (v: SortKey) => void

  monthOptions: string[]
  visibleAccounts: Account[]

  onEdit: (a: Account) => void
  onDelete: (a: Account) => void
}

export const AccountsPanel = ({
  modeLabel,
  periodLabel,
  viewMode,
  setViewMode,
  monthKey,
  setMonthKey,
  sortKey,
  setSortKey,
  monthOptions,
  visibleAccounts,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="card">
      <div className="listHeader">
        <div className="listHeaderLeft">
          <h2>
            家計簿一覧（{modeLabel} / {periodLabel}）
          </h2>
          {/* ②：ここにあった summaryRow は削除して月次サマリへ */}
        </div>

        <div className="controls">
          <select className="controlSelect" value={viewMode} onChange={e => setViewMode(e.target.value as ViewMode)}>
            <option value="BALANCE">収支</option>
            <option value="INCOME">収入</option>
            <option value="EXPENSE">支出</option>
          </select>

          <select className="controlSelect" value={monthKey} onChange={e => setMonthKey(e.target.value as MonthKey)}>
            <option value="ALL">全期間</option>
            {monthOptions.map(m => (
              <option key={m} value={m}>
                {formatMonthJP(m)}
              </option>
            ))}
          </select>

          <select className="controlSelect" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
            <option value="date-desc">日付が新しい順</option>
            <option value="date-asc">日付が古い順</option>
            <option value="amount-desc">金額が高い順</option>
            <option value="amount-asc">金額が低い順</option>
          </select>
        </div>
      </div>

      {visibleAccounts.length === 0 ? (
        <p className="subText">データがありません</p>
      ) : (
        <ul className="list">
          {visibleAccounts.map((a, index) => (
            <li key={getRowKey(a, index)} className="row">
              <div>
                <span className={`badge ${a.type === 'EXPENSE' ? 'badgeExpense' : 'badgeIncome'}`}>
                  {a.type === 'EXPENSE' ? '支出' : '収入'}
                </span>
              </div>

              {/* 日付は「種別とカテゴリの間」 */}
              <div className="subText">{a.date}</div>

              <div>
                <b>{a.category}</b>
                {a.memo && <div className="subText">メモ: {a.memo}</div>}
              </div>

              <div className="rowRight">
                <div className="amount">¥{a.amount.toLocaleString()}</div>
                <div className="rowActions">
                  <button className="miniBtn" onClick={() => onEdit(a)}>
                    編集
                  </button>
                  <button className="miniBtn miniBtnDanger" onClick={() => onDelete(a)}>
                    削除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
