import { useState } from 'react'

type Props = {
  initialValue: number
  onSave: (input: string) => boolean
}

export const TargetSavingsCard = ({ initialValue, onSave }: Props) => {
  const [input, setInput] = useState<string>(String(initialValue))

  return (
    <div className="card">
      <h2>目標貯金額</h2>

      <div className="field" style={{ marginTop: 8 }}>
        <label>目標貯金額（円）</label>
        <input
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          inputMode="numeric"
        />
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <button
          className="button"
          onClick={() => {
            const ok = onSave(input)
            if (ok) alert('目標貯金額を保存しました')
          }}
        >
          保存
        </button>

        <button className="button buttonGhost" onClick={() => setInput(String(initialValue))}>
          元に戻す
        </button>
      </div>

      <div className="subText" style={{ marginTop: 8 }}>
        ※「一覧」のサマリに反映されます
      </div>
    </div>
  )
}
