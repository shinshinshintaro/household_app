import type { Account } from '../types/Account'
import * as C from '../constants/categories'

export type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
export type ViewMode = 'BALANCE' | 'INCOME' | 'EXPENSE'
export type MonthKey = 'ALL' | string // 'YYYY-MM' or ALL

// 月次サマリ用
export type MonthlyBalancePoint = {
  monthKey: string
  income: number
  expense: number
  balance: number
}

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

export const selectLatestMonthKey = (accounts: Account[], draftDate: string) => {
  const months = new Set<string>()
  months.add(draftDate.slice(0, 7))
  for (const a of accounts) {
    if (typeof (a as any)?.date === 'string' && (a as any).date.length >= 7) {
      months.add((a as any).date.slice(0, 7))
    }
  }
  const arr = Array.from(months)
  arr.sort((a, b) => (a < b ? 1 : -1)) // desc
  return arr[0] ?? draftDate.slice(0, 7)
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

  // 収支混在時の “種別順”
  // 好みで EXPENSE を先にしたければ、数値を入れ替えてOK
  const TYPE_ORDER: Record<Account['type'], number> = {
    INCOME: 0,
    EXPENSE: 1,
  }

  // 「type:category」→固定順（categories.ts の並びをそのまま使う）
  const expenseEntries: Array<[string, number]> = Array.from(C.EXPENSE_CATEGORIES).map(
    (c, i) => [`EXPENSE:${c}`, i]
  )
  const incomeEntries: Array<[string, number]> = Array.from(C.INCOME_CATEGORIES).map(
    (c, i) => [`INCOME:${c}`, i]
  )

  const CATEGORY_ORDER = new Map<string, number>([...expenseEntries, ...incomeEntries])

  const typeCompare = (a: Account, b: Account) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]

  const categoryCompare = (a: Account, b: Account) => {
    const ao = CATEGORY_ORDER.get(`${a.type}:${a.category}`)
    const bo = CATEGORY_ORDER.get(`${b.type}:${b.category}`)
    if (ao != null && bo != null) return ao - bo
    if (ao != null) return -1
    if (bo != null) return 1
    return a.category.localeCompare(b.category, 'ja')
  }

  const stableCompare = (a: Account, b: Account) => {
    const aid = getSafeId(a) ?? Number.MAX_SAFE_INTEGER
    const bid = getSafeId(b) ?? Number.MAX_SAFE_INTEGER
    if (aid !== bid) return aid - bid
    const ak = `${a.date}|${a.type}|${a.category}|${a.amount}`
    const bk = `${b.date}|${b.type}|${b.category}|${b.amount}`
    return ak.localeCompare(bk, 'ja')
  }

  arr.sort((a, b) => {
    if (sortKey === 'date-desc') {
      const d = b.date.localeCompare(a.date)
      if (d !== 0) return d
      const t = typeCompare(a, b)         // ★同日なら種別
      if (t !== 0) return t
      const c = categoryCompare(a, b)     // ★同日・同種別ならカテゴリ
      if (c !== 0) return c
      return stableCompare(a, b)
    }

    if (sortKey === 'date-asc') {
      const d = a.date.localeCompare(b.date)
      if (d !== 0) return d
      const t = typeCompare(a, b)
      if (t !== 0) return t
      const c = categoryCompare(a, b)
      if (c !== 0) return c
      return stableCompare(a, b)
    }

    if (sortKey === 'amount-desc') {
      const d = b.amount - a.amount
      if (d !== 0) return d
      const dd = b.date.localeCompare(a.date)
      if (dd !== 0) return dd
      const t = typeCompare(a, b)
      if (t !== 0) return t
      const c = categoryCompare(a, b)
      if (c !== 0) return c
      return stableCompare(a, b)
    }

    // amount-asc
    const d = a.amount - b.amount
    if (d !== 0) return d
    const dd = b.date.localeCompare(a.date)
    if (dd !== 0) return dd
    const t = typeCompare(a, b)
    if (t !== 0) return t
    const c = categoryCompare(a, b)
    if (c !== 0) return c
    return stableCompare(a, b)
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

// 月ごとの収支（折れ線用）
export const selectMonthlyBalances = (accounts: Account[]): MonthlyBalancePoint[] => {
  const map = new Map<string, { income: number; expense: number }>()
  for (const a of accounts) {
    const monthKey = a.date.slice(0, 7)
    const cur = map.get(monthKey) ?? { income: 0, expense: 0 }
    if (a.type === 'INCOME') cur.income += a.amount
    if (a.type === 'EXPENSE') cur.expense += a.amount
    map.set(monthKey, cur)
  }

  // 古い→新しい（折れ線はこの方が自然）
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([monthKey, v]) => ({
      monthKey,
      income: v.income,
      expense: v.expense,
      balance: v.income - v.expense,
    }))
}
