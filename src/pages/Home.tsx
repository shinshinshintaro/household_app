import { useMemo, useState } from 'react'
import type { Account } from '../types/Account'
import { useAccounts } from '../hooks/useAccounts'
import { useFilters } from '../hooks/useFilters'
import { useTargetSavings } from '../hooks/useTargetSavings'
import * as S from '../selectors/accountSelectors'
import { EntryForm } from '../components/home/EntryForm'
import { AccountsPanel } from '../components/home/AccountsPanel'
import { PiePanel } from '../components/PiePanel'
import { MonthlySummaryCard } from '../components/home/MonthlySummary'
import { TargetSavingsCard } from '../components/TargetSavingsCard'

type Draft = {
  date: string
  type: 'INCOME' | 'EXPENSE'
  category: string
  amount: string
  memo: string
}

const EXPENSE_CATEGORIES = ['食費', '家賃', '光熱費', '通信費', '交通費', '日用品', '娯楽', 'その他'] as const
const INCOME_CATEGORIES = ['給料', '副業', '給付金', '配当', 'その他'] as const

const today = () => new Date().toISOString().slice(0, 10)
const STORAGE_KEY = 'household-app-data'
const TARGET_KEY = 'household-target-savings'

export const Home = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts(STORAGE_KEY)
  const { target, saveTargetFromInput } = useTargetSavings(TARGET_KEY)

  const [draft, setDraft] = useState<Draft>({
    date: today(),
    type: 'EXPENSE',
    category: EXPENSE_CATEGORIES[0],
    amount: '',
    memo: '',
  })

  const { viewMode, setViewMode, monthKey, setMonthKey, sortKey, setSortKey } = useFilters(draft.date)
  const [editingId, setEditingId] = useState<number | null>(null)

  const categories = draft.type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const monthOptions = useMemo(() => S.selectMonthOptions(accounts, draft.date), [accounts, draft.date])
  const accountsByPeriod = useMemo(() => S.selectAccountsByPeriod(accounts, monthKey), [accounts, monthKey])
  const accountsByMode = useMemo(() => S.selectAccountsByMode(accountsByPeriod, viewMode), [accountsByPeriod, viewMode])
  const visibleAccounts = useMemo(() => S.selectVisibleAccounts(accountsByMode, sortKey), [accountsByMode, sortKey])

  const expensePieData = useMemo(() => S.selectPieData(accountsByPeriod, 'EXPENSE'), [accountsByPeriod])
  const expenseTotal = useMemo(() => S.selectTotalFromPie(expensePieData), [expensePieData])

  const incomePieData = useMemo(() => S.selectPieData(accountsByPeriod, 'INCOME'), [accountsByPeriod])
  const incomeTotal = useMemo(() => S.selectTotalFromPie(incomePieData), [incomePieData])

  // 月次サマリ用（ALLなら最新月）
  const latestMonthKey = useMemo(() => S.selectLatestMonthKey(accounts, draft.date), [accounts, draft.date])
  const summaryMonthKey = monthKey === 'ALL' ? latestMonthKey : monthKey

  const accountsForSummaryMonth = useMemo(
    () => S.selectAccountsByPeriod(accounts, summaryMonthKey),
    [accounts, summaryMonthKey],
  )

  const summaryTotals = useMemo(() => S.selectTotals(accountsForSummaryMonth), [accountsForSummaryMonth])
  const monthly = useMemo(() => S.selectMonthlyBalances(accounts), [accounts])

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
      {/* ✅ ① タイトル中央 */}
      <h1 className="title titleCenter">家計簿アプリ</h1>

      <div className="layout">
        {/* ✅ 左：被らないように sidebar に隔離 */}
        <div className="sidebar">
          <MonthlySummaryCard
            titleMonthKey={summaryMonthKey}
            monthly={monthly}
            income={summaryTotals.income}
            expense={summaryTotals.expense}
            balance={summaryTotals.balance}
            targetSavings={target}
          />

          <TargetSavingsCard
            target={target}
            onSave={saveTargetFromInput}
          />
        </div>

        {/* ✅ 中央：main */}
        <div className="main">
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
            expenseCategories={EXPENSE_CATEGORIES}
            incomeCategories={INCOME_CATEGORIES}
          />

          <div className="subText">
            対象月：<b>{S.formatMonthJP(draft.date.slice(0, 7))}</b>（日付から自動）
          </div>

          <AccountsPanel
            modeLabel={modeLabel}
            periodLabel={periodLabel}
            viewMode={viewMode}
            setViewMode={setViewMode}
            monthKey={monthKey}
            setMonthKey={setMonthKey}
            sortKey={sortKey}
            setSortKey={setSortKey}
            monthOptions={monthOptions}
            visibleAccounts={visibleAccounts}
            onEdit={onEdit}
            onDelete={deleteAccount}
          />
        </div>

        {/* ✅ 右：円グラフ */}
        <div className="right">
          <PiePanel
            periodLabel={periodLabel}
            expensePieData={expensePieData}
            expenseTotal={expenseTotal}
            incomePieData={incomePieData}
            incomeTotal={incomeTotal}
          />
        </div>
      </div>
    </div>
  )
}
