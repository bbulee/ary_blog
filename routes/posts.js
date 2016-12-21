const router = require('koa-router')();
const checkLogin = require('../middlewares/check').checkLogin;

router.prefix('/posts');
router.get('/', async (ctx) => {
    ctx.state.user = ctx.session.user;
    ctx.state.error = ctx.flash.get();
    ctx.state.success = ctx.flash.get();
    await ctx.render('posts.ejs');
});
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