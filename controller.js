const fs = require('fs');
const checkLogin = require('./middlewares/check').checkLogin;

function addMapping(router, mapping) {
    for (let url in mapping) {
        var filter = function(){};
        if (url === 'filter') {
            var filter = mapping[url];
            continue;
        }

        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, filter, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, filter, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, controllers_dir) {
    var files = fs.readdirSync(__dirname + '/' +controllers_dir);
    var js_files = files.filter((f)=>{
        return f.endsWith('.js');
    })

    for (let f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + controllers_dir + '/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function(dir) {
    let 
        controllers_dir = dir || 'routes',
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};