import type { AccountType } from './Account'

export type Draft = {
  date: string
  type: AccountType
  category: string
  amount: string
  memo: string
}
