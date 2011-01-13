(module.exports = function () {
   var 
   http = require('http'),
   url = require('url'),
   self = {};
   
   Object.merge = function (src, dest) {
      if (src && dest) {
         for (var key in src) {
            if (src.hasOwnProperty(key)) {
               dest[key] = src[key];
            }
         }
      }
      return dest;
   };
   
   var options =  {
      hostname: 'localhost', 
      port:3000
   };
      
   self.adjustServer = function(opts) {
      opts = Object.merge(opts || {}, options);
      return function(req, res) {
         res.status = 200;
         res.headers = {
            'content-type': 'text/html'
         };
         req.params = url.parse(req.url, true);
         res.send = function (data, encoding) {
            if (!this.headers.hasOwnProperty('content-length')) {
               this.headers['content-length'] =  data ? data.length : 0;
            }
            this.writeHead(this.status, this.headers);
            this.end(data, encoding || 'utf-8');
         };
         res.redirect = function (location) {
            this.status = 301;
            this.headers.location = location;
            this.send();
         };
         res.setNotFoundStatus = function (location) {
            if (res.status >= 200 && res.status < 300) {
               res.status = 404;
            }
         };
         req.addListener('data', function (data) {
            var postdata = '';
            postdata += data;
         }).addListener('end', function () {
            if (opts.router) {
               opts.router(req, res);
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