const router = require('koa-router')();
const path = require('path');
const sha1 = require('sha1');
const fs = require('fs');

const UserModel = require('../models/users.js');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.prefix('/signup');
router.get('/', checkNotLogin, async (ctx) => {
    ctx.state.user = ctx.session.user;
    ctx.state.error = ctx.flash.get();
    ctx.state.success = ctx.flash.get();
    await ctx.render('signup.ejs');
});
router.post('/', checkNotLogin, async (ctx,next) => {
    //console.log(ctx.request.fields);
    // console.log(ctx.request.files[0].path);
	var name = ctx.request.fields.name;
    var gender = ctx.request.fields.gender;
    var bio = ctx.request.fields.bio;
    var avatar = ctx.request.files[0].path.split(path.sep).pop();
    var password = ctx.request.fields.password;
    var repassword = ctx.request.fields.repassword;

    try {
        if (!name.length >= 1 && name.length <= 10) {
            throw new Error('名字请限制在1-10个字符');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error('性别只能是男、女或保密');
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
            throw new Error('个人简介限制在1-30个字符');
        }
        if (!ctx.request.files[0].name) {
            throw new Error('缺少头像');
        }
        if (password.length < 6) {
            throw new Error('密码至少6个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        console.log('asdfs');
        ctx.flash.set(e.message);
        return ctx.redirect('/signup');
    }

    //明文密码加密
    password = sha1(password);

    //待写入数据库的用户信息
    var user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
    };

    //用户信息写入数据库
    await UserModel.create(user).then( (result) => {
        console.log('hello111');
        //此user是插入mongodb后的值，包含_id
        user = result.ops[0];
        //将用户信息存入session
        delete user.password;
        ctx.session.user = user;
        ctx.flash.set('注册成功');

        //跳转到首页
        return ctx.redirect('/posts');
    }).catch( (e) => {
        console.log('hello');
        fs.unlink(ctx.request.files[0].path);
        //用户名被占用则跳回注册页，而不是错误页
        if (e.message.match('E11000 duplicate key')) {
            ctx.flash.set('用户名已被占用');
            return ctx.redirect('/signup');
        }
        console.error(e);
        console.error(e.statck);
    });
});

module.exports = router.routes();