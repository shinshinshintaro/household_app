import type { Account } from '../types/Account'

export type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
export type ViewMode = 'BALANCE' | 'INCOME' | 'EXPENSE'
export type MonthKey = 'ALL' | string // 'YYYY-MM' or ALL

// YYYY-MM -> 2025年12月
export const formatMonthJP = (m: string) => {
  if (!/^\d{4}-\d{2}$/.test(m)) return m
  const [y, mm] = m.split('-')
  return `${y}年${mm}月`
}

// idが怪しいデータ（過去localStorage）でも落ちないようにする
export const getSafeId = (a: Account): number | null => {
  const v = (a as any)?.id
  return typeof v === 'number' ? v : null
}

export const getRowKey = (a: Account, index: number) => {
  const id = getSafeId(a)
  if (id !== null) return String(id)
  return `${a.date}-${a.type}-${a.category}-${a.amount}-${index}`
}

export const selectMonthOptions = (accounts: Account[], draftDate: string) => {
  const set = new Set<string>()
  set.add(draftDate.slice(0, 7))
  for (const a of accounts) {
    if (typeof (a as any)?.date === 'string' && (a as any).date.length >= 7) {
      set.add((a as any).date.slice(0, 7))
    }
  }
  return Array.from(set).sort((a, b) => (a < b ? 1 : -1))
}

export const selectAccountsByPeriod = (accounts: Account[], monthKey: MonthKey) => {
  if (monthKey === 'ALL') return accounts
  return accounts.filter(a => a.date.slice(0, 7) === monthKey)
}

export const selectAccountsByMode = (accountsByPeriod: Account[], viewMode: ViewMode) => {
  if (viewMode === 'BALANCE') return accountsByPeriod
  if (viewMode === 'INCOME') return accountsByPeriod.filter(a => a.type === 'INCOME')
  return accountsByPeriod.filter(a => a.type === 'EXPENSE')
}

export const selectVisibleAccounts = (accountsByMode: Account[], sortKey: SortKey) => {
  const arr = [...accountsByMode]
  arr.sort((a, b) => {
    if (sortKey === 'date-desc') return b.date.localeCompare(a.date)
    if (sortKey === 'date-asc') return a.date.localeCompare(b.date)
    if (sortKey === 'amount-desc') return b.amount - a.amount
    return a.amount - b.amount
  })
  return arr
}

export const selectTotals = (accountsByPeriod: Account[]) => {
  let income = 0
  let expense = 0
  for (const a of accountsByPeriod) {
    if (a.type === 'INCOME') income += a.amount
    if (a.type === 'EXPENSE') expense += a.amount
  }
  return { income, expense, balance: income - expense }
}

export const selectPieData = (accountsByPeriod: Account[], type: 'INCOME' | 'EXPENSE') => {
  const map = new Map<string, number>()
  for (const a of accountsByPeriod) {
    if (a.type !== type) continue
    map.set(a.category, (map.get(a.category) ?? 0) + a.amount)
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}

export const selectTotalFromPie = (pieData: { name: string; value: number }[]) => {
  return pieData.reduce((sum, d) => sum + d.value, 0)
}

export const buildHomeViewModel = (params: {
  accounts: Account[]
  monthKey: MonthKey
  viewMode: ViewMode
  sortKey: SortKey
  draftDate: string
}) => {
  const monthOptions = selectMonthOptions(params.accounts, params.draftDate)
  const accountsByPeriod = selectAccountsByPeriod(params.accounts, params.monthKey)
  const accountsByMode = selectAccountsByMode(accountsByPeriod, params.viewMode)
  const visibleAccounts = selectVisibleAccounts(accountsByMode, params.sortKey)
  const totals = selectTotals(accountsByPeriod)
  const expensePieData = selectPieData(accountsByPeriod, 'EXPENSE')
  const incomePieData = selectPieData(accountsByPeriod, 'INCOME')
  return {
    monthOptions,
    accountsByPeriod,
    visibleAccounts,
    totals,
    expensePieData,
    incomePieData,
    expenseTotal: selectTotalFromPie(expensePieData),
    incomeTotal: selectTotalFromPie(incomePieData),
  }
}

export const selectDerived = (accounts: Account[], draftDate: string, monthKey: MonthKey, viewMode: ViewMode, sortKey: SortKey) => {
  const monthOptions = selectMonthOptions(accounts, draftDate)
  const accountsByPeriod = selectAccountsByPeriod(accounts, monthKey)
  const accountsByMode = selectAccountsByMode(accountsByPeriod, viewMode)
  const visibleAccounts = selectVisibleAccounts(accountsByMode, sortKey)
  const totals = selectTotals(accountsByPeriod)

  const expensePieData = selectPieData(accountsByPeriod, 'EXPENSE')
  const expenseTotal = selectTotalFromPie(expensePieData)
  const incomePieData = selectPieData(accountsByPeriod, 'INCOME')
  const incomeTotal = selectTotalFromPie(incomePieData)

  return { monthOptions, accountsByPeriod, accountsByMode, visibleAccounts, totals, expensePieData, expenseTotal, incomePieData, incomeTotal }
}
