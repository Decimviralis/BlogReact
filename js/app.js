'use strict';

if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    let mydb = openDatabase("blog_db", "0.1", "A Database of Blog", 1024 * 1024);

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY ASC, subject TEXT, message TEXT)");
    });



} else {
    alert("WebSQL is not supporting by your browser!");
}

// Create the schema


class MessageController {
    constructor() {
        this.messages = []
    }

    addMessage(msg) {
        this.messages = msg.concat(this.messages);

        //key is date (ms); may be we should use another type of key

        let key = Date.now();
        console.log('date is', key);
        localStorage.setItem(key, JSON.stringify(msg));
    }

    retrieveFromStorageDateDesc() {
        let keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }

        keys.sort((one, another) => {
            return parseInt(another) - parseInt(one);
        });
        console.log('keys are', keys);

        let messages = [];

        for (let i = 0; i < keys.length; i++) {
            console.log(keys[i], localStorage.getItem(keys[i]));
            messages.push(JSON.parse(localStorage.getItem(keys[i]))[0])
        }
        return messages;
    }

    getMessages() {
        if (this.messages.length == 0) {
            this.messages = this.retrieveFromStorageDateDesc();
        }
        console.log('getting msgs', this.messages);
        return this.messages;
    }
}

let messageController = new MessageController();


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
            blogMessage = <p>Постов нет</p>
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
    render: function () {
        let subject = this.props.data.subject,
            message = this.props.data.message;
        return (
            <div className="publication">
                <ul className='post-attr'>
                <li>{subject}</li>
                <li>{message}</li>
                </ul>
            </div>
        )
    }
});

open.onsuccess = function() {
    // // Start a new transaction
    // let db = open.result;
    // let tx = db.transaction("MyObjectStore", "readwrite");
    // let store = tx.objectStore("MyObjectStore");
    // let index = store.index("NameIndex");
    //
    // // Add some data
    // store.put({id: 12345, name: {first: {subject}, last: [message]}, age: 42});
    // store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});
    //
    // // Query the data
    // let getJohn = store.get(12345);
    // let getBob = index.get(["Smith", "Bob"]);
    //
    // getJohn.onsuccess = function() {
    //     console.log(getJohn.result.name.first);  // => "John"
    // };
    //
    // getBob.onsuccess = function() {
    //     console.log(getBob.result.name.first);   // => "Bob"
    // };

    // Close the db when the transaction is done

    //DO NOT CLOSE THE CONNECTION

    // tx.oncomplete = function() {
    //     db.close();
    // };
};
/*
function addRecordToDatabase(record, onsuccess, onerror) {
    console.log('adding record to database', JSON.stringify(record));
    let db = open.result;
    let tx = db.transaction("MyObjectStore", "readwrite");
    let store = tx.objectStore("MyObjectStore");
    store.add(record);

    tx.oncomplete = () => {
        console.log('transaction complete');
        onsuccess();
    };

    tx.onerror = (error) => {
        console.log('transaction error', error.target.error)
        onerror();
    };
}

function getRecordFromDatabase(id, result) {
    console.log('seeking for object with id=', id);
    let db = open.result;
    let tx = db.transaction("MyObjectStore", "readwrite");
    let store = tx.objectStore("MyObjectStore");

    let getRecord = store.get(id);

    getRecord.onsuccess = () => {
        result(getRecord.result)
    }
}

//JUST COPYPASTED
function generateUUID() {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c =='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
*/

class testStorage {

    addBlog(first, second) {
        let myDB = openDatabase("blog_db", "0.1", "A Database of Blog", 1024 * 1024);
        if(!myDB) {
            return (
                myDB.transaction(function (t) {
                t.executeSql("INSERT INTO posts (subject, message) VALUES (? ?)", [first, second]);
            })
            )
        }
    }
    outputBlog() {
        let myDB = openDatabase("blog_db", "0.1", "A Database of Blog", 1024 * 1024);
        myDB.transaction(function (t) {
            t.executeSql("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY ASC, subject TEXT, message TEXT)");
        });
        if (myDB) {
            return(
                myDB.transaction(function (t) {
                    t.executeSql("SELECT * FROM posts", []);
                })
            )
        }
    }
}

let test = new testStorage();

let AddPost = React.createClass({

   getInitialState: function() {
       return {
           agreeNotChecked: true,
           subjectIsEmpty: true,
           messageIsEmpty: true
       };
   },
   componentDidMount: function() {
       ReactDOM.findDOMNode(this.refs.subject).focus();
   },
   onBtnClickHandler: function(e) {
       let subject = ReactDOM.findDOMNode(this.refs.subject).value;
       let message = ReactDOM.findDOMNode(this.refs.message).value;
       e.preventDefault();
       console.log('clicked');
       test.addBlog({subject}, {message});
       console.log({subject}, {message});
       console.log(test.outputBlog());
   }
   ,
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
                   <input type='checkbox' defaultChecked={false} ref='checkRule' onChange={this.onCheckRuleClick} /> Я согласен с правилами
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
                <li><a href="">Messages</a></li>
                <li><a href="">Здарова</a></li>
                <li><a href="#">Contact us</a></li>
            </ul>
        )
    }
});


let App = React.createClass({
    getInitialState: function() {
        return {
            posts: messageController.getMessages()
        };
    },
    componentDidMount: function() {
        let self = this;
        window.ee.addListener('Posts.add', function(item) {
            messageController.addMessage(item);
            self.setState({posts: messageController.getMessages()});
        });
    },
    componentWillUnmount: function() {
        window.ee.removeListener('Posts.add');
    },
    render: function() {
        return (
            <div className="app">
                <PageHead/>
                <div className="add-new-post">
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

