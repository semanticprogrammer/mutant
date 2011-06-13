exports.router = function(data) {
   var 
   object = require('./object'),
   self = {}, 
   plugins = [];

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
         self.plug(data[i]);
      }
   };
   
   self.plug = function(data) {
      var plugin = {}, i = 0;

      if (data instanceof Function) {
         plugin.handler = data;
         plugin.pattern = '*';
      }
      else {
         for (var property in data) {
            if (data[property] instanceof Function) {
               plugin.handler = data[property];
               (i == 0) ? plugin.pattern = '*' : plugin.pattern = property.toUpperCase() + ' ' + plugin.pattern;
            }
            else {
               plugin.pattern = data[property];
            }
            i++;
         }
      }
      plugins.push(plugin);
   };
   
   self.use = function(data) {
      var plugin = {};
      if (data instanceof Function) {
         plugin.handler = data;
         plugin.pattern = '*';
         plugins.unshift(plugin);
      }
   };
   
   transitionMethods.forEach(function (method) {
      self[method] = function(){
         var args = Array.prototype.slice.call(arguments);
         args[0] = method.toUpperCase() + ' ' + args[0];
         return self.plug.apply(this, args);
      }
   });
   
   self.apply(data);
   
   var matchPathExpression = function (expr, path) {
      var p1 = '{([^}]+)}',
      p2 = '<([^>]+)>',
      rA = new RegExp('(?:' + p1 + ')|(?:' + p2 + ')', 'gi'),
      keys = [],
      values = null,
      capture = null;
      while ((capture = rA.exec(expr))) {
         keys.push(capture[1] || capture[2]);
      }
      var rB = new RegExp('^' + expr.replace(/\(/, '(?:', 'gi')
         .replace(/\./, '\\.', 'gi')
         .replace(/\*/, '.*', 'gi')
         .replace(new RegExp(p1, 'gi'), '([^/\\.\\?]+)')
         .replace(new RegExp(p2, 'gi'), '(.+)') + '$');

      if ((values = rB.exec(path))) {
         var result = {};
         values.shift();
         if (values.length === keys.length) {
            for (var i = 0; i < keys.length; i++) {
               result[keys[i]] = values[i];
            }
         } else {
            throw new Error('Inconsistent path expression');
         }
         return result;
      }
      return null;
   };   
   

   self.proceed = function(ctx, method, path, req, res) {
      var index = 0;
      (function next() {
         var plugin = plugins[index];
         index += 1;         
         if (plugin && plugin.pattern) {
            var parts = matchPathExpression(plugin.pattern, method + ' ' + path);
            if (parts) {
               if (plugin.handler) {
                  object.merge(parts, req.params);
                  object.merge(req.params.query, req.params);
                  plugin.handler.call(ctx, req, res, next);
               }
            }
            else {
               next()
            }
         }
      })();
   };
   return self;
};