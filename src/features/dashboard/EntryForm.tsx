import type { Dispatch, SetStateAction } from 'react'
import type { Draft } from '../../types/Draft'

type Props = {
  draft: Draft
  setDraft: Dispatch<SetStateAction<Draft>>
  categories: readonly string[]

  editing: boolean
  onSubmit: () => void
  onCancelEdit: () => void

  // 種別切り替え時に、先頭カテゴリへ戻すために必要
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
    <section className="panel">
      <h2 className="panelTitle">入力</h2>

      {/* 編集モードの見える化（事故防止） */}
      {editing ? <div className="editingBadge">編集モード</div> : null}

      <div className="formGrid">
        <label className="field">
          <span className="fieldLabel">日付</span>
          <input
            type="date"
            value={draft.date}
            onChange={e => setDraft(prev => ({ ...prev, date: e.target.value }))}
          />
        </label>

        <label className="field">
          <span className="fieldLabel">種別</span>
          <select
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
        </label>

        <label className="field">
          <span className="fieldLabel">カテゴリ</span>
          <select
            value={draft.category}
            onChange={e => setDraft(prev => ({ ...prev, category: e.target.value }))}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="fieldLabel">金額</span>
          <input
            inputMode="numeric"
            placeholder="例: 1200"
            value={draft.amount}
            onChange={e => setDraft(prev => ({ ...prev, amount: e.target.value }))}
          />
        </label>

        <label className="field fieldFull">
          <span className="fieldLabel">備考（{MEMO_MAX}文字以内）</span>
          <input
            value={draft.memo}
            onChange={e => setDraft(prev => ({ ...prev, memo: e.target.value }))}
          />
        </label>

        <div className="formActions">
          <button type="button" onClick={onSubmit}>
            {editing ? '更新' : '追加'}
          </button>

          {editing ? (
            <button type="button" onClick={onCancelEdit}>
              編集解除
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
