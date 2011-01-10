var app = require('./../../lib/server');
app.get('/', function(req, res){
   res.send('Hello World!');
});
app.run({hostname: 'localhost', port:3000});
console.log('listening...');