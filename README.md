# MaxiCloud

サークル会員向けのPaaSです。

## Deployment

ローカルでの開発にはKindを使用してKubernetesクラスタを構築します。
```bash
kind create cluster --name maxicloud
```

Manifestの適用
```bash
# CRDをクラスタに適用
make install
# Manifestsをクラスタに適用
make deploy
```

DockerイメージのビルドとKindへのロード
```bash
# Dockerイメージのビルド
make docker-build
# KindにDockerイメージをロード
kind load docker-image maxicloud:latest --name maxicloud
```

変更を反映させるためのコマンド
```bash
# protoを変更したとき
buf generate
# CRDの定義を変更したとき
make generate
# Kubebuilderのマーカを変更したとき
make manifests
```
