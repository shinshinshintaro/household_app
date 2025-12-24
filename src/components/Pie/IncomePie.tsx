import { BasePie, type PieDatum } from './BasePie'

type Props = {
  data: PieDatum[]
  total: number
}

const CATEGORY_COLORS: Record<string, string> = {
  給料: '#16a34a',
  副業: '#0ea5e9',
  給付金: '#f59e0b',
  配当: '#7c3aed',
  その他: '#6b7280',
}

export const IncomePie = ({ data, total }: Props) => {
  return (
    <BasePie
      emptyText="今月の収入データがありません"
      data={data}
      total={total}
      colors={CATEGORY_COLORS}
    />
  )
}
