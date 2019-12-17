const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = {

    logInPage: (req, res) => {
        res.render('login.ejs', {
            title: "Login",

        });
    },


    //DO something to login...
    logInPost: (req, res) =>{

        //let loggedin = false;
        var username = req.body.userr;
        var password = req.body.passwordd;


            let query = 'SELECT * FROM accounts WHERE username = ?';
        db.query(query, [username], (err, result, fields) =>{
            if (err){
                return res.render("login.ejs",{
                    wrong: "wrong"
                });
            }
            if (result.length === 0){
                return res.render("login.ejs",{
                    wrong: "wrong"
                });//
            }
            else {
                // const id = result[0].id;
                const  hash = result[0].password.toString();
                bcrypt.compare(password, hash, function(err, resp) {
                    // res == true
                    //console.log(resp);
                    if (resp === true){
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.redirect('/');
                    }
                    else {
                        res.render("login.ejs",{
                            wrong: "wrong"
                        });
                    }
                });
            }
        });
    },

    RegisterPost: (req, res) =>{
        var username = req.body.userr;
        var password = req.body.passwordd;

        bcrypt.hash(password, saltRounds, function(err, hash) {

            let query = 'INSERT INTO accounts (username, password) VALUES (?, ?)';
            db.query(query, [username, hash], (error, result, fields)=>{
                if (error){
                    throw error;
                }
                res.redirect('/login');
            });

        });
    },

    logOut: (req, res)=>{

        req.session.loggedin = false;
        req.session.destroy();
        res.redirect('/');

        console.log('logged out');

    },



};