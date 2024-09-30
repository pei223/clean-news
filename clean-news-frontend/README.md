# フィルタリングが強いニュースサイトのフロントエンド
## setup
```
$ npm i
$ sops -d src/firebase-config.dev.enc.json > src/firebase-config.json 
```

## local server
```
$ npm run dev
```

## build
```
$ npm run build
```

## lint/format
```
$ npm run lint
$ npm run format
```



## やること
- フィルタリング設定永続化
- 環境変数を各環境で変える
  - コマンドで.envコピーするのが手っ取り早そう
