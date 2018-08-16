const nodemailer = require('nodemailer');

module.exports = function (app) {

    app.get('/', function (req, res) {
        let sql = 'SELECT * FROM navigation WHERE active = 1 ORDER BY nav_order ASC LIMIT 5';
        db.query(sql, function (err, result) {
            res.render('pages/index', {
                navPages: result,
            });
        })
    }); // GET index

    app.get('/testpage', function (req, res) {
        let sql = 'SELECT * FROM navigation WHERE active = 1 ORDER BY nav_order ASC LIMIT 5';
        db.query(sql, function (err, result) {
            res.render('pages/testpage', {
                navPages: result,
            });
        })
    }); // GET test page

    app.post('/login', function (req, res) {
        let username = req.body.username; // post username
        let password = req.body.password; // post password hashed
        let token = req.body.token; // post token
        let unix = req.body.unix; // post unix
        let loginUsernameSql = 'SELECT * from cms_user WHERE username = ? AND active = 1 LIMIT 1'; // check for username sql
        let loginPasswordSql = 'SELECT * from cms_user WHERE username = ? AND password = ? LIMIT 1'; // check for password sql
        let insertTokenSql = `INSERT INTO login_token VALUES (null, ?, ?, ?)`; // insert token in db sql
        let removeTokenSql = `DELETE FROM login_token WHERE user_id = ?`; // remove token in db sql
        if(username.length >= 5) { // username longer than 5 characters
            db.query(loginUsernameSql, [username], function (err, result) { // check in db for user
                if(err) { // error
                    res.send(`{"message":"error", "error":"${err}"}`);     
                } else { // no error
                    if(result.length == 1) { // user found in db by username
                        if(password.length >= 5) {
                            db.query(loginPasswordSql, [username, password], function (err, resultUser) {
                                if(resultUser.length == 1) { // user found in db by username and password
                                    db.query(removeTokenSql, [resultUser[0].id], function (err, result) { // remove all token by user id
                                        if(err) { // error
                                            res.send(`{"message":"error", "error":"${err}"}`);
                                        } else { // no error
                                            db.query(insertTokenSql, [token, unix, resultUser[0].id], function (err, result) { // insert token in db
                                                if(err) { // error
                                                    res.send(`{"message":"error", "error":"${err}"}`);
                                                } else { // no error
                                                    res.send(`{"message":"userLoggedIn","token":"${token}"}`); // return token
                                                }
                                            })
                                        }
                                    })
                                } else { // no matching username and password in db
                                    res.send(`{"message":"noMatchPassword"}`); 
                                }
                            }) 
                        } else { // password shorter than 5 characters
                            res.send(`{"message":"shortPassword"}`);
                        }
                    } else { // no matching username in db
                        res.send(`{"message":"noMatchUsername"}`); 
                    }
                }
            })
        } else { // username shorter than 5 characters
            res.send(`{"message":"shortUsername"}`);
        }
    }); // POST login

    app.get('/token/:id', function (req, res) {
        let checkTokenSql = `SELECT user_id FROM login_token WHERE token = ? LIMIT 1`; // check for token in db sql
        db.query(checkTokenSql, [req.params.id], function (err, result) { // check for token in db
            if(err) { // error
                res.send(`{"message":"error", "error":"${err}"}`);
            } else { // no error
                if(result.length == 1) { // token found in db
                    res.send(`{"message":"match", "userId":"${result[0].user_id}"}`); // return message and user id
                } else { // token not found in db
                    res.send(`{"message":"noMatch"}`);
                }
            }
        })
    }); // GET token

    app.get('/cms', function (req, res) {
        let allUserSql = `SELECT * FROM cms_user ORDER BY id ASC`;
        db.query(allUserSql, function (err, result) {
            if(err) {
                res.send(`{"message":"error", "error":"${err}"}`);
            } else {
                res.render('pages/cmspanel', {
                    allUsers: result
                });
            }
        })
    }); // GET login

    app.delete('/user/remove', function (req, res) {
        let removeUserSql = `DELETE FROM cms_user WHERE id = ?`;
        db.query(removeUserSql, [req.body.userId], function (err) {
            if(err) {
                res.send(`{"message":"error", "error":"${err}"}`);
            } else {
                res.send(`{"message":"userRemoved"}`);
            }
        })
    }); // DELETE user remove

    app.get('/login', function (req, res) {
        res.render('pages/login');
    }); // GET login

    app.post('/post', function (req, res) {
        let data = req.body.data;
        res.send(data);
    }); // POST test

    app.delete('/delete', function (req, res) {
        let data = req.body.data;
        res.send(data);
    }); // DELETE test

    app.put('/put', function (req, res) {
        let data = req.body.data;
        res.send(data);

    }); // PUT test

    // app.post('/cms/login', function (req, res) {
    //     let username = req.body.username;
    //     let password = req.body.password;
    //     let token = req.body.token;
    //     let unix = req.body.unix;
    //     let sqlFindUser = 'SELECT * FROM cms_user WHERE username = ? AND password = ? LIMIT 1';
    //     let sqlInsertToken = `INSERT INTO login_token VALUES ('', ?, ?, ?)`;
    //     let sqlDeleteToken = `DELETE FROM login_token WHERE user_id = ?`;
    //     db.query(sqlFindUser, [username, password], function (err, cmsUserResult) {
    //         db.query(sqlDeleteToken, [cmsUserResult[0].id], function (err, deleteTokenResult) {
    //             if(!err) {
    //                 if(cmsUserResult.length == 1) {
    //                     db.query(sqlInsertToken, [cmsUserResult[0].id, token, unix], function (err, tokenResult) {
    //                         if(!err) {
    //                             res.send(`{"message":"success"}`);
    //                         }
    //                     });
    //                 } else {
    //                     res.send(`{"message":"no match"}`);
    //                 }
    //             }
    //         });
    //     });
    // }); // POST cms login

};

function newsletterMail(mailto, message, subject = 'subject') {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gamerfreaq@gmail.com',
            pass: 'S8J-qpB-d8x-LBW'
        }
    });

    var mailOptions = {
        from: 'kulturhuset@mail.com',
        to: mailto,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}