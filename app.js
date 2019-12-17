const express = require('express');
const app = express();

const session = require('express-session');
//const ejsLint = require('ejs-lint');
const port = 1000;

//Enable sessions
app.use(session({
    secret: 'secret',
    path: '/',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

var mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(bodyParser.urlencoded({ extended : true }));

const db  = mysql.createConnection({
    host: 'mcldisu5ppkm29wf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'vp4onqntwtnhnl44',
    password: 'eqgdpotw2735k904',
    database: 'oww96xtpilfl3guz'
});
db.connect((err)=>{
    if (!err)
        console.log('connection succeded.');
    else
        console.log('connection failed' + JSON.stringify(err,undefined,2));
});
global.db = db;
app.use(function(req, res, next) {
    res.locals.loggedin = req.session.loggedin;
    res.locals.username = req.session.username;
    next();
});


//routes
const {dashBoard, addAuthor, deleteGet, deletePost} = require('./routes/dash');
const {logInPage, logInPost, RegisterPost, logOut} = require('./routes/loginroute');

app.get('/login', logInPage);
app.post('/login', logInPost);
app.post('/register', RegisterPost);
app.get('/logOut', logOut);



app.get('/', dashBoard);
app.post('/add', addAuthor);
app.get('/delete/:id', deleteGet);
app.post('/delete/:id', deletePost);




//set the app to listen on the port
// app.listen(port, () => {
//     console.log(`Server running on port: ${port}`);
// });


//heroku listener
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Running Express Server...");
});
