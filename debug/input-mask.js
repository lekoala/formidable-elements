(() => {
  // node_modules/inputmask/lib/defaults.js
  var defaults_default = {
    _maxTestPos: 500,
    placeholder: "_",
    optionalmarker: ["[", "]"],
    quantifiermarker: ["{", "}"],
    groupmarker: ["(", ")"],
    alternatormarker: "|",
    escapeChar: "\\",
    mask: null,
    // needs tobe null instead of undefined as the extend method does not consider props with the undefined value
    regex: null,
    // regular expression as a mask
    oncomplete: () => {
    },
    // executes when the mask is complete
    onincomplete: () => {
    },
    // executes when the mask is incomplete and focus is lost
    oncleared: () => {
    },
    // executes when the mask is cleared
    repeat: 0,
    // repetitions of the mask: * ~ forever, otherwise specify an integer
    greedy: false,
    // true: allocated buffer for the mask and repetitions - false: allocate only if needed
    autoUnmask: false,
    // automatically unmask when retrieving the value with $.fn.val or value if the browser supports __lookupGetter__ or getOwnPropertyDescriptor
    removeMaskOnSubmit: false,
    // remove the mask before submitting the form.
    clearMaskOnLostFocus: true,
    insertMode: true,
    // insert the input or overwrite the input
    insertModeVisual: true,
    // show selected caret when insertmode = false
    clearIncomplete: false,
    // clear the incomplete input on blur
    alias: null,
    onKeyDown: () => {
    },
    // callback to implement autocomplete on certain keys for example. args => event, buffer, caretPos, opts
    onBeforeMask: null,
    // executes before masking the initial value to allow preprocessing of the initial value.	args => initialValue, opts => return processedValue
    onBeforePaste: function(pastedValue, opts) {
      return typeof opts.onBeforeMask === "function" ? opts.onBeforeMask.call(this, pastedValue, opts) : pastedValue;
    },
    // executes before masking the pasted value to allow preprocessing of the pasted value.	args => pastedValue, opts => return processedValue
    onBeforeWrite: null,
    // executes before writing to the masked element. args => event, opts
    onUnMask: null,
    // executes after unmasking to allow postprocessing of the unmaskedvalue.	args => maskedValue, unmaskedValue, opts
    showMaskOnFocus: true,
    // show the mask-placeholder when the input has focus
    showMaskOnHover: true,
    // show the mask-placeholder when hovering the empty input
    onKeyValidation: () => {
    },
    // executes on every key-press with the result of isValid. Params: key, result, opts
    skipOptionalPartCharacter: " ",
    // a character which can be used to skip an optional part of a mask
    numericInput: false,
    // numericInput input direction style (input shifts to the left while holding the caret position)
    rightAlign: false,
    // align to the right
    undoOnEscape: true,
    // pressing escape reverts the value to the value before focus
    // numeric basic properties
    radixPoint: "",
    // ".", // | ","
    _radixDance: false,
    // dance around the radixPoint
    groupSeparator: "",
    // ",", // | "."
    // numeric basic properties
    keepStatic: null,
    // try to keep the mask static while typing. Decisions to alter the mask will be posponed if possible
    positionCaretOnTab: true,
    // when enabled the caret position is set after the latest valid position on TAB
    tabThrough: false,
    // allows for tabbing through the different parts of the masked field
    supportsInputType: ["text", "tel", "url", "password", "search"],
    // list with the supported input types
    isComplete: null,
    // override for isComplete - args => buffer, opts - return true || false
    preValidation: null,
    // hook to preValidate the input.  Usefull for validating regardless the definition.	args => buffer, pos, char, isSelection, opts, maskset, caretPos, strict => return true/false/command object
    postValidation: null,
    // hook to postValidate the result from isValid.	Usefull for validating the entry as a whole.	args => buffer, pos, c, currentResult, opts, maskset, strict, fromCheckval => return true/false/json
    staticDefinitionSymbol: void 0,
    // specify a definitionSymbol for static content, used to make matches for alternators
    jitMasking: false,
    // just in time masking ~ only mask while typing, can n (number), true or false
    nullable: true,
    // return nothing instead of the buffertemplate when the user hasn't entered anything.
    inputEventOnly: false,
    // dev option - testing inputfallback behavior
    noValuePatching: false,
    // disable value property patching
    positionCaretOnClick: "lvp",
    // none, lvp (based on the last valid position (default), radixFocus (position caret to radixpoint on initial click), select (select the whole input), ignore (ignore the click and continue the mask)
    casing: null,
    // mask-level casing. Options: null, "upper", "lower" or "title" or callback args => elem, test, pos, validPositions return charValue
    inputmode: "text",
    // specify the inputmode
    importDataAttributes: true,
    // import data-inputmask attributes
    shiftPositions: true,
    // shift position of the mask entries on entry and deletion.
    usePrototypeDefinitions: true,
    // use the default defined definitions from the prototype
    validationEventTimeOut: 3e3,
    // Time to show validation error on form submit
    substitutes: {}
    // define character substitutes
  };

  // node_modules/inputmask/lib/definitions.js
  var definitions_default = {
    9: {
      // \uFF11-\uFF19 #1606
      validator: "[0-9\uFF10-\uFF19]",
      definitionSymbol: "*"
    },
    a: {
      // \u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5 #76
      validator: "[A-Za-z\u0410-\u044F\u0401\u0451\xC0-\xFF\xB5]",
      definitionSymbol: "*"
    },
    "*": {
      validator: "[0-9\uFF10-\uFF19A-Za-z\u0410-\u044F\u0401\u0451\xC0-\xFF\xB5]"
    }
  };

  // node_modules/inputmask/lib/global/window.js
  var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  var window_default = canUseDOM ? window : {};

  // node_modules/inputmask/lib/dependencyLibs/data.js
  function data_default(owner, key, value) {
    if (value === void 0) {
      return owner.__data ? owner.__data[key] : null;
    } else {
      owner.__data = owner.__data || {};
      owner.__data[key] = value;
    }
  }

  // node_modules/inputmask/lib/dependencyLibs/extend.js
  function extend() {
    let options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && typeof target !== "function") {
      target = {};
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (Object.prototype.toString.call(copy) === "[object Object]" || (copyIsArray = Array.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && Object.prototype.toString.call(src) === "[object Object]" ? src : {};
            }
            target[name] = extend(deep, clone, copy);
          } else if (copy !== void 0) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }

  // node_modules/inputmask/lib/dependencyLibs/events.js
  var document2 = window_default.document;
  function isValidElement(elem) {
    return elem instanceof Element;
  }
  var Evnt;
  if (typeof window_default.CustomEvent === "function") {
    Evnt = window_default.CustomEvent;
  } else if (window_default.Event && document2 && document2.createEvent) {
    Evnt = function(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        composed: true,
        detail: void 0
      };
      const evt = document2.createEvent("CustomEvent");
      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      return evt;
    };
    Evnt.prototype = window_default.Event.prototype;
  } else if (typeof Event !== "undefined") {
    Evnt = Event;
  }
  function on(events2, handler) {
    function addEvent(ev, namespace) {
      if (elem.addEventListener) {
        elem.addEventListener(ev, handler, false);
      } else if (elem.attachEvent) {
        elem.attachEvent(`on${ev}`, handler);
      }
      eventRegistry[ev] = eventRegistry[ev] || {};
      eventRegistry[ev][namespace] = eventRegistry[ev][namespace] || [];
      eventRegistry[ev][namespace].push(handler);
    }
    if (isValidElement(this[0])) {
      var eventRegistry = this[0].eventRegistry, elem = this[0];
      events2.split(" ").forEach((event) => {
        const [ev, namespace = "global"] = event.split(".");
        addEvent(ev, namespace);
      });
    }
    return this;
  }
  function off(events2, handler) {
    let eventRegistry, elem;
    function removeEvent(ev, namespace, handler2) {
      if (ev in eventRegistry === true) {
        if (elem.removeEventListener) {
          elem.removeEventListener(ev, handler2, false);
        } else if (elem.detachEvent) {
          elem.detachEvent(`on${ev}`, handler2);
        }
        if (namespace === "global") {
          for (const nmsp in eventRegistry[ev]) {
            eventRegistry[ev][nmsp].splice(
              eventRegistry[ev][nmsp].indexOf(handler2),
              1
            );
          }
        } else {
          eventRegistry[ev][namespace].splice(
            eventRegistry[ev][namespace].indexOf(handler2),
            1
          );
        }
      }
    }
    function resolveNamespace(ev, namespace) {
      let evts = [], hndx, hndL;
      if (ev.length > 0) {
        if (handler === void 0) {
          for (hndx = 0, hndL = eventRegistry[ev][namespace].length; hndx < hndL; hndx++) {
            evts.push({
              ev,
              namespace: namespace && namespace.length > 0 ? namespace : "global",
              handler: eventRegistry[ev][namespace][hndx]
            });
          }
        } else {
          evts.push({
            ev,
            namespace: namespace && namespace.length > 0 ? namespace : "global",
            handler
          });
        }
      } else if (namespace.length > 0) {
        for (const evNdx in eventRegistry) {
          for (const nmsp in eventRegistry[evNdx]) {
            if (nmsp === namespace) {
              if (handler === void 0) {
                for (hndx = 0, hndL = eventRegistry[evNdx][nmsp].length; hndx < hndL; hndx++) {
                  evts.push({
                    ev: evNdx,
                    namespace: nmsp,
                    handler: eventRegistry[evNdx][nmsp][hndx]
                  });
                }
              } else {
                evts.push({
                  ev: evNdx,
                  namespace: nmsp,
                  handler
                });
              }
            }
          }
        }
      }
      return evts;
    }
    if (isValidElement(this[0]) && events2) {
      eventRegistry = this[0].eventRegistry;
      elem = this[0];
      events2.split(" ").forEach((event) => {
        const [ev, namespace] = event.split(".");
        resolveNamespace(ev, namespace).forEach(
          ({ ev: ev1, handler: handler1, namespace: namespace1 }) => {
            removeEvent(ev1, namespace1, handler1);
          }
        );
      });
    }
    return this;
  }
  function trigger(events2) {
    if (isValidElement(this[0])) {
      const eventRegistry = this[0].eventRegistry, elem = this[0], _events = typeof events2 === "string" ? events2.split(" ") : [events2.type];
      for (let endx = 0; endx < _events.length; endx++) {
        const nsEvent = _events[endx].split("."), ev = nsEvent[0], namespace = nsEvent[1] || "global";
        if (document2 !== void 0 && namespace === "global") {
          var evnt, params = {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: arguments[1]
          };
          if (document2.createEvent) {
            try {
              switch (ev) {
                case "input":
                  params.inputType = "insertText";
                  evnt = new InputEvent(ev, params);
                  break;
                default:
                  evnt = new CustomEvent(ev, params);
              }
            } catch (e) {
              evnt = document2.createEvent("CustomEvent");
              evnt.initCustomEvent(
                ev,
                params.bubbles,
                params.cancelable,
                params.detail
              );
            }
            if (events2.type) extend(evnt, events2);
            elem.dispatchEvent(evnt);
          } else {
            evnt = document2.createEventObject();
            evnt.eventType = ev;
            evnt.detail = arguments[1];
            if (events2.type) extend(evnt, events2);
            elem.fireEvent("on" + evnt.eventType, evnt);
          }
        } else if (eventRegistry[ev] !== void 0) {
          arguments[0] = arguments[0].type ? arguments[0] : inputmask_dependencyLib_default.Event(arguments[0]);
          arguments[0].detail = arguments.slice(1);
          const registry2 = eventRegistry[ev], handlers = namespace === "global" ? Object.values(registry2).flat() : registry2[namespace];
          handlers.forEach((handler) => handler.apply(elem, arguments));
        }
      }
    }
    return this;
  }

  // node_modules/inputmask/lib/dependencyLibs/inputmask.dependencyLib.js
  var document3 = window_default.document;
  function DependencyLib(elem) {
    if (elem instanceof DependencyLib) {
      return elem;
    }
    if (!(this instanceof DependencyLib)) {
      return new DependencyLib(elem);
    }
    if (elem !== void 0 && elem !== null && elem !== window_default) {
      this[0] = elem.nodeName ? elem : elem[0] !== void 0 && elem[0].nodeName ? elem[0] : document3.querySelector(elem);
      if (this[0] !== void 0 && this[0] !== null) {
        this[0].eventRegistry = this[0].eventRegistry || {};
      }
    }
  }
  DependencyLib.prototype = {
    on,
    off,
    trigger
  };
  DependencyLib.extend = extend;
  DependencyLib.data = data_default;
  DependencyLib.Event = Evnt;
  var inputmask_dependencyLib_default = DependencyLib;

  // node_modules/inputmask/lib/environment.js
  var ua = window_default.navigator && window_default.navigator.userAgent || "";
  var ie = ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident/") > 0;
  var mobile = window_default.navigator && window_default.navigator.userAgentData && window_default.navigator.userAgentData.mobile || window_default.navigator && window_default.navigator.maxTouchPoints || "ontouchstart" in window_default;
  var iphone = /iphone/i.test(ua);

  // node_modules/inputmask/lib/keycode.js
  var ignorables = {
    Alt: 18,
    AltGraph: 18,
    ArrowDown: 40,
    ArrowLeft: 37,
    ArrowRight: 39,
    ArrowUp: 38,
    Backspace: 8,
    CapsLock: 20,
    Control: 17,
    ContextMenu: 93,
    Dead: 221,
    Delete: 46,
    End: 35,
    Escape: 27,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    Home: 36,
    Insert: 45,
    NumLock: 144,
    PageDown: 34,
    PageUp: 33,
    Pause: 19,
    PrintScreen: 44,
    Process: 229,
    Shift: 16,
    ScrollLock: 145,
    Tab: 9,
    Unidentified: 229
  };
  var keyCode = {
    c: 67,
    x: 88,
    z: 90,
    BACKSPACE_SAFARI: 127,
    Enter: 13,
    Meta_LEFT: 91,
    Meta_RIGHT: 92,
    Space: 32,
    ...ignorables
  };
  var keyCodeRev = Object.entries(keyCode).reduce(
    (acc, [key, value]) => (
      // eslint-disable-next-line no-sequences
      (acc[value] = acc[value] === void 0 ? key : acc[value], acc)
    ),
    {}
  );
  var keys = Object.entries(keyCode).reduce(
    // eslint-disable-next-line no-sequences
    (acc, [key, value]) => (acc[key] = key === "Space" ? " " : key, acc),
    {}
  );

  // node_modules/inputmask/lib/validation-tests.js
  function getLocator(tst, align) {
    let locator = (tst.alternation != void 0 ? tst.mloc[getDecisionTaker(tst)] : tst.locator).join("");
    if (locator !== "") {
      locator = locator.split(":")[0];
      while (locator.length < align) locator += "0";
    }
    return locator;
  }
  function getDecisionTaker(tst) {
    let decisionTaker = tst.locator[tst.alternation];
    if (typeof decisionTaker === "string" && decisionTaker.length > 0) {
      decisionTaker = decisionTaker.split(",")[0];
    }
    return decisionTaker !== void 0 ? decisionTaker.toString() : "";
  }
  function getPlaceholder(pos, test, returnPL) {
    const inputmask = this, opts = this.opts, maskset = this.maskset;
    test = test || getTest.call(inputmask, pos).match;
    if (test.placeholder !== void 0 || returnPL === true) {
      if (test.placeholder !== "" && test.static === true && test.generated !== true) {
        const lvp = getLastValidPosition.call(inputmask, pos), nextPos = seekNext.call(inputmask, lvp);
        return (returnPL ? pos <= nextPos : pos < nextPos) ? opts.staticDefinitionSymbol && test.static ? test.nativeDef : test.def : typeof test.placeholder === "function" ? test.placeholder(opts) : test.placeholder;
      } else {
        return typeof test.placeholder === "function" ? test.placeholder(opts) : test.placeholder;
      }
    } else if (test.static === true) {
      if (pos > -1 && maskset.validPositions[pos] === void 0) {
        let tests = getTests.call(inputmask, pos), staticAlternations = [], prevTest;
        if (typeof opts.placeholder === "string" && tests.length > 1 + (tests[tests.length - 1].match.def === "" ? 1 : 0)) {
          for (let i = 0; i < tests.length; i++) {
            if (tests[i].match.def !== "" && tests[i].match.optionality !== true && tests[i].match.optionalQuantifier !== true && (tests[i].match.static === true || prevTest === void 0 || tests[i].match.fn.test(
              prevTest.match.def,
              maskset,
              pos,
              true,
              opts
            ) !== false)) {
              staticAlternations.push(tests[i]);
              if (tests[i].match.static === true) prevTest = tests[i];
              if (staticAlternations.length > 1) {
                if (/[0-9a-bA-Z]/.test(staticAlternations[0].match.def)) {
                  return opts.placeholder.charAt(pos % opts.placeholder.length);
                }
              }
            }
          }
        }
      }
      return test.def;
    }
    return typeof opts.placeholder === "object" ? test.def : opts.placeholder.charAt(pos % opts.placeholder.length);
  }
  function getMaskTemplate(baseOnInput, minimalPos, includeMode, noJit, clearOptionalTail2) {
    const inputmask = this, opts = this.opts, maskset = this.maskset, greedy = opts.greedy;
    if (clearOptionalTail2 && opts.greedy) {
      opts.greedy = false;
      inputmask.maskset.tests = {};
    }
    minimalPos = minimalPos || 0;
    let maskTemplate = [], ndxIntlzr, pos = 0, test, testPos, jitRenderStatic;
    do {
      if (baseOnInput === true && maskset.validPositions[pos]) {
        testPos = clearOptionalTail2 && maskset.validPositions[pos].match.optionality && maskset.validPositions[pos + 1] === void 0 && (maskset.validPositions[pos].generatedInput === true || maskset.validPositions[pos].input == opts.skipOptionalPartCharacter && pos > 0) ? determineTestTemplate.call(
          inputmask,
          pos,
          getTests.call(inputmask, pos, ndxIntlzr, pos - 1)
        ) : maskset.validPositions[pos];
        test = testPos.match;
        ndxIntlzr = testPos.locator.slice();
        maskTemplate.push(
          includeMode === true ? testPos.input : includeMode === false ? test.nativeDef : getPlaceholder.call(inputmask, pos, test)
        );
      } else {
        testPos = getTestTemplate.call(inputmask, pos, ndxIntlzr, pos - 1);
        test = testPos.match;
        ndxIntlzr = testPos.locator.slice();
        const jitMasking = noJit === true ? false : opts.jitMasking !== false ? opts.jitMasking : test.jit;
        jitRenderStatic = (jitRenderStatic || maskset.validPositions[pos - 1]) && test.static && test.def !== opts.groupSeparator && test.fn === null;
        if (jitRenderStatic || jitMasking === false || jitMasking === void 0 || typeof jitMasking === "number" && isFinite(jitMasking) && jitMasking > pos) {
          maskTemplate.push(
            includeMode === false ? test.nativeDef : getPlaceholder.call(inputmask, maskTemplate.length, test)
          );
        } else {
          jitRenderStatic = false;
        }
      }
      pos++;
    } while (test.static !== true || test.def !== "" || minimalPos > pos);
    if (maskTemplate[maskTemplate.length - 1] === "") {
      maskTemplate.pop();
    }
    if (includeMode !== false || // do not alter the masklength when just retrieving the maskdefinition
    maskset.maskLength === void 0) {
      maskset.maskLength = pos - 1;
    }
    opts.greedy = greedy;
    return maskTemplate;
  }
  function getTestTemplate(pos, ndxIntlzr, tstPs) {
    const inputmask = this, maskset = this.maskset;
    return maskset.validPositions[pos] || determineTestTemplate.call(
      inputmask,
      pos,
      getTests.call(
        inputmask,
        pos,
        ndxIntlzr ? ndxIntlzr.slice() : ndxIntlzr,
        tstPs
      )
    );
  }
  function determineTestTemplate(pos, tests) {
    let inputmask = this, opts = this.opts, lenghtOffset = 0, optionalityLevel = determineOptionalityLevel(pos, tests);
    pos = pos > 0 ? pos - 1 : 0;
    let altTest = getTest.call(inputmask, pos), targetLocator = getLocator(altTest), tstLocator, closest, bestMatch;
    if (opts.greedy && tests.length > 1 && tests[tests.length - 1].match.def === "")
      lenghtOffset = 1;
    for (let ndx = 0; ndx < tests.length - lenghtOffset; ndx++) {
      const tst = tests[ndx];
      tstLocator = getLocator(tst, targetLocator.length);
      const distance = Math.abs(tstLocator - targetLocator);
      if (tst.unMatchedAlternationStopped !== true || tests.filter((tst2) => tst2.unMatchedAlternationStopped !== true).length <= 1) {
        if (closest === void 0 || tstLocator !== "" && distance < closest || bestMatch && !opts.greedy && bestMatch.match.optionality && bestMatch.match.optionality - optionalityLevel > 0 && bestMatch.match.newBlockMarker === "master" && (!tst.match.optionality || tst.match.optionality - optionalityLevel < 1 || !tst.match.newBlockMarker) || bestMatch && !opts.greedy && bestMatch.match.optionalQuantifier && !tst.match.optionalQuantifier) {
          closest = distance;
          bestMatch = tst;
        }
      }
    }
    return bestMatch;
  }
  function determineOptionalityLevel(pos, tests) {
    let optionalityLevel = 0, differentOptionalLevels = false;
    tests.forEach((test) => {
      if (test.match.optionality) {
        if (optionalityLevel !== 0 && optionalityLevel !== test.match.optionality)
          differentOptionalLevels = true;
        if (optionalityLevel === 0 || optionalityLevel > test.match.optionality) {
          optionalityLevel = test.match.optionality;
        }
      }
    });
    if (optionalityLevel) {
      if (pos == 0) optionalityLevel = 0;
      else if (tests.length == 1) optionalityLevel = 0;
      else if (!differentOptionalLevels) optionalityLevel = 0;
    }
    return optionalityLevel;
  }
  function getTest(pos, tests) {
    const inputmask = this, maskset = this.maskset;
    if (maskset.validPositions[pos]) {
      return maskset.validPositions[pos];
    }
    return (tests || getTests.call(inputmask, pos))[0];
  }
  function isSubsetOf(source, target, opts) {
    function expand(pattern) {
      let expanded = [], start = -1, end;
      for (let i = 0, l = pattern.length; i < l; i++) {
        if (pattern.charAt(i) === "-") {
          end = pattern.charCodeAt(i + 1);
          while (++start < end) expanded.push(String.fromCharCode(start));
        } else {
          start = pattern.charCodeAt(i);
          expanded.push(pattern.charAt(i));
        }
      }
      return expanded.join("");
    }
    if (source.match.def === target.match.nativeDef) return true;
    if ((opts.regex || source.match.fn instanceof RegExp && target.match.fn instanceof RegExp) && source.match.static !== true && target.match.static !== true) {
      if (target.match.fn.source === ".") return true;
      return expand(target.match.fn.source.replace(/[[\]/]/g, "")).indexOf(
        expand(source.match.fn.source.replace(/[[\]/]/g, ""))
      ) !== -1;
    }
    return false;
  }
  function getTests(pos, ndxIntlzr, tstPs) {
    let inputmask = this, $4 = this.dependencyLib, maskset = this.maskset, opts = this.opts, el = this.el, maskTokens = maskset.maskToken, testPos = ndxIntlzr ? tstPs : 0, ndxInitializer = ndxIntlzr ? ndxIntlzr.slice() : [0], matches = [], insertStop = false, latestMatch, cacheDependency = ndxIntlzr ? ndxIntlzr.join("") : "", unMatchedAlternation = false;
    function resolveTestFromToken(maskToken, ndxInitializer2, loopNdx, quantifierRecurse) {
      function handleMatch(match, loopNdx2, quantifierRecurse2) {
        function isFirstMatch(latestMatch2, tokenGroup) {
          let firstMatch = tokenGroup.matches.indexOf(latestMatch2) === 0;
          if (!firstMatch) {
            tokenGroup.matches.every(function(match2, ndx) {
              if (match2.isQuantifier === true) {
                firstMatch = isFirstMatch(
                  latestMatch2,
                  tokenGroup.matches[ndx - 1]
                );
              } else if (Object.prototype.hasOwnProperty.call(match2, "matches"))
                firstMatch = isFirstMatch(latestMatch2, match2);
              if (firstMatch) return false;
              return true;
            });
          }
          return firstMatch;
        }
        function resolveNdxInitializer(pos2, alternateNdx, targetAlternation) {
          let bestMatch, indexPos;
          if (maskset.tests[pos2] || maskset.validPositions[pos2]) {
            (maskset.validPositions[pos2] ? [maskset.validPositions[pos2]] : maskset.tests[pos2]).every(function(lmnt, ndx) {
              if (lmnt.mloc[alternateNdx]) {
                bestMatch = lmnt;
                return false;
              }
              const alternation = targetAlternation !== void 0 ? targetAlternation : lmnt.alternation, ndxPos = lmnt.locator[alternation] !== void 0 ? lmnt.locator[alternation].toString().indexOf(alternateNdx) : -1;
              if ((indexPos === void 0 || ndxPos < indexPos) && ndxPos !== -1) {
                bestMatch = lmnt;
                indexPos = ndxPos;
              }
              return true;
            });
          }
          if (bestMatch) {
            const bestMatchAltIndex = bestMatch.locator[bestMatch.alternation], locator = bestMatch.mloc[alternateNdx] || bestMatch.mloc[bestMatchAltIndex] || bestMatch.locator;
            if (locator[locator.length - 1].toString().indexOf(":") !== -1) {
              const alternation = locator.pop();
            }
            return locator.slice(
              (targetAlternation !== void 0 ? targetAlternation : bestMatch.alternation) + 1
            );
          } else {
            return targetAlternation !== void 0 ? resolveNdxInitializer(pos2, alternateNdx) : void 0;
          }
        }
        function staticCanMatchDefinition(source, target) {
          return source.match.static === true && target.match.static !== true ? target.match.fn.test(
            source.match.def,
            maskset,
            pos,
            false,
            opts,
            false
          ) : false;
        }
        function setMergeLocators(targetMatch, altMatch) {
          function mergeLoc(altNdx) {
            targetMatch.mloc = targetMatch.mloc || {};
            let locNdx = targetMatch.locator[altNdx];
            if (locNdx === void 0) {
              targetMatch.alternation = void 0;
            } else {
              if (typeof locNdx === "string") locNdx = locNdx.split(",")[0];
              if (targetMatch.mloc[locNdx] === void 0) {
                targetMatch.mloc[locNdx] = targetMatch.locator.slice();
                targetMatch.mloc[locNdx].push(`:${targetMatch.alternation}`);
              }
              if (altMatch !== void 0) {
                const offset = 0;
                for (let ndx in altMatch.mloc) {
                  if (typeof ndx === "string") ndx = parseInt(ndx.split(",")[0]);
                  targetMatch.mloc[ndx + offset] = altMatch.mloc[ndx];
                }
                targetMatch.locator[altNdx] = Object.keys(targetMatch.mloc).join(
                  ","
                );
              }
              if (targetMatch.alternation > altNdx) {
                targetMatch.alternation = altNdx;
              }
              return true;
            }
            return false;
          }
          let alternationNdx = targetMatch.alternation, shouldMerge = altMatch === void 0 || alternationNdx <= altMatch.alternation && targetMatch.locator[alternationNdx].toString().indexOf(altMatch.locator[alternationNdx]) === -1;
          if (!shouldMerge && alternationNdx > altMatch.alternation) {
            for (let i = 0; i < alternationNdx; i++) {
              if (targetMatch.locator[i] !== altMatch.locator[i]) {
                alternationNdx = i;
                shouldMerge = true;
                break;
              }
            }
          }
          if (shouldMerge) {
            return mergeLoc(alternationNdx);
          }
          return false;
        }
        function isSameLevel(targetMatch, altMatch) {
          if (targetMatch.locator.length !== altMatch.locator.length) {
            return false;
          }
          for (let locNdx = targetMatch.alternation + 1; locNdx < targetMatch.locator.length; locNdx++) {
            if (targetMatch.locator[locNdx] !== altMatch.locator[locNdx]) {
              return false;
            }
          }
          return true;
        }
        function handleGroup() {
          match = handleMatch(
            maskToken.matches[maskToken.matches.indexOf(match) + 1],
            loopNdx2,
            quantifierRecurse2
          );
          if (match) return true;
        }
        function handleOptional() {
          const optionalToken = match, mtchsNdx = matches.length;
          match = resolveTestFromToken(
            match,
            ndxInitializer2,
            loopNdx2,
            quantifierRecurse2
          );
          if (matches.length > 0) {
            matches.forEach(function(mtch, ndx) {
              if (ndx >= mtchsNdx) {
                mtch.match.optionality = mtch.match.optionality ? mtch.match.optionality + 1 : 1;
              }
            });
            latestMatch = matches[matches.length - 1].match;
            if (quantifierRecurse2 === void 0 && isFirstMatch(latestMatch, optionalToken)) {
              insertStop = true;
              testPos = pos;
            } else {
              return match;
            }
          }
        }
        function handleAlternator() {
          function isUnmatchedAlternation(alternateToken2) {
            let matchesLength = alternateToken2.matches[0].matches ? alternateToken2.matches[0].matches.length : 1, matchesNewLength;
            for (let alndx = 0; alndx < alternateToken2.matches.length; alndx++) {
              matchesNewLength = alternateToken2.matches[alndx].matches ? alternateToken2.matches[alndx].matches.length : 1;
              if (matchesLength !== matchesNewLength) {
                break;
              }
            }
            return matchesLength !== matchesNewLength;
          }
          inputmask.hasAlternator = true;
          let alternateToken = match, malternateMatches = [], maltMatches, currentMatches = matches.slice(), loopNdxCnt = loopNdx2.length, altIndex = ndxInitializer2.length > 0 ? ndxInitializer2.shift() : -1;
          if (altIndex === -1 || typeof altIndex === "string") {
            let currentPos = testPos, ndxInitializerClone = ndxInitializer2.slice(), altIndexArr = [], amndx;
            if (typeof altIndex === "string") {
              altIndexArr = altIndex.split(",");
            } else {
              for (amndx = 0; amndx < alternateToken.matches.length; amndx++) {
                altIndexArr.push(amndx.toString());
              }
            }
            if (maskset.excludes[pos] !== void 0) {
              const altIndexArrClone = altIndexArr.slice();
              for (let i = 0, exl = maskset.excludes[pos].length; i < exl; i++) {
                const excludeSet = maskset.excludes[pos][i].toString().split(":");
                if (loopNdx2.length == excludeSet[1]) {
                  altIndexArr.splice(altIndexArr.indexOf(excludeSet[0]), 1);
                }
              }
              if (altIndexArr.length === 0) {
                delete maskset.excludes[pos];
                altIndexArr = altIndexArrClone;
              }
            }
            if (opts.keepStatic === true || isFinite(parseInt(opts.keepStatic)) && currentPos >= opts.keepStatic)
              altIndexArr = altIndexArr.slice(0, 1);
            for (let ndx = 0; ndx < altIndexArr.length; ndx++) {
              amndx = parseInt(altIndexArr[ndx]);
              matches = [];
              ndxInitializer2 = typeof altIndex === "string" ? resolveNdxInitializer(testPos, amndx, loopNdxCnt) || ndxInitializerClone.slice() : ndxInitializerClone.slice();
              const tokenMatch = alternateToken.matches[amndx];
              if (tokenMatch && handleMatch(
                tokenMatch,
                [amndx].concat(loopNdx2),
                quantifierRecurse2
              )) {
                match = true;
              } else {
                if (ndx === 0) {
                  unMatchedAlternation = isUnmatchedAlternation(alternateToken);
                }
                if (tokenMatch && tokenMatch.matches && tokenMatch.matches.length > alternateToken.matches[0].matches.length) {
                  break;
                }
              }
              maltMatches = matches.slice();
              testPos = currentPos;
              matches = [];
              for (let ndx1 = 0; ndx1 < maltMatches.length; ndx1++) {
                let altMatch = maltMatches[ndx1], dropMatch = false;
                altMatch.alternation = altMatch.alternation || loopNdxCnt;
                setMergeLocators(altMatch);
                for (let ndx2 = 0; ndx2 < malternateMatches.length; ndx2++) {
                  const altMatch2 = malternateMatches[ndx2];
                  if (typeof altIndex !== "string" || altMatch.alternation !== void 0 && altIndexArr.includes(
                    altMatch.locator[altMatch.alternation].toString()
                  )) {
                    if (altMatch.match.nativeDef === altMatch2.match.nativeDef) {
                      dropMatch = true;
                      setMergeLocators(altMatch2, altMatch);
                      break;
                    } else if (isSubsetOf(altMatch, altMatch2, opts)) {
                      if (setMergeLocators(altMatch, altMatch2)) {
                        dropMatch = true;
                        malternateMatches.splice(
                          malternateMatches.indexOf(altMatch2),
                          0,
                          altMatch
                        );
                      }
                      break;
                    } else if (isSubsetOf(altMatch2, altMatch, opts)) {
                      setMergeLocators(altMatch2, altMatch);
                      break;
                    } else if (staticCanMatchDefinition(altMatch, altMatch2)) {
                      if (!isSameLevel(altMatch, altMatch2) && el.inputmask.userOptions.keepStatic === void 0) {
                        opts.keepStatic = true;
                      } else if (setMergeLocators(altMatch, altMatch2)) {
                        dropMatch = true;
                        malternateMatches.splice(
                          malternateMatches.indexOf(altMatch2),
                          0,
                          altMatch
                        );
                      }
                      break;
                    } else if (staticCanMatchDefinition(altMatch2, altMatch)) {
                      setMergeLocators(altMatch2, altMatch);
                      break;
                    }
                  }
                }
                if (!dropMatch) {
                  malternateMatches.push(altMatch);
                }
              }
            }
            matches = currentMatches.concat(malternateMatches);
            testPos = pos;
            insertStop = matches.length > 0 && unMatchedAlternation;
            match = malternateMatches.length > 0 && !unMatchedAlternation;
            if (unMatchedAlternation && insertStop && !match) {
              matches.forEach(function(mtch, ndx) {
                mtch.unMatchedAlternationStopped = true;
              });
            }
            ndxInitializer2 = ndxInitializerClone.slice();
          } else {
            match = handleMatch(
              alternateToken.matches[altIndex] || maskToken.matches[altIndex],
              [altIndex].concat(loopNdx2),
              quantifierRecurse2
            );
          }
          if (match) return true;
        }
        function handleQuantifier() {
          let qt = match, breakloop = false;
          for (var qndx = ndxInitializer2.length > 0 ? ndxInitializer2.shift() : 0; qndx < (isNaN(qt.quantifier.max) ? qndx + 1 : qt.quantifier.max) && testPos <= pos; qndx++) {
            var tokenGroup = maskToken.matches[maskToken.matches.indexOf(qt) - 1];
            match = handleMatch(tokenGroup, [qndx].concat(loopNdx2), tokenGroup);
            if (match) {
              matches.forEach(function(mtch, ndx) {
                if (IsMatchOf(tokenGroup, mtch.match)) latestMatch = mtch.match;
                else latestMatch = matches[matches.length - 1].match;
                latestMatch.optionalQuantifier = qndx >= qt.quantifier.min;
                latestMatch.jit = (qndx + 1) * (tokenGroup.matches.indexOf(latestMatch) + 1) > qt.quantifier.jit;
                if (latestMatch.optionalQuantifier && isFirstMatch(latestMatch, tokenGroup)) {
                  insertStop = true;
                  testPos = pos;
                  if (opts.greedy && maskset.validPositions[pos - 1] == void 0 && qndx > qt.quantifier.min && ["*", "+"].indexOf(qt.quantifier.max) != -1) {
                    matches.pop();
                    cacheDependency = void 0;
                  }
                  breakloop = true;
                  match = false;
                }
                if (!breakloop && latestMatch.jit) {
                  maskset.jitOffset[pos] = tokenGroup.matches.length - tokenGroup.matches.indexOf(latestMatch);
                }
              });
              if (breakloop) break;
              return true;
            }
          }
        }
        if (testPos > pos + opts._maxTestPos) {
          throw new Error(
            `Inputmask: There is probably an error in your mask definition or in the code. Create an issue on github with an example of the mask you are using. ${maskset.mask}`
          );
        }
        if (testPos === pos && match.matches === void 0) {
          matches.push({
            match,
            locator: loopNdx2.reverse(),
            cd: cacheDependency,
            mloc: {}
          });
          if (match.optionality && quantifierRecurse2 === void 0 && (opts.definitions && opts.definitions[match.nativeDef] && opts.definitions[match.nativeDef].optional || inputmask_default.prototype.definitions[match.nativeDef] && inputmask_default.prototype.definitions[match.nativeDef].optional)) {
            insertStop = true;
            testPos = pos;
          } else {
            return true;
          }
        } else if (match.matches !== void 0) {
          if (match.isGroup && quantifierRecurse2 !== match) {
            return handleGroup();
          } else if (match.isOptional) {
            return handleOptional();
          } else if (match.isAlternator) {
            return handleAlternator();
          } else if (match.isQuantifier && quantifierRecurse2 !== maskToken.matches[maskToken.matches.indexOf(match) - 1]) {
            return handleQuantifier();
          } else {
            match = resolveTestFromToken(
              match,
              ndxInitializer2,
              loopNdx2,
              quantifierRecurse2
            );
            if (match) return true;
          }
        } else {
          testPos++;
        }
      }
      for (let tndx = ndxInitializer2.length > 0 ? ndxInitializer2.shift() : 0; tndx < maskToken.matches.length; tndx++) {
        if (maskToken.matches[tndx].isQuantifier !== true) {
          const match = handleMatch(
            maskToken.matches[tndx],
            [tndx].concat(loopNdx),
            quantifierRecurse
          );
          if (match && testPos === pos) {
            return match;
          } else if (testPos > pos) {
            break;
          }
        }
      }
    }
    function IsMatchOf(tokenGroup, match) {
      let isMatch = tokenGroup.matches.indexOf(match) != -1;
      if (!isMatch) {
        tokenGroup.matches.forEach((mtch, ndx) => {
          if (mtch.matches !== void 0 && !isMatch) {
            isMatch = IsMatchOf(mtch, match);
          }
        });
      }
      return isMatch;
    }
    function mergeLocators(pos2, tests) {
      let locator = [], alternation;
      if (!Array.isArray(tests)) tests = [tests];
      if (tests.length > 0) {
        if (tests[0].alternation === void 0 || opts.keepStatic === true) {
          locator = determineTestTemplate.call(inputmask, pos2, tests.slice()).locator.slice();
          if (locator.length === 0) locator = tests[0].locator.slice();
        } else {
          tests.forEach(function(tst) {
            if (tst.def !== "") {
              if (locator.length === 0) {
                alternation = tst.alternation;
                locator = tst.locator.slice();
              } else {
                if (tst.locator[alternation] && locator[alternation].toString().indexOf(tst.locator[alternation]) === -1) {
                  locator[alternation] += "," + tst.locator[alternation];
                }
              }
            }
          });
        }
      }
      return locator;
    }
    if (pos > -1) {
      if (ndxIntlzr === void 0) {
        let previousPos = pos - 1, test;
        while ((test = maskset.validPositions[previousPos] || maskset.tests[previousPos]) === void 0 && previousPos > -1) {
          previousPos--;
        }
        if (test !== void 0 && previousPos > -1) {
          ndxInitializer = mergeLocators(previousPos, test);
          cacheDependency = ndxInitializer.join("");
          testPos = previousPos;
        }
      }
      if (maskset.tests[pos] && maskset.tests[pos][0].cd === cacheDependency) {
        return maskset.tests[pos];
      }
      for (let mtndx = ndxInitializer.shift(); mtndx < maskTokens.length; mtndx++) {
        const match = resolveTestFromToken(maskTokens[mtndx], ndxInitializer, [
          mtndx
        ]);
        if (match && testPos === pos || testPos > pos) {
          break;
        }
      }
    }
    if (matches.length === 0 || insertStop) {
      matches.push({
        match: {
          fn: null,
          static: true,
          optionality: false,
          casing: null,
          def: "",
          placeholder: ""
        },
        // mark when there are unmatched alternations  ex: mask: "(a|aa)"
        // this will result in the least distance to select the correct test result in determineTestTemplate
        locator: unMatchedAlternation && matches.filter((tst) => tst.unMatchedAlternationStopped !== true).length === 0 ? [0] : [],
        mloc: {},
        cd: cacheDependency
      });
    }
    let result;
    if (ndxIntlzr !== void 0 && maskset.tests[pos]) {
      result = $4.extend(true, [], matches);
    } else {
      maskset.tests[pos] = $4.extend(true, [], matches);
      result = maskset.tests[pos];
    }
    matches.forEach((t) => {
      t.match.optionality = t.match.defOptionality || false;
    });
    return result;
  }

  // node_modules/inputmask/lib/validation.js
  function alternate(maskPos, c, strict, fromIsValid, rAltPos, selection) {
    const inputmask = this, $4 = this.dependencyLib, opts = this.opts, maskset = inputmask.maskset;
    if (!inputmask.hasAlternator) return false;
    let validPsClone = $4.extend(true, [], maskset.validPositions), tstClone = $4.extend(true, {}, maskset.tests), lastAlt, alternation, isValidRslt = false, returnRslt = false, altPos, prevAltPos, i, validPos, decisionPos, lAltPos = rAltPos !== void 0 ? rAltPos : getLastValidPosition.call(inputmask), nextPos, input, begin, end;
    if (selection) {
      begin = selection.begin;
      end = selection.end;
      if (selection.begin > selection.end) {
        begin = selection.end;
        end = selection.begin;
      }
    }
    if (lAltPos === -1 && rAltPos === void 0) {
      lastAlt = 0;
      prevAltPos = getTest.call(inputmask, lastAlt);
      alternation = prevAltPos.alternation;
    } else {
      for (; lAltPos >= 0; lAltPos--) {
        altPos = maskset.validPositions[lAltPos];
        if (altPos && altPos.alternation !== void 0) {
          if (lAltPos <= (maskPos || 0) && prevAltPos && prevAltPos.locator[altPos.alternation] !== altPos.locator[altPos.alternation]) {
            break;
          }
          lastAlt = lAltPos;
          alternation = maskset.validPositions[lastAlt].alternation;
          prevAltPos = altPos;
        }
      }
    }
    if (alternation !== void 0) {
      decisionPos = parseInt(lastAlt);
      maskset.excludes[decisionPos] = maskset.excludes[decisionPos] || [];
      if (maskPos !== true) {
        maskset.excludes[decisionPos].push(
          getDecisionTaker(prevAltPos) + ":" + prevAltPos.alternation
        );
      }
      let validInputs = [], resultPos = -1;
      for (i = decisionPos; decisionPos < getLastValidPosition.call(inputmask, void 0, true) + 1; i++) {
        if (resultPos === -1 && maskPos <= i && c !== void 0) {
          validInputs.push(c);
          resultPos = validInputs.length - 1;
        }
        validPos = maskset.validPositions[decisionPos];
        if (validPos && validPos.generatedInput !== true && (selection === void 0 || i < begin || i >= end)) {
          validInputs.push(validPos.input);
        }
        maskset.validPositions.splice(decisionPos, 1);
      }
      if (resultPos === -1 && c !== void 0) {
        validInputs.push(c);
        resultPos = validInputs.length - 1;
      }
      while (maskset.excludes[decisionPos] !== void 0 && maskset.excludes[decisionPos].length < 10) {
        maskset.tests = {};
        resetMaskSet.call(inputmask, true);
        isValidRslt = true;
        for (i = 0; i < validInputs.length; i++) {
          nextPos = isValidRslt.caret || opts.insertMode == false && nextPos != void 0 ? seekNext.call(inputmask, nextPos) : getLastValidPosition.call(inputmask, void 0, true) + 1;
          input = validInputs[i];
          if (!(isValidRslt = isValid.call(
            inputmask,
            nextPos,
            input,
            false,
            fromIsValid,
            true
          ))) {
            break;
          }
          if (i === resultPos) {
            returnRslt = isValidRslt;
          }
          if (maskPos == true && isValidRslt) {
            returnRslt = { caretPos: i };
          }
        }
        if (!isValidRslt) {
          resetMaskSet.call(inputmask);
          prevAltPos = getTest.call(inputmask, decisionPos);
          maskset.validPositions = $4.extend(true, [], validPsClone);
          maskset.tests = $4.extend(true, {}, tstClone);
          if (maskset.excludes[decisionPos]) {
            if (prevAltPos.alternation != void 0) {
              const decisionTaker = getDecisionTaker(prevAltPos);
              if (maskset.excludes[decisionPos].indexOf(
                decisionTaker + ":" + prevAltPos.alternation
              ) !== -1) {
                returnRslt = alternate.call(
                  inputmask,
                  maskPos,
                  c,
                  strict,
                  fromIsValid,
                  decisionPos - 1,
                  selection
                );
                break;
              }
              maskset.excludes[decisionPos].push(
                decisionTaker + ":" + prevAltPos.alternation
              );
              for (i = decisionPos; i < getLastValidPosition.call(inputmask, void 0, true) + 1; i++)
                maskset.validPositions.splice(decisionPos);
            } else delete maskset.excludes[decisionPos];
          } else {
            returnRslt = alternate.call(
              inputmask,
              maskPos,
              c,
              strict,
              fromIsValid,
              decisionPos - 1,
              selection
            );
            break;
          }
        } else {
          break;
        }
      }
    }
    if (!returnRslt || opts.keepStatic !== false) {
      delete maskset.excludes[decisionPos];
    }
    return returnRslt;
  }
  function casing(elem, test, pos) {
    const opts = this.opts, maskset = this.maskset;
    switch (opts.casing || test.casing) {
      case "upper":
        elem = elem.toUpperCase();
        break;
      case "lower":
        elem = elem.toLowerCase();
        break;
      case "title":
        var posBefore = maskset.validPositions[pos - 1];
        if (pos === 0 || posBefore && posBefore.input === String.fromCharCode(keyCode.Space)) {
          elem = elem.toUpperCase();
        } else {
          elem = elem.toLowerCase();
        }
        break;
      default:
        if (typeof opts.casing === "function") {
          const args = Array.prototype.slice.call(arguments);
          args.push(maskset.validPositions);
          elem = opts.casing.apply(this, args);
        }
    }
    return elem;
  }
  function checkAlternationMatch(altArr1, altArr2, na) {
    const opts = this.opts;
    let altArrC = opts.greedy ? altArr2 : altArr2.slice(0, 1), isMatch = false, naArr = na !== void 0 ? na.split(",") : [], naNdx;
    for (let i = 0; i < naArr.length; i++) {
      if ((naNdx = altArr1.indexOf(naArr[i])) !== -1) {
        altArr1.splice(naNdx, 1);
      }
    }
    for (let alndx = 0; alndx < altArr1.length; alndx++) {
      if (altArrC.includes(altArr1[alndx])) {
        isMatch = true;
        break;
      }
    }
    return isMatch;
  }
  function handleRemove(input, c, pos, strict, fromIsValid) {
    const inputmask = this, maskset = this.maskset, opts = this.opts;
    if (opts.numericInput || inputmask.isRTL) {
      if (c === keys.Backspace) {
        c = keys.Delete;
      } else if (c === keys.Delete) {
        c = keys.Backspace;
      }
      if (inputmask.isRTL) {
        const pend = pos.end;
        pos.end = pos.begin;
        pos.begin = pend;
      }
    }
    const lvp = getLastValidPosition.call(inputmask, void 0, true);
    if (pos.end >= getBuffer.call(inputmask).length && lvp >= pos.end) {
      pos.end = lvp + 1;
    }
    if (c === keys.Backspace) {
      if (pos.end - pos.begin < 1) {
        pos.begin = seekPrevious.call(inputmask, pos.begin);
      }
    } else if (c === keys.Delete) {
      if (pos.begin === pos.end) {
        pos.end = isMask.call(inputmask, pos.end, true, true) ? pos.end + 1 : seekNext.call(inputmask, pos.end) + 1;
      }
    }
    let offset;
    if ((offset = revalidateMask.call(inputmask, pos)) !== false) {
      if (strict !== true && opts.keepStatic !== false || opts.regex !== null && getTest.call(inputmask, pos.begin).match.def.indexOf("|") !== -1) {
        alternate.call(inputmask, true);
      }
      if (strict !== true) {
        maskset.p = c === keys.Delete ? pos.begin + offset : pos.begin;
        maskset.p = determineNewCaretPosition.call(
          inputmask,
          {
            begin: maskset.p,
            end: maskset.p
          },
          false,
          opts.insertMode === false && c === keys.Backspace ? "none" : void 0
        ).begin;
      }
    }
  }
  function isComplete(buffer) {
    const inputmask = this, opts = this.opts, maskset = this.maskset;
    if (typeof opts.isComplete === "function")
      return opts.isComplete(buffer, opts);
    if (opts.repeat === "*") return void 0;
    let complete = false, lrp = determineLastRequiredPosition.call(inputmask, true), aml = lrp.l;
    if (lrp.def === void 0 || lrp.def.newBlockMarker || lrp.def.optionality || lrp.def.optionalQuantifier) {
      complete = true;
      for (let i = 0; i <= aml; i++) {
        const test = getTestTemplate.call(inputmask, i).match;
        if (test.static !== true && maskset.validPositions[i] === void 0 && (test.optionality === false || test.optionality === void 0 || test.optionality && test.newBlockMarker == false) && (test.optionalQuantifier === false || test.optionalQuantifier === void 0) || test.static === true && test.def != "" && buffer[i] !== getPlaceholder.call(inputmask, i, test)) {
          complete = false;
          break;
        }
      }
    }
    return complete;
  }
  function isSelection(posObj) {
    const inputmask = this, opts = this.opts, insertModeOffset = opts.insertMode ? 0 : 1;
    return inputmask.isRTL ? posObj.begin - posObj.end > insertModeOffset : posObj.end - posObj.begin > insertModeOffset;
  }
  function isValid(pos, c, strict, fromIsValid, fromAlternate, validateOnly, fromCheckval) {
    const inputmask = this, $4 = this.dependencyLib, opts = this.opts, maskset = inputmask.maskset;
    strict = strict === true;
    let maskPos = pos;
    if (pos.begin !== void 0) {
      maskPos = inputmask.isRTL ? pos.end : pos.begin;
    }
    function processCommandObject(commandObj) {
      if (commandObj !== void 0) {
        if (commandObj.remove !== void 0) {
          if (!Array.isArray(commandObj.remove))
            commandObj.remove = [commandObj.remove];
          commandObj.remove.sort(function(a, b) {
            return inputmask.isRTL ? a.pos - b.pos : b.pos - a.pos;
          }).forEach(function(lmnt) {
            revalidateMask.call(inputmask, { begin: lmnt, end: lmnt + 1 });
          });
          commandObj.remove = void 0;
        }
        if (commandObj.insert !== void 0) {
          if (!Array.isArray(commandObj.insert))
            commandObj.insert = [commandObj.insert];
          commandObj.insert.sort(function(a, b) {
            return inputmask.isRTL ? b.pos - a.pos : a.pos - b.pos;
          }).forEach(function(lmnt) {
            if (lmnt.c !== "") {
              isValid.call(
                inputmask,
                lmnt.pos,
                lmnt.c,
                lmnt.strict !== void 0 ? lmnt.strict : true,
                lmnt.fromIsValid !== void 0 ? lmnt.fromIsValid : fromIsValid
              );
            }
          });
          commandObj.insert = void 0;
        }
        if (commandObj.refreshFromBuffer && commandObj.buffer) {
          const refresh = commandObj.refreshFromBuffer;
          refreshFromBuffer.call(
            inputmask,
            refresh === true ? refresh : refresh.start,
            refresh.end,
            commandObj.buffer
          );
          commandObj.refreshFromBuffer = void 0;
        }
        if (commandObj.rewritePosition !== void 0) {
          maskPos = commandObj.rewritePosition;
          commandObj = true;
        }
      }
      return commandObj;
    }
    function _isValid(position, c2, strict2) {
      let rslt = false;
      getTests.call(inputmask, position).every(function(tst, ndx) {
        const test = tst.match;
        getBuffer.call(inputmask, true);
        if (test.jit && maskset.validPositions[seekPrevious.call(inputmask, position)] === void 0) {
          rslt = false;
        } else {
          rslt = test.fn != null ? test.fn.test(
            c2,
            maskset,
            position,
            strict2,
            opts,
            isSelection.call(inputmask, pos)
          ) : (c2 === test.def || c2 === opts.skipOptionalPartCharacter) && test.def !== "" ? {
            c: getPlaceholder.call(inputmask, position, test, true) || test.def,
            pos: position
          } : false;
        }
        if (rslt !== false) {
          let elem = rslt.c !== void 0 ? rslt.c : c2, validatedPos = position;
          elem = elem === opts.skipOptionalPartCharacter && test.static === true ? getPlaceholder.call(inputmask, position, test, true) || test.def : elem;
          rslt = processCommandObject(rslt);
          if (rslt !== true && rslt.pos !== void 0 && rslt.pos !== position) {
            validatedPos = rslt.pos;
          }
          if (rslt !== true && rslt.pos === void 0 && rslt.c === void 0) {
            return false;
          }
          if (revalidateMask.call(
            inputmask,
            pos,
            $4.extend({}, tst, {
              input: casing.call(inputmask, elem, test, validatedPos)
            }),
            fromIsValid,
            validatedPos
          ) === false) {
            rslt = false;
          }
          return false;
        }
        return true;
      });
      return rslt;
    }
    let result = true, positionsClone = $4.extend(true, [], maskset.validPositions);
    if (opts.keepStatic === false && maskset.excludes[maskPos] !== void 0 && fromAlternate !== true && fromIsValid !== true) {
      for (let i = maskPos; i < (inputmask.isRTL ? pos.begin : pos.end); i++) {
        if (maskset.excludes[i] !== void 0) {
          maskset.excludes[i] = void 0;
          delete maskset.tests[i];
        }
      }
    }
    if (typeof opts.preValidation === "function" && fromIsValid !== true && validateOnly !== true) {
      result = opts.preValidation.call(
        inputmask,
        getBuffer.call(inputmask),
        maskPos,
        c,
        isSelection.call(inputmask, pos),
        opts,
        maskset,
        pos,
        strict || fromAlternate
      );
      result = processCommandObject(result);
    }
    if (result === true) {
      result = _isValid(maskPos, c, strict);
      if ((!strict || fromIsValid === true) && result === false && validateOnly !== true) {
        const currentPosValid = maskset.validPositions[maskPos];
        if (currentPosValid && currentPosValid.match.static === true && (currentPosValid.match.def === c || c === opts.skipOptionalPartCharacter)) {
          result = {
            caret: seekNext.call(inputmask, maskPos)
          };
        } else {
          if (opts.insertMode || maskset.validPositions[seekNext.call(inputmask, maskPos)] === void 0 || pos.end > maskPos) {
            let skip = false;
            if (maskset.jitOffset[maskPos] && maskset.validPositions[seekNext.call(inputmask, maskPos)] === void 0) {
              result = isValid.call(
                inputmask,
                maskPos + maskset.jitOffset[maskPos],
                c,
                true,
                true
              );
              if (result !== false) {
                if (fromAlternate !== true) result.caret = maskPos;
                skip = true;
              }
            }
            if (pos.end > maskPos) {
              maskset.validPositions[maskPos] = void 0;
            }
            if (!skip && !isMask.call(inputmask, maskPos, opts.keepStatic && maskPos === 0)) {
              for (let nPos = maskPos + 1, snPos = seekNext.call(inputmask, maskPos, false, maskPos !== 0); nPos <= snPos; nPos++) {
                result = _isValid(nPos, c, strict);
                if (result !== false) {
                  result = trackbackPositions.call(
                    inputmask,
                    maskPos,
                    result.pos !== void 0 ? result.pos : nPos
                  ) || result;
                  maskPos = nPos;
                  break;
                }
              }
            }
          }
        }
      }
      if (inputmask.hasAlternator && fromAlternate !== true && !strict) {
        fromAlternate = true;
        if (result === false && opts.keepStatic && (isComplete.call(inputmask, getBuffer.call(inputmask)) || maskPos === 0)) {
          result = alternate.call(
            inputmask,
            maskPos,
            c,
            strict,
            fromIsValid,
            void 0,
            pos
          );
        } else if (isSelection.call(inputmask, pos) && maskset.tests[maskPos] && maskset.tests[maskPos].length > 1 && opts.keepStatic) {
          result = alternate.call(inputmask, true);
        } else if (result == true && opts.numericInput !== true && maskset.tests[maskPos] && maskset.tests[maskPos].length > 1 && getLastValidPosition.call(inputmask, void 0, true) > maskPos) {
          result = alternate.call(inputmask, true);
        }
      }
      if (result === true) {
        result = {
          pos: maskPos
        };
      }
    }
    if (typeof opts.postValidation === "function" && fromIsValid !== true && validateOnly !== true) {
      const postResult = opts.postValidation.call(
        inputmask,
        getBuffer.call(inputmask, true),
        pos.begin !== void 0 ? inputmask.isRTL ? pos.end : pos.begin : pos,
        c,
        result,
        opts,
        maskset,
        strict,
        fromCheckval
      );
      if (postResult !== void 0) {
        result = postResult === true ? result : postResult;
      }
    }
    if (result && result.pos === void 0) {
      result.pos = maskPos;
    }
    if (result === false || validateOnly === true) {
      resetMaskSet.call(inputmask, true);
      maskset.validPositions = $4.extend(true, [], positionsClone);
    } else {
      trackbackPositions.call(inputmask, void 0, maskPos, true);
    }
    let endResult = processCommandObject(result);
    if (inputmask.maxLength !== void 0) {
      const buffer = getBuffer.call(inputmask);
      if (buffer.length > inputmask.maxLength && !fromIsValid) {
        resetMaskSet.call(inputmask, true);
        maskset.validPositions = $4.extend(true, [], positionsClone);
        endResult = false;
      }
    }
    return endResult;
  }
  function positionCanMatchDefinition(pos, testDefinition, opts) {
    const inputmask = this, maskset = this.maskset;
    let valid = false, tests = getTests.call(inputmask, pos);
    for (let tndx = 0; tndx < tests.length; tndx++) {
      if (tests[tndx].match && (tests[tndx].match.nativeDef === testDefinition.match[opts.shiftPositions ? "def" : "nativeDef"] && (!opts.shiftPositions || !testDefinition.match.static) || tests[tndx].match.nativeDef === testDefinition.match.nativeDef || opts.regex && !tests[tndx].match.static && tests[tndx].match.fn.test(
        testDefinition.input,
        maskset,
        pos,
        false,
        opts
      ))) {
        valid = true;
        break;
      } else if (tests[tndx].match && tests[tndx].match.def === testDefinition.match.nativeDef) {
        valid = void 0;
        break;
      }
    }
    if (valid === false) {
      if (maskset.jitOffset[pos] !== void 0) {
        valid = positionCanMatchDefinition.call(
          inputmask,
          pos + maskset.jitOffset[pos],
          testDefinition,
          opts
        );
      }
    }
    return valid;
  }
  function refreshFromBuffer(start, end, buffer) {
    const inputmask = this, maskset = this.maskset, opts = this.opts, $4 = this.dependencyLib;
    let i, p, skipOptionalPartCharacter = opts.skipOptionalPartCharacter, bffr = inputmask.isRTL ? buffer.slice().reverse() : buffer;
    opts.skipOptionalPartCharacter = "";
    if (start === true) {
      resetMaskSet.call(inputmask, false);
      start = 0;
      end = buffer.length;
      p = determineNewCaretPosition.call(
        inputmask,
        { begin: 0, end: 0 },
        false
      ).begin;
    } else {
      for (i = start; i < end; i++) {
        maskset.validPositions.splice(start, 0);
      }
      p = start;
    }
    const keypress = new $4.Event("keypress");
    for (i = start; i < end; i++) {
      keypress.key = bffr[i].toString();
      inputmask.ignorable = false;
      const valResult = EventHandlers.keypressEvent.call(
        inputmask,
        keypress,
        true,
        false,
        false,
        p
      );
      if (valResult !== false && valResult !== void 0) {
        p = valResult.forwardPosition;
      }
    }
    opts.skipOptionalPartCharacter = skipOptionalPartCharacter;
  }
  function trackbackPositions(originalPos, newPos, fillOnly) {
    const inputmask = this, maskset = this.maskset, $4 = this.dependencyLib;
    if (originalPos === void 0) {
      for (originalPos = newPos - 1; originalPos > 0; originalPos--) {
        if (maskset.validPositions[originalPos]) break;
      }
    }
    for (let ps = originalPos; ps < newPos; ps++) {
      if (maskset.validPositions[ps] === void 0 && !isMask.call(inputmask, ps, false)) {
        const vp = ps == 0 ? getTest.call(inputmask, ps) : maskset.validPositions[ps - 1];
        if (vp) {
          const tests = getTests.call(inputmask, ps).slice();
          if (tests[tests.length - 1].match.def === "") tests.pop();
          var bestMatch = determineTestTemplate.call(inputmask, ps, tests), np;
          if (bestMatch && (bestMatch.match.jit !== true || bestMatch.match.newBlockMarker === "master" && (np = maskset.validPositions[ps + 1]) && np.match.optionalQuantifier === true)) {
            bestMatch = $4.extend({}, bestMatch, {
              input: getPlaceholder.call(inputmask, ps, bestMatch.match, true) || bestMatch.match.def
            });
            bestMatch.generatedInput = true;
            revalidateMask.call(inputmask, ps, bestMatch, true);
            if (fillOnly !== true) {
              const cvpInput = maskset.validPositions[newPos].input;
              maskset.validPositions[newPos] = void 0;
              return isValid.call(inputmask, newPos, cvpInput, true, true);
            }
          }
        }
      }
    }
  }
  function revalidateMask(pos, validTest, fromIsValid, validatedPos) {
    const inputmask = this, maskset = this.maskset, opts = this.opts, $4 = this.dependencyLib;
    function IsEnclosedStatic(pos2, valids, selection) {
      const posMatch = valids[pos2];
      if (posMatch !== void 0 && posMatch.match.static === true && posMatch.match.optionality !== true && (valids[0] === void 0 || valids[0].alternation === void 0)) {
        const prevMatch = selection.begin <= pos2 - 1 ? valids[pos2 - 1] && valids[pos2 - 1].match.static === true && valids[pos2 - 1] : valids[pos2 - 1], nextMatch = selection.end > pos2 + 1 ? valids[pos2 + 1] && valids[pos2 + 1].match.static === true && valids[pos2 + 1] : valids[pos2 + 1];
        return prevMatch && nextMatch;
      }
      return false;
    }
    let offset = 0, begin = pos.begin !== void 0 ? pos.begin : pos, end = pos.end !== void 0 ? pos.end : pos, valid = true;
    if (pos.begin > pos.end) {
      begin = pos.end;
      end = pos.begin;
    }
    validatedPos = validatedPos !== void 0 ? validatedPos : begin;
    if (fromIsValid === void 0 && (begin !== end || opts.insertMode && maskset.validPositions[validatedPos] !== void 0 || validTest === void 0 || validTest.match.optionalQuantifier || validTest.match.optionality)) {
      let positionsClone = $4.extend(true, [], maskset.validPositions), lvp = getLastValidPosition.call(inputmask, void 0, true), i;
      maskset.p = begin;
      const clearpos = isSelection.call(inputmask, pos) ? begin : validatedPos;
      for (i = lvp; i >= clearpos; i--) {
        maskset.validPositions.splice(i, 1);
        if (validTest === void 0) delete maskset.tests[i + 1];
      }
      let j = validatedPos, posMatch = j, t, canMatch, test;
      if (validTest) {
        maskset.validPositions[validatedPos] = $4.extend(true, {}, validTest);
        posMatch++;
        j++;
      }
      if (positionsClone[end] == void 0 && maskset.jitOffset[end]) {
        end += maskset.jitOffset[end] + 1;
      }
      for (i = validTest ? end : end - 1; i <= lvp; i++) {
        if ((t = positionsClone[i]) !== void 0 && t.generatedInput !== true && (i >= end || i >= begin && IsEnclosedStatic(i, positionsClone, {
          begin,
          end
        }))) {
          while (test = getTest.call(inputmask, posMatch), test.match.def !== "") {
            if ((canMatch = positionCanMatchDefinition.call(
              inputmask,
              posMatch,
              t,
              opts
            )) !== false || t.match.def === "+") {
              if (t.match.def === "+") getBuffer.call(inputmask, true);
              const result = isValid.call(
                inputmask,
                posMatch,
                t.input,
                t.match.def !== "+",
                /* t.match.def !== "+" */
                true
              );
              valid = result !== false;
              j = (result.pos || posMatch) + 1;
              if (!valid && canMatch) break;
            } else {
              valid = false;
            }
            if (valid) {
              if (validTest === void 0 && t.match.static && i === pos.begin)
                offset++;
              break;
            }
            if (!valid && getBuffer.call(inputmask), posMatch > maskset.maskLength) {
              break;
            }
            posMatch++;
          }
          if (getTest.call(inputmask, posMatch).match.def == "") {
            valid = false;
          }
          posMatch = j;
        }
        if (!valid) break;
      }
      if (!valid) {
        maskset.validPositions = $4.extend(true, [], positionsClone);
        resetMaskSet.call(inputmask, true);
        return false;
      }
    } else if (validTest && getTest.call(inputmask, validatedPos).match.cd === validTest.match.cd) {
      maskset.validPositions[validatedPos] = $4.extend(true, {}, validTest);
    }
    resetMaskSet.call(inputmask, true);
    return offset;
  }

  // node_modules/inputmask/lib/positioning.js
  function caret(input, begin, end, notranslate, isDelete) {
    const inputmask = this, opts = this.opts;
    let range;
    if (begin !== void 0) {
      if (Array.isArray(begin)) {
        end = inputmask.isRTL ? begin[0] : begin[1];
        begin = inputmask.isRTL ? begin[1] : begin[0];
      }
      if (begin.begin !== void 0) {
        end = inputmask.isRTL ? begin.begin : begin.end;
        begin = inputmask.isRTL ? begin.end : begin.begin;
      }
      if (typeof begin === "number") {
        begin = notranslate ? begin : translatePosition.call(inputmask, begin);
        end = notranslate ? end : translatePosition.call(inputmask, end);
        end = typeof end === "number" ? end : begin;
        const scrollCalc = parseInt(
          ((input.ownerDocument.defaultView || window_default).getComputedStyle ? (input.ownerDocument.defaultView || window_default).getComputedStyle(
            input,
            null
          ) : input.currentStyle).fontSize
        ) * end;
        input.scrollLeft = scrollCalc > input.scrollWidth ? scrollCalc : 0;
        input.inputmask.caretPos = { begin, end };
        if (opts.insertModeVisual && opts.insertMode === false && begin === end) {
          if (!isDelete) {
            end++;
          }
        }
        if (input === (input.inputmask.shadowRoot || input.ownerDocument).activeElement) {
          if ("setSelectionRange" in input) {
            input.setSelectionRange(begin, end);
          } else if (window_default.getSelection) {
            range = document.createRange();
            if (input.firstChild === void 0 || input.firstChild === null) {
              const textNode = document.createTextNode("");
              input.appendChild(textNode);
            }
            range.setStart(
              input.firstChild,
              begin < input.inputmask._valueGet().length ? begin : input.inputmask._valueGet().length
            );
            range.setEnd(
              input.firstChild,
              end < input.inputmask._valueGet().length ? end : input.inputmask._valueGet().length
            );
            range.collapse(true);
            const sel = window_default.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          } else if (input.createTextRange) {
            range = input.createTextRange();
            range.collapse(true);
            range.moveEnd("character", end);
            range.moveStart("character", begin);
            range.select();
          }
          input.inputmask.caretHook === void 0 || input.inputmask.caretHook.call(inputmask, { begin, end });
        }
      }
    } else {
      if ("selectionStart" in input && "selectionEnd" in input) {
        begin = input.selectionStart;
        end = input.selectionEnd;
      } else if (window_default.getSelection) {
        range = window_default.getSelection().getRangeAt(0);
        if (range.commonAncestorContainer.parentNode === input || range.commonAncestorContainer === input) {
          begin = range.startOffset;
          end = range.endOffset;
        }
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        begin = 0 - range.duplicate().moveStart("character", -input.inputmask._valueGet().length);
        end = begin + range.text.length;
      }
      return {
        begin: notranslate ? begin : translatePosition.call(inputmask, begin),
        end: notranslate ? end : translatePosition.call(inputmask, end)
      };
    }
  }
  function determineLastRequiredPosition(returnDefinition) {
    const inputmask = this, { maskset, dependencyLib: $4 } = inputmask, lvp = getLastValidPosition.call(inputmask), positions = {}, lvTest = maskset.validPositions[lvp], buffer = getMaskTemplate.call(
      inputmask,
      true,
      getLastValidPosition.call(inputmask),
      true,
      true
    );
    let bl = buffer.length, pos, ndxIntlzr = lvTest !== void 0 ? lvTest.locator.slice() : void 0, testPos;
    for (pos = lvp + 1; pos < buffer.length; pos++) {
      testPos = getTestTemplate.call(inputmask, pos, ndxIntlzr, pos - 1);
      ndxIntlzr = testPos.locator.slice();
      positions[pos] = $4.extend(true, {}, testPos);
    }
    const lvTestAlt = lvTest && lvTest.alternation !== void 0 ? lvTest.locator[lvTest.alternation] : void 0;
    for (pos = bl - 1; pos > lvp; pos--) {
      testPos = positions[pos];
      if ((testPos.match.optionality || testPos.match.optionalQuantifier && testPos.match.newBlockMarker || lvTestAlt && (lvTestAlt !== positions[pos].locator[lvTest.alternation] && testPos.match.static !== true || testPos.match.static === true && testPos.locator[lvTest.alternation] && checkAlternationMatch.call(
        inputmask,
        testPos.locator[lvTest.alternation].toString().split(","),
        lvTestAlt.toString().split(",")
      ) && getTests.call(inputmask, pos)[0].def !== "")) && buffer[pos] === getPlaceholder.call(inputmask, pos, testPos.match)) {
        bl--;
      } else {
        break;
      }
    }
    return returnDefinition ? {
      l: bl,
      def: positions[bl] ? positions[bl].match : void 0
    } : bl;
  }
  function determineNewCaretPosition(selectedCaret, tabbed, positionCaretOnClick) {
    const inputmask = this, { maskset, opts } = inputmask;
    let clickPosition, lvclickPosition, lastPosition;
    function doRadixFocus(clickPos) {
      if (opts.radixPoint !== "" && opts.digits !== 0) {
        const vps = maskset.validPositions;
        if (vps[clickPos] === void 0 || vps[clickPos].input === void 0) {
          if (clickPos < seekNext.call(inputmask, -1)) return true;
          const radixPos = getBuffer.call(inputmask).indexOf(opts.radixPoint);
          if (radixPos !== -1) {
            for (let vp = 0, vpl = vps.length; vp < vpl; vp++) {
              if (vps[vp] && radixPos < vp && vps[vp].input !== getPlaceholder.call(inputmask, vp)) {
                return false;
              }
            }
            return true;
          }
        }
      }
      return false;
    }
    if (tabbed) {
      if (inputmask.isRTL) {
        selectedCaret.end = selectedCaret.begin;
      } else {
        selectedCaret.begin = selectedCaret.end;
      }
    }
    if (selectedCaret.begin === selectedCaret.end) {
      positionCaretOnClick = positionCaretOnClick || opts.positionCaretOnClick;
      switch (positionCaretOnClick) {
        case "none":
          break;
        case "select":
          selectedCaret = { begin: 0, end: getBuffer.call(inputmask).length };
          break;
        case "ignore":
          selectedCaret.end = selectedCaret.begin = seekNext.call(
            inputmask,
            getLastValidPosition.call(inputmask)
          );
          break;
        case "radixFocus":
          if (inputmask.clicked > 1 && maskset.validPositions.length === 0) break;
          if (doRadixFocus(selectedCaret.begin)) {
            const radixPos = getBuffer.call(inputmask).join("").indexOf(opts.radixPoint);
            selectedCaret.end = selectedCaret.begin = opts.numericInput ? seekNext.call(inputmask, radixPos) : radixPos;
            break;
          }
        default:
          clickPosition = selectedCaret.begin;
          lvclickPosition = getLastValidPosition.call(
            inputmask,
            clickPosition,
            true
          );
          lastPosition = seekNext.call(
            inputmask,
            lvclickPosition === -1 && !isMask.call(inputmask, 0) ? -1 : lvclickPosition
          );
          if (clickPosition <= lastPosition) {
            selectedCaret.end = selectedCaret.begin = !isMask.call(
              inputmask,
              clickPosition,
              false,
              true
            ) ? seekNext.call(inputmask, clickPosition) : clickPosition;
          } else {
            const lvp = maskset.validPositions[lvclickPosition], tt = getTestTemplate.call(
              inputmask,
              lastPosition,
              lvp ? lvp.match.locator : void 0,
              lvp
            ), placeholder = getPlaceholder.call(
              inputmask,
              lastPosition,
              tt.match
            );
            if (placeholder !== "" && getBuffer.call(inputmask)[lastPosition] !== placeholder && tt.match.optionalQuantifier !== true && tt.match.newBlockMarker !== true || !isMask.call(inputmask, lastPosition, opts.keepStatic, true) && tt.match.def === placeholder) {
              const newPos = seekNext.call(inputmask, lastPosition);
              if (clickPosition >= newPos || clickPosition === lastPosition) {
                lastPosition = newPos;
              }
            }
            selectedCaret.end = selectedCaret.begin = lastPosition;
          }
      }
      return selectedCaret;
    }
  }
  function getBuffer(noCache) {
    const inputmask = this, { maskset } = inputmask;
    if (maskset.buffer === void 0 || noCache === true) {
      maskset.buffer = getMaskTemplate.call(
        inputmask,
        true,
        getLastValidPosition.call(inputmask),
        true
      );
      if (maskset._buffer === void 0) maskset._buffer = maskset.buffer.slice();
    }
    return maskset.buffer;
  }
  function getBufferTemplate() {
    const inputmask = this, maskset = this.maskset;
    if (maskset._buffer === void 0) {
      maskset._buffer = getMaskTemplate.call(inputmask, false, 1);
      if (maskset.buffer === void 0) maskset.buffer = maskset._buffer.slice();
    }
    return maskset._buffer;
  }
  function getLastValidPosition(closestTo, strict, validPositions) {
    const maskset = this.maskset;
    let before = -1, after = -1;
    const valids = validPositions || maskset.validPositions;
    if (closestTo === void 0) closestTo = -1;
    for (let psNdx = 0, vpl = valids.length; psNdx < vpl; psNdx++) {
      if (valids[psNdx] && (strict || valids[psNdx].generatedInput !== true)) {
        if (psNdx <= closestTo) before = psNdx;
        if (psNdx >= closestTo) after = psNdx;
      }
    }
    return before === -1 || before === closestTo ? after : after === -1 ? before : closestTo - before < after - closestTo ? before : after;
  }
  function isMask(pos, strict, fuzzy) {
    const inputmask = this, maskset = this.maskset;
    let test = getTestTemplate.call(inputmask, pos).match;
    if (test.def === "") test = getTest.call(inputmask, pos).match;
    if (test.static !== true) {
      return test.fn;
    }
    if (fuzzy === true && maskset.validPositions[pos] !== void 0 && maskset.validPositions[pos].generatedInput !== true) {
      return true;
    }
    if (strict !== true && pos > -1) {
      if (fuzzy) {
        const tests = getTests.call(inputmask, pos);
        return tests.length > 1 + (tests[tests.length - 1].match.def === "" ? 1 : 0);
      }
      const testTemplate = determineTestTemplate.call(
        inputmask,
        pos,
        getTests.call(inputmask, pos)
      ), testPlaceHolder = getPlaceholder.call(inputmask, pos, testTemplate.match);
      return testTemplate.match.def !== testPlaceHolder;
    }
    return false;
  }
  function resetMaskSet(soft) {
    const maskset = this.maskset;
    maskset.buffer = void 0;
    if (soft !== true) {
      maskset.validPositions = [];
      maskset.p = 0;
    }
    if (soft === false) {
      maskset.tests = {};
      maskset.jitOffset = {};
    }
  }
  function seekNext(pos, newBlock, fuzzy) {
    const inputmask = this;
    if (fuzzy === void 0) fuzzy = true;
    let position = pos + 1;
    while (getTest.call(inputmask, position).match.def !== "" && (newBlock === true && (getTest.call(inputmask, position).match.newBlockMarker !== true || !isMask.call(inputmask, position, void 0, true)) || newBlock !== true && !isMask.call(inputmask, position, void 0, fuzzy))) {
      position++;
    }
    return position;
  }
  function seekPrevious(pos, newBlock) {
    const inputmask = this;
    let position = pos - 1;
    if (pos <= 0) return 0;
    while (position > 0 && (newBlock === true && (getTest.call(inputmask, position).match.newBlockMarker !== true || !isMask.call(inputmask, position, void 0, true)) || newBlock !== true && !isMask.call(inputmask, position, void 0, true))) {
      position--;
    }
    return position;
  }
  function translatePosition(pos) {
    const inputmask = this, opts = this.opts, el = this.el;
    if (inputmask.isRTL && typeof pos === "number" && (!opts.greedy || opts.placeholder !== "") && el) {
      pos = inputmask._valueGet().length - pos;
      if (pos < 0) pos = 0;
    }
    return pos;
  }

  // node_modules/inputmask/lib/eventhandlers.js
  var EventHandlers = {
    keyEvent: function(e, checkval, writeOut, strict, ndx) {
      const inputmask = this.inputmask, opts = inputmask.opts, $4 = inputmask.dependencyLib, maskset = inputmask.maskset, input = this, $input = $4(input), c = e.key, pos = caret.call(inputmask, input), kdResult = opts.onKeyDown.call(
        this,
        e,
        getBuffer.call(inputmask),
        pos,
        opts
      );
      if (kdResult !== void 0) return kdResult;
      if (c === keys.Backspace || c === keys.Delete || iphone && c === keys.BACKSPACE_SAFARI || e.ctrlKey && c === keys.x && !("oncut" in input)) {
        e.preventDefault();
        handleRemove.call(inputmask, input, c, pos);
        writeBuffer(
          input,
          getBuffer.call(inputmask, true),
          maskset.p,
          e,
          input.inputmask._valueGet() !== getBuffer.call(inputmask).join("")
        );
      } else if (c === keys.End || c === keys.PageDown) {
        e.preventDefault();
        const caretPos = seekNext.call(
          inputmask,
          getLastValidPosition.call(inputmask)
        );
        caret.call(
          inputmask,
          input,
          e.shiftKey ? pos.begin : caretPos,
          caretPos,
          true
        );
      } else if (c === keys.Home && !e.shiftKey || c === keys.PageUp) {
        e.preventDefault();
        caret.call(inputmask, input, 0, e.shiftKey ? pos.begin : 0, true);
      } else if ((opts.undoOnEscape && c === keys.Escape || false) && e.altKey !== true) {
        checkVal(input, true, false, inputmask.undoValue.split(""));
        $input.trigger("click");
      } else if (c === keys.Insert && !(e.shiftKey || e.ctrlKey) && inputmask.userOptions.insertMode === void 0) {
        if (!isSelection.call(inputmask, pos)) {
          opts.insertMode = !opts.insertMode;
          caret.call(inputmask, input, pos.begin, pos.begin);
        } else opts.insertMode = !opts.insertMode;
      } else if (opts.tabThrough === true && c === keys.Tab) {
        if (e.shiftKey === true) {
          pos.end = seekPrevious.call(inputmask, pos.end, true);
          if (getTest.call(inputmask, pos.end - 1).match.static === true) {
            pos.end--;
          }
          pos.begin = seekPrevious.call(inputmask, pos.end, true);
          if (pos.begin >= 0 && pos.end > 0) {
            e.preventDefault();
            caret.call(inputmask, input, pos.begin, pos.end);
          }
        } else {
          pos.begin = seekNext.call(inputmask, pos.begin, true);
          pos.end = seekNext.call(inputmask, pos.begin, true);
          if (pos.end < maskset.maskLength) pos.end--;
          if (pos.begin <= maskset.maskLength) {
            e.preventDefault();
            caret.call(inputmask, input, pos.begin, pos.end);
          }
        }
      } else if (!e.shiftKey) {
        if (opts.insertModeVisual && opts.insertMode === false) {
          if (c === keys.ArrowRight) {
            setTimeout(function() {
              const caretPos = caret.call(inputmask, input);
              caret.call(inputmask, input, caretPos.begin);
            }, 0);
          } else if (c === keys.ArrowLeft) {
            setTimeout(function() {
              const caretPos = {
                begin: translatePosition.call(
                  inputmask,
                  input.inputmask.caretPos.begin
                ),
                end: translatePosition.call(
                  inputmask,
                  input.inputmask.caretPos.end
                )
              };
              if (inputmask.isRTL) {
                caret.call(
                  inputmask,
                  input,
                  caretPos.begin + (caretPos.begin === maskset.maskLength ? 0 : 1)
                );
              } else {
                caret.call(
                  inputmask,
                  input,
                  caretPos.begin - (caretPos.begin === 0 ? 0 : 1)
                );
              }
            }, 0);
          }
        } else {
          inputmask.keyEventHook === void 0 || inputmask.keyEventHook(e);
        }
      }
      inputmask.isComposing = c == keys.Process || c == keys.Unidentified;
      inputmask.ignorable = c.length > 1 && !(input.tagName.toLowerCase() === "textarea" && c == keys.Enter);
      return EventHandlers.keypressEvent.call(
        this,
        e,
        checkval,
        writeOut,
        strict,
        ndx
      );
    },
    keypressEvent: function(e, checkval, writeOut, strict, ndx) {
      const inputmask = this.inputmask || this, opts = inputmask.opts, $4 = inputmask.dependencyLib, maskset = inputmask.maskset;
      let input = inputmask.el, $input = $4(input), c = e.key;
      if (checkval !== true && !(e.ctrlKey && e.altKey && !inputmask.ignorable) && (e.ctrlKey || e.metaKey || inputmask.ignorable)) {
        if (c === keys.Enter) {
          if (inputmask.undoValue !== inputmask._valueGet(true)) {
            inputmask.undoValue = inputmask._valueGet(true);
            setTimeout(function() {
              $input.trigger("change");
            }, 0);
          }
        }
      } else if (c) {
        let pos = checkval ? {
          begin: ndx,
          end: ndx
        } : caret.call(inputmask, input), forwardPosition;
        if (!checkval) c = opts.substitutes[c] || c;
        maskset.writeOutBuffer = true;
        const valResult = isValid.call(
          inputmask,
          pos,
          c,
          strict,
          void 0,
          void 0,
          void 0,
          checkval
        );
        if (valResult !== false) {
          resetMaskSet.call(inputmask, true);
          forwardPosition = valResult.caret !== void 0 ? valResult.caret : seekNext.call(
            inputmask,
            valResult.pos.begin ? valResult.pos.begin : valResult.pos
          );
          maskset.p = forwardPosition;
        }
        forwardPosition = opts.numericInput && valResult.caret === void 0 ? seekPrevious.call(inputmask, forwardPosition) : forwardPosition;
        if (writeOut !== false) {
          setTimeout(function() {
            opts.onKeyValidation.call(input, c, valResult);
          }, 0);
          if (maskset.writeOutBuffer && valResult !== false) {
            const buffer = getBuffer.call(inputmask);
            writeBuffer(input, buffer, forwardPosition, e, checkval !== true);
          }
        }
        e.preventDefault();
        if (checkval) {
          if (valResult !== false) valResult.forwardPosition = forwardPosition;
          return valResult;
        }
      }
    },
    pasteEvent: async function(e) {
      function handlePaste(inputmask2, input2, inputValue2, pastedValue2, onBeforePaste) {
        let caretPos = caret.call(inputmask2, input2, void 0, void 0, true), valueBeforeCaret = inputValue2.substr(0, caretPos.begin), valueAfterCaret = inputValue2.substr(caretPos.end, inputValue2.length);
        if (valueBeforeCaret == (inputmask2.isRTL ? getBufferTemplate.call(inputmask2).slice().reverse() : getBufferTemplate.call(inputmask2)).slice(0, caretPos.begin).join(""))
          valueBeforeCaret = "";
        if (valueAfterCaret == (inputmask2.isRTL ? getBufferTemplate.call(inputmask2).slice().reverse() : getBufferTemplate.call(inputmask2)).slice(caretPos.end).join(""))
          valueAfterCaret = "";
        pastedValue2 = valueBeforeCaret + pastedValue2 + valueAfterCaret;
        if (inputmask2.isRTL && opts.numericInput !== true) {
          pastedValue2 = pastedValue2.split("");
          for (const c of getBufferTemplate.call(inputmask2)) {
            if (pastedValue2[0] === c) pastedValue2.shift();
          }
          pastedValue2 = pastedValue2.reverse().join("");
        }
        let pasteValue = pastedValue2;
        if (typeof onBeforePaste === "function") {
          pasteValue = onBeforePaste.call(inputmask2, pasteValue, opts);
          if (pasteValue === false) {
            return false;
          }
          if (!pasteValue) {
            pasteValue = inputValue2;
          }
        }
        checkVal(input2, true, false, pasteValue.toString().split(""), e);
      }
      const input = this, inputmask = this.inputmask, opts = inputmask.opts;
      let inputValue = inputmask._valueGet(true), pastedValue;
      inputmask.skipInputEvent = true;
      if (e.clipboardData && e.clipboardData.getData) {
        pastedValue = e.clipboardData.getData("text/plain");
      } else if (window_default.clipboardData && window_default.clipboardData.getData) {
        pastedValue = window_default.clipboardData.getData("Text");
      }
      handlePaste(inputmask, input, inputValue, pastedValue, opts.onBeforePaste);
      e.preventDefault();
    },
    inputFallBackEvent: function(e) {
      const inputmask = this.inputmask, opts = inputmask.opts, $4 = inputmask.dependencyLib;
      function analyseChanges(inputValue2, buffer2, caretPos2) {
        let frontPart = inputValue2.substr(0, caretPos2.begin).split(""), backPart = inputValue2.substr(caretPos2.begin).split(""), frontBufferPart = buffer2.substr(0, caretPos2.begin).split(""), backBufferPart = buffer2.substr(caretPos2.begin).split(""), fpl = frontPart.length >= frontBufferPart.length ? frontPart.length : frontBufferPart.length, bpl = backPart.length >= backBufferPart.length ? backPart.length : backBufferPart.length, bl, i, action = "", data = [], marker = "~", placeholder;
        while (frontPart.length < fpl) frontPart.push(marker);
        while (frontBufferPart.length < fpl) frontBufferPart.push(marker);
        while (backPart.length < bpl) backPart.unshift(marker);
        while (backBufferPart.length < bpl) backBufferPart.unshift(marker);
        const newBuffer = frontPart.concat(backPart), oldBuffer = frontBufferPart.concat(backBufferPart);
        for (i = 0, bl = newBuffer.length; i < bl; i++) {
          placeholder = getPlaceholder.call(
            inputmask,
            translatePosition.call(inputmask, i)
          );
          switch (action) {
            case "insertText":
              if (oldBuffer[i - 1] === newBuffer[i] && caretPos2.begin == newBuffer.length - 1) {
                data.push(newBuffer[i]);
              }
              i = bl;
              break;
            case "insertReplacementText":
              if (newBuffer[i] === marker) {
                caretPos2.end++;
              } else {
                i = bl;
              }
              break;
            case "deleteContentBackward":
              if (newBuffer[i] === marker) {
                caretPos2.end++;
              } else {
                i = bl;
              }
              break;
            default:
              if (newBuffer[i] !== oldBuffer[i]) {
                if ((newBuffer[i + 1] === marker || newBuffer[i + 1] === placeholder || newBuffer[i + 1] === void 0) && (oldBuffer[i] === placeholder && oldBuffer[i + 1] === marker || oldBuffer[i] === marker)) {
                  action = "insertText";
                  data.push(newBuffer[i]);
                  caretPos2.begin--;
                  caretPos2.end--;
                } else if (oldBuffer[i + 1] === marker && oldBuffer[i] === newBuffer[i + 1]) {
                  action = "insertText";
                  data.push(newBuffer[i]);
                  caretPos2.begin--;
                  caretPos2.end--;
                } else if (newBuffer[i] !== placeholder && newBuffer[i] !== marker && (newBuffer[i + 1] === marker || oldBuffer[i] !== newBuffer[i] && oldBuffer[i + 1] === newBuffer[i + 1])) {
                  action = "insertReplacementText";
                  data.push(newBuffer[i]);
                  caretPos2.begin--;
                } else if (newBuffer[i] === marker) {
                  action = "deleteContentBackward";
                  if (isMask.call(
                    inputmask,
                    translatePosition.call(inputmask, i),
                    true
                  ) || oldBuffer[i] === opts.radixPoint)
                    caretPos2.end++;
                } else {
                  i = bl;
                }
              }
              break;
          }
        }
        return {
          action,
          data,
          caret: caretPos2
        };
      }
      let input = this, inputValue = input.inputmask._valueGet(true), buffer = (inputmask.isRTL ? getBuffer.call(inputmask).slice().reverse() : getBuffer.call(inputmask)).join(""), caretPos = caret.call(inputmask, input, void 0, void 0, true), changes;
      if (buffer !== inputValue) {
        changes = analyseChanges(inputValue, buffer, caretPos);
        if ((input.inputmask.shadowRoot || input.ownerDocument).activeElement !== input) {
          input.focus();
        }
        writeBuffer(input, getBuffer.call(inputmask));
        caret.call(inputmask, input, caretPos.begin, caretPos.end, true);
        if (!mobile && inputmask.skipNextInsert && e.inputType === "insertText" && changes.action === "insertText" && inputmask.isComposing) {
          return false;
        }
        if (e.inputType === "insertCompositionText" && changes.action === "insertText" && inputmask.isComposing) {
          inputmask.skipNextInsert = true;
        } else {
          inputmask.skipNextInsert = false;
        }
        switch (changes.action) {
          case "insertText":
          case "insertReplacementText":
            changes.data.forEach(function(entry, ndx) {
              const keypress = new $4.Event("keypress");
              keypress.key = entry;
              inputmask.ignorable = false;
              EventHandlers.keypressEvent.call(input, keypress);
            });
            setTimeout(function() {
              inputmask.$el.trigger("keyup");
            }, 0);
            break;
          case "deleteContentBackward":
            var keydown = new $4.Event("keydown");
            keydown.key = keys.Backspace;
            EventHandlers.keyEvent.call(input, keydown);
            break;
          default:
            applyInputValue(input, inputValue);
            caret.call(inputmask, input, caretPos.begin, caretPos.end, true);
            break;
        }
        e.preventDefault();
      }
    },
    setValueEvent: function(e) {
      const inputmask = this.inputmask, $4 = inputmask.dependencyLib;
      let input = this, value = e && e.detail ? e.detail[0] : arguments[1];
      if (value === void 0) {
        value = input.inputmask._valueGet(true);
      }
      applyInputValue(input, value, new $4.Event("input"));
      if (e.detail && e.detail[1] !== void 0 || arguments[2] !== void 0) {
        caret.call(inputmask, input, e.detail ? e.detail[1] : arguments[2]);
      }
    },
    focusEvent: function(e) {
      const inputmask = this.inputmask, opts = inputmask.opts, input = this, nptValue = inputmask && inputmask._valueGet();
      if (opts.showMaskOnFocus) {
        if (nptValue !== getBuffer.call(inputmask).join("")) {
          writeBuffer(
            input,
            getBuffer.call(inputmask),
            seekNext.call(inputmask, getLastValidPosition.call(inputmask))
          );
        }
      }
      if (opts.positionCaretOnTab === true && inputmask.mouseEnter === false && (!isComplete.call(inputmask, getBuffer.call(inputmask)) || getLastValidPosition.call(inputmask) === -1)) {
        EventHandlers.clickEvent.apply(input, [e, true]);
      }
      inputmask.undoValue = inputmask && inputmask._valueGet(true);
    },
    invalidEvent: function(e) {
      this.inputmask.validationEvent = true;
    },
    mouseleaveEvent: function() {
      const inputmask = this.inputmask, opts = inputmask.opts, input = this;
      inputmask.mouseEnter = false;
      if (opts.clearMaskOnLostFocus && (input.inputmask.shadowRoot || input.ownerDocument).activeElement !== input) {
        HandleNativePlaceholder(input, inputmask.originalPlaceholder);
      }
    },
    clickEvent: function(e, tabbed) {
      const inputmask = this.inputmask;
      inputmask.clicked++;
      const input = this;
      if ((input.inputmask.shadowRoot || input.ownerDocument).activeElement === input) {
        const newCaretPosition = determineNewCaretPosition.call(
          inputmask,
          caret.call(inputmask, input),
          tabbed
        );
        if (newCaretPosition !== void 0) {
          caret.call(inputmask, input, newCaretPosition);
        }
      }
    },
    cutEvent: function(e) {
      const inputmask = this.inputmask, maskset = inputmask.maskset, input = this, pos = caret.call(inputmask, input), clipData = inputmask.isRTL ? getBuffer.call(inputmask).slice(pos.end, pos.begin) : getBuffer.call(inputmask).slice(pos.begin, pos.end), clipDataText = inputmask.isRTL ? clipData.reverse().join("") : clipData.join("");
      if (window_default.navigator && window_default.navigator.clipboard)
        window_default.navigator.clipboard.writeText(clipDataText);
      else if (window_default.clipboardData && window_default.clipboardData.getData) {
        window_default.clipboardData.setData("Text", clipDataText);
      }
      handleRemove.call(inputmask, input, keys.Delete, pos);
      writeBuffer(
        input,
        getBuffer.call(inputmask),
        maskset.p,
        e,
        inputmask.undoValue !== inputmask._valueGet(true)
      );
    },
    blurEvent: function(e) {
      const inputmask = this.inputmask, opts = inputmask.opts, $4 = inputmask.dependencyLib;
      inputmask.clicked = 0;
      const $input = $4(this), input = this;
      if (input.inputmask) {
        HandleNativePlaceholder(input, inputmask.originalPlaceholder);
        let nptValue = input.inputmask._valueGet(), buffer = getBuffer.call(inputmask).slice();
        if (nptValue !== "") {
          if (opts.clearMaskOnLostFocus) {
            if (getLastValidPosition.call(inputmask) === -1 && nptValue === getBufferTemplate.call(inputmask).join("")) {
              buffer = [];
            } else {
              clearOptionalTail.call(inputmask, buffer);
            }
          }
          if (isComplete.call(inputmask, buffer) === false) {
            setTimeout(function() {
              $input.trigger("incomplete");
            }, 0);
            if (opts.clearIncomplete) {
              resetMaskSet.call(inputmask, false);
              if (opts.clearMaskOnLostFocus) {
                buffer = [];
              } else {
                buffer = getBufferTemplate.call(inputmask).slice();
              }
            }
          }
          writeBuffer(input, buffer, void 0, e);
        }
        nptValue = inputmask._valueGet(true);
        if (inputmask.undoValue !== nptValue) {
          if (nptValue != "" || inputmask.undoValue != getBufferTemplate.call(inputmask).join("") || inputmask.undoValue == getBufferTemplate.call(inputmask).join("") && inputmask.maskset.validPositions.length > 0) {
            inputmask.undoValue = nptValue;
            $input.trigger("change");
          }
        }
      }
    },
    mouseenterEvent: function() {
      const inputmask = this.inputmask, { showMaskOnHover } = inputmask.opts, input = this;
      inputmask.mouseEnter = true;
      if ((input.inputmask.shadowRoot || input.ownerDocument).activeElement !== input) {
        const bufferTemplate = (inputmask.isRTL ? getBufferTemplate.call(inputmask).slice().reverse() : getBufferTemplate.call(inputmask)).join("");
        if (showMaskOnHover) {
          HandleNativePlaceholder(input, bufferTemplate);
        }
      }
    },
    submitEvent: function() {
      const inputmask = this.inputmask, opts = inputmask.opts;
      if (inputmask.undoValue !== inputmask._valueGet(true)) {
        inputmask.$el.trigger("change");
      }
      if (
        /* opts.clearMaskOnLostFocus && */
        getLastValidPosition.call(
          inputmask
        ) === -1 && inputmask._valueGet && inputmask._valueGet() === getBufferTemplate.call(inputmask).join("")
      ) {
        inputmask._valueSet("");
      }
      if (opts.clearIncomplete && isComplete.call(inputmask, getBuffer.call(inputmask)) === false) {
        inputmask._valueSet("");
      }
      if (opts.removeMaskOnSubmit) {
        inputmask._valueSet(inputmask.unmaskedvalue(), true);
        setTimeout(function() {
          writeBuffer(inputmask.el, getBuffer.call(inputmask));
        }, 0);
      }
    },
    resetEvent: function() {
      const inputmask = this.inputmask;
      inputmask.refreshValue = true;
      setTimeout(function() {
        applyInputValue(inputmask.el, inputmask._valueGet(true));
      }, 0);
    }
  };

  // node_modules/inputmask/lib/inputHandling.js
  function applyInputValue(input, value, initialEvent) {
    const inputmask = input ? input.inputmask : this, opts = inputmask.opts;
    input.inputmask.refreshValue = false;
    if (typeof opts.onBeforeMask === "function")
      value = opts.onBeforeMask.call(inputmask, value, opts) || value;
    value = (value || "").toString().split("");
    checkVal(input, true, false, value, initialEvent);
    inputmask.undoValue = inputmask._valueGet(true);
    if ((opts.clearMaskOnLostFocus || opts.clearIncomplete) && input.inputmask._valueGet() === getBufferTemplate.call(inputmask).join("") && getLastValidPosition.call(inputmask) === -1) {
      input.inputmask._valueSet("");
    }
  }
  function clearOptionalTail(buffer) {
    const inputmask = this;
    buffer.length = 0;
    let template = getMaskTemplate.call(
      inputmask,
      true,
      0,
      true,
      void 0,
      true
    ), lmnt;
    while ((lmnt = template.shift()) !== void 0) buffer.push(lmnt);
    return buffer;
  }
  function checkVal(input, writeOut, strict, nptvl, initiatingEvent) {
    const inputmask = input ? input.inputmask : this, maskset = inputmask.maskset, opts = inputmask.opts, $4 = inputmask.dependencyLib;
    let inputValue = nptvl.slice(), charCodes = "", initialNdx = -1, result, skipOptionalPartCharacter = opts.skipOptionalPartCharacter;
    opts.skipOptionalPartCharacter = "";
    function isTemplateMatch(ndx, charCodes2) {
      let targetTemplate = getMaskTemplate.call(inputmask, true, 0).slice(ndx, seekNext.call(inputmask, ndx, false, false)).join("").replace(/'/g, ""), charCodeNdx = targetTemplate.indexOf(charCodes2);
      while (charCodeNdx > 0 && targetTemplate[charCodeNdx - 1] === " ")
        charCodeNdx--;
      const match = charCodeNdx === 0 && !isMask.call(inputmask, ndx) && (getTest.call(inputmask, ndx).match.nativeDef === charCodes2.charAt(0) || getTest.call(inputmask, ndx).match.static === true && getTest.call(inputmask, ndx).match.nativeDef === "'" + charCodes2.charAt(0) || getTest.call(inputmask, ndx).match.nativeDef === " " && (getTest.call(inputmask, ndx + 1).match.nativeDef === charCodes2.charAt(0) || getTest.call(inputmask, ndx + 1).match.static === true && getTest.call(inputmask, ndx + 1).match.nativeDef === "'" + charCodes2.charAt(0)));
      if (!match && charCodeNdx > 0 && !isMask.call(inputmask, ndx, false, true)) {
        const nextPos = seekNext.call(inputmask, ndx);
        if (inputmask.caretPos.begin < nextPos) {
          inputmask.caretPos = { begin: nextPos };
        }
      }
      return match;
    }
    resetMaskSet.call(inputmask, false);
    inputmask.clicked = 0;
    initialNdx = opts.radixPoint ? determineNewCaretPosition.call(
      inputmask,
      {
        begin: 0,
        end: 0
      },
      false,
      opts.__financeInput === false ? "radixFocus" : void 0
    ).begin : 0;
    maskset.p = initialNdx;
    inputmask.caretPos = { begin: initialNdx };
    let staticMatches = [], prevCaretPos = inputmask.caretPos;
    inputValue.forEach(function(charCode, ndx) {
      if (charCode !== void 0) {
        const keypress = new $4.Event("_checkval");
        keypress.key = charCode;
        charCodes += charCode;
        const lvp = getLastValidPosition.call(inputmask, void 0, true);
        if (!isTemplateMatch(initialNdx, charCodes)) {
          result = EventHandlers.keypressEvent.call(
            inputmask,
            keypress,
            true,
            false,
            strict,
            inputmask.caretPos.begin
          );
          if (result) {
            initialNdx = inputmask.caretPos.begin + 1;
            charCodes = "";
          }
        } else {
          result = EventHandlers.keypressEvent.call(
            inputmask,
            keypress,
            true,
            false,
            strict,
            lvp + 1
          );
        }
        if (result) {
          if (result.pos !== void 0 && maskset.validPositions[result.pos] && maskset.validPositions[result.pos].match.static === true && maskset.validPositions[result.pos].alternation === void 0) {
            staticMatches.push(result.pos);
            if (!inputmask.isRTL) {
              result.forwardPosition = result.pos + 1;
            }
          }
          writeBuffer.call(
            inputmask,
            void 0,
            getBuffer.call(inputmask),
            result.forwardPosition,
            keypress,
            false
          );
          inputmask.caretPos = {
            begin: result.forwardPosition,
            end: result.forwardPosition
          };
          prevCaretPos = inputmask.caretPos;
        } else {
          if (maskset.validPositions[ndx] === void 0 && inputValue[ndx] === getPlaceholder.call(inputmask, ndx) && isMask.call(inputmask, ndx, true)) {
            inputmask.caretPos.begin++;
          } else inputmask.caretPos = prevCaretPos;
        }
      }
    });
    if (staticMatches.length > 0) {
      let sndx, validPos, nextValid = seekNext.call(inputmask, -1, void 0, false);
      if (!isComplete.call(inputmask, getBuffer.call(inputmask)) && staticMatches.length <= nextValid || isComplete.call(inputmask, getBuffer.call(inputmask)) && staticMatches.length > 0 && staticMatches.length !== nextValid && staticMatches[0] === 0) {
        let nextSndx = nextValid;
        while ((sndx = staticMatches.shift()) !== void 0) {
          if (sndx < nextSndx) {
            const keypress = new $4.Event("_checkval");
            validPos = maskset.validPositions[sndx];
            validPos.generatedInput = true;
            keypress.key = validPos.input;
            result = EventHandlers.keypressEvent.call(
              inputmask,
              keypress,
              true,
              false,
              strict,
              nextSndx
            );
            if (result && result.pos !== void 0 && result.pos !== sndx && maskset.validPositions[result.pos] && maskset.validPositions[result.pos].match.static === true) {
              staticMatches.push(result.pos);
            } else if (!result) break;
            nextSndx++;
          }
        }
      } else {
      }
    }
    if (writeOut) {
      writeBuffer.call(
        inputmask,
        input,
        getBuffer.call(inputmask),
        result ? result.forwardPosition : inputmask.caretPos.begin,
        initiatingEvent || new $4.Event("checkval"),
        initiatingEvent && (initiatingEvent.type === "input" && inputmask.undoValue !== getBuffer.call(inputmask).join("") || initiatingEvent.type === "paste")
      );
    }
    opts.skipOptionalPartCharacter = skipOptionalPartCharacter;
  }
  function HandleNativePlaceholder(npt, value) {
    const inputmask = npt ? npt.inputmask : this;
    if (ie) {
      if (npt.inputmask._valueGet() !== value && (npt.placeholder !== value || npt.placeholder === "")) {
        let buffer = getBuffer.call(inputmask).slice(), nptValue = npt.inputmask._valueGet();
        if (nptValue !== value) {
          const lvp = getLastValidPosition.call(inputmask);
          if (lvp === -1 && nptValue === getBufferTemplate.call(inputmask).join("")) {
            buffer = [];
          } else if (lvp !== -1) {
            clearOptionalTail.call(inputmask, buffer);
          }
          writeBuffer(npt, buffer);
        }
      }
    } else if (npt.placeholder !== value) {
      npt.placeholder = value;
      if (npt.placeholder === "") npt.removeAttribute("placeholder");
    }
  }
  function unmaskedvalue(input) {
    const inputmask = input ? input.inputmask : this, opts = inputmask.opts, maskset = inputmask.maskset;
    if (input) {
      if (input.inputmask === void 0) {
        return input.value;
      }
      if (input.inputmask && input.inputmask.refreshValue) {
        applyInputValue(input, input.inputmask._valueGet(true));
      }
    }
    const umValue = [], vps = maskset.validPositions;
    for (let pndx = 0, vpl = vps.length; pndx < vpl; pndx++) {
      if (vps[pndx] && vps[pndx].match && (vps[pndx].match.static != true || Array.isArray(maskset.metadata) && vps[pndx].generatedInput !== true)) {
        umValue.push(vps[pndx].input);
      }
    }
    let unmaskedValue = umValue.length === 0 ? "" : (inputmask.isRTL ? umValue.reverse() : umValue).join("");
    if (typeof opts.onUnMask === "function") {
      const bufferValue = (inputmask.isRTL ? getBuffer.call(inputmask).slice().reverse() : getBuffer.call(inputmask)).join("");
      unmaskedValue = opts.onUnMask.call(
        inputmask,
        bufferValue,
        unmaskedValue,
        opts
      );
    }
    return unmaskedValue;
  }
  function writeBuffer(input, buffer, caretPos, event, triggerEvents) {
    const inputmask = input ? input.inputmask : this, opts = inputmask.opts, $4 = inputmask.dependencyLib;
    if (event && typeof opts.onBeforeWrite === "function") {
      const result = opts.onBeforeWrite.call(
        inputmask,
        event,
        buffer,
        caretPos,
        opts
      );
      if (result) {
        if (result.refreshFromBuffer) {
          const refresh = result.refreshFromBuffer;
          refreshFromBuffer.call(
            inputmask,
            refresh === true ? refresh : refresh.start,
            refresh.end,
            result.buffer || buffer
          );
          buffer = getBuffer.call(inputmask, true);
        }
        if (caretPos !== void 0)
          caretPos = result.caret !== void 0 ? result.caret : caretPos;
      }
    }
    if (input !== void 0) {
      input.inputmask._valueSet(buffer.join(""));
      if (caretPos !== void 0 && (event === void 0 || event.type !== "blur")) {
        caret.call(
          inputmask,
          input,
          caretPos,
          void 0,
          void 0,
          event !== void 0 && event.type === "keydown" && (event.key === keys.Delete || event.key === keys.Backspace)
        );
      }
      input.inputmask.writeBufferHook === void 0 || input.inputmask.writeBufferHook(caretPos);
      if (triggerEvents === true) {
        const $input = $4(input), nptVal = input.inputmask._valueGet();
        input.inputmask.skipInputEvent = true;
        $input.trigger("input");
        setTimeout(function() {
          if (nptVal === getBufferTemplate.call(inputmask).join("")) {
            $input.trigger("cleared");
          } else if (isComplete.call(inputmask, buffer) === true) {
            $input.trigger("complete");
          }
        }, 0);
      }
    }
  }

  // node_modules/inputmask/lib/eventruler.js
  var EventRuler = {
    on: function(input, eventName, eventHandler) {
      const $4 = input.inputmask.dependencyLib;
      let ev = function(e) {
        if (e.originalEvent) {
          e = e.originalEvent || e;
          arguments[0] = e;
        }
        let that = this, args, inputmask = that.inputmask, opts = inputmask ? inputmask.opts : void 0;
        if (inputmask === void 0 && this.nodeName !== "FORM") {
          const imOpts = $4.data(that, "_inputmask_opts");
          $4(that).off();
          if (imOpts) {
            new inputmask_default(imOpts).mask(that);
          }
        } else if (!["submit", "reset", "setvalue"].includes(e.type) && this.nodeName !== "FORM" && (that.disabled || that.readOnly && !(e.type === "keydown" && e.ctrlKey && e.key === keys.c || opts.tabThrough === false && e.key === keys.Tab))) {
          e.preventDefault();
        } else {
          switch (e.type) {
            case "input":
              if (inputmask.skipInputEvent === true) {
                inputmask.skipInputEvent = false;
                return e.preventDefault();
              }
              break;
            case "click":
            case "focus":
              if (inputmask.validationEvent) {
                inputmask.validationEvent = false;
                input.blur();
                HandleNativePlaceholder(
                  input,
                  (inputmask.isRTL ? getBufferTemplate.call(inputmask).slice().reverse() : getBufferTemplate.call(inputmask)).join("")
                );
                setTimeout(function() {
                  input.focus();
                }, opts.validationEventTimeOut);
                return false;
              }
              args = arguments;
              setTimeout(function() {
                if (!input.inputmask) {
                  return;
                }
                eventHandler.apply(that, args);
              }, 0);
              return;
          }
          const returnVal = eventHandler.apply(that, arguments);
          if (returnVal === false) {
            e.preventDefault();
            e.stopPropagation();
          }
          return returnVal;
        }
      };
      if (["submit", "reset"].includes(eventName)) {
        ev = ev.bind(input);
        if (input.form !== null) $4(input.form).on(eventName, ev);
      } else {
        $4(input).on(eventName, ev);
      }
      input.inputmask.events[eventName] = input.inputmask.events[eventName] || [];
      input.inputmask.events[eventName].push(ev);
    },
    off: function(input, event) {
      if (input.inputmask && input.inputmask.events) {
        const $4 = input.inputmask.dependencyLib;
        let events2 = input.inputmask.events;
        if (event) {
          events2 = [];
          events2[event] = input.inputmask.events[event];
        }
        for (const eventName in events2) {
          const evArr = events2[eventName];
          while (evArr.length > 0) {
            const ev = evArr.pop();
            if (["submit", "reset"].includes(eventName)) {
              if (input.form !== null) $4(input.form).off(eventName, ev);
            } else {
              $4(input).off(eventName, ev);
            }
          }
          delete input.inputmask.events[eventName];
        }
      }
    }
  };

  // node_modules/inputmask/lib/mask.js
  function mask() {
    const inputmask = this, opts = this.opts, el = this.el, $4 = this.dependencyLib;
    function isElementTypeSupported(input, opts2) {
      function patchValueProperty(npt) {
        let valueGet, valueSet;
        function patchValhook(type) {
          if ($4.valHooks && ($4.valHooks[type] === void 0 || $4.valHooks[type].inputmaskpatch !== true)) {
            const valhookGet = $4.valHooks[type] && $4.valHooks[type].get ? $4.valHooks[type].get : function(elem) {
              return elem.value;
            }, valhookSet = $4.valHooks[type] && $4.valHooks[type].set ? $4.valHooks[type].set : function(elem, value) {
              elem.value = value;
              return elem;
            };
            $4.valHooks[type] = {
              get: function(elem) {
                if (elem.inputmask) {
                  if (elem.inputmask.opts.autoUnmask) {
                    return elem.inputmask.unmaskedvalue();
                  } else {
                    const result = valhookGet(elem);
                    return getLastValidPosition.call(
                      inputmask,
                      void 0,
                      void 0,
                      elem.inputmask.maskset.validPositions
                    ) !== -1 || opts2.nullable !== true ? result : "";
                  }
                } else {
                  return valhookGet(elem);
                }
              },
              set: function(elem, value) {
                const result = valhookSet(elem, value);
                if (elem.inputmask) {
                  applyInputValue(elem, value);
                }
                return result;
              },
              inputmaskpatch: true
            };
          }
        }
        function getter() {
          if (this.inputmask) {
            return this.inputmask.opts.autoUnmask ? this.inputmask.unmaskedvalue() : getLastValidPosition.call(inputmask) !== -1 || opts2.nullable !== true ? (this.inputmask.shadowRoot || this.ownerDocument).activeElement === this && opts2.clearMaskOnLostFocus ? (inputmask.isRTL ? clearOptionalTail.call(inputmask, getBuffer.call(inputmask).slice()).reverse() : clearOptionalTail.call(
              inputmask,
              getBuffer.call(inputmask).slice()
            )).join("") : valueGet.call(this) : "";
          } else {
            return valueGet.call(this);
          }
        }
        function setter(value) {
          valueSet.call(this, value);
          if (this.inputmask) {
            applyInputValue(this, value);
          }
        }
        function installNativeValueSetFallback(npt2) {
          EventRuler.on(npt2, "mouseenter", function() {
            const input2 = this, value = input2.inputmask._valueGet(true), bufferValue = (input2.inputmask.isRTL ? getBuffer.call(input2.inputmask).slice().reverse() : getBuffer.call(input2.inputmask)).join("");
            if (value != bufferValue) {
              applyInputValue(input2, value);
            }
          });
        }
        if (!npt.inputmask.__valueGet) {
          if (opts2.noValuePatching !== true) {
            if (Object.getOwnPropertyDescriptor) {
              const valueProperty = Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(npt),
                "value"
              ) : void 0;
              if (valueProperty && valueProperty.get && valueProperty.set) {
                valueGet = valueProperty.get;
                valueSet = valueProperty.set;
                Object.defineProperty(npt, "value", {
                  get: getter,
                  set: setter,
                  configurable: true
                });
              } else if (npt.tagName.toLowerCase() !== "input") {
                valueGet = function() {
                  return this.textContent;
                };
                valueSet = function(value) {
                  this.textContent = value;
                };
                Object.defineProperty(npt, "value", {
                  get: getter,
                  set: setter,
                  configurable: true
                });
              }
            } else if (document.__lookupGetter__ && npt.__lookupGetter__("value")) {
              valueGet = npt.__lookupGetter__("value");
              valueSet = npt.__lookupSetter__("value");
              npt.__defineGetter__("value", getter);
              npt.__defineSetter__("value", setter);
            }
            npt.inputmask.__valueGet = valueGet;
            npt.inputmask.__valueSet = valueSet;
          }
          npt.inputmask._valueGet = function(overruleRTL) {
            return inputmask.isRTL && overruleRTL !== true ? valueGet.call(this.el).split("").reverse().join("") : valueGet.call(this.el);
          };
          npt.inputmask._valueSet = function(value, overruleRTL) {
            valueSet.call(
              this.el,
              value === null || value === void 0 ? "" : overruleRTL !== true && inputmask.isRTL ? value.split("").reverse().join("") : value
            );
          };
          if (valueGet === void 0) {
            valueGet = function() {
              return this.value;
            };
            valueSet = function(value) {
              this.value = value;
            };
            patchValhook(npt.type);
            installNativeValueSetFallback(npt);
          }
        }
      }
      let elementType = input.getAttribute("type"), isSupported2 = input.tagName.toLowerCase() === "input" && opts2.supportsInputType.includes(elementType) || input.isContentEditable || input.tagName.toLowerCase() === "textarea";
      if (!isSupported2) {
        if (input.tagName.toLowerCase() === "input") {
          let el2 = document.createElement("input");
          el2.setAttribute("type", elementType);
          isSupported2 = el2.type === "text";
          el2 = null;
        } else {
          isSupported2 = "partial";
        }
      }
      if (isSupported2 !== false) {
        patchValueProperty(input);
      } else {
        input.inputmask = void 0;
      }
      return isSupported2;
    }
    EventRuler.off(el);
    const isSupported = isElementTypeSupported(el, opts);
    if (isSupported !== false) {
      inputmask.originalPlaceholder = el.placeholder;
      inputmask.maxLength = el !== void 0 ? el.maxLength : void 0;
      if (inputmask.maxLength === -1) inputmask.maxLength = void 0;
      if ("inputMode" in el && el.getAttribute("inputmode") === null) {
        el.inputMode = opts.inputmode;
        el.setAttribute("inputmode", opts.inputmode);
      }
      if (isSupported === true) {
        opts.showMaskOnFocus = opts.showMaskOnFocus && ["cc-number", "cc-exp"].indexOf(el.autocomplete) === -1;
        if (iphone) {
          opts.insertModeVisual = false;
          el.setAttribute("autocorrect", "off");
        }
        EventRuler.on(el, "submit", EventHandlers.submitEvent);
        EventRuler.on(el, "reset", EventHandlers.resetEvent);
        EventRuler.on(el, "blur", EventHandlers.blurEvent);
        EventRuler.on(el, "focus", EventHandlers.focusEvent);
        EventRuler.on(el, "invalid", EventHandlers.invalidEvent);
        EventRuler.on(el, "click", EventHandlers.clickEvent);
        EventRuler.on(el, "mouseleave", EventHandlers.mouseleaveEvent);
        EventRuler.on(el, "mouseenter", EventHandlers.mouseenterEvent);
        EventRuler.on(el, "paste", EventHandlers.pasteEvent);
        EventRuler.on(el, "cut", EventHandlers.cutEvent);
        EventRuler.on(el, "complete", opts.oncomplete);
        EventRuler.on(el, "incomplete", opts.onincomplete);
        EventRuler.on(el, "cleared", opts.oncleared);
        if (opts.inputEventOnly !== true) {
          EventRuler.on(el, "keydown", EventHandlers.keyEvent);
        }
        if (mobile || opts.inputEventOnly) {
          el.removeAttribute("maxLength");
        }
        EventRuler.on(el, "input", EventHandlers.inputFallBackEvent);
      }
      EventRuler.on(el, "setvalue", EventHandlers.setValueEvent);
      inputmask.applyMaskHook === void 0 || inputmask.applyMaskHook();
      getBufferTemplate.call(inputmask).join("");
      inputmask.undoValue = inputmask._valueGet(true);
      const activeElement = (el.inputmask.shadowRoot || el.ownerDocument).activeElement;
      if (el.inputmask._valueGet(true) !== "" || opts.clearMaskOnLostFocus === false || activeElement === el) {
        applyInputValue(el, el.inputmask._valueGet(true), opts);
        let buffer = getBuffer.call(inputmask).slice();
        if (isComplete.call(inputmask, buffer) === false) {
          if (opts.clearIncomplete) {
            resetMaskSet.call(inputmask, false);
          }
        }
        if (opts.clearMaskOnLostFocus && activeElement !== el) {
          if (getLastValidPosition.call(inputmask) === -1) {
            buffer = [];
          } else {
            clearOptionalTail.call(inputmask, buffer);
          }
        }
        if (opts.clearMaskOnLostFocus === false || opts.showMaskOnFocus && activeElement === el || el.inputmask._valueGet(true) !== "") {
          writeBuffer(el, buffer);
        }
        if (activeElement === el) {
          caret.call(
            inputmask,
            el,
            seekNext.call(inputmask, getLastValidPosition.call(inputmask))
          );
        }
      }
    }
  }

  // node_modules/inputmask/lib/escapeRegex.js
  var escapeRegexRegex = new RegExp(
    "(\\" + [
      "/",
      ".",
      "*",
      "+",
      "?",
      "|",
      "(",
      ")",
      "[",
      "]",
      "{",
      "}",
      "\\",
      "$",
      "^"
    ].join("|\\") + ")",
    "gim"
  );
  function escapeRegex_default(str) {
    return str.replace(escapeRegexRegex, "\\$1");
  }

  // node_modules/inputmask/lib/masktoken.js
  function masktoken_default(isGroup, isOptional, isQuantifier, isAlternator) {
    this.matches = [];
    this.openGroup = isGroup || false;
    this.alternatorGroup = false;
    this.isGroup = isGroup || false;
    this.isOptional = isOptional || false;
    this.isQuantifier = isQuantifier || false;
    this.isAlternator = isAlternator || false;
    this.quantifier = {
      min: 1,
      max: 1
    };
  }

  // node_modules/inputmask/lib/mask-lexer.js
  function generateMaskSet(opts, nocache) {
    let ms;
    function preProcessMask(mask2, { repeat, groupmarker, quantifiermarker, keepStatic }) {
      if (repeat > 0 || repeat === "*" || repeat === "+") {
        const repeatStart = repeat === "*" ? 0 : repeat === "+" ? 1 : repeat;
        if (repeatStart != repeat) {
          mask2 = groupmarker[0] + mask2 + groupmarker[1] + quantifiermarker[0] + repeatStart + "," + repeat + quantifiermarker[1];
        } else {
          const msk = mask2;
          for (let i = 1; i < repeatStart; i++) {
            mask2 += msk;
          }
        }
      }
      if (keepStatic === true) {
        const optionalRegex = "(.)\\[([^\\]]*)\\]", maskMatches = mask2.match(new RegExp(optionalRegex, "g"));
        maskMatches && maskMatches.forEach((m2, i) => {
          let [p1, p2] = m2.split("[");
          p2 = p2.replace("]", "");
          mask2 = mask2.replace(
            new RegExp(`${escapeRegex_default(p1)}\\[${escapeRegex_default(p2)}\\]`),
            p1.charAt(0) === p2.charAt(0) ? `(${p1}|${p1}${p2})` : `${p1}[${p2}]`
          );
        });
      }
      return mask2;
    }
    function generateMask(mask2, metadata, opts2) {
      let regexMask = false;
      if (mask2 === null || mask2 === "") {
        regexMask = opts2.regex !== null;
        if (regexMask) {
          mask2 = opts2.regex;
          mask2 = mask2.replace(/^(\^)(.*)(\$)$/, "$2");
        } else {
          regexMask = true;
          mask2 = ".*";
        }
      }
      if (mask2.length === 1 && opts2.greedy === false && opts2.repeat !== 0) {
        opts2.placeholder = "";
      }
      mask2 = preProcessMask(mask2, opts2);
      let masksetDefinition, maskdefKey;
      maskdefKey = regexMask ? "regex_" + opts2.regex : opts2.numericInput ? mask2.split("").reverse().join("") : mask2;
      if (opts2.keepStatic !== null) {
        maskdefKey = "ks_" + opts2.keepStatic + maskdefKey;
      }
      if (typeof opts2.placeholder === "object") {
        maskdefKey = "ph_" + JSON.stringify(opts2.placeholder) + maskdefKey;
      }
      if (inputmask_default.prototype.masksCache[maskdefKey] === void 0 || nocache === true) {
        masksetDefinition = {
          mask: mask2,
          maskToken: inputmask_default.prototype.analyseMask(mask2, regexMask, opts2),
          validPositions: [],
          _buffer: void 0,
          buffer: void 0,
          tests: {},
          excludes: {},
          // excluded alternations
          metadata,
          maskLength: void 0,
          jitOffset: {}
        };
        if (nocache !== true) {
          inputmask_default.prototype.masksCache[maskdefKey] = masksetDefinition;
          masksetDefinition = inputmask_dependencyLib_default.extend(
            true,
            {},
            inputmask_default.prototype.masksCache[maskdefKey]
          );
        }
      } else {
        masksetDefinition = inputmask_dependencyLib_default.extend(
          true,
          {},
          inputmask_default.prototype.masksCache[maskdefKey]
        );
      }
      return masksetDefinition;
    }
    if (typeof opts.mask === "function") {
      opts.mask = opts.mask(opts);
    }
    if (Array.isArray(opts.mask)) {
      if (opts.mask.length > 1) {
        if (opts.keepStatic === null) {
          opts.keepStatic = true;
        }
        let altMask = opts.groupmarker[0];
        (opts.isRTL ? opts.mask.reverse() : opts.mask).forEach(function(msk) {
          if (altMask.length > 1) {
            altMask += opts.alternatormarker;
          }
          if (msk.mask !== void 0 && typeof msk.mask !== "function") {
            altMask += msk.mask;
          } else {
            altMask += msk;
          }
        });
        altMask += opts.groupmarker[1];
        return generateMask(altMask, opts.mask, opts);
      } else {
        opts.mask = opts.mask.pop();
      }
    }
    if (opts.mask && opts.mask.mask !== void 0 && typeof opts.mask.mask !== "function") {
      ms = generateMask(opts.mask.mask, opts.mask, opts);
    } else {
      ms = generateMask(opts.mask, opts.mask, opts);
    }
    if (opts.keepStatic === null) opts.keepStatic = false;
    return ms;
  }
  function analyseMask(mask2, regexMask, opts) {
    const tokenizer = /(?:[?*+]|\{[0-9+*]+(?:,[0-9+*]*)?(?:\|[0-9+*]*)?\})|[^.?*+^${[]()|\\]+|./g, regexTokenizer = /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g;
    let escaped = false, currentToken = new masktoken_default(), match, m2, openenings = [], maskTokens = [], openingToken, currentOpeningToken, alternator, lastMatch, closeRegexGroup = false;
    function insertTestDefinition(mtoken, element, position) {
      position = position !== void 0 ? position : mtoken.matches.length;
      let prevMatch = mtoken.matches[position - 1];
      if (regexMask) {
        if (element.indexOf("[") === 0 || escaped && /\\d|\\s|\\w|\\p/i.test(element) || element === ".") {
          let flag = opts.casing ? "i" : "";
          if (/\\p\{.*}/i.test(element)) flag += "u";
          mtoken.matches.splice(position++, 0, {
            fn: new RegExp(element, flag),
            static: false,
            optionality: false,
            newBlockMarker: prevMatch === void 0 ? "master" : prevMatch.def !== element,
            casing: null,
            def: element,
            placeholder: typeof opts.placeholder === "object" ? opts.placeholder[currentToken.matches.length] : void 0,
            nativeDef: element
          });
        } else {
          if (escaped) element = element[element.length - 1];
          element.split("").forEach(function(lmnt, ndx) {
            prevMatch = mtoken.matches[position - 1];
            mtoken.matches.splice(position++, 0, {
              fn: /[a-z]/i.test(opts.staticDefinitionSymbol || lmnt) ? new RegExp(
                "[" + (opts.staticDefinitionSymbol || lmnt) + "]",
                opts.casing ? "i" : ""
              ) : null,
              static: true,
              optionality: false,
              newBlockMarker: prevMatch === void 0 ? "master" : prevMatch.def !== lmnt && prevMatch.static !== true,
              casing: null,
              def: opts.staticDefinitionSymbol || lmnt,
              placeholder: opts.staticDefinitionSymbol !== void 0 ? lmnt : typeof opts.placeholder === "object" ? opts.placeholder[currentToken.matches.length] : void 0,
              nativeDef: (escaped ? "'" : "") + lmnt
            });
          });
        }
        escaped = false;
      } else {
        const maskdef = opts.definitions && opts.definitions[element] || opts.usePrototypeDefinitions && inputmask_default.prototype.definitions[element];
        if (maskdef && !escaped) {
          mtoken.matches.splice(position++, 0, {
            fn: maskdef.validator ? typeof maskdef.validator === "string" ? new RegExp(maskdef.validator, opts.casing ? "i" : "") : new function() {
              this.test = maskdef.validator;
            }() : /./,
            static: maskdef.static || false,
            optionality: maskdef.optional || false,
            defOptionality: maskdef.optional || false,
            // indicator for an optional from the definition
            newBlockMarker: prevMatch === void 0 || maskdef.optional ? "master" : prevMatch.def !== (maskdef.definitionSymbol || element),
            casing: maskdef.casing,
            def: maskdef.definitionSymbol || element,
            placeholder: maskdef.placeholder,
            nativeDef: element,
            generated: maskdef.generated
          });
        } else {
          mtoken.matches.splice(position++, 0, {
            fn: /[a-z]/i.test(opts.staticDefinitionSymbol || element) ? new RegExp(
              "[" + (opts.staticDefinitionSymbol || element) + "]",
              opts.casing ? "i" : ""
            ) : null,
            static: true,
            optionality: false,
            newBlockMarker: prevMatch === void 0 ? "master" : prevMatch.def !== element && prevMatch.static !== true,
            casing: null,
            def: opts.staticDefinitionSymbol || element,
            placeholder: opts.staticDefinitionSymbol !== void 0 ? element : void 0,
            nativeDef: (escaped ? "'" : "") + element
          });
          escaped = false;
        }
      }
    }
    function verifyGroupMarker(maskToken) {
      if (maskToken && maskToken.matches) {
        maskToken.matches.forEach(function(token, ndx) {
          const nextToken = maskToken.matches[ndx + 1];
          if ((nextToken === void 0 || nextToken.matches === void 0 || nextToken.isQuantifier === false) && token && token.isGroup) {
            token.isGroup = false;
            if (!regexMask) {
              insertTestDefinition(token, opts.groupmarker[0], 0);
              if (token.openGroup !== true) {
                insertTestDefinition(token, opts.groupmarker[1]);
              }
            }
          }
          verifyGroupMarker(token);
        });
      }
    }
    function defaultCase() {
      if (openenings.length > 0) {
        currentOpeningToken = openenings[openenings.length - 1];
        insertTestDefinition(currentOpeningToken, m2);
        if (currentOpeningToken.isAlternator) {
          alternator = openenings.pop();
          for (let mndx = 0; mndx < alternator.matches.length; mndx++) {
            if (alternator.matches[mndx].isGroup)
              alternator.matches[mndx].isGroup = false;
          }
          if (openenings.length > 0) {
            currentOpeningToken = openenings[openenings.length - 1];
            currentOpeningToken.matches.push(alternator);
          } else {
            currentToken.matches.push(alternator);
          }
        }
      } else {
        insertTestDefinition(currentToken, m2);
      }
    }
    function reverseTokens(maskToken) {
      function reverseStatic(st) {
        if (st === opts.optionalmarker[0]) {
          st = opts.optionalmarker[1];
        } else if (st === opts.optionalmarker[1]) {
          st = opts.optionalmarker[0];
        } else if (st === opts.groupmarker[0]) {
          st = opts.groupmarker[1];
        } else if (st === opts.groupmarker[1]) st = opts.groupmarker[0];
        return st;
      }
      maskToken.matches = maskToken.matches.reverse();
      for (const match2 in maskToken.matches) {
        if (Object.prototype.hasOwnProperty.call(maskToken.matches, match2)) {
          const intMatch = parseInt(match2);
          if (maskToken.matches[match2].isQuantifier && maskToken.matches[intMatch + 1] && maskToken.matches[intMatch + 1].isGroup) {
            const qt = maskToken.matches[match2];
            maskToken.matches.splice(match2, 1);
            maskToken.matches.splice(intMatch + 1, 0, qt);
          }
          if (maskToken.matches[match2].matches !== void 0) {
            maskToken.matches[match2] = reverseTokens(maskToken.matches[match2]);
          } else {
            maskToken.matches[match2] = reverseStatic(maskToken.matches[match2]);
          }
        }
      }
      return maskToken;
    }
    function groupify(matches2) {
      const groupToken = new masktoken_default(true);
      groupToken.openGroup = false;
      groupToken.matches = matches2;
      return groupToken;
    }
    function closeGroup() {
      openingToken = openenings.pop();
      openingToken.openGroup = false;
      if (openingToken !== void 0) {
        if (openenings.length > 0) {
          currentOpeningToken = openenings[openenings.length - 1];
          currentOpeningToken.matches.push(openingToken);
          if (currentOpeningToken.isAlternator) {
            alternator = openenings.pop();
            for (let mndx = 0; mndx < alternator.matches.length; mndx++) {
              alternator.matches[mndx].isGroup = false;
              alternator.matches[mndx].alternatorGroup = false;
            }
            if (openenings.length > 0) {
              currentOpeningToken = openenings[openenings.length - 1];
              currentOpeningToken.matches.push(alternator);
            } else {
              currentToken.matches.push(alternator);
            }
          }
        } else {
          currentToken.matches.push(openingToken);
        }
      } else {
        defaultCase();
      }
    }
    function groupQuantifier(matches2) {
      let lastMatch2 = matches2.pop();
      if (lastMatch2.isQuantifier) {
        lastMatch2 = groupify([matches2.pop(), lastMatch2]);
      }
      return lastMatch2;
    }
    if (regexMask) {
      opts.optionalmarker[0] = void 0;
      opts.optionalmarker[1] = void 0;
    }
    while (match = regexMask ? regexTokenizer.exec(mask2) : tokenizer.exec(mask2)) {
      m2 = match[0];
      if (regexMask) {
        switch (m2.charAt(0)) {
          case "?":
            m2 = "{0,1}";
            break;
          case "+":
          case "*":
            m2 = "{" + m2 + "}";
            break;
          case "|":
            if (openenings.length === 0) {
              const altRegexGroup = groupify(currentToken.matches);
              altRegexGroup.openGroup = true;
              openenings.push(altRegexGroup);
              currentToken.matches = [];
              closeRegexGroup = true;
            }
            break;
        }
        switch (m2) {
          case "\\d":
            m2 = "[0-9]";
            break;
          case "\\p":
            m2 += regexTokenizer.exec(mask2)[0];
            m2 += regexTokenizer.exec(mask2)[0];
            break;
          case "(?:":
          case "(?=":
          case "(?!":
          case "(?<=":
          case "(?<!":
            break;
        }
      }
      if (escaped) {
        defaultCase();
        continue;
      }
      switch (m2.charAt(0)) {
        case "$":
        case "^":
          if (!regexMask) {
            defaultCase();
          }
          break;
        case opts.escapeChar:
          escaped = true;
          if (regexMask) defaultCase();
          break;
        case opts.optionalmarker[1]:
        case opts.groupmarker[1]:
          closeGroup();
          break;
        case opts.optionalmarker[0]:
          openenings.push(new masktoken_default(false, true));
          break;
        case opts.groupmarker[0]:
          openenings.push(new masktoken_default(true));
          break;
        case opts.quantifiermarker[0]:
          var quantifier = new masktoken_default(false, false, true);
          m2 = m2.replace(/[{}?]/g, "");
          var mqj = m2.split("|"), mq = mqj[0].split(","), mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]), mq1 = mq.length === 1 ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]), mqJit = isNaN(mqj[1]) ? mqj[1] : parseInt(mqj[1]);
          if (mq0 === "*" || mq0 === "+") {
            mq0 = mq1 === "*" ? 0 : 1;
          }
          quantifier.quantifier = {
            min: mq0,
            max: mq1,
            jit: mqJit
          };
          var matches = openenings.length > 0 ? openenings[openenings.length - 1].matches : currentToken.matches;
          match = matches.pop();
          if (!match.isGroup) {
            match = groupify([match]);
          }
          matches.push(match);
          matches.push(quantifier);
          break;
        case opts.alternatormarker:
          if (openenings.length > 0) {
            currentOpeningToken = openenings[openenings.length - 1];
            const subToken = currentOpeningToken.matches[currentOpeningToken.matches.length - 1];
            if (currentOpeningToken.openGroup && // regexp alt syntax
            (subToken.matches === void 0 || subToken.isGroup === false && subToken.isAlternator === false)) {
              lastMatch = openenings.pop();
            } else {
              lastMatch = groupQuantifier(currentOpeningToken.matches);
            }
          } else {
            lastMatch = groupQuantifier(currentToken.matches);
          }
          if (lastMatch.isAlternator) {
            openenings.push(lastMatch);
          } else {
            if (lastMatch.alternatorGroup) {
              alternator = openenings.pop();
              lastMatch.alternatorGroup = false;
            } else {
              alternator = new masktoken_default(false, false, false, true);
            }
            alternator.matches.push(lastMatch);
            openenings.push(alternator);
            if (lastMatch.openGroup) {
              lastMatch.openGroup = false;
              const alternatorGroup = new masktoken_default(true);
              alternatorGroup.alternatorGroup = true;
              openenings.push(alternatorGroup);
            }
          }
          break;
        default:
          defaultCase();
      }
    }
    if (closeRegexGroup) closeGroup();
    while (openenings.length > 0) {
      openingToken = openenings.pop();
      currentToken.matches.push(openingToken);
    }
    if (currentToken.matches.length > 0) {
      verifyGroupMarker(currentToken);
      maskTokens.push(currentToken);
    }
    if (opts.numericInput || opts.isRTL) {
      reverseTokens(maskTokens[0]);
    }
    return maskTokens;
  }

  // node_modules/inputmask/lib/inputmask.js
  var document4 = window_default.document;
  var dataKey = "_inputmask_opts";
  function Inputmask(alias, options, internal) {
    if (!(this instanceof Inputmask)) {
      return new Inputmask(alias, options, internal);
    }
    this.dependencyLib = inputmask_dependencyLib_default;
    this.el = void 0;
    this.events = {};
    this.maskset = void 0;
    if (internal !== true) {
      if (Object.prototype.toString.call(alias) === "[object Object]") {
        options = alias;
      } else {
        options = options || {};
        if (alias) options.alias = alias;
      }
      this.opts = inputmask_dependencyLib_default.extend(true, {}, this.defaults, options);
      this.noMasksCache = options && options.definitions !== void 0;
      this.userOptions = options || {};
      resolveAlias(this.opts.alias, options, this.opts);
    }
    this.refreshValue = false;
    this.undoValue = void 0;
    this.$el = void 0;
    this.skipInputEvent = false;
    this.validationEvent = false;
    this.ignorable = false;
    this.maxLength;
    this.mouseEnter = false;
    this.clicked = 0;
    this.originalPlaceholder = void 0;
    this.isComposing = false;
    this.hasAlternator = false;
  }
  Inputmask.prototype = {
    dataAttribute: "data-inputmask",
    // data attribute prefix used for attribute binding
    // options default
    defaults: defaults_default,
    definitions: definitions_default,
    aliases: {},
    // aliases definitions
    masksCache: {},
    i18n: {},
    get isRTL() {
      return this.opts.isRTL || this.opts.numericInput;
    },
    mask: function(elems) {
      const that = this;
      if (typeof elems === "string") {
        elems = document4.getElementById(elems) || document4.querySelectorAll(elems);
      }
      elems = elems.nodeName ? [elems] : Array.isArray(elems) ? elems : [].slice.call(elems);
      elems.forEach(function(el, ndx) {
        const scopedOpts = inputmask_dependencyLib_default.extend(true, {}, that.opts);
        if (importAttributeOptions(
          el,
          scopedOpts,
          inputmask_dependencyLib_default.extend(true, {}, that.userOptions),
          that.dataAttribute
        )) {
          const maskset = generateMaskSet(scopedOpts, that.noMasksCache);
          if (maskset !== void 0) {
            if (el.inputmask !== void 0) {
              el.inputmask.opts.autoUnmask = true;
              el.inputmask.remove();
            }
            el.inputmask = new Inputmask(void 0, void 0, true);
            el.inputmask.opts = scopedOpts;
            el.inputmask.noMasksCache = that.noMasksCache;
            el.inputmask.userOptions = inputmask_dependencyLib_default.extend(true, {}, that.userOptions);
            el.inputmask.el = el;
            el.inputmask.$el = inputmask_dependencyLib_default(el);
            el.inputmask.maskset = maskset;
            inputmask_dependencyLib_default.data(el, dataKey, that.userOptions);
            mask.call(el.inputmask);
          }
        }
      });
      return elems && elems[0] ? elems[0].inputmask || this : this;
    },
    option: function(options, noremask) {
      if (typeof options === "string") {
        return this.opts[options];
      } else if (typeof options === "object") {
        inputmask_dependencyLib_default.extend(this.userOptions, options);
        if (this.el && noremask !== true) {
          this.mask(this.el);
        }
        return this;
      }
    },
    unmaskedvalue: function(value) {
      this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
      if (this.el === void 0 || value !== void 0) {
        const valueBuffer = (typeof this.opts.onBeforeMask === "function" ? this.opts.onBeforeMask.call(this, value, this.opts) || value : value).split("");
        checkVal.call(this, void 0, false, false, valueBuffer);
        if (typeof this.opts.onBeforeWrite === "function")
          this.opts.onBeforeWrite.call(
            this,
            void 0,
            getBuffer.call(this),
            0,
            this.opts
          );
      }
      return unmaskedvalue.call(this, this.el);
    },
    remove: function() {
      if (this.el) {
        inputmask_dependencyLib_default.data(this.el, dataKey, null);
        const cv = this.opts.autoUnmask ? unmaskedvalue(this.el) : this._valueGet(this.opts.autoUnmask);
        if (cv !== getBufferTemplate.call(this).join(""))
          this._valueSet(cv, this.opts.autoUnmask);
        else this._valueSet("");
        EventRuler.off(this.el);
        let valueProperty;
        if (Object.getOwnPropertyDescriptor && Object.getPrototypeOf) {
          valueProperty = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(this.el),
            "value"
          );
          if (valueProperty) {
            if (this.__valueGet) {
              Object.defineProperty(this.el, "value", {
                get: this.__valueGet,
                set: this.__valueSet,
                configurable: true
              });
            }
          }
        } else if (document4.__lookupGetter__ && this.el.__lookupGetter__("value")) {
          if (this.__valueGet) {
            this.el.__defineGetter__("value", this.__valueGet);
            this.el.__defineSetter__("value", this.__valueSet);
          }
        }
        this.el.inputmask = void 0;
      }
      return this.el;
    },
    getemptymask: function() {
      this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
      return (this.isRTL ? getBufferTemplate.call(this).reverse() : getBufferTemplate.call(this)).join("");
    },
    hasMaskedValue: function() {
      return !this.opts.autoUnmask;
    },
    isComplete: function() {
      this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
      return isComplete.call(this, getBuffer.call(this));
    },
    getmetadata: function() {
      this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
      if (Array.isArray(this.maskset.metadata)) {
        let maskTarget = getMaskTemplate.call(this, true, 0, false).join("");
        this.maskset.metadata.forEach(function(mtdt) {
          if (mtdt.mask === maskTarget) {
            maskTarget = mtdt;
            return false;
          }
          return true;
        });
        return maskTarget;
      }
      return this.maskset.metadata;
    },
    isValid: function(value) {
      this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
      if (value) {
        const valueBuffer = (typeof this.opts.onBeforeMask === "function" ? this.opts.onBeforeMask.call(this, value, this.opts) || value : value).split("");
        checkVal.call(this, void 0, true, false, valueBuffer);
      } else {
        value = this.isRTL ? getBuffer.call(this).slice().reverse().join("") : getBuffer.call(this).join("");
      }
      let buffer = getBuffer.call(this), rl = determineLastRequiredPosition.call(this), lmib = buffer.length - 1;
      for (; lmib > rl; lmib--) {
        if (isMask.call(this, lmib)) break;
      }
      buffer.splice(rl, lmib + 1 - rl);
      return isComplete.call(this, buffer) && value === (this.isRTL ? getBuffer.call(this).slice().reverse().join("") : getBuffer.call(this).join(""));
    },
    format: function(value, metadata) {
      this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
      const valueBuffer = (typeof this.opts.onBeforeMask === "function" ? this.opts.onBeforeMask.call(this, value, this.opts) || value : value).split("");
      checkVal.call(this, void 0, true, false, valueBuffer);
      const formattedValue = this.isRTL ? getBuffer.call(this).slice().reverse().join("") : getBuffer.call(this).join("");
      return metadata ? {
        value: formattedValue,
        metadata: this.getmetadata()
      } : formattedValue;
    },
    setValue: function(value) {
      if (this.el) {
        inputmask_dependencyLib_default(this.el).trigger("setvalue", [value]);
      }
    },
    analyseMask
  };
  function resolveAlias(aliasStr, options, opts) {
    const aliasDefinition = Inputmask.prototype.aliases[aliasStr];
    if (aliasDefinition) {
      if (aliasDefinition.alias)
        resolveAlias(aliasDefinition.alias, void 0, opts);
      inputmask_dependencyLib_default.extend(true, opts, aliasDefinition);
      inputmask_dependencyLib_default.extend(true, opts, options);
      return true;
    } else if (opts.mask === null) {
      opts.mask = aliasStr;
    }
    return false;
  }
  function importAttributeOptions(npt, opts, userOptions, dataAttribute) {
    function importOption(option, optionData) {
      const attrOption = dataAttribute === "" ? option : dataAttribute + "-" + option;
      optionData = optionData !== void 0 ? optionData : npt.getAttribute(attrOption);
      if (optionData !== null) {
        if (typeof optionData === "string") {
          if (option.indexOf("on") === 0) {
            optionData = window_default[optionData];
          } else if (optionData === "false") {
            optionData = false;
          } else if (optionData === "true") optionData = true;
        }
        userOptions[option] = optionData;
      }
    }
    if (opts.importDataAttributes === true) {
      let attrOptions = npt.getAttribute(dataAttribute), option, dataoptions, optionData, p;
      if (attrOptions && attrOptions !== "") {
        attrOptions = attrOptions.replace(/'/g, '"');
        dataoptions = JSON.parse("{" + attrOptions + "}");
      }
      if (dataoptions) {
        optionData = void 0;
        for (p in dataoptions) {
          if (p.toLowerCase() === "alias") {
            optionData = dataoptions[p];
            break;
          }
        }
      }
      importOption("alias", optionData);
      if (userOptions.alias) {
        resolveAlias(userOptions.alias, userOptions, opts);
      }
      for (option in opts) {
        if (dataoptions) {
          optionData = void 0;
          for (p in dataoptions) {
            if (p.toLowerCase() === option.toLowerCase()) {
              optionData = dataoptions[p];
              break;
            }
          }
        }
        importOption(option, optionData);
      }
    }
    inputmask_dependencyLib_default.extend(true, opts, userOptions);
    if (npt.dir === "rtl" || opts.rightAlign) {
      npt.style.textAlign = "right";
    }
    if (npt.dir === "rtl" || opts.numericInput) {
      npt.dir = "ltr";
      npt.removeAttribute("dir");
      opts.isRTL = true;
    }
    return Object.keys(userOptions).length;
  }
  Inputmask.extendDefaults = function(options) {
    inputmask_dependencyLib_default.extend(true, Inputmask.prototype.defaults, options);
  };
  Inputmask.extendDefinitions = function(definition) {
    inputmask_dependencyLib_default.extend(true, Inputmask.prototype.definitions, definition);
  };
  Inputmask.extendAliases = function(alias) {
    inputmask_dependencyLib_default.extend(true, Inputmask.prototype.aliases, alias);
  };
  Inputmask.format = function(value, options, metadata) {
    return Inputmask(options).format(value, metadata);
  };
  Inputmask.unmask = function(value, options) {
    return Inputmask(options).unmaskedvalue(value);
  };
  Inputmask.isValid = function(value, options) {
    return Inputmask(options).isValid(value);
  };
  Inputmask.remove = function(elems) {
    if (typeof elems === "string") {
      elems = document4.getElementById(elems) || document4.querySelectorAll(elems);
    }
    elems = elems.nodeName ? [elems] : elems;
    elems.forEach(function(el) {
      if (el.inputmask) el.inputmask.remove();
    });
  };
  Inputmask.setValue = function(elems, value) {
    if (typeof elems === "string") {
      elems = document4.getElementById(elems) || document4.querySelectorAll(elems);
    }
    elems = elems.nodeName ? [elems] : elems;
    elems.forEach(function(el) {
      if (el.inputmask) el.inputmask.setValue(value);
      else inputmask_dependencyLib_default(el).trigger("setvalue", [value]);
    });
  };
  Inputmask.dependencyLib = inputmask_dependencyLib_default;
  window_default.Inputmask = Inputmask;
  var inputmask_default = Inputmask;

  // node_modules/inputmask/lib/extensions/inputmask.extensions.js
  inputmask_default.extendDefinitions({
    A: {
      validator: "[A-Za-z\u0410-\u044F\u0401\u0451\xC0-\xFF\xB5]",
      casing: "upper"
      // auto uppercasing
    },
    "&": {
      // alfanumeric uppercasing
      validator: "[0-9A-Za-z\u0410-\u044F\u0401\u0451\xC0-\xFF\xB5]",
      casing: "upper"
    },
    "#": {
      // hexadecimal
      validator: "[0-9A-Fa-f]",
      casing: "upper"
    }
  });
  var ipValidatorRegex = /25[0-5]|2[0-4][0-9]|[01][0-9][0-9]/;
  function ipValidator(chrs, maskset, pos, strict, opts) {
    if (pos - 1 > -1 && maskset.buffer[pos - 1] !== ".") {
      chrs = maskset.buffer[pos - 1] + chrs;
      if (pos - 2 > -1 && maskset.buffer[pos - 2] !== ".") {
        chrs = maskset.buffer[pos - 2] + chrs;
      } else chrs = "0" + chrs;
    } else chrs = "00" + chrs;
    if (opts.greedy && parseInt(chrs) > 255 && ipValidatorRegex.test("00" + chrs.charAt(2))) {
      const buffer = [...maskset.buffer.slice(0, pos), ".", chrs.charAt(2)];
      if (buffer.join("").match(/\./g).length < 4) {
        return {
          refreshFromBuffer: true,
          buffer,
          caret: pos + 2
        };
      }
    }
    return ipValidatorRegex.test(chrs);
  }
  inputmask_default.extendAliases({
    cssunit: {
      regex: "[+-]?[0-9]+\\.?([0-9]+)?(px|em|rem|ex|%|in|cm|mm|pt|pc)"
    },
    url: {
      // needs update => https://en.wikipedia.org/wiki/URL
      regex: "(https?|ftp)://.*",
      autoUnmask: false,
      keepStatic: false,
      tabThrough: true
    },
    ip: {
      // ip-address mask
      mask: "i{1,3}.j{1,3}.k{1,3}.l{1,3}",
      definitions: {
        i: {
          validator: ipValidator
        },
        j: {
          validator: ipValidator
        },
        k: {
          validator: ipValidator
        },
        l: {
          validator: ipValidator
        }
      },
      onUnMask: function(maskedValue, unmaskedValue, opts) {
        return maskedValue;
      },
      inputmode: "decimal",
      substitutes: { ",": "." }
    },
    email: {
      // https://en.wikipedia.org/wiki/Domain_name#Domain_name_space
      // https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
      // should be extended with the toplevel domains at the end
      mask: function({ separator, quantifier }) {
        let emailMask = "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]", mask2 = emailMask;
        if (separator) {
          for (let i = 0; i < quantifier; i++) {
            mask2 += `[${separator}${emailMask}]`;
          }
        }
        return mask2;
      },
      greedy: false,
      casing: "lower",
      separator: null,
      quantifier: 5,
      skipOptionalPartCharacter: "",
      onBeforePaste: function(pastedValue, opts) {
        pastedValue = pastedValue.toLowerCase();
        return pastedValue.replace("mailto:", "");
      },
      definitions: {
        "*": {
          validator: "[0-9\uFF11-\uFF19A-Za-z\u0410-\u044F\u0401\u0451\xC0-\xFF\xB5!#$%&'*+/=?^_`{|}~-]"
        },
        "-": {
          validator: "[0-9A-Za-z-]"
        }
      },
      onUnMask: function(maskedValue, unmaskedValue, opts) {
        return maskedValue;
      },
      inputmode: "email"
    },
    mac: {
      mask: "##:##:##:##:##:##"
    },
    // https://en.wikipedia.org/wiki/Vehicle_identification_number
    // see issue #1199
    vin: {
      mask: "V{13}9{4}",
      definitions: {
        V: {
          validator: "[A-HJ-NPR-Za-hj-npr-z\\d]",
          casing: "upper"
        }
      },
      clearIncomplete: true,
      autoUnmask: true
    },
    // http://rion.io/2013/09/10/validating-social-security-numbers-through-regular-expressions-2/
    // https://en.wikipedia.org/wiki/Social_Security_number
    ssn: {
      mask: "999-99-9999",
      postValidation: function(buffer, pos, c, currentResult, opts, maskset, strict) {
        const bffr = getMaskTemplate.call(
          this,
          true,
          getLastValidPosition.call(this),
          true,
          true
        );
        return /^(?!219-09-9999|078-05-1120)(?!666|000|9.{2}).{3}-(?!00).{2}-(?!0{4}).{4}$/.test(
          bffr.join("")
        );
      }
    }
  });

  // node_modules/inputmask/lib/extensions/inputmask.date.i18n.js
  var $ = inputmask_default.dependencyLib;
  $.extend(true, inputmask_default.prototype.i18n, {
    dayNames: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    monthNames: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    ordinalSuffix: ["st", "nd", "rd", "th"]
  });

  // node_modules/inputmask/lib/extensions/inputmask.date.extensions.js
  var $2 = inputmask_default.dependencyLib;
  var DateObject = class {
    constructor(mask2, format, opts, inputmask) {
      this.mask = mask2;
      this.format = format;
      this.opts = opts;
      this.inputmask = inputmask;
      this._date = new Date(1, 0, 1);
      this.initDateObject(mask2, this.opts, this.inputmask);
    }
    get date() {
      if (this._date === void 0) {
        this._date = new Date(1, 0, 1);
        this.initDateObject(void 0, this.opts, this.inputmask);
      }
      return this._date;
    }
    initDateObject(mask2, opts, inputmask) {
      let match;
      getTokenizer(opts).lastIndex = 0;
      while (match = getTokenizer(opts).exec(this.format)) {
        let dynMatches = /\d+$/.exec(match[0]), fcode = dynMatches ? match[0][0] + "x" : match[0], value;
        if (mask2 !== void 0) {
          if (dynMatches) {
            const lastIndex = getTokenizer(opts).lastIndex, tokenMatch = getTokenMatch.call(
              inputmask,
              match.index,
              opts,
              inputmask && inputmask.maskset
            );
            getTokenizer(opts).lastIndex = lastIndex;
            value = mask2.slice(0, mask2.indexOf(tokenMatch.nextMatch[0]));
          } else {
            let targetSymbol = match[0][0], ndx = match.index;
            while (inputmask && (opts.placeholder[getTest.call(inputmask, ndx).match.placeholder] || getTest.call(inputmask, ndx).match.placeholder) === targetSymbol) {
              ndx++;
            }
            const targetMatchLength = ndx - match.index;
            value = mask2.slice(
              0,
              targetMatchLength || formatCode[fcode] && formatCode[fcode][4] || fcode.length
            );
          }
          mask2 = mask2.slice(value.length);
        }
        if (Object.prototype.hasOwnProperty.call(formatCode, fcode)) {
          this.setValue(
            this,
            value,
            fcode,
            formatCode[fcode][2],
            formatCode[fcode][1]
          );
        }
      }
    }
    setValue(dateObj, value, fcode, targetProp, dateOperation) {
      if (value !== void 0) {
        switch (targetProp) {
          case "ampm":
            dateObj[targetProp] = value;
            dateObj["raw" + targetProp] = value.replace(/\s/g, "_");
            break;
          case "month":
            if (fcode === "mmm" || fcode === "mmmm") {
              fcode === "mmm" ? dateObj[targetProp] = pad(
                i18n.monthNames.slice(0, 12).findIndex(
                  (item) => value.toLowerCase() === item.toLowerCase()
                ) + 1,
                2
              ) : dateObj[targetProp] = pad(
                i18n.monthNames.slice(12, 24).findIndex(
                  (item) => value.toLowerCase() === item.toLowerCase()
                ) + 1,
                2
              );
              dateObj[targetProp] = dateObj[targetProp] === "00" ? "" : dateObj[targetProp].toString();
              dateObj["raw" + targetProp] = dateObj[targetProp];
              break;
            }
          default:
            dateObj[targetProp] = value.replace(/[^0-9]/g, "0");
            dateObj["raw" + targetProp] = value.replace(/\s/g, "_");
        }
      }
      if (dateOperation !== void 0) {
        let datavalue = dateObj[targetProp];
        if (targetProp === "day" && parseInt(datavalue) === 29 || targetProp === "month" && parseInt(datavalue) === 2) {
          if (parseInt(dateObj.day) === 29 && parseInt(dateObj.month) === 2 && (dateObj.year === "" || dateObj.year === void 0)) {
            dateObj._date.setFullYear(2012, 1, 29);
          }
        }
        if (targetProp === "day") {
          useDateObject = true;
          if (parseInt(datavalue) === 0) datavalue = 1;
        }
        if (targetProp === "month") useDateObject = true;
        if (targetProp === "year") {
          useDateObject = true;
          if (datavalue.length < formatCode[fcode][4])
            datavalue = pad(datavalue, formatCode[fcode][4], true);
        }
        if (datavalue !== "" && !isNaN(datavalue) || targetProp === "ampm")
          dateOperation.call(dateObj._date, datavalue);
      }
    }
    reset() {
      this._date = new Date(1, 0, 1);
    }
    reInit() {
      this._date = void 0;
      this.date;
    }
  };
  var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  var i18n = inputmask_default.prototype.i18n;
  var useDateObject = false;
  var formatCode = {
    // regex, valueSetter, type, displayformatter, #entries (optional)
    d: [
      "[1-9]|[12][0-9]|3[01]",
      Date.prototype.setDate,
      "day",
      Date.prototype.getDate
    ],
    // Day of the month as digits; no leading zero for single-digit days.
    dd: [
      "0[1-9]|[12][0-9]|3[01]",
      Date.prototype.setDate,
      "day",
      function() {
        return pad(Date.prototype.getDate.call(this), 2);
      }
    ],
    // Day of the month as digits; leading zero for single-digit days.
    ddd: [""],
    // Day of the week as a three-letter abbreviation.
    dddd: [""],
    // Day of the week as its full name.
    m: [
      "[1-9]|1[012]",
      function(val) {
        let mval = val ? parseInt(val) : 0;
        if (mval > 0) mval--;
        return Date.prototype.setMonth.call(this, mval);
      },
      "month",
      function() {
        return Date.prototype.getMonth.call(this) + 1;
      }
    ],
    // Month as digits; no leading zero for single-digit months.
    mm: [
      "0[1-9]|1[012]",
      function(val) {
        let mval = val ? parseInt(val) : 0;
        if (mval > 0) mval--;
        return Date.prototype.setMonth.call(this, mval);
      },
      "month",
      function() {
        return pad(Date.prototype.getMonth.call(this) + 1, 2);
      }
    ],
    // Month as digits; leading zero for single-digit months.
    mmm: [
      i18n.monthNames.slice(0, 12).join("|"),
      function(val) {
        const mval = i18n.monthNames.slice(0, 12).findIndex((item) => val.toLowerCase() === item.toLowerCase());
        return mval !== -1 ? Date.prototype.setMonth.call(this, mval) : false;
      },
      "month",
      function() {
        return i18n.monthNames.slice(0, 12)[Date.prototype.getMonth.call(this)];
      }
    ],
    // Month as a three-letter abbreviation.
    mmmm: [
      i18n.monthNames.slice(12, 24).join("|"),
      function(val) {
        const mval = i18n.monthNames.slice(12, 24).findIndex((item) => val.toLowerCase() === item.toLowerCase());
        return mval !== -1 ? Date.prototype.setMonth.call(this, mval) : false;
      },
      "month",
      function() {
        return i18n.monthNames.slice(12, 24)[Date.prototype.getMonth.call(this)];
      }
    ],
    // Month as its full name.
    yy: [
      "[0-9]{2}",
      function(val) {
        const centuryPart = (/* @__PURE__ */ new Date()).getFullYear().toString().slice(0, 2);
        Date.prototype.setFullYear.call(this, `${centuryPart}${val}`);
      },
      "year",
      function() {
        return pad(Date.prototype.getFullYear.call(this), 2);
      },
      2
    ],
    // Year as last two digits; leading zero for years less than 10.
    yyyy: [
      "[0-9]{4}",
      Date.prototype.setFullYear,
      "year",
      function() {
        return pad(Date.prototype.getFullYear.call(this), 4);
      },
      4
    ],
    h: [
      "[1-9]|1[0-2]",
      Date.prototype.setHours,
      "hours",
      Date.prototype.getHours
    ],
    // Hours; no leading zero for single-digit hours (12-hour clock).
    hh: [
      "0[1-9]|1[0-2]",
      Date.prototype.setHours,
      "hours",
      function() {
        return pad(Date.prototype.getHours.call(this), 2);
      }
    ],
    // Hours; leading zero for single-digit hours (12-hour clock).
    hx: [
      function(x) {
        return `[0-9]{${x}}`;
      },
      Date.prototype.setHours,
      "hours",
      function(x) {
        return Date.prototype.getHours;
      }
    ],
    // Hours; no limit; set maximum digits
    H: [
      "1?[0-9]|2[0-3]",
      Date.prototype.setHours,
      "hours",
      Date.prototype.getHours
    ],
    // Hours; no leading zero for single-digit hours (24-hour clock).
    HH: [
      "0[0-9]|1[0-9]|2[0-3]",
      Date.prototype.setHours,
      "hours",
      function() {
        return pad(Date.prototype.getHours.call(this), 2);
      }
    ],
    // Hours; leading zero for single-digit hours (24-hour clock).
    Hx: [
      function(x) {
        return `[0-9]{${x}}`;
      },
      Date.prototype.setHours,
      "hours",
      function(x) {
        return function() {
          return pad(Date.prototype.getHours.call(this), x);
        };
      }
    ],
    // Hours; no limit; set maximum digits
    M: [
      "[1-5]?[0-9]",
      Date.prototype.setMinutes,
      "minutes",
      Date.prototype.getMinutes
    ],
    // Minutes; no leading zero for single-digit minutes. Uppercase M unlike CF timeFormat's m to avoid conflict with months.
    MM: [
      "0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]",
      Date.prototype.setMinutes,
      "minutes",
      function() {
        return pad(Date.prototype.getMinutes.call(this), 2);
      }
    ],
    // Minutes; leading zero for single-digit minutes. Uppercase MM unlike CF timeFormat's mm to avoid conflict with months.
    s: [
      "[1-5]?[0-9]",
      Date.prototype.setSeconds,
      "seconds",
      Date.prototype.getSeconds
    ],
    // Seconds; no leading zero for single-digit seconds.
    ss: [
      "0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]",
      Date.prototype.setSeconds,
      "seconds",
      function() {
        return pad(Date.prototype.getSeconds.call(this), 2);
      }
    ],
    // Seconds; leading zero for single-digit seconds.
    l: [
      "[0-9]{3}",
      Date.prototype.setMilliseconds,
      "milliseconds",
      function() {
        return pad(Date.prototype.getMilliseconds.call(this), 3);
      },
      3
    ],
    // Milliseconds. 3 digits.
    L: [
      "[0-9]{2}",
      Date.prototype.setMilliseconds,
      "milliseconds",
      function() {
        return pad(Date.prototype.getMilliseconds.call(this), 2);
      },
      2
    ],
    // Milliseconds. 2 digits.
    t: ["[ap]", setAMPM, "ampm", getAMPM, 1],
    // Lowercase, single-character time marker string: a or p.
    tt: ["[ap]m", setAMPM, "ampm", getAMPM, 2],
    // two-character time marker string: am or pm.
    T: ["[AP]", setAMPM, "ampm", getAMPM, 1],
    // single-character time marker string: A or P.
    TT: ["[AP]M", setAMPM, "ampm", getAMPM, 2],
    // two-character time marker string: AM or PM.
    Z: [".*", void 0, "Z", getTimeZoneAbbreviated],
    // US timezone abbreviation, e.g. EST or MDT. With non-US timezones or in the Opera browser, the GMT/UTC offset is returned, e.g. GMT-0500
    o: [""],
    // GMT/UTC timezone offset, e.g. -0500 or +0230.
    S: [""]
    // The date's ordinal suffix (st, nd, rd, or th).
  };
  var formatAlias = {
    isoDate: "yyyy-mm-dd",
    // 2007-06-09
    isoTime: "HH:MM:ss",
    // 17:46:21
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    // 2007-06-09T17:46:21
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    // 2007-06-09T22:46:21Z
  };
  function setAMPM(value) {
    const hours = this.getHours();
    if (value.toLowerCase().includes("p")) {
      this.setHours(hours + 12);
    } else if (value.toLowerCase().includes("a") && hours >= 12) {
      this.setHours(hours - 12);
    }
  }
  function getAMPM() {
    let date = this, hours = date.getHours();
    hours = hours || 12;
    return hours >= 12 ? "PM" : "AM";
  }
  function getTimeZoneAbbreviated() {
    let date = this, { 1: tz } = date.toString().match(/\((.+)\)/);
    if (tz.includes(" ")) {
      tz = tz.replace("-", " ").toUpperCase();
      tz = tz.split(" ").map(([first]) => first).join("");
    }
    return tz;
  }
  function formatcode(match) {
    const dynMatches = /\d+$/.exec(match[0]);
    if (dynMatches && dynMatches[0] !== void 0) {
      const fcode = formatCode[match[0][0] + "x"].slice("");
      fcode[0] = fcode[0](dynMatches[0]);
      fcode[3] = fcode[3](dynMatches[0]);
      return fcode;
    } else if (formatCode[match[0]]) {
      return formatCode[match[0]];
    }
  }
  function getTokenizer(opts) {
    if (!opts.tokenizer) {
      const tokens = [], dyntokens = [];
      for (const ndx in formatCode) {
        if (/\.*x$/.test(ndx)) {
          const dynToken = ndx[0] + "\\d+";
          if (dyntokens.indexOf(dynToken) === -1) {
            dyntokens.push(dynToken);
          }
        } else if (tokens.indexOf(ndx[0]) === -1) {
          tokens.push(ndx[0]);
        }
      }
      opts.tokenizer = "(" + (dyntokens.length > 0 ? dyntokens.join("|") + "|" : "") + tokens.join("+|") + ")+?|.";
      opts.tokenizer = new RegExp(opts.tokenizer, "g");
    }
    return opts.tokenizer;
  }
  function prefillYear(dateParts, currentResult, opts) {
    if (dateParts.year !== dateParts.rawyear) {
      const crrntyear = currentYear.toString(), enteredPart = dateParts.rawyear.replace(/[^0-9]/g, ""), currentYearPart = crrntyear.slice(0, enteredPart.length), currentYearNextPart = crrntyear.slice(enteredPart.length);
      if (enteredPart.length === 2 && enteredPart === currentYearPart) {
        const entryCurrentYear = new Date(
          currentYear,
          dateParts.month - 1,
          dateParts.day
        );
        if (dateParts.day == entryCurrentYear.getDate() && (!opts.max || opts.max.date.getTime() >= entryCurrentYear.getTime())) {
          dateParts.date.setFullYear(currentYear);
          dateParts.year = crrntyear;
          currentResult.insert = [
            {
              pos: currentResult.pos + 1,
              c: currentYearNextPart[0]
            },
            {
              pos: currentResult.pos + 2,
              c: currentYearNextPart[1]
            }
          ];
        }
      }
    }
    return currentResult;
  }
  function isValidDate(dateParts, currentResult, opts) {
    const inputmask = this;
    if (!useDateObject) return true;
    if (dateParts.rawday === void 0 || !isFinite(dateParts.rawday) && new Date(
      dateParts.date.getFullYear(),
      isFinite(dateParts.rawmonth) ? dateParts.month : dateParts.date.getMonth() + 1,
      0
    ).getDate() >= dateParts.day || dateParts.day == "29" && (!isFinite(dateParts.rawyear) || dateParts.rawyear === void 0 || dateParts.rawyear === "") || new Date(
      dateParts.date.getFullYear(),
      isFinite(dateParts.rawmonth) ? dateParts.month : dateParts.date.getMonth() + 1,
      0
    ).getDate() >= dateParts.day) {
      return currentResult;
    } else {
      if (dateParts.day == "29") {
        const tokenMatch = getTokenMatch.call(
          inputmask,
          currentResult.pos,
          opts,
          inputmask.maskset
        );
        if (tokenMatch.targetMatch && tokenMatch.targetMatch[0] === "yyyy" && currentResult.pos - tokenMatch.targetMatchIndex === 2) {
          currentResult.remove = currentResult.pos + 1;
          return currentResult;
        }
      } else if (dateParts.date.getMonth() == 2 && dateParts.day == "30" && currentResult.c !== void 0) {
        dateParts.day = "03";
        dateParts.date.setDate(3);
        dateParts.date.setMonth(1);
        currentResult.insert = [
          { pos: currentResult.pos, c: "0" },
          { pos: currentResult.pos + 1, c: currentResult.c }
        ];
        currentResult.caret = seekNext.call(this, currentResult.pos + 1);
        return currentResult;
      }
      return false;
    }
  }
  function isDateInRange(dateParts, result, opts, maskset, fromCheckval) {
    if (!result) return result;
    if (result && opts.min) {
      if (
        /* useDateObject && (dateParts["year"] === undefined || dateParts["yearSet"]) && */
        !isNaN(
          opts.min.date.getTime()
        )
      ) {
        let match;
        dateParts.reset();
        getTokenizer(opts).lastIndex = 0;
        while (match = getTokenizer(opts).exec(opts.inputFormat)) {
          var fcode;
          if (fcode = formatcode(match)) {
            if (fcode[3]) {
              let setFn = fcode[1], current = dateParts[fcode[2]], minVal = opts.min[fcode[2]], maxVal = opts.max ? opts.max[fcode[2]] : minVal + 1, curVal = [], forceCurrentValue = false;
              for (let i = 0; i < minVal.length; i++) {
                if (maskset.validPositions[i + match.index] === void 0 && !forceCurrentValue) {
                  if (i + match.index == 0 && current[i] < minVal[i]) {
                    curVal[i] = current[i];
                    forceCurrentValue = true;
                  } else {
                    curVal[i] = minVal[i];
                  }
                  if (fcode[2] === "year" && current.length - 1 == i && minVal != maxVal)
                    curVal = (parseInt(curVal.join("")) + 1).toString().split("");
                  if (fcode[2] === "ampm" && minVal != maxVal && opts.min.date.getTime() > dateParts.date.getTime())
                    curVal[i] = maxVal[i];
                } else {
                  curVal[i] = current[i];
                  forceCurrentValue = forceCurrentValue || current[i] > minVal[i];
                }
              }
              setFn.call(dateParts._date, curVal.join(""));
            }
          }
        }
        result = opts.min.date.getTime() <= dateParts.date.getTime();
        dateParts.reInit();
      }
    }
    if (result && opts.max) {
      if (!isNaN(opts.max.date.getTime())) {
        result = opts.max.date.getTime() >= dateParts.date.getTime();
      }
    }
    return result;
  }
  function parse(format, dateObjValue, opts, raw) {
    let mask2 = "", match, fcode, ndx = 0, placeHolder = {};
    getTokenizer(opts).lastIndex = 0;
    while (match = getTokenizer(opts).exec(format)) {
      if (dateObjValue === void 0) {
        if (fcode = formatcode(match)) {
          mask2 += "(" + fcode[0] + ")";
          if (opts.placeholder && opts.placeholder !== "") {
            placeHolder[ndx] = opts.placeholder[match.index % opts.placeholder.length];
            placeHolder[opts.placeholder[match.index % opts.placeholder.length]] = match[0].charAt(0);
          } else {
            placeHolder[ndx] = match[0].charAt(0);
          }
        } else {
          switch (match[0]) {
            case "[":
              mask2 += "(";
              break;
            case "]":
              mask2 += ")?";
              break;
            default:
              mask2 += escapeRegex_default(match[0]);
              placeHolder[ndx] = match[0].charAt(0);
          }
        }
      } else {
        if (fcode = formatcode(match)) {
          if (raw !== true && fcode[3]) {
            const getFn = fcode[3];
            mask2 += getFn.call(dateObjValue.date);
          } else if (fcode[2]) {
            mask2 += dateObjValue["raw" + fcode[2]];
          } else {
            mask2 += match[0];
          }
        } else {
          mask2 += match[0];
        }
      }
      ndx++;
    }
    if (dateObjValue === void 0) {
      opts.placeholder = placeHolder;
    }
    return mask2;
  }
  function pad(val, len, right) {
    val = String(val);
    len = len || 2;
    while (val.length < len) val = right ? val + "0" : "0" + val;
    return val;
  }
  function analyseMask2(mask2, format, opts) {
    const inputmask = this;
    if (typeof mask2 === "string") {
      return new DateObject(mask2, format, opts, inputmask);
    } else if (mask2 && typeof mask2 === "object" && Object.prototype.hasOwnProperty.call(mask2, "date")) {
      return mask2;
    }
    return void 0;
  }
  function importDate(dateObj, opts) {
    return parse(opts.inputFormat, { date: dateObj }, opts);
  }
  function getTokenMatch(pos, opts, maskset) {
    let inputmask = this, masksetHint = maskset && maskset.tests[pos] ? opts.placeholder[maskset.tests[pos][0].match.placeholder] || maskset.tests[pos][0].match.placeholder : "", calcPos = 0, targetMatch, match, matchLength = 0;
    getTokenizer(opts).lastIndex = 0;
    while (match = getTokenizer(opts).exec(opts.inputFormat)) {
      const dynMatches = /\d+$/.exec(match[0]);
      if (dynMatches) {
        matchLength = parseInt(dynMatches[0]);
      } else {
        let targetSymbol = match[0][0], ndx = calcPos;
        while (inputmask && (opts.placeholder[getTest.call(inputmask, ndx).match.placeholder] || getTest.call(inputmask, ndx).match.placeholder) === targetSymbol) {
          ndx++;
        }
        matchLength = ndx - calcPos;
        if (matchLength === 0) matchLength = match[0].length;
      }
      calcPos += matchLength;
      if (match[0].indexOf(masksetHint) != -1 || calcPos >= pos + 1) {
        targetMatch = match;
        match = getTokenizer(opts).exec(opts.inputFormat);
        break;
      }
    }
    return {
      targetMatchIndex: calcPos - matchLength,
      nextMatch: match,
      targetMatch
    };
  }
  inputmask_default.extendAliases({
    datetime: {
      mask: function(opts) {
        opts.numericInput = false;
        formatCode.S = i18n.ordinalSuffix.join("|");
        opts.inputFormat = formatAlias[opts.inputFormat] || opts.inputFormat;
        opts.displayFormat = formatAlias[opts.displayFormat] || opts.displayFormat || opts.inputFormat;
        opts.outputFormat = formatAlias[opts.outputFormat] || opts.outputFormat || opts.inputFormat;
        opts.regex = parse(opts.inputFormat, void 0, opts);
        opts.min = analyseMask2(opts.min, opts.inputFormat, opts);
        opts.max = analyseMask2(opts.max, opts.inputFormat, opts);
        return null;
      },
      placeholder: "",
      // set default as none (~ auto); when a custom placeholder is passed it will be used
      inputFormat: "isoDateTime",
      // format used to input the date
      displayFormat: null,
      // visual format when the input looses focus
      outputFormat: null,
      // unmasking format
      min: null,
      // needs to be in the same format as the inputfornat
      max: null,
      // needs to be in the same format as the inputfornat,
      skipOptionalPartCharacter: "",
      preValidation: function(buffer, pos, c, isSelection2, opts, maskset, caretPos, strict) {
        const inputmask = this;
        if (strict) return true;
        if (isNaN(c) && buffer[pos] !== c) {
          const tokenMatch = getTokenMatch.call(inputmask, pos, opts, maskset);
          if (tokenMatch.nextMatch && tokenMatch.nextMatch[0] === c && tokenMatch.targetMatch[0].length > 1) {
            const validator = formatcode(tokenMatch.targetMatch)[0];
            if (new RegExp(validator).test("0" + buffer[pos - 1])) {
              buffer[pos] = buffer[pos - 1];
              buffer[pos - 1] = "0";
              return {
                fuzzy: true,
                buffer,
                refreshFromBuffer: { start: pos - 1, end: pos + 1 },
                pos: pos + 1
              };
            }
          }
        }
        return true;
      },
      postValidation: function(buffer, pos, c, currentResult, opts, maskset, strict, fromCheckval) {
        const inputmask = this;
        if (strict) return true;
        let tokenMatch, validator;
        if (currentResult === false) {
          tokenMatch = getTokenMatch.call(inputmask, pos + 1, opts, maskset);
          if (tokenMatch.targetMatch && tokenMatch.targetMatchIndex === pos && tokenMatch.targetMatch[0].length > 1 && formatCode[tokenMatch.targetMatch[0]] !== void 0) {
            validator = formatcode(tokenMatch.targetMatch)[0];
          } else {
            tokenMatch = getTokenMatch.call(inputmask, pos + 2, opts, maskset);
            if (tokenMatch.targetMatch && tokenMatch.targetMatchIndex === pos + 1 && tokenMatch.targetMatch[0].length > 1 && formatCode[tokenMatch.targetMatch[0]] !== void 0) {
              validator = formatcode(tokenMatch.targetMatch)[0];
            }
          }
          if (validator !== void 0) {
            if (maskset.validPositions[pos + 1] !== void 0 && new RegExp(validator).test(c + "0")) {
              buffer[pos] = c;
              buffer[pos + 1] = "0";
              currentResult = {
                // insert: [{pos: pos, c: "0"}, {pos: pos + 1, c: c}],
                pos: pos + 2,
                // this will triggeer a refreshfrombuffer
                caret: pos
              };
            } else if (new RegExp(validator).test("0" + c)) {
              buffer[pos] = "0";
              buffer[pos + 1] = c;
              currentResult = {
                // insert: [{pos: pos, c: "0"}, {pos: pos + 1, c: c}],
                pos: pos + 2
                // this will triggeer a refreshfrombuffer
              };
            }
          }
          if (currentResult === false) return currentResult;
        }
        if (currentResult.fuzzy) {
          buffer = currentResult.buffer;
          pos = currentResult.pos;
        }
        tokenMatch = getTokenMatch.call(inputmask, pos, opts, maskset);
        if (tokenMatch.targetMatch && tokenMatch.targetMatch[0] && formatCode[tokenMatch.targetMatch[0]] !== void 0) {
          const fcode = formatcode(tokenMatch.targetMatch);
          validator = fcode[0];
          const part = buffer.slice(
            tokenMatch.targetMatchIndex,
            tokenMatch.targetMatchIndex + tokenMatch.targetMatch[0].length
          );
          if (new RegExp(validator).test(part.join("")) === false && tokenMatch.targetMatch[0].length === 2 && maskset.validPositions[tokenMatch.targetMatchIndex] && maskset.validPositions[tokenMatch.targetMatchIndex + 1]) {
            maskset.validPositions[tokenMatch.targetMatchIndex + 1].input = "0";
          }
          if (fcode[2] == "year") {
            const _buffer = getMaskTemplate.call(
              inputmask,
              false,
              1,
              void 0,
              true
            );
            for (let i = pos + 1; i < buffer.length; i++) {
              buffer[i] = _buffer[i];
              maskset.validPositions.splice(pos + 1, 1);
            }
          }
        }
        let result = currentResult, dateParts = analyseMask2.call(
          inputmask,
          buffer.join(""),
          opts.inputFormat,
          opts
        );
        if (result && !isNaN(dateParts.date.getTime())) {
          if (opts.prefillYear) result = prefillYear(dateParts, result, opts);
          result = isValidDate.call(inputmask, dateParts, result, opts);
          result = isDateInRange(dateParts, result, opts, maskset, fromCheckval);
        }
        if (pos !== void 0 && result && currentResult.pos !== pos) {
          return {
            buffer: parse(opts.inputFormat, dateParts, opts).split(""),
            refreshFromBuffer: { start: pos, end: currentResult.pos },
            pos: currentResult.caret || currentResult.pos
            // correct caret position
          };
        }
        return result;
      },
      onKeyDown: function(e, buffer, caretPos, opts) {
        const input = this;
        if (e.ctrlKey && e.key === keys.ArrowRight) {
          input.inputmask._valueSet(importDate(/* @__PURE__ */ new Date(), opts));
          $2(input).trigger("setvalue");
        }
      },
      onUnMask: function(maskedValue, unmaskedValue, opts) {
        const inputmask = this;
        return unmaskedValue ? parse(
          opts.outputFormat,
          analyseMask2.call(inputmask, maskedValue, opts.inputFormat, opts),
          opts,
          true
        ) : unmaskedValue;
      },
      casing: function(elem, test, pos, validPositions) {
        if (test.nativeDef.indexOf("[ap]") == 0) return elem.toLowerCase();
        if (test.nativeDef.indexOf("[AP]") == 0) return elem.toUpperCase();
        const posBefore = getTest.call(this, [pos - 1]);
        if (posBefore.match.def.indexOf("[AP]") == 0) return elem.toUpperCase();
        if (pos === 0 || posBefore && posBefore.input === String.fromCharCode(keyCode.Space) || posBefore && posBefore.match.def === String.fromCharCode(keyCode.Space)) {
          return elem.toUpperCase();
        }
        return elem.toLowerCase();
      },
      onBeforeMask: function(initialValue, opts) {
        if (Object.prototype.toString.call(initialValue) === "[object Date]") {
          initialValue = importDate(initialValue, opts);
        }
        return initialValue;
      },
      insertMode: false,
      insertModeVisual: false,
      shiftPositions: false,
      keepStatic: false,
      inputmode: "numeric",
      prefillYear: true
      // Allows to disable prefill for datetime year.
    }
  });

  // node_modules/inputmask/lib/extensions/inputmask.numeric.extensions.js
  var $3 = inputmask_default.dependencyLib;
  function autoEscape(txt, opts) {
    let escapedTxt = "";
    for (let i = 0; i < txt.length; i++) {
      if (inputmask_default.prototype.definitions[txt.charAt(i)] || opts.definitions[txt.charAt(i)] || opts.optionalmarker[0] === txt.charAt(i) || opts.optionalmarker[1] === txt.charAt(i) || opts.quantifiermarker[0] === txt.charAt(i) || opts.quantifiermarker[1] === txt.charAt(i) || opts.groupmarker[0] === txt.charAt(i) || opts.groupmarker[1] === txt.charAt(i) || opts.alternatormarker === txt.charAt(i)) {
        escapedTxt += "\\" + txt.charAt(i);
      } else {
        escapedTxt += txt.charAt(i);
      }
    }
    return escapedTxt;
  }
  function alignDigits(buffer, digits, opts, force) {
    if (buffer.length > 0 && digits > 0 && (!opts.digitsOptional || force)) {
      var radixPosition = buffer.indexOf(opts.radixPoint), negationBack = false;
      if (opts.negationSymbol.back === buffer[buffer.length - 1]) {
        negationBack = true;
        buffer.length--;
      }
      if (radixPosition === -1) {
        buffer.push(opts.radixPoint);
        radixPosition = buffer.length - 1;
      }
      for (let i = 1; i <= digits; i++) {
        if (!isFinite(buffer[radixPosition + i])) {
          buffer[radixPosition + i] = "0";
        }
      }
    }
    if (negationBack) buffer.push(opts.negationSymbol.back);
    return buffer;
  }
  function findValidator(symbol, maskset) {
    let posNdx = 0;
    if (symbol === "+") {
      posNdx = seekNext.call(this, maskset.validPositions.length - 1);
    }
    for (let tstNdx in maskset.tests) {
      tstNdx = parseInt(tstNdx);
      if (tstNdx >= posNdx) {
        for (let ndx = 0, ndxl = maskset.tests[tstNdx].length; ndx < ndxl; ndx++) {
          if ((maskset.validPositions[tstNdx] === void 0 || symbol === "-") && maskset.tests[tstNdx][ndx].match.def === symbol) {
            return tstNdx + (maskset.validPositions[tstNdx] !== void 0 && symbol !== "-" ? 1 : 0);
          }
        }
      }
    }
    return posNdx;
  }
  function findValid(symbol, maskset) {
    let ret = -1;
    for (let ndx = 0, vpl = maskset.validPositions.length; ndx < vpl; ndx++) {
      const tst = maskset.validPositions[ndx];
      if (tst && tst.match.def === symbol) {
        ret = ndx;
        break;
      }
    }
    return ret;
  }
  function parseMinMaxOptions(opts) {
    if (opts.parseMinMaxOptions === void 0) {
      if (opts.min !== null) {
        opts.min = opts.min.toString().replace(new RegExp(escapeRegex_default(opts.groupSeparator), "g"), "");
        if (opts.radixPoint === ",")
          opts.min = opts.min.replace(opts.radixPoint, ".");
        opts.min = isFinite(opts.min) ? parseFloat(opts.min) : NaN;
        if (isNaN(opts.min)) opts.min = Number.MIN_VALUE;
      }
      if (opts.max !== null) {
        opts.max = opts.max.toString().replace(new RegExp(escapeRegex_default(opts.groupSeparator), "g"), "");
        if (opts.radixPoint === ",")
          opts.max = opts.max.replace(opts.radixPoint, ".");
        opts.max = isFinite(opts.max) ? parseFloat(opts.max) : NaN;
        if (isNaN(opts.max)) opts.max = Number.MAX_VALUE;
      }
      opts.parseMinMaxOptions = "done";
    }
  }
  function genMask(opts) {
    opts.repeat = 0;
    if (opts.groupSeparator === opts.radixPoint && opts.digits && opts.digits !== "0") {
      if (opts.radixPoint === ".") {
        opts.groupSeparator = ",";
      } else if (opts.radixPoint === ",") {
        opts.groupSeparator = ".";
      } else {
        opts.groupSeparator = "";
      }
    }
    if (opts.groupSeparator === " ") {
      opts.skipOptionalPartCharacter = void 0;
    }
    if (opts.placeholder.length > 1) {
      opts.placeholder = opts.placeholder.charAt(0);
    }
    if (opts.positionCaretOnClick === "radixFocus" && opts.placeholder === "") {
      opts.positionCaretOnClick = "lvp";
    }
    let decimalDef = "0", radixPointDef = opts.radixPoint;
    if (opts.numericInput === true && opts.__financeInput === void 0) {
      decimalDef = "1";
      opts.positionCaretOnClick = opts.positionCaretOnClick === "radixFocus" ? "lvp" : opts.positionCaretOnClick;
      opts.digitsOptional = false;
      if (isNaN(opts.digits)) opts.digits = 2;
      opts._radixDance = false;
      radixPointDef = opts.radixPoint === "," ? "?" : "!";
      if (opts.radixPoint !== "" && opts.definitions[radixPointDef] === void 0) {
        opts.definitions[radixPointDef] = {};
        opts.definitions[radixPointDef].validator = "[" + opts.radixPoint + "]";
        opts.definitions[radixPointDef].placeholder = opts.radixPoint;
        opts.definitions[radixPointDef].static = true;
        opts.definitions[radixPointDef].generated = true;
      }
    } else {
      opts.__financeInput = false;
      opts.numericInput = true;
    }
    let mask2 = "[+]", altMask;
    mask2 += autoEscape(opts.prefix, opts);
    if (opts.groupSeparator !== "") {
      if (opts.definitions[opts.groupSeparator] === void 0) {
        opts.definitions[opts.groupSeparator] = {};
        opts.definitions[opts.groupSeparator].validator = "[" + opts.groupSeparator + "]";
        opts.definitions[opts.groupSeparator].placeholder = opts.groupSeparator;
        opts.definitions[opts.groupSeparator].static = true;
        opts.definitions[opts.groupSeparator].generated = true;
      }
      mask2 += opts._mask(opts);
    } else {
      mask2 += "9{+}";
    }
    if (opts.digits !== void 0 && opts.digits !== 0) {
      const dq = opts.digits.toString().split(",");
      if (isFinite(dq[0]) && dq[1] && isFinite(dq[1])) {
        mask2 += radixPointDef + decimalDef + "{" + opts.digits + "}";
      } else if (isNaN(opts.digits) || parseInt(opts.digits) > 0) {
        if (opts.digitsOptional || opts.jitMasking) {
          altMask = mask2 + radixPointDef + decimalDef + "{0," + opts.digits + "}";
          opts.keepStatic = true;
        } else {
          mask2 += radixPointDef + decimalDef + "{" + opts.digits + "}";
        }
      }
    } else {
      opts.inputmode = "numeric";
    }
    mask2 += autoEscape(opts.suffix, opts);
    mask2 += "[-]";
    if (altMask) {
      mask2 = [altMask + autoEscape(opts.suffix, opts) + "[-]", mask2];
    }
    opts.greedy = false;
    parseMinMaxOptions(opts);
    if (opts.radixPoint !== "" && opts.substituteRadixPoint)
      opts.substitutes[opts.radixPoint == "." ? "," : "."] = opts.radixPoint;
    return mask2;
  }
  function hanndleRadixDance(pos, c, radixPos, maskset, opts) {
    if (opts._radixDance && opts.numericInput && c !== opts.negationSymbol.back) {
      if (pos <= radixPos && (radixPos > 0 || c == opts.radixPoint) && (maskset.validPositions[pos - 1] === void 0 || maskset.validPositions[pos - 1].input !== opts.negationSymbol.back)) {
        pos -= 1;
      }
    }
    return pos;
  }
  function decimalValidator(chrs, maskset, pos, strict, opts) {
    const radixPos = maskset.buffer ? maskset.buffer.indexOf(opts.radixPoint) : -1, result = (radixPos !== -1 || strict && opts.jitMasking) && new RegExp(opts.definitions["9"].validator).test(chrs);
    if (!strict && opts._radixDance && radixPos !== -1 && result && maskset.validPositions[radixPos] == void 0) {
      return {
        insert: {
          pos: radixPos === pos ? radixPos + 1 : radixPos,
          c: opts.radixPoint
        },
        pos
      };
    }
    return result;
  }
  function checkForLeadingZeroes(buffer, opts) {
    let numberMatches = new RegExp(
      "(^" + (opts.negationSymbol.front !== "" ? escapeRegex_default(opts.negationSymbol.front) + "?" : "") + escapeRegex_default(opts.prefix) + ")(.*)(" + escapeRegex_default(opts.suffix) + (opts.negationSymbol.back != "" ? escapeRegex_default(opts.negationSymbol.back) + "?" : "") + "$)"
    ).exec(buffer.slice().reverse().join("")), number = numberMatches ? numberMatches[2] : "", leadingzeroes = false;
    if (number) {
      number = number.split(opts.radixPoint.charAt(0))[0];
      leadingzeroes = new RegExp("^[0" + opts.groupSeparator + "]*").exec(number);
    }
    return leadingzeroes && (leadingzeroes[0].length > 1 || leadingzeroes[0].length > 0 && leadingzeroes[0].length < number.length) ? leadingzeroes : false;
  }
  inputmask_default.extendAliases({
    numeric: {
      mask: genMask,
      _mask: function(opts) {
        return "(" + opts.groupSeparator + "999){+|1}";
      },
      digits: "*",
      // number of fractionalDigits
      digitsOptional: true,
      enforceDigitsOnBlur: false,
      radixPoint: ".",
      positionCaretOnClick: "radixFocus",
      _radixDance: true,
      groupSeparator: "",
      allowMinus: true,
      negationSymbol: {
        front: "-",
        // "("
        back: ""
        // ")"
      },
      prefix: "",
      suffix: "",
      min: null,
      // minimum value
      max: null,
      // maximum value
      SetMaxOnOverflow: false,
      step: 1,
      inputType: "text",
      // number ~ specify that values which are set are in textform (radix point  is same as in the options) or in numberform (radixpoint = .)
      unmaskAsNumber: false,
      roundingFN: Math.round,
      // Math.floor ,  fn(x)
      inputmode: "decimal",
      shortcuts: { k: "1000", m: "1000000" },
      // global options
      placeholder: "0",
      greedy: false,
      rightAlign: true,
      insertMode: true,
      autoUnmask: false,
      skipOptionalPartCharacter: "",
      usePrototypeDefinitions: false,
      stripLeadingZeroes: true,
      substituteRadixPoint: true,
      definitions: {
        0: {
          validator: decimalValidator
        },
        1: {
          validator: decimalValidator,
          definitionSymbol: "9"
        },
        9: {
          // \uFF11-\uFF19 #1606
          validator: "[0-9\uFF10-\uFF19\u0660-\u0669\u06F0-\u06F9]",
          definitionSymbol: "*"
        },
        "+": {
          validator: function(chrs, maskset, pos, strict, opts) {
            return opts.allowMinus && (chrs === "-" || chrs === opts.negationSymbol.front);
          }
        },
        "-": {
          validator: function(chrs, maskset, pos, strict, opts) {
            return opts.allowMinus && chrs === opts.negationSymbol.back;
          }
        }
      },
      preValidation: function(buffer, pos, c, isSelection2, opts, maskset, caretPos, strict) {
        const inputmask = this;
        if (opts.__financeInput !== false && c === opts.radixPoint) return false;
        const radixPos = buffer.indexOf(opts.radixPoint), initPos = pos;
        pos = hanndleRadixDance(pos, c, radixPos, maskset, opts);
        if (c === "-" || c === opts.negationSymbol.front) {
          if (opts.allowMinus !== true) return false;
          let isNegative = false, front = findValid("+", maskset), back = findValid("-", maskset);
          if (front !== -1) {
            isNegative = [front];
            if (back !== -1) isNegative.push(back);
          }
          return isNegative !== false ? {
            remove: isNegative,
            caret: initPos - opts.negationSymbol.back.length
          } : {
            insert: [
              {
                pos: findValidator.call(inputmask, "+", maskset),
                c: opts.negationSymbol.front,
                fromIsValid: true
              },
              {
                pos: findValidator.call(inputmask, "-", maskset),
                c: opts.negationSymbol.back,
                fromIsValid: void 0
              }
            ],
            caret: initPos + opts.negationSymbol.back.length
          };
        }
        if (c === opts.groupSeparator) {
          return { caret: initPos };
        }
        if (strict) return true;
        if (radixPos !== -1 && opts._radixDance === true && isSelection2 === false && c === opts.radixPoint && opts.digits !== void 0 && (isNaN(opts.digits) || parseInt(opts.digits) > 0) && radixPos !== pos) {
          const radixValidatorPos = findValidator.call(
            inputmask,
            opts.radixPoint,
            maskset
          );
          if (maskset.validPositions[radixValidatorPos]) {
            maskset.validPositions[radixValidatorPos].generatedInput = maskset.validPositions[radixValidatorPos].generated || false;
          }
          return {
            caret: opts._radixDance && pos === radixPos - 1 ? radixPos + 1 : radixPos
          };
        }
        if (opts.__financeInput === false) {
          if (isSelection2) {
            if (opts.digitsOptional) {
              return { rewritePosition: caretPos.end };
            } else if (!opts.digitsOptional) {
              if (caretPos.begin > radixPos && caretPos.end <= radixPos) {
                if (c === opts.radixPoint) {
                  return {
                    insert: { pos: radixPos + 1, c: "0", fromIsValid: true },
                    rewritePosition: radixPos
                  };
                } else {
                  return { rewritePosition: radixPos + 1 };
                }
              } else if (caretPos.begin < radixPos) {
                return { rewritePosition: caretPos.begin - 1 };
              }
            }
          } else if (!opts.showMaskOnHover && !opts.showMaskOnFocus && !opts.digitsOptional && opts.digits > 0 && this.__valueGet.call(this.el) === "") {
            return { rewritePosition: radixPos };
          }
        }
        return { rewritePosition: pos };
      },
      postValidation: function(buffer, pos, c, currentResult, opts, maskset, strict) {
        if (currentResult === false) return currentResult;
        if (strict) return true;
        if (opts.min !== null || opts.max !== null) {
          const unmasked = opts.onUnMask(
            buffer.slice().reverse().join(""),
            void 0,
            $3.extend({}, opts, {
              unmaskAsNumber: true
            })
          );
          if (opts.min !== null && unmasked < opts.min && (unmasked.toString().length > opts.min.toString().length || unmasked < 0)) {
            return false;
          }
          if (opts.max !== null && unmasked > opts.max) {
            return opts.SetMaxOnOverflow ? {
              refreshFromBuffer: true,
              buffer: alignDigits(
                opts.max.toString().replace(".", opts.radixPoint).split(""),
                opts.digits,
                opts
              ).reverse()
            } : false;
          }
        }
        return currentResult;
      },
      onUnMask: function(maskedValue, unmaskedValue, opts) {
        if (unmaskedValue === "" && opts.nullable === true) {
          return unmaskedValue;
        }
        let processValue = maskedValue.replace(opts.prefix, "");
        processValue = processValue.replace(opts.suffix, "");
        processValue = processValue.replace(
          new RegExp(escapeRegex_default(opts.groupSeparator), "g"),
          ""
        );
        if (opts.placeholder.charAt(0) !== "") {
          processValue = processValue.replace(
            new RegExp(opts.placeholder.charAt(0), "g"),
            "0"
          );
        }
        if (opts.unmaskAsNumber) {
          if (opts.radixPoint !== "" && processValue.indexOf(opts.radixPoint) !== -1)
            processValue = processValue.replace(
              escapeRegex_default.call(this, opts.radixPoint),
              "."
            );
          processValue = processValue.replace(
            new RegExp("^" + escapeRegex_default(opts.negationSymbol.front)),
            "-"
          );
          processValue = processValue.replace(
            new RegExp(escapeRegex_default(opts.negationSymbol.back) + "$"),
            ""
          );
          return Number(processValue);
        }
        return processValue;
      },
      isComplete: function(buffer, opts) {
        let maskedValue = (opts.numericInput ? buffer.slice().reverse() : buffer).join("");
        maskedValue = maskedValue.replace(
          new RegExp("^" + escapeRegex_default(opts.negationSymbol.front)),
          "-"
        );
        maskedValue = maskedValue.replace(
          new RegExp(escapeRegex_default(opts.negationSymbol.back) + "$"),
          ""
        );
        maskedValue = maskedValue.replace(opts.prefix, "");
        maskedValue = maskedValue.replace(opts.suffix, "");
        maskedValue = maskedValue.replace(
          new RegExp(escapeRegex_default(opts.groupSeparator) + "([0-9]{3})", "g"),
          "$1"
        );
        if (opts.radixPoint === ",")
          maskedValue = maskedValue.replace(escapeRegex_default(opts.radixPoint), ".");
        return isFinite(maskedValue);
      },
      onBeforeMask: function(initialValue, opts) {
        initialValue = initialValue ?? "";
        const radixPoint = opts.radixPoint || ",";
        if (isFinite(opts.digits)) opts.digits = parseInt(opts.digits);
        if ((typeof initialValue === "number" || opts.inputType === "number") && radixPoint !== "") {
          initialValue = initialValue.toString().replace(".", radixPoint);
        }
        const isNegative = initialValue.charAt(0) === "-" || initialValue.charAt(0) === opts.negationSymbol.front, valueParts = initialValue.split(radixPoint), integerPart = valueParts[0].replace(/[^\-0-9]/g, ""), decimalPart = valueParts.length > 1 ? valueParts[1].replace(/[^0-9]/g, "") : "", forceDigits = valueParts.length > 1;
        initialValue = integerPart + (decimalPart !== "" ? radixPoint + decimalPart : decimalPart);
        let digits = 0;
        if (radixPoint !== "") {
          digits = !opts.digitsOptional ? opts.digits : opts.digits < decimalPart.length ? opts.digits : decimalPart.length;
          if (decimalPart !== "" || !opts.digitsOptional) {
            const digitsFactor = Math.pow(10, digits || 1);
            initialValue = initialValue.replace(escapeRegex_default(radixPoint), ".");
            if (!isNaN(parseFloat(initialValue))) {
              initialValue = (opts.roundingFN(parseFloat(initialValue) * digitsFactor) / digitsFactor).toFixed(digits);
            }
            initialValue = initialValue.toString().replace(".", radixPoint);
          }
        }
        if (opts.digits === 0 && initialValue.indexOf(radixPoint) !== -1) {
          initialValue = initialValue.substring(
            0,
            initialValue.indexOf(radixPoint)
          );
        }
        if (opts.min !== null || opts.max !== null) {
          const numberValue = initialValue.toString().replace(radixPoint, ".");
          if (opts.min !== null && numberValue < opts.min) {
            initialValue = opts.min.toString().replace(".", radixPoint);
          } else if (opts.max !== null && numberValue > opts.max) {
            initialValue = opts.max.toString().replace(".", radixPoint);
          }
        }
        if (isNegative && initialValue.charAt(0) !== "-") {
          initialValue = "-" + initialValue;
        }
        return alignDigits(
          initialValue.toString().split(""),
          digits,
          opts,
          forceDigits
        ).join("");
      },
      onBeforeWrite: function(e, buffer, caretPos, opts) {
        function stripBuffer(buffer2, stripRadix) {
          if (opts.__financeInput !== false || stripRadix) {
            var position = buffer2.indexOf(opts.radixPoint);
            if (position !== -1) {
              buffer2.splice(position, 1);
            }
          }
          if (opts.groupSeparator !== "") {
            while ((position = buffer2.indexOf(opts.groupSeparator)) !== -1) {
              buffer2.splice(position, 1);
            }
          }
          return buffer2;
        }
        let result, leadingzeroes;
        if (opts.stripLeadingZeroes && (leadingzeroes = checkForLeadingZeroes(buffer, opts))) {
          const caretNdx = buffer.join("").lastIndexOf(leadingzeroes[0].split("").reverse().join("")) - (leadingzeroes[0] == leadingzeroes.input ? 0 : 1), offset = leadingzeroes[0] == leadingzeroes.input ? 1 : 0;
          for (let i = leadingzeroes[0].length - offset; i > 0; i--) {
            this.maskset.validPositions.splice(caretNdx + i, 1);
            delete buffer[caretNdx + i];
          }
        }
        if (e) {
          switch (e.type) {
            case "blur":
            case "checkval":
              if (opts.min !== null) {
                const unmasked = opts.onUnMask(
                  buffer.slice().reverse().join(""),
                  void 0,
                  $3.extend({}, opts, {
                    unmaskAsNumber: true
                  })
                );
                if (opts.min !== null && unmasked < opts.min) {
                  return {
                    refreshFromBuffer: true,
                    buffer: alignDigits(
                      opts.min.toString().replace(".", opts.radixPoint).split(""),
                      opts.digits,
                      opts
                    ).reverse()
                  };
                }
              }
              if (buffer[buffer.length - 1] === opts.negationSymbol.front) {
                const nmbrMtchs = new RegExp(
                  "(^" + (opts.negationSymbol.front != "" ? escapeRegex_default(opts.negationSymbol.front) + "?" : "") + escapeRegex_default(opts.prefix) + ")(.*)(" + escapeRegex_default(opts.suffix) + (opts.negationSymbol.back != "" ? escapeRegex_default(opts.negationSymbol.back) + "?" : "") + "$)"
                ).exec(stripBuffer(buffer.slice(), true).reverse().join("")), number = nmbrMtchs ? nmbrMtchs[2] : "";
                if (number == 0) {
                  result = { refreshFromBuffer: true, buffer: [0] };
                }
              } else if (opts.radixPoint !== "") {
                const radixNDX = buffer.indexOf(opts.radixPoint);
                if (radixNDX === opts.suffix.length) {
                  if (result && result.buffer) {
                    result.buffer.splice(0, 1 + opts.suffix.length);
                  } else {
                    buffer.splice(0, 1 + opts.suffix.length);
                    result = {
                      refreshFromBuffer: true,
                      buffer: stripBuffer(buffer)
                    };
                  }
                }
              }
              if (opts.enforceDigitsOnBlur) {
                result = result || {};
                const bffr = result && result.buffer || buffer.slice().reverse();
                result.refreshFromBuffer = true;
                result.buffer = alignDigits(
                  bffr,
                  opts.digits,
                  opts,
                  true
                ).reverse();
              }
          }
        }
        return result;
      },
      onKeyDown: function(e, buffer, caretPos, opts) {
        let $input = $3(this), bffr;
        if (e.location != 3) {
          let pattern, c = e.key;
          if (pattern = opts.shortcuts && opts.shortcuts[c]) {
            if (pattern.length > 1) {
              this.inputmask.__valueSet.call(
                this,
                parseFloat(this.inputmask.unmaskedvalue()) * parseInt(pattern)
              );
              $input.trigger("setvalue");
              return false;
            }
          }
        }
        if (e.ctrlKey) {
          switch (e.key) {
            case keys.ArrowUp:
              this.inputmask.__valueSet.call(
                this,
                parseFloat(this.inputmask.unmaskedvalue()) + parseInt(opts.step)
              );
              $input.trigger("setvalue");
              return false;
            case keys.ArrowDown:
              this.inputmask.__valueSet.call(
                this,
                parseFloat(this.inputmask.unmaskedvalue()) - parseInt(opts.step)
              );
              $input.trigger("setvalue");
              return false;
          }
        }
        if (!e.shiftKey && (e.key === keys.Delete || e.key === keys.Backspace || e.key === keys.BACKSPACE_SAFARI) && caretPos.begin !== buffer.length) {
          if (buffer[e.key === keys.Delete ? caretPos.begin - 1 : caretPos.end] === opts.negationSymbol.front) {
            bffr = buffer.slice().reverse();
            if (opts.negationSymbol.front !== "") bffr.shift();
            if (opts.negationSymbol.back !== "") bffr.pop();
            $input.trigger("setvalue", [bffr.join(""), caretPos.begin]);
            return false;
          } else if (opts._radixDance === true) {
            const radixPos = buffer.indexOf(opts.radixPoint);
            if (!opts.digitsOptional) {
              if (radixPos !== -1 && (caretPos.begin < radixPos || caretPos.end < radixPos || e.key === keys.Delete && (caretPos.begin === radixPos || caretPos.begin - 1 === radixPos))) {
                let restoreCaretPos;
                if (caretPos.begin === caretPos.end) {
                  if (e.key === keys.Backspace || e.key === keys.BACKSPACE_SAFARI)
                    caretPos.begin++;
                  else if (e.key === keys.Delete && caretPos.begin - 1 === radixPos) {
                    restoreCaretPos = $3.extend({}, caretPos);
                    caretPos.begin--;
                    caretPos.end--;
                  }
                }
                bffr = buffer.slice().reverse();
                bffr.splice(
                  bffr.length - caretPos.begin,
                  caretPos.begin - caretPos.end + 1
                );
                bffr = alignDigits(bffr, opts.digits, opts).join("");
                if (restoreCaretPos) {
                  caretPos = restoreCaretPos;
                }
                $input.trigger("setvalue", [
                  bffr,
                  caretPos.begin >= bffr.length ? radixPos + 1 : caretPos.begin
                ]);
                return false;
              }
            } else if (radixPos === 0) {
              bffr = buffer.slice().reverse();
              bffr.pop();
              $input.trigger("setvalue", [
                bffr.join(""),
                caretPos.begin >= bffr.length ? bffr.length : caretPos.begin
              ]);
              return false;
            }
          }
        }
      }
    },
    currency: {
      prefix: "",
      // "$ ",
      groupSeparator: ",",
      alias: "numeric",
      digits: 2,
      digitsOptional: false
    },
    decimal: {
      alias: "numeric"
    },
    integer: {
      alias: "numeric",
      inputmode: "numeric",
      digits: 0
    },
    percentage: {
      alias: "numeric",
      min: 0,
      max: 100,
      suffix: " %",
      digits: 0,
      allowMinus: false
    },
    indianns: {
      // indian numbering system
      alias: "numeric",
      _mask: function(opts) {
        return "(" + opts.groupSeparator + "99){*|1}(" + opts.groupSeparator + "999){1|1}";
      },
      groupSeparator: ",",
      radixPoint: ".",
      placeholder: "0",
      digits: 2,
      digitsOptional: false
    }
  });

  // src/utils/isString.js
  var isString_default = (v) => {
    return typeof v == "string";
  };

  // src/utils/getGlobalFn.js
  var getGlobalFn_default = (fn) => fn.split(".").reduce((r, p) => r[p], window);

  // src/utils/replaceCallbacks.js
  var replaceCallbacks = (obj) => {
    if (isString_default(obj)) {
      obj = obj[0] == "{" ? JSON.parse(obj) : getGlobalFn_default(obj);
    }
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v == "object") {
        const fn = v["__fn"];
        if (isString_default(fn)) {
          obj[k] = getGlobalFn_default(fn);
        } else {
          replaceCallbacks(v);
        }
      }
    }
    return obj;
  };
  var replaceCallbacks_default = replaceCallbacks;

  // src/utils/simpleConfig.js
  var simpleConfig_default = (str) => {
    if (!str) {
      return {};
    }
    if (str[0] != "{" && str.includes(":")) {
      str = `{${str.replace(/([\w]*)\s*:\s*([\w"'\[\]]*)/g, (m2, p1, p2) => `"${p1}":${p2.replace(/'/g, '"')}`)}}`;
    }
    return str[0] == "{" ? JSON.parse(str) : getGlobalFn_default(str);
  };

  // src/utils/whenParsed.js
  var whenParsed = (el) => {
    let ref = el;
    do {
      if (ref.nextSibling) {
        el.parsedCallback();
        return;
      }
      ref = ref.parentNode;
    } while (ref);
    setTimeout(() => {
      el.parsedCallback();
    });
  };
  var whenParsed_default = whenParsed;

  // src/utils/FormidableElement.js
  var ID_KEY = "__fe_id";
  window[ID_KEY] = window[ID_KEY] || 0;
  var m = /* @__PURE__ */ new Map();
  var FormidableElement = class extends HTMLElement {
    constructor() {
      super();
      this.id = this.id || `fe-${window[ID_KEY]++}`;
      const o = m.get(this.id);
      if (o) {
        if (o != this.innerHTML) {
          this.innerHTML = o;
        }
      } else {
        m.set(this.id, this.innerHTML);
      }
    }
    /**
     * This can get called multiple times
     */
    connectedCallback() {
      if (this._t) {
        clearTimeout(this._t);
      }
      whenParsed_default(this);
    }
    disconnectedCallback() {
      this.disconnected();
      this._t = setTimeout(() => {
        this.destroyed();
        this.config = null;
        if (!document.getElementById(this.id)) {
          m.delete(this.id);
        }
      }, 1e3);
    }
    parsedCallback() {
      if (!this.config) {
        this.config = replaceCallbacks_default(simpleConfig_default(this.dataset.config));
        this.created();
      }
      this.connected();
    }
    /**
     * Called only once in component lifecycle
     * Config is parsed again just before created is called
     */
    created() {
    }
    /**
     * Called if the element is not reconnected quickly after being disconnected
     * Will set config to null
     */
    destroyed() {
    }
    /**
     * Called each time the component is connected (inserted)
     */
    connected() {
    }
    /**
     * Called each time the component is disconnected (removed or destroyed)
     */
    disconnected() {
    }
  };
  var FormidableElement_default = FormidableElement;

  // src/utils/insertAfter.js
  var insertAfter_default = (newNode, existingNode) => {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  };

  // src/utils/insertHiddenInput.js
  var insertHiddenInput_default = (input, v = void 0) => {
    let h = input.parentElement.querySelector('input[type="hidden"]');
    if (!h) {
      h = document.createElement("input");
      h.type = "hidden";
      h.value = input.value;
      insertAfter_default(h, input);
    }
    if (v !== void 0) {
      h.value = v;
    }
    input.name = input.dataset.originalName || input.name;
    h.name = input.name;
    input.dataset.originalName = input.name;
    input.name = `_${input.name}`;
    return h;
  };

  // src/classes/InputmaskElement.js
  var events = ["keyup", "blur"];
  function decimalmultiply(a, b) {
    return parseFloat((a * b).toFixed(12));
  }
  var InputmaskElement = class extends FormidableElement_default {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
      return this.querySelector("input");
    }
    get value() {
      if (this.hiddenInput) {
        return this.hiddenInput.value;
      }
      return this.el.value;
    }
    created() {
      const input = this.el;
      this.keepMask = !!this.dataset.keepMask;
      const isDecimal = !!this.dataset.decimal;
      if (isDecimal) {
        input.value = "" + decimalmultiply(input.value, 100);
      }
      if (this.config.radixPoint === ",") {
        input.value = input.value.replace(".", ",");
      }
      this.inputmask = new inputmask_default(this.config);
      this.inputmask.mask(input);
      if (!this.keepMask) {
        this.hiddenInput = insertHiddenInput_default(input);
        this.handleEvent();
      }
    }
    handleEvent = (ev = null) => {
      const input = this.el;
      const dataformat = this.dataset.dataformat;
      const isDecimal = !!this.dataset.decimal;
      let val = this.inputmask.unmaskedvalue(input.value);
      if (dataformat) {
        if (dataformat != "masked") {
          val = inputmask_default.format(val, {
            alias: dataformat
          });
        }
      }
      if (isDecimal) {
        val = "" + decimalmultiply(val, 0.01);
      }
      if (this.config.radixPoint === ",") {
        val = val.replace(",", ".");
      }
      if (["time", "datetime"].includes(this.inputmask.userOptions.alias)) {
        val = val.replace(/[a-zA-Z]/g, "0");
      }
      if (val == input.getAttribute("placeholder") || val == this.inputmask.getemptymask()) {
        val = "";
      }
      this.hiddenInput.value = val;
    };
    connected() {
      if (!this.keepMask) {
        const input = this.el;
        events.forEach((type) => {
          input.addEventListener(type, this);
        });
      }
    }
    disconnected() {
      if (!this.keepMask) {
        const input = this.el;
        events.forEach((type) => {
          input.removeEventListener(type, this);
        });
      }
    }
    destroyed() {
      inputmask_default.remove(this.el);
      this.inputmask = null;
      this.hiddenInput = null;
    }
  };
  var InputmaskElement_default = InputmaskElement;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/input-mask.js
  defineEl_default("input-mask", InputmaskElement_default);
  var input_mask_default = InputmaskElement_default;
})();
