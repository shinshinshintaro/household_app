import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import type { Account } from '../../types/Account'
import type { MonthKey, SortKey, ViewMode } from '../../selectors/accountSelectors'
import { formatMonthJP, getRowKey } from '../../selectors/accountSelectors'

type Props = {
  modeLabel: string
  periodLabel: string

  viewMode: ViewMode
  setViewMode: (v: ViewMode) => void

  monthKey: MonthKey
  setMonthKey: (v: MonthKey) => void

  sortKey: SortKey
  setSortKey: (v: SortKey) => void

  monthOptions: string[]
  visibleAccounts: Account[]
  onEdit: (a: Account) => void
  onDelete: (a: Account) => void
}

const yen = (n: number) => `¥${n.toLocaleString()}`

export const hoverLift = {
  transition: 'transform 160ms ease, box-shadow 160ms ease',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
} as const

const headCellSx = {
  fontWeight: 900,
  textAlign: 'center',
  whiteSpace: 'nowrap',
} as const

const bodyCellCenterSx = {
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
} as const

export const AccountsPanel = ({
  modeLabel,
  periodLabel,
  viewMode,
  setViewMode,
  monthKey,
  setMonthKey,
  sortKey,
  setSortKey,
  monthOptions,
  visibleAccounts,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Card variant="outlined" sx={hoverLift}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={800}>
            一覧（{modeLabel} / {periodLabel}）
          </Typography>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        {/* フィルタ */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>表示</InputLabel>
            <Select
              label="表示"
              value={viewMode}
              onChange={e => setViewMode(e.target.value as ViewMode)}
            >
              <MenuItem value="BALANCE">収支</MenuItem>
              <MenuItem value="INCOME">収入</MenuItem>
              <MenuItem value="EXPENSE">支出</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>期間</InputLabel>
            <Select
              label="期間"
              value={monthKey}
              onChange={e => setMonthKey(e.target.value as MonthKey)}
            >
              <MenuItem value="ALL">全期間</MenuItem>
              {monthOptions.map(m => (
                <MenuItem key={m} value={m}>
                  {formatMonthJP(m)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>ソート</InputLabel>
            <Select
              label="ソート"
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
            >
              <MenuItem value="date-desc">日付が新しい順</MenuItem>
              <MenuItem value="date-asc">日付が古い順</MenuItem>
              <MenuItem value="amount-desc">金額が高い順</MenuItem>
              <MenuItem value="amount-asc">金額が低い順</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* 一覧 */}
        {visibleAccounts.length === 0 ? (
          <Box className="emptyState" sx={{ px: 2, py: 2 }}>
            データがありません
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: 'hidden', // “枠からはみ出し”を絶対に出さない
            }}
          >
            <Table
              size="small"
              sx={{
                width: '100%',
                tableLayout: 'fixed', // ★ここが本命：列崩れ防止
              }}
            >
              {/* 最小限の幅だけ指定（固定しすぎない） */}
              <colgroup>
                <col style={{ width: 92 }} />   {/* 種別 */}
                <col style={{ width: 120 }} />  {/* 日付 */}
                <col style={{ width: 140 }} />  {/* カテゴリ */}
                <col />                         {/* メモ（伸びる） */}
                <col style={{ width: 140 }} />  {/* 値段（12桁でも被らない） */}
                <col style={{ width: 160 }} />  {/* 操作 */}
              </colgroup>

              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                  <TableCell sx={headCellSx}>種別</TableCell>
                  <TableCell sx={headCellSx}>日付</TableCell>
                  <TableCell sx={headCellSx}>カテゴリ</TableCell>
                  <TableCell sx={headCellSx}>メモ</TableCell>
                  <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>値段</TableCell>
                  <TableCell sx={headCellSx}>操作</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleAccounts.map((a, index) => {
                  const isExpense = a.type === 'EXPENSE'
                  const memo = a.memo ?? ''
                  const amountText = yen(a.amount)

                  return (
                    <TableRow
                      key={getRowKey(a, index)}
                      hover
                      sx={{
                        '& td': { verticalAlign: 'middle' },
                      }}
                    >
                      <TableCell sx={{ ...bodyCellCenterSx }}>
                        <Chip
                          size="small"
                          label={isExpense ? '支出' : '収入'}
                          color={isExpense ? 'error' : 'success'}
                          variant="outlined"
                          sx={{ fontWeight: 900 }}
                        />
                      </TableCell>

                      <TableCell sx={bodyCellCenterSx}>{a.date}</TableCell>

                      <TableCell sx={{ ...bodyCellCenterSx, fontWeight: 800 }}>
                        {a.category}
                      </TableCell>

                      <TableCell
                        sx={{
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          color: 'text.secondary',
                        }}
                        title={memo}
                      >
                        {memo}
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 900,
                        }}
                        title={amountText}
                      >
                        {amountText}
                      </TableCell>

                      <TableCell sx={{ ...bodyCellCenterSx }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button size="small" variant="outlined" onClick={() => onEdit(a)}>
                            編集
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => onDelete(a)}
                          >
                            削除
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}
