import { useMemo, useState } from 'react'
import type { Account } from '../types/Account'
import { useAccounts } from '../hooks/useAccounts'
import { useFilters } from '../hooks/useFilters'
import * as S from '../selectors/accountSelectors'
import { EntryForm } from '../components/home/EntryForm'
import { AccountsPanel } from '../components/home/AccountsPanel'
import { PiePanel } from '../components/PiePanel'
import type { Draft } from '../types/Draft'
import * as category from '../constants/categories'

const today = () => new Date().toISOString().slice(0, 10)
const STORAGE_KEY = 'household-app-data'

export const Home = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts(STORAGE_KEY)

  const [draft, setDraft] = useState<Draft>({
    date: today(),
    type: 'EXPENSE',
    category: category.EXPENSE_CATEGORIES[0],
    amount: '',
    memo: '',
  })

  const { viewMode, setViewMode, monthKey, setMonthKey, sortKey, setSortKey } = useFilters(draft.date)
  const [editingId, setEditingId] = useState<number | null>(null)

  const categories = draft.type === 'EXPENSE' ? category.EXPENSE_CATEGORIES : category.INCOME_CATEGORIES

  const derived = useMemo(
  () => S.selectDerived(accounts, draft.date, monthKey, viewMode, sortKey),
  [accounts, draft.date, monthKey, viewMode, sortKey],
)
  const onResetDraft = () => setDraft(prev => ({ ...prev, amount: '', memo: '' }))

  const onAddOrUpdate = () => {
    if (editingId === null) {
      addAccount(draft)
      onResetDraft()
      return
    }
    updateAccount(editingId, draft)
    setEditingId(null)
    onResetDraft()
  }

  const onEdit = (a: Account) => {
    const id = S.getSafeId(a)
    if (id === null) {
      alert('この行はidが無いので編集できません（古いデータの可能性）')
      return
    }
    setEditingId(id)
    setDraft({
      date: a.date,
      type: a.type,
      category: a.category,
      amount: String(a.amount),
      memo: a.memo ?? '',
    })
  }

  const periodLabel = monthKey === 'ALL' ? '全期間' : S.formatMonthJP(monthKey)
  const modeLabel = viewMode === 'BALANCE' ? '収支' : viewMode === 'INCOME' ? '収入' : '支出'

  return (
    <div className="container">
      <h1 className="title">家計簿アプリ</h1>

      <div className="layout">
        <div className="left">
          <EntryForm
            draft={draft}
            setDraft={setDraft}
            categories={categories}
            editing={editingId !== null}
            onSubmit={onAddOrUpdate}
            onCancelEdit={() => {
              setEditingId(null)
              onResetDraft()
            }}
            expenseCategories={category.EXPENSE_CATEGORIES}
            incomeCategories={category.INCOME_CATEGORIES}
          />

          <div className="subText">
            対象月：<b>{S.formatMonthJP(draft.date.slice(0, 7))}</b>（日付から自動）
          </div>

          <AccountsPanel
            modeLabel={modeLabel}
            periodLabel={periodLabel}
            totals={derived.totals}
            viewMode={viewMode}
            setViewMode={setViewMode}
            monthKey={monthKey}
            setMonthKey={setMonthKey}
            sortKey={sortKey}
            setSortKey={setSortKey}
            monthOptions={derived.monthOptions}
            visibleAccounts={derived.visibleAccounts}
            onEdit={onEdit}
            onDelete={deleteAccount}
          />
        </div>

        <div className="right">
          <PiePanel
            periodLabel={periodLabel}
            expensePieData={derived.expensePieData}
            expenseTotal={derived.expenseTotal}
            incomePieData={derived.incomePieData}
            incomeTotal={derived.incomeTotal}
          />
        </div>
      </div>
    </div>
  )
}
