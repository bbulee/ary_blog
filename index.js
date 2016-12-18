const Koa = require('koa');
const app = new Koa();
const session = require('koa-session');
const convert = require('koa-convert');

var CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};
app.use(convert(session(CONFIG,app)));

const controller = require('./controller');
app.use(controller());

app.listen(3000);
console.log('Server start on port 3000...');

