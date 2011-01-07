var app = require('./../../lib/app');

app.get('/', function(req, res){
  res.send('Hello World!');
});

app.listen(3000);
console.log('listening...');