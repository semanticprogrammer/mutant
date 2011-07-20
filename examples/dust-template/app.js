require.paths.unshift('../../lib');
var 
fs = require('fs'),
connect = require('connect'),
router = require('router').router,
app = require('app').app,
server = require('server'),
dust = require('dust'),
util = require('util'),
prepareApp = require('./prepare_app');

var env = JSON.parse(fs.readFileSync('./config/environment.js', 'utf-8'));
var data = JSON.parse(fs.readFileSync('./' + env.dataArea + '/posts.js', 'utf-8'));

var opts = {
   hostname: 'localhost', 
   port:3000, 
   template: {
      dir: env.template.area,
      ext: env.template.ext,
      compileFunc: dust.compile,
      loadFunc: dust.loadSource,
      renderFunc: dust.render
   } 
};

var router_data = [
{
   pattern: '/hello',
   get: function(req, res) {
      res.end('Hello World!');
   }
},
{
   pattern: '/',
   get: function(req, res) {
      res.redirect('/main');
   }
},
{
   pattern: '/main',
   get: function(req, res) {
      res.render('main', data);
   }
},
{
   pattern: '/view/{templatename}',
   get: function(req, res) {
      try {
         res.render(req.params.templatename, data);
      } catch (e) {
         res.end(e.message);
      }
   }
},
{
   get: connect.static(env.staticArea)
}
];

function start(callback) {
   router = router(router_data);
   router.use(function(req, res, next) {
      res.render = function (templatename, data) {
         opts.template.renderFunc(templatename, data, function (err, output) {
            if (err) {
               throw err;
            }
            res.end(output);
         });
      };
      next();
   });
   router.plug(
      function get(req, res) {
         res.setNotFoundStatus();
         res.end('<h3>Resource Not Found</h3><pre>' + req.params.pathname + '</pre>');
      }
      );
   opts.app = app(router);
   prepareApp.prepareTemplates(opts.template, callback);
}

start(function () {
   server.run(opts);
   console.log('listening...');
});