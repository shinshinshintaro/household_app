import { useMemo, useState } from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts'

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
    const found = data.find(d => d.name === activeCategory)
    return found ? found.value : null
  }, [data, activeCategory])

  if (data.length === 0) {
    return <p className="subText">今月の支出データがありません</p>
  }

  return (
    <div>
      {/* 上：合計 or 選択カテゴリ合計 */}
      <div className="pieHeader">
        <div className="pieHeaderTitle">{activeCategory ? `選択中：${activeCategory}` : '合計'}</div>
        <div className="pieHeaderValue">¥{(activeCategory ? (activeValue ?? 0) : total).toLocaleString()}</div>

        {activeCategory && (
          <button className="chip" onClick={() => setActiveCategory(null)}>
            フィルタ解除
          </button>
        )}
      </div>

      <div style={{ width: 260, height: 260, margin: '0 auto' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
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
                    fill={CATEGORY_COLORS[entry.name] ?? '#9ca3af'}
                    opacity={isDim ? 0.25 : 1}
                  />
                )
              })}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 下：凡例 */}
      <div className="pieLegend">
        {data.map(d => {
          const isActive = activeCategory === d.name
          return (
            <button
              type="button"
              key={d.name}
              className={`legendRowButton ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(prev => (prev === d.name ? null : d.name))}
            >
              <span className="legendLeft">
                <span className="legendColor" style={{ backgroundColor: CATEGORY_COLORS[d.name] ?? '#9ca3af' }} />
                <span className="legendName">{d.name}</span>
              </span>
              <span className="legendValue">¥{d.value.toLocaleString()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
