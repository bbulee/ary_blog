const router = require('koa-router')();

module.exports = function(app) {

    router.get('/', async (ctx) => {
        ctx.redirect('/posts');
    });
    app.use(router.routes());

    app.use(require('./posts'));
    app.use(require('./signin'));
    app.use(require('./signup'));
    app.use(require('./signout'));
}