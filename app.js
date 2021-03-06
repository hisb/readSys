var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var multer = require('multer');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var pageRoutes = require('./routes/pageRoute');

var session = require('express-session');
var app = express();
global.dirname = __dirname;


global.dbHandel = require('./database/dbHandel');

global.db = mongoose.connect("mongodb://localhost:27017/yl",function(err){
    if(err){
        console.log("init mongo connection fail...")
        return ;
    }
});


// 下边这里也加上 use(multer())
app.use(bodyParser.urlencoded({ extended: true }));
/*app.use(multer());*/
app.use(cookieParser());

app.use(session({
    secret: 'kvkenssecret',
    cookie:{
        maxAge: 1000 * 60 * 60 * 24
    },
    resave:false,
    saveUninitialized: true,
}));
app.use(function(req,res,next){
    res.locals.user = req.session.user;   // 从session 获取 user对象
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if(err){ 
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;text-align: center; display: none; border: none; border-top: 2px solid #f3ac2b; background-color: #fff; color: #ea6f5a; font-weight: bold; font-size: 20px">'+err+'</div>';
    }
    next();  //中间件传递
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine("html", require("ejs").__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);  // 即为为路径 / 设置路由
app.use('/home',routes); // 即为为路径 /home 设置路由

app.use('/login',routes); // 即为为路径 /login 设置路由
app.use('/register',routes); // 即为为路径 /register 设置路由
app.use("/logout",routes); // 即为为路径 /logout 设置路由
app.use('/userUpdate',routes); // 即为为路径 /register 设置路由
app.use('/userMyshare',routes); // 即为为路径 /register 设置路由
app.use('/userMyhunger',routes); // 即为为路径 /register 设置路由
app.use('/userInfo',routes); // 即为为路径 /register 设置路由

app.use('/categoryList',routes); // 即为为路径 /register 设置路由
app.use('/categoryMore',routes); // 即为为路径 /register 设置路由

app.use('/bookShare',routes); // 即为为路径 /register 设置路由
app.use('/bookDetail',routes); // 即为为路径 /register 设置路由
app.use('/bookHunger',routes); // 即为为路径 /register 设置路由
app.use('/bookStatus',routes); // 即为为路径 /register 设置路由

app.use('/feelAdd',routes); // 即为为路径 /register 设置路由
app.use('/feelAgree',routes); // 即为为路径 /register 设置路由

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
