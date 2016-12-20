const router = require('koa-router')();
const checkLogin = require('../middlewares/check').checkLogin;

router.prefix('/signout');
router.get('/', checkLogin, (ctx) => {
    ctx.body = ctx.flash.get();
});

module.exports = router.routes();