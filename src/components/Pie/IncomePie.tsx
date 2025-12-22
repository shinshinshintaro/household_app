import { useMemo, useState } from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Props = {
  data: { name: string; value: number }[]
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // 選択中カテゴリのデータ（円グラフは絞らない）
  const activeItem = useMemo(() => {
    if (!activeCategory) return null
    return data.find(d => d.name === activeCategory) ?? null
  }, [data, activeCategory])

  if (data.length === 0) {
    return <p className="subText">今月の収入データがありません</p>
  }

  return (
    <div style={{ width: 320 }}>
      {/* 上部：合計 or 選択中カテゴリの金額 */}
      <div className="pieHeader">
        <div className="pieHeaderTitle">
          {activeCategory ? `選択中：${activeCategory}` : '合計'}
        </div>

        <div className="pieHeaderValue">
          ¥{(activeItem ? activeItem.value : total).toLocaleString()}
        </div>

        {activeCategory && (
          <button className="chip" onClick={() => setActiveCategory(null)}>
            フィルタ解除
          </button>
        )}
      </div>

      {/* 円グラフ本体（常に全カテゴリ） */}
      <div style={{ width: 260, height: 260, margin: '0 auto' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              onClick={(_, index) => {
                const name = data[index]?.name
                if (!name) return
                setActiveCategory(prev => (prev === name ? null : name))
              }}
            >
              {data.map(entry => {
                const isActive = activeCategory === entry.name
                const isDimmed = activeCategory && !isActive

                return (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] ?? '#9ca3af'}
                    opacity={isDimmed ? 0.25 : 1}
                  />
                )
              })}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 凡例（クリックで選択） */}
      <div className="pieLegend">
        {data.map(d => {
          const isActive = activeCategory === d.name
          return (
            <button
              type="button"
              key={d.name}
              className={`legendRowButton ${isActive ? 'active' : ''}`}
              onClick={() =>
                setActiveCategory(prev => (prev === d.name ? null : d.name))
              }
            >
              <span
                className="legendColor"
                style={{ backgroundColor: CATEGORY_COLORS[d.name] ?? '#9ca3af' }}
              />
              <span className="legendName">{d.name}</span>
              <span className="legendValue">¥{d.value.toLocaleString()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
