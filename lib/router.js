exports.router = function() {
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