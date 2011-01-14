var 
router = require('./../../lib/router').router,
server = require('./../../lib/server');

var data = [
{
   uri: '/',
   get: function(req, res) {
      res.send('Hello World!');         
   }
}
];

function app(router) {
   return function(req, res){
      var route = router.match(req.method, req.params.pathname);
      if (route && route.handler) {
         route.handler.call(this, req, res);
      }
      else {
         res.setNotFoundStatus();
         res.send('<h3>Resource Not Found</h3><pre>' + req.params.pathname + '</pre>');
      }
   };
}

server.run({
   hostname: 'localhost', 
   port:3000, 
   router: app(router(data))
});
console.log('listening...');