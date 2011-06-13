exports.merge = function (src, dest) {
   if (src && dest) {
      for (var key in src) {
         if (src.hasOwnProperty(key)) {
            dest[key] = src[key];
         }
      }
   }
   return dest;
};