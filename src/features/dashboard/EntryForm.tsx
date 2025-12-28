import type { Dispatch, SetStateAction } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { Draft } from '../../types/Draft'

type Props = {
  draft: Draft
  setDraft: Dispatch<SetStateAction<Draft>>
  categories: readonly string[]

  editing: boolean
  onSubmit: () => void
  onCancelEdit: () => void

  expenseCategories: readonly string[]
  incomeCategories: readonly string[]
}

const MEMO_MAX = 10

export const hoverLift = {
  transition: 'transform 160ms ease, box-shadow 160ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 6,
  },
}

export function EntryForm({
  draft,
  setDraft,
  categories,
  editing,
  onSubmit,
  onCancelEdit,
  expenseCategories,
  incomeCategories,
}: Props) {
  return (
    <Card variant="outlined" sx={hoverLift}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={800}>
            入力フォーム
          </Typography>
        }
        action={editing ? <Chip color="warning" label="編集モード" /> : null}
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="日付"
              type="date"
              value={draft.date}
              onChange={e => setDraft(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>種別</InputLabel>
              <Select
                label="種別"
                value={draft.type}
                onChange={e => {
                  const nextType = e.target.value as Draft['type']
                  const nextCategory =
                    nextType === 'EXPENSE'
                      ? expenseCategories[0]
                      : incomeCategories[0]
                  setDraft(prev => ({
                    ...prev,
                    type: nextType,
                    category: nextCategory,
                  }))
                }}
              >
                <MenuItem value="EXPENSE">支出</MenuItem>
                <MenuItem value="INCOME">収入</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                label="カテゴリ"
                value={draft.category}
                onChange={e =>
                  setDraft(prev => ({ ...prev, category: String(e.target.value) }))
                }
              >
                {categories.map(c => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="金額（9桁まで）"
              placeholder="例: 1200"
              inputMode="numeric"
              value={draft.amount}
              onChange={e =>
                setDraft(prev => ({ ...prev, amount: e.target.value }))
              }
              fullWidth
            />
          </Stack>

          <TextField
            error={draft.memo.length > 10}
            helperText={draft.memo.length > 10 ? `メモは${MEMO_MAX}文字以内で入力してください` : ''}
            label={`メモ（${MEMO_MAX}文字以内）`}
            value={draft.memo}
            onChange={e =>
              setDraft(prev => ({ ...prev, memo: e.target.value }))
            }
            slotProps={{
              htmlInput: {
                maxLength: MEMO_MAX,
              },
            }}
            fullWidth
          />

          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={onSubmit}>
              {editing ? '更新' : '追加'}
            </Button>

            {editing ? (
              <Button variant="outlined" onClick={onCancelEdit}>
                編集解除
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
