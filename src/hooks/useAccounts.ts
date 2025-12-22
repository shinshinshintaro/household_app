import { useEffect, useState } from 'react'
import type { Account } from '../types/Account'
import { getSafeId } from '../selectors/accountSelectors'

type Draft = {
  date: string
  type: 'INCOME' | 'EXPENSE'
  category: string
  amount: string
  memo: string
}

const parseAccounts = (raw: string | null): Account[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Account[]) : []
  } catch {
    return []
  }
}

// 例：12桁まで（999,999,999,999円）を許可
const MAX_YEN = 999_999_999_999

const parseAmount = (amount: string): number | null => {
  const raw = amount.trim().replace(/,/g, '')

  // 空 / 小数 / マイナス / 文字 / 指数表記（1e9）を全部弾く
  // 「整数のみ」を強制
  if (!/^\d+$/.test(raw)) return null

  // 先頭ゼロは許可（"0001" -> 1）するならOK
  // 桁数制限をしたい場合（例：12桁まで）
  if (raw.length > 12) return null

  // BigIntで安全に上限チェック
  const n = BigInt(raw)
  if (n <= 0n) return null
  if (n > BigInt(MAX_YEN)) return null

  // numberへ（MAX_YENがMAX_SAFE_INTEGER以下なら安全）
  return Number(n)
}


export const useAccounts = (storageKey: string) => {
  const [accounts, setAccounts] = useState<Account[]>(() => parseAccounts(localStorage.getItem(storageKey)))

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(accounts))
    } catch {
      // 保存失敗しても落とさない
    }
  }, [accounts, storageKey])

  const addAccount = (draft: Draft) => {

    const MEMO_MAX = 10

    const validateMemo = (memo: string) => {
      if (memo.length > MEMO_MAX) {
        alert(`備考は${MEMO_MAX}文字以内で入力してください`)
        return false
      }
      return true
    }

    const amountNum = parseAmount(draft.amount)
    if (amountNum === null) {
      alert('金額は「1円以上の整数」で、最大12桁まで入力できます（小数は不可）')
      return
    }

    const newItem: Account = {
      id: Date.now(),
      date: draft.date,
      type: draft.type,
      category: draft.category,
      amount: amountNum,
      memo: draft.memo || undefined,
    }

    setAccounts(prev => [newItem, ...prev])
    alert(`${newItem.date} ${newItem.category} ¥${newItem.amount.toLocaleString()} を追加しました`)
  }

  const updateAccount = (editingId: number, draft: Draft) => {
    
    const MEMO_MAX = 10

    const validateMemo = (memo: string) => {
      if (memo.length > MEMO_MAX) {
        alert(`備考は${MEMO_MAX}文字以内で入力してください`)
        return false
      }
      return true
    }

    const amountNum = parseAmount(draft.amount)
    if (amountNum === null) {
      alert('金額を正しく入力してください')
      return
    }

    setAccounts(prev =>
      prev.map(a => {
        const id = getSafeId(a)
        if (id !== editingId) return a
        return {
          ...a,
          date: draft.date,
          type: draft.type,
          category: draft.category,
          amount: amountNum,
          memo: draft.memo || undefined,
        }
      }),
    )
    alert('更新しました')
  }

  // Home 側が deleteAccount(a) で呼んでるので、引数は Account のままにする
  const deleteAccount = (a: Account) => {
    const id = getSafeId(a)
    if (id === null) {
      alert('この行はidが無いので削除できません（古いデータの可能性）')
      return
    }
    const ok = confirm(
      `${a.date} ${a.type === 'EXPENSE' ? '支出' : '収入'} ${a.category} ¥${a.amount.toLocaleString()} を削除しますか？`,
    )
    if (!ok) return
    setAccounts(prev => prev.filter(x => getSafeId(x) !== id))
  }

  return { accounts, addAccount, updateAccount, deleteAccount }
}
