import { useEffect, useState } from 'react'

type Props = {
  initialValue: number
  onSave: (input: string) => boolean
}

export const TargetSavingsCard = ({ initialValue, onSave }: Props) => {
  const [input, setInput] = useState(String(initialValue))

  useEffect(() => {
    setInput(String(initialValue))
  }, [initialValue])

  return (
    <div className="card">
      <h2>目標貯金額</h2>

      <div className="field" style={{ marginTop: 8 }}>
        <label className="subText">目標貯金額（円）</label>
        <input
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          inputMode="numeric"
          placeholder="例: 300000"
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          className="button"
          onClick={() => {
            const ok = onSave(input)
            if (ok) alert('目標貯金額を保存しました')
          }}
        >
          追加 / 保存
        </button>

        <button className="button buttonGhost" onClick={() => setInput(String(initialValue))}>
          元に戻す
        </button>
      </div>

      <div className="subText" style={{ marginTop: 8 }}>
        ※「月次サマリ」に反映されます
      </div>
    </div>
  )
}
