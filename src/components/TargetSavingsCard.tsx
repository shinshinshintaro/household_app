import { useEffect, useMemo, useState } from 'react'

type Props = {
  initialValue: number
  onSave: (input: string) => boolean
}

export const TargetSavingsCard = ({ initialValue, onSave }: Props) => {
  const [input, setInput] = useState<string>(String(initialValue))

  useEffect(() => {
    setInput(String(initialValue))
  }, [initialValue])

  const isDirty = useMemo(() => input.trim() !== String(initialValue), [input, initialValue])

  return (
    <div className="card">
      <h2>今月の目標貯金額</h2>

      <div className="subText" style={{ marginBottom: 8 }}>
        今月の目標貯金額（円）
      </div>

      <input
        className="input"
        // type="number" にすると指数表記が出たりするので text 推奨
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="例: 300000"
        maxLength={15}
        value={input}
        onChange={e => setInput(e.target.value)}
      />

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

        <button
          className="button buttonGhost"
          disabled={!isDirty}
          onClick={() => setInput(String(initialValue))}
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
