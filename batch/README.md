# フィルタリングが強いニュースサイトのバッチ処理
LLMでトピックとか推論してDBに保存するバッチ処理。
今の所1日4回くらいで回す予定。

## ツール
- python3/poetry
- gcloud CLI
- sops
    - https://github.com/getsops/sops?tab=readme-ov-file#23encrypting-using-gcp-kms

## setup
```
sops -d src/clean-news-dev-firebase-adminsdk.enc.json > src/clean-news-dev-firebase-adminsdk.json 

poetry install
# .env.sampleから.envを作成して編集
source .env
```

## バッチ処理実行
```
poetry run python3 src/main.py
```

## バッチ処理cron設定
```
./set-cron.sh
```

## テスト実行
```
poetry run python3 src/run_scrape_and_predict.py
```


## データ全削除
```
poetry run python3 src/cleandata.py
```
