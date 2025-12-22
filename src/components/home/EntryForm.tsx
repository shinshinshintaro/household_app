import type { Dispatch, SetStateAction } from 'react'

type Draft = {
  date: string
  type: 'INCOME' | 'EXPENSE'
  category: string
  amount: string
  memo: string
}

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
    <div className="card">
      <div className="cardHeader">
        <h2>入力</h2>
        {editing && <span className="editBadge">編集中</span>}
      </div>

      <div className="formRow">
        <div className="field">
          <label>日付</label>
          <input
            className="input"
            type="date"
            value={draft.date}
            onChange={e => setDraft(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div className="field">
          <label>種別</label>
          <select
            className="input"
            value={draft.type}
            onChange={e => {
              const nextType = e.target.value as Draft['type']
              const nextCategory = nextType === 'EXPENSE' ? expenseCategories[0] : incomeCategories[0]
              setDraft(prev => ({ ...prev, type: nextType, category: nextCategory }))
            }}
          >
            <option value="EXPENSE">支出</option>
            <option value="INCOME">収入</option>
          </select>
        </div>

        <div className="field">
          <label>カテゴリ</label>
          <select
            className="input"
            value={draft.category}
            onChange={e => setDraft(prev => ({ ...prev, category: e.target.value }))}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>金額</label>
          <input
            className="input inputShort"
            inputMode="numeric"
            value={draft.amount}
            onChange={e => setDraft(prev => ({ ...prev, amount: e.target.value }))}
          />
        </div>

        <div className="field fieldMemo">
          <label>備考（{MEMO_MAX}文字以内）</label>
          <input
            className="input inputMemo"
            value={draft.memo}
            maxLength={MEMO_MAX}
            onChange={e => setDraft(prev => ({ ...prev, memo: e.target.value }))}
          />
        </div>

        <button className="button" onClick={onSubmit}>
          {editing ? '更新' : '追加'}
        </button>

        {editing && (
          <button className="button buttonGhost" onClick={onCancelEdit}>
            編集解除
          </button>
        )}
      </div>
    </div>
  )
}
