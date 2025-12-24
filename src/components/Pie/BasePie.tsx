// src/components/Pie/BasePie.tsx
import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { TooltipProps } from 'recharts'

export type PieDatum = { name: string; value: number }

type Props = {
  /** データが無い時に表示する文言 */
  emptyText: string
  /** 円グラフのデータ (name = カテゴリ名, value = 金額) */
  data: PieDatum[]
  /** 合計金額（表示用。data合計と一致している想定） */
  total: number
  /** name -> color */
  colors: Record<string, string>
}

const toYen = (n: number) => `¥${Math.trunc(n).toLocaleString('ja-JP')}`

/**
 * Recharts Tooltip の formatter は value が number とは限らず
 * string / number / (string|number)[] などで来ることがあります。
 * TooltipProps から formatter の型を取っておくと、型ズレで赤波線が出ません。
 */
const tooltipFormatter: NonNullable<TooltipProps<number, string>['formatter']> = (value) => {
  const n = typeof value === 'number' ? value : Number(value)
  return toYen(Number.isFinite(n) ? n : 0)
}

export function BasePie({ emptyText, data, total, colors }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const activeValue = useMemo(() => {
    if (!activeCategory) return null
    const found = data.find((d) => d.name === activeCategory)
    return found?.value ?? null
  }, [activeCategory, data])

  const toggleCategory = (name: string) => {
    setActiveCategory((prev) => (prev === name ? null : name))
  }

  if (!data.length || total === 0) {
    return <p className="text-sm text-gray-500">{emptyText}</p>
  }

  return (
    <div className="w-full">
      {activeCategory && (
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm">
            <span className="font-semibold">{activeCategory}</span>
            <span className="ml-2 text-gray-600">
              {activeValue != null ? toYen(activeValue) : ''}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="text-sm text-blue-600 hover:underline"
          >
            クリア
          </button>
        </div>
      )}

      <div className="h-56 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Tooltip formatter={tooltipFormatter} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              onClick={(_, idx) => {
                const clicked = data[idx]
                if (!clicked) return
                toggleCategory(clicked.name)
              }}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={colors[d.name] ?? '#999'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
