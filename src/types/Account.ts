export type AccountType = 'INCOME' | 'EXPENSE'

export type Account = {
  /** 古いデータには id が無い可能性があるので optional のままにする */
  id?: number
  type: AccountType
  category: string
  amount: number
  date: string // YYYY-MM-DD
  memo?: string
}
