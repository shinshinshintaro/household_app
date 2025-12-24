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
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Typography,
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
    <Card variant="outlined">
      <CardHeader title={`家計簿一覧（${modeLabel} / ${periodLabel}）`} />

      <CardContent>
        <Stack spacing={2}>
          {/* Filters */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
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

            <FormControl fullWidth>
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

            <FormControl fullWidth>
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

          <Divider />

          {/* List */}
          {visibleAccounts.length === 0 ? (
            <Box sx={{ py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                データがありません
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {visibleAccounts.map((a, index) => {
                const isExpense = a.type === 'EXPENSE'
                return (
                  <Box key={getRowKey(a, index)}>
                    <ListItem
                      disableGutters
                      sx={{
                        py: 1.5,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Left */}
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            size="small"
                            label={isExpense ? '支出' : '収入'}
                            color={isExpense ? 'error' : 'success'}
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {a.date}
                          </Typography>
                        </Stack>

                        <Typography variant="subtitle1" sx={{ mt: 0.5 }} noWrap>
                          {a.category}
                        </Typography>

                        {a.memo ? (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            メモ: {a.memo}
                          </Typography>
                        ) : null}
                      </Box>

                      {/* Right */}
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography variant="h6">
                          ¥{a.amount.toLocaleString()}
                        </Typography>

                        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 0.5 }}>
                          <Button size="small" variant="outlined" onClick={() => onEdit(a)}>
                            編集
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => onDelete(a)}>
                            削除
                          </Button>
                        </Stack>
                      </Box>
                    </ListItem>
                    {index !== visibleAccounts.length - 1 ? <Divider /> : null}
                  </Box>
                )
              })}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
