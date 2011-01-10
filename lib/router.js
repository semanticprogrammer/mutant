(module.exports = function () {
   var 
   sys = require('sys'),
   http = require('http'),
   url = require('url'),
   self = function(req, res){
      var route = match(req.method, req.params.pathname);
      if (route && route.handler) {
         route.handler.call(req, resp);
      }      
   };
   
   var routes = {};

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
   
   function addRoute(method, regExp, handler, args) {
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
         addRoute(method.toUpperCase(), uri, handler, args);
      }
   });
   
   function match(method, path) {
      var result = null;
      routes[method].forEach(function (route) {
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
      });
      return result;
   };
   return self;
}());