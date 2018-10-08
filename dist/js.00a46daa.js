// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/snarkdown/dist/snarkdown.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var TAGS = {
  '': ['<em>', '</em>'],
  _: ['<strong>', '</strong>'],
  '\n': ['<br />'],
  ' ': ['<br />'],
  '-': ['<hr />']
};
/** Outdent a string based on the first indented line's leading whitespace
 *	@private
 */

function outdent(str) {
  return str.replace(RegExp('^' + (str.match(/^(\t| )+/) || '')[0], 'gm'), '');
}
/** Encode special attribute characters to HTML entities in a String.
 *	@private
 */


function encodeAttr(str) {
  return (str + '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/** Parse Markdown into an HTML String. */


function parse(md) {
  var tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^```(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:\!\[([^\]]*?)\]\(([^\)]+?)\))|(\[)|(\](?:\(([^\)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(\-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,3})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*])/gm,
      context = [],
      out = '',
      last = 0,
      links = {},
      chunk,
      prev,
      token,
      inner,
      t;

  function tag(token) {
    var desc = TAGS[token.replace(/\*/g, '_')[1] || ''],
        end = context[context.length - 1] == token;

    if (!desc) {
      return token;
    }

    if (!desc[1]) {
      return desc[0];
    }

    context[end ? 'pop' : 'push'](token);
    return desc[end | 0];
  }

  function flush() {
    var str = '';

    while (context.length) {
      str += tag(context[context.length - 1]);
    }

    return str;
  }

  md = md.replace(/^\[(.+?)\]:\s*(.+)$/gm, function (s, name, url) {
    links[name.toLowerCase()] = url;
    return '';
  }).replace(/^\n+|\n+$/g, '');

  while (token = tokenizer.exec(md)) {
    prev = md.substring(last, token.index);
    last = tokenizer.lastIndex;
    chunk = token[0];

    if (prev.match(/[^\\](\\\\)*\\$/)) {} // escaped
    // Code/Indent blocks:
    else if (token[3] || token[4]) {
        chunk = '<pre class="code ' + (token[4] ? 'poetry' : token[2].toLowerCase()) + '">' + outdent(encodeAttr(token[3] || token[4]).replace(/^\n+|\n+$/g, '')) + '</pre>';
      } // > Quotes, -* lists:
      else if (token[6]) {
          t = token[6];

          if (t.match(/\./)) {
            token[5] = token[5].replace(/^\d+/gm, '');
          }

          inner = parse(outdent(token[5].replace(/^\s*[>*+.-]/gm, '')));

          if (t === '>') {
            t = 'blockquote';
          } else {
            t = t.match(/\./) ? 'ol' : 'ul';
            inner = inner.replace(/^(.*)(\n|$)/gm, '<li>$1</li>');
          }

          chunk = '<' + t + '>' + inner + '</' + t + '>';
        } // Images:
        else if (token[8]) {
            chunk = "<img src=\"" + encodeAttr(token[8]) + "\" alt=\"" + encodeAttr(token[7]) + "\">";
          } // Links:
          else if (token[10]) {
              out = out.replace('<a>', "<a href=\"" + encodeAttr(token[11] || links[prev.toLowerCase()]) + "\">");
              chunk = flush() + '</a>';
            } else if (token[9]) {
              chunk = '<a>';
            } // Headings:
            else if (token[12] || token[14]) {
                t = 'h' + (token[14] ? token[14].length : token[13][0] === '=' ? 1 : 2);
                chunk = '<' + t + '>' + parse(token[12] || token[15]) + '</' + t + '>';
              } // `code`:
              else if (token[16]) {
                  chunk = '<code>' + encodeAttr(token[16]) + '</code>';
                } // Inline formatting: *em*, **strong** & friends
                else if (token[17] || token[1]) {
                    chunk = tag(token[17] || '--');
                  }

    out += prev;
    out += chunk;
  }

  return (out + md.substring(last) + flush()).trim();
}

var _default = parse;
exports.default = _default;
},{}],"js/index.js":[function(require,module,exports) {
"use strict";

var _snarkdown = _interopRequireDefault(require("snarkdown"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dice = document.getElementById("dice");
var button = document.getElementById("button");
var records = document.getElementById("records");
var PastLaunches = [];

var randomNumber = function randomNumber() {
  var number = Math.round(Math.random() * 5 + 1);
  PastLaunches.push(number);
  dice.innerHTML = number;
  records.innerHTML = PastLaunches;
};

var showRecords = function showRecords() {
  var str = "<table>";

  for (var i = 0; i < PastLaunches.length; i++) {
    str = str + "<tr><td>" + PastLaunches[i] + "</td></tr>";
  }

  str = str + "</table>";
};

button.onclick = function () {
  return randomNumber();
};
},{"snarkdown":"../node_modules/snarkdown/dist/snarkdown.es.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "36751" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.map