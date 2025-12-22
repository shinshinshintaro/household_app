// src/hooks/useFilters.ts
import { useEffect, useMemo, useRef, useState } from 'react'
import type { MonthKey, SortKey, ViewMode } from '../selectors/accountSelectors'

export const useFilters = (draftDate: string) => {
  const initialMonth = useMemo(() => draftDate.slice(0, 7), [])
  const initialMonthRef = useRef(initialMonth)

  const [viewMode, setViewMode] = useState<ViewMode>('BALANCE')
  const [monthKey, setMonthKey] = useState<MonthKey>(initialMonthRef.current)
  const [sortKey, setSortKey] = useState<SortKey>('date-desc')

  useEffect(() => {
    const nextMonth = draftDate.slice(0, 7)
    setMonthKey(prev => (prev === initialMonthRef.current ? nextMonth : prev))
  }, [draftDate])

  return { viewMode, setViewMode, monthKey, setMonthKey, sortKey, setSortKey }
}
