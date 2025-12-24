import { useMemo, useState } from 'react'
import type { Account } from '../types/Account'
import type { Draft } from '../types/Draft'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'
import { useAccounts } from '../hooks/useAccounts'
import { useFilters } from '../hooks/useFilters'
import * as S from '../selectors/accountSelectors'
import * as index from '../features/dashboard/Index'
import { PiePanel } from '../features/PiePanel'
import { Container, Stack, Typography, Box } from '@mui/material'

const today = () => new Date().toISOString().slice(0, 10)
const STORAGE_KEY = 'household-app-data'

export const Home = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts(STORAGE_KEY)

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
    <Container
      maxWidth={false}
      sx={{ py: 3, maxWidth: 1500, mx: 'auto' }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700} textAlign="center">
          家計簿アプリ
        </Typography>

        {/* CSSの3カラムグリッドをそのまま使う */}
        <Box className="homeGrid">
          <aside className="leftPane">
            <index.MonthlySummaryCard
              titleMonthKey={summaryMonthKey}
              monthly={monthly}
              income={summaryTotals.income}
              expense={summaryTotals.expense}
              balance={summaryTotals.balance}
            />
          </aside>

          <main className="mainPane">
            <index.EntryForm
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

            <index.AccountsPanel
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
          </main>

          <aside className="rightPane">
            <PiePanel
              periodLabel={periodLabel}
              expensePieData={expensePieData}
              expenseTotal={expenseTotal}
              incomePieData={incomePieData}
              incomeTotal={incomeTotal}
            />
          </aside>
        </Box>
      </Stack>
    </Container>
  )
}
