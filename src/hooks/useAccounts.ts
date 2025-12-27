import { useEffect, useState } from 'react'
import type { Account } from '../types/Account'
import type { Draft } from '../types/Draft'
import { getSafeId } from '../selectors/accountSelectors'

const parseAccounts = (raw: string | null): Account[] => {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Account[]) : []
  } catch {
    return []
  }
}

// 金額バリデーション（整数のみ & 上限）
const MAX_YEN = 999_999_999 // 9桁

const parseAmount = (amount: string): number | null => {
  const raw = amount.trim().replace(/,/g, '')
  if (!/^\d+$/.test(raw)) return null
  if (raw.length > 9) return null

  const n = BigInt(raw)
  if (n <= 0n) return null
  if (n > BigInt(MAX_YEN)) return null

  return Number(n)
}

// メモバリデーション（共通）
const MEMO_MAX = 10

const validateMemo = (memo: string) => {
  if (memo.length > MEMO_MAX) {
    alert(`メモは${MEMO_MAX}文字以内で入力してください`)
    return false
  }
  return true
}

export const useAccounts = (storageKey: string) => {
  const [accounts, setAccounts] = useState<Account[]>(
    () => parseAccounts(localStorage.getItem(storageKey)),
  )

  // localStorage へ永続化
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(accounts))
    } catch {
      // 保存失敗してもアプリは落とさない（端末容量/制限など）
    }
  }, [accounts, storageKey])

  const addAccount = (draft: Draft) => {
    if (!validateMemo(draft.memo)) return

    const amountNum = parseAmount(draft.amount)
    if (amountNum === null) {
      alert('金額は「1円以上の整数」で、最大9桁まで入力できます（小数は不可）')
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
    if (!validateMemo(draft.memo)) return

    const amountNum = parseAmount(draft.amount)
    if (amountNum === null) {
      alert('金額は「1円以上の整数」で、最大9桁まで入力できます（小数は不可）')
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
