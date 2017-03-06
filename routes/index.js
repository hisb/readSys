var express = require('express');
var router = express.Router();

var homeData = [
	{
		type: '文学',
		id: 1,
		data: [
			{
				author: '贾平凹',
				imgSrc: 'images/literature/wenxue11.jpg',
				title : '自在独行',
				number: 9
			},{
				author: '杨绛',
				imgSrc: 'images/literature/wenxue22.jpg',
				title : '我们仨',
				number: 9
			},{
				author: '路遥',
				imgSrc: 'images/literature/wenxue33.jpg',
				title : '平凡的世界',
				number: 9
			}
		]
	},{
		type: '小说',
		id: 2,
		data: [
			{
				author: '加·泽文',
				imgSrc: 'images/novel/xiaoshuo11.jpg',
				title : '岛上书店',
				number: 9
			},{
				author: '东野圭吾',
				imgSrc: 'images/novel/xiaoshuo22.jpg',
				title : '解忧杂货店',
				number: 9
			},{
				author: '圣埃克苏佩里',
				imgSrc: 'images/novel/xiaoshuo33.jpg',
				title : '小王子',	
				number: 9
			}
		]
	}
];
var moreData = [
		
		{
			author: '贾平凹',
			imgSrc: 'images/literature/wenxue11.jpg',
			title : '自在独行',
			number: 9
		},{
			author: '杨绛',
			imgSrc: 'images/literature/wenxue22.jpg',
			title : '我们仨',
			number: 9
		},{
			author: '路遥',
			imgSrc: 'images/literature/wenxue33.jpg',
			title : '平凡的世界',
			number: 9
		},{
			author: '加·泽文',
			imgSrc: 'images/literature/wenxue44.jpg',
			title : '活着',
			number: 9
		},{
			author: '东野圭吾',
			imgSrc: 'images/literature/wenxue55.jpg',
			title : '愿人生从容',
			number: 9
		},{
			author: '圣埃克苏佩里',
			imgSrc: 'images/literature/wenxue66.jpg',
			title : '文学回憶録',	
			number: 9
		},{
			author: '圣埃克苏佩里',
			imgSrc: 'images/literature/wenxue77.jpg',
			title : '直到那一天',	
			number: 9
		},{
			author: '圣埃克苏佩里',
			imgSrc: 'images/literature/wenxue88.jpg',
			title : '小王子',	
			number: 9
		}
];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.route("/login").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render("login",{title:'User Login'});
}).post(function(req,res){                        // 从此路径检测到post方式则进行post数据的处理操作
    //get User info
     //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');  
    var uname = req.body.uname;                //获取post上来的 data数据中 uname的值
    User.findOne({name:uname},function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
        if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        }else if(!doc){                               //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '用户名不存在';
            res.send(404);                            //    状态码返回404
        //    res.redirect("/login");
        }else{ 
            if(req.body.upwd != doc.password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = "密码错误";
                res.send(404);
            //    res.redirect("/login");
            }else{                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = doc;
                res.send(200);
            //    res.redirect("/home");
            }
        }
    });
});

/* GET register page. */
router.route("/register").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("register",{title:'User register'});
}).post(function(req,res){ 
     //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;
    var upwd = req.body.upwd;
    User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式
        if(err){ 
            res.send(500);
            req.session.error =  '网络异常错误！';
            console.log(err);
        }else if(doc){ 
            req.session.error = '用户名已存在！';
            res.send(500);
        }else{ 
            User.create({                             // 创建一组user对象置入model
                name: uname,
                password: upwd
            },function(err,doc){ 
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

/* GET home page. */
router.get("/home",function(req,res){ 
    if(!req.session.user){                     //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");                //未登录则重定向到 /login 路径
    }
    res.render("home",{title:'Home', datas: homeData});         //已登录则渲染home页面
});

/* GET detail page. */
router.get("/detail",function(req,res){
    res.render("detail",{title:'detail'});         
});

/* GET more page. */
router.get("/more/:id",function(req,res){
    res.render("more",{title:'more', datas: moreData});         
});

/* GET share page. */
router.get("/share",function(req,res){
    res.render("share",{title:'share'});         
});

module.exports = router;
