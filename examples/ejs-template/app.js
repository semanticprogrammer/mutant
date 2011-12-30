var 
fs = require('fs'),
path = require('path'),
connect = require('connect'),
router = require('../../lib/router').router,
handler = require('../../lib/handler').handler,
server = require('../../lib/server');

var env = require('./config/environment.json', 'utf-8');
var templatePath = path.join(__dirname, env.view.area);
var templateResource = require('./resource/' + env.view.engine)({path: templatePath, ext: env.view.ext});
var data = require('./' + env.data.area + '/posts.json', 'utf-8');

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
   middleware: connect.static(__dirname + "/" + env.static.area)   
}
];

function start(callback) {
   router = router(router_data);
   router.use(function(req, res, next) {
      res.render = function (templatename, data) {
         templateResource.render(templatename, data, function (err, output) {
            if (err) {
               res.end(err.message);
            }
            res.end(output);
         })
      };
      next();
   });
   router.plug(
      function get(req, res) {
         res.setNotFoundStatus();
         res.end('<h3>Resource Not Found</h3><pre>' + req.params.pathname + '</pre>');
      }
   );
   env.app.handler = handler(router);   
   callback();
}

start(function () {
   server.run(env.app);
   console.log("Using template engine: " + env.view.engine);
   console.log('listening on host: ' + env.app.hostname + ' port: ' + env.app.port);
});