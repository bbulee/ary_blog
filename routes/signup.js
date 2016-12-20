const router = require('koa-router')();
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.prefix('/signup');
router.get('/', checkNotLogin, async (ctx) => {
    ctx.state.user = ctx.session.user;
    ctx.state.error = ctx.flash.get();
    ctx.state.success = ctx.flash.get();
    await ctx.render('signup.ejs');
});
router.post('/', checkNotLogin, async (ctx) => {
    ctx.body = ctx.flash.get();
});

module.exports = router.routes();