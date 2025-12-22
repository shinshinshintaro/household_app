export const EXPENSE_CATEGORIES = ['食費', '家賃', '光熱費', '通信費', '交通費', '日用品', '娯楽', 'その他'] as const
export const INCOME_CATEGORIES = ['給料', '副業', '給付金', '配当', 'その他'] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
export type IncomeCategory = typeof INCOME_CATEGORIES[number]
