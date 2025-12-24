import { useMemo, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { TooltipProps } from 'recharts'

export type PieDatum = { name: string; value: number }

type Props = {
  emptyText: string
  data: PieDatum[]
  total: number
  colors: Record<string, string>
}

const toYen = (n: number) => `¥${Math.trunc(n).toLocaleString('ja-JP')}`

const tooltipFormatter: NonNullable<TooltipProps<number, string>['formatter']> = value => {
  const n = typeof value === 'number' ? value : Number(value)
  return toYen(Number.isFinite(n) ? n : 0)
}

export function BasePie({ emptyText, data, total, colors }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const activeValue = useMemo(() => {
    if (!activeCategory) return null
    const found = data.find(d => d.name === activeCategory)
    return found?.value ?? null
  }, [activeCategory, data])

  const toggleCategory = (name: string) => {
    setActiveCategory(prev => (prev === name ? null : name))
  }

  if (!data.length || total === 0) {
    return (
      <Box sx={{ py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="caption" color="text.secondary">
          合計
        </Typography>
        <Typography variant="h6" fontWeight={800}>
          {toYen(total)}
        </Typography>

        {activeCategory ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" fontWeight={700}>
              {activeCategory}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activeValue != null ? toYen(activeValue) : ''}
            </Typography>
            <Button size="small" onClick={() => setActiveCategory(null)}>
              クリア
            </Button>
          </Stack>
        ) : null}
      </Box>

      {/* ✅ ResponsiveContainer は「親に高さがない」と描画されません */}
      <Box sx={{ width: '100%', height: 220 }}>
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
              {data.map(d => (
                <Cell
                  key={d.name}
                  fill={colors[d.name] ?? '#9ca3af'}
                  opacity={!activeCategory || activeCategory === d.name ? 1 : 0.25}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack spacing={0.5}>
        {data.map(d => (
          <Button
            key={d.name}
            variant={activeCategory === d.name ? 'contained' : 'outlined'}
            onClick={() => toggleCategory(d.name)}
            sx={{ justifyContent: 'space-between' }}
          >
            <span>{d.name}</span>
            <span>{toYen(d.value)}</span>
          </Button>
        ))}
      </Stack>
    </Stack>
  )
}
