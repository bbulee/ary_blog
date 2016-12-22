const config = require('config-lite');
const moment  = require('moment');
const objIdTT = require('objectid-to-timestamp');
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
console.log(config.mongodb);
mongolass.connect(config.mongodb);

mongolass.plugin('addCreateAt', {
    afterFind: function (results) {
        results.forEach( (item) => {
            item.created_at = moment(objIdTT(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objIdTT(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});

module.exports.User = mongolass.model('User', {
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    gender: { type: 'string', enum: ['m','f','x'] },
    bio: { type: 'string' }
});
module.exports.User.index({ name: 1 }, { unique: true }).exec();

module.exports.Post = mongolass.model('Post', {
    author: { type: Mongolass.Types.ObjectId },
    title: { type: 'string' },
    content: { type: 'string' },
    pv: { type: 'number' }
});
module.exports.Post.index({ author: 1, _id: -1 }).exec();

module.exports.Comment = mongolass.model('Comment', {
    author: { type: Mongolass.Types.ObjectId },
    content: { type: 'string' },
    postId: { type: Mongolass.Types.ObjectId }
});
module.exports.Comment.index({ postId: 1, _id: 1 }).exec();
module.exports.Comment.index({ author: 1, _id: 1 }).exec();