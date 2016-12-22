const router = require('koa-router')();

const PostModel = require('../models/posts');
const CommentModel = require('../models/comments');
const checkLogin = require('../middlewares/check').checkLogin;

router.prefix('/posts');

router.get('/', async (ctx, next) => {
    var author = ctx.query.author;
    await PostModel.getPosts(author).then( (posts) => {
        ctx.state.user = ctx.session.user;
        ctx.state.error = ctx.flash.get();
        ctx.state.success = ctx.flash.get();
        ctx.state.posts = posts;
    }).catch(next);
    await ctx.render('posts.ejs');
});

router.post('/', checkLogin, async (ctx, next) => {
    var author = ctx.session.user._id;
    var title = ctx.request.fields.title;
    var content = ctx.request.fields.content;

    try {
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch (e) {
        ctx.flash.set(e.message);
        return ctx.redirect('back');
    }

    var post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    await PostModel.create(post).then( (result) => {
        post = result.ops[0];
        ctx.flash.set('发表成功');
        return ctx.redirect(`/posts/${post._id}`);
    }).catch(next);
});

router.get('/create', checkLogin, async (ctx) => {
    ctx.state.user = ctx.session.user;
    ctx.state.error = ctx.flash.get();
    ctx.state.success = ctx.flash.get();
    await ctx.render('create.ejs');
});
router.get('/:postId', async (ctx,next) => {
    var postId = ctx.params.postId;
    await Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.incPv(postId)
    ]).then( (result) => {
        var post = result[0];
        var comments = result[1];
        if (!post) {
            throw new Error('该文章不存在');
        }
        ctx.state.user = ctx.session.user;
        ctx.state.error = ctx.flash.get();
        ctx.state.success = ctx.flash.get();
        ctx.state.post = post;
        ctx.state.comments = comments;
    }).catch(next);

    await ctx.render('post.ejs');
});
router.get('/:postId/edit', checkLogin, async (ctx,next) => {
    var postId = ctx.params.postId;
    var author = ctx.session.user._id;

    await PostModel.getRawPostById(postId).then( (post) => {
        if (!post) {
            throw new Error('该文章不存在');
        }
        if (author.toString() !== post.author._id.toString()) {
            throw new Error('权限不足');
        }
        ctx.state.user = ctx.session.user;
        ctx.state.error = ctx.flash.get();
        ctx.state.success = ctx.flash.get();
        ctx.state.post = post;
    }).catch(next);

    await ctx.render('edit.ejs');
});

router.post('/:postId/edit', checkLogin, async (ctx, next) => {
    var postId = ctx.params.postId;
    var author = ctx.session.user._id;
    var title = ctx.request.fields.title;
    var content = ctx.request.fields.content;

    await PostModel.updatePostById(postId, author, { title: title, content: content })
        .then( () => {
            ctx.flash.set('编辑文章成功');
            return ctx.redirect(`/posts/${postId}`);
        }).catch(next);
});

router.get('/:postId/remove', checkLogin, async (ctx, next) => {
    var postId = ctx.params.postId;
    var author = ctx.session.user._id;

    await PostModel.delPostById(postId, author)
        .then( () => {
            ctx.flash.set('文章删除成功');
            return ctx.redirect('/posts');
        }).catch(next);
});

router.post('/:postId/comment', checkLogin, async (ctx,next) => {
    var author = ctx.session.user._id;
    var postId = ctx.params.postId;
    var content = ctx.request.fields.content;
    var comment = {
        author: author,
        postId: postId,
        content: content
    };

   await CommentModel.create(comment).then( () => {
        ctx.flash.set('留言成功');
        return ctx.redirect('back');
    }).catch(next);
});

router.get(':postId/comment/:commentId/remove', checkLogin, async (ctx,next) => {
    var commentId = ctx.params.commentId;
    var author = ctx.session.user._id;

    await CommentModel.delCommentById(commentId, author)
        .then( () => {
            ctx.flash.set('删除留言成功');
            return ctx.redirect('back');
        }).catch(next);
});

module.exports = router.routes();