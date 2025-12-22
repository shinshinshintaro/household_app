export type Draft = {
  date: string
  type: 'INCOME' | 'EXPENSE'
  category: string
  amount: string
  memo: string
}
