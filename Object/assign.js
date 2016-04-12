'use strict';

(function() {
  Object.prototype.assign = function() {
    const sources = Array.prototype.slice.call(arguments);
    sources.forEach((source) => {
      Object.keys(source).forEach((key) => {
        if (key in this && this[key] instanceof Object) {
          if (source[key] instanceof Object) {
            return assign(this[key], source[key]);
          }
        }
        this[key] = source[key];
      });
    });
    return this;
  };
})();