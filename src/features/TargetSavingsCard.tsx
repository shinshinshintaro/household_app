import { useEffect, useMemo, useState } from 'react'

type Props = {
  initialValue: number
  onSave: (input: string) => boolean
}

export const TargetSavingsCard = ({ initialValue, onSave }: Props) => {
  const [input, setInput] = useState(String(initialValue))

  // 親の値が変わったら入力欄も追従
  useEffect(() => {
    setInput(String(initialValue))
  }, [initialValue])

  const isDirty = useMemo(
    () => input.trim() !== String(initialValue),
    [input, initialValue],
  )

  return (
    <section className="card">
      <h2>今月の目標貯金額</h2>

      <div className="field">
        <label>今月の目標貯金額（円）</label>
        <input className="input" value={input} onChange={e => setInput(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          className="button"
          disabled={!isDirty}
          onClick={() => {
            const ok = onSave(input)
            if (ok) alert('目標貯金額を保存しました')
          }}
        >
          追加 / 保存
        </button>

        <button
          className="button buttonGhost"
          disabled={!isDirty}
          onClick={() => setInput(String(initialValue))}
        >
          元に戻す
        </button>
      </div>

      <p className="subText">※「月次サマリ」に反映されます</p>
    </section>
  )
}
