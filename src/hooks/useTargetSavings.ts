import { useEffect, useState } from 'react'

/**
 * 目標貯金額は「0以上の整数（円）」のみ
 * - 指数表記(e/E)・小数・マイナス・カンマ入りは拒否
 * - 桁数制限（最大12桁） + MAX_SAFE_INTEGER 超えは拒否
 */
const toSafeYen = (input: string): number | null => {
  const s = input.trim()

  // 空はNG（保存ボタン押した時に弾く）
  if (s.length === 0) return null

  // 数字のみ（指数表記や小数、カンマ等は全部落とす）
  // 12桁はだいたい「兆〜京」手前くらいまで。必要なら増減OK
  if (!/^\d{1,12}$/.test(s)) return null

  const n = Number(s)
  if (!Number.isFinite(n)) return null
  if (n < 0) return null

  // JSの安全な整数範囲を超えると計算が壊れるので拒否
  if (!Number.isSafeInteger(n)) return null

  return n
}

export const useTargetSavings = (storageKey: string) => {
  const [target, setTarget] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return 0
      const n = Number(raw)
      return Number.isSafeInteger(n) && n >= 0 ? n : 0
    } catch {
      return 0
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(target))
    } catch {
      // ignore
    }
  }, [storageKey, target])

  const saveTargetFromInput = (input: string) => {
    const n = toSafeYen(input)
    if (n === null) {
      alert('目標貯金額は 0以上の整数（数字のみ・最大12桁）で入力してください（例: 300000）')
      return false
    }
    setTarget(n)
    return true
  }

  return { target, saveTargetFromInput }
}
