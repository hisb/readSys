var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect("/login");
});

/**
 * 首页
 */
router.get("/home", function (req, res) {
    var categoryM = global.dbHandel.getModel("category");
    categoryM.find().populate("books").exec(function (err, categorys) {
        print(categorys);
        res.render("home", {title: 'Home', datas: categorys});
    });
});


/**
 * 用户相关
 */
/* GET login page. */
router.route("/login").get(function (req, res) {    // 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render("login", {title: 'User Login'});
}).post(function (req, res) {                        // 从此路径检测到post方式则进行post数据的处理操作
    //get User info
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;                //获取post上来的 data数据中 uname的值
    User.findOne({name: uname}, function (err, doc) {   //通过此model以用户名的条件 查询数据库中的匹配信息
        console.log(doc);
        if (err) {                                         //错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        } else if (!doc) {                               //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '用户名不存在';
            res.send(404);                            //    状态码返回404
            //    res.redirect("/login");
        } else {
            if (req.body.upwd != doc.password) {     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = "密码错误";
                res.send(404);
                //    res.redirect("/login");
            } else {                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = doc;
                res.send(200);
                //    res.redirect("/home");
            }
        }
    });
});

router.get("/logout", function (req, res) {
    sessionClear(req, res);
})

function sessionClear(req, res) {
    req.session.user = null;
    res.redirect("/home");
}

/* GET register page. */
router.route("/register").get(function (req, res) {    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("register", {title: 'User register'});
}).post(function (req, res) {
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;
    User.findOne({name: uname}, function (err, doc) {   // 同理 /login 路径的处理方式
        if (err) {
            res.send(500);
            req.session.error = '网络异常错误！';
            console.log(err);
        } else if (doc) {
            req.session.error = '用户名已存在！';
            res.send(500);
        } else {
            User.create({                             // 创建一组user对象置入model
                name: uname,
                password: req.body.upwd,
                nick: req.body.nick,
                email: req.body.email,
                phone: req.body.phone,
                adress: req.body.adress,
                selfdesc: req.body.selfdesc,
                cdate: Date.now(),
                udate: Date.now()
            }, function (err, doc) {
                if (err) {
                    res.send(500);
                    console.log(err);
                } else {
                    req.session.error = '用户名创建成功！';
                    res.send(200);
                }
            });
        }
    });
});
//修改用户信息
router.route("/userUpdate").get(function (req, res) {
    var userId = sessionUserId(req, res);
    User.findById(userId, function (err, doc) {  //先把用户原有的信息填写到旧的表格
        res.render("update", {title: 'User update', data: doc});
    })
}).post(function (req, res) {
    var User = global.dbHandel.getModel('user');
    var userId = sessionUserId(req, res);
    User.findById(userId, function (err, doc) {
        if (err) {
            res.send(500);
            req.session.error = '网络异常错误！';
            console.log(err);
        } else {
            doc.update({
                password: req.body.upwd,
                nick: req.body.nick,
                email: req.body.email,
                phone: req.body.phone,
                adress: req.body.adress,
                selfdesc: req.body.selfdesc,
                udate: Date.now()
            }, function (err, doc) {
                if (err) {
                    res.send(500);
                    console.log(err);
                } else {
                    req.session.error = '用户修改成功！';
                    res.send(200);
                }
            });
        }
    });
});


//我分享的书列表
router.get("/userMyshare", function (req, res) {
    var userId = sessionUserId(req, res);
    var user = global.dbHandel.getModel("user");
    user.findById(userId).populate("shareds").exec(function (err, doc) {
        print(doc)
        //res.render("myshare", {title: "myshare", data: doc})
        res.send(doc)
    });
})

//我参与排队的书列表
router.get("/userMyhunger", function (req, res) {
    var userId = sessionUserId(req, res);
    var user = global.dbHandel.getModel("user");
    user.findById(userId).populate("hungers").exec(function (err, doc) {
        print(doc)
        res.send(doc);
    });
})

/**
 * 目录相关
 */
//书目录列表
router.get("/categoryList", function (req, res) {
    var categoryM = global.dbHandel.getModel("category");
    categoryM.find(function (err, docs) {
        res.send(JSON.stringify(docs));
    });
})

//一个目录下书的列表
router.get("/categoryMore", function (req, res) {
    var categoryM = global.dbHandel.getModel("category");
    categoryM.findById(req.query.categoryid).populate("books").exec(function (err, categorys) {
        print(categorys);
        res.render("more", {title: 'more', datas: categorys});
    });
});

/**
 * 书籍相关
 */
//分享书籍(添加)
router.route("/bookShare").get(function () {
    res.render("share", {title: "share"});
}).post(function (req, res) {
    var userId = sessionUserId(req, res);
    var book = {
        title: req.body.title,
        author: req.body.author,
        desc: req.body.desc,
        imgSrc: req.body.imgSrc,
        cdate: Date.now(),
        udate: Date.now(),
        status: 0,
        owner: userId,
        categoryId: req.body.categoryId
    };
    var bookM = global.dbHandel.getModel("book");
    bookM.create(book, function (err, bookdoc) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            var category = global.dbHandel.getModel("category");
            category.findById(req.body.categoryId, function (err, categorydoc) {
                categorydoc.books.push(bookdoc._id);
                categorydoc.save(function (err) {
                    printStr("add book to category  ok");
                })
            });
            var user = global.dbHandel.getModel("user");
            user.findById(userId).exec(function (err, userdoc) {
                userdoc.shareds.push(bookdoc._id);
                userdoc.save();
            });
            printStr("add book ok....");
            res.redirect("/book/detail/" + bookdoc._id);
        }
    })
});

//修改
router.route("/bookUpdate").get(function () {
    var bookM = global.dbHandel.getModel("book");
    bookM.findById(req.query.bookid, function (err, bookdoc) {
        res.render("share", {title: "share", datas: bookdoc});
    })
}).post(function (req, res) {
    var userId = sessionUserId(req, res);
    var book = {
        title: req.body.title,
        author: req.body.author,
        desc: req.body.desc,
        imgSrc: req.body.imgSrc,
        cdate: Date.now(),
        udate: Date.now(),
        status: 0,
        owner: userId,
        categoryId: req.body.categoryId
    };
    var bookM = global.dbHandel.getModel("book");
    bookM.updateOne({_id: req.query.bookid}, book, function (err, bookdoc) {
        if (err) {
            res.send(500);
            req.session.error = '网络异常错误！';
            console.log(err);
        } else {
            printStr("书籍信息修改成功")
            res.redirect("/book/detail/" + req.query.bookid);
        }
    })
});


//书详情
router.route("/bookDetail").get(function (req, res) {
    var bookM = global.dbHandel.getModel("book");
    bookM.findById(req.query.bookid).populate("feels").populate("hungers").exec(function (err, bookdoc) {
        var user = global.dbHandel.getModel("user");
        user.findById(bookdoc.owner,function(err,userdoc){
            bookdoc.owner = userdoc.name;
            print(bookdoc)
            res.render("detail", {title: 'detail', datas: bookdoc});
        })

    });
});
//参与排队看书
router.get("/bookHunger", function (req, res) {
    var userId = sessionUserId(req, res);
    var bookM = global.dbHandel.getModel("book");
    bookM.findById(req.query.bookid, function (err, bookdoc) {
        bookdoc.hungers.push(userId);
        bookdoc.save(function (err) {
            if (err)
                printStr(err);
        })
        var user = global.dbHandel.getModel("user");
        user.findById(userId, function (err, userdoc) {
            userdoc.hungers.push(bookdoc._id);
            userdoc.save();
        });
        res.redirect("/bookDetail?bookid="+bookdoc._id);
    });
});

//书籍状态改变
router.get("/bookStatus", function (req, res) {
    var userId = sessionUserId(req, res);
    var bookM = global.dbHandel.getModel("book");
    var status = req.query.status;
    printStr(status + "__" + req.query.bookid);
    if (!status)
        var nextHolder = req.query.holder;  // 传的是结束人的id
    bookM.findOne({owner: userId, _id: req.query.bookid}, function (err, bookdoc) {
        bookdoc.status = status;
        switch (status) {//状态0未借出1已借出2下架
            case 0:
                break;
            case 1:
                if(bookdoc.holder){
                    bookdoc.readed.push(bookdoc.holder);
                    bookdoc.hungers.pull(bookdoc.holder);
                }
                bookdoc.holder = nextHolder;
                break;
            case 2:
                bookdoc.holder = null;
                break;

        }
        bookdoc.save();
        printStr("change book status  ok////")
    })
    res.send("ok");
})


/**
 * 读后感相关
 */
//添加评论
router.post("/feelAdd", function (req, res) {
    var userId = sessionUserId(req, res);
    var feelM = global.dbHandel.getModel("feel");
    //var bookid = req.query.bookid;
    feelM.create(
        {
            content: req.body.content,
            bookid: req.body.bookid,
            userId: userId,
            agree: 0,
            cdate: Date.now(),
            udate: Date.now()
        }, function (err, feeldoc) {
            var bookM = global.dbHandel.getModel("book");
            bookM.findById(req.body.bookid, function (err, bookdoc) {
                bookdoc.feels.push(feeldoc._id);
                bookdoc.save();
            })
            res.redirect("/book/detail/" + req.body.bookid);
        }
    )
})
//赞同
router.get("/feelAgree", function (req, res) {
    var userId = sessionUserId(req, res);
    var feelid = req.query.feelid;
    var feelM = global.dbHandel.getModel("feel");
    feelM.findById(feelid, function (err, feel) {
        if (userId == feel.userId) {
            printStr("自己不能点赞自己啊");
            return;
        }
        feel.count = feel.count + 1;
        feel.udate = Date.now();
        feel.save();
        res.send("ok");
    })

})


function print(doc) {
    console.log("---------[" + JSON.stringify(doc));
}

function printStr(str) {
    console.log("_________[" + str)
}

function sessionUserId(req, res) {
    if (!req.session.user) {                     //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    }
    return req.session.user._id;
}


module.exports = router;
