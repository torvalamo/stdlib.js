# stdlib.js

A JavaScript standard library.

## Use

    const stdlib = require('./stdlib')
    
    stdlib.globalize() // globalizes all functions to their respective prototypes

### String

#### String.prototype.wrap(before, [after])

Prepends and appends the `before` and `after` strings to `this` and returns it.

If `after` is not set, and the length of `before` is an even number, then `before` will be split and wrapped around the string. If `after` is not set, and the length of `before` is an odd number, it will be copied to both sides, unless `after` is set to `null` explicitly.

    ('My string.').wrap('a', 'b')
    // aMy string.b
    
    ('My string.').wrap('\'')
    // 'My string.'
    
    ('My string.').wrap('\'', null)
    // aMy string.

#### String.prototype.format([...args])

Almost exact copy of Node's [util.format](https://nodejs.org/dist/latest-v5.x/docs/api/util.html#util_util_format_format), which again takes its inspiration from C's `printf`.

#### String.prototype.aformat([...args], [kwargs])

Almost exact copy of Python's [Advanced String Formatting](https://www.python.org/dev/peps/pep-3101/).

The exceptions are:

- JS does not differentiate between floats and integers on a type level, so that the `n` and `g` types will always return the same as `f`.
- This version does not support explicit conversion flags
- Also obviously the duck typed `__format__` stuff is not supported.

### Object

#### Object.prototype.assign(...sources)

Similar to the native `Object.assign` except it is recursive when possible. Note that this is on the prototype object. Returns the modified object.

#### Object.prototype.merge(...sources)

Similar to the native `Object.assign` except it is _always_ recursive, and will _never_ overwrite objects with non-objects.

### Array

None yet.

### Math

None yet.

### Number

None yet.