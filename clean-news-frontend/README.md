# フィルタリングが強いニュースサイトのフロントエンド
## ツール
- node.js/npm
- gcloud CLI
- sops
    - https://github.com/getsops/sops?tab=readme-ov-file#23encrypting-using-gcp-kms

## setup
```
$ npm i
$ sops -d .dev.enc.env > .env 
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
