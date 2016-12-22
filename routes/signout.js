const router = require('koa-router')();
const checkLogin = require('../middlewares/check').checkLogin;

router.prefix('/signout');
router.get('/', checkLogin, async (ctx) => {
    ctx.session.user = null;
    ctx.flash.set('登出成功');
    await ctx.redirect('/posts');
});

module.exports = router.routes();