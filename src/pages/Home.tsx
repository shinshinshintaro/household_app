import { useMemo, useState } from 'react'
import type { Account } from '../types/Account'
import type { Draft } from '../types/Draft'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories'
import { useAccounts } from '../hooks/useAccounts'
import { useFilters } from '../hooks/useFilters'
import * as S from '../selectors/accountSelectors'
import * as index from '../features/dashboard/Index'
import { PiePanel } from '../features/PiePanel'
import { Container, Stack, Typography, Box, Snackbar, Alert } from '@mui/material'
import { FadeIn } from '../components/FadeIn'

const today = () => new Date().toISOString().slice(0, 10)
const STORAGE_KEY = 'household-app-data'

type SnackState = {
  open: boolean
  message: string
  severity: 'success' | 'info' | 'warning' | 'error'
}

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

  // ✅ Snackbar
  const [snack, setSnack] = useState<SnackState>({
    open: false,
    message: '',
    severity: 'success',
  })

  const showSnack = (message: string, severity: SnackState['severity'] = 'success') => {
    setSnack({ open: true, message, severity })
  }
  const closeSnack = () => setSnack(prev => ({ ...prev, open: false }))

  // 種別に応じたカテゴリ候補
  const categories = draft.type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  // 月プルダウン候補
  const monthOptions = useMemo(() => S.selectMonthOptions(accounts, draft.date), [accounts, draft.date])

  // 一覧用（期間→モード→ソート）
  const accountsByPeriod = useMemo(() => S.selectAccountsByPeriod(accounts, monthKey), [accounts, monthKey])
  const accountsByMode = useMemo(() => S.selectAccountsByMode(accountsByPeriod, viewMode), [accountsByPeriod, viewMode])
  const visibleAccounts = useMemo(() => S.selectVisibleAccounts(accountsByMode, sortKey), [accountsByMode, sortKey])

  // 円グラフ用
  const expensePieData = useMemo(() => S.selectPieData(accountsByPeriod, 'EXPENSE'), [accountsByPeriod])
  const expenseTotal = useMemo(() => S.selectTotalFromPie(expensePieData), [expensePieData])
  const incomePieData = useMemo(() => S.selectPieData(accountsByPeriod, 'INCOME'), [accountsByPeriod])
  const incomeTotal = useMemo(() => S.selectTotalFromPie(incomePieData), [incomePieData])

  // 月次サマリ用：ALLのときは最新月で表示
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
      showSnack('追加しました', 'success')
      onResetDraft()
      return
    }

    updateAccount(editingId, draft)
    setEditingId(null)
    showSnack('更新しました', 'success')
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
    showSnack('編集モードにしました', 'info')
  }

  const onDelete = (a: Account) => {
    deleteAccount(a)
    // 編集中の行を消した場合の安全処理
    const id = S.getSafeId(a)
    if (id !== null && editingId === id) {
      setEditingId(null)
      onResetDraft()
    }
    showSnack('削除しました', 'warning')
  }

  const periodLabel = monthKey === 'ALL' ? '全期間' : S.formatMonthJP(monthKey)
  const modeLabel = viewMode === 'BALANCE' ? '収支' : viewMode === 'INCOME' ? '収入' : '支出'

  return (
    <Container maxWidth={false} sx={{width: '100%',px: { xs: 2, sm: 3 },py: 3,}}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700} textAlign="center">
          <FadeIn delay={500}>家計簿アプリ</FadeIn>
        </Typography>

        {/* CSSの3カラムグリッドをそのまま使う */}
        <Box className="homeGrid">
          <aside className="leftPane">
            <FadeIn delay={1500}>
              <index.MonthlySummaryCard
                titleMonthKey={summaryMonthKey}
                monthly={monthly}
                income={summaryTotals.income}
                expense={summaryTotals.expense}
                balance={summaryTotals.balance}
              />
            </FadeIn>
          </aside>

          <main className="mainPane">
            <FadeIn delay={1000}>
              <index.EntryForm
                draft={draft}
                setDraft={setDraft}
                categories={categories}
                editing={editingId !== null}
                onSubmit={onAddOrUpdate}
                onCancelEdit={() => {
                  setEditingId(null)
                  onResetDraft()
                  showSnack('編集解除しました', 'info')
                }}
                expenseCategories={EXPENSE_CATEGORIES}
                incomeCategories={INCOME_CATEGORIES}
              />
            </FadeIn>

            <FadeIn delay={1000}>
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
                onDelete={onDelete}
              />
            </FadeIn>
          </main>

          <aside className="rightPane">
            <FadeIn delay={1500}>
              <PiePanel
                periodLabel={periodLabel}
                expensePieData={expensePieData}
                expenseTotal={expenseTotal}
                incomePieData={incomePieData}
                incomeTotal={incomeTotal}
              />
            </FadeIn>
          </aside>
        </Box>
      </Stack>

      {/* ✅ Snackbar（③） */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
