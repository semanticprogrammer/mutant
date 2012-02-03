(module.exports = function () {
   var    
   http = require('http'),
   url = require('url'),
   object = require('./object'),   
   self = {};
   
   var options =  {
      hostname: 'localhost', 
      port:3000
   };
     
   http.ServerResponse.prototype.redirect = function (location) {
      this.writeHead(301, {
         'Location': location
      });
      this.end();
   };

   http.ServerResponse.prototype.setNotFoundStatus = function () {
      if (this.status >= 200 && this.status < 300) {
         this.status = 404;
      }
   };
   
   self.adjustServer = function(opts) {
      options = object.merge(opts || {}, options);
      return function(req, res) {
         res.status = 200;
//         res.setHeader('content-type', 'text/html');
         req.params = url.parse(req.url, true);
         req.addListener('data', function (data) {
            if (!req.postdata) {
               req.postdata = data;
            } else {
               req.postdata += data;
            }
         }).addListener('end', function () {
            if (options.handler) {
               options.handler(req, res);
            }
         });
      }
   };

   self.run = function (opts) {
      var server = http.createServer(self.adjustServer(opts));
      server.listen(options.port, options.hostname);
      return server;
   }
   return self;
}());