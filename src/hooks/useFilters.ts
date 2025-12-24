// src/hooks/useFilters.ts
import { useEffect, useRef, useState } from 'react'
import type { MonthKey, SortKey, ViewMode } from '../selectors/accountSelectors'

export const useFilters = (draftDate: string) => {
  // 「初回レンダー時の月」を保持（render中に .current を読まない）
  const initialMonthRef = useRef<string>(draftDate.slice(0, 7))

  const [viewMode, setViewMode] = useState<ViewMode>('BALANCE')
  const [monthKey, setMonthKey] = useState<MonthKey>(() => draftDate.slice(0, 7))
  const [sortKey, setSortKey] = useState<SortKey>('date-desc')

  useEffect(() => {
    const nextMonth = draftDate.slice(0, 7)

    // 「初期値のままなら追従」：ユーザーが手で選んだ後は維持
    setMonthKey(prev => (prev === initialMonthRef.current ? nextMonth : prev))
  }, [draftDate])

  return { viewMode, setViewMode, monthKey, setMonthKey, sortKey, setSortKey }
}
