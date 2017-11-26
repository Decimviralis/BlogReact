let AddPost = React.createClass ({
   componentDidMount: function () {
       ReactDOM.findDOMNode(this.refs.subject).focus();
   },
   onBtnClickHandler: function (e) {
       e.preventDefault();
       let author = ReactDOM.findDOMNode(this.refs.subject).value;
       let text = ReactDOM.findDOMNode(this.refs.text).value;
       alert(author+", Ваш блог обновлен!")
   },
   onCheckRuleClick: function(e) {
       ReactDOM.findDOMNode(this.refs.alert_button).disabled = !e.target.checked;
   },
   render: function() {
       return (
           <form className="add-blog">
               <input
                   className="add-subject"
                   defaultValue=""
                   ref="subject"
                   placeholder="Тема сообщения"
               />
               <textarea
                   className="add-text"
                   defaultValue=""
                   placeholder="Текст сообщения"
                   ref="text"
                   cols="30" rows="10">
               </textarea>
               <label className="checkRule">
                   <input type="checkbox" defaultChecked={false}
                   ref="checkRule" onChange={this.onCheckRuleClick}/> Я согласен с правилами
               </label>
               <button onClick={this.onBtnClickHandler}
                    ref='alert_button'
                    className="add-btn"
                    disabled>
                    Отправить сообщение
               </button>
           </form>
       )
   }

});

let PageHead = React.createClass ({
    render: function () {
        return(
            <ul className="menu">
                <li><a href="">Home</a></li>
                <li><a href="#msgs">Messages</a></li>
                <li><a href="">Здарова</a></li>
                <li><a href="#">Contact us</a></li>
            </ul>
        )
    }
});

let App = React.createClass({
    render: function() {
        return (
            <div className="app">
                    <PageHead/>

                <div className="post-adding">
                    <AddPost/>
                </div>
                <div className="post-body">

                </div>
            </div>
        )
    ;
    }
});

ReactDOM.render(
<App />,
    document.getElementById('root')
);