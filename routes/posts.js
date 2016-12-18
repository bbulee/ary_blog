//GET /posts all the articles of all the users or specified user.
// eg: GET /posts?auther=xxx
var fn_userArticles = async (ctx) => {
    console.log(ctx.session.isNew);
    ctx.body = "hello";
};

// POST /posts 发表一篇文章
var fn_postArticle = async (ctx) => {
    ctx.body = ctx.flash.get();
};

module.exports =  {
    'GET /posts': fn_userArticles
};