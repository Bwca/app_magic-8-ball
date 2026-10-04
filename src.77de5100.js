// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"configuration/check-dev-mode.function.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkDevMode = checkDevMode;

function checkDevMode() {
  return window.location.hostname === 'localhost';
}
},{}],"shared/enums/answer-types.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerTypes = void 0;
var AnswerTypes;
exports.AnswerTypes = AnswerTypes;

(function (AnswerTypes) {
  AnswerTypes["Affirmative"] = "affirmative";
  AnswerTypes["NonCommittal"] = "non-committal";
  AnswerTypes["Negative"] = "negative";
})(AnswerTypes || (exports.AnswerTypes = AnswerTypes = {}));
},{}],"shared/constants/line-brean-symbol.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LINEBREAK_SYMBOL = void 0;
const LINEBREAK_SYMBOL = '|';
exports.LINEBREAK_SYMBOL = LINEBREAK_SYMBOL;
},{}],"configuration/insert-answer-line-breaks/insert-answer-line-breaks.function.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertAnswerLineBreaks = insertAnswerLineBreaks;

var _lineBreanSymbol = require("../../shared/constants/line-brean-symbol");

const LINE_LIMIT = 10;

function insertAnswerLineBreaks(answer) {
  const {
    text
  } = answer;
  const words = text.split(/\s/);
  let textWithLineBreaks = '';
  let currentLine = '';

  for (const word of words) {
    const newLine = currentLine.concat(' ', word).trim();

    if (newLine.length < LINE_LIMIT) {
      currentLine = newLine;
      continue;
    }

    const lineToAdd = newLine.length === LINE_LIMIT ? newLine : currentLine;
    textWithLineBreaks = textWithLineBreaks.concat(lineToAdd, _lineBreanSymbol.LINEBREAK_SYMBOL);
    currentLine = newLine.length === LINE_LIMIT ? '' : word;
  }

  if (currentLine) {
    textWithLineBreaks = textWithLineBreaks.concat(currentLine);
  }

  return { ...answer,
    text: textWithLineBreaks
  };
}
},{"../../shared/constants/line-brean-symbol":"shared/constants/line-brean-symbol.ts"}],"configuration/insert-answer-line-breaks/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "insertAnswerLineBreaks", {
  enumerable: true,
  get: function () {
    return _insertAnswerLineBreaks.insertAnswerLineBreaks;
  }
});

var _insertAnswerLineBreaks = require("./insert-answer-line-breaks.function");
},{"./insert-answer-line-breaks.function":"configuration/insert-answer-line-breaks/insert-answer-line-breaks.function.ts"}],"configuration/default-answers.const.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_ANSWERS = void 0;

var _answerTypes = require("../shared/enums/answer-types.enum");

var _insertAnswerLineBreaks = require("./insert-answer-line-breaks");

const DEFAULT_ANSWERS = [{
  text: 'It is certain',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'It is decidedly so',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'Without a doubt',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'Yes definitely',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'You may rely on it',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'As I see it, yes',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'Most likely',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'Outlook good',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'Yes',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'Signs point to yes',
  type: _answerTypes.AnswerTypes.Affirmative
}, {
  text: 'Reply hazy, try again',
  type: _answerTypes.AnswerTypes.NonCommittal
}, {
  text: 'Ask again later',
  type: _answerTypes.AnswerTypes.NonCommittal
}, {
  text: 'Better not tell you now',
  type: _answerTypes.AnswerTypes.NonCommittal
}, {
  text: 'Cannot predict now',
  type: _answerTypes.AnswerTypes.NonCommittal
}, {
  text: 'Concentrate and ask again',
  type: _answerTypes.AnswerTypes.NonCommittal
}, {
  text: "Don't count on it",
  type: _answerTypes.AnswerTypes.Negative
}, {
  text: 'My reply is no',
  type: _answerTypes.AnswerTypes.Negative
}, {
  text: 'My sources say no',
  type: _answerTypes.AnswerTypes.Negative
}, {
  text: 'Outlook not so good',
  type: _answerTypes.AnswerTypes.Negative
}, {
  text: 'Very doubtful',
  type: _answerTypes.AnswerTypes.Negative
}].map(_insertAnswerLineBreaks.insertAnswerLineBreaks);
exports.DEFAULT_ANSWERS = DEFAULT_ANSWERS;
},{"../shared/enums/answer-types.enum":"shared/enums/answer-types.enum.ts","./insert-answer-line-breaks":"configuration/insert-answer-line-breaks/index.ts"}],"configuration/param-keys.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParamKeys = void 0;
var ParamKeys;
exports.ParamKeys = ParamKeys;

(function (ParamKeys) {
  ParamKeys["BallColor"] = "bc";
  ParamKeys["RendererType"] = "rt";
  ParamKeys["Answers"] = "an";
  ParamKeys["AnswerFilter"] = "af";
})(ParamKeys || (exports.ParamKeys = ParamKeys = {}));
},{}],"configuration/obtain-configuration.function.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.obtainConfiguration = obtainConfiguration;

var _checkDevMode = require("./check-dev-mode.function");

var _defaultAnswers = require("./default-answers.const");

var _paramKeys = require("./param-keys.enum");

function obtainConfiguration() {
  const params = new URLSearchParams(window.location.search);
  const answers = filterAnswers(params, getAnswers(params));
  const color = params.get(_paramKeys.ParamKeys.BallColor) || 'Navy';
  const rendererType = params.get(_paramKeys.ParamKeys.RendererType) || 'THREE';

  if (!(0, _checkDevMode.checkDevMode)()) {
    history.replaceState('', '', '/');
  }

  return {
    answers,
    color,
    rendererType
  };
}

function filterAnswers(params, answers) {
  if (params.has(_paramKeys.ParamKeys.AnswerFilter)) {
    const requiredAnswerType = params.get(_paramKeys.ParamKeys.AnswerFilter);
    return answers.filter(({
      type
    }) => type === requiredAnswerType);
  }

  return answers;
}

function getAnswers(params) {
  if (!params.has(_paramKeys.ParamKeys.Answers)) {
    return _defaultAnswers.DEFAULT_ANSWERS;
  }

  try {
    return JSON.parse(params.get(_paramKeys.ParamKeys.Answers));
  } catch (e) {
    return _defaultAnswers.DEFAULT_ANSWERS;
  }
}
},{"./check-dev-mode.function":"configuration/check-dev-mode.function.ts","./default-answers.const":"configuration/default-answers.const.ts","./param-keys.enum":"configuration/param-keys.enum.ts"}],"configuration/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "obtainConfiguration", {
  enumerable: true,
  get: function () {
    return _obtainConfiguration.obtainConfiguration;
  }
});

var _obtainConfiguration = require("./obtain-configuration.function");
},{"./obtain-configuration.function":"configuration/obtain-configuration.function.ts"}],"../node_modules/@merry-solutions/debounce/dist/index.js":[function(require,module,exports) {
"use strict";Object.defineProperty(exports, "__esModule", {value: true});function n(o,t){let e;return[(...u)=>new Promise(c=>{e&&clearTimeout(e),e=setTimeout(()=>{c(o(...u))},t)}),()=>{clearTimeout(e)}]}exports.debounce = n;

},{}],"create-motion-detector.function.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMotionDetector = createMotionDetector;

var _debounce = require("@merry-solutions/debounce");

function createMotionDetector(onMotioNStart, onMotionEnd) {
  const current = {
    x: 0,
    y: 0
  };
  let isMotionInProgress = false;
  const [debouncedShowAnswer] = (0, _debounce.debounce)(onMotionEnd, 500);
  return event => {
    const hasSignificantVerticalMovement = Math.abs(current.y - (event.accelerationIncludingGravity?.y ?? 0)) > 10;

    if (hasSignificantVerticalMovement && !isMotionInProgress) {
      current.x = event.accelerationIncludingGravity?.x ?? 0;
      current.y = event.accelerationIncludingGravity?.y ?? 0;
      isMotionInProgress = true;
      onMotioNStart();
    } else if (isMotionInProgress) {
      debouncedShowAnswer();
      isMotionInProgress = false;
    }
  };
}
},{"@merry-solutions/debounce":"../node_modules/@merry-solutions/debounce/dist/index.js"}],"create-show-answer/create-show-answer.function.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createShowAnswer = createShowAnswer;

var _lineBreanSymbol = require("../shared/constants/line-brean-symbol");

function createShowAnswer(renderer, answers) {
  return event => {
    const {
      text: answer
    } = getRandomAnswer(answers);
    renderer.showAnswer({
      answer,
      event,
      lineSeparator: _lineBreanSymbol.LINEBREAK_SYMBOL
    });
  };
}

function getRandomAnswer(answers) {
  const maxIndex = answers.length - 1;
  const index = Math.floor(Math.random() * Math.floor(maxIndex));
  return answers[index];
}
},{"../shared/constants/line-brean-symbol":"shared/constants/line-brean-symbol.ts"}],"create-show-answer/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createShowAnswer", {
  enumerable: true,
  get: function () {
    return _createShowAnswer.createShowAnswer;
  }
});

var _createShowAnswer = require("./create-show-answer.function");
},{"./create-show-answer.function":"create-show-answer/create-show-answer.function.ts"}],"init-pwa.function.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPwa = initPwa;

function initPwa() {
  window.addEventListener('load', () => {
    registerSW();
  });
}

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register("/sw.js");
    } catch (e) {
      alert('ServiceWorker registration failed. Sorry about that.');
    }
  } else {
    document.querySelector('.alert')?.removeAttribute('hidden');
  }
}
},{"./sw.js":[["sw.js","sw.js"],"sw.js.map","sw.js"]}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"renderer/make-renderer/make-renderer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeRenderer = makeRenderer;

async function makeRenderer(type, ballColor) {
  switch (type) {
    case 'HTML':
      return makeHtmlRenderer();

    case 'THREE':
      return makeTHREERenderer(ballColor);

    default:
      throw new Error('No renderer type specified!');
  }
}
/** TODO: implement canvas renderer */


async function makeCanvasRenderer() {
  const canvas = document.querySelector('canvas');

  if (!canvas) {
    throw new Error('NO CANVAS FOUND');
  }

  return require("_bundle_loader")(require.resolve('../canvas-renderer/canvas-renderer')).then(({
    CanvasRenderer
  }) => new CanvasRenderer(canvas));
}

async function makeHtmlRenderer() {
  return require("_bundle_loader")(require.resolve('../html-renderer/html-renderer')).then(({
    HtmlRenderer
  }) => new HtmlRenderer());
}

async function makeTHREERenderer(ballColor) {
  const fov = outerWidth >= 600 ? 60 : 37;
  return require("_bundle_loader")(require.resolve('../three-renderer/three-ball-8-renderer.class')).then(({
    THREEBall8Renderer
  }) => new THREEBall8Renderer(ballColor, fov));
}
},{"_bundle_loader":"../node_modules/parcel-bundler/src/builtins/bundle-loader.js","../canvas-renderer/canvas-renderer":[["canvas-renderer.6554b088.js","renderer/canvas-renderer/canvas-renderer.ts"],"canvas-renderer.6554b088.js.map","renderer/canvas-renderer/canvas-renderer.ts"],"../html-renderer/html-renderer":[["html-renderer.48af93c3.js","renderer/html-renderer/html-renderer.ts"],"html-renderer.48af93c3.js.map","html-renderer.48af93c3.css","renderer/html-renderer/html-renderer.ts"],"../three-renderer/three-ball-8-renderer.class":[["three-ball-8-renderer.class.f0534e7e.js","renderer/three-renderer/three-ball-8-renderer.class.ts"],"three-ball-8-renderer.class.f0534e7e.js.map","renderer/three-renderer/three-ball-8-renderer.class.ts"]}],"renderer/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "makeRenderer", {
  enumerable: true,
  get: function () {
    return _makeRenderer.makeRenderer;
  }
});

var _makeRenderer = require("./make-renderer/make-renderer");
},{"./make-renderer/make-renderer":"renderer/make-renderer/make-renderer.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

var _configuration = require("./configuration");

var _createMotionDetector = require("./create-motion-detector.function");

var _createShowAnswer = require("./create-show-answer");

var _initPwa = require("./init-pwa.function");

var _renderer = require("./renderer");

document.addEventListener('DOMContentLoaded', main);

async function main() {
  (0, _initPwa.initPwa)();
  const {
    answers,
    color,
    rendererType
  } = (0, _configuration.obtainConfiguration)();
  const sceneRenderer = await (0, _renderer.makeRenderer)(rendererType, color);
  sceneRenderer.showBall(document.body);
  const showAnswer = (0, _createShowAnswer.createShowAnswer)(sceneRenderer, [...answers]);
  const showAnswerOnShake = (0, _createMotionDetector.createMotionDetector)(() => sceneRenderer.hideAnswer(), showAnswer);
  document.addEventListener('click', showAnswer);
  window.addEventListener('devicemotion', showAnswerOnShake);
}
},{"./configuration":"configuration/index.ts","./create-motion-detector.function":"create-motion-detector.function.ts","./create-show-answer":"create-show-answer/index.ts","./init-pwa.function":"init-pwa.function.ts","./renderer":"renderer/index.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39755" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
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
}
},{}],"../node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js":[function(require,module,exports) {
module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = bundle;

    script.onerror = function (e) {
      script.onerror = script.onload = null;
      reject(e);
    };

    script.onload = function () {
      script.onerror = script.onload = null;
      resolve();
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  });
};
},{}],"../node_modules/parcel-bundler/src/builtins/loaders/browser/css-loader.js":[function(require,module,exports) {
module.exports = function loadCSSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = bundle;

    link.onerror = function (e) {
      link.onerror = link.onload = null;
      reject(e);
    };

    link.onload = function () {
      link.onerror = link.onload = null;
      resolve();
    };

    document.getElementsByTagName('head')[0].appendChild(link);
  });
};
},{}],0:[function(require,module,exports) {
var b=require("../node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("../node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));b.register("css",require("../node_modules/parcel-bundler/src/builtins/loaders/browser/css-loader.js"));
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0,"index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map