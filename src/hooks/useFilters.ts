import { useEffect, useRef, useState } from 'react'
import type { MonthKey, SortKey, ViewMode } from '../selectors/accountSelectors'

export const useFilters = (draftDate: string) => {
  // 初回レンダー時点の「入力中の月」
  // → ユーザーが手で期間変更したかどうかを判定するために使う
  const initialMonthRef = useRef(draftDate.slice(0, 7))

  const [viewMode, setViewMode] = useState<ViewMode>('BALANCE')
  const [monthKey, setMonthKey] = useState<MonthKey>(() => draftDate.slice(0, 7))
  const [sortKey, setSortKey] = useState<SortKey>('date-desc')

  useEffect(() => {
    const nextMonth = draftDate.slice(0, 7)

    // “まだ初期値のまま”なら draftDate の月に追従
    // いったんユーザーが月を選んだ後は、勝手に月を動かさない
    setMonthKey(prev => (prev === initialMonthRef.current ? nextMonth : prev))
  }, [draftDate])

  return {
    viewMode,
    setViewMode,
    monthKey,
    setMonthKey,
    sortKey,
    setSortKey,
  }
}
