'use strict';

(function() {
  function tryStringify(arg) {
    try {
      return JSON.stringify(arg);
    } catch (_) {
      return '[Circular]';
    }
  }

  function doAformat(f, fmt) {
    var fill  = ' '
      , align = '<'
      , sign  = '-'
      , hash  = false
      , minw  = 0
      , maxw  = -1;

    // fill/align
    if (fmt.length && ~'<>=^'.indexOf(fmt[0])) {
      align = fmt[0];
      fmt = fmt.substr(1);
    } else if (fmt.length > 1 && ~'<>=^'.indexOf(fmt[1])) {
      fill = fmt[0];
      align = fmt[1];
      fmt = fmt.substr(2);
    }

    // sign
    if (~'+- '.indexOf(fmt[0])) {
      sign = fmt[0];
      fmt = fmt.substr(1);
    }

    // hash
    if (fmt.length && fmt[0] === '#') {
      hash = true;
      fmt = fmt.substr(1);
    }

    // minw & maxw
    var s = fmt.search(/[^0-9]/);
    minw = parseInt(fmt.substr(0, s + 1)) || 0;
    fmt = fmt.substr(s);
    if (fmt.length > 1 && fmt[0] === '.') {
      fmt = fmt.substr(1);
      s = fmt.search(/[^0-9]/);
      maxw = parseInt(fmt.substr(0, s + 1)) || -1;
      fmt = fmt.substr(s);
    }

    var str = ''
      , num = typeof f == 'number';

    // type
    if (fmt.length) {
      switch(fmt[0]) {
        case 'b':
          str = f.toString(2);
          if (hash) str = '0b' + str;
          break;
        case 'c':
          str = String.fromCodePoint(f);
          break;
        case 'o':
          str = f.toString(8);
          if (hash) str = '0o' + str;
          break;
        case 'x':
          str = f.toString(16).toLowerCase();
          if (hash) str = '0x' + str;
          break;
        case 'X':
          str = f.toString(16).toUpperCase();
          if (hash) str = '0x' + str;
          break;
          str = f.toLocaleString();
          break;
        case 'e':
          str = f.toExponential().toLowerCase();
          break;
        case 'E':
          str = f.toExponential().toUpperCase();
          break;
        case '%':
          f *= 100;
          str = '%';
        case 'f':
        case 'g':
        case 'n':
          // the +1 is to prevent automatic rounding. we remove it after
          var tmp = f.toFixed(maxw > -1 ? maxw + 1 : 1);
          str = tmp.substr(0, tmp.length - 1).toLowerCase() + str;
          break;
        case 'F':
        case 'G':
        case 'N':
          str = f.toFixed(maxw > -1 ? maxw + 1 : 1);
          str = str.substr(0, str.length - 1).toUpperCase();
          break;
        case 'j':
          str = tryStringify(f);
          break;
        case 'd':
        default:
          str = f.toString(); // automatically converts everything not specified above
          break;
      }
    } else {
      str = f.toString();
    }

    // sign
    if (num) {
      switch (sign) {
        case '+':
          sign = f < 0 ? '-' : '+';
          break;
        case '-':
          sign = f < 0 ? '-' : '';
          break;
        case ' ':
          sign = f < 0 ? '-' : ' ';
          break;
      }
      if (str[0] == '-') str = str.substr(1);
    }

    // cut to maxw
    if (!num && maxw > -1) {
      str = str.substr(0, maxw);
    }

    // pad to minw
    if (str.length < minw) {
      var miss = minw - str.length;
      switch(align) {
        case '=':
          if (num) {
            str = sign + fill.repeat(miss - sign.length);
            break;
          }
        case '<':
          if (num) str = sign + str + fill.repeat(miss - sign.length);
          else str = str + fill.repeat(miss);
          break;
        case '>':
          if (num) str = fill.repeat(miss - sign.length) + sign + str;
          else str = fill.repeat(miss) + str;
          break;
        case '^':
          var half = Math.ceil(miss / 2);
          str = fill.repeat(half - sign.length) + sign + str + fill.repeat(miss - half);
          break;
      }
    }

    return str;
  }

  const aformat = String.prototype.aformat = function() {
    const args = Array.prototype.slice.call(arguments);
    if (!args.length) return this;
    if (args[args.length - 1] instanceof Object) Object.assign(args, args[args.length - 1]);

    return this.replace(/{([^{}]+(?:\:{[^{}]+})?)}/g, function(_, match) {
      var fmt = null;
      if (~match.indexOf(':')) {
        match = aformat.apply(match, args).split(':');
        fmt = match[1];
        match = match[0];
      }
      var res = match.split('.').reduce(function(prev, cur) {
        return prev[cur];
      }, args);
      return doAformat(res, fmt || '');
    });
  }
})();