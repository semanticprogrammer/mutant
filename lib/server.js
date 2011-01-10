(module.exports = function () {
   var 
   sys = require('sys'),
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
   
   var routes = [];
   
   function addRoute(method, regExp, handler, args) {
      if (typeof regExp === 'string') {
         var named_param_regex = /[\/\.]:(\w+)/g;
         var s = regExp.replace(named_param_regex, '(?:/([^\/]+)|/)');
         // if regExp contains grouping -- make it regexp
         // otherwise leave it as literal string
         if (s !== regExp)
            regexp = new RegExp('^' + s + '$');
      }
      var route = {
         method: method,
         regExp: regExp,
         handler: handler
      };
      if (args) {
         route.args = args;
      }
      routes.push(route);
      return route;      
   };
    
   ['get', 'post', 'put', 'delete'].forEach(function (method) {
      self[method] = function(uri, handler){
         var args = Array.prototype.slice.call(arguments, 2);
         addRoute(method.toUpperCase(), uri, handler, args);         
      }
   });
   
   function match(method, path) {
      var result = null;
      routes.forEach(function (route) {
         if (route.method == method) {
            var args = (route.regExp === path) ? [] :
            (route.regExp instanceof RegExp) && route.regExp.exec(path);
            if (args) {
               args.shift(); // kick off the pattern itself
               // append predefined arguments
               if (args instanceof Array)
                  route.args = args.concat(route.args);               
               result = route;
               return;
            }
         }         
      });
      return result;
   };
   
   function doRoute(ctx, req, resp) {
      var route = match(req.method, req.params.pathname);
      if (route && route.handler) {
         route.handler.call(ctx, req, resp);
      }
   }
   self.adjustServer = function(opts) {
      opts = Object.merge(opts || {}, options);
      return function(req, resp) {
         resp.status = 200;
         resp.headers = {
            'content-type': 'text/html'
         };
      
         resp.send = function (data, encoding) {
            if (!this.headers.hasOwnProperty('content-length')) {
               this.headers['content-length'] =  data ? data.length : 0;
            }
            this.writeHead(this.status, this.headers);
            this.end(data, encoding || 'utf-8');
         };
         
         req.params = url.parse(req.url, true);
         req.addListener('data', function (data) {
            var postdata = '';
            postdata += data;
         }).addListener('end', function () {    
            doRoute(self, req, resp);
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