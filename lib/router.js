exports.router = function(data) {
   var 
   self = {}, 
   routes = {};

   var transitionMethods = [
   'get'
   , 'post'
   , 'put'
   , 'delete'
   , 'move'
   , 'copy'
   , 'merge'
   , 'connect'   
   ];
     
   self.apply = function(data) {
      for (var i = 0, l = data.length; i < l; ++i) {
         var item = data[i], route = {}; 
         for (var property in item) {
            if (!route.regExp) {
               route.regExp = item[property];
            }
            else {
               route.method = property.toUpperCase();
               route.handler = item[property];
            }
         }
         self.addRoute(route.method, route.regExp, route.handler);
      }
   };     
   self.addRoute = function(method, regExp, handler, args) {
      routes[method] = routes[method] || [];
      if (typeof regExp === 'string') {
         var named_param_regex = /[\/\.]:(\w+)/g;
         var s = regExp.replace(named_param_regex, '(?:/([^\/]+)|/)');
         // if regExp contains grouping -- make it regexp
         // otherwise leave it as literal string
         if (s !== regExp)
            regexp = new RegExp('^' + s + '$');
      }
      var route = {
         regExp: regExp,
         handler: handler
      };
      if (args) {
         route.args = args;
      }
      routes[method].push(route);
      return route;      
   };

   transitionMethods.forEach(function (method) {
      self[method] = function(uri, handler){
         var args = Array.prototype.slice.call(arguments, 2);
         self.addRoute(method.toUpperCase(), uri, handler, args);
      }
   });
   self.apply(data);
   self.match = function(method, path) {
      var _routes = routes[method];
      if (_routes) {
         for (var i = 0, l = _routes.length; i < l; ++i) {
            var route = _routes[i];
            var args = (route.regExp === path) ? [] :
            (route.regExp instanceof RegExp) && route.regExp.exec(path);
            if (args) {
               args.shift(); // kick off the pattern itself
               // append predefined arguments
               if (args instanceof Array)
                  route.args = args.concat(route.args);               
               return route;
            }             
         }
      }
      return null;
   };
   return self;
};