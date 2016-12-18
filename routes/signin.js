var fn_signin = async (ctx, next) => {
    ctx.body = "hello";
};

module.exports = {
    'GET /signin': fn_signin
};