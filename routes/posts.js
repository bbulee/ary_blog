const router = require('koa-router')();
const checkLogin = require('../middlewares/check').checkLogin;

router.prefix('/posts');
// router.get('/', async (ctx) => {
//     ctx.body = ctx.flash.get();
// });
router.get('/', checkLogin, async (ctx) => {
    ctx.body = ctx.flash.get();
});
router.get('/create', checkLogin, async (ctx) => {
    ctx.body = ctx.flash.get();
});
router.get('/:postId', async (ctx) => {
    ctx.body = ctx.flash.get();
});
router.get('/:postId/edit', checkLogin, async (ctx) => {
    ctx.body =ctx.flash.get();
});
router.post('/:postId/edit', checkLogin, async (ctx) => {
    ctx.body =ctx.flash.get();
});
router.get('/:postId/remove', checkLogin, async (ctx) => {
    ctx.body = ctx.flash.get();
});
router.post('/:postId/comment', checkLogin, async (ctx) => {
    ctx.body = ctx.flash.get();
});
router.get(':postId/comment/:commentId/remove', checkLogin, async (ctx) => {
    ctx.body = ctx.flash.get();
});

module.exports = router.routes();