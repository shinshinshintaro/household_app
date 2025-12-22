import { useEffect, useState } from 'react'

const toSafeNumber = (v: string): number | null => {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  if (n < 0) return null
  // 円なので小数はNG（必要ならここ変えれる）
  if (!Number.isInteger(n)) return null
  return n
}

export const useTargetSavings = (storageKey: string) => {
  const [target, setTarget] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return 0
      const n = Number(raw)
      return Number.isFinite(n) ? n : 0
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
    const n = toSafeNumber(input)
    if (n === null) {
      alert('目標貯金額は 0以上の整数（円）で入力してください')
      return false
    }
    setTarget(n)
    return true
  }

  return { target, setTarget, saveTargetFromInput }
}
