const router = require('koa-router')();
const sha1 = require('sha1');

const UserModel = require('../models/users.js');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.prefix('/signin');
router.get('/', checkNotLogin, async (ctx) => {
    ctx.state.user = ctx.session.user;
    ctx.state.error = ctx.flash.get();
    ctx.state.success = ctx.flash.get();
    await ctx.render('signin.ejs');
});
router.post('/', checkNotLogin, async (ctx, next) => {
    var name = ctx.request.fields.name;
    var password = ctx.request.fields.password;

    await UserModel.getUserByName(name).then( (user) => {
        if (!user) {
            ctx.flash.set('用户不存在');
            return ctx.redirect('back');
        }

        if (sha1(password) !== user.password) {
            ctx.flash.set('用户名或密码错误');
            return ctx.redirect('back');
        }
        ctx.flash.set('登录成功');
        delete user.password;
        ctx.session.user = user;
        return ctx.redirect('/posts');
    }).catch(next);
});

module.exports = router.routes();