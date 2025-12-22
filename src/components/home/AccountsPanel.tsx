import type { Account } from '../../types/Account'
import type { MonthKey, SortKey, ViewMode } from '../../selectors/accountSelectors'
import { formatMonthJP, getRowKey } from '../../selectors/accountSelectors'

type Props = {
  modeLabel: string
  periodLabel: string

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
            <li key={getRowKey(a, index)} className="row rowGrid">
              {/* 種別 */}
              <div className="colType">
                <span className={`badge ${a.type === 'EXPENSE' ? 'badgeExpense' : 'badgeIncome'}`}>
                  {a.type === 'EXPENSE' ? '支出' : '収入'}
                </span>
              </div>

              {/* 日付 */}
              <div className="colDate">{a.date}</div>

              {/* カテゴリ */}
              <div className="colCategory">
                <span className="rowCategory">{a.category}</span>
              </div>

              {/* 備考（カテゴリ右・金額左） */}
              <div className="colMemo" title={a.memo ?? ''}>
                {a.memo ? `メモ: ${a.memo}` : ''}
              </div>

              {/* 金額 */}
              <div className="colAmount">¥{a.amount.toLocaleString()}</div>

              {/* アクション */}
              <div className="colActions">
                <button className="miniBtn" onClick={() => onEdit(a)}>
                  編集
                </button>
                <button className="miniBtn miniBtnDanger" onClick={() => onDelete(a)}>
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
