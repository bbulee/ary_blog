var fn_index = async (ctx) => {
    ctx.redirect('/posts');
};
module.exports = {
    'GET /': fn_index
}