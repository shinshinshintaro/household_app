// ExpensePie.tsx
import { BasePie, type PieDatum } from './BasePie'

type Props = { data: PieDatum[]; total: number }

const CATEGORY_COLORS: Record<string, string> = {
  食費: '#2563eb',
  家賃: '#dc2626',
  光熱費: '#f59e0b',
  通信費: '#0d9488',
  交通費: '#7c3aed',
  日用品: '#16a34a',
  娯楽: '#db2777',
  その他: '#6b7280',
}

export function ExpensePie({ data, total }: Props) {
  return <BasePie emptyText="支出データがありません" data={data} total={total} colors={CATEGORY_COLORS} />
}
