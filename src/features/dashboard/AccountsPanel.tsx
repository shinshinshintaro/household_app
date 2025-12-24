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
    <section className="panel">
      <h2 className="panelTitle">
        家計簿一覧（{modeLabel} / {periodLabel}）
      </h2>

      {/* フィルタ類は「上に固める」ほうが見通し良い */}
      <div className="controlsRow">
        <label className="control">
          <span className="controlLabel">表示</span>
          <select value={viewMode} onChange={e => setViewMode(e.target.value as ViewMode)}>
            <option value="BALANCE">収支</option>
            <option value="INCOME">収入</option>
            <option value="EXPENSE">支出</option>
          </select>
        </label>

        <label className="control">
          <span className="controlLabel">期間</span>
          <select value={monthKey} onChange={e => setMonthKey(e.target.value as MonthKey)}>
            <option value="ALL">全期間</option>
            {monthOptions.map(m => (
              <option key={m} value={m}>
                {formatMonthJP(m)}
              </option>
            ))}
          </select>
        </label>

        <label className="control">
          <span className="controlLabel">ソート</span>
          <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
            <option value="date-desc">日付が新しい順</option>
            <option value="date-asc">日付が古い順</option>
            <option value="amount-desc">金額が高い順</option>
            <option value="amount-asc">金額が低い順</option>
          </select>
        </label>
      </div>

      {visibleAccounts.length === 0 ? (
        <div className="emptyState">データがありません</div>
      ) : (
        <ul className="accountsList">
          {visibleAccounts.map((a, index) => (
            <li key={getRowKey(a, index)} className="accountRow">
              {/* 左：種別・日付・カテゴリ */}
              <div className="rowMain">
                <div className="rowTop">
                  <span className={`typeBadge ${a.type === 'EXPENSE' ? 'isExpense' : 'isIncome'}`}>
                    {a.type === 'EXPENSE' ? '支出' : '収入'}
                  </span>
                  <span className="dateText">{a.date}</span>
                </div>

                <div className="rowMid">
                  <span className="categoryText">{a.category}</span>
                  {a.memo ? <span className="memoText">メモ: {a.memo}</span> : null}
                </div>
              </div>

              {/* 右：金額・アクション */}
              <div className="rowSide">
                <div className="amountText">¥{a.amount.toLocaleString()}</div>
                <div className="actions">
                  <button type="button" onClick={() => onEdit(a)}>
                    編集
                  </button>
                  <button type="button" onClick={() => onDelete(a)}>
                    削除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
