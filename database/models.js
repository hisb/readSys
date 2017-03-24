var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = {
    user: {  //用户
        name: {
            type: String,
            required: true
        }, //登录账号
        password: {
            type: String,
            required: true
        },
        nick: {type: String}, //昵称
        email: {type: String},
        phone: {type: String},
        address: {type: String},
        imgSrc: {type: String},
        desc: {type: String}, //个人简介
        cdate: {type: Date},
        udate: {type: Date},
        shareds: [  //分享的书
            {
                type: Schema.Types.ObjectId,
                ref: 'book'
            }
        ],
        hungers: [  //想看的书
            {
                type: Schema.Types.ObjectId,
                ref: 'book'
            }
        ]
    },
    category: {  //分类
        name: {type: String},
        order: {type: Number},
        books: [  //书的列表
            {
                type: Schema.Types.ObjectId,
                ref: 'book'
            }
        ]
    },
    book: {
        title: {type: String},
        author: {type: String},
        desc: {type: String},
        imgSrc: {type: String},
        number: {type: Number}, //排队人数
        cdate: {type: Date},
        udate: {type: Date},
        status: {type: Number}, //状态0未借出1借出未归还2已归还3下架
        categoryId: {
            type: String,
            required: true
        },
        owner: {// 分享人
            type: String,
            required: true
        },
        readed: [//已经看过的人
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        holder: { //正在借书的人
            type: String,
        },
        hungers: [ //想看的人
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        feels: [
            {
                type: Schema.Types.ObjectId,
                ref: 'feel'
            }
        ]
    },
    feel: {  //读后感
        content: {
            type: String,
            required: true
        },
        bookid: {
            type: String,
            required: true
        },
        userId: { //评论者id
            type: String,
            required: true
        },
        usernick: { //评论者昵称
            type: String,
            required: true
        },
        imgSrc: { //评论者头像
            type: String,
            required: true
        },
        agree: {type: Number},
        cdate: {type: Date},
        udate: {type: Date},
        userId: {
            type: String,
            required: true
        }
    }


};