## 将来拡張ロードマップ（バックエンド化 → 認証 → DB移行）

この家計簿アプリは、まず **フロント単体（localStorage永続化）** で
「要件→設計→実装→改善（リファクタ）」を完結させることを優先しています。
その上で、将来的に業務っぽい構成へ段階的に拡張できる設計にしています。

### Phase 0（現状）：フロント単体で完結
- Vite + React + TypeScript
- localStorage 永続化
- 収支/収入/支出 切替、期間（今月/他月/全期間）、日付/金額ソート
- グラフ/サマリ（※会社用はシンプル版）
- 型安全（TS）とUI/UX（フィルタ・期間・ソート）を重視

### Phase 1：Spring BootでCRUD API化
- `Account` を REST API として提供（CRUD）
- フロントは localStorage をやめ、APIを叩く構成へ
- 例：GET /accounts, POST /accounts, PUT /accounts/{id}, DELETE /accounts/{id}

### Phase 2：認証（ログイン）追加
- まずはシンプルにログイン導入（セッション or JWT）
- ユーザー単位でデータを分離（自分の家計簿のみ見える）

### Phase 3：DB移行（H2 → PostgreSQL）
- 開発：H2（インメモリ or ファイル）
- 本番想定：PostgreSQL
- Flyway/Liquibase でマイグレーション管理

### Phase 4：品質/運用の強化
- 入力バリデーション強化、E2Eテスト追加
- 例外設計、APIエラーハンドリング、ロギング
- Docker化、CI（GitHub Actions）でビルド/テスト自動化

> ねらい：フロント単体での完成度（UI/UX・型安全・永続化）を担保しつつ、
> 次の一手（API化→認証→DB）を説明できるようにする。
