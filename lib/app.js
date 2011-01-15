exports.app = function(router) {
   return function(req, res){
      var route = router.match(req.method, req.params.pathname);
      if (route && route.handler) {
         route.handler.call(this, req, res);
      }
      else {
         res.setNotFoundStatus();
         res.send('<h3>Resource Not Found</h3><pre>' + req.params.pathname + '</pre>');
      }
   };   
};