'use strict';

(function() {
  Object.prototype.merge = function() {
    const sources = Array.prototype.slice.call(arguments);
    sources.forEach((source) => {
      Object.keys(source).forEach((key) => {
        if (key in this && this[key] instanceof Object) {
          if (source[key] instanceof Object) {
            return merge(this[key], source[key]);
          }
          return;
        }
        this[key] = source[key];
      });
    });
    return this;
  };
})();