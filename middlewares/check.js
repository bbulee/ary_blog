var checkLogin = async (ctx, next)=>{
    console.log('session.user' + !ctx.session.user);
    console.log('ctx.flash' + ctx.flash);
    if (!ctx.session.user) {
        //ctx.flash.set('not login');
        return ctx.redirect('/signin');
    }
    await next();
};

var checkNotLogin = async (ctx, next)=>{
    if (!ctx.session.user) {
        ctx.flash.set({error: 'have logined'});
        return ctx.redirect('back');
    }
    await next();
};

module.exports = {
    checkLogin: checkLogin,
    checkNotLogin: checkNotLogin
};