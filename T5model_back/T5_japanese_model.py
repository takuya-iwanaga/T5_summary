##学習したT5モデルの実装
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model = AutoModelForSeq2SeqLM.from_pretrained('model/summary_ja')      
tokenizer = AutoTokenizer.from_pretrained('sonoisa/t5-base-japanese') 

##フロントに要約した文を返す通信
from flask import Flask
from flask import make_response, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)

app.config["JSON_AS_ASCII"] = False

CORS(app)

##-------T5-japaneseモデルのAPIを読み込む関数
def T5_ja(input_text):
    text = r''+input_text+''
    ##入力した文は最大512文字までしか受け付けない
    inputs = tokenizer(text, return_tensors="pt", max_length=512,truncation=True)
    #早期終了を有効にし、40～10文字で要約した文を返す
    outputs = model.generate(inputs["input_ids"], max_length=30, min_length=10,num_beams=4, early_stopping=True)
    #辞書型でkeyを'result'にして値に要約した文の結果を入れる
    response={'result':tokenizer.decode(outputs[0], skip_special_tokens=True)}
    #responseをjson形式で返す
    return response

# GETで検索したコメントを解析し、表示する！
@app.route("/<text>")
def SearchView(text):
    ##-------T5モデルとトークナイザで結果を辞書型で返す！
    response=T5_ja(text)
    return make_response(jsonify(response))

if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)