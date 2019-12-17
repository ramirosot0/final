module.exports = {

    dashBoard: (req, res) => {
        if (req.session.loggedin){
            let query = 'SELECT DISTINCT id, DATE_FORMAT(date, "%M %d %Y")date, TIME_FORMAT(starttime, \'%h:%i %p\')starttime, duration, bookedby FROM users WHERE date >= CURDATE()';
            // execute query
            db.query(query, (err, result) => {
                if (err) {
                    res.redirect('/');
                    console.log('error in database');
                }
                //console.log(result.length);
                res.render('dashboard.ejs', {
                    title: "Scheduler",
                    meet: result
                });
            });
        }
        else {
            console.log(req.session.loggedin, req.session.username);
            res.redirect('/login');

        }
    },

    addAuthor: (req, res) => {

        let firstName = req.body.nombre;
        let date = req.body.date;
        let start = req.body.starttime;
        let end = req.body.endtime;

        //query to add author in
        console.log('inside post ', date, "name:", firstName, "start:", start, "dura: ", end);
        let query = "INSERT INTO `users` (bookedby, date, starttime, duration) VALUES ('" +
            firstName + "', '" + date + "', '" + start + "', '" + end + "')";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },

    deleteGet: (req, res) => {
        let userid = req.params.id;
        let query = "SELECT DATE_FORMAT(date, \"%M %d %Y\")date, starttime, addtime(starttime,duration) as time, id FROM `users` WHERE id = '" + userid + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            //console.log('result: ', result[0]);
            res.render('delete-meeting.ejs', {
                title: "Delete meeting"
                ,user: result[0]
                ,message: ''
            });
        });
    },

    deletePost: (req, res) => {
        let userId = req.params.id;
        //let getImageQuery = 'SELECT image from `authors` WHERE id = "' + authorId + '"';
        //let deleteUserQuery = 'DELETE FROM authors WHERE id = "' + authorId + '"';
        let query = "DELETE FROM `users` WHERE id = '" + userId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    }
};