var 
router = require('./../../lib/router').router,
server = require('./../../lib/server');

function app(router) {
   var 
   self = function(req, res){
      var route = match(req.method, req.params.pathname);
      if (route && route.handler) {
         route.handler.call(this, req, res);
      }
   };   
   router.get('/', function(req, res){
      res.send('Hello World!');
   });
   return self;
}

server.run({
   hostname: 'localhost', 
   port:3000, 
   router: app(router())
});
console.log('listening...');