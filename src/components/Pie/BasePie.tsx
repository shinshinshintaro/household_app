import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export type PieDatum = { name: string; value: number }

type Props = {
  emptyText: string
  data: PieDatum[]
  total: number
  colors: Record<string, string>
}

export function BasePie({ emptyText, data, total, colors }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const activeValue = useMemo(() => {
    if (!activeCategory) return null
    const found = data.find(d => d.name === activeCategory)
    return found ? found.value : null
  }, [data, activeCategory])

  if (data.length === 0) {
    return <p className="subText">{emptyText}</p>
  }

  const displayValue = activeCategory ? activeValue ?? 0 : total

  return (
    <div className="pieWrap">
      {/* 上：合計 or 選択カテゴリ */}
      <div className="pieHeader">
        <div className="pieHeaderTitle">
          {activeCategory ? `選択中：${activeCategory}` : '合計'}
        </div>
        <div className="pieHeaderValue">¥{displayValue.toLocaleString()}</div>

        {activeCategory && (
          <button className="chip" onClick={() => setActiveCategory(null)}>
            フィルタ解除
          </button>
        )}
      </div>

      {/* 円グラフ */}
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
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
                  fill={colors[entry.name] ?? '#6b7280'}
                  opacity={isDim ? 0.25 : 1}
                />
              )
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* 凡例（クリックで同じフィルタ動作） */}
      <div className="pieLegend">
        {data.map(d => {
          const isActive = activeCategory === d.name
          return (
            <button
              key={d.name}
              className={`legendRowButton ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(prev => (prev === d.name ? null : d.name))}
            >
              <span className="legendLeft">
                <span
                  className="legendColor"
                  style={{ background: colors[d.name] ?? '#6b7280' }}
                />
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
