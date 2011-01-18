require.paths.unshift('../../lib');
var 
router = require('router').router,
app = require('app').app,
server = require('server');

var data = [
{
   uri: '/',
   get: function(req, res) {
      res.send('Hello World!');         
   }
}
];

server.run({
   hostname: 'localhost', 
   port:3000, 
   app: app(router(data))
});
console.log('listening...');