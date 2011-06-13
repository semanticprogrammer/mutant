exports.app = function(router) {
   return function(req, res){
      router.proceed(this, req.method, req.params.pathname, req, res);
   };   
};