# MaxiCloud

サークル会員向けのPaaSです。

## Deployment

ローカルでの開発にはKindを使用してKubernetesクラスタを構築します。
```bash
./hack/setup.sh
```

Ingress-Nginxをインストールします。
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.15.1/deploy/static/provider/kind/deploy.yaml
```

DockerイメージのビルドとPush
```bash
make docker-build docker-push
```

[環境変数](./config/overlays/dev/README.md)
を設定します


Manifestの適用
```bash
# CRDをクラスタに適用
make install
# Manifestsをクラスタに適用
make deploy
```

Podの状態を確認します。
```bash
kubectl get pods -n maxicloud-system
```

以下の二つがRunningとなっていればOKです。
```bash
NAME                                            READY   STATUS    RESTARTS   AGE
maxicloud-controller-manager-58f846777c-2mlr5   1/1     Running   0          57s
maxicloud-gateway-cfb744f4d-pw6cp               1/1     Running   0          57s
```

変更を反映させるためのコマンド
```bash
# protoを変更したとき
# buf generateを実行するには./dashboardでpnpm installしておく必要があります。
buf generate
# CRDの定義を変更したとき
make generate
# Kubebuilderのマーカを変更したとき
make manifests
```

## GitHub Webhookの受け取り方

smee-clientを使用して、ローカルにWebhookを転送します
```bash
npm install --global smee-client
```
smee.ioにアクセスしてWebhookを受け取るURLを作成してください。

```bash
smee --url <作成したURL> --target http://localtest.me:8080/github/webhook
```
