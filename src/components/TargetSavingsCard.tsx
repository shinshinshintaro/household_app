import { useEffect, useState } from 'react'

type Props = {
  target: number
  onSave: (input: string) => boolean
}

export const TargetSavingsCard = ({ target, onSave }: Props) => {
  const [input, setInput] = useState(String(target))

  // target が外部更新されたら入力欄も追従
  useEffect(() => {
    setInput(String(target))
  }, [target])

  return (
    <div className="card">
      <h2>目標貯金額</h2>

      <div className="subText" style={{ marginBottom: 8 }}>
        目標貯金額（円）
      </div>

      <input
        className="input"
        value={input}
        onChange={e => setInput(e.target.value)}
        inputMode="numeric"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          className="button"
          type="button"
          onClick={() => {
            const ok = onSave(input)
            if (ok) alert('目標貯金額を保存しました')
          }}
        >
          追加 / 保存
        </button>

        <button
          className="button buttonGhost"
          type="button"
          onClick={() => setInput(String(target))}
        >
          元に戻す
        </button>
      </div>

      <div className="subText" style={{ marginTop: 8 }}>
        ※「月次サマリ」に反映されます
      </div>
    </div>
  )
}
