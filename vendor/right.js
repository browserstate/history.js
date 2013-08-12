/**
 * RightJS v2.3.1 - http://rightjs.org
 * Released under the terms of MIT license
 *
 * Copyright (C) 2008-2012 Nikolay Nemshilov
 */
/**
 * The basic layout for RightJS builds
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var RightJS = (function(window, document, Object, Array, String, Function, Number, Math, undefined) {

/**
 * The framework description object
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var RightJS = function(value) {
  return value; // <- a dummy method to emulate the safe-mode
};

RightJS.version = "2.3.1";
RightJS.modules =["core", "dom", "form", "events", "xhr", "fx", "cookie"];



/**
 * There are some util methods
 *
 * Credits:
 *   Some of the functionality and names are inspired or copied from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */

/**
 * Some top-level variables to shortify the things
 */
var A_proto = Array.prototype,
to_s = Object.prototype.toString, slice = A_proto.slice,
HTML = document.documentElement, UID = 1,       // !#server
Wrappers_Cache = [], UID_KEY = 'uniqueNumber',  // DON'T change the UID_KEY!

/**
 * extends the first object with the keys and values of the second one
 *
 * NOTE: the third optional argument tells if the existing values
 *       of the first object should _NOT_ get updated by the values of the second object
 *
 * @param oritinal Object destintation object
 * @param source Object source object
 * @param Boolean flag if the function should not overwrite intersecting values
 * @return Object extended destination object
 */
$ext = RightJS.$ext = function(dest, source, dont_overwrite) {
  var src = source || {}, key;

  for (key in src) {
    if (!dont_overwrite || !(key in dest)) {
      dest[key] = src[key];
    }
  }

  return dest;
},

/** !#server
 * evals the given javascript text in the context of the current window
 *
 * @param String javascript
 * @return void
 */
$eval = RightJS.$eval = function(text) {
  if (text) {
    if ('execScript' in window) {
      current_Document.win()._.execScript(text);
    } else {
      $E('script', {text: text}).insertTo(HTML);
    }
  }
},

/**
 * throws an exception to break iterations throw a callback
 *
 * @return void
 * @throws Break
 */
$break = RightJS.$break = function() {
  throw new Break();
},

/**
 * generates aliases for the object properties
 *
 * @param object Object object
 * @param names Object aliases hash
 * @return Object the extended objects
 */
$alias = RightJS.$alias = function(object, names) {
  for (var new_name in names) {
    object[new_name] = object[names[new_name]];
  }
  return object;
},

/**
 * checks if the given value or a reference points
 * to a really defined value
 *
 * NOTE: will return true for variables equal to null, false, 0, and so one.
 *
 * EXAMPLE:
 *
 *   var smth = null;
 *   defined(smth); <- will return true
 *
 *   var obj = {};
 *   defined(obj['smth']); <- will return false
 *
 * @param mixed value
 * @return boolean check result
 */
defined = RightJS.defined = function(value) {
  return typeof(value) !== 'undefined';
},


/**
 * checks if the given value is a function
 *
 * @param mixed value
 * @return boolean check result
 */
isFunction = RightJS.isFunction = function(value) {
  return typeof(value) === 'function';
},

/**
 * checks if the given value is a string
 *
 * @param mixed value
 * @return boolean check result
 */
isString = RightJS.isString = function(value) {
  return typeof(value) === 'string';
},


/**
 * checks if the given value is a number
 *
 * @param mixed value to check
 * @return boolean check result
 */
isNumber = RightJS.isNumber = function(value) {
  return typeof(value) === 'number' && !isNaN(value);
},

/**
 * checks if the given value is a hash-like object
 *
 * @param mixed value
 * @return boolean check result
 */
isHash = RightJS.isHash = function(value) {
  return to_s.call(value) === '[object Object]';
},

/**
 * checks if the given value is an array
 *
 * @param mixed value to check
 * @return boolean check result
 */
isArray = RightJS.isArray = function(value) {
  return to_s.call(value) === '[object Array]';
},

/** !#server
 * checks if the given value is an element
 *
 * @param mixed value to check
 * @return boolean check result
 */
isElement = RightJS.isElement = function(value) {
  return value != null && value.nodeType === 1;
},

/** !#server
 * checks if the given value is a DOM-node
 *
 * @param mixed value to check
 * @return boolean check result
 */
isNode = RightJS.isNode = function(value) {
  return value != null && value.nodeType != null;
},

/** !#server
 * searches an element by id and/or extends it with the framework extentions
 *
 * @param String element id or Element to extend
 * @return Element or null
 */
$ = RightJS.$ = function(object) {
  if (object instanceof Wrapper) {
    return object;
  } else if (typeof object === 'string') {
    object = document.getElementById(object);
  }

  return wrap(object);
},

/** !#server
 * Finds all the elements in the document by the given css_rule
 *
 * @param String element
 * @param Boolean raw search marker
 * @return Array search result
 */
$$ = RightJS.$$ = function(css_rule, raw) {
  return current_Document.find(css_rule, raw);
},

/** !#server
 * shortcut to instance new elements
 *
 * @param String tag name
 * @param object options
 * @return Element instance
 */
$E = RightJS.$E = function(tag_name, options) {
  return new Element(tag_name, options);
},

/**
 * shortcut, generates an array of words from a given string
 *
 * @param String string
 * @return Array of words
 */
$w = RightJS.$w = function(string) {
  return string.trim().split(/\s+/);
},

/**
 * generates an unique id for an object
 *
 * @param Object object
 * @return Integer uniq id
 */
$uid = RightJS.$uid = function(item) {
  return UID_KEY in item ? item[UID_KEY] : (item[UID_KEY] = UID++);
},

/**
 * converts any iterables into an array
 *
 * @param Object iterable
 * @return Array list
 */
$A = RightJS.$A = function(it) {
  return slice.call(it, 0);
};

/** !#server
 * IE needs a patch for the $A function
 * because it doesn't handle all the cases
 */
if (!A_proto.map) {
  $A = RightJS.$A = function(it) {
    try {
      return slice.call(it, 0);
    } catch(e) {
      for (var a=[], i=0, length = it.length; i < length; i++) {
        a[i] = it[i];
      }
      return a;
    }
  };
}

/** !#server
 * Internet Explorer needs some additional mumbo-jumbo in here
 */
if (isHash(HTML)) {
  isHash = RightJS.isHash = function(value) {
    return to_s.call(value) === '[object Object]' &&
      value != null && value.hasOwnProperty != null;
  };
}


/**
 * Generating methods for native units extending
 */
// adds a standard '.include' method to the native unit
function extend_native(klass) {
  return $ext(klass, {
    Methods: {},
    include: function() {
      for (var i=0, l = arguments.length; i < l; i++) {
        if (isHash(arguments[i])) {
          $ext(klass.prototype, arguments[i]);
          $ext(klass.Methods,   arguments[i]);
        }
      }
    }
  });
}

for (var i=0, natives = 'Array Function Number String Date RegExp'.split(' '); i < natives.length; i++) {
  RightJS[natives[i]] = extend_native(new Function('return '+ natives[i])());
}

// referring those two as well
RightJS.Object = Object;
RightJS.Math   = Math;


/**
 * Checks if the data is an array and if not,
 * then makes an array out of it
 *
 * @param mixed in data
 * @return Array data
 */
function ensure_array(data) {
  return isArray(data) ? data : [data];
}


/**
 * The Object class extentions
 *
 * Credits:
 *   Some functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
$ext(Object, {
  /**
   * extracts the list of the attribute names of the given object
   *
   * @param Object object
   * @return Array keys list
   */
  keys: function(object) {
    var keys = [], key;
    for (key in object) {
      keys.push(key);
    }
    return keys;
  },

  /**
   * extracts the list of the attribute values of the given object
   *
   * @param Object object
   * @return Array values list
   */
  values: function(object) {
    var values = [], key;
    for (key in object) {
      values.push(object[key]);
    }
    return values;
  },

  /**
   * Calls the function with every key/value pair on the hash
   *
   * @param in Object the data hash
   * @param Function the callback
   * @param scope Object an optional scope
   * @return Object the original hash
   */
  each: function(object, callback, scope) {
    for (var key in object) {
      callback.call(scope, key, object[key]);
    }

    return object;
  },

  /**
   * checks if the object-hash has no keys
   *
   * @param Object object
   * @return check result
   */
  empty: function(object) {
    for (var key in object) { return false; }
    return true;
  },

  /**
   * A simple cloning method
   * NOTE: does not clone the things recoursively!
   *
   * @param Object object
   * @return Object clone
   */
  clone: function(object) {
    return Object.merge(object);
  },

  /**
   * returns a copy of the object which contains
   * all the same keys/values except the key-names
   * passed the the method arguments
   *
   * @param Object object
   * @param String key-name to exclude
   * .....
   * @return Object filtered copy
   */
  without: function() {
    var filter = $A(arguments), object = filter.shift(), copy = {}, key;

    for (key in object) {
      if (!filter.include(key)) {
        copy[key] = object[key];
      }
    }

    return copy;
  },

  /**
   * returns a copy of the object which contains all the
   * key/value pairs from the specified key-names list
   *
   * NOTE: if some key does not exists in the original object, it will be just skipped
   *
   * @param Object object
   * @param String key name to exclude
   * .....
   * @return Object filtered copy
   */
  only: function() {
    var filter = $A(arguments), object = filter.shift(), copy = {},
        i=0, length = filter.length;

    for (; i < length; i++) {
      if (filter[i] in object) {
        copy[filter[i]] = object[filter[i]];
      }
    }

    return copy;
  },

  /**
   * merges the given objects and returns the result
   *
   * NOTE this method _DO_NOT_ change the objects, it creates a new object
   *      which conatins all the given ones.
   *      if there is some keys introspections, the last object wins.
   *      all non-object arguments will be omitted
   *
   * @param first Object object
   * @param second Object mixing
   * ......
   * @return Object merged object
   */
  merge: function() {
    var object = {}, i=0, args=arguments, l=args.length, key;
    for (; i < l; i++) {
      if (isHash(args[i])) {
        for (key in args[i]) {
          object[key] = isHash(args[i][key]) && !(args[i][key] instanceof Class) ?
            Object.merge(key in object ? object[key] : {}, args[i][key]) : args[i][key];
        }
      }
    }
    return object;
  },

  /**
   * converts a hash-object into an equivalent url query string
   *
   * @param Object object
   * @return String query
   */
  toQueryString: function(object) {
    var entries = to_query_string_map(object), i=0, result = [];

    for (; i < entries.length; i++) {
      result.push(encodeURIComponent(entries[i][0]) + "=" + encodeURIComponent(''+entries[i][1]));
    }

    return result.join('&');
  }
}, true);

// private

/**
 * pre-converts nested objects into a flat key-value structure
 *
 * @param {Object} data-hash
 * @param {String} key-prefix
 * @return {Array} key-value pairs
 */
function to_query_string_map(hash, prefix) {
  var result = [], key, value, i;

  for (key in hash) {
    value = hash[key];
    if (prefix) {
      key = prefix + "["+ key + "]";
    }

    if (typeof(value) === 'object') {
      if (isArray(value)) {
        if (!key.endsWith('[]')) {
          key += "[]";
        }
        for (i=0; i < value.length; i++) {
          result.push([key, value[i]]);
        }
      } else if (value) { // assuming it's an object
        value = to_query_string_map(value, key);
        for (i=0; i < value.length; i++) {
          result.push(value[i]);
        }
      }
    } else {
      result.push([key, value]);
    }
  }

  return result;
}

/**
 * here are the starndard Math object extends
 *
 * Credits:
 *   The idea of random mehtod is taken from
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var Math_old_random = Math.random;

/**
 * the standard random method replacement, to make it more useful
 *
 * USE:
 *   Math.random();    // original functionality, returns a float between 0 and 1
 *   Math.random(10);  // returns an integer between 0 and 10
 *   Math.random(1,4); // returns an integer between 1 and 4
 *
 * @param min Integer minimum value if there's two arguments and maximum value if there's only one
 * @param max Integer maximum value
 * @return Float random between 0 and 1 if there's no arguments or an integer in the given range
 */
Math.random = function(min, max) {

  if (arguments.length === 0) {
    return Math_old_random();
  } else if (arguments.length === 1) {
    max = min;
    min = 0;
  }

  return ~~(Math_old_random() * (max-min+1) + ~~min);
};


/**
 * The Array class extentions
 *
 * Credits:
 *   Some of the functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */
var original_sort = A_proto.sort,

// JavaScript 1.6 methods recatching up or faking
for_each = A_proto.forEach || function(callback, scope) {
  for (var i=0, l=this.length; i < l; i++) {
    callback.call(scope, this[i], i, this);
  }
},

filter   = A_proto.filter || function(callback, scope) {
  for (var result=[], j=0, i=0, l=this.length; i < l; i++) {
    if (callback.call(scope, this[i], i, this)) {
      result[j++] = this[i];
    }
  }
  return result;
},

reject   = function(callback, scope) {
  for (var result=[], j=0, i=0, l=this.length; i < l; i++) {
    if (!callback.call(scope, this[i], i, this)) {
      result[j++] = this[i];
    }
  }
  return result;
},

map      = A_proto.map || function(callback, scope) {
  for (var result=[], i=0, l=this.length; i < l; i++) {
    result[i] = callback.call(scope, this[i], i, this);
  }
  return result;
},

some     = A_proto.some || function(callback, scope) {
  for (var i=0, l=this.length; i < l; i++) {
    if (callback.call(scope, this[i], i, this)) {
      return true;
    }
  }
  return false;
},

every    = A_proto.every || function(callback, scope) {
  for (var i=0, l=this.length; i < l; i++) {
    if (!callback.call(scope, this[i], i, this)) {
      return false;
    }
  }
  return true;
},

first    = function(callback, scope) {
  for (var i=0, l=this.length; i < l; i++) {
    if (callback.call(scope, this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
},

last     = function(callback, scope) {
  for (var i=this.length-1; i > -1; i--) {
    if (callback.call(scope, this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
};


//
// RightJS callbacks magick preprocessing
//

// prepares a correct callback function
function guess_callback(argsi, array) {
  var callback = argsi[0], args = slice.call(argsi, 1), scope = array, attr;

  if (typeof(callback) === 'string') {
    attr = callback;
    if (array.length !== 0 && typeof(array[0][attr]) === 'function') {
      callback = function(object) { return object[attr].apply(object, args); };
    } else {
      callback = function(object) { return object[attr]; };
    }
  } else {
    scope = args[0];
  }

  return [callback, scope];
}

// defining the manual break errors class
function Break() {}

// calls the given method with preprocessing the arguments
function call_method(func, scope, args) {
  try {
    return func.apply(scope, guess_callback(args, scope));
  } catch(e) { if (!(e instanceof Break)) { throw(e); } }

  return undefined;
}

// checks the value as a boolean
function boolean_check(i) {
  return !!i;
}

// default sorting callback
function default_sort(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}

Array.include({
  /**
   * IE fix
   * returns the index of the value in the array
   *
   * @param mixed value
   * @param Integer optional offset
   * @return Integer index or -1 if not found
   */
  indexOf: A_proto.indexOf || function(value, from) {
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0, l=this.length; i < l; i++) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  },

  /**
   * IE fix
   * returns the last index of the value in the array
   *
   * @param mixed value
   * @return Integer index or -1 if not found
   */
  lastIndexOf: A_proto.lastIndexOf || function(value) {
    for (var i=this.length-1; i > -1; i--) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  },

  /**
   * returns the first element of the array
   *
   * @return mixed first element of the array
   */
  first: function() {
    return arguments.length ? call_method(first, this, arguments) : this[0];
  },

  /**
   * returns the last element of the array
   *
   * @return mixed last element of the array
   */
  last: function() {
    return arguments.length ? call_method(last, this, arguments) : this[this.length-1];
  },

  /**
   * returns a random item of the array
   *
   * @return mixed a random item
   */
  random: function() {
    return this.length === 0 ? undefined : this[Math.random(this.length-1)];
  },

  /**
   * returns the array size
   *
   * @return Integer the array size
   */
  size: function() {
    return this.length;
  },

  /**
   * cleans the array
   * @return Array this
   */
  clean: function() {
    this.length = 0;
    return this;
  },

  /**
   * checks if the array has no elements in it
   *
   * @return boolean check result
   */
  empty: function() {
    return this.length === 0;
  },

  /**
   * creates a copy of the given array
   *
   * @return Array copy of the array
   */
  clone: function() {
    return this.slice(0);
  },

  /**
   * calls the given callback function in the given scope for each element of the array
   *
   * @param Function callback
   * @param Object scope
   * @return Array this
   */
  each: function() {
    call_method(for_each, this, arguments);
    return this;
  },
  forEach: for_each,

  /**
   * creates a list of the array items converted in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array collected
   */
  map: function() {
    return call_method(map, this, arguments);
  },

  /**
   * creates a list of the array items which are matched in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array filtered copy
   */
  filter: function() {
    return call_method(filter, this, arguments);
  },

  /**
   * creates a list of the array items that are not matching the give callback function
   *
   * @param Function callback
   * @param Object optionl scope
   * @return Array filtered copy
   */
  reject: function() {
    return call_method(reject, this, arguments);
  },

  /**
   * checks if any of the array elements is logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return boolean check result
   */
  some: function(value) {
    return call_method(some, this, value ? arguments : [boolean_check]);
  },

  /**
   * checks if all the array elements are logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  every: function(value) {
    return call_method(every, this, value ? arguments : [boolean_check]);
  },

  /**
   * applies the given lambda to each element in the array
   *
   * NOTE: changes the array by itself
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array this
   */
  walk: function() {
    this.map.apply(this, arguments).forEach(function(value, i) { this[i] = value; }, this);
    return this;
  },

  /**
   * similar to the concat function but it adds only the values which are not on the list yet
   *
   * @param Array to merge
   * ....................
   * @return Array new merged
   */
  merge: function() {
    for (var copy = this.clone(), arg, i=0; i < arguments.length; i++) {
      arg = ensure_array(arguments[i]);

      for (var j=0; j < arg.length; j++) {
        if (copy.indexOf(arg[j]) == -1) {
          copy.push(arg[j]);
        }
      }
    }
    return copy;
  },

  /**
   * flats out complex array into a single dimension array
   *
   * @return Array flatten copy
   */
  flatten: function() {
    var copy = [];
    this.forEach(function(value) {
      if (isArray(value)) {
        copy = copy.concat(value.flatten());
      } else {
        copy.push(value);
      }
    });
    return copy;
  },

  /**
   * returns a copy of the array whithout any null or undefined values
   *
   * @return Array filtered version
   */
  compact: function() {
    return this.without(null, undefined);
  },

  /**
   * returns a copy of the array which contains only the unique values
   *
   * @return Array filtered copy
   */
  uniq: function() {
    return [].merge(this);
  },

  /**
   * checks if all of the given values
   * exists in the given array
   *
   * @param mixed value
   * ....
   * @return boolean check result
   */
  includes: function() {
    for (var i=0; i < arguments.length; i++) {
      if (this.indexOf(arguments[i]) === -1) {
        return false;
      }
    }
    return true;
  },

  /**
   * returns a copy of the array without the items passed as the arguments
   *
   * @param mixed value
   * ......
   * @return Array filtered copy
   */
  without: function() {
    var filter = slice.call(arguments);
    return this.filter(function(value) {
      return filter.indexOf(value) === -1;
    });
  },

  /**
   * Shuffles the array items in a random order
   *
   * @return Array shuffled version
   */
  shuffle: function() {
    var shuff = this.clone(), j, x, i = shuff.length;

    for (; i > 0; j = Math.random(i-1), x = shuff[--i], shuff[i] = shuff[j], shuff[j] = x) {}

    return shuff;
  },

  /**
   * Default sort fix for numeric values
   *
   * @param Function callback
   * @return Array self
   */
  sort: function(callback) {
    return original_sort.apply(this, (callback || !isNumber(this[0])) ? arguments : [default_sort]);
  },

  /**
   * sorts the array by running its items though a lambda or calling their attributes
   *
   * @param Function callback or attribute name
   * @param Object scope or attribute argument
   * @return Array sorted copy
   */
  sortBy: function() {
    var pair = guess_callback(arguments, this);

    return this.sort(function(a, b) {
      return default_sort(
        pair[0].call(pair[1], a),
        pair[0].call(pair[1], b)
      );
    });
  },

  /**
   * Returns the minimal value on the list
   *
   * @return Number minimal value
   */
  min: function() {
    return Math.min.apply(Math, this);
  },

  /**
   * Returns the maximal value
   *
   * @return Number maximal value
   */
  max: function() {
    return Math.max.apply(Math, this);
  },

  /**
   * Returns a summ of all the items on the list
   *
   * @return Number a summ of values on the list
   */
  sum: function() {
    for(var sum=0, i=0, l=this.length; i < l; sum += this[i++]) {}
    return sum;
  }
});

A_proto.include = A_proto.includes;


/**
 * The String class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The trim function taken from work of Steven Levithan
 *     - http://blog.stevenlevithan.com/archives/faster-trim-javascript
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
String.include({
  /**
   * checks if the string is an empty string
   *
   * @return boolean check result
   */
  empty: function() {
    return this == '';
  },

  /**
   * checks if the string contains only white-spaces
   *
   * @return boolean check result
   */
  blank: function() {
    return this == false;
  },

  /**
   * removes trailing whitespaces
   *
   * @return String trimmed version
   */
  trim: String.prototype.trim || function() {
    var str = this.replace(/^\s\s*/, ''), i = str.length;
    while ((/\s/).test(str.charAt(--i))) {}
    return str.slice(0, i + 1);
  },

  /**
   * returns a copy of the string with all the tags removed
   * @return String without tags
   */
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/ig, '');
  },

  /**
   * removes all the scripts declarations out of the string
   * @param mixed option. If it equals true the scrips will be executed,
   *                      if a function the scripts will be passed in it
   * @return String without scripts
   */
  stripScripts: function(option) {
    var scripts = '', text = this.replace(
      /<script[^>]*>([\s\S]*?)<\/script>/img,
      function(match, source) {
        scripts += source + "\n";
        return '';
      }
    );

    if (option === true) {
      $eval(scripts);
    } else if (isFunction(option)) {
      option(scripts, text);
    }

    return text;
  },

  /**
   * extracts all the scripts out of the string
   *
   * @return String the extracted stcripts
   */
  extractScripts: function() {
    var scripts = '';
    this.stripScripts(function(s) { scripts = s; });
    return scripts;
  },

  /**
   * evals all the scripts in the string
   *
   * @return String self (unchanged version with scripts still in their place)
   */
  evalScripts: function() {
    this.stripScripts(true);
    return this;
  },

  /**
   * converts underscored or dasherized string to a camelized one
   * @returns String camelized version
   */
  camelize: function() {
    return this.replace(/(\-|_)+(.)?/g, function(match, dash, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },

  /**
   * converts a camelized or dasherized string into an underscored one
   * @return String underscored version
   */
  underscored: function() {
    return this.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/\-/g, '_').toLowerCase();
  },

  /**
   * returns a capitalised version of the string
   *
   * @return String captialised version
   */
  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  },

  /**
   * Makes a dashed version of the string
   *
   * @return String dashed version
   */
  dasherize: function() {
    return this.underscored().replace(/_/g, '-');
  },

  /**
   * checks if the string contains the given substring
   *
   * @param String string
   * @return boolean check result
   */
  includes: function(string) {
    return this.indexOf(string) != -1;
  },

  /**
   * checks if the string starts with the given substring
   *
   * @param String string
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  startsWith: function(string, ignorecase) {
    return (ignorecase !== true ? this.indexOf(string) :
      this.toLowerCase().indexOf(string.toLowerCase())
    ) === 0;
  },

  /**
   * checks if the string ends with the given substring
   *
   * @param String substring
   * @param boolean ignore the letters case
   * @return boolean check result
   */
  endsWith: function(string, ignorecase) {
    return this.length - (
      ignorecase !== true ? this.lastIndexOf(string) :
        this.toLowerCase().lastIndexOf(string.toLowerCase())
    ) === string.length;
  },

  /**
   * converts the string to an integer value
   * @param Integer base
   * @return Integer or NaN
   */
  toInt: function(base) {
    return parseInt(this, base === undefined ? 10 : base);
  },

  /**
   * converts the string to a float value
   * @param boolean flat if the method should not use a flexible matching
   * @return Float or NaN
   */
  toFloat: function(strict) {
    return parseFloat(strict === true ? this :
      this.replace(',', '.').replace(/(\d)-(\d)/, '$1.$2'));
  }

});

String.prototype.include = String.prototype.includes;


/**
 * The Function class extentions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Function.include({
  /**
   * binds the function to be executed in the given scope
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * ....
   * @return Function binded function
   */
  bind: function() {
    var args = $A(arguments), scope = args.shift(), func = this;
    return function() {
      return func.apply(scope,
        (args.length !== 0 || arguments.length !== 0) ?
          args.concat($A(arguments)) : args
      );
    };
  },

  /**
   * binds the function as an event listener to the given scope object
   *
   * @param Object scope
   * @param mixed optional curry (left) argument
   * .......
   * @return Function binded function
   */
  bindAsEventListener: function() {
    var args = $A(arguments), scope = args.shift(), func = this;
    return function(event) {
      return func.apply(scope, [event].concat(args).concat($A(arguments)));
    };
  },

  /**
   * allows you to put some curry in your cookery
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  curry: function() {
    return this.bind.apply(this, [this].concat($A(arguments)));
  },

  /**
   * The right side curry feature
   *
   * @param mixed value to curry
   * ....
   * @return Function curried function
   */
  rcurry: function() {
    var curry = $A(arguments), func = this;
    return function() {
      return func.apply(func, $A(arguments).concat(curry));
    };
  },

  /**
   * delays the function execution
   *
   * @param Integer delay ms
   * @param mixed value to curry
   * .....
   * @return Integer timeout marker
   */
  delay: function() {
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(setTimeout(this.bind.apply(this, [this].concat(args)), timeout));

    timer.cancel = function() { clearTimeout(this); };

    return timer;
  },

  /**
   * creates a periodical execution of the function with the given timeout
   *
   * @param Integer delay ms
   * @param mixed value to curry
   * ...
   * @return Ineger interval marker
   */
  periodical: function() {
    var args  = $A(arguments), timeout = args.shift(),
        timer = new Number(setInterval(this.bind.apply(this, [this].concat(args)), timeout));

    timer.stop = function() { clearInterval(this); };

    return timer;
  },

  /**
   * Chains the given function after the current one
   *
   * @param Function the next function
   * @param mixed optional value to curry
   * ......
   * @return Function chained function
   */
  chain: function() {
    var args = $A(arguments), func = args.shift(), current = this;
    return function() {
      var result = current.apply(current, arguments);
      func.apply(func, args);
      return result;
    };
  }
});


/**
 * The Number class extentions
 *
 * Credits:
 *   Some methods inspired by
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Number.include({
  /**
   * executes the given callback the given number of times
   *
   * @param Function callback
   * @param Object optional callback execution scope
   * @return void
   */
  times: function(callback, scope) {
    for (var i=0; i < this; i++) {
      callback.call(scope, i);
    }
    return this;
  },

  upto: function(number, callback, scope) {
    for (var i=this+0; i <= number; i++) {
      callback.call(scope, i);
    }
    return this;
  },

  downto: function(number, callback, scope) {
    for (var i=this+0; i >= number; i--) {
      callback.call(scope, i);
    }
    return this;
  },

  /**
   * Maps a list of numbers from current to given
   * or map a result of calls of the callback on those numbers
   *
   * @param {Number} end number
   * @param {Function} optional callback
   * @param {Object} optional callback scope
   * @return {Array} the result list
   */
  to: function(number, callback, scope) {
    var start = this + 0, end = number, result = [], i=start;

    callback = callback || function(i) { return i; };

    if (end > start) {
      for (; i <= end; i++) {
        result.push(callback.call(scope, i));
      }
    } else {
      for (; i >= end; i--) {
        result.push(callback.call(scope, i));
      }
    }

    return result;
  },

  abs: function() {
    return Math.abs(this);
  },

  round: function(size) {
    return size ? parseFloat(this.toFixed(size)) : Math.round(this);
  },

  ceil: function() {
    return Math.ceil(this);
  },

  floor: function() {
    return Math.floor(this);
  },

  min: function(value) {
    return this < value ? value : this + 0;
  },

  max: function(value) {
    return this > value ? value : this + 0;
  }
});


/**
 * The Regexp class extentions
 *
 * Credits:
 *   Inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */


 /**
  * Escapes the string for safely use as a regular expression
  *
  * @param String raw string
  * @return String escaped string
  */
RegExp.escape = function(string) {
  return (''+string).replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
};


if (!window.JSON) {
  window.JSON = (function() {
    var
    // see the original JSON decoder implementation for descriptions http://www.json.org/json2.js
    cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    specials = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},
    quotables = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;


    // quotes the string
    function quote(string) {
      return string.replace(quotables, function(chr) {
        return specials[chr] || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4);
      });
    }

    // adds the leading zero symbol
    function zerofy(num) {
      return (num < 10 ? '0' : '')+num;
    }

    return {
      stringify: function(value) {
        switch(typeof(value)) {
          case 'boolean': return String(value);
          case 'number':  return String(value+0);
          case 'string':  return '"'+ quote(value) + '"';
          case 'object':
            if (value === null) {
              return 'null';
            } else if (isArray(value)) {
              return '['+$A(value).map(JSON.stringify).join(',')+']';

            } else if (to_s.call(value) === '[object Date]') {
              return '"' + value.getUTCFullYear() + '-' +
                zerofy(value.getUTCMonth() + 1)   + '-' +
                zerofy(value.getUTCDate())        + 'T' +
                zerofy(value.getUTCHours())       + ':' +
                zerofy(value.getUTCMinutes())     + ':' +
                zerofy(value.getUTCSeconds())     + '.' +
                zerofy(value.getMilliseconds())   + 'Z' +
              '"';

            } else {
              var result = [], key;
              for (key in value) {
                result.push('"'+key+'":'+JSON.stringify(value[key]));
              }
              return '{'+result.join(',')+'}';
            }
        }
      },

      parse: function(string) {
        if (isString(string) && string) {
          // getting back the UTF-8 symbols
          string = string.replace(cx, function (a) {
            return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          });

          // checking the JSON string consistency
          if (/^[\],:{}\s]*$/.test(string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
              return new Function('return '+string)();
            }
        }

        throw "JSON parse error: "+string;
      }
    };
  })();
}

/**
 * The basic Class unit
 *
 * Credits:
 *   The Class unit is inspired by its implementation in
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Ruby      (http://www.ruby-lang.org) Copyright (C) Yukihiro Matsumoto
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var Class = RightJS.Class = function() {
  var args   = $A(arguments).slice(0,2),
      props  = args.pop() || {},
      parent = args.pop(),
      klass  = arguments[2], // you can send your own klass as the third argument
      SKlass = function() {};

  // if the parent class only was specified
  if (!args.length && !isHash(props)) {
    parent = props; props = {};
  }

// !#server:begin
  if (!klass && parent && (parent === Wrapper || parent.ancestors.include(Wrapper))) {
    klass = Wrapper_makeKlass();
  }
// !#server:end

  // defining the basic klass function
  klass = $ext(klass || function() {
    Class_checkPrebind(this);
    return 'initialize' in this ?
      this.initialize.apply(this, arguments) :
      this;
  }, Class_Methods);

  // handling the inheritance
  parent = parent || Class;

  SKlass.prototype = parent.prototype;
  klass.prototype  = new SKlass();
  klass.parent     = parent;
  klass.prototype.constructor = klass;

  // collecting the list of ancestors
  klass.ancestors = [];
  while (parent) {
    klass.ancestors.push(parent);
    parent = parent.parent;
  }

  // handling the module injections
  ['extend', 'include'].each(function(name) {
    if (name in props) {
      klass[name].apply(klass, ensure_array(props[name]));
    }
  });

  return klass.include(props);
},

/**
 * Class utility methods
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
Class_Methods = {
  /**
   * this method will extend the class-level with the given objects
   *
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   *
   * NOTE: this method _WILL_NOT_OVERWRITE_ the class prototype and
   *       the class 'name' and 'parent' attributes. If one of those
   *       exists in one of the received modeuls, the attribute will be
   *       skipped
   *
   * @param Object module to extend
   * ....
   * @return Class the klass
   */
  extend: function() {
    $A(arguments).filter(isHash).each(function(module) {
      $ext(this, Class_clean_module(module, true));
      Class_handle_module_callbacks(this, module, true);
    }, this);

    return this;
  },

  /**
   * extends the class prototype with the given objects
   * NOTE: this method _WILL_OVERWRITE_ the existing itercecting entries
   * NOTE: this method _WILL_NOT_OVERWRITE_ the 'klass' attribute of the klass.prototype
   *
   * @param Object module to include
   * ....
   * @return Class the klass
   */
  include: function() {
    var klasses = [this].concat(this.ancestors);

    $A(arguments).filter(isHash).each(function(module) {
      Object.each(Class_clean_module(module, false), function(name, method) {
        // searching for the super-method
        for (var super_method, i=0, l = klasses.length; i < l; i++) {
          if (name in klasses[i].prototype) {
            super_method = klasses[i].prototype[name];
            break;
          }
        }

        this.prototype[name] = isFunction(method) && isFunction(super_method) ?
          function() {
            this.$super = super_method;
            return method.apply(this, arguments);
          } : method;
      }, this);

      Class_handle_module_callbacks(this, module, false);
    }, this);

    return this;
  }
},

Class_module_callback_names = $w(
  'selfExtended self_extended selfIncluded self_included extend include'
);

// hooking up the class-methods to the root class
$ext(Class, Class_Methods);
Class.prototype.$super = undefined;

function Class_clean_module(module, extend) {
  return Object.without.apply(Object, [module].concat(
    Class_module_callback_names.concat( extend ?
      $w('prototype parent ancestors') : ['constructor']
    )
  ));
}

function Class_handle_module_callbacks(klass, module, extend) {
  (module[Class_module_callback_names[extend ? 0 : 2]] ||
   module[Class_module_callback_names[extend ? 1 : 3]] ||
   function() {}
  ).call(module, klass);
}

/**
 * This method gets through a list of the object its class and all the ancestors
 * and finds a hash named after property, used for configuration purposes with
 * the Observer and Options modules
 *
 * NOTE: this method will look for capitalized and uppercased versions of the
 *       property name
 *
 * @param Object a class instance
 * @param String property name
 * @return Object hash or null if nothing found
 */
function Class_findSet(object, property) {
  var upcased   = property.toUpperCase(),
    constructor = object.constructor,
    candidates  = [object, constructor].concat(constructor.ancestors || []),
    i = 0;

  for (l = candidates.length; i < l; i++) {
    if (upcased in candidates[i]) {
      return candidates[i][upcased];
    } else if (property in candidates[i]) {
      return candidates[i][property];
    }
  }

  return null;
}

/**
 * Handles the 'prebind' feature for Class instances
 *
 * @param Class instance
 * @return void
 */
function Class_checkPrebind(object) {
  if ('prebind' in object && isArray(object.prebind)) {
    object.prebind.each(function(method) {
      object[method] = object[method].bind(object);
    });
  }
}

/**
 * This is a simple mix-in module to be included in other classes
 *
 * Basically it privdes the <tt>setOptions</tt> method which processes
 * an instance options assigment and merging with the default options
 *
 * Credits:
 *   The idea of the module is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
var Options = RightJS.Options = {
  /**
   * assigns the options by merging them with the default ones
   *
   * @param Object options
   * @return Object current instance
   */
  setOptions: function(opts) {
    var options = this.options = $ext($ext({},
      Object.clone(Class_findSet(this, 'Options'))), opts
    ), match, key;

    // hooking up the observer options
    if (isFunction(this.on)) {
      for (key in options) {
        if ((match = key.match(/on([A-Z][A-Za-z]+)/))) {
          this.on(match[1].toLowerCase(), options[key]);
          delete(options[key]);
        }
      }
    }

    return this;
  },

  /**
   * Cuts of an options hash from the end of the arguments list
   * assigns them using the #setOptions method and then
   * returns the list of other arguments as an Array instance
   *
   * @param mixed iterable
   * @return Array of the arguments
   */
  cutOptions: function(in_args) {
    var args = $A(in_args);
    this.setOptions(isHash(args.last()) ? args.pop() : {});
    return args;
  }
};


/**
 * standard Observer class.
 *
 * Might be used as a usual class or as a builder over another objects
 *
 * Credits:
 *   The naming principle is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var Observer = RightJS.Observer = new Class({
  include: Options,

  /**
   * general constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.setOptions(options);
    Observer_createShortcuts(this, Class_findSet(this, 'Events'));
    return this;
  },

  /**
   * binds an event listener
   *
   * USAGE:
   *  on(String event, Function callback[, arguments, ...]);
   *  on(String event, String method_name[, arguments, ...]);
   *  on(Object events_hash);
   *
   * @return Observer self
   */
  on: function() {
    Observer_on(this, arguments, function(h) { return h; });
    return this;
  },

  /**
   * checks if the observer observes given event and/or callback
   *
   * USAGE:
   *   observes(String event)
   *   observes(Function callback)
   *   observes(String event, Function callback)
   *
   * @retun boolean check result
   */
  observes: function(event, callback) {
    if (!isString(event)) { callback = event; event = null; }
    if (isString(callback)) { callback = callback in this ? this[callback] : null; }

    return (this.$listeners || []).some(function(i) {
      return (event && callback) ? i.e === event && i.f === callback :
        event ? i.e === event : i.f === callback;
    });
  },

  /**
   * stops observing an event or/and function
   *
   * USAGE:
   *   stopObserving(String event)
   *   stopObserving(Function callback)
   *   stopObserving(String event, Function callback)
   *
   * @return Observer self
   */
  stopObserving: function(event, callback) {
    Observer_stopObserving(this, event, callback, function() {});
    return this;
  },

  /**
   * returns the listeners list for the event
   *
   * NOTE: if no event was specified the method will return _all_
   *       event listeners for _all_ the events
   *
   * @param String event name
   * @return Array of listeners
   */
  listeners: function(event) {
    return (this.$listeners || []).filter(function(i) {
      return !event || i.e === event;
    }).map(function(i) { return i.f; }).uniq();
  },

  /**
   * initiates the event handling
   *
   * @param String event name
   * @param mixed optional argument
   * ........
   * @return Observer self
   */
  fire: function() {
    var args = $A(arguments), event = args.shift();

    (this.$listeners || []).each(function(i) {
      if (i.e === event) {
        i.f.apply(this, i.a.concat(args));
      }
    }, this);

    return this;
  }
}),

/**
 * adds an observer functionality to any object
 *
 * @param Object object
 * @param Array optional events list to build shortcuts
 * @return Object extended object
 */
Observer_create = Observer.create =  function(object, events) {
  $ext(object, Object.without(Observer.prototype, 'initialize', 'setOptions'), true);
  return Observer_createShortcuts(object, events || Class_findSet(object, 'Events'));
},

/**
 * builds shortcut methods to wire/fire events on the object
 *
 * @param Object object to extend
 * @param Array list of event names
 * @return Object extended object
 */
Observer_createShortcuts = Observer.createShortcuts = function(object, names) {
  (names || []).each(function(name) {
    var method_name = 'on'+name.replace(/(^|_|:)([a-z])/g,
      function(match, pre, chr) { return chr.toUpperCase(); }
    );

    if (!(method_name in object)) {
      object[method_name] = function() {
        return this.on.apply(this, [name].concat($A(arguments)));
      };
    }
  });

  return object;
};

function Observer_on(object, o_args, preprocess) {
  var args     = slice.call(o_args, 2),
      event    = o_args[0],
      callback = o_args[1],
      name     = false;

  if (isString(event)) {
    switch (typeof callback) {
      case "string":
        name     = callback;
        callback = callback in object ? object[callback] : function() {};

      case "function":
        ('$listeners' in object ? object.$listeners : (
          object.$listeners = []
        )).push(preprocess({
          e: event, f: callback, a: args, r: name || false, t: object
        }));
        break;

      default:
        if (isArray(callback)) {
          for (var i=0; i < callback.length; i++) {
            object.on.apply(object, [event].concat(
              ensure_array(callback[i])
            ).concat(args));
          }
        }
    }

  } else {
    // assuming it's a hash of key-value pairs
    args = slice.call(o_args, 1);

    for (name in event) {
      object.on.apply(object, [name].concat(
        ensure_array(event[name])
      ).concat(args));
    }
  }
}

function Observer_stopObserving(object, event, callback, preprocess) {
  if (isHash(event)) {
    for (var key in event) {
      object.stopObserving(key, event[key]);
    }
  } else {
    if (!isString(event)) {  callback = event; event = null; }
    if (isString(callback)){ callback = object[callback]; }

    object.$listeners = (object.$listeners || []).filter(function(i) {
      var result = (event && callback) ?
        (i.e !== event || i.f !== callback) :
        (event ? i.e !== event : i.f !== callback);

      if (!result) { preprocess(i); }

      return result;
    });
  }
}


/**
 * this object will contain info about the current browser
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
var agent = navigator.userAgent,
    Browser_Opera = 'opera' in window,
    Browser_IE    = 'attachEvent' in window && !Browser_Opera,

Browser = RightJS.Browser = {
  IE:           Browser_IE,
  Opera:        Browser_Opera,
  WebKit:       agent.include('AppleWebKit/'),
  Gecko:        agent.include('Gecko') && !agent.include('KHTML'),
  MobileSafari: /Apple.*Mobile.*Safari/.test(agent),
  Konqueror:    agent.include('Konqueror'),

  // internal marker for the browsers which require the olds module
  OLD:          !document.querySelector,
  // internal marker for IE browsers version <= 8
  IE8L:         false
},

IE8_OR_LESS = false,
IE_OPACITY  = !('opacity' in HTML.style) && ('filter' in HTML.style);

try {
  // checking if that an IE version <= 8
  document.createElement('<input/>');
  Browser.OLD = Browser.IE8L = IE8_OR_LESS = true;
} catch(e) {}


/**
 * The dom-wrapper main unit
 *
 * This unit is basically for the internal use
 * so that we could control the common functionality
 * among all the wrappers
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */

var Wrapper = RightJS.Wrapper = new Class({
  // predefining the property in the prototype
  _: undefined,

  /**
   * Default constructor
   *
   * @param mixed raw dom unit
   * @return void
   */
  initialize: function(raw_object) {
    this._ = raw_object;
  }
});

// exposing the cache so it could be manupulated externally
Wrapper.Cache = Wrappers_Cache;

// instantiating the actual class object for a wrapper
function Wrapper_makeKlass() {
  /**
   * Default wrappers Klass function
   *
   * @param mixed the raw object
   * @param Object options
   * @return void
   */
  return function(object, options) {
    Class_checkPrebind(this);

    this.initialize.apply(this, arguments); // <- there might be a different number of args in a subclass

    var item = this._, uid = UID_KEY in item ? item[UID_KEY] :
      // NOTE we use positive indexes for dom-elements and negative for everything else
      (item[UID_KEY] = (item.nodeType === 1 ? 1 : -1) * UID++);

    Wrappers_Cache[uid] = this;
  };
}

/**
 * Element's own Klass function
 * we need that because it does some dynamic typecasting mumbo jumbo
 * plus we would like to optimize some stuff here and there
 *
 * @param raw dom element or the tag name
 * @param Object options
 * @return Element instance
 */
function Element_Klass(element, options) {
  Element_initialize(this, element, options);

  var inst = this, raw = inst._, cast = Wrapper.Cast(raw),
      uid = UID_KEY in raw ? raw[UID_KEY] : (raw[UID_KEY] = UID++);

  if (cast !== undefined) {
    inst = new cast(raw, options);
    if ('$listeners' in this) {
      inst.$listeners = this.$listeners;
    }
  }

  Wrappers_Cache[uid] = inst;

  return inst;
}

// searches for a suitable class for dynamic typecasting
Wrapper.Cast = function(unit) {
  return unit.tagName in Element_wrappers ? Element_wrappers[unit.tagName] : undefined;
};

/**
 * Event's own Klass function, we don't need to check
 * nothing in here, don't need to hit the wrappers cache and so one
 *
 * @param raw dom-event or a string event-name
 * @param bounding element or an object with options
 * @return void
 */
function Event_Klass(event, bound_element) {
  if (typeof(event) === 'string') {
    event = $ext({type: event}, bound_element);
    this.stopped = event.bubbles === false;

    if (isHash(bound_element)) {
      $ext(this, bound_element);
    }
  }

  this._             = event;
  this.type          = event.type;

  this.which         = event.which;
  this.keyCode       = event.keyCode;

  this.target        = wrap(
    // Webkit throws events on textual nodes as well, gotta fix that
    event.target != null && 'nodeType' in event.target && event.target.nodeType === 3 ?
      event.target.parentNode : event.target
  );

  this.currentTarget = wrap(event.currentTarget);
  this.relatedTarget = wrap(event.relatedTarget);

  this.pageX         = event.pageX;
  this.pageY         = event.pageY;

  // making old IE attrs looks like w3c standards
  if (IE8_OR_LESS && 'srcElement' in event) {
    this.which         = event.button === 2 ? 3 : event.button === 4 ? 2 : 1;

    this.target        = wrap(event.srcElement) || bound_element;
    this.relatedTarget = this.target._ === event.fromElement ? wrap(event.toElement) : this.target;
    this.currentTarget = bound_element;

    var scrolls = this.target.win().scrolls();

    this.pageX = event.clientX + scrolls.x;
    this.pageY = event.clientY + scrolls.y;
  }
}


/**
 * Private quick wrapping function, unlike `$`
 * it doesn't search by ID and handle double-wrapps
 * just pure dom-wrapping functionality
 *
 * @param raw dom unit
 * @return Wrapper dom-wrapper
 */
function wrap(object) {
  if (object != null) {
    var wrapper = UID_KEY in object ? Wrappers_Cache[object[UID_KEY]] : undefined;

    if (wrapper !== undefined) {
      return wrapper;
    } else if (object.nodeType === 1) {
      return new Element(object);
    } else if (object.nodeType === 9) {
      return new Document(object);
    } else if (object.window == object) {
      return new Window(object);
    } else if (isElement(object.target) || isElement(object.srcElement)) {
      return new Event(object);
    }
  }

  return object;
}

/**
 * A simple document wrapper
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Document = RightJS.Document = new Class(Wrapper, {
  // returns the window reference
  win: function() {
    return wrap(this._.defaultView || this._.parentWindow);
  }
}),

// a common local wrapped document reference
current_Document = wrap(document);


/**
 * the window object extensions
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var Window = RightJS.Window = new Class(Wrapper, {
  /**
   * Selfreference to have a common interface with the rest of the wrappers
   * in case of events handling
   *
   * @return Window
   */
  win: function() {
    return this;
  },

  /**
   * returns the inner-size of the window
   *
   * @return Object x: d+, y: d+
   */
  size: function() {
    var win = this._, html = win.document.documentElement;
    return win.innerWidth ? {x: win.innerWidth, y: win.innerHeight} :
      {x: html.clientWidth, y: html.clientHeight};
  },

  /**
   * returns the scrolls for the window
   *
   * @return Object x: d+, y: d+
   */
  scrolls: function() {
    var win = this._, doc = win.document, body = doc.body, html = doc.documentElement;

    return (win.pageXOffset || win.pageYOffset) ? {x: win.pageXOffset, y: win.pageYOffset} :
      (body && (body.scrollLeft || body.scrollTop)) ? {x: body.scrollLeft, y: body.scrollTop} :
      {x: html.scrollLeft, y: html.scrollTop};
  },

  /**
   * overloading the native scrollTo method to support hashes and element references
   *
   * @param mixed number left position, a hash position, element or a string element id
   * @param number top position
   * @param Object fx options
   * @return window self
   */
  scrollTo: function(left, top, fx_options) {
    var left_pos = left, top_pos = top,
        element = isNumber(left) ? null : $(left);

    if(element instanceof Element) {
      left = element.position();
    }

    if (isHash(left)) {
      top_pos  = left.y;
      left_pos = left.x;
    }

    // checking if a smooth scroll was requested
    if (isHash(fx_options = fx_options || top) && RightJS.Fx) {
      new Fx.Scroll(this, fx_options).start({x: left_pos, y: top_pos});
    } else {
      this._.scrollTo(left_pos, top_pos);
    }

    return this;
  }
});


/**
 * represents some additional functionality for the Event class
 *
 * NOTE: there more additional functionality for the Event class in the rightjs-goods project
 *
 * Credits:
 *   The additional method names are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
var Event = RightJS.Event = new Class(Wrapper, {
  // predefining the keys to spped up the assignments
  type:          null,

  which:         null,
  keyCode:       null,

  target:        null,
  currentTarget: null,
  relatedTarget: null,

  pageX:         null,
  pageY:         null,

  /**
   * the class constructor
   *
   * @param raw dom-event
   * @param HTMLElement the bound element
   * @return void
   */
  initialize: Event_Klass, // the actual initialization happens in the Klass function

  /**
   * Stops the event bubbling process
   *
   * @return RightJS.Event this
   */
  stopPropagation: function() {
    if (this._.stopPropagation) {
      this._.stopPropagation();
    } else {
      this._.cancelBubble = true;
    }

    this.stopped = true;
    return this;
  },

  /**
   * Prevents the default browser action on the event
   *
   * @return RightJS.Event this
   */
  preventDefault: function() {
    if (this._.preventDefault) {
      this._.preventDefault();
    } else {
      this._.returnValue = false;
    }

    return this;
  },

  /**
   * Fully stops the event
   *
   * @return RightJS.Event this
   */
  stop: function() {
    return this.stopPropagation().preventDefault();
  },

  /**
   * Returns the event position
   *
   * @return Object {x: ..., y: ...}
   */
  position: function() {
    return {x: this.pageX, y: this.pageY};
  },

  /**
   * Returns the event's offset relative to the target element
   *
   * @return Object {x: ..., y: ...} or null
   */
  offset: function() {
    if(this.target instanceof Element) {
      var element_position = this.target.position();

      return {
        x: this.pageX - element_position.x,
        y: this.pageY - element_position.y
      };
    }

    // triggered outside browser window (at toolbar etc.)
    return null;
  },

  /**
   * Finds the element between the event target
   * and the boundary element that matches the
   * css-rule
   *
   * @param String css-rule
   * @return Element element or null
   */
  find: function(css_rule) {
    if (this.target instanceof Wrapper && this.currentTarget instanceof Wrapper) {
      var target = this.target._,
          search = this.currentTarget.find(css_rule, true);

      while (target) {
        if (search.indexOf(target) !== -1) {
          return wrap(target);
        }
        target = target.parentNode;
      }
    }

    return undefined;
  }
}, Event_Klass),

Event_delegation_shortcuts = [];


/**
 * The DOM Element unit handling
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */

var Element = RightJS.Element = new Class(Wrapper, {
  /**
   * constructor
   *
   * NOTE: this constructor will dynamically typecast
   *       the wrappers depending on the element tag-name
   *
   * @param String element tag name or an HTMLElement instance
   * @param Object options
   * @return Element element
   */
  initialize: function(element, options) {
    Element_initialize(this, element, options);
  }

}, Element_Klass),

Element_wrappers = Element.Wrappers = {},
elements_cache = {},

/**
 * bulds dom-elements
 *
 * @param String element tag name
 * @param Object options
 * @return HTMLElement
 */
make_element = function (tag, options) {
  return (tag in elements_cache ? elements_cache[tag] : (
    elements_cache[tag] = document.createElement(tag)
  )).cloneNode(false);
};

//
// IE 6,7,8 (not 9!) browsers have a bug with checkbox and radio input elements
// it doesn't place the 'checked' property correctly, plus there are some issues
// with clonned SELECT objects, so we are replaceing the elements maker in here
//
if (IE8_OR_LESS) {
  make_element = function(tag, options) {
    if (options !== undefined && (tag === 'input' || tag === 'button')) {
      tag = '<'+ tag +' name="'+ options.name +
        '" type="'+ options.type +'"'+
        (options.checked ? ' checked' : '') + ' />';

      delete(options.name);
      delete(options.type);
    }

    return document.createElement(tag);
  };
}

/**
 * Basic element's constructor
 *
 * @param Element wrapper instance
 * @param mixed raw dom element of a string tag name
 * @param Object options
 * @return void
 */
function Element_initialize(inst, element, options) {
  if (typeof element === 'string') {
    inst._ = make_element(element, options);

    if (options !== undefined) {
      for (var key in options) {
        switch (key) {
          case 'id':    inst._.id        = options[key]; break;
          case 'html':  inst._.innerHTML = options[key]; break;
          case 'class': inst._.className = options[key]; break;
          case 'on':    inst.on(options[key]);           break;
          default:      inst.set(key, options[key]);
        }
      }
    }
  } else {
    inst._ = element;
  }
}


/**
 * The DOM Element unit structures handling module
 *
 * NOTE: all the methods will process and return only the Element nodes
 *       all the textual nodes will be skipped
 *
 * NOTE: if a css-rule was specified then the result of the method
 *       will be filtered/adjusted depends on the rule
 *
 * Credits:
 *   The naming principle and most of the names are taken from
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *   The insertions system implementation is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */

Element.include({
  parent: function(css_rule) {
    var parent = this._.parentNode, parent_type = parent && parent.nodeType;

    return css_rule ? this.parents(css_rule)[0] :
      (parent_type === 1 || parent_type === 9) ? // <- IE6 sometimes has a fragment node in there
      wrap(parent) : null;
  },

  parents: function(css_rule) {
    return recursively_collect(this, 'parentNode', css_rule);
  },

  children: function(css_rule) {
    return this.find(css_rule).filter(function(element) {
      return element._.parentNode === this._;
    }, this);
  },

  siblings: function(css_rule) {
    return this.prevSiblings(css_rule).reverse().concat(this.nextSiblings(css_rule));
  },

  nextSiblings: function(css_rule) {
    return recursively_collect(this, 'nextSibling', css_rule);
  },

  prevSiblings: function(css_rule) {
    return recursively_collect(this, 'previousSibling', css_rule);
  },

  next: function(css_rule) {
    return !css_rule && this._.nextElementSibling !== undefined ?
      wrap(this._.nextElementSibling) : this.nextSiblings(css_rule)[0];
  },

  prev: function(css_rule) {
    return !css_rule && this._.previousElementSibling !== undefined ?
      wrap(this._.previousElementSibling) : this.prevSiblings(css_rule)[0];
  },

  /**
   * removes the elemnt out of this parent node
   *
   * @return Element self
   */
  remove: function() {
    var element = this._, parent = element.parentNode;
    if (parent) {
      parent.removeChild(element);
    }
    return this;
  },

  /**
   * handles the elements insertion functionality
   *
   * The content might be one of the following data
   *
   *  o) an element instance
   *  o) a String (all the scripts will be parsed out and executed)
   *  o) a list of Elements
   *  o) a hash like {position: content}
   *
   * @param mixed data to insert
   * @param String position to insert  top/bottom/before/after/instead
   * @return Element self
   */
  insert: function(content, position) {
    var scripts = null, element = this._;
    position = position === undefined ? 'bottom' : position;

    if (typeof(content) !== 'object') {
      scripts = content = (''+content);
    } else if (content instanceof Element) {
      content = content._;
    }

    Element_insertions[position](element,
      content.nodeType === undefined ?
        Element_createFragment(
          (position === 'bottom' || position === 'top') ?
            element : element.parentNode, content
        ) : content
    );

    if (scripts !== null) { scripts.evalScripts(); }

    return this;
  },

  /**
   * Inserts the element inside the given one at the given position
   *
   * @param mixed destination element reference
   * @param String optional position
   * @return Element this
   */
  insertTo: function(element, position) {
    $(element).insert(this, position);
    return this;
  },

  /**
   * A shortcut to uppend several units into the element
   *
   * @param mixed data
   * ..................
   * @return Element this
   */
  append: function(first) {
    return this.insert(isString(first) ? $A(arguments).join('') : arguments);
  },

  /**
   * updates the content of the element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  update: function(content) {
    if (typeof(content) !== 'object') {
      content = '' + content;

      try {
        this._.innerHTML = content;
      } catch(e) {
        return this.clean().insert(content);
      }

      content.evalScripts();

      return this;
    } else {
      return this.clean().insert(content);
    }
  },

  /**
   * Works with the Element's innerHTML property
   * This method works both ways! if a content is provided
   * then it will be assigned, otherwise will return
   * the innerHTML property
   *
   * @param String html content
   * @return String html content or Element this
   */
  html: function(content) {
    return content === undefined ? this._.innerHTML : this.update(content);
  },

  /**
   * Works with the Element's innerHTML property as a text
   * when set something, it will appear as is with everything quoted
   * when get, will return a string without any tags in it
   *
   * @param String text content
   * @return String text content or Element this
   */
  text: function(text) {
    return text === undefined ? (
      this._.textContent === undefined ? this._.innerText : this._.textContent
    ) : this.update(this.doc()._.createTextNode(text));
  },

  /**
   * replaces the current element by the given content
   *
   * @param mixed content (a String, an Element or a list of elements)
   * @return Element self
   */
  replace: function(content) {
    return this.insert(content, 'instead');
  },

  /**
   * wraps the element with the given element
   *
   * @param Element wrapper
   * @return Element self
   */
  wrap: function(wrapper) {
    var element = this._, parent = element.parentNode;
    if (parent) {
      wrapper = $(wrapper)._;
      parent.replaceChild(wrapper, element);
      wrapper.appendChild(element);
    }
    return this;
  },

  /**
   * removes all the child nodes out of the element
   *
   * @return Element self
   */
  clean: function() {
    while (this._.firstChild) {
      this._.removeChild(this._.firstChild);
    }

    return this;
  },

  /**
   * checks if the element has no child nodes
   *
   * @return boolean check result
   */
  empty: function() {
    return this.html().blank();
  },

  /**
   * Creates a clean clone of the element without any events attached to it
   *
   * @return Element new clone
   */
  clone: function() {
    return new Element(this._.cloneNode(true));
  },

  /**
   * Returns an index of the element among the other child elements
   *
   * NOTE: doesn't count the textual nodes!
   *
   * @return Integer index
   */
  index: function() {
    var node    = this._,
        sibling = node.parentNode.firstChild,
        index   = 0;

    while (sibling !== node) {
      if (sibling.nodeType === 1) { // counting elements only
        index ++;
      }
      sibling = sibling.nextSibling;
    }

    return index;
  }
});

/**
 * Recursively collects the target element's related nodes
 *
 * @param Element context
 * @param name String pointer attribute name
 * @param rule String optional css-atom rule
 * @return Array found elements
 */
function recursively_collect(where, attr, css_rule) {
  var node = where._, result = [], i=0, no_rule = !css_rule;

  while ((node = node[attr])) {
    if (node.nodeType === 1 && (no_rule || wrap(node).match(css_rule))) {
      result[i++] = wrap(node);
    }
  }

  return result;
}

// list of insertions handling functions
// NOTE: each of the methods will be called in the contects of the current element
var Element_insertions = {
  bottom: function(target, content) {
    target.appendChild(content);
  },

  top: function(target, content) {
    if (target.firstChild !== null) {
      target.insertBefore(content, target.firstChild);
    } else {
      target.appendChild(content);
    }
  },

  after: function(target, content) {
    var parent = target.parentNode, sibling = target.nextSibling;
    if (sibling !== null) {
      parent.insertBefore(content, sibling);
    } else {
      parent.appendChild(content);
    }
  },

  before: function(target, content) {
    target.parentNode.insertBefore(content, target);
  },

  instead: function(target, content) {
    target.parentNode.replaceChild(content, target);
  }
},

// the element insertion wrappers list
Element_wraps = {
  TBODY:  ['<TABLE>',            '</TABLE>',                           2],
  TR:     ['<TABLE><TBODY>',     '</TBODY></TABLE>',                   3],
  TD:     ['<TABLE><TBODY><TR>', '</TR></TBODY></TABLE>',              4],
  COL:    ['<TABLE><COLGROUP>',  '</COLGROUP><TBODY></TBODY></TABLE>', 2],
  LEGEND: ['<FIELDSET>',         '</FIELDSET>',                        2],
  AREA:   ['<map>',              '</map>',                             2],
  OPTION: ['<SELECT>',           '</SELECT>',                          2]
};

$alias(Element_wraps, {
  OPTGROUP: 'OPTION',
  THEAD:    'TBODY',
  TFOOT:    'TBODY',
  TH:       'TD'
});

// converts any data into a html fragment unit
var fragment = document.createDocumentFragment(),
    tmp_cont = document.createElement('DIV');

function Element_createFragment(context, content) {
  if (typeof(content) === 'string') {
    var tag   = context.tagName,
        tmp   = tmp_cont,
        wrap  = tag in Element_wraps ? Element_wraps[tag] : ['', '', 1],
        depth = wrap[2];

    tmp.innerHTML = wrap[0] + '<'+ tag + '>' + content + '</'+ tag + '>' + wrap[1];

    while (depth-- !== 0) {
      tmp = tmp.firstChild;
    }

    content = tmp.childNodes;

    while (content.length !== 0) {
      fragment.appendChild(content[0]);
    }

  } else {
    for (var i=0, length = content.length, node; i < length; i++) {
      node = content[content.length === length ? i : 0];
      fragment.appendChild(node instanceof Element ? node._ : node);
    }
  }

  return fragment;
}


/**
 * this module contains the element unit styles related methods
 *
 * Credits:
 *   Some of the functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Dojo      (www.dojotoolkit.org)      Copyright (C) The Dojo Foundation
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * assigns styles out of the hash to the element
   *
   * NOTE: the style keys might be camelized or dasherized, both cases should work
   *
   * @param Object styles list or String style name
   * @param String style value in case of the first param a string style name
   * @return Element self
   */
  setStyle: function(hash, value) {
    var key, c_key, style = {}, element_style = this._.style;

    if (value !== undefined) { style[hash] = value; hash = style; }
    else if(isString(hash)) {
      hash.split(';').each(function(option) {
        var els = option.split(':').map('trim');
        if (els[0] && els[1]) {
          style[els[0]] = els[1];
        }
      });
      hash = style;
    }


    for (key in hash) {
      c_key = key.indexOf('-') < 0 ? key : key.camelize();

      if (IE_OPACITY && key === 'opacity') {
        element_style.filter = 'alpha(opacity='+ hash[key] * 100 +')';
      } else if (key === 'float') {
        c_key = Browser_IE ? 'styleFloat' : 'cssFloat';
      }

      element_style[c_key] = hash[key];
    }

    return this;
  },

  /**
   * returns style of the element
   *
   * NOTE: will include the CSS level definitions
   *
   * @param String style key
   * @return String style value or null if not set
   */
  getStyle: function(key) {
    return clean_style(this._.style, key) || clean_style(this.computedStyles(), key);
  },

  /**
   * returns the hash of computed styles for the element
   *
   * @return Object/CSSDefinition computed styles
   */
  computedStyles: HTML.currentStyle ? function() {
    return this._.currentStyle || {};
  } : HTML.runtimeStyle ? function() {
    return this._.runtimeStyle || {};
  } : function() {
    return this._.ownerDocument.defaultView.getComputedStyle(this._, null);
  },

  /**
   * checks if the element has the given class name
   *
   * @param String class name
   * @return boolean check result
   */
  hasClass: function(name) {
    return (' '+this._.className+' ').indexOf(' '+name+' ') != -1;
  },

  /**
   * sets the whole class-name string for the element
   *
   * @param String class-name
   * @return Element self
   */
  setClass: function(class_name) {
    this._.className = class_name;
    return this;
  },

  /**
   * Returns the current class-name
   *
   * @return String class-name
   */
  getClass: function() {
    return this._.className;
  },

  /**
   * adds the given class name to the element
   *
   * @param String class name
   * @return Element self
   */
  addClass: function(name) {
    var testee = ' '+this._.className+' ';
    if (testee.indexOf(' '+name+' ') == -1) {
      this._.className += (testee === '  ' ? '' : ' ') + name;
    }
    return this;
  },

  /**
   * removes the given class name
   *
   * @param String class name
   * @return Element self
   */
  removeClass: function(name) {
    this._.className = (' '+this._.className+' ').replace(' '+name+' ', ' ').trim();
    return this;
  },

  /**
   * toggles the given class name on the element
   *
   * @param String class name
   * @return Element self
   */
   toggleClass: function(name) {
     return this[this.hasClass(name) ? 'removeClass' : 'addClass'](name);
   },

   /**
    * adds the given class-name to the element
    * and removes it from all the element siblings
    *
    * @param String class name
    * @return Element self
    */
   radioClass: function(name) {
     this.siblings().each('removeClass', name);
     return this.addClass(name);
   }
});

/**
 * cleans up a style value
 *
 * @param Object styles hash
 * @param String style-key
 * @return String clean style
 */
function clean_style(style, key) {
  key = key.camelize();

  if (key === 'opacity') {
    return IE_OPACITY ? (
      (/opacity=(\d+)/i.exec(style.filter || '') ||
      ['', '100'])[1].toInt() / 100
    )+'' :style[key].replace(',', '.');
  }

  if (key === 'float') {
    key = Browser_IE ? 'styleFloat' : 'cssFloat';
  }

  var value = style[key];

  // Opera returns named colors with quotes
  if (Browser_Opera && /color/i.test(key) && value) {
    value = value.replace(/"/g, '');
  }

  return value;
}


/**
 * Common DOM Element unit methods
 *
 * Credits:
 *   Most of the naming system in the module inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * sets the element attributes
   *
   * @param String attr name or Object attributes hash
   * @param mixed attribute value
   * @return Element self
   */
  set: function(hash, value) {
    if (typeof(hash) === 'string') { var val = {}; val[hash] = value; hash = val; }

    var key, element = this._;

    for (key in hash) {
      if (key === 'style') {
        this.setStyle(hash[key]);
      } else {
        // some attributes are not available as properties
        if (!(key in element)) {
          element.setAttribute(key, ''+hash[key]);
        }
        if (key.substr(0,5) !== 'data-') {
          element[key] = hash[key];
        }
      }
    }

    return this;
  },

  /**
   * returns the attribute value for the name
   *
   * @param String attr name
   * @return mixed value
   */
  get: function(name) {
    var element = this._, value = element[name] || element.getAttribute(name);
    return value === '' ? null : value;
  },

  /**
   * checks if the element has that attribute
   *
   * @param String attr name
   * @return Boolean check result
   */
  has: function(name) {
    return this.get(name) !== null;
  },

  /**
   * erases the given attribute of the element
   *
   * @param String attr name
   * @return Element self
   */
  erase: function(name) {
    this._.removeAttribute(name);
    return this;
  },

  /**
   * checks if the elemnt is hidden
   *
   * NOTE: will check css level computed styles too
   *
   * @return boolean check result
   */
  hidden: function() {
    return this.getStyle('display') === 'none';
  },

  /**
   * checks if the element is visible
   *
   * @return boolean check result
   */
  visible: function() {
    return !this.hidden();
  },

  /**
   * hides the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  hide: function(effect, options) {
    if (this.visible()) {
      this._d = this.getStyle('display');
      this._.style.display = 'none';
    }

    return this;
  },

  /**
   * shows the element
   *
   * @return Element self
   */
  show: function() {
    if (this.hidden()) {
      var element   = this._, value = this._d, dummy;

      // trying to guess the default 'style.display' for this kind of elements
      if (!value || value === 'none') {
        dummy = $E(element.tagName).insertTo(HTML);
        value = dummy.getStyle('display');
        dummy.remove();
      }

      // failsafe in case the user been naughty
      if (value === 'none') {
        value = 'block';
      }

      element.style.display = value;
    }

    return this;
  },

  /**
   * toggles the visibility state of the element
   *
   * @return Element self
   */
  toggle: function() {
    return this[this.visible() ? 'hide' : 'show']();
  },

  /**
   * shows the element and hides all the sibligns
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  radio: function(effect, options) {
    this.siblings().each('hide', effect, options);
    return this.show();
  },

  /**
   * Sets/gets the `data-smth` data attribute and
   * automatically converts everything in/out JSON
   *
   * @param String key name
   * @param mixed data or `undefined` to erase
   * @return mixed Element self or extracted data
   */
  data: function(key, value) {
    var name, result, match, attrs, attr, i;

    if (isHash(key)) {
      for (name in key) {
        value = this.data(name, key[name]);
      }
    } else if (value === undefined) {
      key = 'data-'+ (''+key).dasherize();

      for (result = {}, match = false, attrs = this._.attributes, i=0; i < attrs.length; i++) {
        value = attrs[i].value;
        try { value = JSON.parse(value); } catch (e) {}

        if (attrs[i].name === key) {
          result = value;
          match  = true;
          break;
        } else if (attrs[i].name.indexOf(key) === 0) {
          result[attrs[i].name.substring(key.length+1).camelize()] = value;
          match = true;
        }
      }

      value = match ? result : null;
    } else {
      key = 'data-'+ (''+key).dasherize();

      if (!isHash(value)) { value = {'': value}; }

      for (name in value) {
        attr = name.blank() ? key : key+'-'+name.dasherize();

        if (value[name] === null) {
          this._.removeAttribute(attr);
        } else {
          this._.setAttribute(attr, isString(value[name]) ? value[name] : JSON.stringify(value[name]));
        }
      }

      value = this;
    }

    return value;
  }
});


/**
 * this module contains the Element's part of functionality
 * responsible for the dimensions and positions getting/setting
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
Element.include({
  /**
   * Returns the reference to this element document
   *
   * @return RightJS.Document
   */
  doc: function() {
    return wrap(this._.ownerDocument);
  },

  /**
   * Returns the reference to this elements window
   *
   * @return RightJS.Window
   */
  win: function() {
    return this.doc().win();
  },

  /**
   * Returns the element size as a hash
   *
   * @return Object {x: NNN, y: NNN}
   */
  size: function() {
    return { x: this._.offsetWidth, y: this._.offsetHeight };
  },

  /**
   * Returns the element absolute position
   *
   * NOTE: see the konq.js file for the manual version of the method
   *
   * @return Object {x: NNN, y: NNN}
   */
  position: function() {
    var rect    = this._.getBoundingClientRect(),
        html    = this.doc()._.documentElement,
        scrolls = this.win().scrolls();

    return {
      x: rect.left + scrolls.x - html.clientLeft,
      y: rect.top  + scrolls.y - html.clientTop
    };
  },

  /**
   * Returns the element scrolls
   *
   * @return Object {x: NNN, y: NNN}
   */
  scrolls: function() {
    return { x: this._.scrollLeft, y: this._.scrollTop };
  },

  /**
   * returns the element dimensions hash
   *
   * @return Object dimensions (top, left, width, height, scrollLeft, scrollTop)
   */
  dimensions: function() {
    var size     = this.size(),
        scrolls  = this.scrolls(),
        position = this.position();

    return {
      top:        position.y,
      left:       position.x,
      width:      size.x,
      height:     size.y,
      scrollLeft: scrolls.x,
      scrollTop:  scrolls.y
    };
  },

  /**
   * Checks if the element overlaps the given position
   *
   * @param Object position {x: NNN, y: NNN}
   * @return boolean check result
   */
  overlaps: function(target) {
    var pos = this.position(), size = this.size();

    return target.x > pos.x && target.x < (pos.x + size.x) &&
           target.y > pos.y && target.y < (pos.y + size.y);
  },

  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer width in pixels
   * @return Element self
   */
  setWidth: function(width_px) {
    var style = this._.style;
    style.width = width_px + 'px';
    style.width = (2 * width_px - this._.offsetWidth) + 'px';
    return this;
  },

  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer height in pixels
   * @return Element self
   */
  setHeight: function(height_px) {
    var style = this._.style;
    style.height = height_px + 'px';
    style.height = (2 * height_px - this._.offsetHeight) + 'px';
    return this;
  },

  /**
   * sets the size of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param width Integer width in pixels or {x: 10, y: 20} like object
   * @param height Integer height
   * @return Element self
   */
  resize: function(width, height) {
    if (isHash(width)) {
      height = width.y;
      width  = width.x;
    }
    return this.setWidth(width).setHeight(height);
  },

  /**
   * sets the element position (against the window corner)
   *
   * @param left Number left position in pixels or an object like {x: 10, y: 20}
   * @param top Number top position in pixels
   * @return Element self
   */
  moveTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }

    return this.setStyle({
      left: left + 'px',
      top:  top  + 'px'
    });
  },

  /**
   * sets the scroll position
   *
   * @param left Integer left scroll px or an object like {x: 22, y: 33}
   * @param top Integer top scroll px
   * @return Element self
   */
  scrollTo: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }

    this._.scrollLeft = left;
    this._.scrollTop  = top;

    return this;
  },

  /**
   * makes the window be scrolled to the element
   *
   * @param Object fx options
   * @return Element self
   */
  scrollThere: function(options) {
    this.win().scrollTo(this, options);
    return this;
  }
});


/**
 * DOM Element events handling methods
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
[Element, Document, Window].each('include', $ext(Observer_create({}), {
  /**
   * The basic events handling attachment method
   * SEE Observer#on for more details about supported arguments
   *
   * @returnt this
   */
  on: function() {
    Observer_on(this, arguments, function(hash) {

      if (hash.e === 'mouseenter' || hash.e === 'mouseleave') {
        mouse_io_activate();
        hash.n = hash.e;
        hash.w = function() {};
        // NOTE: we don't attach this listener to the actual element!
        //       so it didn't screw with IE's native enter/leave handlers
      } else {
        if (hash.e === 'contextmenu' && Browser.Konqueror) {
          hash.n = 'rightclick';
        } else if (hash.e === 'mousewheel' && Browser.Gecko) {
          hash.n = 'DOMMouseScroll';
        } else {
          hash.n = hash.e;
        }

        hash.w = function(event) {
          event = new Event(event, hash.t);
          if (hash.f.apply(hash.t, (hash.r?[]:[event]).concat(hash.a)) === false) {
            event.stop();
          }
        };

        if (IE8_OR_LESS) {
          hash.t._.attachEvent('on'+hash.n, hash.w);
        } else {
          hash.t._.addEventListener(hash.n, hash.w, false);
        }
      }

      return hash;
    });

    return this;
  },

  /**
   * Stops an event handling
   *
   * @param String event name or a function callback
   * @param function callback or nothing
   * @return this
   */
  stopObserving: function(event, callback) {
    Observer_stopObserving(this, event, callback, function(hash) {
      if (IE8_OR_LESS) {
        hash.t._.detachEvent('on'+ hash.n, hash.w);
      } else {
        hash.t._.removeEventListener(hash.n, hash.w, false);
      }
    });

    return this;
  },

  /**
   * Artificially trigers the event on the element
   *
   * @param string event name or an Event instance
   * @param Object options
   * @return this
   */
  fire: function(event, options) {
    var parent = this.parent && this.parent();

    if (!(event instanceof Event)) {
      event = new Event(event, $ext({target: this._}, options));
    }

    // setting up the currentTarget reference
    event.currentTarget = this;

    (this.$listeners || []).each(function(hash) {
      if (hash.e === event.type &&
        hash.f.apply(this, (hash.r?[]:[event]).concat(hash.a)) === false
      ) {
        event.stop();
      }
    }, this);

    // manually bypassing the event to the parent one if it should bubble
    if (parent && parent.fire && !event.stopped) {
      parent.fire(event);
    }

    return this;
  },

  /**
   * a simple events terminator method to be hooked like this.onClick('stopEvent');
   *
   * @return false
   */
  stopEvent: function() { return false; }
}));

// couple more shortcuts for the window
Observer_createShortcuts(Window.prototype, $w('blur focus scroll resize load'));

/**
 * Registers a list of event-binding shortcuts like
 *  $(element).onClick
 *  $(element).onMouseover
 *
 * @param String space separated event names
 * @return void
 */
function Element_add_event_shortcuts(tokens) {
  tokens = $w(tokens);
  Event_delegation_shortcuts = Event_delegation_shortcuts.concat(tokens);

  Observer_createShortcuts(Element.prototype, tokens);
  Observer_createShortcuts(Document.prototype, tokens);
}

Element_add_event_shortcuts(
  'click rightclick contextmenu mousedown mouseup '+
  'mouseover mouseout mousemove keypress keydown keyup'
);


/**
 * The DOM elements selection handling
 *
 * NOTE: this module is just a wrap over the native CSS-selectors feature
 *       see the olds/css.js file for the manual selector code
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */

[Element, Document].each('include', {
  /**
   * Extracts the first element matching the css-rule,
   * or just any first element if no css-rule was specified
   *
   * @param String css-rule
   * @return Element matching node or null
   */
  first: function(css_rule) {
    return wrap(
      css_rule === undefined && this._.firstElementChild !== undefined ?
      this._.firstElementChild : this._.querySelector(css_rule || '*')
    );
  },

  /**
   * Finds a list of matching nodes, or all the descendant nodes if no css-rule provided
   *
   * @param String css-rule
   * @param boolean raw-search
   * @return Array of elements
   */
  find: function(css_rule, raw) {
    var query = this._.querySelectorAll(css_rule || '*'), result, i=0, l = query.length;

    if (raw === true) {
      result = $A(query);
    } else {
      for (result = []; i < l; i++) {
        result[i] = wrap(query[i]);
      }
    }

    return result;
  },

  /**
   * checks if the element matches this css-rule
   *
   * NOTE: the element should be attached to the page
   *
   * @param String css-rule
   * @return Boolean check result
   */
  match: function(css_rule) {
    // finding the top parent element (the element might not be on the document)
    var element = this._, parent = element, result, faking = false;

    while (parent.parentNode !== null && parent.parentNode.nodeType !== 11) {
      parent = parent.parentNode;
    }

    // creating a fake context when needed
    if (element === parent) {
      parent = document.createElement('div');
      parent.appendChild(element);
      faking = true;
    }

    result = wrap(parent).find(css_rule, true).indexOf(element) !== -1;

    if (faking) {
      parent.removeChild(element);
    }

    return result;
  }
});


/**
 * The dom-ready event handling code
 *
 * Credits:
 *   The basic principles of the module are originated from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
Document.include({
  on: function(name) {
    if (name === 'ready' && !this._iR) {
      var document = this._, ready = this.fire.bind(this, 'ready');

      // IE and Konqueror browsers
      if ('readyState' in document) {
        (function() {
          if (['loaded','complete'].include(document.readyState)) {
            ready();
          } else {
            arguments.callee.delay(50);
          }
        })();
      } else {
        document.addEventListener('DOMContentLoaded', ready, false);
      }

      this._iR = true;
    }

    return this.$super.apply(this, arguments);
  }
});

Observer_createShortcuts(Document.prototype, ['ready']);

/**
 * The form unit class and extensions
 *
 * Credits:
 *   The basic principles of the module are inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */

var Form = RightJS.Form = Element_wrappers.FORM = new Class(Element, {
  /**
   * constructor
   *
   * NOTE: this constructor can be called as a normal Element constructor
   *       or with the options only, which will make a FORM element
   *
   *   var form = new Form(raw_form_object_element);
   *   var form = new Form({method: 'post', action: '/boo/hoo'});
   *
   * @param Object options or HTMLFormElement object
   * @return void
   */
  initialize: function(in_options) {
    var options = in_options || {}, remote = 'remote' in options, element = options;

    if (isHash(options) && !isElement(options)) {
      element = 'form';
      options = Object.without(options, 'remote');
    }

    this.$super(element, options);

    if (remote) {
      this.remotize();
    }
  },

  /**
   * returns the form elements as an array of extended units
   *
   * @return Array of elements
   */
  elements: function() {
    return this.find('input,button,select,textarea');
  },

  /**
   * returns the list of all the input elements on the form
   *
   * @return Array of elements
   */
  inputs: function() {
    return this.elements().filter(function(input) {
      return !['submit', 'button', 'reset', 'image', null].include(input._.type);
    });
  },

  /**
   * Accessing an input by name
   *
   * @param String name
   * @return Input field
   */
  input: function(name) {
    var input = this._[name];

    if ('tagName' in input) {
      input = wrap(input);
    } else { // a list of radio-buttons (coz they have all the same name)
      input = $A(input).map(wrap);
    }

    return input;
  },

  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    var element = this.inputs().first(function(input) {
      return input._.type !== 'hidden';
    });

    if (element) { element.focus(); }

    return this;
  },

  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this.elements().each('blur');
    return this;
  },

  /**
   * disables all the elements on the form
   *
   * @return Form this
   */
  disable: function() {
    this.elements().each('disable');
    return this;
  },

  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    this.elements().each('enable');
    return this;
  },

  /**
   * returns the list of the form values
   *
   * @return Object values
   */
  values: function() {
    var values = {};

    this.inputs().each(function (element) {
      var input = element._,
          hash  = values, key,
          keys  = input.name.match(/[^\[]+/g);

      if (!input.disabled && input.name && (!(input.type === 'checkbox' || input.type === 'radio') || input.checked)) {
        // getting throught the smth[smth][smth][] in the name
        while (keys.length > 1) {
          key  = keys.shift();
          if (key.endsWith(']')) {
            key  = key.substr(0, key.length-1);
          }
          if (!hash[key]) {
            hash[key] = keys[0] === ']' ? [] : {};
          }
          hash = hash[key];
        }

        key  = keys.shift();
        if (key.endsWith(']')) {
          key = key.substr(0, key.length-1);
        }

        if (key === '') { // an array
          hash.push(element.value());
        } else {
          hash[key] = element.value();
        }
      }
    });

    return values;
  },

  /**
   * returns the key/values organized ready to be sent via a get request
   *
   * @return String serialized values
   */
  serialize: function() {
    return Object.toQueryString(this.values());
  },

  /**
   * Delegating the submit method
   *
   * @return Form this
   */
  submit: function() {
    this._.submit();
    return this;
  },

  /**
   * Delegating the 'reset' method
   *
   * @return Form this
   */
  reset: function() {
    this._.reset();
    return this;
  }
});

// creating the event shortcuts
Element_add_event_shortcuts('submit reset focus blur disable enable change');


/**
 * The form input element class
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Input = RightJS.Input =

// retgistering the typecasted wrappers
Element_wrappers.INPUT    =
Element_wrappers.BUTTON   =
Element_wrappers.SELECT   =
Element_wrappers.TEXTAREA =
Element_wrappers.OPTGROUP =

new Class(Element, {
  /**
   * Constructor
   *
   * NOTE: this constructor can be called in several ways
   *
   *  Like normal Element
   *   var input = new Input('texarea', {...});
   *   var input = new Input(document.createElement('select'));
   *
   *  Or with options only which will make an INPUT element by default
   *    var input = new Input({type: 'password', name: 'password'});
   *
   * @param HTMLElement or a String tag name or Options for default 'input' tag
   * @param Object options
   * @return void
   */
  initialize: function(element, options) {
    // type to tag name conversion
    if (!element || (isHash(element) && !isElement(element))) {
      options = element || {};

      if (/textarea|select/.test(options.type || '')) {
        element = options.type;
        delete(options.type);
      } else {
        element = 'input';
      }
    }

    this.$super(element, options);
  },

  /**
   * Returns a reference to the input's form
   *
   * @return Form wrapped form
   */
  form: function() {
    return wrap(this._.form);
  },

  /**
   * Overloading the method to fix some issues with IE and FF
   *
   * @param mixed content
   * @param string optional position
   * @return Input this
   */
  insert: function(content, position) {
    this.$super(content, position);

    // manually resetting the selected option in here
    this.find('option').each(function(option) {
      option._.selected = !!option.get('selected');
    });

    return this;
  },

  /**
   * Overloading the method so it always called the '#insert' method
   *
   * @param mixed content
   * @return Input this
   */
  update: function(content) {
    return this.clean().insert(content);
  },

  /**
   * uniform access to the element values
   *
   * @return String element value
   */
  getValue: function() {
    if (this._.type == 'select-multiple') {
      return this.find('option').map(function(option) {
        return option._.selected ? option._.value : null;
      }).compact();
    } else {
      return this._.value;
    }
  },

  /**
   * uniform accesss to set the element value
   *
   * @param String value
   * @return Element this
   */
  setValue: function(value) {
    if (this._.type == 'select-multiple') {
      value = ensure_array(value).map(String);
      this.find('option').each(function(option) {
        option._.selected = value.include(option._.value);
      });
    } else {
      this._.value = value;
    }
    return this;
  },

  /**
   * Both ways getter/setter for the value parameter
   *
   * @param mixed value
   * @return mixed this or the value
   */
  value: function(value) {
    return this[value === undefined ? 'getValue' : 'setValue'](value);
  },

  /**
   * focuses on the first input element on the form
   *
   * @return Form this
   */
  focus: function() {
    this._.focus();
    this.focused = true;
    if (Browser_IE) { this.fire('focus', {bubbles: false}); }
    return this;
  },

  /**
   * removes focus out of all the form elements
   *
   * @return Form this
   */
  blur: function() {
    this._.blur();
    this.focused = false;
    if (Browser_IE) { this.fire('blur', {bubbles: false}); }
    return this;
  },

  /**
   * focuses on the element and selects its content
   *
   * @return Element this
   */
  select: function() {
    this._.select();
    return this.focus();
  },

  /**
   * disables all the elements on the form
   *
   * @return Form this
   */
  disable: function() {
    this._.disabled = true;
    return this.fire('disable');
  },

  /**
   * enables all the elements on the form
   *
   * @return Form this
   */
  enable: function() {
    this._.disabled = false;
    return this.fire('enable');
  },

  /**
   * A bidirectional method to set/get the disabled status of the input field
   *
   * @param boolean optional value
   * @return Input in setter mode boolean in getter
   */
  disabled: function(value) {
    return value === undefined ? this._.disabled : this[value ? 'disable' : 'enable']();
  },

  /**
   * A bidirectional method to set/get the checked status of the input field
   *
   * @param boolean optional value
   * @return Input in setter mode boolean in getter
   */
  checked: function(value) {
    if (value === undefined) {
      value = this._.checked;
    } else {
      this._.checked = value;
      value = this;
    }

    return value;
  }
});


/**
 * This module provides correct focus/blur events bubbling
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */

/**
 * Triggers a manual focus/blur events bubbling
 *
 * @param raw dom-event
 * @return void
 */
function focus_boobler(raw_event) {
  var event  = new Event(raw_event),
      target = event.target,
      parent = target.parent && target.parent();

  event.type = raw_event.type === 'focusin' || raw_event.type === 'focus' ? 'focus' : 'blur';

  if (parent) { parent.fire(event); }
}

/**
 * Hooking up the 'focus' and 'blur' events
 * at the document level and then rebooble them
 * manually like they were normal events
 *
 */
if (IE8_OR_LESS) {
  document.attachEvent('onfocusin',  focus_boobler);
  document.attachEvent('onfocusout', focus_boobler);
} else {
  document.addEventListener('focus', focus_boobler, true);
  document.addEventListener('blur',  focus_boobler, true);
}


/**
 * Provides the mouse enter/leave events handling emulation
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var mouse_io_index = [], mouse_io_inactive = true;

/**
 * Fires the actual mouseenter/mouseleave event
 *
 * @param original event
 * @param raw dom element
 * @param integer uid
 * @param boolean mouseenter or mouseleave
 * @return void
 */
function mouse_io_fire(raw, element, uid, enter) {
  var event = new Event(raw);
  event.type    = enter === true ? 'mouseenter' : 'mouseleave';
  event.bubbles = false;
  event.stopped = true;
  event.target  = wrap(element);

  // replacing the #find method so that UJS didn't
  // get broke with trying to find nested elements
  event.find = function(css_rule) {
    return $$(css_rule, true)
      .indexOf(this.target._) === -1 ?
        undefined : this.target;
  };

  event.target.fire(event);
  current_Document.fire(event);
}

/**
 * Figures out the enter/leave events by listening the
 * mouseovers in the document
 *
 * @param raw dom event
 * @return void
 */
function mouse_io_handler(e) {
  var target  = e.target        || e.srcElement,
      from    = e.relatedTarget || e.fromElement,
      element = target,
      passed  = false,
      parents = [],
      uid, event;

  while (element.nodeType === 1) {
    uid = $uid(element);

    if (mouse_io_index[uid] === undefined) {
      mouse_io_fire(e, element, uid,
        mouse_io_index[uid] = true
      );
    }

    if (element === from) {
      passed = true;
    }

    parents.push(element);

    element = element.parentNode;
  }

  if (from && !passed) {
    while (from !== null && from.nodeType === 1 && parents.indexOf(from) === -1) {
      uid = $uid(from);
      if (mouse_io_index[uid] !== undefined) {
        mouse_io_fire(e, from, uid,
          mouse_io_index[uid] = undefined
        );
      }

      from = from.parentNode;
    }
  }
}

/**
 * Calling 'mouseleave' for all currently active elements on the page
 *
 * @return void
 */
function mouse_io_reset(e) {
  mouse_io_index.each(function(value, uid) {
    if (value && Wrappers_Cache[uid]) {
      mouse_io_fire(e, Wrappers_Cache[uid]._, uid, false);
    }
  });
}

/**
 * Activating the mouse-io events emulation
 *
 * @return void
 */
function mouse_io_activate() {
  if (mouse_io_inactive) {
    mouse_io_inactive = false;

    if (Browser_IE) {
      document.attachEvent('onmouseover', mouse_io_handler);
      window.attachEvent('blur', mouse_io_reset);
    } else {
      document.addEventListener('mouseover', mouse_io_handler, false);
      window.addEventListener('blur', mouse_io_reset, false);
    }
  }
}

Element_add_event_shortcuts('mouseenter mouseleave');

/**
 * This module the standard events delegation interface
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
[Element, Document].each('include', {
  /**
   * Attaches a delegative event listener to the element/document
   *
   * USAGE:
   *    $(element).delegate('click', '#css.rule', function() {...});
   *    $(element).delegate('click', '#css.rule', [func1, func2, ...]);
   *    $(element).delegate('click', '#css.rule', 'addClass', 'boo');
   *    $(element).delegate('click', '#css.rule', 'hide');
   *
   *    $(element).delegate('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * @param event name
   * @param css-rule a hash or rules
   * @param callback
   * @return this
   */
  delegate: function(event) {
    var rules = delegation_rules(arguments), css_rule, i, j, list;
    for (css_rule in rules) {
      for (i=0, list = rules[css_rule]; i < list.length; i++) {
        // registering the delegative listener
        this.on(event, build_delegative_listener(css_rule, list[i], this));

        // adding the css-rule and callback references to the store
        $ext(this.$listeners.last(), { dr: css_rule, dc: list[i][0] });
      }
    }

    return this;
  },

  /**
   * Removes a delegative event listener from the element
   *
   * USAGE:
   *    $(element).undelegate('click');
   *    $(element).undelegate('click', '#css.rule');
   *    $(element).undelegate('click', '#css.rule', function() {});
   *    $(element).undelegate('click', '#css.rule', [func1, func2, ...]);
   *    $(element).undelegate('click', '#css.rule', 'addClass', 'boo');
   *    $(element).undelegate('click', '#css.rule', 'hide');
   *
   *    $(element).undelegate('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * @param event name
   * @param css-rule or a hash or rules
   * @param callback
   * @return this
   */
  undelegate: function(event) {
    delegation_listeners(arguments, this).each(function(h) {
      this.stopObserving(h.n, h.f);
    }, this);

    return this;
  },

  /**
   * Checks if there is sucha delegative event listener
   *
   * USAGE:
   *    $(element).delegates('click');
   *    $(element).delegates('click', '#css.rule');
   *    $(element).delegates('click', '#css.rule', function() {});
   *    $(element).delegates('click', '#css.rule', [func1, func2, ...]);
   *    $(element).delegates('click', '#css.rule', 'addClass', 'boo');
   *    $(element).delegates('click', '#css.rule', 'hide');
   *
   *    $(element).delegates('click', {
   *      '#css.rule1': function() {},
   *      '#css.rule2': [func1, func2, ...],
   *      '#css.rule3': ['addClass', 'boo'],
   *      '#css.rule4': 'hide'
   *    });
   *
   * NOTE:
   *    if several rules are specified then it will check if
   *    _any_ of them are delegateed
   *
   * @param event name
   * @param css-rule or a hash of rules
   * @param callback
   * @return boolean check result
   */
  delegates: function() {
    return !!delegation_listeners(arguments, this).length;
  }
});

/**
 * Builds the actual event listener that will delegate stuff
 * to other elements as they reach the element where the listener
 * attached
 *
 * @param String css rule
 * @param Arguments the original arguments list
 * @param Object scope
 * @return Function the actual event listener
 */
function build_delegative_listener(css_rule, entry, scope) {
  var args = $A(entry), callback = args.shift();
  return function(event) {
    var target = event.find(css_rule);
    return target === undefined ? target :
      typeof(callback) === 'string' ?
        target[callback].apply(target, args) :
        callback.apply(target, [event].concat(args));
  };
}

/**
 * Converts the events-delegation api arguments
 * into a systematic hash of rules
 *
 * @param Arguments arguments
 * @return Object hash of rules
 */
function delegation_rules(raw_args) {
  var args = $A(raw_args), rules = args[1] || {}, hash = {}, css_rule;

  if (isString(rules)) {
    hash[rules] = args.slice(2);
    if (isArray(hash[rules][0])) {
      hash[rules] = hash[rules][0].map(ensure_array);
    }
  } else {
    hash = rules;
  }

  // converting everything into a hash of lists of callbacks
  for (css_rule in hash) {
    hash[css_rule] = ensure_array(hash[css_rule]);
    hash[css_rule] = isArray(hash[css_rule][0]) ? hash[css_rule] : [hash[css_rule]];
  }

  return hash;
}

/**
 * Returns the list of delegative listeners that match the conditions
 *
 * @param Arguments raw-arguments
 * @param Element the element
 * @return Array list of matching listeners
 */
function delegation_listeners(args, object) {
  var event = args[0], i, list,
     rules = delegation_rules(args),
     rules_are_empty = !Object.keys(rules).length;

  return (object.$listeners || []).filter(function(hash) {
    return hash.dr && hash.n === event && (
      rules_are_empty || (function() {
        for (var css_rule in rules) {
          if (hash.dr === css_rule) {
            for (i=0, list = rules[css_rule]; i < list.length; i++) {
              if (!list[i].length || list[i][0] === hash.dc) {
                return true;
              }
            }
          }
        }

        return false;
      })()
    );
  });
}


/**
 * Some String level shortcuts to handle collections of elements
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */

/**
 * Some nice shortcuts for the document-level events delegation handling
 *
 * USAGE:
 *
 *   "ul#main-menu li".on("click", function() { alert('clicked'); });
 *   "ul#main-menu li".on("mouseover", "addClass", "hovered");
 *   "ul#main-menu li".on("mouseout", "removeClass", "hovered");
 *
 *   // or like that in a shash
 *   "ul#main-menu li".on({
 *     click:     function() { alert('clicked'); },
 *     mouseover: ['addClass',    'hovered'],
 *     mouseout:  ['removeClass', 'hovered'],
 *     dblclick:  'hide'
 *   });
 *
 *
 *   "#css.rule".observes('click');
 *   "#css.rule".observes('click', function() {});
 *   "#css.rule".observes('click', 'method_name');
 *   ....
 *
 *   "#css.rule".stopObserving('click');
 *   "#css.rule".stopObserving('click', function() {});
 *   "#css.rule".stopObserving('click', 'method_name');
 *    ....
 */
Object.each({
  on:            'delegate',
  stopObserving: 'undelegate',
  observes:      'delegates'
}, function(name, method) {
  String.prototype[name] = function() {
    var args = $A(arguments), result;

    args.splice(1,0,''+this);
    result = current_Document[method].apply(current_Document, args);

    return result === current_Document ? this : result;
  };
});
var old_on = String.prototype.on;
String.prototype.on = function(hash) {
  if (isHash(hash)) {
    for (var key in hash) {
      old_on.apply(this, [key].concat([hash[key]]));
    }
  } else {
    old_on.apply(this, arguments);
  }
  return this;
};

/**
 * building the list of String#onEvent shortucts
 *
 * USAGE:
 *
 *    "#css.rule".onClick(function() {...});
 *    "#css.rule".onMouseover('method_name');
 */
Event_delegation_shortcuts.each(function(name) {
  String.prototype['on'+name.capitalize()] = function() {
    return this.on.apply(this, [name].concat($A(arguments)));
  };
});

/**
 * The rest of the DOM methods access
 *
 * USAGE:
 *   "#css.rule".addClass('boo-hoo');
 *   "#css.rule".setStyle({color: 'red'});
 *
 */
$w('Element Input Form').each(function(klass) {
  Object.each(klass in RightJS ? RightJS[klass].prototype : {}, function(name, method) {
    if (isFunction(method) && !(name in String.prototype)) {
      String.prototype[name] = function() {
        var nodes = $$(this, true), i=0, l = nodes.length, first=true, element, result;
        for (; i < l; i++) {
          element = wrap(nodes[i]);
          result  = element[name].apply(element, arguments);

          // checking if that's a data-retrieving call
          if (first) {
            if (result !== element) {
              return result;
            }
            first = false;
          }
        }

        // don't return the string itself in here,
        // it will screw with data-retrieving calls on empty collections
        return null;
      };
    }
  });
});

/**
 * XMLHttpRequest wrapper
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
var Xhr = RightJS.Xhr = new Class(Observer, {
  extend: {
    // supported events list
    EVENTS: $w('success failure complete request cancel create'),

    // default options
    Options: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript,text/html,application/xml,text/xml,*/*'
      },
      method:       'post',
      encoding:     'utf-8',
      async:        true,
      evalScripts:  false,
      evalResponse: false,
      evalJS:       true,
      evalJSON:     true,
      secureJSON:   true,
      urlEncoded:   true,
      spinner:      null,
      spinnerFx:    'fade',
      params:       null,
      iframed:      false,
      jsonp:        false
    },

    /**
     * Shortcut to initiate and send an XHR in a single call
     *
     * @param String url
     * @param Object options
     * @return Xhr request
     */
    load: function(url, options) {
      return new this(url, $ext({method: 'get'}, options)).send();
    }
  },

  /**
   * basic constructor
   *
   * @param String url
   * @param Object options
   */
  initialize: function(url, options) {
    this.initCallbacks(); // system level callbacks should be initialized before the user callbacks

    this.url = url;

    // copying some options to the instance level attributes
    $ext(this.$super(options), this.options);

    // merging in the global params
    if (this.params != Xhr.Options.params) {
      this.params = this.prepareData(Xhr.Options.params, this.params);
    }

    // removing the local spinner if it's the same as the global one
    if (Xhr.Options.spinner && $(this.spinner) === $(Xhr.Options.spinner)) {
      this.spinner = null;
    }
  },

  /**
   * sets a header
   *
   * @param name String header name
   * @param value String header value
   * @return Xhr self
   */
  setHeader: function(name, value) {
    this.headers[name] = value;
    return this;
  },

  /**
   * tries to get a response header
   *
   * @return mixed String header value or undefined
   */
  getHeader: function(name) {
    var value;
    try {
      value = this.xhr.getResponseHeader(name);
    } catch(e) {}
    return value;
  },

  /**
   * checks if the request was successful
   *
   * @return boolean check result
   */
  successful: function() {
    return (this.status >= 200) && (this.status < 300);
  },

  /**
   * performs the actual request sending
   *
   * @param Object options
   * @return Xhr self
   */
  send: function(params) {
    var add_params = {},
        url = this.url,
        method  = this.method.toLowerCase(),
        headers = this.headers,
        key, xhr;

    if (method == 'put' || method == 'delete') {
      add_params._method = method;
      method = 'post';
    }

    var data = this.prepareData(this.params, this.prepareParams(params), add_params);

    if (this.urlEncoded && method == 'post' && !headers['Content-type']) {
      this.setHeader('Content-type', 'application/x-www-form-urlencoded;charset='+this.encoding);
    }

    if (method == 'get') {
      if (data) { url += (url.include('?') ? '&' : '?') + data; }
      data = null;
    }

    xhr = this.xhr = this.createXhr();
    this.fire('create');

    xhr.open(method, url, this.async);

    xhr.onreadystatechange = this.stateChanged.bind(this);

    for (key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }

    xhr.send(data);
    this.fire('request');

    if (!this.async) { this.stateChanged(); }

    return this;
  },

  /**
   * elements automaticall update method, creates an Xhr request
   * and updates the element innerHTML value onSuccess.
   *
   * @param Element element
   * @param Object optional request params
   * @return Xhr self
   */
  update: function(element, params) {
    return this.onSuccess(function(r) { element.update(r.text); }).send(params);
  },

  /**
   * stops the request processing
   *
   * @return Xhr self
   */
  cancel: function() {
    var xhr = this.xhr;

    if (!xhr || xhr.canceled) { return this; }

    xhr.abort();
    xhr.onreadystatechange = function() {};
    xhr.canceled = true;

    return this.fire('cancel');
  },

// protected
  // wrapping the original method to send references to the xhr objects
  fire: function(name) {
    return this.$super(name, this, this.xhr);
  },

  // creates new request instance
  createXhr: function() {
    if (this.jsonp) {
      return new Xhr.JSONP(this);
    } else if (this.form && this.form.first('input[type=file]')) {
      return new Xhr.IFramed(this.form);
    } else if ('ActiveXObject' in window){
      return new ActiveXObject('MSXML2.XMLHTTP');
    } else {
      return new XMLHttpRequest();
    }
  },

  // prepares user sending params
  prepareParams: function(params) {
    return params;
  },

  // converts all the params into a url params string
  prepareData: function() {
    return $A(arguments).map(function(param) {
      if (!isString(param)) {
        param = Object.toQueryString(param);
      }
      return param.blank() ? null : param;
    }).compact().join('&');
  },

  // handles the state change
  stateChanged: function() {
    var xhr = this.xhr;

    if (xhr.readyState != 4 || xhr.canceled) { return; }

    try { this.status = xhr.status;
    } catch(e) { this.status = 0; }

    this.text = this.responseText = xhr.responseText;
    this.xml  = this.responseXML  = xhr.responseXML;

    this.fire('complete').fire(this.successful() ? 'success' : 'failure');
  },

  // called on success
  tryScripts: function(response) {
    var content_type = this.getHeader('Content-type');
    var x_json_data  = this.getHeader('X-JSON');

    if (x_json_data) {
      this.json = this.responseJSON = this.headerJSON = JSON.parse(x_json_data);
    }

    if (this.evalResponse || (this.evalJS && /(ecma|java)script/i.test(content_type))) {
      $eval(this.text);
    } else if (/json/.test(content_type) && this.evalJSON) {
      this.json = this.responseJSON = JSON.parse(this.text);
    } else if (this.evalScripts) {
      this.text.evalScripts();
    }
  },

  // initializes the request callbacks
  initCallbacks: function() {
    // connecting basic callbacks
    this.on({
      create:   'showSpinner',
      complete: 'hideSpinner',
      cancel:   'hideSpinner'
    });

    this.on('complete', 'tryScripts');

    // wiring the global xhr callbacks
    Xhr.EVENTS.each(function(name) {
      this.on(name, function() { Xhr.fire(name, this, this.xhr); });
    }, this);
  },

  showSpinner: function() { Xhr.showSpinner.call(this, this); },
  hideSpinner: function() { Xhr.hideSpinner.call(this, this); }
});

// attaching the common spinner handling
$ext(Observer_create(Xhr), {
  counter: 0,

  // shows the spinner
  showSpinner: function(context) {
    Xhr.trySpinner(context, 'show');
  },

  // hides the spinner
  hideSpinner: function(context) {
    Xhr.trySpinner(context, 'hide');
  },

  trySpinner: function(context, method) {
    var object = context || Xhr.Options, spinner = $(object.spinner);
    if (spinner) { spinner[method](object.spinnerFx, {duration: 100}); }
  },

  // counts a request in
  countIn: function() {
    Xhr.counter ++;
    Xhr.showSpinner();
  },

  // counts a request out
  countOut: function() {
    Xhr.counter --;
    if (Xhr.counter < 1) {
      Xhr.hideSpinner();
    }
  }
}).on({
  create:   'countIn',
  complete: 'countOut',
  cancel:   'countOut'
});


/**
 * Here are the Form unit Xhr extensions
 *
 * Credits:
 *   Some of the functionality inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2009-2011 Nikolay V. Nemshilov
 */
Form.include({
  /**
   * sends the form via xhr request
   *
   * @param Options xhr request options
   * @return Form this
   */
  send: function(options) {
    options = options || {};
    options.method = options.method || this._.method || 'post';

    this.xhr = new Xhr(
      this._.action || document.location.href,
      $ext({spinner: this.first('.spinner')}, options)
    )
    .onComplete(this.enable.bind(this))
    .onCancel(this.enable.bind(this))
    .send(this);

    this.disable.bind(this).delay(1); // webkit needs this async call with iframed calls
    return this;
  },

  /**
   * Cancels current Xhr request (if there are any)
   *
   * @return Form this
   */
  cancelXhr: function() {
    if (this.xhr instanceof Xhr) {
      this.xhr.cancel();
    }

    return this;
  },

  /**
   * makes the form be remote by default
   *
   * @param Object default options
   * @return Form this
   */
  remotize: function(options) {
    if (!this.remote) {
      this.on('submit', Form_remote_send, options);
      this.remote = true;
    }

    return this;
  },

  /**
   * removes the remote call hook
   *
   * @return Form this
   */
  unremotize: function() {
    this.stopObserving('submit', Form_remote_send);
    this.remote = false;
    return this;
  }
});

/**
 * Catches the form submit events and sends the form remotely
 *
 * @param Event submit
 * @param Object xhr options
 * @return void
 */
function Form_remote_send(event, options) {
  event.stop();
  this.send(options);
}

/**
 * Adds Xhr params handling if a Form element is passed to Xhr#send
 * 
 * @param Object params - could be Hash or Form element
 * @return Object
 */
Xhr.include({
  prepareParams: function(params) {
    if (params && params instanceof Form) {
      this.form = params;
      params = params.values();
    }
    return params;
  }
});


/**
 * this module contains the Element unit XHR related extensions
 *
 * Credits:
 *   - jQuery    (http://jquery.com)        Copyright (C) John Resig
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * performs an Xhr request to the given url
   * and updates the element internals with the responseText
   *
   * @param String url address
   * @param Object xhr options
   * @return Element this
   */
  load: function(url, options) {
    new Xhr(url, $ext({method: 'get'}, options)).update(this);
    return this;
  }
});


/**
 * A dummy XmlHTTPRequest interface to be used in other
 * fake requests
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Xhr.Dummy = {
  open:               function() {},
  setRequestHeader:   function() {},
  onreadystatechange: function() {}
};


/**
 * This unit presents a fake drop in replacement for the XmlHTTPRequest unit
 * but works with an iframe targeting in the background
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */
Xhr.IFramed = new Class({
  include: Xhr.Dummy,

  /**
   * constructor
   *
   * @param Form form which will be submitted via the frame
   * @return void
   */
  initialize: function(form) {
    this.form = form;
    this.id   = 'xhr_'+ new Date().getTime();

    this.form.doc().first('body').append('<i><iframe name="'+this.id+'" id="'+this.id+
      '" width="0" height="0" frameborder="0" src="about:blank"></iframe></i>',
      'after');

    $(this.id).on('load', this.onLoad.bind(this));
  },

  send: function() {
    this.form.set('target', this.id).submit();
  },

  onLoad: function() {
    this.status       = 200;
    this.readyState   = 4;

    this.form.set('target', '');

    try {
      this.responseText = window[this.id].document.documentElement.innerHTML;
    } catch(e) { }

    this.onreadystatechange();
  },

  abort: function() {
    $(this.id).set('src', 'about:blank');
  }
});


/**
 * The JSONP Xhr request tonnel
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Xhr.JSONP = new Class({
  include: Xhr.Dummy,

  prefix: 'jsonp',

  /**
   * Constructor
   *
   * @param Xhr the actual xhr request object
   * @return void
   */
  initialize: function(xhr) {
    this.xhr   = xhr;
    this.name  = this.prefix + new Date().getTime();
    this.param = (isString(xhr.jsonp) ?
      xhr.jsonp : 'callback') + "=" + this.name;

    this.script = $E('script', {
      charset: xhr.encoding,
      async:   xhr.async
    });
  },

  /**
   * saving the url and method for the further use
   *
   * @param method String request method
   * @param address String request url address
   * @param Boolean async request marker
   * @return void
   */
  open: function(method, url, async) {
    this.url    = url;
    this.method = method;
  },

  /**
   * Sends the actual request by inserting the script into the document body
   *
   * @param String data
   * @return void
   */
  send: function(data) {
    window[this.name] = this.finish.bind(this);

    this.script.set('src', this.url + (this.url.include('?') ? '&' : '?') + this.param + "&" + data)
      .insertTo($$('script').last(), 'after');
  },

  /**
   * Receives the actual JSON data from the server
   *
   * @param Object JSON data
   * @return void
   */
  finish: function(data) {
    this.status       = 200;
    this.readyState   = 4;

    this.xhr.json = this.xhr.responseJSON = data;

    this.onreadystatechange();
  },

  /**
   * We can't really cancel a JSONP request
   * but we can prevent the default handler to ckick in
   *
   * @return void
   */
  abort: function() {
    window[this.name] = function() {};
  }
});


/**
 * Basic visual effects class
 *
 * Credits:
 *   The basic principles, structures and naming system are inspired by
 *     - MooTools  (http://mootools.net) Copyright (C) Valerio Proietti
 *   The cubic bezier emulation is backported from
 *     - Lovely.IO (http://lovely.io) Copytirhgt (C) Nikolay Nemshilov
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
var Fx = RightJS.Fx = new Class(Observer, {
  extend: {
    EVENTS: $w('start finish cancel'),

    // named durations
    Durations: {
      'short':  200,
      'normal': 400,
      'long':   800
    },

    // default options
    Options: {
      fps:        IE8_OR_LESS ? 40 : 60,
      duration:   'normal',
      transition: 'default',
      queue:      true,
      engine:     'css'
    }
  },

  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(element, options) {
    this.$super(options);
    this.element = $(element);
    fx_register(this);
  },

  /**
   * starts the transition
   *
   * @return Fx this
   */
  start: function() {
    if (fx_add_to_queue(this, arguments)) { return this; }

    fx_mark_current(this);

    this.prepare.apply(this, arguments);

    fx_start_timer(this);

    return this.fire('start', this);
  },

  /**
   * finishes the transition
   *
   * @return Fx this
   */
  finish: function() {
    fx_stop_timer(this);
    fx_remove_from_queue(this);
    this.fire('finish');
    fx_run_next(this);
    return this;
  },

  /**
   * interrupts the transition
   *
   * NOTE:
   *   this method cancels all the scheduled effects
   *   in the element chain
   *
   * @return Fx this
   */
  cancel: function() {
    fx_stop_timer(this);
    fx_remove_from_queue(this);
    return this.fire('cancel');
  },

// protected
  // dummy method, should be implemented in a subclass
  prepare: function() {},

  // dummy method, processes the element properties
  render: function() {}
}),

// global effects registry
scheduled_fx = [], running_fx = [];

/**
 * Registers the element in the effects queue
 *
 * @param Fx effect
 * @return void
 */
function fx_register(fx) {
  var uid = $uid((fx.element || {})._ || {});
  fx.ch = (scheduled_fx[uid] = scheduled_fx[uid] || []);
  fx.cr = (running_fx[uid]   = running_fx[uid]   || []);
}

/**
 * Registers the effect in the effects queue
 *
 * @param Fx fx
 * @param Arguments original arguments list
 * @return boolean true if it queued and false if it's ready to go
 */
function fx_add_to_queue(fx, args) {
  var chain = fx.ch, queue = fx.options.queue;

  if (!chain || fx.$ch) {
    return (fx.$ch = false);
  }

  if (queue) {
    chain.push([args, fx]);
  }

  return queue && chain[0][1] !== fx;
}

/**
 * Puts the fx into the list of currently running effects
 *
 * @param Fx fx
 * @return void
 */
function fx_mark_current(fx) {
  if (fx.cr) {
    fx.cr.push(fx);
  }
}

/**
 * Removes the fx from the queue
 *
 * @param Fx fx
 * @return void
 */
function fx_remove_from_queue(fx) {
  var currents = fx.cr;
  if (currents) {
    currents.splice(currents.indexOf(fx), 1);
  }
}

/**
 * Tries to invoke the next effect in the queue
 *
 * @param Fx fx
 * @return void
 */
function fx_run_next(fx) {
  var chain = fx.ch, next = chain.shift();
  if ((next = chain[0])) {
    next[1].$ch = true;
    next[1].start.apply(next[1], next[0]);
  }
}

/**
 * Cancels all currently running and scheduled effects
 * on the element
 *
 * @param Element element
 * @return void
 */
function fx_cancel_all(element) {
  var uid = $uid(element._);

  (running_fx[uid] || []).each('cancel');
  (scheduled_fx[uid] || []).splice(0);
}

/**
 * Initializes the fx rendering timer
 *
 * @param Fx fx
 * @return void
 */
function fx_start_timer(fx) {
  var options    = fx.options,
      duration   = Fx.Durations[options.duration] || options.duration,
      steps      = Math.ceil(duration / 1000 * options.fps),
      transition = Bezier_sequence(options.transition, steps),
      interval   = Math.round(1000 / options.fps),
      number     = 0;

  fx._timer = setInterval(function() {
    if (number === steps) {
      fx.finish();
    } else {
      fx.render(transition[number]);
      number++;
    }
  }, interval);
}

/**
 * Cancels the Fx rendering timer (if any)
 *
 * @param Fx fx
 * @return void
 */
function fx_stop_timer(fx) {
  if (fx._timer) {
    clearInterval(fx._timer);
  }
}


///////////////////////////////////////////////////////////////////////////////
// CSS3 Cubic Bezier sequentions emulator
// Backport from Lovely.IO (http://lovely.io)
// See also:
// http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
///////////////////////////////////////////////////////////////////////////////

// CSS3 cubic-bezier presets
var Bezier_presets = {
  'default':     '(.25,.1,.25,1)',
  'linear':      '(0,0,1,1)',
  'ease-in':     '(.42,0,1,1)',
  'ease-out':    '(0,0,.58,1)',
  'ease-in-out': '(.42,0,.58,1)',
  'ease-out-in': '(0,.42,1,.58)'
},

// Bezier loockup tables cache
Bezier_cache = {};

// builds a loockup table of parametric values with a given size
function Bezier_sequence(params, size) {
  params = Bezier_presets[params] || native_fx_functions[params] || params;
  params = params.match(/([\d\.]+)[\s,]+([\d\.]+)[\s,]+([\d\.]+)[\s,]+([\d\.]+)/);
  params = [0, params[1]-0, params[2]-0, params[3]-0, params[4]-0]; // cleaning up

  var name = params.join(',') + ',' + size, Cx, Bx, Ax, Cy, By, Ay, sequence, step, x;

  function bezier_x(t) { return t * (Cx + t * (Bx + t * Ax)); }
  function bezier_y(t) { return t * (Cy + t * (By + t * Ay)); }

  // a quick search for a more or less close parametric
  // value using several iterations by Newton's method

  function bezier_x_der(t) { // bezier_x derivative
    return Cx + t * (2*Bx + t * 3*Ax) + 1e-3;
  }
  function find_parametric(t) {
    var x=t, i=0, z;

    while (i < 5) {
      z = bezier_x(x) - t;

      if (Math.abs(z) < 1e-3) { break; }

      x = x - z/bezier_x_der(x);
      i++;
    }

    return x;
  }

  if (!(name in Bezier_cache)) {
    // defining bezier functions in a polynomial form (coz it's faster)
    Cx = 3 * params[1];
    Bx = 3 * (params[3] - params[1]) - Cx;
    Ax = 1 - Cx - Bx;

    Cy = 3 * params[2];
    By = 3 * (params[4] - params[2]) - Cy;
    Ay = 1 - Cy - By;


    // building the actual lookup table
    Bezier_cache[name] = sequence = [];
    x=0; step=1/size;

    while (x < 1.0001) { // should include 1.0
      sequence.push(bezier_y(find_parametric(x)));
      x += step;
    }
  }

  return Bezier_cache[name];
}

/**
 * There are the String unit extensions for the effects library
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov
 */
String.COLORS = {
  maroon:  '#800000',
  red:     '#ff0000',
  orange:  '#ffA500',
  yellow:  '#ffff00',
  olive:   '#808000',
  purple:  '#800080',
  fuchsia: '#ff00ff',
  white:   '#ffffff',
  lime:    '#00ff00',
  green:   '#008000',
  navy:    '#000080',
  blue:    '#0000ff',
  aqua:    '#00ffff',
  teal:    '#008080',
  black:   '#000000',
  silver:  '#c0c0c0',
  gray:    '#808080',
  brown:   '#a52a2a'
};

String.include({
  /**
   * converts a #XXX or rgb(X, X, X) sring into standard #XXXXXX color string
   *
   * @return String hex color
   */
  toHex: function() {
    var match = /^#(\w)(\w)(\w)$/.exec(this);

    if (match) {
      match = "#"+ match[1]+match[1]+match[2]+match[2]+match[3]+match[3];
    } else if ((match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(this))) {
      match = "#"+ match.slice(1).map(function(bit) {
        bit = (bit-0).toString(16);
        return bit.length == 1 ? '0'+bit : bit;
      }).join('');
    } else {
      match = String.COLORS[this] || this;
    }

    return match;
  },

  /**
   * converts a hex string into an rgb array
   *
   * @param boolean flag if need an array
   * @return String rgb(R,G,B) or Array [R,G,B]
   */
  toRgb: function(array) {
    var match = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(this.toHex()||'');

    if (match) {
      match = match.slice(1).map('toInt', 16);
      match = array ? match : 'rgb('+match+')';
    }

    return match;
  }
});


/**
 * This block contains additional Element shortcuts for effects easy handling
 *
 * Credits:
 *   Some ideas are inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * Stops all the visual effects on the element
   *
   * @return Element this
   */
  stop: function() {
    fx_cancel_all(this);
    return this;
  },

  /**
   * hides the element with given visual effect
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  hide: function(fx, options) {
    return (fx && this.visible()) ? call_fx(this, fx, ['out', options]) : this.$super();
  },

  /**
   * shows the element with the given visual effect
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  show: function(fx, options) {
    return (fx && !this.visible()) ? call_fx(this, fx, ['in', options]) : this.$super();
  },

  /**
   * Toggles the element state with visual effect
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  toggle: function(fx, options) {
    return fx ? call_fx(this, fx, ['toggle', options]) : this.$super();
  },

  /**
   * Removes the element out of the DOM structure
   *
   * @param String fx name
   * @param Object fx options
   * @return Element this
   */
  remove: function(fx, options) {
    return (fx && this.visible()) ? call_fx(this, fx, ['out', $ext(options || {}, {
      onFinish: this.$super.bind(this)
    })]) : this.$super();
  },

  /**
   * runs the Fx.Morth effect to the given style
   *
   * @param style Object style
   * @param options Object optional effect options
   * @return Element self
   */
  morph: function(style, options) {
    return call_fx(this, 'morph', [style, options || {}]); // <- don't replace with arguments
  },

  /**
   * highlights the element
   *
   * @param start String start color
   * @param end String optional end color
   * @param Object effect options
   * @return Element self
   */
  highlight: function() {
    return call_fx(this, 'highlight', arguments);
  },

  /**
   * runs the Fx.Fade effect on the element
   *
   * @param mixed fade direction 'in' 'out' or a float number
   * @return Element self
   */
  fade: function() {
    return call_fx(this, 'fade', arguments);
  },

  /**
   * runs the Fx.Slide effect on the element
   *
   * @param String 'in' or 'out'
   * @param Object effect options
   * @return Element self
   */
  slide: function() {
    return call_fx(this, 'slide', arguments);
  },

  /**
   * Starts the smooth scrolling effect
   *
   * @param position Object {x: NNN, y: NNN} where to scroll
   * @param options Object fx-options
   * @return Element this
   */
  scroll: function(value, options) {
    return call_fx(this, 'scroll', [value, options||{}]);
  },

  /**
   * wraps the old scroll to be able to run it with fxes
   *
   * If you send two hashes then will start a smooth scrolling
   * otherwise will just jump over with the usual method
   *
   * @return Element this
   */
  scrollTo: function(value, options) {
    return isHash(options) ? this.scroll(value, options) : this.$super.apply(this, arguments);
  }
});

/**
 * Calls the visual effect on the element
 *
 * @param Element context
 * @param String fx-name
 * @param Object fx-options
 * @return Element context
 */
function call_fx(element, name, params) {
  var args    = $A(params).compact(),
      options = isHash(args.last()) ? args.pop() : {},
      fx      = new Fx[name.capitalize()](element, options);

  fx.start.apply(fx, args);

  return element;
}


/**
 * This class provides the basic effect for styles manipulation
 *
 * Copyright (C) 2008-2011 Nikolay Nemshilov
 */

/////////////////////////////////////////////////////////////////////////////
// Native css-transitions based implementation
/////////////////////////////////////////////////////////////////////////////

var native_fx_prefix = ['WebkitT', 'OT', 'MozT', 'MsT', 't'].first(function(name) {
  return name + 'ransition' in HTML.style;
}),
native_fx_transition = native_fx_prefix     + 'ransition',
native_fx_property   = native_fx_transition + 'Property',
native_fx_duration   = native_fx_transition + 'Duration',
native_fx_function   = native_fx_transition + 'TimingFunction',

// basic transition algorithm replacements
native_fx_functions  = {
  Sin: 'cubic-bezier(.3,0,.6,1)',
  Cos: 'cubic-bezier(0,.3,.6,0)',
  Log: 'cubic-bezier(0,.6,.3,.8)',
  Exp: 'cubic-bezier(.6,0,.8,.3)',
  Lin: 'cubic-bezier(0,0,1,1)'
};

function native_fx_prepare(style) {
  var options = this.options,
      element = this.element,
      element_style = element._.style,
      old_style = Object.only(
        element.computedStyles(),
        native_fx_property,
        native_fx_duration,
        native_fx_function
      );

  function reset_transitions_style() {
    for (var key in old_style) {
      element_style[key] = old_style[key];
    }
  }

  this
    .onFinish(reset_transitions_style)
    .onCancel(function() {
      element_style[native_fx_property] = 'none';
      setTimeout(reset_transitions_style, 1);
    });

  // setting up the transition
  element_style[native_fx_property] = 'all';
  element_style[native_fx_duration] = (Fx.Durations[options.duration] || options.duration) +'ms';
  element_style[native_fx_function] = native_fx_functions[options.transition] || options.transition;

  setTimeout(function() { element.setStyle(style); }, 0);
}

// NOTE: OPERA's css-transitions are a bit jerky so we disable them by default
Fx.Options.engine = native_fx_prefix === undefined || Browser_Opera ? 'javascript' : 'native';

////////////////////////////////////////////////////////////////////////////
// Manual version
////////////////////////////////////////////////////////////////////////////

Fx.Morph = new Class(Fx, {
// protected

  // parepares the effect
  prepare: function(style) {
    if (this.options.engine === 'native' && native_fx_prefix !== undefined) {
      this.render = this.transition = function() {};
      native_fx_prepare.call(this, style);
    } else {
      var keys   = style_keys(style),
          before = clone_style(this.element, keys),
          after  = end_style(this.element, style, keys);

      clean_styles(this.element, before, after);

      this.before = parse_style(before);
      this.after  = parse_style(after);
    }
  },

  render: function(delta) {
    var before, after, value, style = this.element._.style, key, i, l;
    for (key in this.after) {
      before = this.before[key];
      after  = this.after[key];

      for (i=0, l = after.length; i < l; i++) {
        value = before[i] + (after[i] - before[i]) * delta;
        if (after.r) {
          value = Math.round(value);
        }
        after.t[i*2 + 1] = value;
      }

      style[key] = after.t.join('');
    }
  }
});

// a list of common style names to compact the code a bit
var directions = $w('Top Left Right Bottom');

// adds variants to the style names list
function add_variants(keys, key, variants) {
  for (var i=0; i < variants.length; i++) {
    keys.push(key + variants[i]);
  }
}

// creates an appropriate style-keys list out of the user styles
function style_keys(style) {
  var keys = [], border_types = ['Style', 'Color', 'Width'], key, i, j;

  for (key in style) {
    if (key.startsWith('border')) {
      for (i=0; i < 3; i++) {
        for (j=0; j < 4; j++) {
          keys.push('border' + directions[j] + border_types[i]);
        }
      }
    } else if (key === 'margin' || key === 'padding') {
      add_variants(keys, key, directions);
    } else if (key.startsWith('background')) {
      add_variants(keys, 'background', ['Color', 'Position', 'PositionX', 'PositionY']);
    } else if (key === 'opacity' && IE_OPACITY) {
      keys.push('filter');
    } else {
      keys.push(key);
    }
  }

  return keys;
}


// checks if the color is transparent
function is_transparent(color) {
  return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
}

// adjusts the border-styles
function check_border_styles(element, before, after) {
  for (var i=0; i < 4; i++) {
    var
      bd_style = 'border' + directions[i] + 'Style',
      bd_width = 'border' + directions[i] + 'Width',
      bd_color = 'border' + directions[i] + 'Color';

    if (bd_style in before && before[bd_style] != after[bd_style]) {
      var style = element._.style;

      if (before[bd_style] == 'none') {
        style[bd_width] = '0px';
      }

      style[bd_style] = after[bd_style];
      if (is_transparent(before[bd_color])) {
        style[bd_color] = element.getStyle('Color');
      }
    }
  }
}

// parses the style hash into a processable format
function parse_style(values) {
  var result = {}, re = /[\d\.\-]+/g, m, key, value, i;

  for (key in values) {
    m = values[key].match(re);
    value = m.map('toFloat');
    value.t = values[key].split(re);
    value.r = value.t[0] === 'rgb(';

    if (value.t.length == 1) { value.t.unshift(''); }

    for (i=0; i < value.length; i++) {
      value.t.splice(i*2 + 1, 0, value[i]);
    }
    result[key] = value;
  }

  return result;
}

// cleans up and optimizies the styles
function clean_styles(element, before, after) {
  var key;

  for (key in after) {
    // checking the height/width options
    if ((key == 'width' || key == 'height') && before[key] == 'auto') {
      before[key] = element._['offset'+key.capitalize()] + 'px';
    }
  }

  // IE opacity filter fix
  if (IE_OPACITY && after.filter && !before.filter) {
    before.filter = 'alpha(opacity=100)';
  }

  // adjusting the border style
  check_border_styles(element, before, after);

  // cleaing up the list
  for (key in after) {
    // proprocessing colors
    if (after[key] !== before[key] && /color/i.test(key)) {
      if (Browser_Opera) {
        after[key] = after[key].replace(/"/g, '');
        before[key] = before[key].replace(/"/g, '');
      }

      if (!is_transparent(after[key]))  { after[key]  = after[key].toRgb(); }
      if (!is_transparent(before[key])) { before[key] = before[key].toRgb(); }

      if (!after[key] || !before[key]) {  after[key] = before[key] = ''; }
    }

    // filling up the missing size
    if (/\d/.test(after[key]) && !/\d/.test(before[key])) {
      before[key] = after[key].replace(/[\d\.\-]+/g, '0');
    }

    // removing unprocessable keys
    if (after[key] === before[key] || !/\d/.test(before[key]) || !/\d/.test(after[key])) {
      delete(after[key]);
      delete(before[key]);
    }
  }
}

// cloning the element current styles hash
function clone_style(element, keys) {
  var i=0, len = keys.length, style = element.computedStyles(), clean = {}, key;

  for (; i < len; i++) {
    key = keys[i];

    if (key in style) {
      clean[key] = ''+ style[key];

      // libwebkit bug fix for in case of languages pack applied
      if (key === 'opacity') {
        clean[key] = clean[key].replace(',', '.');
      }
    }
  }

  return clean;
}

// calculating the end styles hash
function end_style(element, style, keys) {
  var dummy = element.clone()
      .setStyle('position:absolute;z-index:-1;visibility:hidden')
      .setWidth(element.size().x)
      .setStyle(style), after;

  if (element.parent()) {
    element.insert(dummy, 'before');
  }

  after = clone_style(dummy, keys);
  dummy.remove();

  return after;
}


/**
 * the elements hightlighting effect
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Fx.Highlight = new Class(Fx.Morph, {
  extend: {
    Options: Object.merge(Fx.Options, {
      color:      '#FF8',
      transition: 'Exp'
    })
  },

// protected

  /**
   * starts the transition
   *
   * @param high String the hightlight color
   * @param back String optional fallback color
   * @return self
   */
  prepare: function(start, end) {
    var element       = this.element,
        element_style = element._.style,
        style_name    = 'backgroundColor',
        end_color     = end || element.getStyle(style_name);

    if (is_transparent(end_color)) {
      this.onFinish(function() { element_style[style_name] = 'transparent'; });

      // trying to find the end color
      end_color = [element].concat(element.parents())
        .map('getStyle', style_name)
        .reject(is_transparent)
        .compact().first() || '#FFF';
    }

    element_style[style_name] = (start || this.options.color);

    return this.$super({backgroundColor: end_color});
  }
});


/**
 * this is a superclass for the bidirectional effects
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Fx.Twin = new Class(Fx.Morph, {

  /**
   * hides the element if it meant to be switched off
   *
   * @return Fx self
   */
  finish: function() {
    if (this.how === 'out') {
      // calling 'prototype' to prevent circular calls from subclasses
      Element.prototype.hide.call(this.element);
    }

    return this.$super();
  },

// protected

  /**
   * assigns the direction of the effect in or out
   *
   * @param String 'in', 'out' or 'toggle', 'toggle' by default
   */
  setHow: function(how) {
    this.how = how || 'toggle';

    if (this.how === 'toggle') {
      this.how = this.element.visible() ? 'out' : 'in';
    }
  }

});


/**
 * the slide effects wrapper
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Fx.Slide = new Class(Fx.Twin, {
  extend: {
    Options: Object.merge(Fx.Options, {
      direction: 'top'
    })
  },

// protected
  prepare: function(how) {
    this.setHow(how);

    // calling 'prototype' to prevent circular calls from subclasses
    var element = Element.prototype.show.call(this.element),
        element_style = element._.style,
        old_styles = Object.only(
          element_style,
          'overflow', 'width', 'height',
          'marginTop', 'marginLeft'
        );

    function restore_styles() {
      for (var key in old_styles) {
        element_style[key] = old_styles[key];
      }
    }

    this.onFinish(restore_styles).onCancel(restore_styles);

    element_style.overflow = 'hidden';

    return this.$super(fx_slide_prepare_styles(
      element_style,
      element.size(),
      this.options.direction,
      this.how
    ));
  }
});

function fx_slide_prepare_styles(element_style, size, direction, how) {
  var style = {},
      margin_left = element_style.marginLeft.toFloat() || 0,
      margin_top  = element_style.marginTop.toFloat()  || 0,
      to_right  = direction === 'right',
      to_bottom = direction === 'bottom',
      vertical  = direction === 'top' || to_bottom;

  if (how === 'out') {
    style[vertical ? 'height' : 'width'] = '0px';

    if (to_right) {
      style.marginLeft = margin_left + size.x+'px';
    } else if (to_bottom) {
      style.marginTop = margin_top + size.y +'px';
    }
  } else {
    if (vertical) {
      style.height = size.y + 'px';
      element_style.height = '0px';
    } else {
      style.width = size.x + 'px';
      element_style.width = '0px';
    }

    if (to_right) {
      style.marginLeft = margin_left + 'px';
      element_style.marginLeft = margin_left + size.x + 'px';
    } else if (to_bottom) {
      style.marginTop = margin_top + 'px';
      element_style.marginTop = margin_top + size.y + 'px';
    }
  }

  return style;
}


/**
 * The opacity effects wrapper
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Fx.Fade = new Class(Fx.Twin, {
  prepare: function(how) {
    this.setHow(how);

    if (this.how === 'in') {
      // calling 'prototype' to prevent circular calls from subclasses
      Element.prototype.show.call(this.element.setStyle({opacity: 0}));
    }

    return this.$super({opacity: this.how === 'in' ? 1 : 0});
  }
});


/**
 * An abstract attributes based Fx
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Fx.Attr = new Class(Fx, {

  prepare: function(attrs) {
    this.before = {};
    this.after  = attrs;
    var key, element = this.element._;

    for (key in attrs) {
      this.before[key] = element[key];
    }
  },

  render: function(delta) {
    var key, element = this.element._, before = this.before;
    for (key in before) {
      element[key] = before[key] + (this.after[key] - before[key]) * delta;
    }
  }

});

/**
 * A smooth scrolling visual effect
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
Fx.Scroll = new Class(Fx.Attr, {

  initialize: function(element, options) {
    element = $(element);
    // swapping the actual scrollable when it's the window
    this.$super(
      element instanceof Window ?
        element._.document[
          Browser.WebKit ? 'body' : 'documentElement'
        ] : element,
      options
    );
  },

  prepare: function(value) {
    var attrs = {};

    if ('x' in value) { attrs.scrollLeft = value.x; }
    if ('y' in value) { attrs.scrollTop  = value.y; }

    this.$super(attrs);
  }

});


/**
 * this module handles the work with cookies
 *
 * Credits:
 *   Most things in the unit are take from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Cookie = RightJS.Cookie = new Class({
  include: Options,

  extend: {
    // sets the cookie
    set: function(name, value, options) {
      return new this(name, options).set(value);
    },
    // gets the cookie
    get: function(name, options) {
      return new this(name, options).get();
    },
    // deletes the cookie
    remove: function(name, options) {
      return new this(name, options).remove();
    },

    // checks if the cookies are enabled
    enabled: function() {
      document.cookie = "__t=1";
      return document.cookie.indexOf("__t=1")!=-1;
    },

    // some basic options
    Options: {
      secure:   false,
      document: document
    }
  },

  /**
   * constructor
   * @param String cookie name
   * @param Object options
   * @return void
   */
  initialize: function(name, options) {
    this.name = name;
    this.setOptions(options);
  },

  /**
   * sets the cookie with the name
   *
   * @param mixed value
   * @return Cookie this
   */
  set: function(data) {
    if (!isString(data)) { data = JSON.stringify(data); }

    var value = encodeURIComponent(data), options = this.options;

    if (options.domain) { value += '; domain=' + options.domain; }
    if (options.path)   { value += '; path=' + options.path; }
    if (options.duration) {
      var date = new Date();
      date.setTime(date.getTime() + options.duration * 24 * 60 * 60 * 1000);
      value += '; expires=' + date.toGMTString();
    }
    if (options.secure) { value += '; secure'; }
    options.document.cookie = this.name + '=' + value;
    return this;
  },

  /**
   * searches for a cookie with the name
   *
   * @return mixed saved value or null if nothing found
   */
  get: function() {
    var value = this.options.document.cookie.match(
      '(?:^|;)\\s*' + RegExp.escape(this.name) + '=([^;]*)'
    );
    if (value) {
      value = decodeURIComponent(value[1]);
      try { value = JSON.parse(value); }
      catch (e) {}
    }
    return value || null;
  },

  /**
   * removes the cookie
   *
   * @return Cookie this
   */
  remove: function() {
    this.options.duration = -1;
    return this.set('');
  }
});


// globalizing the top-level variables
$ext(window, Object.without(RightJS, 'version', 'modules'));

return RightJS;
})(window, document, Object, Array, String, Function, Number, Math);
/**
 * The old browsers support patch loading script
 * will be included in the core file when it's built
 * with the no-olds option
 *
 * Basically it just checks all the script tags on the page
 * finds the core inclusion tag and uses it's src attribute
 * to dynamically load the olds patch
 *
 * Copyright (C) 2009-2011 Nikolay V. Nemshilov
 */
if (RightJS.Browser.OLD) {
  (function(d) {
    var script  = d.createElement('script'),
        scripts = d.getElementsByTagName('script'),
        rjs_spt = scripts[scripts.length - 1];

    script.src = rjs_spt.src.replace(/(^|\/)(right)([^\/]+)$/, '$1$2-olds$3');

    rjs_spt.parentNode.appendChild(script);
  })(document);
}
