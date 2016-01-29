var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/nodetest';

/* GET home page. */
router.get('/', function (req, res, next) {
    var status = req.param('status');
    if(typeof status !== 'undefined'){
        if(status == "1"){
            res.render('index', {title: 'VN-CMS', status: "Sai tên đăng nhập hoặc mật khẩu"});
        }
    }else{
        res.render('index', {title: 'VN-CMS'});
    }
});

router.get('/index.htm', function (req, res, next) {
    res.render('index', {title: 'VN-CMS'});
});

router.get('/loginsuccess.htm', function (req, res, next) {
    res.render('login-success');
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

router.post('/login', function (req, res, next) {
    var results = [];
    var username = req.body.username;
    var password = req.body.password;
    //var username = req.param('username');
    //var password = req.param('password');
    // Get a Postgres clielnt from the connection pool
    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM public.fn_login(($1), ($2))", [username, password]);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();
            if(results.length > 0){
                return res.redirect('/loginsuccess.htm');
            }else{
                return res.redirect('/?status=1');
            }
        });

    });
});
module.exports = router;
