import React from "react";
import './App.css';
import axios from 'axios';

//function App() {
export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    text: '',
    summary:'',
    has_text_Error:0,
    hasconnect_check:0};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
  let text_Error_text;

  if(this.state.has_text_Error===2){
    text_Error_text=(
      <p className="text_Error">
        入力して下さい！
      </p>
    );
  }
  else if(this.state.has_text_Error===3){
    text_Error_text=(
      <p className="text_Error">
        日本語の文章を入力してください！
      </p>
    );
  }

    return (
      <div className="App">
        <header className="App-header">
          <h1>入力した文章の要約を行う！</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              <textarea name="text" cols="80" rows="4" maxlength="512" value={this.state.text} onChange={this.handleChange}/>
            </label>
            <br/>
            <input type="submit" value="要約を行う！" />
          </form>
        {text_Error_text}
        {this.connect(this.state.hasconnect_check)}
        <h3>要約結果</h3>
        <div>{this.state.summary}</div>
        </header>
      </div>
    );
  }
  getting_text = (text) => {
    this.detection_text_error(text)
  
    //正常なデータ
    if(this.state.has_text_Error===1){
      
      this.index_request_get(text)
    .then(response => {
      this.setState(
        {summary: response.data.result}
      );
      
    });
    }
    
  };

  index_request_get = async (text) => {
    const response=axios.get('http://127.0.0.1:5000/'+text);
    this.setState({hasconnect_check:1})
    try{
      await response
  }catch(e){
    this.setState({hasconnect_check:2})
    return;
  }finally{
    return response
  }
  };

  handleSubmit = event => {
      this.getting_text(this.state.text)
      event.preventDefault();
  };

  handleChange = event => {
      this.setState({text:event.target.value}); 
  };

  //------------------------------------------textのエラー検知
  detection_text_error(text){
    //textがひらがなを含むかの正規表現
    let regexp = /[\u{3000}-\u{301C}\u{3041}-\u{3093}\u{309B}-\u{309E}]/mu;
    //textが空だった場合
    if(text===''){
      this.setState({has_text_Error:2});
    }
    //textにひらがなが含まれていた場合
    else if(regexp.test(text)){
      this.setState({has_text_Error:1});
    }
    //ひらがなが含まれていない場合e
    else{
      this.setState({has_text_Error:3});
    }
  }

connect(connect_check){

  if(connect_check===2 && this.state.has_text_Error===1){
    return(<div>
      通信エラーが発生しました
    </div>)
  }
  }
}
export default App;
