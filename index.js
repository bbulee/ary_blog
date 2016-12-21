const Koa = require('koa');
const session = require('koa-session');
const convert = require('koa-convert');
const flash = require('koa-flash-simple')
const views = require('koa-views');
const pkg = require('./package');
const parseBody = require('koa-better-body');
const path = require('path');
const app = new Koa();

app.use(views(__dirname + '/views', {
  map: {
    ejs: 'ejs'
  }
}));

app.use(convert(require('koa-static')('./public')));

app.keys=['ary blog'];
var CONFIG = {
  key: 'aryblog:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};
app.use(convert(session(CONFIG,app)));
app.use(flash());

app.use(convert(parseBody({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
})));

app.use(async (ctx,next) => {
  ctx.state.blog = { 
    title: pkg.name, 
    description: pkg.description,
  };
  await next();
});

const controller = require('./routes');
controller(app);

app.listen(3000);
console.log('Server start on port 3000...');

