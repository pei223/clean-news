# フィルタリングが強いニュースサイトのバッチ処理
LLMでトピックとか推論してDBに保存するバッチ処理。

## setup
```
poetry install
# .env.sampleから.envを作成して編集
source .env
```

## テスト実行
```
poetry run python3 src/run_scrape_and_predict.py
```

## やることメモ
TODO
- トピックに必要な文字数を計測して、削れるように修正
- firestore連携
- バッチ処理の考え方