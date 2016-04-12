'use strict';

(function() {
  function tryStringify(arg) {
    try {
      return JSON.stringify(arg);
    } catch (_) {
      return '[Circular]';
    }
  }

  String.prototype.format = function() {
    const args = Array.prototype.slice.call(arguments);
    if (!args.length) return this;

    var str = '';
    var a = 0;
    var lastPos = 0;
    for (var i = 0, len = this.length; i < len; i++) {
      if (this.charCodeAt(i) === 37/*'%'*/ && i + 1 < len) {
        switch (this.charCodeAt(i + 1)) {
          case 100: // 'd'
            if (a >= args.length)
              break;
            if (lastPos < i)
              str += this.slice(lastPos, i);
            str += Number(args[a++]);
            lastPos = i = i + 2;
            continue;
          case 106: // 'j'
            if (a >= args.length)
              break;
            if (lastPos < i)
              str += this.slice(lastPos, i);
            str += tryStringify(args[a++]);
            lastPos = i = i + 2;
            continue;
          case 115: // 's'
            if (a >= args.length)
              break;
            if (lastPos < i)
              str += this.slice(lastPos, i);
            str += String(args[a++]);
            lastPos = i = i + 2;
            continue;
          case 37: // '%'
            if (lastPos < i)
              str += this.slice(lastPos, i);
            str += '%';
            lastPos = i = i + 2;
            continue;
        }
      }
    }
    if (lastPos === 0)
      str = this;
    else if (lastPos < this.length)
      str += this.slice(lastPos);
    return str;
  };
})();