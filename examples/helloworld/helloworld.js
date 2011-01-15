var 
router = require('./../../lib/router').router,
app = require('./../../lib/app').app,
server = require('./../../lib/server');

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