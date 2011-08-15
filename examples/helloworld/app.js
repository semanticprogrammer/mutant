var
router = require('../../lib/router').router,
handler = require('../../lib/handler').handler,
server = require('../../lib/server');

var data = [
{
   uri: '/',
   get: function(req, res) {
      res.end('Hello World!');
   }
}
];

server.run({
   hostname: 'localhost', 
   port:3000, 
   handler: handler(router(data))
});
console.log('listening...');