'use strict';

(function() {
  String.prototype.wrap = function(before, after) {
    if (!after) {
      if (after === null) {
        after = '';
      } else if (before.length % 2) {
        after = before;
      } else {
        const length = before.length / 2;
        after = before.substr(length);
        before = before.substr(0, length);
      }
    }
    return before + this.toString() + after;
  };
})();