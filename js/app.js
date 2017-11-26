'use strict';

let blogPost = [
    {
        subject: 'Hz,',
        message: 'Some Text'
    },
    {
        subject: 'Kek or not kek',
        message: 'Some Text 123'
    },
    {
        subject: 'IDK',
        message: 'Some Text 456'
    }
];

window.ee = new EventEmitter();
//Posts - News, blogPost = my_news, newsTemplate = blogMessage, author = subject, text=message, article = publication, myTestInput = subjectInput, Add = AddPost

let Posts = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    render: function () {
        let data = this.props.data;
        let blogMessage;
        if (data.length > 0) {
            blogMessage = data.map(function(item, index) {
                return (
                    <div key={index}>
                        <Publication data={item} />
                    </div>
                )
            })
        } else {
            blogMessage = <p>К сожалению, постов нет</p>
        }
        return (

            <div className="posts">
                <span className="counter">
                   <strong>Всего постов : {data.length}</strong>
               </span>
                {blogMessage}
            </div>
        );
    }
});

let Publication = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            subject: React.PropTypes.string.isRequired,
            message: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function() {
        return {
            visible: false
        };
    },
    readmoreClick: function(e) {
        e.preventDefault();
        this.setState({visible: true});
    },
    render: function () {
        let subject = this.props.data.subject,
            message = this.props.data.message;
        return (
            <div className="publication">
                <p className="posts_subject">{subject}</p>
                <p className="posts_message">{message}</p>
            </div>
        )
    }
});

let AddPost = React.createClass({
   getInitialState: function() {
       return {
           agreeNotChecked: true,
           authorIsEmpty: true,
           textIsEmpty: true
       };
   },
   componentDidMount: function() { //ставим фокус в input
       ReactDOM.findDOMNode(this.refs.subject).focus();
   },
   onBtnClickHandler: function(e) {
       e.preventDefault();
       let textEl = ReactDOM.findDOMNode(this.refs.message);

       let subject = ReactDOM.findDOMNode(this.refs.subject).value;
       let message = textEl.value;

       let item = [{
           subject: subject,
           message: message,
       }];

       window.ee.emit('Posts.add', item);

       textEl.value = '';
       this.setState({textIsEmpty: true});
   },
   onCheckRuleClick: function(e) {
       this.setState({agreeNotChecked: !this.state.agreeNotChecked});
   },
    onFieldChange: function(fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({[''+fieldName]:false})
        } else {
            this.setState({[''+fieldName]:true})
        }
    },

   render: function () {
       let agreeNotChecked = this.state.agreeNotChecked,
           subjectIsEmpty = this.state.subjectIsEmpty,
           messageIsEmpty = this.state.messageIsEmpty;
       return (
           <form className='add-new-post'>
               <input
                   type='text'
                   className='add-subject'
                   defaultValue=''
                   onChange={this.onFieldChange.bind(this, 'subjectIsEmpty')}
                   placeholder='Тема поста'
                   ref='subject'
               />
               <textarea
                   className='add-message'
                   defaultValue=''
                   placeholder='Текст новости'
                   onChange={this.onFieldChange.bind(this, 'messageIsEmpty')}
                   ref='message'
               ></textarea>
               <label className='add-checkRule'>
                   <input type='checkbox' defaultChecked={false} ref='checkRule' onChange={this.onCheckRuleClick} />Я согласен с правилами
               </label>
               <button
                   className='add-btn'
                   onClick={this.onBtnClickHandler}
                   ref='submit_button'
                   disabled={agreeNotChecked || subjectIsEmpty || messageIsEmpty}
                   >
                   Опубликовать пост
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
    getInitialState: function() {
        return {
            posts: blogPost
        };
    },
    componentDidMount: function() {
        let self = this;
        window.ee.addListener('Posts.add', function(item) {
            let nextPosts = item.concat(self.state.posts);
            self.setState({posts: nextPosts});
        });
    },
    componentWillUnmount: function() {
        window.ee.removeListener('Posts.add');
    },
    render: function() {
        return (
            <div className="app">
                <PageHead/>
                <div className="post-adding">
                <AddPost/>
                </div>
                <div className="all-posts">
                <Posts data={this.state.posts}/>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);