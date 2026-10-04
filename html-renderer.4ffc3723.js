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
})({"eslf":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlRendererStyle = void 0;
var HtmlRendererStyle;
exports.HtmlRendererStyle = HtmlRendererStyle;

(function (HtmlRendererStyle) {
  HtmlRendererStyle["Canvas"] = "canvas";
  HtmlRendererStyle["AnswerContainer"] = "answer-container";
  HtmlRendererStyle["AnswerPortal"] = "answer-portal";
  HtmlRendererStyle["Ball"] = "ball";
  HtmlRendererStyle["IsShaking"] = "is-shaking";
  HtmlRendererStyle["IsVisible"] = "is-visible";
  HtmlRendererStyle["Answer"] = "answer";
})(HtmlRendererStyle || (exports.HtmlRendererStyle = HtmlRendererStyle = {}));
},{}],"hqJS":[function(require,module,exports) {

},{}],"XWAl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlRenderer = void 0;

var _htmlRendererStyle = require("./html-renderer.style.enum");

require("./html-renderer.style.scss");

class HtmlRenderer {
  constructor() {
    this.isInProgress = false;
  }

  hideAnswer() {
    this.answerContainer.classList.remove(_htmlRendererStyle.HtmlRendererStyle.IsVisible);
  }

  showAnswer({
    answer,
    lineSeparator
  }) {
    if (this.isInProgress) {
      return;
    }

    this.isInProgress = true;
    answer = lineSeparator ? answer.replaceAll(lineSeparator, '\n') : answer;
    this.changeAnswer(answer);
  }

  showBall(host) {
    const canvas = document.createElement('section');
    canvas.className = _htmlRendererStyle.HtmlRendererStyle.Canvas;
    const ball = document.createElement('article');
    ball.className = _htmlRendererStyle.HtmlRendererStyle.Ball;
    this.ball = ball;
    const answerPortal = document.createElement('div');
    answerPortal.className = _htmlRendererStyle.HtmlRendererStyle.AnswerPortal;
    const answerContainer = document.createElement('div');
    answerContainer.className = _htmlRendererStyle.HtmlRendererStyle.AnswerContainer;
    this.answerContainer = answerContainer;
    const answer = document.createElement('div');
    answer.className = _htmlRendererStyle.HtmlRendererStyle.Answer;
    this.answer = answer;
    answerContainer.appendChild(answer);
    answerPortal.appendChild(answerContainer);
    ball.appendChild(answerPortal);
    canvas.appendChild(ball);
    host.appendChild(canvas);
  }

  async changeAnswer(answer) {
    this.answerContainer.classList.remove(_htmlRendererStyle.HtmlRendererStyle.IsVisible);
    await this.wait(1000);
    this.answer.textContent = answer;
    this.answerContainer.classList.add(_htmlRendererStyle.HtmlRendererStyle.IsVisible);
    this.isInProgress = false;
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

exports.HtmlRenderer = HtmlRenderer;
},{"./html-renderer.style.enum":"eslf","./html-renderer.style.scss":"hqJS"}]},{},["XWAl"], null)