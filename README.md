# フィルタリングが強いニュースサイト
LLMで遊ぶネタとして、トピックなどを推論してもらってそれ使ってフィルタリングするサイトを作る。

https://clean-news-pied.vercel.app/login


## ツール
- firebase CLI
- gcloud CLI

## firebase setup

```
firebase login
gcloud init
```

## セキュリティルール適用

```
firebase deploy --only firestore:rules
```

## 構成
```mermaid

graph TD;
    User --> WebUI

    subgraph Firebase
        Firestore --> Authentication
    end
    subgraph Vercel
        WebUI -->|記事取得・フィルタ設定保存 LocalStorageにキャッシュ| Firestore
        WebUI --> Authentication
    end
    subgraph Home Server
        cron -->|1日3回実行| Batch
        Batch -->|推論結果保存&古いデータクリーンアップ| Firestore
    end

    Batch -->|記事トピック推論| OpenAI
```

