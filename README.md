# T5モデルにおける日本語要約の実装
### アプリの概要
こちらのアプリはtransformersにあるT5を日本語要約モデルとして構築し、そのモデルを用いて、入力された長文を要約して返す。

## 実装環境

実装環境は以下のようになっています。
- T5_front

>1. react→v18.2.0

>2. axios→v1.1.3

- T5model_back/T5_japanese_model

>1. python→v3.10.7

>2. pip→v22.3

>3. protobuf →v3.20.0

>4. sentencepiece→0.1.97

>5. Flask→2.2.2

>6. Flask-Cors→3.0.10

>7. transformers→4.22.2

>8. torch→1.12.1

>9. protoc-wheel-0→3.14.0

- T5model_back/T5-japanese

>Google Colaboratory上で実施

>python→3.7.15

>matplotlib→3.2.2

## アプリの実装

アプリの実装方法

ローカル環境で実装する環境を整え、下記のように行う

- T5model_back/T5_japanese_modelの実装

1. ターミナルでT5model_backディレクトリまで移動する。

2. ターミナルで `python T5model_japanese_model.py`で実行する。

3. ターミナルでPINが表示される。

-  T5_frontでの実装する。

1. ターミナルでT5_frontディレクトリまで移動する。

2. ターミナルで`npm start`で実行する。

3. `webpack compiled successfully`と表示される。

## T5モデルの概要

Text-to-Text Transfer Transformerの略称です。分類、翻訳、要約といった様々な自然言語処理タスクを“Text-to-Text”で解くモデルである。
T5 は Transfomerの技術をベースにモデルの構成、事前学習の目的関数、事前学習のデータセット、学習方法、モデルのサイズなど様々パターンについて比較検証し GLUE,SuperGLUEで当時のSOTAを達成した。

　T5での埋め込み表現で(絶対)位置エンコーディングを使用しません。主に(相対)位置エンコーディングで学習を行い、これをsoftmaxの直前でSelf-Attentionと加算する。

　T5の構成はEncorder,Decorderになり、Encorder部分はBERTの構造となる。

引用：
- はじめての自然言語処理　第7回 T5 によるテキスト生成の検証

https://www.ogis-ri.co.jp/otc/hiroba/technical/similar-document-search/part7.html

- Transformerにおける相対位置エンコーディングを理解する。

https://qiita.com/masaki_kitayama/items/01a214c07b2efa8aed1b

- 日本語T5事前学習済みモデルのgithub

https://github.com/sonoisa/t5-japanese

## ファインチューニングでのパラメータ

- 学習データ
livedoorのデータをスクレイピングし、450行分のデータで学習を行った。

- モデル：sonoisa/t5-base-japanese

　　 ※sonoisaさんが作成した日本語T5モデル

-  エポック：10
- 学習データのバッチサイズ：４
- 検証データのバッチサイズ：４
- パラメータ数：222882048

## 結果指標

- eval_rouge1=11.7699
- eval_rouge2=3.5398
- eval_rougeL=11.3274

## 改善策

1.データの質と量の向上

→使用したデータはスクレイピングでlivedoorから取得したデータのうち最初3行の文を要約(summary)とし、残りを詳細文のデータ(text)として使用した。改善としてlivedoorの記事の表題を要約にし、スクレイピングでlivedoorから取得したデータを詳細文のデータ(text)としてすれば、より簡潔で内容に沿ったものが得られると考えられる。また、より多方面の分野のデータを学習させることで未知の単語を減らせると考えられる。

機械学習用の文章要約データセット
https://book.st-hakky.com/docs/text-summary-data-set/


2.モデルの変更

→要約の内容としては抽出型モデル、抽象型モデルで特徴が変わってくるのでその点を考慮して、Bertsum,GPT-2,PEGASUSモデルなどで比較検証を行う必要がある。本日使用したT5-baseは抽象型モデルに当たるため、PEGASUS,BERTなどが良いと考えられる。

3.アンサンブル学習の検証

→はじめての自然言語処理 第7回 T5 によるテキスト生成の検証の記事で要約の指標(CNNDM)においてはベースラインのモデルを4つ個別に事前学習+ファインチューニングしてアンサンブルしたほうが最も性能が良いとありました。英語での傾向になりますが、検討の余地はあると考えられます。

4.パラメータ数の変更

→はじめての自然言語処理 第7回 T5 によるテキスト生成の検証の記事でベースラインの4倍のパラメータ数のモデルでステップ数をそのままでの学習はベースラインのモデルを4つ個別に事前学習+ファインチューニングしてアンサンブルした学習の次に最も良い性能を発揮しているので、パラメータ数を増やせばより良い性能が得られると考えられる。

5.トークナイザの変更

→トークン学習において英文の要約の場合、全てのデータセットを１度で学習させるバッチ学習が最も性能がよく出たことが結果として出ているため、検討の余地はあると考えられる。
