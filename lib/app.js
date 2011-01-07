(module.exports = function () {
   var http = require('http'),
   self = {};
   self.run = function (opts) {
      var server = http.createServer(this.cgi(opts));
      server.listen(this.options.port || process.env.PORT || 3000,
         this.options.hostname || process.env.HOSTNAME || 'localhost');
      return server;
   }
   return self;
}());