export const EXPENSE_CATEGORIES = [
  '交通費',   // こうつうひ
  '光熱費',   // こうねつひ
  '娯楽',     // ごらく
  '食費',     // しょくひ
  'その他',   // そのた
  '通信費',   // つうしんひ
  '日用品',   // にちようひん
  '家賃',     // やちん
] as const

export const INCOME_CATEGORIES = [
  '給付金',   // きゅうふきん
  '給料',     // きゅうりょう
  'その他',   // そのた
  '配当',     // はいとう
  '副業',     // ふくぎょう
] as const
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
export type IncomeCategory = typeof INCOME_CATEGORIES[number]
