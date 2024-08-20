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

## バッチ処理実行
```
poetry run python3 src/main.py
```

## データ全削除
```
poetry run python3 src/cleandata.py
```
