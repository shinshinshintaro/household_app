import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type Props = {
  data: { name: string; value: number }[]
  total: number
}

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

export const ExpensePie = ({ data, total }: Props) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const activeValue = useMemo(() => {
    if (!activeCategory) return null
    return data.find(d => d.name === activeCategory)?.value ?? null
  }, [data, activeCategory])

  if (data.length === 0) {
    return <div className="emptyState">この期間の支出データがありません</div>
  }

  const shownTotal = activeCategory ? activeValue ?? 0 : total

  return (
    <div className="pieWrap">
      {/* 上：合計表示（フィルタ中はそのカテゴリの合計） */}
      <div className="pieHeader">
        <div className="pieTitle">{activeCategory ? `選択中：${activeCategory}` : '合計'}</div>
        <div className="pieTotal">¥{shownTotal.toLocaleString()}</div>

        {activeCategory ? (
          <button type="button" className="miniBtn" onClick={() => setActiveCategory(null)}>
            フィルタ解除
          </button>
        ) : null}
      </div>

      <div className="pieChart">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Tooltip formatter={(v: unknown) => `¥${Number(v).toLocaleString()}`} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={70}
              onClick={(_, idx) => {
                const clicked = data[idx]
                if (!clicked) return
                setActiveCategory(prev => (prev === clicked.name ? null : clicked.name))
              }}
            >
              {data.map(entry => {
                const isDim = activeCategory && entry.name !== activeCategory
                return (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] ?? '#8884d8'}
                    opacity={isDim ? 0.3 : 1}
                  />
                )
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 下：凡例（ここもクリックで絞れる） */}
      <ul className="pieLegend">
        {data.map(d => {
          const isActive = activeCategory === d.name
          return (
            <li key={d.name}>
              <button
                type="button"
                className={`legendBtn ${isActive ? 'isActive' : ''}`}
                onClick={() => setActiveCategory(prev => (prev === d.name ? null : d.name))}
              >
                <span className="legendName">{d.name}</span>
                <span className="legendValue">¥{d.value.toLocaleString()}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
