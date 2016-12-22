var checkLogin = async (ctx, next)=>{
    if (!ctx.session.user) {
        console.log('bbadfadf');
        ctx.flash.set('not login');
        return ctx.redirect('/signin');
    }
    await next();
};

var checkNotLogin = async (ctx, next)=>{
    if (ctx.session.user) {
        ctx.flash.set('have logined');
        return ctx.redirect('back');
    }
    await next();
};

module.exports = {
    checkLogin: checkLogin,
    checkNotLogin: checkNotLogin
};