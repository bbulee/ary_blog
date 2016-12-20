const router = require('koa-router')();
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.prefix('/signin');
router.get('/', checkNotLogin, (ctx) => {
    console.log(ctx.flash.get());
    ctx.body = ctx.flash.get();
});
router.post('/', checkNotLogin, (ctx) => {
    ctx.body = ctx.flash.get();
});

module.exports = router.routes();