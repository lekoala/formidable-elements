(() => {
  // node_modules/filepond/dist/filepond.esm.js
  var isNode = (value) => value instanceof HTMLElement;
  var createStore = (initialState, queries2 = [], actions2 = []) => {
    const state2 = {
      ...initialState
    };
    const actionQueue = [];
    const dispatchQueue = [];
    const getState = () => ({ ...state2 });
    const processActionQueue = () => {
      const queue = [...actionQueue];
      actionQueue.length = 0;
      return queue;
    };
    const processDispatchQueue = () => {
      const queue = [...dispatchQueue];
      dispatchQueue.length = 0;
      queue.forEach(({ type, data: data3 }) => {
        dispatch(type, data3);
      });
    };
    const dispatch = (type, data3, isBlocking) => {
      if (isBlocking && !document.hidden) {
        dispatchQueue.push({ type, data: data3 });
        return;
      }
      if (actionHandlers[type]) {
        actionHandlers[type](data3);
      }
      actionQueue.push({
        type,
        data: data3
      });
    };
    const query = (str, ...args) => queryHandles[str] ? queryHandles[str](...args) : null;
    const api = {
      getState,
      processActionQueue,
      processDispatchQueue,
      dispatch,
      query
    };
    let queryHandles = {};
    queries2.forEach((query2) => {
      queryHandles = {
        ...query2(state2),
        ...queryHandles
      };
    });
    let actionHandlers = {};
    actions2.forEach((action) => {
      actionHandlers = {
        ...action(dispatch, query, state2),
        ...actionHandlers
      };
    });
    return api;
  };
  var defineProperty = (obj, property, definition) => {
    if (typeof definition === "function") {
      obj[property] = definition;
      return;
    }
    Object.defineProperty(obj, property, { ...definition });
  };
  var forin = (obj, cb) => {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      cb(key, obj[key]);
    }
  };
  var createObject = (definition) => {
    const obj = {};
    forin(definition, (property) => {
      defineProperty(obj, property, definition[property]);
    });
    return obj;
  };
  var attr = (node, name2, value = null) => {
    if (value === null) {
      return node.getAttribute(name2) || node.hasAttribute(name2);
    }
    node.setAttribute(name2, value);
  };
  var ns = "http://www.w3.org/2000/svg";
  var svgElements = ["svg", "path"];
  var isSVGElement = (tag) => svgElements.includes(tag);
  var createElement = (tag, className, attributes = {}) => {
    if (typeof className === "object") {
      attributes = className;
      className = null;
    }
    const element = isSVGElement(tag) ? document.createElementNS(ns, tag) : document.createElement(tag);
    if (className) {
      if (isSVGElement(tag)) {
        attr(element, "class", className);
      } else {
        element.className = className;
      }
    }
    forin(attributes, (name2, value) => {
      attr(element, name2, value);
    });
    return element;
  };
  var appendChild = (parent) => (child, index) => {
    if (typeof index !== "undefined" && parent.children[index]) {
      parent.insertBefore(child, parent.children[index]);
    } else {
      parent.appendChild(child);
    }
  };
  var appendChildView = (parent, childViews) => (view, index) => {
    if (typeof index !== "undefined") {
      childViews.splice(index, 0, view);
    } else {
      childViews.push(view);
    }
    return view;
  };
  var removeChildView = (parent, childViews) => (view) => {
    childViews.splice(childViews.indexOf(view), 1);
    if (view.element.parentNode) {
      parent.removeChild(view.element);
    }
    return view;
  };
  var IS_BROWSER = (() => typeof window !== "undefined" && typeof window.document !== "undefined")();
  var isBrowser = () => IS_BROWSER;
  var testElement = isBrowser() ? createElement("svg") : {};
  var getChildCount = "children" in testElement ? (el) => el.children.length : (el) => el.childNodes.length;
  var getViewRect = (elementRect, childViews, offset, scale) => {
    const left = offset[0] || elementRect.left;
    const top = offset[1] || elementRect.top;
    const right = left + elementRect.width;
    const bottom = top + elementRect.height * (scale[1] || 1);
    const rect = {
      // the rectangle of the element itself
      element: {
        ...elementRect
      },
      // the rectangle of the element expanded to contain its children, does not include any margins
      inner: {
        left: elementRect.left,
        top: elementRect.top,
        right: elementRect.right,
        bottom: elementRect.bottom
      },
      // the rectangle of the element expanded to contain its children including own margin and child margins
      // margins will be added after we've recalculated the size
      outer: {
        left,
        top,
        right,
        bottom
      }
    };
    childViews.filter((childView) => !childView.isRectIgnored()).map((childView) => childView.rect).forEach((childViewRect) => {
      expandRect(rect.inner, { ...childViewRect.inner });
      expandRect(rect.outer, { ...childViewRect.outer });
    });
    calculateRectSize(rect.inner);
    rect.outer.bottom += rect.element.marginBottom;
    rect.outer.right += rect.element.marginRight;
    calculateRectSize(rect.outer);
    return rect;
  };
  var expandRect = (parent, child) => {
    child.top += parent.top;
    child.right += parent.left;
    child.bottom += parent.top;
    child.left += parent.left;
    if (child.bottom > parent.bottom) {
      parent.bottom = child.bottom;
    }
    if (child.right > parent.right) {
      parent.right = child.right;
    }
  };
  var calculateRectSize = (rect) => {
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
  };
  var isNumber = (value) => typeof value === "number";
  var thereYet = (position, destination, velocity, errorMargin = 1e-3) => {
    return Math.abs(position - destination) < errorMargin && Math.abs(velocity) < errorMargin;
  };
  var spring = (
    // default options
    ({ stiffness = 0.5, damping = 0.75, mass = 10 } = {}) => {
      let target = null;
      let position = null;
      let velocity = 0;
      let resting = false;
      const interpolate = (ts, skipToEndState) => {
        if (resting) return;
        if (!(isNumber(target) && isNumber(position))) {
          resting = true;
          velocity = 0;
          return;
        }
        const f = -(position - target) * stiffness;
        velocity += f / mass;
        position += velocity;
        velocity *= damping;
        if (thereYet(position, target, velocity) || skipToEndState) {
          position = target;
          velocity = 0;
          resting = true;
          api.onupdate(position);
          api.oncomplete(position);
        } else {
          api.onupdate(position);
        }
      };
      const setTarget = (value) => {
        if (isNumber(value) && !isNumber(position)) {
          position = value;
        }
        if (target === null) {
          target = value;
          position = value;
        }
        target = value;
        if (position === target || typeof target === "undefined") {
          resting = true;
          velocity = 0;
          api.onupdate(position);
          api.oncomplete(position);
          return;
        }
        resting = false;
      };
      const api = createObject({
        interpolate,
        target: {
          set: setTarget,
          get: () => target
        },
        resting: {
          get: () => resting
        },
        onupdate: (value) => {
        },
        oncomplete: (value) => {
        }
      });
      return api;
    }
  );
  var easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  var tween = (
    // default values
    ({ duration = 500, easing = easeInOutQuad, delay = 0 } = {}) => {
      let start = null;
      let t;
      let p;
      let resting = true;
      let reverse = false;
      let target = null;
      const interpolate = (ts, skipToEndState) => {
        if (resting || target === null) return;
        if (start === null) {
          start = ts;
        }
        if (ts - start < delay) return;
        t = ts - start - delay;
        if (t >= duration || skipToEndState) {
          t = 1;
          p = reverse ? 0 : 1;
          api.onupdate(p * target);
          api.oncomplete(p * target);
          resting = true;
        } else {
          p = t / duration;
          api.onupdate((t >= 0 ? easing(reverse ? 1 - p : p) : 0) * target);
        }
      };
      const api = createObject({
        interpolate,
        target: {
          get: () => reverse ? 0 : target,
          set: (value) => {
            if (target === null) {
              target = value;
              api.onupdate(value);
              api.oncomplete(value);
              return;
            }
            if (value < target) {
              target = 1;
              reverse = true;
            } else {
              reverse = false;
              target = value;
            }
            resting = false;
            start = null;
          }
        },
        resting: {
          get: () => resting
        },
        onupdate: (value) => {
        },
        oncomplete: (value) => {
        }
      });
      return api;
    }
  );
  var animator = {
    spring,
    tween
  };
  var createAnimator = (definition, category, property) => {
    const def = definition[category] && typeof definition[category][property] === "object" ? definition[category][property] : definition[category] || definition;
    const type = typeof def === "string" ? def : def.type;
    const props = typeof def === "object" ? { ...def } : {};
    return animator[type] ? animator[type](props) : null;
  };
  var addGetSet = (keys, obj, props, overwrite = false) => {
    obj = Array.isArray(obj) ? obj : [obj];
    obj.forEach((o) => {
      keys.forEach((key) => {
        let name2 = key;
        let getter = () => props[key];
        let setter = (value) => props[key] = value;
        if (typeof key === "object") {
          name2 = key.key;
          getter = key.getter || getter;
          setter = key.setter || setter;
        }
        if (o[name2] && !overwrite) {
          return;
        }
        o[name2] = {
          get: getter,
          set: setter
        };
      });
    });
  };
  var animations = ({ mixinConfig, viewProps, viewInternalAPI, viewExternalAPI }) => {
    const initialProps = { ...viewProps };
    const animations2 = [];
    forin(mixinConfig, (property, animation) => {
      const animator2 = createAnimator(animation);
      if (!animator2) {
        return;
      }
      animator2.onupdate = (value) => {
        viewProps[property] = value;
      };
      animator2.target = initialProps[property];
      const prop = {
        key: property,
        setter: (value) => {
          if (animator2.target === value) {
            return;
          }
          animator2.target = value;
        },
        getter: () => viewProps[property]
      };
      addGetSet([prop], [viewInternalAPI, viewExternalAPI], viewProps, true);
      animations2.push(animator2);
    });
    return {
      write: (ts) => {
        let skipToEndState = document.hidden;
        let resting = true;
        animations2.forEach((animation) => {
          if (!animation.resting) resting = false;
          animation.interpolate(ts, skipToEndState);
        });
        return resting;
      },
      destroy: () => {
      }
    };
  };
  var addEvent = (element) => (type, fn2) => {
    element.addEventListener(type, fn2);
  };
  var removeEvent = (element) => (type, fn2) => {
    element.removeEventListener(type, fn2);
  };
  var listeners = ({
    mixinConfig,
    viewProps,
    viewInternalAPI,
    viewExternalAPI,
    viewState,
    view
  }) => {
    const events = [];
    const add = addEvent(view.element);
    const remove = removeEvent(view.element);
    viewExternalAPI.on = (type, fn2) => {
      events.push({
        type,
        fn: fn2
      });
      add(type, fn2);
    };
    viewExternalAPI.off = (type, fn2) => {
      events.splice(events.findIndex((event) => event.type === type && event.fn === fn2), 1);
      remove(type, fn2);
    };
    return {
      write: () => {
        return true;
      },
      destroy: () => {
        events.forEach((event) => {
          remove(event.type, event.fn);
        });
      }
    };
  };
  var apis = ({ mixinConfig, viewProps, viewExternalAPI }) => {
    addGetSet(mixinConfig, viewExternalAPI, viewProps);
  };
  var isDefined = (value) => value != null;
  var defaults = {
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    originX: 0,
    originY: 0
  };
  var styles = ({ mixinConfig, viewProps, viewInternalAPI, viewExternalAPI, view }) => {
    const initialProps = { ...viewProps };
    const currentProps = {};
    addGetSet(mixinConfig, [viewInternalAPI, viewExternalAPI], viewProps);
    const getOffset = () => [viewProps["translateX"] || 0, viewProps["translateY"] || 0];
    const getScale = () => [viewProps["scaleX"] || 0, viewProps["scaleY"] || 0];
    const getRect = () => view.rect ? getViewRect(view.rect, view.childViews, getOffset(), getScale()) : null;
    viewInternalAPI.rect = { get: getRect };
    viewExternalAPI.rect = { get: getRect };
    mixinConfig.forEach((key) => {
      viewProps[key] = typeof initialProps[key] === "undefined" ? defaults[key] : initialProps[key];
    });
    return {
      write: () => {
        if (!propsHaveChanged(currentProps, viewProps)) {
          return;
        }
        applyStyles(view.element, viewProps);
        Object.assign(currentProps, { ...viewProps });
        return true;
      },
      destroy: () => {
      }
    };
  };
  var propsHaveChanged = (currentProps, newProps) => {
    if (Object.keys(currentProps).length !== Object.keys(newProps).length) {
      return true;
    }
    for (const prop in newProps) {
      if (newProps[prop] !== currentProps[prop]) {
        return true;
      }
    }
    return false;
  };
  var applyStyles = (element, {
    opacity,
    perspective,
    translateX,
    translateY,
    scaleX,
    scaleY,
    rotateX,
    rotateY,
    rotateZ,
    originX,
    originY,
    width: width2,
    height: height2
  }) => {
    let transforms2 = "";
    let styles2 = "";
    if (isDefined(originX) || isDefined(originY)) {
      styles2 += `transform-origin: ${originX || 0}px ${originY || 0}px;`;
    }
    if (isDefined(perspective)) {
      transforms2 += `perspective(${perspective}px) `;
    }
    if (isDefined(translateX) || isDefined(translateY)) {
      transforms2 += `translate3d(${translateX || 0}px, ${translateY || 0}px, 0) `;
    }
    if (isDefined(scaleX) || isDefined(scaleY)) {
      transforms2 += `scale3d(${isDefined(scaleX) ? scaleX : 1}, ${isDefined(scaleY) ? scaleY : 1}, 1) `;
    }
    if (isDefined(rotateZ)) {
      transforms2 += `rotateZ(${rotateZ}rad) `;
    }
    if (isDefined(rotateX)) {
      transforms2 += `rotateX(${rotateX}rad) `;
    }
    if (isDefined(rotateY)) {
      transforms2 += `rotateY(${rotateY}rad) `;
    }
    if (transforms2.length) {
      styles2 += `transform:${transforms2};`;
    }
    if (isDefined(opacity)) {
      styles2 += `opacity:${opacity};`;
      if (opacity === 0) {
        styles2 += `visibility:hidden;`;
      }
      if (opacity < 1) {
        styles2 += `pointer-events:none;`;
      }
    }
    if (isDefined(height2)) {
      styles2 += `height:${height2}px;`;
    }
    if (isDefined(width2)) {
      styles2 += `width:${width2}px;`;
    }
    const elementCurrentStyle = element.elementCurrentStyle || "";
    if (styles2.length !== elementCurrentStyle.length || styles2 !== elementCurrentStyle) {
      element.style.cssText = styles2;
      element.elementCurrentStyle = styles2;
    }
  };
  var Mixins = {
    styles,
    listeners,
    animations,
    apis
  };
  var updateRect = (rect = {}, element = {}, style = {}) => {
    if (!element.layoutCalculated) {
      rect.paddingTop = parseInt(style.paddingTop, 10) || 0;
      rect.marginTop = parseInt(style.marginTop, 10) || 0;
      rect.marginRight = parseInt(style.marginRight, 10) || 0;
      rect.marginBottom = parseInt(style.marginBottom, 10) || 0;
      rect.marginLeft = parseInt(style.marginLeft, 10) || 0;
      element.layoutCalculated = true;
    }
    rect.left = element.offsetLeft || 0;
    rect.top = element.offsetTop || 0;
    rect.width = element.offsetWidth || 0;
    rect.height = element.offsetHeight || 0;
    rect.right = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;
    rect.scrollTop = element.scrollTop;
    rect.hidden = element.offsetParent === null;
    return rect;
  };
  var createView = (
    // default view definition
    ({
      // element definition
      tag = "div",
      name: name2 = null,
      attributes = {},
      // view interaction
      read = () => {
      },
      write: write2 = () => {
      },
      create: create2 = () => {
      },
      destroy: destroy2 = () => {
      },
      // hooks
      filterFrameActionsForChild = (child, actions2) => actions2,
      didCreateView = () => {
      },
      didWriteView = () => {
      },
      // rect related
      ignoreRect = false,
      ignoreRectUpdate = false,
      // mixins
      mixins = []
    } = {}) => (store, props = {}) => {
      const element = createElement(tag, `filepond--${name2}`, attributes);
      const style = window.getComputedStyle(element, null);
      const rect = updateRect();
      let frameRect = null;
      let isResting = false;
      const childViews = [];
      const activeMixins = [];
      const ref = {};
      const state2 = {};
      const writers = [
        write2
        // default writer
      ];
      const readers = [
        read
        // default reader
      ];
      const destroyers = [
        destroy2
        // default destroy
      ];
      const getElement = () => element;
      const getChildViews = () => childViews.concat();
      const getReference = () => ref;
      const createChildView = (store2) => (view, props2) => view(store2, props2);
      const getRect = () => {
        if (frameRect) {
          return frameRect;
        }
        frameRect = getViewRect(rect, childViews, [0, 0], [1, 1]);
        return frameRect;
      };
      const getStyle = () => style;
      const _read = () => {
        frameRect = null;
        childViews.forEach((child) => child._read());
        const shouldUpdate = !(ignoreRectUpdate && rect.width && rect.height);
        if (shouldUpdate) {
          updateRect(rect, element, style);
        }
        const api = { root: internalAPI, props, rect };
        readers.forEach((reader) => reader(api));
      };
      const _write = (ts, frameActions, shouldOptimize) => {
        let resting = frameActions.length === 0;
        writers.forEach((writer) => {
          const writerResting = writer({
            props,
            root: internalAPI,
            actions: frameActions,
            timestamp: ts,
            shouldOptimize
          });
          if (writerResting === false) {
            resting = false;
          }
        });
        activeMixins.forEach((mixin) => {
          const mixinResting = mixin.write(ts);
          if (mixinResting === false) {
            resting = false;
          }
        });
        childViews.filter((child) => !!child.element.parentNode).forEach((child) => {
          const childResting = child._write(
            ts,
            filterFrameActionsForChild(child, frameActions),
            shouldOptimize
          );
          if (!childResting) {
            resting = false;
          }
        });
        childViews.forEach((child, index) => {
          if (child.element.parentNode) {
            return;
          }
          internalAPI.appendChild(child.element, index);
          child._read();
          child._write(
            ts,
            filterFrameActionsForChild(child, frameActions),
            shouldOptimize
          );
          resting = false;
        });
        isResting = resting;
        didWriteView({
          props,
          root: internalAPI,
          actions: frameActions,
          timestamp: ts
        });
        return resting;
      };
      const _destroy = () => {
        activeMixins.forEach((mixin) => mixin.destroy());
        destroyers.forEach((destroyer) => {
          destroyer({ root: internalAPI, props });
        });
        childViews.forEach((child) => child._destroy());
      };
      const sharedAPIDefinition = {
        element: {
          get: getElement
        },
        style: {
          get: getStyle
        },
        childViews: {
          get: getChildViews
        }
      };
      const internalAPIDefinition = {
        ...sharedAPIDefinition,
        rect: {
          get: getRect
        },
        // access to custom children references
        ref: {
          get: getReference
        },
        // dom modifiers
        is: (needle) => name2 === needle,
        appendChild: appendChild(element),
        createChildView: createChildView(store),
        linkView: (view) => {
          childViews.push(view);
          return view;
        },
        unlinkView: (view) => {
          childViews.splice(childViews.indexOf(view), 1);
        },
        appendChildView: appendChildView(element, childViews),
        removeChildView: removeChildView(element, childViews),
        registerWriter: (writer) => writers.push(writer),
        registerReader: (reader) => readers.push(reader),
        registerDestroyer: (destroyer) => destroyers.push(destroyer),
        invalidateLayout: () => element.layoutCalculated = false,
        // access to data store
        dispatch: store.dispatch,
        query: store.query
      };
      const externalAPIDefinition = {
        element: {
          get: getElement
        },
        childViews: {
          get: getChildViews
        },
        rect: {
          get: getRect
        },
        resting: {
          get: () => isResting
        },
        isRectIgnored: () => ignoreRect,
        _read,
        _write,
        _destroy
      };
      const mixinAPIDefinition = {
        ...sharedAPIDefinition,
        rect: {
          get: () => rect
        }
      };
      Object.keys(mixins).sort((a, b) => {
        if (a === "styles") {
          return 1;
        } else if (b === "styles") {
          return -1;
        }
        return 0;
      }).forEach((key) => {
        const mixinAPI = Mixins[key]({
          mixinConfig: mixins[key],
          viewProps: props,
          viewState: state2,
          viewInternalAPI: internalAPIDefinition,
          viewExternalAPI: externalAPIDefinition,
          view: createObject(mixinAPIDefinition)
        });
        if (mixinAPI) {
          activeMixins.push(mixinAPI);
        }
      });
      const internalAPI = createObject(internalAPIDefinition);
      create2({
        root: internalAPI,
        props
      });
      const childCount = getChildCount(element);
      childViews.forEach((child, index) => {
        internalAPI.appendChild(child.element, childCount + index);
      });
      didCreateView(internalAPI);
      return createObject(externalAPIDefinition);
    }
  );
  var createPainter = (read, write2, fps = 60) => {
    const name2 = "__framePainter";
    if (window[name2]) {
      window[name2].readers.push(read);
      window[name2].writers.push(write2);
      return;
    }
    window[name2] = {
      readers: [read],
      writers: [write2]
    };
    const painter = window[name2];
    const interval = 1e3 / fps;
    let last = null;
    let id = null;
    let requestTick = null;
    let cancelTick = null;
    const setTimerType = () => {
      if (document.hidden) {
        requestTick = () => window.setTimeout(() => tick(performance.now()), interval);
        cancelTick = () => window.clearTimeout(id);
      } else {
        requestTick = () => window.requestAnimationFrame(tick);
        cancelTick = () => window.cancelAnimationFrame(id);
      }
    };
    document.addEventListener("visibilitychange", () => {
      if (cancelTick) cancelTick();
      setTimerType();
      tick(performance.now());
    });
    const tick = (ts) => {
      id = requestTick(tick);
      if (!last) {
        last = ts;
      }
      const delta = ts - last;
      if (delta <= interval) {
        return;
      }
      last = ts - delta % interval;
      painter.readers.forEach((read2) => read2());
      painter.writers.forEach((write3) => write3(ts));
    };
    setTimerType();
    tick(performance.now());
    return {
      pause: () => {
        cancelTick(id);
      }
    };
  };
  var createRoute = (routes, fn2) => ({ root: root2, props, actions: actions2 = [], timestamp, shouldOptimize }) => {
    actions2.filter((action) => routes[action.type]).forEach(
      (action) => routes[action.type]({ root: root2, props, action: action.data, timestamp, shouldOptimize })
    );
    if (fn2) {
      fn2({ root: root2, props, actions: actions2, timestamp, shouldOptimize });
    }
  };
  var insertBefore = (newNode, referenceNode) => referenceNode.parentNode.insertBefore(newNode, referenceNode);
  var insertAfter = (newNode, referenceNode) => {
    return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };
  var isArray = (value) => Array.isArray(value);
  var isEmpty = (value) => value == null;
  var trim = (str) => str.trim();
  var toString = (value) => "" + value;
  var toArray = (value, splitter = ",") => {
    if (isEmpty(value)) {
      return [];
    }
    if (isArray(value)) {
      return value;
    }
    return toString(value).split(splitter).map(trim).filter((str) => str.length);
  };
  var isBoolean = (value) => typeof value === "boolean";
  var toBoolean = (value) => isBoolean(value) ? value : value === "true";
  var isString = (value) => typeof value === "string";
  var toNumber = (value) => isNumber(value) ? value : isString(value) ? toString(value).replace(/[a-z]+/gi, "") : 0;
  var toInt = (value) => parseInt(toNumber(value), 10);
  var toFloat = (value) => parseFloat(toNumber(value));
  var isInt = (value) => isNumber(value) && isFinite(value) && Math.floor(value) === value;
  var toBytes = (value, base = 1e3) => {
    if (isInt(value)) {
      return value;
    }
    let naturalFileSize = toString(value).trim();
    if (/MB$/i.test(naturalFileSize)) {
      naturalFileSize = naturalFileSize.replace(/MB$i/, "").trim();
      return toInt(naturalFileSize) * base * base;
    }
    if (/KB/i.test(naturalFileSize)) {
      naturalFileSize = naturalFileSize.replace(/KB$i/, "").trim();
      return toInt(naturalFileSize) * base;
    }
    return toInt(naturalFileSize);
  };
  var isFunction = (value) => typeof value === "function";
  var toFunctionReference = (string) => {
    let ref = self;
    let levels = string.split(".");
    let level = null;
    while (level = levels.shift()) {
      ref = ref[level];
      if (!ref) {
        return null;
      }
    }
    return ref;
  };
  var methods = {
    process: "POST",
    patch: "PATCH",
    revert: "DELETE",
    fetch: "GET",
    restore: "GET",
    load: "GET"
  };
  var createServerAPI = (outline) => {
    const api = {};
    api.url = isString(outline) ? outline : outline.url || "";
    api.timeout = outline.timeout ? parseInt(outline.timeout, 10) : 0;
    api.headers = outline.headers ? outline.headers : {};
    forin(methods, (key) => {
      api[key] = createAction(key, outline[key], methods[key], api.timeout, api.headers);
    });
    api.process = outline.process || isString(outline) || outline.url ? api.process : null;
    api.remove = outline.remove || null;
    delete api.headers;
    return api;
  };
  var createAction = (name2, outline, method, timeout, headers) => {
    if (outline === null) {
      return null;
    }
    if (typeof outline === "function") {
      return outline;
    }
    const action = {
      url: method === "GET" || method === "PATCH" ? `?${name2}=` : "",
      method,
      headers,
      withCredentials: false,
      timeout,
      onload: null,
      ondata: null,
      onerror: null
    };
    if (isString(outline)) {
      action.url = outline;
      return action;
    }
    Object.assign(action, outline);
    if (isString(action.headers)) {
      const parts = action.headers.split(/:(.+)/);
      action.headers = {
        header: parts[0],
        value: parts[1]
      };
    }
    action.withCredentials = toBoolean(action.withCredentials);
    return action;
  };
  var toServerAPI = (value) => createServerAPI(value);
  var isNull = (value) => value === null;
  var isObject = (value) => typeof value === "object" && value !== null;
  var isAPI = (value) => {
    return isObject(value) && isString(value.url) && isObject(value.process) && isObject(value.revert) && isObject(value.restore) && isObject(value.fetch);
  };
  var getType = (value) => {
    if (isArray(value)) {
      return "array";
    }
    if (isNull(value)) {
      return "null";
    }
    if (isInt(value)) {
      return "int";
    }
    if (/^[0-9]+ ?(?:GB|MB|KB)$/gi.test(value)) {
      return "bytes";
    }
    if (isAPI(value)) {
      return "api";
    }
    return typeof value;
  };
  var replaceSingleQuotes = (str) => str.replace(/{\s*'/g, '{"').replace(/'\s*}/g, '"}').replace(/'\s*:/g, '":').replace(/:\s*'/g, ':"').replace(/,\s*'/g, ',"').replace(/'\s*,/g, '",');
  var conversionTable = {
    array: toArray,
    boolean: toBoolean,
    int: (value) => getType(value) === "bytes" ? toBytes(value) : toInt(value),
    number: toFloat,
    float: toFloat,
    bytes: toBytes,
    string: (value) => isFunction(value) ? value : toString(value),
    function: (value) => toFunctionReference(value),
    serverapi: toServerAPI,
    object: (value) => {
      try {
        return JSON.parse(replaceSingleQuotes(value));
      } catch (e) {
        return null;
      }
    }
  };
  var convertTo = (value, type) => conversionTable[type](value);
  var getValueByType = (newValue, defaultValue, valueType) => {
    if (newValue === defaultValue) {
      return newValue;
    }
    let newValueType = getType(newValue);
    if (newValueType !== valueType) {
      const convertedValue = convertTo(newValue, valueType);
      newValueType = getType(convertedValue);
      if (convertedValue === null) {
        throw `Trying to assign value with incorrect type to "${option}", allowed type: "${valueType}"`;
      } else {
        newValue = convertedValue;
      }
    }
    return newValue;
  };
  var createOption = (defaultValue, valueType) => {
    let currentValue = defaultValue;
    return {
      enumerable: true,
      get: () => currentValue,
      set: (newValue) => {
        currentValue = getValueByType(newValue, defaultValue, valueType);
      }
    };
  };
  var createOptions = (options) => {
    const obj = {};
    forin(options, (prop) => {
      const optionDefinition = options[prop];
      obj[prop] = createOption(optionDefinition[0], optionDefinition[1]);
    });
    return createObject(obj);
  };
  var createInitialState = (options) => ({
    // model
    items: [],
    // timeout used for calling update items
    listUpdateTimeout: null,
    // timeout used for stacking metadata updates
    itemUpdateTimeout: null,
    // queue of items waiting to be processed
    processingQueue: [],
    // options
    options: createOptions(options)
  });
  var fromCamels = (string, separator = "-") => string.split(/(?=[A-Z])/).map((part) => part.toLowerCase()).join(separator);
  var createOptionAPI = (store, options) => {
    const obj = {};
    forin(options, (key) => {
      obj[key] = {
        get: () => store.getState().options[key],
        set: (value) => {
          store.dispatch(`SET_${fromCamels(key, "_").toUpperCase()}`, {
            value
          });
        }
      };
    });
    return obj;
  };
  var createOptionActions = (options) => (dispatch, query, state2) => {
    const obj = {};
    forin(options, (key) => {
      const name2 = fromCamels(key, "_").toUpperCase();
      obj[`SET_${name2}`] = (action) => {
        try {
          state2.options[key] = action.value;
        } catch (e) {
        }
        dispatch(`DID_SET_${name2}`, { value: state2.options[key] });
      };
    });
    return obj;
  };
  var createOptionQueries = (options) => (state2) => {
    const obj = {};
    forin(options, (key) => {
      obj[`GET_${fromCamels(key, "_").toUpperCase()}`] = (action) => state2.options[key];
    });
    return obj;
  };
  var InteractionMethod = {
    API: 1,
    DROP: 2,
    BROWSE: 3,
    PASTE: 4,
    NONE: 5
  };
  var getUniqueId = () => Math.random().toString(36).substring(2, 11);
  var arrayRemove = (arr, index) => arr.splice(index, 1);
  var run = (cb, sync) => {
    if (sync) {
      cb();
    } else if (document.hidden) {
      Promise.resolve(1).then(cb);
    } else {
      setTimeout(cb, 0);
    }
  };
  var on = () => {
    const listeners2 = [];
    const off = (event, cb) => {
      arrayRemove(
        listeners2,
        listeners2.findIndex((listener) => listener.event === event && (listener.cb === cb || !cb))
      );
    };
    const fire = (event, args, sync) => {
      listeners2.filter((listener) => listener.event === event).map((listener) => listener.cb).forEach((cb) => run(() => cb(...args), sync));
    };
    return {
      fireSync: (event, ...args) => {
        fire(event, args, true);
      },
      fire: (event, ...args) => {
        fire(event, args, false);
      },
      on: (event, cb) => {
        listeners2.push({ event, cb });
      },
      onOnce: (event, cb) => {
        listeners2.push({
          event,
          cb: (...args) => {
            off(event, cb);
            cb(...args);
          }
        });
      },
      off
    };
  };
  var copyObjectPropertiesToObject = (src, target, excluded) => {
    Object.getOwnPropertyNames(src).filter((property) => !excluded.includes(property)).forEach(
      (key) => Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(src, key))
    );
  };
  var PRIVATE = [
    "fire",
    "process",
    "revert",
    "load",
    "on",
    "off",
    "onOnce",
    "retryLoad",
    "extend",
    "archive",
    "archived",
    "release",
    "released",
    "requestProcessing",
    "freeze"
  ];
  var createItemAPI = (item2) => {
    const api = {};
    copyObjectPropertiesToObject(item2, api, PRIVATE);
    return api;
  };
  var removeReleasedItems = (items) => {
    items.forEach((item2, index) => {
      if (item2.released) {
        arrayRemove(items, index);
      }
    });
  };
  var ItemStatus = {
    INIT: 1,
    IDLE: 2,
    PROCESSING_QUEUED: 9,
    PROCESSING: 3,
    PROCESSING_COMPLETE: 5,
    PROCESSING_ERROR: 6,
    PROCESSING_REVERT_ERROR: 10,
    LOADING: 7,
    LOAD_ERROR: 8
  };
  var FileOrigin = {
    INPUT: 1,
    LIMBO: 2,
    LOCAL: 3
  };
  var getNonNumeric = (str) => /[^0-9]+/.exec(str);
  var getDecimalSeparator = () => getNonNumeric(1.1.toLocaleString())[0];
  var getThousandsSeparator = () => {
    const decimalSeparator = getDecimalSeparator();
    const thousandsStringWithSeparator = 1e3.toLocaleString();
    const thousandsStringWithoutSeparator = 1e3.toString();
    if (thousandsStringWithSeparator !== thousandsStringWithoutSeparator) {
      return getNonNumeric(thousandsStringWithSeparator)[0];
    }
    return decimalSeparator === "." ? "," : ".";
  };
  var Type = {
    BOOLEAN: "boolean",
    INT: "int",
    NUMBER: "number",
    STRING: "string",
    ARRAY: "array",
    OBJECT: "object",
    FUNCTION: "function",
    ACTION: "action",
    SERVER_API: "serverapi",
    REGEX: "regex"
  };
  var filters = [];
  var applyFilterChain = (key, value, utils) => new Promise((resolve, reject) => {
    const matchingFilters = filters.filter((f) => f.key === key).map((f) => f.cb);
    if (matchingFilters.length === 0) {
      resolve(value);
      return;
    }
    const initialFilter = matchingFilters.shift();
    matchingFilters.reduce(
      // loop over promises passing value to next promise
      (current, next) => current.then((value2) => next(value2, utils)),
      // call initial filter, will return a promise
      initialFilter(value, utils)
      // all executed
    ).then((value2) => resolve(value2)).catch((error2) => reject(error2));
  });
  var applyFilters = (key, value, utils) => filters.filter((f) => f.key === key).map((f) => f.cb(value, utils));
  var addFilter = (key, cb) => filters.push({ key, cb });
  var extendDefaultOptions = (additionalOptions) => Object.assign(defaultOptions, additionalOptions);
  var getOptions = () => ({ ...defaultOptions });
  var setOptions = (opts) => {
    forin(opts, (key, value) => {
      if (!defaultOptions[key]) {
        return;
      }
      defaultOptions[key][0] = getValueByType(
        value,
        defaultOptions[key][0],
        defaultOptions[key][1]
      );
    });
  };
  var defaultOptions = {
    // the id to add to the root element
    id: [null, Type.STRING],
    // input field name to use
    name: ["filepond", Type.STRING],
    // disable the field
    disabled: [false, Type.BOOLEAN],
    // classname to put on wrapper
    className: [null, Type.STRING],
    // is the field required
    required: [false, Type.BOOLEAN],
    // Allow media capture when value is set
    captureMethod: [null, Type.STRING],
    // - "camera", "microphone" or "camcorder",
    // - Does not work with multiple on apple devices
    // - If set, acceptedFileTypes must be made to match with media wildcard "image/*", "audio/*" or "video/*"
    // sync `acceptedFileTypes` property with `accept` attribute
    allowSyncAcceptAttribute: [true, Type.BOOLEAN],
    // Feature toggles
    allowDrop: [true, Type.BOOLEAN],
    // Allow dropping of files
    allowBrowse: [true, Type.BOOLEAN],
    // Allow browsing the file system
    allowPaste: [true, Type.BOOLEAN],
    // Allow pasting files
    allowMultiple: [false, Type.BOOLEAN],
    // Allow multiple files (disabled by default, as multiple attribute is also required on input to allow multiple)
    allowReplace: [true, Type.BOOLEAN],
    // Allow dropping a file on other file to replace it (only works when multiple is set to false)
    allowRevert: [true, Type.BOOLEAN],
    // Allows user to revert file upload
    allowRemove: [true, Type.BOOLEAN],
    // Allow user to remove a file
    allowProcess: [true, Type.BOOLEAN],
    // Allows user to process a file, when set to false, this removes the file upload button
    allowReorder: [false, Type.BOOLEAN],
    // Allow reordering of files
    allowDirectoriesOnly: [false, Type.BOOLEAN],
    // Allow only selecting directories with browse (no support for filtering dnd at this point)
    // Try store file if `server` not set
    storeAsFile: [false, Type.BOOLEAN],
    // Revert mode
    forceRevert: [false, Type.BOOLEAN],
    // Set to 'force' to require the file to be reverted before removal
    // Input requirements
    maxFiles: [null, Type.INT],
    // Max number of files
    checkValidity: [false, Type.BOOLEAN],
    // Enables custom validity messages
    // Where to put file
    itemInsertLocationFreedom: [true, Type.BOOLEAN],
    // Set to false to always add items to begin or end of list
    itemInsertLocation: ["before", Type.STRING],
    // Default index in list to add items that have been dropped at the top of the list
    itemInsertInterval: [75, Type.INT],
    // Drag 'n Drop related
    dropOnPage: [false, Type.BOOLEAN],
    // Allow dropping of files anywhere on page (prevents browser from opening file if dropped outside of Up)
    dropOnElement: [true, Type.BOOLEAN],
    // Drop needs to happen on element (set to false to also load drops outside of Up)
    dropValidation: [false, Type.BOOLEAN],
    // Enable or disable validating files on drop
    ignoredFiles: [[".ds_store", "thumbs.db", "desktop.ini"], Type.ARRAY],
    // Upload related
    instantUpload: [true, Type.BOOLEAN],
    // Should upload files immediately on drop
    maxParallelUploads: [2, Type.INT],
    // Maximum files to upload in parallel
    allowMinimumUploadDuration: [true, Type.BOOLEAN],
    // if true uploads take at least 750 ms, this ensures the user sees the upload progress giving trust the upload actually happened
    // Chunks
    chunkUploads: [false, Type.BOOLEAN],
    // Enable chunked uploads
    chunkForce: [false, Type.BOOLEAN],
    // Force use of chunk uploads even for files smaller than chunk size
    chunkSize: [5e6, Type.INT],
    // Size of chunks (5MB default)
    chunkRetryDelays: [[500, 1e3, 3e3], Type.ARRAY],
    // Amount of times to retry upload of a chunk when it fails
    // The server api end points to use for uploading (see docs)
    server: [null, Type.SERVER_API],
    // File size calculations, can set to 1024, this is only used for display, properties use file size base 1000
    fileSizeBase: [1e3, Type.INT],
    // Labels and status messages
    labelFileSizeBytes: ["bytes", Type.STRING],
    labelFileSizeKilobytes: ["KB", Type.STRING],
    labelFileSizeMegabytes: ["MB", Type.STRING],
    labelFileSizeGigabytes: ["GB", Type.STRING],
    labelDecimalSeparator: [getDecimalSeparator(), Type.STRING],
    // Default is locale separator
    labelThousandsSeparator: [getThousandsSeparator(), Type.STRING],
    // Default is locale separator
    labelIdle: [
      'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
      Type.STRING
    ],
    labelInvalidField: ["Field contains invalid files", Type.STRING],
    labelFileWaitingForSize: ["Waiting for size", Type.STRING],
    labelFileSizeNotAvailable: ["Size not available", Type.STRING],
    labelFileCountSingular: ["file in list", Type.STRING],
    labelFileCountPlural: ["files in list", Type.STRING],
    labelFileLoading: ["Loading", Type.STRING],
    labelFileAdded: ["Added", Type.STRING],
    // assistive only
    labelFileLoadError: ["Error during load", Type.STRING],
    labelFileRemoved: ["Removed", Type.STRING],
    // assistive only
    labelFileRemoveError: ["Error during remove", Type.STRING],
    labelFileProcessing: ["Uploading", Type.STRING],
    labelFileProcessingComplete: ["Upload complete", Type.STRING],
    labelFileProcessingAborted: ["Upload cancelled", Type.STRING],
    labelFileProcessingError: ["Error during upload", Type.STRING],
    labelFileProcessingRevertError: ["Error during revert", Type.STRING],
    labelTapToCancel: ["tap to cancel", Type.STRING],
    labelTapToRetry: ["tap to retry", Type.STRING],
    labelTapToUndo: ["tap to undo", Type.STRING],
    labelButtonRemoveItem: ["Remove", Type.STRING],
    labelButtonAbortItemLoad: ["Abort", Type.STRING],
    labelButtonRetryItemLoad: ["Retry", Type.STRING],
    labelButtonAbortItemProcessing: ["Cancel", Type.STRING],
    labelButtonUndoItemProcessing: ["Undo", Type.STRING],
    labelButtonRetryItemProcessing: ["Retry", Type.STRING],
    labelButtonProcessItem: ["Upload", Type.STRING],
    // make sure width and height plus viewpox are even numbers so icons are nicely centered
    iconRemove: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z" fill="currentColor" fill-rule="nonzero"/></svg>',
      Type.STRING
    ],
    iconProcess: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M14 10.414v3.585a1 1 0 0 1-2 0v-3.585l-1.293 1.293a1 1 0 0 1-1.414-1.415l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.415L14 10.414zM9 18a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H9z" fill="currentColor" fill-rule="evenodd"/></svg>',
      Type.STRING
    ],
    iconRetry: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M10.81 9.185l-.038.02A4.997 4.997 0 0 0 8 13.683a5 5 0 0 0 5 5 5 5 0 0 0 5-5 1 1 0 0 1 2 0A7 7 0 1 1 9.722 7.496l-.842-.21a.999.999 0 1 1 .484-1.94l3.23.806c.535.133.86.675.73 1.21l-.804 3.233a.997.997 0 0 1-1.21.73.997.997 0 0 1-.73-1.21l.23-.928v-.002z" fill="currentColor" fill-rule="nonzero"/></svg>',
      Type.STRING
    ],
    iconUndo: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M9.185 10.81l.02-.038A4.997 4.997 0 0 1 13.683 8a5 5 0 0 1 5 5 5 5 0 0 1-5 5 1 1 0 0 0 0 2A7 7 0 1 0 7.496 9.722l-.21-.842a.999.999 0 1 0-1.94.484l.806 3.23c.133.535.675.86 1.21.73l3.233-.803a.997.997 0 0 0 .73-1.21.997.997 0 0 0-1.21-.73l-.928.23-.002-.001z" fill="currentColor" fill-rule="nonzero"/></svg>',
      Type.STRING
    ],
    iconDone: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M18.293 9.293a1 1 0 0 1 1.414 1.414l-7.002 7a1 1 0 0 1-1.414 0l-3.998-4a1 1 0 1 1 1.414-1.414L12 15.586l6.294-6.293z" fill="currentColor" fill-rule="nonzero"/></svg>',
      Type.STRING
    ],
    // event handlers
    oninit: [null, Type.FUNCTION],
    onwarning: [null, Type.FUNCTION],
    onerror: [null, Type.FUNCTION],
    onactivatefile: [null, Type.FUNCTION],
    oninitfile: [null, Type.FUNCTION],
    onaddfilestart: [null, Type.FUNCTION],
    onaddfileprogress: [null, Type.FUNCTION],
    onaddfile: [null, Type.FUNCTION],
    onprocessfilestart: [null, Type.FUNCTION],
    onprocessfileprogress: [null, Type.FUNCTION],
    onprocessfileabort: [null, Type.FUNCTION],
    onprocessfilerevert: [null, Type.FUNCTION],
    onprocessfile: [null, Type.FUNCTION],
    onprocessfiles: [null, Type.FUNCTION],
    onremovefile: [null, Type.FUNCTION],
    onpreparefile: [null, Type.FUNCTION],
    onupdatefiles: [null, Type.FUNCTION],
    onreorderfiles: [null, Type.FUNCTION],
    // hooks
    beforeDropFile: [null, Type.FUNCTION],
    beforeAddFile: [null, Type.FUNCTION],
    beforeRemoveFile: [null, Type.FUNCTION],
    beforePrepareFile: [null, Type.FUNCTION],
    // styles
    stylePanelLayout: [null, Type.STRING],
    // null 'integrated', 'compact', 'circle'
    stylePanelAspectRatio: [null, Type.STRING],
    // null or '3:2' or 1
    styleItemPanelAspectRatio: [null, Type.STRING],
    styleButtonRemoveItemPosition: ["left", Type.STRING],
    styleButtonProcessItemPosition: ["right", Type.STRING],
    styleLoadIndicatorPosition: ["right", Type.STRING],
    styleProgressIndicatorPosition: ["right", Type.STRING],
    styleButtonRemoveItemAlign: [false, Type.BOOLEAN],
    // custom initial files array
    files: [[], Type.ARRAY],
    // show support by displaying credits
    credits: [["https://pqina.nl/", "Powered by PQINA"], Type.ARRAY]
  };
  var getItemByQuery = (items, query) => {
    if (isEmpty(query)) {
      return items[0] || null;
    }
    if (isInt(query)) {
      return items[query] || null;
    }
    if (typeof query === "object") {
      query = query.id;
    }
    return items.find((item2) => item2.id === query) || null;
  };
  var getNumericAspectRatioFromString = (aspectRatio) => {
    if (isEmpty(aspectRatio)) {
      return aspectRatio;
    }
    if (/:/.test(aspectRatio)) {
      const parts = aspectRatio.split(":");
      return parts[1] / parts[0];
    }
    return parseFloat(aspectRatio);
  };
  var getActiveItems = (items) => items.filter((item2) => !item2.archived);
  var Status = {
    EMPTY: 0,
    IDLE: 1,
    // waiting
    ERROR: 2,
    // a file is in error state
    BUSY: 3,
    // busy processing or loading
    READY: 4
    // all files uploaded
  };
  var res = null;
  var canUpdateFileInput = () => {
    if (res === null) {
      try {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File(["hello world"], "This_Works.txt"));
        const el = document.createElement("input");
        el.setAttribute("type", "file");
        el.files = dataTransfer.files;
        res = el.files.length === 1;
      } catch (err) {
        res = false;
      }
    }
    return res;
  };
  var ITEM_ERROR = [
    ItemStatus.LOAD_ERROR,
    ItemStatus.PROCESSING_ERROR,
    ItemStatus.PROCESSING_REVERT_ERROR
  ];
  var ITEM_BUSY = [
    ItemStatus.LOADING,
    ItemStatus.PROCESSING,
    ItemStatus.PROCESSING_QUEUED,
    ItemStatus.INIT
  ];
  var ITEM_READY = [ItemStatus.PROCESSING_COMPLETE];
  var isItemInErrorState = (item2) => ITEM_ERROR.includes(item2.status);
  var isItemInBusyState = (item2) => ITEM_BUSY.includes(item2.status);
  var isItemInReadyState = (item2) => ITEM_READY.includes(item2.status);
  var isAsync = (state2) => isObject(state2.options.server) && (isObject(state2.options.server.process) || isFunction(state2.options.server.process));
  var queries = (state2) => ({
    GET_STATUS: () => {
      const items = getActiveItems(state2.items);
      const { EMPTY, ERROR, BUSY, IDLE, READY } = Status;
      if (items.length === 0) return EMPTY;
      if (items.some(isItemInErrorState)) return ERROR;
      if (items.some(isItemInBusyState)) return BUSY;
      if (items.some(isItemInReadyState)) return READY;
      return IDLE;
    },
    GET_ITEM: (query) => getItemByQuery(state2.items, query),
    GET_ACTIVE_ITEM: (query) => getItemByQuery(getActiveItems(state2.items), query),
    GET_ACTIVE_ITEMS: () => getActiveItems(state2.items),
    GET_ITEMS: () => state2.items,
    GET_ITEM_NAME: (query) => {
      const item2 = getItemByQuery(state2.items, query);
      return item2 ? item2.filename : null;
    },
    GET_ITEM_SIZE: (query) => {
      const item2 = getItemByQuery(state2.items, query);
      return item2 ? item2.fileSize : null;
    },
    GET_STYLES: () => Object.keys(state2.options).filter((key) => /^style/.test(key)).map((option2) => ({
      name: option2,
      value: state2.options[option2]
    })),
    GET_PANEL_ASPECT_RATIO: () => {
      const isShapeCircle = /circle/.test(state2.options.stylePanelLayout);
      const aspectRatio = isShapeCircle ? 1 : getNumericAspectRatioFromString(state2.options.stylePanelAspectRatio);
      return aspectRatio;
    },
    GET_ITEM_PANEL_ASPECT_RATIO: () => state2.options.styleItemPanelAspectRatio,
    GET_ITEMS_BY_STATUS: (status) => getActiveItems(state2.items).filter((item2) => item2.status === status),
    GET_TOTAL_ITEMS: () => getActiveItems(state2.items).length,
    SHOULD_UPDATE_FILE_INPUT: () => state2.options.storeAsFile && canUpdateFileInput() && !isAsync(state2),
    IS_ASYNC: () => isAsync(state2),
    GET_FILE_SIZE_LABELS: (query) => ({
      labelBytes: query("GET_LABEL_FILE_SIZE_BYTES") || void 0,
      labelKilobytes: query("GET_LABEL_FILE_SIZE_KILOBYTES") || void 0,
      labelMegabytes: query("GET_LABEL_FILE_SIZE_MEGABYTES") || void 0,
      labelGigabytes: query("GET_LABEL_FILE_SIZE_GIGABYTES") || void 0
    })
  });
  var hasRoomForItem = (state2) => {
    const count = getActiveItems(state2.items).length;
    if (!state2.options.allowMultiple) {
      return count === 0;
    }
    const maxFileCount = state2.options.maxFiles;
    if (maxFileCount === null) {
      return true;
    }
    if (count < maxFileCount) {
      return true;
    }
    return false;
  };
  var limit = (value, min, max) => Math.max(Math.min(max, value), min);
  var arrayInsert = (arr, index, item2) => arr.splice(index, 0, item2);
  var insertItem = (items, item2, index) => {
    if (isEmpty(item2)) {
      return null;
    }
    if (typeof index === "undefined") {
      items.push(item2);
      return item2;
    }
    index = limit(index, 0, items.length);
    arrayInsert(items, index, item2);
    return item2;
  };
  var isBase64DataURI = (str) => /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i.test(
    str
  );
  var getFilenameFromURL = (url) => `${url}`.split("/").pop().split("?").shift();
  var getExtensionFromFilename = (name2) => name2.split(".").pop();
  var guesstimateExtension = (type) => {
    if (typeof type !== "string") {
      return "";
    }
    const subtype = type.split("/").pop();
    if (/svg/.test(subtype)) {
      return "svg";
    }
    if (/zip|compressed/.test(subtype)) {
      return "zip";
    }
    if (/plain/.test(subtype)) {
      return "txt";
    }
    if (/msword/.test(subtype)) {
      return "doc";
    }
    if (/[a-z]+/.test(subtype)) {
      if (subtype === "jpeg") {
        return "jpg";
      }
      return subtype;
    }
    return "";
  };
  var leftPad = (value, padding = "") => (padding + value).slice(-padding.length);
  var getDateString = (date = /* @__PURE__ */ new Date()) => `${date.getFullYear()}-${leftPad(date.getMonth() + 1, "00")}-${leftPad(
    date.getDate(),
    "00"
  )}_${leftPad(date.getHours(), "00")}-${leftPad(date.getMinutes(), "00")}-${leftPad(
    date.getSeconds(),
    "00"
  )}`;
  var getFileFromBlob = (blob2, filename, type = null, extension = null) => {
    const file2 = typeof type === "string" ? blob2.slice(0, blob2.size, type) : blob2.slice(0, blob2.size, blob2.type);
    file2.lastModifiedDate = /* @__PURE__ */ new Date();
    if (blob2._relativePath) file2._relativePath = blob2._relativePath;
    if (!isString(filename)) {
      filename = getDateString();
    }
    if (filename && extension === null && getExtensionFromFilename(filename)) {
      file2.name = filename;
    } else {
      extension = extension || guesstimateExtension(file2.type);
      file2.name = filename + (extension ? "." + extension : "");
    }
    return file2;
  };
  var getBlobBuilder = () => {
    return window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  };
  var createBlob = (arrayBuffer, mimeType) => {
    const BB = getBlobBuilder();
    if (BB) {
      const bb = new BB();
      bb.append(arrayBuffer);
      return bb.getBlob(mimeType);
    }
    return new Blob([arrayBuffer], {
      type: mimeType
    });
  };
  var getBlobFromByteStringWithMimeType = (byteString, mimeType) => {
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return createBlob(ab, mimeType);
  };
  var getMimeTypeFromBase64DataURI = (dataURI) => {
    return (/^data:(.+);/.exec(dataURI) || [])[1] || null;
  };
  var getBase64DataFromBase64DataURI = (dataURI) => {
    const data3 = dataURI.split(",")[1];
    return data3.replace(/\s/g, "");
  };
  var getByteStringFromBase64DataURI = (dataURI) => {
    return atob(getBase64DataFromBase64DataURI(dataURI));
  };
  var getBlobFromBase64DataURI = (dataURI) => {
    const mimeType = getMimeTypeFromBase64DataURI(dataURI);
    const byteString = getByteStringFromBase64DataURI(dataURI);
    return getBlobFromByteStringWithMimeType(byteString, mimeType);
  };
  var getFileFromBase64DataURI = (dataURI, filename, extension) => {
    return getFileFromBlob(getBlobFromBase64DataURI(dataURI), filename, null, extension);
  };
  var getFileNameFromHeader = (header) => {
    if (!/^content-disposition:/i.test(header)) return null;
    const matches = header.split(/filename=|filename\*=.+''/).splice(1).map((name2) => name2.trim().replace(/^["']|[;"']{0,2}$/g, "")).filter((name2) => name2.length);
    return matches.length ? decodeURI(matches[matches.length - 1]) : null;
  };
  var getFileSizeFromHeader = (header) => {
    if (/content-length:/i.test(header)) {
      const size = header.match(/[0-9]+/)[0];
      return size ? parseInt(size, 10) : null;
    }
    return null;
  };
  var getTranfserIdFromHeader = (header) => {
    if (/x-content-transfer-id:/i.test(header)) {
      const id = (header.split(":")[1] || "").trim();
      return id || null;
    }
    return null;
  };
  var getFileInfoFromHeaders = (headers) => {
    const info = {
      source: null,
      name: null,
      size: null
    };
    const rows = headers.split("\n");
    for (let header of rows) {
      const name2 = getFileNameFromHeader(header);
      if (name2) {
        info.name = name2;
        continue;
      }
      const size = getFileSizeFromHeader(header);
      if (size) {
        info.size = size;
        continue;
      }
      const source = getTranfserIdFromHeader(header);
      if (source) {
        info.source = source;
        continue;
      }
    }
    return info;
  };
  var createFileLoader = (fetchFn) => {
    const state2 = {
      source: null,
      complete: false,
      progress: 0,
      size: null,
      timestamp: null,
      duration: 0,
      request: null
    };
    const getProgress = () => state2.progress;
    const abort = () => {
      if (state2.request && state2.request.abort) {
        state2.request.abort();
      }
    };
    const load = () => {
      const source = state2.source;
      api.fire("init", source);
      if (source instanceof File) {
        api.fire("load", source);
      } else if (source instanceof Blob) {
        api.fire("load", getFileFromBlob(source, source.name));
      } else if (isBase64DataURI(source)) {
        api.fire("load", getFileFromBase64DataURI(source));
      } else {
        loadURL(source);
      }
    };
    const loadURL = (url) => {
      if (!fetchFn) {
        api.fire("error", {
          type: "error",
          body: "Can't load URL",
          code: 400
        });
        return;
      }
      state2.timestamp = Date.now();
      state2.request = fetchFn(
        url,
        (response) => {
          state2.duration = Date.now() - state2.timestamp;
          state2.complete = true;
          if (response instanceof Blob) {
            response = getFileFromBlob(response, response.name || getFilenameFromURL(url));
          }
          api.fire(
            "load",
            // if has received blob, we go with blob, if no response, we return null
            response instanceof Blob ? response : response ? response.body : null
          );
        },
        (error2) => {
          api.fire(
            "error",
            typeof error2 === "string" ? {
              type: "error",
              code: 0,
              body: error2
            } : error2
          );
        },
        (computable, current, total) => {
          if (total) {
            state2.size = total;
          }
          state2.duration = Date.now() - state2.timestamp;
          if (!computable) {
            state2.progress = null;
            return;
          }
          state2.progress = current / total;
          api.fire("progress", state2.progress);
        },
        () => {
          api.fire("abort");
        },
        (response) => {
          const fileinfo = getFileInfoFromHeaders(
            typeof response === "string" ? response : response.headers
          );
          api.fire("meta", {
            size: state2.size || fileinfo.size,
            filename: fileinfo.name,
            source: fileinfo.source
          });
        }
      );
    };
    const api = {
      ...on(),
      setSource: (source) => state2.source = source,
      getProgress,
      // file load progress
      abort,
      // abort file load
      load
      // start load
    };
    return api;
  };
  var isGet = (method) => /GET|HEAD/.test(method);
  var sendRequest = (data3, url, options) => {
    const api = {
      onheaders: () => {
      },
      onprogress: () => {
      },
      onload: () => {
      },
      ontimeout: () => {
      },
      onerror: () => {
      },
      onabort: () => {
      },
      abort: () => {
        aborted = true;
        xhr.abort();
      }
    };
    let aborted = false;
    let headersReceived = false;
    options = {
      method: "POST",
      headers: {},
      withCredentials: false,
      ...options
    };
    url = encodeURI(url);
    if (isGet(options.method) && data3) {
      url = `${url}${encodeURIComponent(typeof data3 === "string" ? data3 : JSON.stringify(data3))}`;
    }
    const xhr = new XMLHttpRequest();
    const process = isGet(options.method) ? xhr : xhr.upload;
    process.onprogress = (e) => {
      if (aborted) {
        return;
      }
      api.onprogress(e.lengthComputable, e.loaded, e.total);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState < 2) {
        return;
      }
      if (xhr.readyState === 4 && xhr.status === 0) {
        return;
      }
      if (headersReceived) {
        return;
      }
      headersReceived = true;
      api.onheaders(xhr);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        api.onload(xhr);
      } else {
        api.onerror(xhr);
      }
    };
    xhr.onerror = () => api.onerror(xhr);
    xhr.onabort = () => {
      aborted = true;
      api.onabort();
    };
    xhr.ontimeout = () => api.ontimeout(xhr);
    xhr.open(options.method, url, true);
    if (isInt(options.timeout)) {
      xhr.timeout = options.timeout;
    }
    Object.keys(options.headers).forEach((key) => {
      const value = unescape(encodeURIComponent(options.headers[key]));
      xhr.setRequestHeader(key, value);
    });
    if (options.responseType) {
      xhr.responseType = options.responseType;
    }
    if (options.withCredentials) {
      xhr.withCredentials = true;
    }
    xhr.send(data3);
    return api;
  };
  var createResponse = (type, code, body, headers) => ({
    type,
    code,
    body,
    headers
  });
  var createTimeoutResponse = (cb) => (xhr) => {
    cb(createResponse("error", 0, "Timeout", xhr.getAllResponseHeaders()));
  };
  var hasQS = (str) => /\?/.test(str);
  var buildURL = (...parts) => {
    let url = "";
    parts.forEach((part) => {
      url += hasQS(url) && hasQS(part) ? part.replace(/\?/, "&") : part;
    });
    return url;
  };
  var createFetchFunction = (apiUrl = "", action) => {
    if (typeof action === "function") {
      return action;
    }
    if (!action || !isString(action.url)) {
      return null;
    }
    const onload = action.onload || ((res2) => res2);
    const onerror = action.onerror || ((res2) => null);
    return (url, load, error2, progress, abort, headers) => {
      const request = sendRequest(url, buildURL(apiUrl, action.url), {
        ...action,
        responseType: "blob"
      });
      request.onload = (xhr) => {
        const headers2 = xhr.getAllResponseHeaders();
        const filename = getFileInfoFromHeaders(headers2).name || getFilenameFromURL(url);
        load(
          createResponse(
            "load",
            xhr.status,
            action.method === "HEAD" ? null : getFileFromBlob(onload(xhr.response), filename),
            headers2
          )
        );
      };
      request.onerror = (xhr) => {
        error2(
          createResponse(
            "error",
            xhr.status,
            onerror(xhr.response) || xhr.statusText,
            xhr.getAllResponseHeaders()
          )
        );
      };
      request.onheaders = (xhr) => {
        headers(createResponse("headers", xhr.status, null, xhr.getAllResponseHeaders()));
      };
      request.ontimeout = createTimeoutResponse(error2);
      request.onprogress = progress;
      request.onabort = abort;
      return request;
    };
  };
  var ChunkStatus = {
    QUEUED: 0,
    COMPLETE: 1,
    PROCESSING: 2,
    ERROR: 3,
    WAITING: 4
  };
  var processFileChunked = (apiUrl, action, name2, file2, metadata, load, error2, progress, abort, transfer, options) => {
    const chunks = [];
    const { chunkTransferId, chunkServer, chunkSize, chunkRetryDelays } = options;
    const state2 = {
      serverId: chunkTransferId,
      aborted: false
    };
    const ondata = action.ondata || ((fd) => fd);
    const onload = action.onload || ((xhr, method) => method === "HEAD" ? xhr.getResponseHeader("Upload-Offset") : xhr.response);
    const onerror = action.onerror || ((res2) => null);
    const requestTransferId = (cb) => {
      const formData = new FormData();
      if (isObject(metadata)) formData.append(name2, JSON.stringify(metadata));
      const headers = typeof action.headers === "function" ? action.headers(file2, metadata) : {
        ...action.headers,
        "Upload-Length": file2.size
      };
      const requestParams = {
        ...action,
        headers
      };
      const request = sendRequest(ondata(formData), buildURL(apiUrl, action.url), requestParams);
      request.onload = (xhr) => cb(onload(xhr, requestParams.method));
      request.onerror = (xhr) => error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
      request.ontimeout = createTimeoutResponse(error2);
    };
    const requestTransferOffset = (cb) => {
      const requestUrl = buildURL(apiUrl, chunkServer.url, state2.serverId);
      const headers = typeof action.headers === "function" ? action.headers(state2.serverId) : {
        ...action.headers
      };
      const requestParams = {
        headers,
        method: "HEAD"
      };
      const request = sendRequest(null, requestUrl, requestParams);
      request.onload = (xhr) => cb(onload(xhr, requestParams.method));
      request.onerror = (xhr) => error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
      request.ontimeout = createTimeoutResponse(error2);
    };
    const lastChunkIndex = Math.floor(file2.size / chunkSize);
    for (let i = 0; i <= lastChunkIndex; i++) {
      const offset = i * chunkSize;
      const data3 = file2.slice(offset, offset + chunkSize, "application/offset+octet-stream");
      chunks[i] = {
        index: i,
        size: data3.size,
        offset,
        data: data3,
        file: file2,
        progress: 0,
        retries: [...chunkRetryDelays],
        status: ChunkStatus.QUEUED,
        error: null,
        request: null,
        timeout: null
      };
    }
    const completeProcessingChunks = () => load(state2.serverId);
    const canProcessChunk = (chunk) => chunk.status === ChunkStatus.QUEUED || chunk.status === ChunkStatus.ERROR;
    const processChunk = (chunk) => {
      if (state2.aborted) return;
      chunk = chunk || chunks.find(canProcessChunk);
      if (!chunk) {
        if (chunks.every((chunk2) => chunk2.status === ChunkStatus.COMPLETE)) {
          completeProcessingChunks();
        }
        return;
      }
      chunk.status = ChunkStatus.PROCESSING;
      chunk.progress = null;
      const ondata2 = chunkServer.ondata || ((fd) => fd);
      const onerror2 = chunkServer.onerror || ((res2) => null);
      const requestUrl = buildURL(apiUrl, chunkServer.url, state2.serverId);
      const headers = typeof chunkServer.headers === "function" ? chunkServer.headers(chunk) : {
        ...chunkServer.headers,
        "Content-Type": "application/offset+octet-stream",
        "Upload-Offset": chunk.offset,
        "Upload-Length": file2.size,
        "Upload-Name": file2.name
      };
      const request = chunk.request = sendRequest(ondata2(chunk.data), requestUrl, {
        ...chunkServer,
        headers
      });
      request.onload = () => {
        chunk.status = ChunkStatus.COMPLETE;
        chunk.request = null;
        processChunks();
      };
      request.onprogress = (lengthComputable, loaded, total) => {
        chunk.progress = lengthComputable ? loaded : null;
        updateTotalProgress();
      };
      request.onerror = (xhr) => {
        chunk.status = ChunkStatus.ERROR;
        chunk.request = null;
        chunk.error = onerror2(xhr.response) || xhr.statusText;
        if (!retryProcessChunk(chunk)) {
          error2(
            createResponse(
              "error",
              xhr.status,
              onerror2(xhr.response) || xhr.statusText,
              xhr.getAllResponseHeaders()
            )
          );
        }
      };
      request.ontimeout = (xhr) => {
        chunk.status = ChunkStatus.ERROR;
        chunk.request = null;
        if (!retryProcessChunk(chunk)) {
          createTimeoutResponse(error2)(xhr);
        }
      };
      request.onabort = () => {
        chunk.status = ChunkStatus.QUEUED;
        chunk.request = null;
        abort();
      };
    };
    const retryProcessChunk = (chunk) => {
      if (chunk.retries.length === 0) return false;
      chunk.status = ChunkStatus.WAITING;
      clearTimeout(chunk.timeout);
      chunk.timeout = setTimeout(() => {
        processChunk(chunk);
      }, chunk.retries.shift());
      return true;
    };
    const updateTotalProgress = () => {
      const totalBytesTransfered = chunks.reduce((p, chunk) => {
        if (p === null || chunk.progress === null) return null;
        return p + chunk.progress;
      }, 0);
      if (totalBytesTransfered === null) return progress(false, 0, 0);
      const totalSize = chunks.reduce((total, chunk) => total + chunk.size, 0);
      progress(true, totalBytesTransfered, totalSize);
    };
    const processChunks = () => {
      const totalProcessing = chunks.filter((chunk) => chunk.status === ChunkStatus.PROCESSING).length;
      if (totalProcessing >= 1) return;
      processChunk();
    };
    const abortChunks = () => {
      chunks.forEach((chunk) => {
        clearTimeout(chunk.timeout);
        if (chunk.request) {
          chunk.request.abort();
        }
      });
    };
    if (!state2.serverId) {
      requestTransferId((serverId) => {
        if (state2.aborted) return;
        transfer(serverId);
        state2.serverId = serverId;
        processChunks();
      });
    } else {
      requestTransferOffset((offset) => {
        if (state2.aborted) return;
        chunks.filter((chunk) => chunk.offset < offset).forEach((chunk) => {
          chunk.status = ChunkStatus.COMPLETE;
          chunk.progress = chunk.size;
        });
        processChunks();
      });
    }
    return {
      abort: () => {
        state2.aborted = true;
        abortChunks();
      }
    };
  };
  var createFileProcessorFunction = (apiUrl, action, name2, options) => (file2, metadata, load, error2, progress, abort, transfer) => {
    if (!file2) return;
    const canChunkUpload = options.chunkUploads;
    const shouldChunkUpload = canChunkUpload && file2.size > options.chunkSize;
    const willChunkUpload = canChunkUpload && (shouldChunkUpload || options.chunkForce);
    if (file2 instanceof Blob && willChunkUpload)
      return processFileChunked(
        apiUrl,
        action,
        name2,
        file2,
        metadata,
        load,
        error2,
        progress,
        abort,
        transfer,
        options
      );
    const ondata = action.ondata || ((fd) => fd);
    const onload = action.onload || ((res2) => res2);
    const onerror = action.onerror || ((res2) => null);
    const headers = typeof action.headers === "function" ? action.headers(file2, metadata) || {} : {
      ...action.headers
    };
    const requestParams = {
      ...action,
      headers
    };
    var formData = new FormData();
    if (isObject(metadata)) {
      formData.append(name2, JSON.stringify(metadata));
    }
    (file2 instanceof Blob ? [{ name: null, file: file2 }] : file2).forEach((item2) => {
      formData.append(
        name2,
        item2.file,
        item2.name === null ? item2.file.name : `${item2.name}${item2.file.name}`
      );
    });
    const request = sendRequest(ondata(formData), buildURL(apiUrl, action.url), requestParams);
    request.onload = (xhr) => {
      load(createResponse("load", xhr.status, onload(xhr.response), xhr.getAllResponseHeaders()));
    };
    request.onerror = (xhr) => {
      error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
    };
    request.ontimeout = createTimeoutResponse(error2);
    request.onprogress = progress;
    request.onabort = abort;
    return request;
  };
  var createProcessorFunction = (apiUrl = "", action, name2, options) => {
    if (typeof action === "function") return (...params) => action(name2, ...params, options);
    if (!action || !isString(action.url)) return null;
    return createFileProcessorFunction(apiUrl, action, name2, options);
  };
  var createRevertFunction = (apiUrl = "", action) => {
    if (typeof action === "function") {
      return action;
    }
    if (!action || !isString(action.url)) {
      return (uniqueFileId, load) => load();
    }
    const onload = action.onload || ((res2) => res2);
    const onerror = action.onerror || ((res2) => null);
    return (uniqueFileId, load, error2) => {
      const request = sendRequest(
        uniqueFileId,
        apiUrl + action.url,
        action
        // contains method, headers and withCredentials properties
      );
      request.onload = (xhr) => {
        load(
          createResponse(
            "load",
            xhr.status,
            onload(xhr.response),
            xhr.getAllResponseHeaders()
          )
        );
      };
      request.onerror = (xhr) => {
        error2(
          createResponse(
            "error",
            xhr.status,
            onerror(xhr.response) || xhr.statusText,
            xhr.getAllResponseHeaders()
          )
        );
      };
      request.ontimeout = createTimeoutResponse(error2);
      return request;
    };
  };
  var getRandomNumber = (min = 0, max = 1) => min + Math.random() * (max - min);
  var createPerceivedPerformanceUpdater = (cb, duration = 1e3, offset = 0, tickMin = 25, tickMax = 250) => {
    let timeout = null;
    const start = Date.now();
    const tick = () => {
      let runtime = Date.now() - start;
      let delay = getRandomNumber(tickMin, tickMax);
      if (runtime + delay > duration) {
        delay = runtime + delay - duration;
      }
      let progress = runtime / duration;
      if (progress >= 1 || document.hidden) {
        cb(1);
        return;
      }
      cb(progress);
      timeout = setTimeout(tick, delay);
    };
    if (duration > 0) tick();
    return {
      clear: () => {
        clearTimeout(timeout);
      }
    };
  };
  var createFileProcessor = (processFn, options) => {
    const state2 = {
      complete: false,
      perceivedProgress: 0,
      perceivedPerformanceUpdater: null,
      progress: null,
      timestamp: null,
      perceivedDuration: 0,
      duration: 0,
      request: null,
      response: null
    };
    const { allowMinimumUploadDuration } = options;
    const process = (file2, metadata) => {
      const progressFn = () => {
        if (state2.duration === 0 || state2.progress === null) return;
        api.fire("progress", api.getProgress());
      };
      const completeFn = () => {
        state2.complete = true;
        api.fire("load-perceived", state2.response.body);
      };
      api.fire("start");
      state2.timestamp = Date.now();
      state2.perceivedPerformanceUpdater = createPerceivedPerformanceUpdater(
        (progress) => {
          state2.perceivedProgress = progress;
          state2.perceivedDuration = Date.now() - state2.timestamp;
          progressFn();
          if (state2.response && state2.perceivedProgress === 1 && !state2.complete) {
            completeFn();
          }
        },
        // random delay as in a list of files you start noticing
        // files uploading at the exact same speed
        allowMinimumUploadDuration ? getRandomNumber(750, 1500) : 0
      );
      state2.request = processFn(
        // the file to process
        file2,
        // the metadata to send along
        metadata,
        // callbacks (load, error, progress, abort, transfer)
        // load expects the body to be a server id if
        // you want to make use of revert
        (response) => {
          state2.response = isObject(response) ? response : {
            type: "load",
            code: 200,
            body: `${response}`,
            headers: {}
          };
          state2.duration = Date.now() - state2.timestamp;
          state2.progress = 1;
          api.fire("load", state2.response.body);
          if (!allowMinimumUploadDuration || allowMinimumUploadDuration && state2.perceivedProgress === 1) {
            completeFn();
          }
        },
        // error is expected to be an object with type, code, body
        (error2) => {
          state2.perceivedPerformanceUpdater.clear();
          api.fire(
            "error",
            isObject(error2) ? error2 : {
              type: "error",
              code: 0,
              body: `${error2}`
            }
          );
        },
        // actual processing progress
        (computable, current, total) => {
          state2.duration = Date.now() - state2.timestamp;
          state2.progress = computable ? current / total : null;
          progressFn();
        },
        // abort does not expect a value
        () => {
          state2.perceivedPerformanceUpdater.clear();
          api.fire("abort", state2.response ? state2.response.body : null);
        },
        // register the id for this transfer
        (transferId) => {
          api.fire("transfer", transferId);
        }
      );
    };
    const abort = () => {
      if (!state2.request) return;
      state2.perceivedPerformanceUpdater.clear();
      if (state2.request.abort) state2.request.abort();
      state2.complete = true;
    };
    const reset = () => {
      abort();
      state2.complete = false;
      state2.perceivedProgress = 0;
      state2.progress = 0;
      state2.timestamp = null;
      state2.perceivedDuration = 0;
      state2.duration = 0;
      state2.request = null;
      state2.response = null;
    };
    const getProgress = allowMinimumUploadDuration ? () => state2.progress ? Math.min(state2.progress, state2.perceivedProgress) : null : () => state2.progress || null;
    const getDuration = allowMinimumUploadDuration ? () => Math.min(state2.duration, state2.perceivedDuration) : () => state2.duration;
    const api = {
      ...on(),
      process,
      // start processing file
      abort,
      // abort active process request
      getProgress,
      getDuration,
      reset
    };
    return api;
  };
  var getFilenameWithoutExtension = (name2) => name2.substring(0, name2.lastIndexOf(".")) || name2;
  var createFileStub = (source) => {
    let data3 = [source.name, source.size, source.type];
    if (source instanceof Blob || isBase64DataURI(source)) {
      data3[0] = source.name || getDateString();
    } else if (isBase64DataURI(source)) {
      data3[1] = source.length;
      data3[2] = getMimeTypeFromBase64DataURI(source);
    } else if (isString(source)) {
      data3[0] = getFilenameFromURL(source);
      data3[1] = 0;
      data3[2] = "application/octet-stream";
    }
    return {
      name: data3[0],
      size: data3[1],
      type: data3[2]
    };
  };
  var isFile = (value) => !!(value instanceof File || value instanceof Blob && value.name);
  var deepCloneObject = (src) => {
    if (!isObject(src)) return src;
    const target = isArray(src) ? [] : {};
    for (const key in src) {
      if (!src.hasOwnProperty(key)) continue;
      const v = src[key];
      target[key] = v && isObject(v) ? deepCloneObject(v) : v;
    }
    return target;
  };
  var createItem = (origin = null, serverFileReference = null, file2 = null) => {
    const id = getUniqueId();
    const state2 = {
      // is archived
      archived: false,
      // if is frozen, no longer fires events
      frozen: false,
      // removed from view
      released: false,
      // original source
      source: null,
      // file model reference
      file: file2,
      // id of file on server
      serverFileReference,
      // id of file transfer on server
      transferId: null,
      // is aborted
      processingAborted: false,
      // current item status
      status: serverFileReference ? ItemStatus.PROCESSING_COMPLETE : ItemStatus.INIT,
      // active processes
      activeLoader: null,
      activeProcessor: null
    };
    let abortProcessingRequestComplete = null;
    const metadata = {};
    const setStatus = (status) => state2.status = status;
    const fire = (event, ...params) => {
      if (state2.released || state2.frozen) return;
      api.fire(event, ...params);
    };
    const getFileExtension = () => getExtensionFromFilename(state2.file.name);
    const getFileType = () => state2.file.type;
    const getFileSize = () => state2.file.size;
    const getFile = () => state2.file;
    const load = (source, loader, onload) => {
      state2.source = source;
      api.fireSync("init");
      if (state2.file) {
        api.fireSync("load-skip");
        return;
      }
      state2.file = createFileStub(source);
      loader.on("init", () => {
        fire("load-init");
      });
      loader.on("meta", (meta) => {
        state2.file.size = meta.size;
        state2.file.filename = meta.filename;
        if (meta.source) {
          origin = FileOrigin.LIMBO;
          state2.serverFileReference = meta.source;
          state2.status = ItemStatus.PROCESSING_COMPLETE;
        }
        fire("load-meta");
      });
      loader.on("progress", (progress) => {
        setStatus(ItemStatus.LOADING);
        fire("load-progress", progress);
      });
      loader.on("error", (error2) => {
        setStatus(ItemStatus.LOAD_ERROR);
        fire("load-request-error", error2);
      });
      loader.on("abort", () => {
        setStatus(ItemStatus.INIT);
        fire("load-abort");
      });
      loader.on("load", (file3) => {
        state2.activeLoader = null;
        const success = (result) => {
          state2.file = isFile(result) ? result : state2.file;
          if (origin === FileOrigin.LIMBO && state2.serverFileReference) {
            setStatus(ItemStatus.PROCESSING_COMPLETE);
          } else {
            setStatus(ItemStatus.IDLE);
          }
          fire("load");
        };
        const error2 = (result) => {
          state2.file = file3;
          fire("load-meta");
          setStatus(ItemStatus.LOAD_ERROR);
          fire("load-file-error", result);
        };
        if (state2.serverFileReference) {
          success(file3);
          return;
        }
        onload(file3, success, error2);
      });
      loader.setSource(source);
      state2.activeLoader = loader;
      loader.load();
    };
    const retryLoad = () => {
      if (!state2.activeLoader) {
        return;
      }
      state2.activeLoader.load();
    };
    const abortLoad = () => {
      if (state2.activeLoader) {
        state2.activeLoader.abort();
        return;
      }
      setStatus(ItemStatus.INIT);
      fire("load-abort");
    };
    const process = (processor, onprocess) => {
      if (state2.processingAborted) {
        state2.processingAborted = false;
        return;
      }
      setStatus(ItemStatus.PROCESSING);
      abortProcessingRequestComplete = null;
      if (!(state2.file instanceof Blob)) {
        api.on("load", () => {
          process(processor, onprocess);
        });
        return;
      }
      processor.on("load", (serverFileReference2) => {
        state2.transferId = null;
        state2.serverFileReference = serverFileReference2;
      });
      processor.on("transfer", (transferId) => {
        state2.transferId = transferId;
      });
      processor.on("load-perceived", (serverFileReference2) => {
        state2.activeProcessor = null;
        state2.transferId = null;
        state2.serverFileReference = serverFileReference2;
        setStatus(ItemStatus.PROCESSING_COMPLETE);
        fire("process-complete", serverFileReference2);
      });
      processor.on("start", () => {
        fire("process-start");
      });
      processor.on("error", (error3) => {
        state2.activeProcessor = null;
        setStatus(ItemStatus.PROCESSING_ERROR);
        fire("process-error", error3);
      });
      processor.on("abort", (serverFileReference2) => {
        state2.activeProcessor = null;
        state2.serverFileReference = serverFileReference2;
        setStatus(ItemStatus.IDLE);
        fire("process-abort");
        if (abortProcessingRequestComplete) {
          abortProcessingRequestComplete();
        }
      });
      processor.on("progress", (progress) => {
        fire("process-progress", progress);
      });
      const success = (file3) => {
        if (state2.archived) return;
        processor.process(file3, { ...metadata });
      };
      const error2 = console.error;
      onprocess(state2.file, success, error2);
      state2.activeProcessor = processor;
    };
    const requestProcessing = () => {
      state2.processingAborted = false;
      setStatus(ItemStatus.PROCESSING_QUEUED);
    };
    const abortProcessing = () => new Promise((resolve) => {
      if (!state2.activeProcessor) {
        state2.processingAborted = true;
        setStatus(ItemStatus.IDLE);
        fire("process-abort");
        resolve();
        return;
      }
      abortProcessingRequestComplete = () => {
        resolve();
      };
      state2.activeProcessor.abort();
    });
    const revert = (revertFileUpload, forceRevert) => new Promise((resolve, reject) => {
      const serverTransferId = state2.serverFileReference !== null ? state2.serverFileReference : state2.transferId;
      if (serverTransferId === null) {
        resolve();
        return;
      }
      revertFileUpload(
        serverTransferId,
        () => {
          state2.serverFileReference = null;
          state2.transferId = null;
          resolve();
        },
        (error2) => {
          if (!forceRevert) {
            resolve();
            return;
          }
          setStatus(ItemStatus.PROCESSING_REVERT_ERROR);
          fire("process-revert-error");
          reject(error2);
        }
      );
      setStatus(ItemStatus.IDLE);
      fire("process-revert");
    });
    const setMetadata = (key, value, silent) => {
      const keys = key.split(".");
      const root2 = keys[0];
      const last = keys.pop();
      let data3 = metadata;
      keys.forEach((key2) => data3 = data3[key2]);
      if (JSON.stringify(data3[last]) === JSON.stringify(value)) return;
      data3[last] = value;
      fire("metadata-update", {
        key: root2,
        value: metadata[root2],
        silent
      });
    };
    const getMetadata = (key) => deepCloneObject(key ? metadata[key] : metadata);
    const api = {
      id: { get: () => id },
      origin: { get: () => origin, set: (value) => origin = value },
      serverId: { get: () => state2.serverFileReference },
      transferId: { get: () => state2.transferId },
      status: { get: () => state2.status },
      filename: { get: () => state2.file.name },
      filenameWithoutExtension: { get: () => getFilenameWithoutExtension(state2.file.name) },
      fileExtension: { get: getFileExtension },
      fileType: { get: getFileType },
      fileSize: { get: getFileSize },
      file: { get: getFile },
      relativePath: { get: () => state2.file._relativePath },
      source: { get: () => state2.source },
      getMetadata,
      setMetadata: (key, value, silent) => {
        if (isObject(key)) {
          const data3 = key;
          Object.keys(data3).forEach((key2) => {
            setMetadata(key2, data3[key2], value);
          });
          return key;
        }
        setMetadata(key, value, silent);
        return value;
      },
      extend: (name2, handler) => itemAPI[name2] = handler,
      abortLoad,
      retryLoad,
      requestProcessing,
      abortProcessing,
      load,
      process,
      revert,
      ...on(),
      freeze: () => state2.frozen = true,
      release: () => state2.released = true,
      released: { get: () => state2.released },
      archive: () => state2.archived = true,
      archived: { get: () => state2.archived },
      // replace source and file object
      setFile: (file3) => state2.file = file3
    };
    const itemAPI = createObject(api);
    return itemAPI;
  };
  var getItemIndexByQuery = (items, query) => {
    if (isEmpty(query)) {
      return 0;
    }
    if (!isString(query)) {
      return -1;
    }
    return items.findIndex((item2) => item2.id === query);
  };
  var getItemById = (items, itemId) => {
    const index = getItemIndexByQuery(items, itemId);
    if (index < 0) {
      return;
    }
    return items[index] || null;
  };
  var fetchBlob = (url, load, error2, progress, abort, headers) => {
    const request = sendRequest(null, url, {
      method: "GET",
      responseType: "blob"
    });
    request.onload = (xhr) => {
      const headers2 = xhr.getAllResponseHeaders();
      const filename = getFileInfoFromHeaders(headers2).name || getFilenameFromURL(url);
      load(createResponse("load", xhr.status, getFileFromBlob(xhr.response, filename), headers2));
    };
    request.onerror = (xhr) => {
      error2(createResponse("error", xhr.status, xhr.statusText, xhr.getAllResponseHeaders()));
    };
    request.onheaders = (xhr) => {
      headers(createResponse("headers", xhr.status, null, xhr.getAllResponseHeaders()));
    };
    request.ontimeout = createTimeoutResponse(error2);
    request.onprogress = progress;
    request.onabort = abort;
    return request;
  };
  var getDomainFromURL = (url) => {
    if (url.indexOf("//") === 0) {
      url = location.protocol + url;
    }
    return url.toLowerCase().replace("blob:", "").replace(/([a-z])?:\/\//, "$1").split("/")[0];
  };
  var isExternalURL = (url) => (url.indexOf(":") > -1 || url.indexOf("//") > -1) && getDomainFromURL(location.href) !== getDomainFromURL(url);
  var dynamicLabel = (label) => (...params) => isFunction(label) ? label(...params) : label;
  var isMockItem = (item2) => !isFile(item2.file);
  var listUpdated = (dispatch, state2) => {
    clearTimeout(state2.listUpdateTimeout);
    state2.listUpdateTimeout = setTimeout(() => {
      dispatch("DID_UPDATE_ITEMS", { items: getActiveItems(state2.items) });
    }, 0);
  };
  var optionalPromise = (fn2, ...params) => new Promise((resolve) => {
    if (!fn2) {
      return resolve(true);
    }
    const result = fn2(...params);
    if (result == null) {
      return resolve(true);
    }
    if (typeof result === "boolean") {
      return resolve(result);
    }
    if (typeof result.then === "function") {
      result.then(resolve);
    }
  });
  var sortItems = (state2, compare) => {
    state2.items.sort((a, b) => compare(createItemAPI(a), createItemAPI(b)));
  };
  var getItemByQueryFromState = (state2, itemHandler) => ({
    query,
    success = () => {
    },
    failure = () => {
    },
    ...options
  } = {}) => {
    const item2 = getItemByQuery(state2.items, query);
    if (!item2) {
      failure({
        error: createResponse("error", 0, "Item not found"),
        file: null
      });
      return;
    }
    itemHandler(item2, success, failure, options || {});
  };
  var actions = (dispatch, query, state2) => ({
    /**
     * Aborts all ongoing processes
     */
    ABORT_ALL: () => {
      getActiveItems(state2.items).forEach((item2) => {
        item2.freeze();
        item2.abortLoad();
        item2.abortProcessing();
      });
    },
    /**
     * Sets initial files
     */
    DID_SET_FILES: ({ value = [] }) => {
      const files = value.map((file2) => ({
        source: file2.source ? file2.source : file2,
        options: file2.options
      }));
      let activeItems = getActiveItems(state2.items);
      activeItems.forEach((item2) => {
        if (!files.find((file2) => file2.source === item2.source || file2.source === item2.file)) {
          dispatch("REMOVE_ITEM", { query: item2, remove: false });
        }
      });
      activeItems = getActiveItems(state2.items);
      files.forEach((file2, index) => {
        if (activeItems.find((item2) => item2.source === file2.source || item2.file === file2.source))
          return;
        dispatch("ADD_ITEM", {
          ...file2,
          interactionMethod: InteractionMethod.NONE,
          index
        });
      });
    },
    DID_UPDATE_ITEM_METADATA: ({ id, action, change }) => {
      if (change.silent) return;
      clearTimeout(state2.itemUpdateTimeout);
      state2.itemUpdateTimeout = setTimeout(() => {
        const item2 = getItemById(state2.items, id);
        if (!query("IS_ASYNC")) {
          applyFilterChain("SHOULD_PREPARE_OUTPUT", false, {
            item: item2,
            query,
            action,
            change
          }).then((shouldPrepareOutput) => {
            const beforePrepareFile = query("GET_BEFORE_PREPARE_FILE");
            if (beforePrepareFile)
              shouldPrepareOutput = beforePrepareFile(item2, shouldPrepareOutput);
            if (!shouldPrepareOutput) return;
            dispatch(
              "REQUEST_PREPARE_OUTPUT",
              {
                query: id,
                item: item2,
                success: (file2) => {
                  dispatch("DID_PREPARE_OUTPUT", { id, file: file2 });
                }
              },
              true
            );
          });
          return;
        }
        if (item2.origin === FileOrigin.LOCAL) {
          dispatch("DID_LOAD_ITEM", {
            id: item2.id,
            error: null,
            serverFileReference: item2.source
          });
        }
        const upload = () => {
          setTimeout(() => {
            dispatch("REQUEST_ITEM_PROCESSING", { query: id });
          }, 32);
        };
        const revert = (doUpload) => {
          item2.revert(
            createRevertFunction(state2.options.server.url, state2.options.server.revert),
            query("GET_FORCE_REVERT")
          ).then(doUpload ? upload : () => {
          }).catch(() => {
          });
        };
        const abort = (doUpload) => {
          item2.abortProcessing().then(doUpload ? upload : () => {
          });
        };
        if (item2.status === ItemStatus.PROCESSING_COMPLETE) {
          return revert(state2.options.instantUpload);
        }
        if (item2.status === ItemStatus.PROCESSING) {
          return abort(state2.options.instantUpload);
        }
        if (state2.options.instantUpload) {
          upload();
        }
      }, 0);
    },
    MOVE_ITEM: ({ query: query2, index }) => {
      const item2 = getItemByQuery(state2.items, query2);
      if (!item2) return;
      const currentIndex = state2.items.indexOf(item2);
      index = limit(index, 0, state2.items.length - 1);
      if (currentIndex === index) return;
      state2.items.splice(index, 0, state2.items.splice(currentIndex, 1)[0]);
    },
    SORT: ({ compare }) => {
      sortItems(state2, compare);
      dispatch("DID_SORT_ITEMS", {
        items: query("GET_ACTIVE_ITEMS")
      });
    },
    ADD_ITEMS: ({ items, index, interactionMethod, success = () => {
    }, failure = () => {
    } }) => {
      let currentIndex = index;
      if (index === -1 || typeof index === "undefined") {
        const insertLocation = query("GET_ITEM_INSERT_LOCATION");
        const totalItems = query("GET_TOTAL_ITEMS");
        currentIndex = insertLocation === "before" ? 0 : totalItems;
      }
      const ignoredFiles = query("GET_IGNORED_FILES");
      const isValidFile = (source) => isFile(source) ? !ignoredFiles.includes(source.name.toLowerCase()) : !isEmpty(source);
      const validItems = items.filter(isValidFile);
      const promises = validItems.map(
        (source) => new Promise((resolve, reject) => {
          dispatch("ADD_ITEM", {
            interactionMethod,
            source: source.source || source,
            success: resolve,
            failure: reject,
            index: currentIndex++,
            options: source.options || {}
          });
        })
      );
      Promise.all(promises).then(success).catch(failure);
    },
    /**
     * @param source
     * @param index
     * @param interactionMethod
     */
    ADD_ITEM: ({
      source,
      index = -1,
      interactionMethod,
      success = () => {
      },
      failure = () => {
      },
      options = {}
    }) => {
      if (isEmpty(source)) {
        failure({
          error: createResponse("error", 0, "No source"),
          file: null
        });
        return;
      }
      if (isFile(source) && state2.options.ignoredFiles.includes(source.name.toLowerCase())) {
        return;
      }
      if (!hasRoomForItem(state2)) {
        if (state2.options.allowMultiple || !state2.options.allowMultiple && !state2.options.allowReplace) {
          const error2 = createResponse("warning", 0, "Max files");
          dispatch("DID_THROW_MAX_FILES", {
            source,
            error: error2
          });
          failure({ error: error2, file: null });
          return;
        }
        const item3 = getActiveItems(state2.items)[0];
        if (item3.status === ItemStatus.PROCESSING_COMPLETE || item3.status === ItemStatus.PROCESSING_REVERT_ERROR) {
          const forceRevert = query("GET_FORCE_REVERT");
          item3.revert(
            createRevertFunction(state2.options.server.url, state2.options.server.revert),
            forceRevert
          ).then(() => {
            if (!forceRevert) return;
            dispatch("ADD_ITEM", {
              source,
              index,
              interactionMethod,
              success,
              failure,
              options
            });
          }).catch(() => {
          });
          if (forceRevert) return;
        }
        dispatch("REMOVE_ITEM", { query: item3.id });
      }
      const origin = options.type === "local" ? FileOrigin.LOCAL : options.type === "limbo" ? FileOrigin.LIMBO : FileOrigin.INPUT;
      const item2 = createItem(
        // where did this file come from
        origin,
        // an input file never has a server file reference
        origin === FileOrigin.INPUT ? null : source,
        // file mock data, if defined
        options.file
      );
      Object.keys(options.metadata || {}).forEach((key) => {
        item2.setMetadata(key, options.metadata[key]);
      });
      applyFilters("DID_CREATE_ITEM", item2, { query, dispatch });
      const itemInsertLocation = query("GET_ITEM_INSERT_LOCATION");
      if (!state2.options.itemInsertLocationFreedom) {
        index = itemInsertLocation === "before" ? -1 : state2.items.length;
      }
      insertItem(state2.items, item2, index);
      if (isFunction(itemInsertLocation) && source) {
        sortItems(state2, itemInsertLocation);
      }
      const id = item2.id;
      item2.on("init", () => {
        dispatch("DID_INIT_ITEM", { id });
      });
      item2.on("load-init", () => {
        dispatch("DID_START_ITEM_LOAD", { id });
      });
      item2.on("load-meta", () => {
        dispatch("DID_UPDATE_ITEM_META", { id });
      });
      item2.on("load-progress", (progress) => {
        dispatch("DID_UPDATE_ITEM_LOAD_PROGRESS", { id, progress });
      });
      item2.on("load-request-error", (error2) => {
        const mainStatus = dynamicLabel(state2.options.labelFileLoadError)(error2);
        if (error2.code >= 400 && error2.code < 500) {
          dispatch("DID_THROW_ITEM_INVALID", {
            id,
            error: error2,
            status: {
              main: mainStatus,
              sub: `${error2.code} (${error2.body})`
            }
          });
          failure({ error: error2, file: createItemAPI(item2) });
          return;
        }
        dispatch("DID_THROW_ITEM_LOAD_ERROR", {
          id,
          error: error2,
          status: {
            main: mainStatus,
            sub: state2.options.labelTapToRetry
          }
        });
      });
      item2.on("load-file-error", (error2) => {
        dispatch("DID_THROW_ITEM_INVALID", {
          id,
          error: error2.status,
          status: error2.status
        });
        failure({ error: error2.status, file: createItemAPI(item2) });
      });
      item2.on("load-abort", () => {
        dispatch("REMOVE_ITEM", { query: id });
      });
      item2.on("load-skip", () => {
        item2.on("metadata-update", (change) => {
          if (!isFile(item2.file)) return;
          dispatch("DID_UPDATE_ITEM_METADATA", { id, change });
        });
        dispatch("COMPLETE_LOAD_ITEM", {
          query: id,
          item: item2,
          data: {
            source,
            success
          }
        });
      });
      item2.on("load", () => {
        const handleAdd = (shouldAdd) => {
          if (!shouldAdd) {
            dispatch("REMOVE_ITEM", {
              query: id
            });
            return;
          }
          item2.on("metadata-update", (change) => {
            dispatch("DID_UPDATE_ITEM_METADATA", { id, change });
          });
          applyFilterChain("SHOULD_PREPARE_OUTPUT", false, { item: item2, query }).then(
            (shouldPrepareOutput) => {
              const beforePrepareFile = query("GET_BEFORE_PREPARE_FILE");
              if (beforePrepareFile)
                shouldPrepareOutput = beforePrepareFile(item2, shouldPrepareOutput);
              const loadComplete = () => {
                dispatch("COMPLETE_LOAD_ITEM", {
                  query: id,
                  item: item2,
                  data: {
                    source,
                    success
                  }
                });
                listUpdated(dispatch, state2);
              };
              if (shouldPrepareOutput) {
                dispatch(
                  "REQUEST_PREPARE_OUTPUT",
                  {
                    query: id,
                    item: item2,
                    success: (file2) => {
                      dispatch("DID_PREPARE_OUTPUT", { id, file: file2 });
                      loadComplete();
                    }
                  },
                  true
                );
                return;
              }
              loadComplete();
            }
          );
        };
        applyFilterChain("DID_LOAD_ITEM", item2, { query, dispatch }).then(() => {
          optionalPromise(query("GET_BEFORE_ADD_FILE"), createItemAPI(item2)).then(
            handleAdd
          );
        }).catch((e) => {
          if (!e || !e.error || !e.status) return handleAdd(false);
          dispatch("DID_THROW_ITEM_INVALID", {
            id,
            error: e.error,
            status: e.status
          });
        });
      });
      item2.on("process-start", () => {
        dispatch("DID_START_ITEM_PROCESSING", { id });
      });
      item2.on("process-progress", (progress) => {
        dispatch("DID_UPDATE_ITEM_PROCESS_PROGRESS", { id, progress });
      });
      item2.on("process-error", (error2) => {
        dispatch("DID_THROW_ITEM_PROCESSING_ERROR", {
          id,
          error: error2,
          status: {
            main: dynamicLabel(state2.options.labelFileProcessingError)(error2),
            sub: state2.options.labelTapToRetry
          }
        });
      });
      item2.on("process-revert-error", (error2) => {
        dispatch("DID_THROW_ITEM_PROCESSING_REVERT_ERROR", {
          id,
          error: error2,
          status: {
            main: dynamicLabel(state2.options.labelFileProcessingRevertError)(error2),
            sub: state2.options.labelTapToRetry
          }
        });
      });
      item2.on("process-complete", (serverFileReference) => {
        dispatch("DID_COMPLETE_ITEM_PROCESSING", {
          id,
          error: null,
          serverFileReference
        });
        dispatch("DID_DEFINE_VALUE", { id, value: serverFileReference });
      });
      item2.on("process-abort", () => {
        dispatch("DID_ABORT_ITEM_PROCESSING", { id });
      });
      item2.on("process-revert", () => {
        dispatch("DID_REVERT_ITEM_PROCESSING", { id });
        dispatch("DID_DEFINE_VALUE", { id, value: null });
      });
      dispatch("DID_ADD_ITEM", { id, index, interactionMethod });
      listUpdated(dispatch, state2);
      const { url, load, restore, fetch } = state2.options.server || {};
      item2.load(
        source,
        // this creates a function that loads the file based on the type of file (string, base64, blob, file) and location of file (local, remote, limbo)
        createFileLoader(
          origin === FileOrigin.INPUT ? (
            // input, if is remote, see if should use custom fetch, else use default fetchBlob
            isString(source) && isExternalURL(source) ? fetch ? createFetchFunction(url, fetch) : fetchBlob : fetchBlob
          ) : (
            // limbo or local
            origin === FileOrigin.LIMBO ? createFetchFunction(url, restore) : createFetchFunction(url, load)
          )
          // local
        ),
        // called when the file is loaded so it can be piped through the filters
        (file2, success2, error2) => {
          applyFilterChain("LOAD_FILE", file2, { query }).then(success2).catch(error2);
        }
      );
    },
    REQUEST_PREPARE_OUTPUT: ({ item: item2, success, failure = () => {
    } }) => {
      const err = {
        error: createResponse("error", 0, "Item not found"),
        file: null
      };
      if (item2.archived) return failure(err);
      applyFilterChain("PREPARE_OUTPUT", item2.file, { query, item: item2 }).then((result) => {
        applyFilterChain("COMPLETE_PREPARE_OUTPUT", result, { query, item: item2 }).then((result2) => {
          if (item2.archived) return failure(err);
          success(result2);
        });
      });
    },
    COMPLETE_LOAD_ITEM: ({ item: item2, data: data3 }) => {
      const { success, source } = data3;
      const itemInsertLocation = query("GET_ITEM_INSERT_LOCATION");
      if (isFunction(itemInsertLocation) && source) {
        sortItems(state2, itemInsertLocation);
      }
      dispatch("DID_LOAD_ITEM", {
        id: item2.id,
        error: null,
        serverFileReference: item2.origin === FileOrigin.INPUT ? null : source
      });
      success(createItemAPI(item2));
      if (item2.origin === FileOrigin.LOCAL) {
        dispatch("DID_LOAD_LOCAL_ITEM", { id: item2.id });
        return;
      }
      if (item2.origin === FileOrigin.LIMBO) {
        dispatch("DID_COMPLETE_ITEM_PROCESSING", {
          id: item2.id,
          error: null,
          serverFileReference: source
        });
        dispatch("DID_DEFINE_VALUE", {
          id: item2.id,
          value: item2.serverId || source
        });
        return;
      }
      if (query("IS_ASYNC") && state2.options.instantUpload) {
        dispatch("REQUEST_ITEM_PROCESSING", { query: item2.id });
      }
    },
    RETRY_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
      item2.retryLoad();
    }),
    REQUEST_ITEM_PREPARE: getItemByQueryFromState(state2, (item2, success, failure) => {
      dispatch(
        "REQUEST_PREPARE_OUTPUT",
        {
          query: item2.id,
          item: item2,
          success: (file2) => {
            dispatch("DID_PREPARE_OUTPUT", { id: item2.id, file: file2 });
            success({
              file: item2,
              output: file2
            });
          },
          failure
        },
        true
      );
    }),
    REQUEST_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2, success, failure) => {
      const itemCanBeQueuedForProcessing = (
        // waiting for something
        item2.status === ItemStatus.IDLE || // processing went wrong earlier
        item2.status === ItemStatus.PROCESSING_ERROR
      );
      if (!itemCanBeQueuedForProcessing) {
        const processNow = () => dispatch("REQUEST_ITEM_PROCESSING", { query: item2, success, failure });
        const process = () => document.hidden ? processNow() : setTimeout(processNow, 32);
        if (item2.status === ItemStatus.PROCESSING_COMPLETE || item2.status === ItemStatus.PROCESSING_REVERT_ERROR) {
          item2.revert(
            createRevertFunction(state2.options.server.url, state2.options.server.revert),
            query("GET_FORCE_REVERT")
          ).then(process).catch(() => {
          });
        } else if (item2.status === ItemStatus.PROCESSING) {
          item2.abortProcessing().then(process);
        }
        return;
      }
      if (item2.status === ItemStatus.PROCESSING_QUEUED) return;
      item2.requestProcessing();
      dispatch("DID_REQUEST_ITEM_PROCESSING", { id: item2.id });
      dispatch("PROCESS_ITEM", { query: item2, success, failure }, true);
    }),
    PROCESS_ITEM: getItemByQueryFromState(state2, (item2, success, failure) => {
      const maxParallelUploads = query("GET_MAX_PARALLEL_UPLOADS");
      const totalCurrentUploads = query("GET_ITEMS_BY_STATUS", ItemStatus.PROCESSING).length;
      if (totalCurrentUploads === maxParallelUploads) {
        state2.processingQueue.push({
          id: item2.id,
          success,
          failure
        });
        return;
      }
      if (item2.status === ItemStatus.PROCESSING) return;
      const processNext = () => {
        const queueEntry = state2.processingQueue.shift();
        if (!queueEntry) return;
        const { id, success: success2, failure: failure2 } = queueEntry;
        const itemReference = getItemByQuery(state2.items, id);
        if (!itemReference || itemReference.archived) {
          processNext();
          return;
        }
        dispatch("PROCESS_ITEM", { query: id, success: success2, failure: failure2 }, true);
      };
      item2.onOnce("process-complete", () => {
        success(createItemAPI(item2));
        processNext();
        const server = state2.options.server;
        const instantUpload = state2.options.instantUpload;
        if (instantUpload && item2.origin === FileOrigin.LOCAL && isFunction(server.remove)) {
          const noop = () => {
          };
          item2.origin = FileOrigin.LIMBO;
          state2.options.server.remove(item2.source, noop, noop);
        }
        const allItemsProcessed = query("GET_ITEMS_BY_STATUS", ItemStatus.PROCESSING_COMPLETE).length === state2.items.length;
        if (allItemsProcessed) {
          dispatch("DID_COMPLETE_ITEM_PROCESSING_ALL");
        }
      });
      item2.onOnce("process-error", (error2) => {
        failure({ error: error2, file: createItemAPI(item2) });
        processNext();
      });
      const options = state2.options;
      item2.process(
        createFileProcessor(
          createProcessorFunction(options.server.url, options.server.process, options.name, {
            chunkTransferId: item2.transferId,
            chunkServer: options.server.patch,
            chunkUploads: options.chunkUploads,
            chunkForce: options.chunkForce,
            chunkSize: options.chunkSize,
            chunkRetryDelays: options.chunkRetryDelays
          }),
          {
            allowMinimumUploadDuration: query("GET_ALLOW_MINIMUM_UPLOAD_DURATION")
          }
        ),
        // called when the file is about to be processed so it can be piped through the transform filters
        (file2, success2, error2) => {
          applyFilterChain("PREPARE_OUTPUT", file2, { query, item: item2 }).then((file3) => {
            dispatch("DID_PREPARE_OUTPUT", { id: item2.id, file: file3 });
            success2(file3);
          }).catch(error2);
        }
      );
    }),
    RETRY_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
      dispatch("REQUEST_ITEM_PROCESSING", { query: item2 });
    }),
    REQUEST_REMOVE_ITEM: getItemByQueryFromState(state2, (item2) => {
      optionalPromise(query("GET_BEFORE_REMOVE_FILE"), createItemAPI(item2)).then((shouldRemove) => {
        if (!shouldRemove) {
          return;
        }
        dispatch("REMOVE_ITEM", { query: item2 });
      });
    }),
    RELEASE_ITEM: getItemByQueryFromState(state2, (item2) => {
      item2.release();
    }),
    REMOVE_ITEM: getItemByQueryFromState(state2, (item2, success, failure, options) => {
      const removeFromView = () => {
        const id = item2.id;
        getItemById(state2.items, id).archive();
        dispatch("DID_REMOVE_ITEM", { error: null, id, item: item2 });
        listUpdated(dispatch, state2);
        success(createItemAPI(item2));
      };
      const server = state2.options.server;
      if (item2.origin === FileOrigin.LOCAL && server && isFunction(server.remove) && options.remove !== false) {
        dispatch("DID_START_ITEM_REMOVE", { id: item2.id });
        server.remove(
          item2.source,
          () => removeFromView(),
          (status) => {
            dispatch("DID_THROW_ITEM_REMOVE_ERROR", {
              id: item2.id,
              error: createResponse("error", 0, status, null),
              status: {
                main: dynamicLabel(state2.options.labelFileRemoveError)(status),
                sub: state2.options.labelTapToRetry
              }
            });
          }
        );
      } else {
        if (options.revert && item2.origin !== FileOrigin.LOCAL && item2.serverId !== null || // if chunked uploads are enabled and we're uploading in chunks for this specific file
        // or if the file isn't big enough for chunked uploads but chunkForce is set then call
        // revert before removing from the view...
        state2.options.chunkUploads && item2.file.size > state2.options.chunkSize || state2.options.chunkUploads && state2.options.chunkForce) {
          item2.revert(
            createRevertFunction(state2.options.server.url, state2.options.server.revert),
            query("GET_FORCE_REVERT")
          );
        }
        removeFromView();
      }
    }),
    ABORT_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
      item2.abortLoad();
    }),
    ABORT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
      if (item2.serverId) {
        dispatch("REVERT_ITEM_PROCESSING", { id: item2.id });
        return;
      }
      item2.abortProcessing().then(() => {
        const shouldRemove = state2.options.instantUpload;
        if (shouldRemove) {
          dispatch("REMOVE_ITEM", { query: item2.id });
        }
      });
    }),
    REQUEST_REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
      if (!state2.options.instantUpload) {
        dispatch("REVERT_ITEM_PROCESSING", { query: item2 });
        return;
      }
      const handleRevert2 = (shouldRevert) => {
        if (!shouldRevert) return;
        dispatch("REVERT_ITEM_PROCESSING", { query: item2 });
      };
      const fn2 = query("GET_BEFORE_REMOVE_FILE");
      if (!fn2) {
        return handleRevert2(true);
      }
      const requestRemoveResult = fn2(createItemAPI(item2));
      if (requestRemoveResult == null) {
        return handleRevert2(true);
      }
      if (typeof requestRemoveResult === "boolean") {
        return handleRevert2(requestRemoveResult);
      }
      if (typeof requestRemoveResult.then === "function") {
        requestRemoveResult.then(handleRevert2);
      }
    }),
    REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
      item2.revert(
        createRevertFunction(state2.options.server.url, state2.options.server.revert),
        query("GET_FORCE_REVERT")
      ).then(() => {
        const shouldRemove = state2.options.instantUpload || isMockItem(item2);
        if (shouldRemove) {
          dispatch("REMOVE_ITEM", { query: item2.id });
        }
      }).catch(() => {
      });
    }),
    SET_OPTIONS: ({ options }) => {
      const optionKeys = Object.keys(options);
      const prioritizedOptionKeys = PrioritizedOptions.filter((key) => optionKeys.includes(key));
      const orderedOptionKeys = [
        // add prioritized first if passed to options, else remove
        ...prioritizedOptionKeys,
        // prevent duplicate keys
        ...Object.keys(options).filter((key) => !prioritizedOptionKeys.includes(key))
      ];
      orderedOptionKeys.forEach((key) => {
        dispatch(`SET_${fromCamels(key, "_").toUpperCase()}`, {
          value: options[key]
        });
      });
    }
  });
  var PrioritizedOptions = [
    "server"
    // must be processed before "files"
  ];
  var formatFilename = (name2) => name2;
  var createElement$1 = (tagName) => {
    return document.createElement(tagName);
  };
  var text = (node, value) => {
    let textNode = node.childNodes[0];
    if (!textNode) {
      textNode = document.createTextNode(value);
      node.appendChild(textNode);
    } else if (value !== textNode.nodeValue) {
      textNode.nodeValue = value;
    }
  };
  var polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees % 360 - 90) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  var describeArc = (x, y, radius, startAngle, endAngle, arcSweep) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    return ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(" ");
  };
  var percentageArc = (x, y, radius, from, to) => {
    let arcSweep = 1;
    if (to > from && to - from <= 0.5) {
      arcSweep = 0;
    }
    if (from > to && from - to >= 0.5) {
      arcSweep = 0;
    }
    return describeArc(
      x,
      y,
      radius,
      Math.min(0.9999, from) * 360,
      Math.min(0.9999, to) * 360,
      arcSweep
    );
  };
  var create = ({ root: root2, props }) => {
    props.spin = false;
    props.progress = 0;
    props.opacity = 0;
    const svg3 = createElement("svg");
    root2.ref.path = createElement("path", {
      "stroke-width": 2,
      "stroke-linecap": "round"
    });
    svg3.appendChild(root2.ref.path);
    root2.ref.svg = svg3;
    root2.appendChild(svg3);
  };
  var write = ({ root: root2, props }) => {
    if (props.opacity === 0) {
      return;
    }
    if (props.align) {
      root2.element.dataset.align = props.align;
    }
    const ringStrokeWidth = parseInt(attr(root2.ref.path, "stroke-width"), 10);
    const size = root2.rect.element.width * 0.5;
    let ringFrom = 0;
    let ringTo = 0;
    if (props.spin) {
      ringFrom = 0;
      ringTo = 0.5;
    } else {
      ringFrom = 0;
      ringTo = props.progress;
    }
    const coordinates = percentageArc(size, size, size - ringStrokeWidth, ringFrom, ringTo);
    attr(root2.ref.path, "d", coordinates);
    attr(root2.ref.path, "stroke-opacity", props.spin || props.progress > 0 ? 1 : 0);
  };
  var progressIndicator = createView({
    tag: "div",
    name: "progress-indicator",
    ignoreRectUpdate: true,
    ignoreRect: true,
    create,
    write,
    mixins: {
      apis: ["progress", "spin", "align"],
      styles: ["opacity"],
      animations: {
        opacity: { type: "tween", duration: 500 },
        progress: {
          type: "spring",
          stiffness: 0.95,
          damping: 0.65,
          mass: 10
        }
      }
    }
  });
  var create$1 = ({ root: root2, props }) => {
    root2.element.innerHTML = (props.icon || "") + `<span>${props.label}</span>`;
    props.isDisabled = false;
  };
  var write$1 = ({ root: root2, props }) => {
    const { isDisabled } = props;
    const shouldDisable = root2.query("GET_DISABLED") || props.opacity === 0;
    if (shouldDisable && !isDisabled) {
      props.isDisabled = true;
      attr(root2.element, "disabled", "disabled");
    } else if (!shouldDisable && isDisabled) {
      props.isDisabled = false;
      root2.element.removeAttribute("disabled");
    }
  };
  var fileActionButton = createView({
    tag: "button",
    attributes: {
      type: "button"
    },
    ignoreRect: true,
    ignoreRectUpdate: true,
    name: "file-action-button",
    mixins: {
      apis: ["label"],
      styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity"],
      animations: {
        scaleX: "spring",
        scaleY: "spring",
        translateX: "spring",
        translateY: "spring",
        opacity: { type: "tween", duration: 250 }
      },
      listeners: true
    },
    create: create$1,
    write: write$1
  });
  var toNaturalFileSize = (bytes, decimalSeparator = ".", base = 1e3, options = {}) => {
    const {
      labelBytes = "bytes",
      labelKilobytes = "KB",
      labelMegabytes = "MB",
      labelGigabytes = "GB"
    } = options;
    bytes = Math.round(Math.abs(bytes));
    const KB = base;
    const MB = base * base;
    const GB = base * base * base;
    if (bytes < KB) {
      return `${bytes} ${labelBytes}`;
    }
    if (bytes < MB) {
      return `${Math.floor(bytes / KB)} ${labelKilobytes}`;
    }
    if (bytes < GB) {
      return `${removeDecimalsWhenZero(bytes / MB, 1, decimalSeparator)} ${labelMegabytes}`;
    }
    return `${removeDecimalsWhenZero(bytes / GB, 2, decimalSeparator)} ${labelGigabytes}`;
  };
  var removeDecimalsWhenZero = (value, decimalCount, separator) => {
    return value.toFixed(decimalCount).split(".").filter((part) => part !== "0").join(separator);
  };
  var create$2 = ({ root: root2, props }) => {
    const fileName = createElement$1("span");
    fileName.className = "filepond--file-info-main";
    attr(fileName, "aria-hidden", "true");
    root2.appendChild(fileName);
    root2.ref.fileName = fileName;
    const fileSize = createElement$1("span");
    fileSize.className = "filepond--file-info-sub";
    root2.appendChild(fileSize);
    root2.ref.fileSize = fileSize;
    text(fileSize, root2.query("GET_LABEL_FILE_WAITING_FOR_SIZE"));
    text(fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
  };
  var updateFile = ({ root: root2, props }) => {
    text(
      root2.ref.fileSize,
      toNaturalFileSize(
        root2.query("GET_ITEM_SIZE", props.id),
        ".",
        root2.query("GET_FILE_SIZE_BASE"),
        root2.query("GET_FILE_SIZE_LABELS", root2.query)
      )
    );
    text(root2.ref.fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
  };
  var updateFileSizeOnError = ({ root: root2, props }) => {
    if (isInt(root2.query("GET_ITEM_SIZE", props.id))) {
      updateFile({ root: root2, props });
      return;
    }
    text(root2.ref.fileSize, root2.query("GET_LABEL_FILE_SIZE_NOT_AVAILABLE"));
  };
  var fileInfo = createView({
    name: "file-info",
    ignoreRect: true,
    ignoreRectUpdate: true,
    write: createRoute({
      DID_LOAD_ITEM: updateFile,
      DID_UPDATE_ITEM_META: updateFile,
      DID_THROW_ITEM_LOAD_ERROR: updateFileSizeOnError,
      DID_THROW_ITEM_INVALID: updateFileSizeOnError
    }),
    didCreateView: (root2) => {
      applyFilters("CREATE_VIEW", { ...root2, view: root2 });
    },
    create: create$2,
    mixins: {
      styles: ["translateX", "translateY"],
      animations: {
        translateX: "spring",
        translateY: "spring"
      }
    }
  });
  var toPercentage = (value) => Math.round(value * 100);
  var create$3 = ({ root: root2 }) => {
    const main = createElement$1("span");
    main.className = "filepond--file-status-main";
    root2.appendChild(main);
    root2.ref.main = main;
    const sub = createElement$1("span");
    sub.className = "filepond--file-status-sub";
    root2.appendChild(sub);
    root2.ref.sub = sub;
    didSetItemLoadProgress({ root: root2, action: { progress: null } });
  };
  var didSetItemLoadProgress = ({ root: root2, action }) => {
    const title = action.progress === null ? root2.query("GET_LABEL_FILE_LOADING") : `${root2.query("GET_LABEL_FILE_LOADING")} ${toPercentage(action.progress)}%`;
    text(root2.ref.main, title);
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
  };
  var didSetItemProcessProgress = ({ root: root2, action }) => {
    const title = action.progress === null ? root2.query("GET_LABEL_FILE_PROCESSING") : `${root2.query("GET_LABEL_FILE_PROCESSING")} ${toPercentage(action.progress)}%`;
    text(root2.ref.main, title);
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
  };
  var didRequestItemProcessing = ({ root: root2 }) => {
    text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING"));
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
  };
  var didAbortItemProcessing = ({ root: root2 }) => {
    text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING_ABORTED"));
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_RETRY"));
  };
  var didCompleteItemProcessing = ({ root: root2 }) => {
    text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING_COMPLETE"));
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_UNDO"));
  };
  var clear = ({ root: root2 }) => {
    text(root2.ref.main, "");
    text(root2.ref.sub, "");
  };
  var error = ({ root: root2, action }) => {
    text(root2.ref.main, action.status.main);
    text(root2.ref.sub, action.status.sub);
  };
  var fileStatus = createView({
    name: "file-status",
    ignoreRect: true,
    ignoreRectUpdate: true,
    write: createRoute({
      DID_LOAD_ITEM: clear,
      DID_REVERT_ITEM_PROCESSING: clear,
      DID_REQUEST_ITEM_PROCESSING: didRequestItemProcessing,
      DID_ABORT_ITEM_PROCESSING: didAbortItemProcessing,
      DID_COMPLETE_ITEM_PROCESSING: didCompleteItemProcessing,
      DID_UPDATE_ITEM_PROCESS_PROGRESS: didSetItemProcessProgress,
      DID_UPDATE_ITEM_LOAD_PROGRESS: didSetItemLoadProgress,
      DID_THROW_ITEM_LOAD_ERROR: error,
      DID_THROW_ITEM_INVALID: error,
      DID_THROW_ITEM_PROCESSING_ERROR: error,
      DID_THROW_ITEM_PROCESSING_REVERT_ERROR: error,
      DID_THROW_ITEM_REMOVE_ERROR: error
    }),
    didCreateView: (root2) => {
      applyFilters("CREATE_VIEW", { ...root2, view: root2 });
    },
    create: create$3,
    mixins: {
      styles: ["translateX", "translateY", "opacity"],
      animations: {
        opacity: { type: "tween", duration: 250 },
        translateX: "spring",
        translateY: "spring"
      }
    }
  });
  var Buttons = {
    AbortItemLoad: {
      label: "GET_LABEL_BUTTON_ABORT_ITEM_LOAD",
      action: "ABORT_ITEM_LOAD",
      className: "filepond--action-abort-item-load",
      align: "LOAD_INDICATOR_POSITION"
      // right
    },
    RetryItemLoad: {
      label: "GET_LABEL_BUTTON_RETRY_ITEM_LOAD",
      action: "RETRY_ITEM_LOAD",
      icon: "GET_ICON_RETRY",
      className: "filepond--action-retry-item-load",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    },
    RemoveItem: {
      label: "GET_LABEL_BUTTON_REMOVE_ITEM",
      action: "REQUEST_REMOVE_ITEM",
      icon: "GET_ICON_REMOVE",
      className: "filepond--action-remove-item",
      align: "BUTTON_REMOVE_ITEM_POSITION"
      // left
    },
    ProcessItem: {
      label: "GET_LABEL_BUTTON_PROCESS_ITEM",
      action: "REQUEST_ITEM_PROCESSING",
      icon: "GET_ICON_PROCESS",
      className: "filepond--action-process-item",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    },
    AbortItemProcessing: {
      label: "GET_LABEL_BUTTON_ABORT_ITEM_PROCESSING",
      action: "ABORT_ITEM_PROCESSING",
      className: "filepond--action-abort-item-processing",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    },
    RetryItemProcessing: {
      label: "GET_LABEL_BUTTON_RETRY_ITEM_PROCESSING",
      action: "RETRY_ITEM_PROCESSING",
      icon: "GET_ICON_RETRY",
      className: "filepond--action-retry-item-processing",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    },
    RevertItemProcessing: {
      label: "GET_LABEL_BUTTON_UNDO_ITEM_PROCESSING",
      action: "REQUEST_REVERT_ITEM_PROCESSING",
      icon: "GET_ICON_UNDO",
      className: "filepond--action-revert-item-processing",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    }
  };
  var ButtonKeys = [];
  forin(Buttons, (key) => {
    ButtonKeys.push(key);
  });
  var calculateFileInfoOffset = (root2) => {
    if (getRemoveIndicatorAligment(root2) === "right") return 0;
    const buttonRect = root2.ref.buttonRemoveItem.rect.element;
    return buttonRect.hidden ? null : buttonRect.width + buttonRect.left;
  };
  var calculateButtonWidth = (root2) => {
    const buttonRect = root2.ref.buttonAbortItemLoad.rect.element;
    return buttonRect.width;
  };
  var calculateFileVerticalCenterOffset = (root2) => Math.floor(root2.ref.buttonRemoveItem.rect.element.height / 4);
  var calculateFileHorizontalCenterOffset = (root2) => Math.floor(root2.ref.buttonRemoveItem.rect.element.left / 2);
  var getLoadIndicatorAlignment = (root2) => root2.query("GET_STYLE_LOAD_INDICATOR_POSITION");
  var getProcessIndicatorAlignment = (root2) => root2.query("GET_STYLE_PROGRESS_INDICATOR_POSITION");
  var getRemoveIndicatorAligment = (root2) => root2.query("GET_STYLE_BUTTON_REMOVE_ITEM_POSITION");
  var DefaultStyle = {
    buttonAbortItemLoad: { opacity: 0 },
    buttonRetryItemLoad: { opacity: 0 },
    buttonRemoveItem: { opacity: 0 },
    buttonProcessItem: { opacity: 0 },
    buttonAbortItemProcessing: { opacity: 0 },
    buttonRetryItemProcessing: { opacity: 0 },
    buttonRevertItemProcessing: { opacity: 0 },
    loadProgressIndicator: { opacity: 0, align: getLoadIndicatorAlignment },
    processProgressIndicator: { opacity: 0, align: getProcessIndicatorAlignment },
    processingCompleteIndicator: { opacity: 0, scaleX: 0.75, scaleY: 0.75 },
    info: { translateX: 0, translateY: 0, opacity: 0 },
    status: { translateX: 0, translateY: 0, opacity: 0 }
  };
  var IdleStyle = {
    buttonRemoveItem: { opacity: 1 },
    buttonProcessItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { translateX: calculateFileInfoOffset }
  };
  var ProcessingStyle = {
    buttonAbortItemProcessing: { opacity: 1 },
    processProgressIndicator: { opacity: 1 },
    status: { opacity: 1 }
  };
  var StyleMap = {
    DID_THROW_ITEM_INVALID: {
      buttonRemoveItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { translateX: calculateFileInfoOffset, opacity: 1 }
    },
    DID_START_ITEM_LOAD: {
      buttonAbortItemLoad: { opacity: 1 },
      loadProgressIndicator: { opacity: 1 },
      status: { opacity: 1 }
    },
    DID_THROW_ITEM_LOAD_ERROR: {
      buttonRetryItemLoad: { opacity: 1 },
      buttonRemoveItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { opacity: 1 }
    },
    DID_START_ITEM_REMOVE: {
      processProgressIndicator: { opacity: 1, align: getRemoveIndicatorAligment },
      info: { translateX: calculateFileInfoOffset },
      status: { opacity: 0 }
    },
    DID_THROW_ITEM_REMOVE_ERROR: {
      processProgressIndicator: { opacity: 0, align: getRemoveIndicatorAligment },
      buttonRemoveItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { opacity: 1, translateX: calculateFileInfoOffset }
    },
    DID_LOAD_ITEM: IdleStyle,
    DID_LOAD_LOCAL_ITEM: {
      buttonRemoveItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { translateX: calculateFileInfoOffset }
    },
    DID_START_ITEM_PROCESSING: ProcessingStyle,
    DID_REQUEST_ITEM_PROCESSING: ProcessingStyle,
    DID_UPDATE_ITEM_PROCESS_PROGRESS: ProcessingStyle,
    DID_COMPLETE_ITEM_PROCESSING: {
      buttonRevertItemProcessing: { opacity: 1 },
      info: { opacity: 1 },
      status: { opacity: 1 }
    },
    DID_THROW_ITEM_PROCESSING_ERROR: {
      buttonRemoveItem: { opacity: 1 },
      buttonRetryItemProcessing: { opacity: 1 },
      status: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset }
    },
    DID_THROW_ITEM_PROCESSING_REVERT_ERROR: {
      buttonRevertItemProcessing: { opacity: 1 },
      status: { opacity: 1 },
      info: { opacity: 1 }
    },
    DID_ABORT_ITEM_PROCESSING: {
      buttonRemoveItem: { opacity: 1 },
      buttonProcessItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { opacity: 1 }
    },
    DID_REVERT_ITEM_PROCESSING: IdleStyle
  };
  var processingCompleteIndicatorView = createView({
    create: ({ root: root2 }) => {
      root2.element.innerHTML = root2.query("GET_ICON_DONE");
    },
    name: "processing-complete-indicator",
    ignoreRect: true,
    mixins: {
      styles: ["scaleX", "scaleY", "opacity"],
      animations: {
        scaleX: "spring",
        scaleY: "spring",
        opacity: { type: "tween", duration: 250 }
      }
    }
  });
  var create$4 = ({ root: root2, props }) => {
    const LocalButtons = Object.keys(Buttons).reduce((prev, curr) => {
      prev[curr] = { ...Buttons[curr] };
      return prev;
    }, {});
    const { id } = props;
    const allowRevert = root2.query("GET_ALLOW_REVERT");
    const allowRemove = root2.query("GET_ALLOW_REMOVE");
    const allowProcess = root2.query("GET_ALLOW_PROCESS");
    const instantUpload = root2.query("GET_INSTANT_UPLOAD");
    const isAsync2 = root2.query("IS_ASYNC");
    const alignRemoveItemButton = root2.query("GET_STYLE_BUTTON_REMOVE_ITEM_ALIGN");
    let buttonFilter;
    if (isAsync2) {
      if (allowProcess && !allowRevert) {
        buttonFilter = (key) => !/RevertItemProcessing/.test(key);
      } else if (!allowProcess && allowRevert) {
        buttonFilter = (key) => !/ProcessItem|RetryItemProcessing|AbortItemProcessing/.test(key);
      } else if (!allowProcess && !allowRevert) {
        buttonFilter = (key) => !/Process/.test(key);
      }
    } else {
      buttonFilter = (key) => !/Process/.test(key);
    }
    const enabledButtons = buttonFilter ? ButtonKeys.filter(buttonFilter) : ButtonKeys.concat();
    if (instantUpload && allowRevert) {
      LocalButtons["RevertItemProcessing"].label = "GET_LABEL_BUTTON_REMOVE_ITEM";
      LocalButtons["RevertItemProcessing"].icon = "GET_ICON_REMOVE";
    }
    if (isAsync2 && !allowRevert) {
      const map2 = StyleMap["DID_COMPLETE_ITEM_PROCESSING"];
      map2.info.translateX = calculateFileHorizontalCenterOffset;
      map2.info.translateY = calculateFileVerticalCenterOffset;
      map2.status.translateY = calculateFileVerticalCenterOffset;
      map2.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
    }
    if (isAsync2 && !allowProcess) {
      [
        "DID_START_ITEM_PROCESSING",
        "DID_REQUEST_ITEM_PROCESSING",
        "DID_UPDATE_ITEM_PROCESS_PROGRESS",
        "DID_THROW_ITEM_PROCESSING_ERROR"
      ].forEach((key) => {
        StyleMap[key].status.translateY = calculateFileVerticalCenterOffset;
      });
      StyleMap["DID_THROW_ITEM_PROCESSING_ERROR"].status.translateX = calculateButtonWidth;
    }
    if (alignRemoveItemButton && allowRevert) {
      LocalButtons["RevertItemProcessing"].align = "BUTTON_REMOVE_ITEM_POSITION";
      const map2 = StyleMap["DID_COMPLETE_ITEM_PROCESSING"];
      map2.info.translateX = calculateFileInfoOffset;
      map2.status.translateY = calculateFileVerticalCenterOffset;
      map2.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
    }
    if (!allowRemove) {
      LocalButtons["RemoveItem"].disabled = true;
    }
    forin(LocalButtons, (key, definition) => {
      const buttonView = root2.createChildView(fileActionButton, {
        label: root2.query(definition.label),
        icon: root2.query(definition.icon),
        opacity: 0
      });
      if (enabledButtons.includes(key)) {
        root2.appendChildView(buttonView);
      }
      if (definition.disabled) {
        buttonView.element.setAttribute("disabled", "disabled");
        buttonView.element.setAttribute("hidden", "hidden");
      }
      buttonView.element.dataset.align = root2.query(`GET_STYLE_${definition.align}`);
      buttonView.element.classList.add(definition.className);
      buttonView.on("click", (e) => {
        e.stopPropagation();
        if (definition.disabled) return;
        root2.dispatch(definition.action, { query: id });
      });
      root2.ref[`button${key}`] = buttonView;
    });
    root2.ref.processingCompleteIndicator = root2.appendChildView(
      root2.createChildView(processingCompleteIndicatorView)
    );
    root2.ref.processingCompleteIndicator.element.dataset.align = root2.query(
      `GET_STYLE_BUTTON_PROCESS_ITEM_POSITION`
    );
    root2.ref.info = root2.appendChildView(root2.createChildView(fileInfo, { id }));
    root2.ref.status = root2.appendChildView(root2.createChildView(fileStatus, { id }));
    const loadIndicatorView = root2.appendChildView(
      root2.createChildView(progressIndicator, {
        opacity: 0,
        align: root2.query(`GET_STYLE_LOAD_INDICATOR_POSITION`)
      })
    );
    loadIndicatorView.element.classList.add("filepond--load-indicator");
    root2.ref.loadProgressIndicator = loadIndicatorView;
    const progressIndicatorView = root2.appendChildView(
      root2.createChildView(progressIndicator, {
        opacity: 0,
        align: root2.query(`GET_STYLE_PROGRESS_INDICATOR_POSITION`)
      })
    );
    progressIndicatorView.element.classList.add("filepond--process-indicator");
    root2.ref.processProgressIndicator = progressIndicatorView;
    root2.ref.activeStyles = [];
  };
  var write$2 = ({ root: root2, actions: actions2, props }) => {
    route({ root: root2, actions: actions2, props });
    let action = actions2.concat().filter((action2) => /^DID_/.test(action2.type)).reverse().find((action2) => StyleMap[action2.type]);
    if (action) {
      root2.ref.activeStyles = [];
      const stylesToApply = StyleMap[action.type];
      forin(DefaultStyle, (name2, defaultStyles) => {
        const control = root2.ref[name2];
        forin(defaultStyles, (key, defaultValue) => {
          const value = stylesToApply[name2] && typeof stylesToApply[name2][key] !== "undefined" ? stylesToApply[name2][key] : defaultValue;
          root2.ref.activeStyles.push({ control, key, value });
        });
      });
    }
    root2.ref.activeStyles.forEach(({ control, key, value }) => {
      control[key] = typeof value === "function" ? value(root2) : value;
    });
  };
  var route = createRoute({
    DID_SET_LABEL_BUTTON_ABORT_ITEM_PROCESSING: ({ root: root2, action }) => {
      root2.ref.buttonAbortItemProcessing.label = action.value;
    },
    DID_SET_LABEL_BUTTON_ABORT_ITEM_LOAD: ({ root: root2, action }) => {
      root2.ref.buttonAbortItemLoad.label = action.value;
    },
    DID_SET_LABEL_BUTTON_ABORT_ITEM_REMOVAL: ({ root: root2, action }) => {
      root2.ref.buttonAbortItemRemoval.label = action.value;
    },
    DID_REQUEST_ITEM_PROCESSING: ({ root: root2 }) => {
      root2.ref.processProgressIndicator.spin = true;
      root2.ref.processProgressIndicator.progress = 0;
    },
    DID_START_ITEM_LOAD: ({ root: root2 }) => {
      root2.ref.loadProgressIndicator.spin = true;
      root2.ref.loadProgressIndicator.progress = 0;
    },
    DID_START_ITEM_REMOVE: ({ root: root2 }) => {
      root2.ref.processProgressIndicator.spin = true;
      root2.ref.processProgressIndicator.progress = 0;
    },
    DID_UPDATE_ITEM_LOAD_PROGRESS: ({ root: root2, action }) => {
      root2.ref.loadProgressIndicator.spin = false;
      root2.ref.loadProgressIndicator.progress = action.progress;
    },
    DID_UPDATE_ITEM_PROCESS_PROGRESS: ({ root: root2, action }) => {
      root2.ref.processProgressIndicator.spin = false;
      root2.ref.processProgressIndicator.progress = action.progress;
    }
  });
  var file = createView({
    create: create$4,
    write: write$2,
    didCreateView: (root2) => {
      applyFilters("CREATE_VIEW", { ...root2, view: root2 });
    },
    name: "file"
  });
  var create$5 = ({ root: root2, props }) => {
    root2.ref.fileName = createElement$1("legend");
    root2.appendChild(root2.ref.fileName);
    root2.ref.file = root2.appendChildView(root2.createChildView(file, { id: props.id }));
    root2.ref.data = false;
  };
  var didLoadItem = ({ root: root2, props }) => {
    text(root2.ref.fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
  };
  var fileWrapper = createView({
    create: create$5,
    ignoreRect: true,
    write: createRoute({
      DID_LOAD_ITEM: didLoadItem
    }),
    didCreateView: (root2) => {
      applyFilters("CREATE_VIEW", { ...root2, view: root2 });
    },
    tag: "fieldset",
    name: "file-wrapper"
  });
  var PANEL_SPRING_PROPS = { type: "spring", damping: 0.6, mass: 7 };
  var create$6 = ({ root: root2, props }) => {
    [
      {
        name: "top"
      },
      {
        name: "center",
        props: {
          translateY: null,
          scaleY: null
        },
        mixins: {
          animations: {
            scaleY: PANEL_SPRING_PROPS
          },
          styles: ["translateY", "scaleY"]
        }
      },
      {
        name: "bottom",
        props: {
          translateY: null
        },
        mixins: {
          animations: {
            translateY: PANEL_SPRING_PROPS
          },
          styles: ["translateY"]
        }
      }
    ].forEach((section) => {
      createSection(root2, section, props.name);
    });
    root2.element.classList.add(`filepond--${props.name}`);
    root2.ref.scalable = null;
  };
  var createSection = (root2, section, className) => {
    const viewConstructor = createView({
      name: `panel-${section.name} filepond--${className}`,
      mixins: section.mixins,
      ignoreRectUpdate: true
    });
    const view = root2.createChildView(viewConstructor, section.props);
    root2.ref[section.name] = root2.appendChildView(view);
  };
  var write$3 = ({ root: root2, props }) => {
    if (root2.ref.scalable === null || props.scalable !== root2.ref.scalable) {
      root2.ref.scalable = isBoolean(props.scalable) ? props.scalable : true;
      root2.element.dataset.scalable = root2.ref.scalable;
    }
    if (!props.height) return;
    const topRect = root2.ref.top.rect.element;
    const bottomRect = root2.ref.bottom.rect.element;
    const height2 = Math.max(topRect.height + bottomRect.height, props.height);
    root2.ref.center.translateY = topRect.height;
    root2.ref.center.scaleY = (height2 - topRect.height - bottomRect.height) / 100;
    root2.ref.bottom.translateY = height2 - bottomRect.height;
  };
  var panel = createView({
    name: "panel",
    read: ({ root: root2, props }) => props.heightCurrent = root2.ref.bottom.translateY,
    write: write$3,
    create: create$6,
    ignoreRect: true,
    mixins: {
      apis: ["height", "heightCurrent", "scalable"]
    }
  });
  var createDragHelper = (items) => {
    const itemIds = items.map((item2) => item2.id);
    let prevIndex = void 0;
    return {
      setIndex: (index) => {
        prevIndex = index;
      },
      getIndex: () => prevIndex,
      getItemIndex: (item2) => itemIds.indexOf(item2.id)
    };
  };
  var ITEM_TRANSLATE_SPRING = {
    type: "spring",
    stiffness: 0.75,
    damping: 0.45,
    mass: 10
  };
  var ITEM_SCALE_SPRING = "spring";
  var StateMap = {
    DID_START_ITEM_LOAD: "busy",
    DID_UPDATE_ITEM_LOAD_PROGRESS: "loading",
    DID_THROW_ITEM_INVALID: "load-invalid",
    DID_THROW_ITEM_LOAD_ERROR: "load-error",
    DID_LOAD_ITEM: "idle",
    DID_THROW_ITEM_REMOVE_ERROR: "remove-error",
    DID_START_ITEM_REMOVE: "busy",
    DID_START_ITEM_PROCESSING: "busy processing",
    DID_REQUEST_ITEM_PROCESSING: "busy processing",
    DID_UPDATE_ITEM_PROCESS_PROGRESS: "processing",
    DID_COMPLETE_ITEM_PROCESSING: "processing-complete",
    DID_THROW_ITEM_PROCESSING_ERROR: "processing-error",
    DID_THROW_ITEM_PROCESSING_REVERT_ERROR: "processing-revert-error",
    DID_ABORT_ITEM_PROCESSING: "cancelled",
    DID_REVERT_ITEM_PROCESSING: "idle"
  };
  var create$7 = ({ root: root2, props }) => {
    root2.ref.handleClick = (e) => root2.dispatch("DID_ACTIVATE_ITEM", { id: props.id });
    root2.element.id = `filepond--item-${props.id}`;
    root2.element.addEventListener("click", root2.ref.handleClick);
    root2.ref.container = root2.appendChildView(root2.createChildView(fileWrapper, { id: props.id }));
    root2.ref.panel = root2.appendChildView(root2.createChildView(panel, { name: "item-panel" }));
    root2.ref.panel.height = null;
    props.markedForRemoval = false;
    if (!root2.query("GET_ALLOW_REORDER")) return;
    root2.element.dataset.dragState = "idle";
    const grab = (e) => {
      if (!e.isPrimary) return;
      let removedActivateListener = false;
      const origin = {
        x: e.pageX,
        y: e.pageY
      };
      props.dragOrigin = {
        x: root2.translateX,
        y: root2.translateY
      };
      props.dragCenter = {
        x: e.offsetX,
        y: e.offsetY
      };
      const dragState = createDragHelper(root2.query("GET_ACTIVE_ITEMS"));
      root2.dispatch("DID_GRAB_ITEM", { id: props.id, dragState });
      const drag = (e2) => {
        if (!e2.isPrimary) return;
        e2.stopPropagation();
        e2.preventDefault();
        props.dragOffset = {
          x: e2.pageX - origin.x,
          y: e2.pageY - origin.y
        };
        const dist = props.dragOffset.x * props.dragOffset.x + props.dragOffset.y * props.dragOffset.y;
        if (dist > 16 && !removedActivateListener) {
          removedActivateListener = true;
          root2.element.removeEventListener("click", root2.ref.handleClick);
        }
        root2.dispatch("DID_DRAG_ITEM", { id: props.id, dragState });
      };
      const drop2 = (e2) => {
        if (!e2.isPrimary) return;
        props.dragOffset = {
          x: e2.pageX - origin.x,
          y: e2.pageY - origin.y
        };
        reset();
      };
      const cancel = () => {
        reset();
      };
      const reset = () => {
        document.removeEventListener("pointercancel", cancel);
        document.removeEventListener("pointermove", drag);
        document.removeEventListener("pointerup", drop2);
        root2.dispatch("DID_DROP_ITEM", { id: props.id, dragState });
        if (removedActivateListener) {
          setTimeout(() => root2.element.addEventListener("click", root2.ref.handleClick), 0);
        }
      };
      document.addEventListener("pointercancel", cancel);
      document.addEventListener("pointermove", drag);
      document.addEventListener("pointerup", drop2);
    };
    root2.element.addEventListener("pointerdown", grab);
  };
  var route$1 = createRoute({
    DID_UPDATE_PANEL_HEIGHT: ({ root: root2, action }) => {
      root2.height = action.height;
    }
  });
  var write$4 = createRoute(
    {
      DID_GRAB_ITEM: ({ root: root2, props }) => {
        props.dragOrigin = {
          x: root2.translateX,
          y: root2.translateY
        };
      },
      DID_DRAG_ITEM: ({ root: root2 }) => {
        root2.element.dataset.dragState = "drag";
      },
      DID_DROP_ITEM: ({ root: root2, props }) => {
        props.dragOffset = null;
        props.dragOrigin = null;
        root2.element.dataset.dragState = "drop";
      }
    },
    ({ root: root2, actions: actions2, props, shouldOptimize }) => {
      if (root2.element.dataset.dragState === "drop") {
        if (root2.scaleX <= 1) {
          root2.element.dataset.dragState = "idle";
        }
      }
      let action = actions2.concat().filter((action2) => /^DID_/.test(action2.type)).reverse().find((action2) => StateMap[action2.type]);
      if (action && action.type !== props.currentState) {
        props.currentState = action.type;
        root2.element.dataset.filepondItemState = StateMap[props.currentState] || "";
      }
      const aspectRatio = root2.query("GET_ITEM_PANEL_ASPECT_RATIO") || root2.query("GET_PANEL_ASPECT_RATIO");
      if (!aspectRatio) {
        route$1({ root: root2, actions: actions2, props });
        if (!root2.height && root2.ref.container.rect.element.height > 0) {
          root2.height = root2.ref.container.rect.element.height;
        }
      } else if (!shouldOptimize) {
        root2.height = root2.rect.element.width * aspectRatio;
      }
      if (shouldOptimize) {
        root2.ref.panel.height = null;
      }
      root2.ref.panel.height = root2.height;
    }
  );
  var item = createView({
    create: create$7,
    write: write$4,
    destroy: ({ root: root2, props }) => {
      root2.element.removeEventListener("click", root2.ref.handleClick);
      root2.dispatch("RELEASE_ITEM", { query: props.id });
    },
    tag: "li",
    name: "item",
    mixins: {
      apis: [
        "id",
        "interactionMethod",
        "markedForRemoval",
        "spawnDate",
        "dragCenter",
        "dragOrigin",
        "dragOffset"
      ],
      styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity", "height"],
      animations: {
        scaleX: ITEM_SCALE_SPRING,
        scaleY: ITEM_SCALE_SPRING,
        translateX: ITEM_TRANSLATE_SPRING,
        translateY: ITEM_TRANSLATE_SPRING,
        opacity: { type: "tween", duration: 150 }
      }
    }
  });
  var getItemsPerRow = (horizontalSpace, itemWidth) => {
    return Math.max(1, Math.floor((horizontalSpace + 1) / itemWidth));
  };
  var getItemIndexByPosition = (view, children, positionInView) => {
    if (!positionInView) return;
    const horizontalSpace = view.rect.element.width;
    const l = children.length;
    let last = null;
    if (l === 0 || positionInView.top < children[0].rect.element.top) return -1;
    const item2 = children[0];
    const itemRect = item2.rect.element;
    const itemHorizontalMargin = itemRect.marginLeft + itemRect.marginRight;
    const itemWidth = itemRect.width + itemHorizontalMargin;
    const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
    if (itemsPerRow === 1) {
      for (let index = 0; index < l; index++) {
        const child = children[index];
        const childMid = child.rect.outer.top + child.rect.element.height * 0.5;
        if (positionInView.top < childMid) {
          return index;
        }
      }
      return l;
    }
    const itemVerticalMargin = itemRect.marginTop + itemRect.marginBottom;
    const itemHeight = itemRect.height + itemVerticalMargin;
    for (let index = 0; index < l; index++) {
      const indexX = index % itemsPerRow;
      const indexY = Math.floor(index / itemsPerRow);
      const offsetX = indexX * itemWidth;
      const offsetY = indexY * itemHeight;
      const itemTop = offsetY - itemRect.marginTop;
      const itemRight = offsetX + itemWidth;
      const itemBottom = offsetY + itemHeight + itemRect.marginBottom;
      if (positionInView.top < itemBottom && positionInView.top > itemTop) {
        if (positionInView.left < itemRight) {
          return index;
        } else if (index !== l - 1) {
          last = index;
        } else {
          last = null;
        }
      }
    }
    if (last !== null) {
      return last;
    }
    return l;
  };
  var dropAreaDimensions = {
    height: 0,
    width: 0,
    get getHeight() {
      return this.height;
    },
    set setHeight(val) {
      if (this.height === 0 || val === 0) this.height = val;
    },
    get getWidth() {
      return this.width;
    },
    set setWidth(val) {
      if (this.width === 0 || val === 0) this.width = val;
    },
    setDimensions: function(height2, width2) {
      if (this.height === 0 || height2 === 0) this.height = height2;
      if (this.width === 0 || width2 === 0) this.width = width2;
    }
  };
  var create$8 = ({ root: root2 }) => {
    attr(root2.element, "role", "list");
    root2.ref.lastItemSpanwDate = Date.now();
  };
  var addItemView = ({ root: root2, action }) => {
    const { id, index, interactionMethod } = action;
    root2.ref.addIndex = index;
    const now = Date.now();
    let spawnDate = now;
    let opacity = 1;
    if (interactionMethod !== InteractionMethod.NONE) {
      opacity = 0;
      const cooldown = root2.query("GET_ITEM_INSERT_INTERVAL");
      const dist = now - root2.ref.lastItemSpanwDate;
      spawnDate = dist < cooldown ? now + (cooldown - dist) : now;
    }
    root2.ref.lastItemSpanwDate = spawnDate;
    root2.appendChildView(
      root2.createChildView(
        // view type
        item,
        // props
        {
          spawnDate,
          id,
          opacity,
          interactionMethod
        }
      ),
      index
    );
  };
  var moveItem = (item2, x, y, vx = 0, vy = 1) => {
    if (item2.dragOffset) {
      item2.translateX = null;
      item2.translateY = null;
      item2.translateX = item2.dragOrigin.x + item2.dragOffset.x;
      item2.translateY = item2.dragOrigin.y + item2.dragOffset.y;
      item2.scaleX = 1.025;
      item2.scaleY = 1.025;
    } else {
      item2.translateX = x;
      item2.translateY = y;
      if (Date.now() > item2.spawnDate) {
        if (item2.opacity === 0) {
          introItemView(item2, x, y, vx, vy);
        }
        item2.scaleX = 1;
        item2.scaleY = 1;
        item2.opacity = 1;
      }
    }
  };
  var introItemView = (item2, x, y, vx, vy) => {
    if (item2.interactionMethod === InteractionMethod.NONE) {
      item2.translateX = null;
      item2.translateX = x;
      item2.translateY = null;
      item2.translateY = y;
    } else if (item2.interactionMethod === InteractionMethod.DROP) {
      item2.translateX = null;
      item2.translateX = x - vx * 20;
      item2.translateY = null;
      item2.translateY = y - vy * 10;
      item2.scaleX = 0.8;
      item2.scaleY = 0.8;
    } else if (item2.interactionMethod === InteractionMethod.BROWSE) {
      item2.translateY = null;
      item2.translateY = y - 30;
    } else if (item2.interactionMethod === InteractionMethod.API) {
      item2.translateX = null;
      item2.translateX = x - 30;
      item2.translateY = null;
    }
  };
  var removeItemView = ({ root: root2, action }) => {
    const { id } = action;
    const view = root2.childViews.find((child) => child.id === id);
    if (!view) {
      return;
    }
    view.scaleX = 0.9;
    view.scaleY = 0.9;
    view.opacity = 0;
    view.markedForRemoval = true;
  };
  var getItemHeight = (child) => child.rect.element.height + child.rect.element.marginBottom * 0.5 + child.rect.element.marginTop * 0.5;
  var getItemWidth = (child) => child.rect.element.width + child.rect.element.marginLeft * 0.5 + child.rect.element.marginRight * 0.5;
  var dragItem = ({ root: root2, action }) => {
    const { id, dragState } = action;
    const item2 = root2.query("GET_ITEM", { id });
    const view = root2.childViews.find((child) => child.id === id);
    const numItems = root2.childViews.length;
    const oldIndex = dragState.getItemIndex(item2);
    if (!view) return;
    const dragPosition = {
      x: view.dragOrigin.x + view.dragOffset.x + view.dragCenter.x,
      y: view.dragOrigin.y + view.dragOffset.y + view.dragCenter.y
    };
    const dragHeight = getItemHeight(view);
    const dragWidth = getItemWidth(view);
    let cols = Math.floor(root2.rect.outer.width / dragWidth);
    if (cols > numItems) cols = numItems;
    const rows = Math.floor(numItems / cols + 1);
    dropAreaDimensions.setHeight = dragHeight * rows;
    dropAreaDimensions.setWidth = dragWidth * cols;
    var location2 = {
      y: Math.floor(dragPosition.y / dragHeight),
      x: Math.floor(dragPosition.x / dragWidth),
      getGridIndex: function getGridIndex() {
        if (dragPosition.y > dropAreaDimensions.getHeight || dragPosition.y < 0 || dragPosition.x > dropAreaDimensions.getWidth || dragPosition.x < 0)
          return oldIndex;
        return this.y * cols + this.x;
      },
      getColIndex: function getColIndex() {
        const items = root2.query("GET_ACTIVE_ITEMS");
        const visibleChildren = root2.childViews.filter((child) => child.rect.element.height);
        const children = items.map(
          (item3) => visibleChildren.find((childView) => childView.id === item3.id)
        );
        const currentIndex2 = children.findIndex((child) => child === view);
        const dragHeight2 = getItemHeight(view);
        const l = children.length;
        let idx = l;
        let childHeight = 0;
        let childBottom = 0;
        let childTop = 0;
        for (let i = 0; i < l; i++) {
          childHeight = getItemHeight(children[i]);
          childTop = childBottom;
          childBottom = childTop + childHeight;
          if (dragPosition.y < childBottom) {
            if (currentIndex2 > i) {
              if (dragPosition.y < childTop + dragHeight2) {
                idx = i;
                break;
              }
              continue;
            }
            idx = i;
            break;
          }
        }
        return idx;
      }
    };
    const index = cols > 1 ? location2.getGridIndex() : location2.getColIndex();
    root2.dispatch("MOVE_ITEM", { query: view, index });
    const currentIndex = dragState.getIndex();
    if (currentIndex === void 0 || currentIndex !== index) {
      dragState.setIndex(index);
      if (currentIndex === void 0) return;
      root2.dispatch("DID_REORDER_ITEMS", {
        items: root2.query("GET_ACTIVE_ITEMS"),
        origin: oldIndex,
        target: index
      });
    }
  };
  var route$2 = createRoute({
    DID_ADD_ITEM: addItemView,
    DID_REMOVE_ITEM: removeItemView,
    DID_DRAG_ITEM: dragItem
  });
  var write$5 = ({ root: root2, props, actions: actions2, shouldOptimize }) => {
    route$2({ root: root2, props, actions: actions2 });
    const { dragCoordinates } = props;
    const horizontalSpace = root2.rect.element.width;
    const visibleChildren = root2.childViews.filter((child) => child.rect.element.height);
    const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
    const dragIndex = dragCoordinates ? getItemIndexByPosition(root2, children, dragCoordinates) : null;
    const addIndex = root2.ref.addIndex || null;
    root2.ref.addIndex = null;
    let dragIndexOffset = 0;
    let removeIndexOffset = 0;
    let addIndexOffset = 0;
    if (children.length === 0) return;
    const childRect = children[0].rect.element;
    const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
    const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
    const itemWidth = childRect.width + itemHorizontalMargin;
    const itemHeight = childRect.height + itemVerticalMargin;
    const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
    if (itemsPerRow === 1) {
      let offsetY = 0;
      let dragOffset = 0;
      children.forEach((child, index) => {
        if (dragIndex) {
          let dist = index - dragIndex;
          if (dist === -2) {
            dragOffset = -itemVerticalMargin * 0.25;
          } else if (dist === -1) {
            dragOffset = -itemVerticalMargin * 0.75;
          } else if (dist === 0) {
            dragOffset = itemVerticalMargin * 0.75;
          } else if (dist === 1) {
            dragOffset = itemVerticalMargin * 0.25;
          } else {
            dragOffset = 0;
          }
        }
        if (shouldOptimize) {
          child.translateX = null;
          child.translateY = null;
        }
        if (!child.markedForRemoval) {
          moveItem(child, 0, offsetY + dragOffset);
        }
        let itemHeight2 = child.rect.element.height + itemVerticalMargin;
        let visualHeight = itemHeight2 * (child.markedForRemoval ? child.opacity : 1);
        offsetY += visualHeight;
      });
    } else {
      let prevX = 0;
      let prevY = 0;
      children.forEach((child, index) => {
        if (index === dragIndex) {
          dragIndexOffset = 1;
        }
        if (index === addIndex) {
          addIndexOffset += 1;
        }
        if (child.markedForRemoval && child.opacity < 0.5) {
          removeIndexOffset -= 1;
        }
        const visualIndex = index + addIndexOffset + dragIndexOffset + removeIndexOffset;
        const indexX = visualIndex % itemsPerRow;
        const indexY = Math.floor(visualIndex / itemsPerRow);
        const offsetX = indexX * itemWidth;
        const offsetY = indexY * itemHeight;
        const vectorX = Math.sign(offsetX - prevX);
        const vectorY = Math.sign(offsetY - prevY);
        prevX = offsetX;
        prevY = offsetY;
        if (child.markedForRemoval) return;
        if (shouldOptimize) {
          child.translateX = null;
          child.translateY = null;
        }
        moveItem(child, offsetX, offsetY, vectorX, vectorY);
      });
    }
  };
  var filterSetItemActions = (child, actions2) => actions2.filter((action) => {
    if (action.data && action.data.id) {
      return child.id === action.data.id;
    }
    return true;
  });
  var list = createView({
    create: create$8,
    write: write$5,
    tag: "ul",
    name: "list",
    didWriteView: ({ root: root2 }) => {
      root2.childViews.filter((view) => view.markedForRemoval && view.opacity === 0 && view.resting).forEach((view) => {
        view._destroy();
        root2.removeChildView(view);
      });
    },
    filterFrameActionsForChild: filterSetItemActions,
    mixins: {
      apis: ["dragCoordinates"]
    }
  });
  var create$9 = ({ root: root2, props }) => {
    root2.ref.list = root2.appendChildView(root2.createChildView(list));
    props.dragCoordinates = null;
    props.overflowing = false;
  };
  var storeDragCoordinates = ({ root: root2, props, action }) => {
    if (!root2.query("GET_ITEM_INSERT_LOCATION_FREEDOM")) return;
    props.dragCoordinates = {
      left: action.position.scopeLeft - root2.ref.list.rect.element.left,
      top: action.position.scopeTop - (root2.rect.outer.top + root2.rect.element.marginTop + root2.rect.element.scrollTop)
    };
  };
  var clearDragCoordinates = ({ props }) => {
    props.dragCoordinates = null;
  };
  var route$3 = createRoute({
    DID_DRAG: storeDragCoordinates,
    DID_END_DRAG: clearDragCoordinates
  });
  var write$6 = ({ root: root2, props, actions: actions2 }) => {
    route$3({ root: root2, props, actions: actions2 });
    root2.ref.list.dragCoordinates = props.dragCoordinates;
    if (props.overflowing && !props.overflow) {
      props.overflowing = false;
      root2.element.dataset.state = "";
      root2.height = null;
    }
    if (props.overflow) {
      const newHeight = Math.round(props.overflow);
      if (newHeight !== root2.height) {
        props.overflowing = true;
        root2.element.dataset.state = "overflow";
        root2.height = newHeight;
      }
    }
  };
  var listScroller = createView({
    create: create$9,
    write: write$6,
    name: "list-scroller",
    mixins: {
      apis: ["overflow", "dragCoordinates"],
      styles: ["height", "translateY"],
      animations: {
        translateY: "spring"
      }
    }
  });
  var attrToggle = (element, name2, state2, enabledValue = "") => {
    if (state2) {
      attr(element, name2, enabledValue);
    } else {
      element.removeAttribute(name2);
    }
  };
  var resetFileInput = (input) => {
    if (!input || input.value === "") {
      return;
    }
    try {
      input.value = "";
    } catch (err) {
    }
    if (input.value) {
      const form = createElement$1("form");
      const parentNode = input.parentNode;
      const ref = input.nextSibling;
      form.appendChild(input);
      form.reset();
      if (ref) {
        parentNode.insertBefore(input, ref);
      } else {
        parentNode.appendChild(input);
      }
    }
  };
  var create$a = ({ root: root2, props }) => {
    root2.element.id = `filepond--browser-${props.id}`;
    attr(root2.element, "name", root2.query("GET_NAME"));
    attr(root2.element, "aria-controls", `filepond--assistant-${props.id}`);
    attr(root2.element, "aria-labelledby", `filepond--drop-label-${props.id}`);
    setAcceptedFileTypes({ root: root2, action: { value: root2.query("GET_ACCEPTED_FILE_TYPES") } });
    toggleAllowMultiple({ root: root2, action: { value: root2.query("GET_ALLOW_MULTIPLE") } });
    toggleDirectoryFilter({ root: root2, action: { value: root2.query("GET_ALLOW_DIRECTORIES_ONLY") } });
    toggleDisabled({ root: root2 });
    toggleRequired({ root: root2, action: { value: root2.query("GET_REQUIRED") } });
    setCaptureMethod({ root: root2, action: { value: root2.query("GET_CAPTURE_METHOD") } });
    root2.ref.handleChange = (e) => {
      if (!root2.element.value) {
        return;
      }
      const files = Array.from(root2.element.files).map((file2) => {
        file2._relativePath = file2.webkitRelativePath;
        return file2;
      });
      setTimeout(() => {
        props.onload(files);
        resetFileInput(root2.element);
      }, 250);
    };
    root2.element.addEventListener("change", root2.ref.handleChange);
  };
  var setAcceptedFileTypes = ({ root: root2, action }) => {
    if (!root2.query("GET_ALLOW_SYNC_ACCEPT_ATTRIBUTE")) return;
    attrToggle(root2.element, "accept", !!action.value, action.value ? action.value.join(",") : "");
  };
  var toggleAllowMultiple = ({ root: root2, action }) => {
    attrToggle(root2.element, "multiple", action.value);
  };
  var toggleDirectoryFilter = ({ root: root2, action }) => {
    attrToggle(root2.element, "webkitdirectory", action.value);
  };
  var toggleDisabled = ({ root: root2 }) => {
    const isDisabled = root2.query("GET_DISABLED");
    const doesAllowBrowse = root2.query("GET_ALLOW_BROWSE");
    const disableField = isDisabled || !doesAllowBrowse;
    attrToggle(root2.element, "disabled", disableField);
  };
  var toggleRequired = ({ root: root2, action }) => {
    if (!action.value) {
      attrToggle(root2.element, "required", false);
    } else if (root2.query("GET_TOTAL_ITEMS") === 0) {
      attrToggle(root2.element, "required", true);
    }
  };
  var setCaptureMethod = ({ root: root2, action }) => {
    attrToggle(root2.element, "capture", !!action.value, action.value === true ? "" : action.value);
  };
  var updateRequiredStatus = ({ root: root2 }) => {
    const { element } = root2;
    if (root2.query("GET_TOTAL_ITEMS") > 0) {
      attrToggle(element, "required", false);
      attrToggle(element, "name", false);
    } else {
      attrToggle(element, "name", true, root2.query("GET_NAME"));
      const shouldCheckValidity = root2.query("GET_CHECK_VALIDITY");
      if (shouldCheckValidity) {
        element.setCustomValidity("");
      }
      if (root2.query("GET_REQUIRED")) {
        attrToggle(element, "required", true);
      }
    }
  };
  var updateFieldValidityStatus = ({ root: root2 }) => {
    const shouldCheckValidity = root2.query("GET_CHECK_VALIDITY");
    if (!shouldCheckValidity) return;
    root2.element.setCustomValidity(root2.query("GET_LABEL_INVALID_FIELD"));
  };
  var browser = createView({
    tag: "input",
    name: "browser",
    ignoreRect: true,
    ignoreRectUpdate: true,
    attributes: {
      type: "file"
    },
    create: create$a,
    destroy: ({ root: root2 }) => {
      root2.element.removeEventListener("change", root2.ref.handleChange);
    },
    write: createRoute({
      DID_LOAD_ITEM: updateRequiredStatus,
      DID_REMOVE_ITEM: updateRequiredStatus,
      DID_THROW_ITEM_INVALID: updateFieldValidityStatus,
      DID_SET_DISABLED: toggleDisabled,
      DID_SET_ALLOW_BROWSE: toggleDisabled,
      DID_SET_ALLOW_DIRECTORIES_ONLY: toggleDirectoryFilter,
      DID_SET_ALLOW_MULTIPLE: toggleAllowMultiple,
      DID_SET_ACCEPTED_FILE_TYPES: setAcceptedFileTypes,
      DID_SET_CAPTURE_METHOD: setCaptureMethod,
      DID_SET_REQUIRED: toggleRequired
    })
  });
  var Key = {
    ENTER: 13,
    SPACE: 32
  };
  var create$b = ({ root: root2, props }) => {
    const label = createElement$1("label");
    attr(label, "for", `filepond--browser-${props.id}`);
    attr(label, "id", `filepond--drop-label-${props.id}`);
    root2.ref.handleKeyDown = (e) => {
      const isActivationKey = e.keyCode === Key.ENTER || e.keyCode === Key.SPACE;
      if (!isActivationKey) return;
      e.preventDefault();
      root2.ref.label.click();
    };
    root2.ref.handleClick = (e) => {
      const isLabelClick = e.target === label || label.contains(e.target);
      if (isLabelClick) return;
      root2.ref.label.click();
    };
    label.addEventListener("keydown", root2.ref.handleKeyDown);
    root2.element.addEventListener("click", root2.ref.handleClick);
    updateLabelValue(label, props.caption);
    root2.appendChild(label);
    root2.ref.label = label;
  };
  var updateLabelValue = (label, value) => {
    label.innerHTML = value;
    const clickable = label.querySelector(".filepond--label-action");
    if (clickable) {
      attr(clickable, "tabindex", "0");
    }
    return value;
  };
  var dropLabel = createView({
    name: "drop-label",
    ignoreRect: true,
    create: create$b,
    destroy: ({ root: root2 }) => {
      root2.ref.label.addEventListener("keydown", root2.ref.handleKeyDown);
      root2.element.removeEventListener("click", root2.ref.handleClick);
    },
    write: createRoute({
      DID_SET_LABEL_IDLE: ({ root: root2, action }) => {
        updateLabelValue(root2.ref.label, action.value);
      }
    }),
    mixins: {
      styles: ["opacity", "translateX", "translateY"],
      animations: {
        opacity: { type: "tween", duration: 150 },
        translateX: "spring",
        translateY: "spring"
      }
    }
  });
  var blob = createView({
    name: "drip-blob",
    ignoreRect: true,
    mixins: {
      styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity"],
      animations: {
        scaleX: "spring",
        scaleY: "spring",
        translateX: "spring",
        translateY: "spring",
        opacity: { type: "tween", duration: 250 }
      }
    }
  });
  var addBlob = ({ root: root2 }) => {
    const centerX = root2.rect.element.width * 0.5;
    const centerY = root2.rect.element.height * 0.5;
    root2.ref.blob = root2.appendChildView(
      root2.createChildView(blob, {
        opacity: 0,
        scaleX: 2.5,
        scaleY: 2.5,
        translateX: centerX,
        translateY: centerY
      })
    );
  };
  var moveBlob = ({ root: root2, action }) => {
    if (!root2.ref.blob) {
      addBlob({ root: root2 });
      return;
    }
    root2.ref.blob.translateX = action.position.scopeLeft;
    root2.ref.blob.translateY = action.position.scopeTop;
    root2.ref.blob.scaleX = 1;
    root2.ref.blob.scaleY = 1;
    root2.ref.blob.opacity = 1;
  };
  var hideBlob = ({ root: root2 }) => {
    if (!root2.ref.blob) {
      return;
    }
    root2.ref.blob.opacity = 0;
  };
  var explodeBlob = ({ root: root2 }) => {
    if (!root2.ref.blob) {
      return;
    }
    root2.ref.blob.scaleX = 2.5;
    root2.ref.blob.scaleY = 2.5;
    root2.ref.blob.opacity = 0;
  };
  var write$7 = ({ root: root2, props, actions: actions2 }) => {
    route$4({ root: root2, props, actions: actions2 });
    const { blob: blob2 } = root2.ref;
    if (actions2.length === 0 && blob2 && blob2.opacity === 0) {
      root2.removeChildView(blob2);
      root2.ref.blob = null;
    }
  };
  var route$4 = createRoute({
    DID_DRAG: moveBlob,
    DID_DROP: explodeBlob,
    DID_END_DRAG: hideBlob
  });
  var drip = createView({
    ignoreRect: true,
    ignoreRectUpdate: true,
    name: "drip",
    write: write$7
  });
  var setInputFiles = (element, files) => {
    try {
      const dataTransfer = new DataTransfer();
      files.forEach((file2) => {
        if (file2 instanceof File) {
          dataTransfer.items.add(file2);
        } else {
          dataTransfer.items.add(
            new File([file2], file2.name, {
              type: file2.type
            })
          );
        }
      });
      element.files = dataTransfer.files;
    } catch (err) {
      return false;
    }
    return true;
  };
  var create$c = ({ root: root2 }) => root2.ref.fields = {};
  var getField = (root2, id) => root2.ref.fields[id];
  var syncFieldPositionsWithItems = (root2) => {
    root2.query("GET_ACTIVE_ITEMS").forEach((item2) => {
      if (!root2.ref.fields[item2.id]) return;
      root2.element.appendChild(root2.ref.fields[item2.id]);
    });
  };
  var didReorderItems = ({ root: root2 }) => syncFieldPositionsWithItems(root2);
  var didAddItem = ({ root: root2, action }) => {
    const fileItem = root2.query("GET_ITEM", action.id);
    const isLocalFile = fileItem.origin === FileOrigin.LOCAL;
    const shouldUseFileInput = !isLocalFile && root2.query("SHOULD_UPDATE_FILE_INPUT");
    const dataContainer = createElement$1("input");
    dataContainer.type = shouldUseFileInput ? "file" : "hidden";
    dataContainer.name = root2.query("GET_NAME");
    root2.ref.fields[action.id] = dataContainer;
    syncFieldPositionsWithItems(root2);
  };
  var didLoadItem$1 = ({ root: root2, action }) => {
    const field = getField(root2, action.id);
    if (!field) return;
    if (action.serverFileReference !== null) field.value = action.serverFileReference;
    if (!root2.query("SHOULD_UPDATE_FILE_INPUT")) return;
    const fileItem = root2.query("GET_ITEM", action.id);
    setInputFiles(field, [fileItem.file]);
  };
  var didPrepareOutput = ({ root: root2, action }) => {
    if (!root2.query("SHOULD_UPDATE_FILE_INPUT")) return;
    setTimeout(() => {
      const field = getField(root2, action.id);
      if (!field) return;
      setInputFiles(field, [action.file]);
    }, 0);
  };
  var didSetDisabled = ({ root: root2 }) => {
    root2.element.disabled = root2.query("GET_DISABLED");
  };
  var didRemoveItem = ({ root: root2, action }) => {
    const field = getField(root2, action.id);
    if (!field) return;
    if (field.parentNode) field.parentNode.removeChild(field);
    delete root2.ref.fields[action.id];
  };
  var didDefineValue = ({ root: root2, action }) => {
    const field = getField(root2, action.id);
    if (!field) return;
    if (action.value === null) {
      field.removeAttribute("value");
    } else {
      if (field.type != "file") {
        field.value = action.value;
      }
    }
    syncFieldPositionsWithItems(root2);
  };
  var write$8 = createRoute({
    DID_SET_DISABLED: didSetDisabled,
    DID_ADD_ITEM: didAddItem,
    DID_LOAD_ITEM: didLoadItem$1,
    DID_REMOVE_ITEM: didRemoveItem,
    DID_DEFINE_VALUE: didDefineValue,
    DID_PREPARE_OUTPUT: didPrepareOutput,
    DID_REORDER_ITEMS: didReorderItems,
    DID_SORT_ITEMS: didReorderItems
  });
  var data2 = createView({
    tag: "fieldset",
    name: "data",
    create: create$c,
    write: write$8,
    ignoreRect: true
  });
  var getRootNode = (element) => "getRootNode" in element ? element.getRootNode() : document;
  var images = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff"];
  var text$1 = ["css", "csv", "html", "txt"];
  var map = {
    zip: "zip|compressed",
    epub: "application/epub+zip"
  };
  var guesstimateMimeType = (extension = "") => {
    extension = extension.toLowerCase();
    if (images.includes(extension)) {
      return "image/" + (extension === "jpg" ? "jpeg" : extension === "svg" ? "svg+xml" : extension);
    }
    if (text$1.includes(extension)) {
      return "text/" + extension;
    }
    return map[extension] || "";
  };
  var requestDataTransferItems = (dataTransfer) => new Promise((resolve, reject) => {
    const links = getLinks(dataTransfer);
    if (links.length && !hasFiles(dataTransfer)) {
      return resolve(links);
    }
    getFiles(dataTransfer).then(resolve);
  });
  var hasFiles = (dataTransfer) => {
    if (dataTransfer.files) return dataTransfer.files.length > 0;
    return false;
  };
  var getFiles = (dataTransfer) => new Promise((resolve, reject) => {
    const promisedFiles = (dataTransfer.items ? Array.from(dataTransfer.items) : []).filter((item2) => isFileSystemItem(item2)).map((item2) => getFilesFromItem(item2));
    if (!promisedFiles.length) {
      resolve(dataTransfer.files ? Array.from(dataTransfer.files) : []);
      return;
    }
    Promise.all(promisedFiles).then((returnedFileGroups) => {
      const files = [];
      returnedFileGroups.forEach((group) => {
        files.push.apply(files, group);
      });
      resolve(
        files.filter((file2) => file2).map((file2) => {
          if (!file2._relativePath) file2._relativePath = file2.webkitRelativePath;
          return file2;
        })
      );
    }).catch(console.error);
  });
  var isFileSystemItem = (item2) => {
    if (isEntry(item2)) {
      const entry = getAsEntry(item2);
      if (entry) {
        return entry.isFile || entry.isDirectory;
      }
    }
    return item2.kind === "file";
  };
  var getFilesFromItem = (item2) => new Promise((resolve, reject) => {
    if (isDirectoryEntry(item2)) {
      getFilesInDirectory(getAsEntry(item2)).then(resolve).catch(reject);
      return;
    }
    resolve([item2.getAsFile()]);
  });
  var getFilesInDirectory = (entry) => new Promise((resolve, reject) => {
    const files = [];
    let dirCounter = 0;
    let fileCounter = 0;
    const resolveIfDone = () => {
      if (fileCounter === 0 && dirCounter === 0) {
        resolve(files);
      }
    };
    const readEntries = (dirEntry) => {
      dirCounter++;
      const directoryReader = dirEntry.createReader();
      const readBatch = () => {
        directoryReader.readEntries((entries) => {
          if (entries.length === 0) {
            dirCounter--;
            resolveIfDone();
            return;
          }
          entries.forEach((entry2) => {
            if (entry2.isDirectory) {
              readEntries(entry2);
            } else {
              fileCounter++;
              entry2.file((file2) => {
                const correctedFile = correctMissingFileType(file2);
                if (entry2.fullPath) correctedFile._relativePath = entry2.fullPath;
                files.push(correctedFile);
                fileCounter--;
                resolveIfDone();
              });
            }
          });
          readBatch();
        }, reject);
      };
      readBatch();
    };
    readEntries(entry);
  });
  var correctMissingFileType = (file2) => {
    if (file2.type.length) return file2;
    const date = file2.lastModifiedDate;
    const name2 = file2.name;
    const type = guesstimateMimeType(getExtensionFromFilename(file2.name));
    if (!type.length) return file2;
    file2 = file2.slice(0, file2.size, type);
    file2.name = name2;
    file2.lastModifiedDate = date;
    return file2;
  };
  var isDirectoryEntry = (item2) => isEntry(item2) && (getAsEntry(item2) || {}).isDirectory;
  var isEntry = (item2) => "webkitGetAsEntry" in item2;
  var getAsEntry = (item2) => item2.webkitGetAsEntry();
  var getLinks = (dataTransfer) => {
    let links = [];
    try {
      links = getLinksFromTransferMetaData(dataTransfer);
      if (links.length) {
        return links;
      }
      links = getLinksFromTransferURLData(dataTransfer);
    } catch (e) {
    }
    return links;
  };
  var getLinksFromTransferURLData = (dataTransfer) => {
    let data3 = dataTransfer.getData("url");
    if (typeof data3 === "string" && data3.length) {
      return [data3];
    }
    return [];
  };
  var getLinksFromTransferMetaData = (dataTransfer) => {
    let data3 = dataTransfer.getData("text/html");
    if (typeof data3 === "string" && data3.length) {
      const matches = data3.match(/src\s*=\s*"(.+?)"/);
      if (matches) {
        return [matches[1]];
      }
    }
    return [];
  };
  var dragNDropObservers = [];
  var eventPosition = (e) => ({
    pageLeft: e.pageX,
    pageTop: e.pageY,
    scopeLeft: e.offsetX || e.layerX,
    scopeTop: e.offsetY || e.layerY
  });
  var createDragNDropClient = (element, scopeToObserve, filterElement) => {
    const observer = getDragNDropObserver(scopeToObserve);
    const client = {
      element,
      filterElement,
      state: null,
      ondrop: () => {
      },
      onenter: () => {
      },
      ondrag: () => {
      },
      onexit: () => {
      },
      onload: () => {
      },
      allowdrop: () => {
      }
    };
    client.destroy = observer.addListener(client);
    return client;
  };
  var getDragNDropObserver = (element) => {
    const observer = dragNDropObservers.find((item2) => item2.element === element);
    if (observer) {
      return observer;
    }
    const newObserver = createDragNDropObserver(element);
    dragNDropObservers.push(newObserver);
    return newObserver;
  };
  var createDragNDropObserver = (element) => {
    const clients = [];
    const routes = {
      dragenter,
      dragover,
      dragleave,
      drop
    };
    const handlers = {};
    forin(routes, (event, createHandler) => {
      handlers[event] = createHandler(element, clients);
      element.addEventListener(event, handlers[event], false);
    });
    const observer = {
      element,
      addListener: (client) => {
        clients.push(client);
        return () => {
          clients.splice(clients.indexOf(client), 1);
          if (clients.length === 0) {
            dragNDropObservers.splice(dragNDropObservers.indexOf(observer), 1);
            forin(routes, (event) => {
              element.removeEventListener(event, handlers[event], false);
            });
          }
        };
      }
    };
    return observer;
  };
  var elementFromPoint = (root2, point) => {
    if (!("elementFromPoint" in root2)) {
      root2 = document;
    }
    return root2.elementFromPoint(point.x, point.y);
  };
  var isEventTarget = (e, target) => {
    const root2 = getRootNode(target);
    const elementAtPosition = elementFromPoint(root2, {
      x: e.pageX - window.pageXOffset,
      y: e.pageY - window.pageYOffset
    });
    return elementAtPosition === target || target.contains(elementAtPosition);
  };
  var initialTarget = null;
  var setDropEffect = (dataTransfer, effect) => {
    try {
      dataTransfer.dropEffect = effect;
    } catch (e) {
    }
  };
  var dragenter = (root2, clients) => (e) => {
    e.preventDefault();
    initialTarget = e.target;
    clients.forEach((client) => {
      const { element, onenter } = client;
      if (isEventTarget(e, element)) {
        client.state = "enter";
        onenter(eventPosition(e));
      }
    });
  };
  var dragover = (root2, clients) => (e) => {
    e.preventDefault();
    const dataTransfer = e.dataTransfer;
    requestDataTransferItems(dataTransfer).then((items) => {
      let overDropTarget = false;
      clients.some((client) => {
        const { filterElement, element, onenter, onexit, ondrag, allowdrop } = client;
        setDropEffect(dataTransfer, "copy");
        const allowsTransfer = allowdrop(items);
        if (!allowsTransfer) {
          setDropEffect(dataTransfer, "none");
          return;
        }
        if (isEventTarget(e, element)) {
          overDropTarget = true;
          if (client.state === null) {
            client.state = "enter";
            onenter(eventPosition(e));
            return;
          }
          client.state = "over";
          if (filterElement && !allowsTransfer) {
            setDropEffect(dataTransfer, "none");
            return;
          }
          ondrag(eventPosition(e));
        } else {
          if (filterElement && !overDropTarget) {
            setDropEffect(dataTransfer, "none");
          }
          if (client.state) {
            client.state = null;
            onexit(eventPosition(e));
          }
        }
      });
    });
  };
  var drop = (root2, clients) => (e) => {
    e.preventDefault();
    const dataTransfer = e.dataTransfer;
    requestDataTransferItems(dataTransfer).then((items) => {
      clients.forEach((client) => {
        const { filterElement, element, ondrop, onexit, allowdrop } = client;
        client.state = null;
        if (filterElement && !isEventTarget(e, element)) return;
        if (!allowdrop(items)) return onexit(eventPosition(e));
        ondrop(eventPosition(e), items);
      });
    });
  };
  var dragleave = (root2, clients) => (e) => {
    if (initialTarget !== e.target) {
      return;
    }
    clients.forEach((client) => {
      const { onexit } = client;
      client.state = null;
      onexit(eventPosition(e));
    });
  };
  var createHopper = (scope, validateItems, options) => {
    scope.classList.add("filepond--hopper");
    const { catchesDropsOnPage, requiresDropOnElement, filterItems = (items) => items } = options;
    const client = createDragNDropClient(
      scope,
      catchesDropsOnPage ? document.documentElement : scope,
      requiresDropOnElement
    );
    let lastState = "";
    let currentState = "";
    client.allowdrop = (items) => {
      return validateItems(filterItems(items));
    };
    client.ondrop = (position, items) => {
      const filteredItems = filterItems(items);
      if (!validateItems(filteredItems)) {
        api.ondragend(position);
        return;
      }
      currentState = "drag-drop";
      api.onload(filteredItems, position);
    };
    client.ondrag = (position) => {
      api.ondrag(position);
    };
    client.onenter = (position) => {
      currentState = "drag-over";
      api.ondragstart(position);
    };
    client.onexit = (position) => {
      currentState = "drag-exit";
      api.ondragend(position);
    };
    const api = {
      updateHopperState: () => {
        if (lastState !== currentState) {
          scope.dataset.hopperState = currentState;
          lastState = currentState;
        }
      },
      onload: () => {
      },
      ondragstart: () => {
      },
      ondrag: () => {
      },
      ondragend: () => {
      },
      destroy: () => {
        client.destroy();
      }
    };
    return api;
  };
  var listening = false;
  var listeners$1 = [];
  var handlePaste = (e) => {
    const activeEl = document.activeElement;
    const isActiveElementEditable = activeEl && (/textarea|input/i.test(activeEl.nodeName) || activeEl.getAttribute("contenteditable") === "true");
    if (isActiveElementEditable) {
      let inScope = false;
      let element = activeEl;
      while (element !== document.body) {
        if (element.classList.contains("filepond--root")) {
          inScope = true;
          break;
        }
        element = element.parentNode;
      }
      if (!inScope) return;
    }
    requestDataTransferItems(e.clipboardData).then((files) => {
      if (!files.length) {
        return;
      }
      listeners$1.forEach((listener) => listener(files));
    });
  };
  var listen = (cb) => {
    if (listeners$1.includes(cb)) {
      return;
    }
    listeners$1.push(cb);
    if (listening) {
      return;
    }
    listening = true;
    document.addEventListener("paste", handlePaste);
  };
  var unlisten = (listener) => {
    arrayRemove(listeners$1, listeners$1.indexOf(listener));
    if (listeners$1.length === 0) {
      document.removeEventListener("paste", handlePaste);
      listening = false;
    }
  };
  var createPaster = () => {
    const cb = (files) => {
      api.onload(files);
    };
    const api = {
      destroy: () => {
        unlisten(cb);
      },
      onload: () => {
      }
    };
    listen(cb);
    return api;
  };
  var create$d = ({ root: root2, props }) => {
    root2.element.id = `filepond--assistant-${props.id}`;
    attr(root2.element, "role", "status");
    attr(root2.element, "aria-live", "polite");
    attr(root2.element, "aria-relevant", "additions");
  };
  var addFilesNotificationTimeout = null;
  var notificationClearTimeout = null;
  var filenames = [];
  var assist = (root2, message) => {
    root2.element.textContent = message;
  };
  var clear$1 = (root2) => {
    root2.element.textContent = "";
  };
  var listModified = (root2, filename, label) => {
    const total = root2.query("GET_TOTAL_ITEMS");
    assist(
      root2,
      `${label} ${filename}, ${total} ${total === 1 ? root2.query("GET_LABEL_FILE_COUNT_SINGULAR") : root2.query("GET_LABEL_FILE_COUNT_PLURAL")}`
    );
    clearTimeout(notificationClearTimeout);
    notificationClearTimeout = setTimeout(() => {
      clear$1(root2);
    }, 1500);
  };
  var isUsingFilePond = (root2) => root2.element.parentNode.contains(document.activeElement);
  var itemAdded = ({ root: root2, action }) => {
    if (!isUsingFilePond(root2)) {
      return;
    }
    root2.element.textContent = "";
    const item2 = root2.query("GET_ITEM", action.id);
    filenames.push(item2.filename);
    clearTimeout(addFilesNotificationTimeout);
    addFilesNotificationTimeout = setTimeout(() => {
      listModified(root2, filenames.join(", "), root2.query("GET_LABEL_FILE_ADDED"));
      filenames.length = 0;
    }, 750);
  };
  var itemRemoved = ({ root: root2, action }) => {
    if (!isUsingFilePond(root2)) {
      return;
    }
    const item2 = action.item;
    listModified(root2, item2.filename, root2.query("GET_LABEL_FILE_REMOVED"));
  };
  var itemProcessed = ({ root: root2, action }) => {
    const item2 = root2.query("GET_ITEM", action.id);
    const filename = item2.filename;
    const label = root2.query("GET_LABEL_FILE_PROCESSING_COMPLETE");
    assist(root2, `${filename} ${label}`);
  };
  var itemProcessedUndo = ({ root: root2, action }) => {
    const item2 = root2.query("GET_ITEM", action.id);
    const filename = item2.filename;
    const label = root2.query("GET_LABEL_FILE_PROCESSING_ABORTED");
    assist(root2, `${filename} ${label}`);
  };
  var itemError = ({ root: root2, action }) => {
    const item2 = root2.query("GET_ITEM", action.id);
    const filename = item2.filename;
    assist(root2, `${action.status.main} ${filename} ${action.status.sub}`);
  };
  var assistant = createView({
    create: create$d,
    ignoreRect: true,
    ignoreRectUpdate: true,
    write: createRoute({
      DID_LOAD_ITEM: itemAdded,
      DID_REMOVE_ITEM: itemRemoved,
      DID_COMPLETE_ITEM_PROCESSING: itemProcessed,
      DID_ABORT_ITEM_PROCESSING: itemProcessedUndo,
      DID_REVERT_ITEM_PROCESSING: itemProcessedUndo,
      DID_THROW_ITEM_REMOVE_ERROR: itemError,
      DID_THROW_ITEM_LOAD_ERROR: itemError,
      DID_THROW_ITEM_INVALID: itemError,
      DID_THROW_ITEM_PROCESSING_ERROR: itemError
    }),
    tag: "span",
    name: "assistant"
  });
  var toCamels = (string, separator = "-") => string.replace(new RegExp(`${separator}.`, "g"), (sub) => sub.charAt(1).toUpperCase());
  var debounce = (func, interval = 16, immidiateOnly = true) => {
    let last = Date.now();
    let timeout = null;
    return (...args) => {
      clearTimeout(timeout);
      const dist = Date.now() - last;
      const fn2 = () => {
        last = Date.now();
        func(...args);
      };
      if (dist < interval) {
        if (!immidiateOnly) {
          timeout = setTimeout(fn2, interval - dist);
        }
      } else {
        fn2();
      }
    };
  };
  var MAX_FILES_LIMIT = 1e6;
  var prevent = (e) => e.preventDefault();
  var create$e = ({ root: root2, props }) => {
    const id = root2.query("GET_ID");
    if (id) {
      root2.element.id = id;
    }
    const className = root2.query("GET_CLASS_NAME");
    if (className) {
      className.split(" ").filter((name2) => name2.length).forEach((name2) => {
        root2.element.classList.add(name2);
      });
    }
    root2.ref.label = root2.appendChildView(
      root2.createChildView(dropLabel, {
        ...props,
        translateY: null,
        caption: root2.query("GET_LABEL_IDLE")
      })
    );
    root2.ref.list = root2.appendChildView(root2.createChildView(listScroller, { translateY: null }));
    root2.ref.panel = root2.appendChildView(root2.createChildView(panel, { name: "panel-root" }));
    root2.ref.assistant = root2.appendChildView(root2.createChildView(assistant, { ...props }));
    root2.ref.data = root2.appendChildView(root2.createChildView(data2, { ...props }));
    root2.ref.measure = createElement$1("div");
    root2.ref.measure.style.height = "100%";
    root2.element.appendChild(root2.ref.measure);
    root2.ref.bounds = null;
    root2.query("GET_STYLES").filter((style) => !isEmpty(style.value)).map(({ name: name2, value }) => {
      root2.element.dataset[name2] = value;
    });
    root2.ref.widthPrevious = null;
    root2.ref.widthUpdated = debounce(() => {
      root2.ref.updateHistory = [];
      root2.dispatch("DID_RESIZE_ROOT");
    }, 250);
    root2.ref.previousAspectRatio = null;
    root2.ref.updateHistory = [];
    const canHover = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const hasPointerEvents = "PointerEvent" in window;
    if (root2.query("GET_ALLOW_REORDER") && hasPointerEvents && !canHover) {
      root2.element.addEventListener("touchmove", prevent, { passive: false });
      root2.element.addEventListener("gesturestart", prevent);
    }
    const credits = root2.query("GET_CREDITS");
    const hasCredits = credits.length === 2;
    if (hasCredits) {
      const frag = document.createElement("a");
      frag.className = "filepond--credits";
      frag.href = credits[0];
      frag.tabIndex = -1;
      frag.target = "_blank";
      frag.rel = "noopener noreferrer";
      frag.textContent = credits[1];
      root2.element.appendChild(frag);
      root2.ref.credits = frag;
    }
  };
  var write$9 = ({ root: root2, props, actions: actions2 }) => {
    route$5({ root: root2, props, actions: actions2 });
    actions2.filter((action) => /^DID_SET_STYLE_/.test(action.type)).filter((action) => !isEmpty(action.data.value)).map(({ type, data: data3 }) => {
      const name2 = toCamels(type.substring(8).toLowerCase(), "_");
      root2.element.dataset[name2] = data3.value;
      root2.invalidateLayout();
    });
    if (root2.rect.element.hidden) return;
    if (root2.rect.element.width !== root2.ref.widthPrevious) {
      root2.ref.widthPrevious = root2.rect.element.width;
      root2.ref.widthUpdated();
    }
    let bounds = root2.ref.bounds;
    if (!bounds) {
      bounds = root2.ref.bounds = calculateRootBoundingBoxHeight(root2);
      root2.element.removeChild(root2.ref.measure);
      root2.ref.measure = null;
    }
    const { hopper, label, list: list2, panel: panel2 } = root2.ref;
    if (hopper) {
      hopper.updateHopperState();
    }
    const aspectRatio = root2.query("GET_PANEL_ASPECT_RATIO");
    const isMultiItem = root2.query("GET_ALLOW_MULTIPLE");
    const totalItems = root2.query("GET_TOTAL_ITEMS");
    const maxItems = isMultiItem ? root2.query("GET_MAX_FILES") || MAX_FILES_LIMIT : 1;
    const atMaxCapacity = totalItems === maxItems;
    const addAction = actions2.find((action) => action.type === "DID_ADD_ITEM");
    if (atMaxCapacity && addAction) {
      const interactionMethod = addAction.data.interactionMethod;
      label.opacity = 0;
      if (isMultiItem) {
        label.translateY = -40;
      } else {
        if (interactionMethod === InteractionMethod.API) {
          label.translateX = 40;
        } else if (interactionMethod === InteractionMethod.BROWSE) {
          label.translateY = 40;
        } else {
          label.translateY = 30;
        }
      }
    } else if (!atMaxCapacity) {
      label.opacity = 1;
      label.translateX = 0;
      label.translateY = 0;
    }
    const listItemMargin = calculateListItemMargin(root2);
    const listHeight = calculateListHeight(root2);
    const labelHeight = label.rect.element.height;
    const currentLabelHeight = !isMultiItem || atMaxCapacity ? 0 : labelHeight;
    const listMarginTop = atMaxCapacity ? list2.rect.element.marginTop : 0;
    const listMarginBottom = totalItems === 0 ? 0 : list2.rect.element.marginBottom;
    const visualHeight = currentLabelHeight + listMarginTop + listHeight.visual + listMarginBottom;
    const boundsHeight = currentLabelHeight + listMarginTop + listHeight.bounds + listMarginBottom;
    list2.translateY = Math.max(0, currentLabelHeight - list2.rect.element.marginTop) - listItemMargin.top;
    if (aspectRatio) {
      const width2 = root2.rect.element.width;
      const height2 = width2 * aspectRatio;
      if (aspectRatio !== root2.ref.previousAspectRatio) {
        root2.ref.previousAspectRatio = aspectRatio;
        root2.ref.updateHistory = [];
      }
      const history = root2.ref.updateHistory;
      history.push(width2);
      const MAX_BOUNCES = 2;
      if (history.length > MAX_BOUNCES * 2) {
        const l = history.length;
        const bottom = l - 10;
        let bounces = 0;
        for (let i = l; i >= bottom; i--) {
          if (history[i] === history[i - 2]) {
            bounces++;
          }
          if (bounces >= MAX_BOUNCES) {
            return;
          }
        }
      }
      panel2.scalable = false;
      panel2.height = height2;
      const listAvailableHeight = (
        // the height of the panel minus the label height
        height2 - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
        (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
        (atMaxCapacity ? listMarginTop : 0)
      );
      if (listHeight.visual > listAvailableHeight) {
        list2.overflow = listAvailableHeight;
      } else {
        list2.overflow = null;
      }
      root2.height = height2;
    } else if (bounds.fixedHeight) {
      panel2.scalable = false;
      const listAvailableHeight = (
        // the height of the panel minus the label height
        bounds.fixedHeight - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
        (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
        (atMaxCapacity ? listMarginTop : 0)
      );
      if (listHeight.visual > listAvailableHeight) {
        list2.overflow = listAvailableHeight;
      } else {
        list2.overflow = null;
      }
    } else if (bounds.cappedHeight) {
      const isCappedHeight = visualHeight >= bounds.cappedHeight;
      const panelHeight = Math.min(bounds.cappedHeight, visualHeight);
      panel2.scalable = true;
      panel2.height = isCappedHeight ? panelHeight : panelHeight - listItemMargin.top - listItemMargin.bottom;
      const listAvailableHeight = (
        // the height of the panel minus the label height
        panelHeight - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
        (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
        (atMaxCapacity ? listMarginTop : 0)
      );
      if (visualHeight > bounds.cappedHeight && listHeight.visual > listAvailableHeight) {
        list2.overflow = listAvailableHeight;
      } else {
        list2.overflow = null;
      }
      root2.height = Math.min(
        bounds.cappedHeight,
        boundsHeight - listItemMargin.top - listItemMargin.bottom
      );
    } else {
      const itemMargin = totalItems > 0 ? listItemMargin.top + listItemMargin.bottom : 0;
      panel2.scalable = true;
      panel2.height = Math.max(labelHeight, visualHeight - itemMargin);
      root2.height = Math.max(labelHeight, boundsHeight - itemMargin);
    }
    if (root2.ref.credits && panel2.heightCurrent)
      root2.ref.credits.style.transform = `translateY(${panel2.heightCurrent}px)`;
  };
  var calculateListItemMargin = (root2) => {
    const item2 = root2.ref.list.childViews[0].childViews[0];
    return item2 ? {
      top: item2.rect.element.marginTop,
      bottom: item2.rect.element.marginBottom
    } : {
      top: 0,
      bottom: 0
    };
  };
  var calculateListHeight = (root2) => {
    let visual = 0;
    let bounds = 0;
    const scrollList = root2.ref.list;
    const itemList = scrollList.childViews[0];
    const visibleChildren = itemList.childViews.filter((child) => child.rect.element.height);
    const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
    if (children.length === 0) return { visual, bounds };
    const horizontalSpace = itemList.rect.element.width;
    const dragIndex = getItemIndexByPosition(itemList, children, scrollList.dragCoordinates);
    const childRect = children[0].rect.element;
    const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
    const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
    const itemWidth = childRect.width + itemHorizontalMargin;
    const itemHeight = childRect.height + itemVerticalMargin;
    const newItem = typeof dragIndex !== "undefined" && dragIndex >= 0 ? 1 : 0;
    const removedItem = children.find((child) => child.markedForRemoval && child.opacity < 0.45) ? -1 : 0;
    const verticalItemCount = children.length + newItem + removedItem;
    const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
    if (itemsPerRow === 1) {
      children.forEach((item2) => {
        const height2 = item2.rect.element.height + itemVerticalMargin;
        bounds += height2;
        visual += height2 * item2.opacity;
      });
    } else {
      bounds = Math.ceil(verticalItemCount / itemsPerRow) * itemHeight;
      visual = bounds;
    }
    return { visual, bounds };
  };
  var calculateRootBoundingBoxHeight = (root2) => {
    const height2 = root2.ref.measureHeight || null;
    const cappedHeight = parseInt(root2.style.maxHeight, 10) || null;
    const fixedHeight = height2 === 0 ? null : height2;
    return {
      cappedHeight,
      fixedHeight
    };
  };
  var exceedsMaxFiles = (root2, items) => {
    const allowReplace = root2.query("GET_ALLOW_REPLACE");
    const allowMultiple = root2.query("GET_ALLOW_MULTIPLE");
    const totalItems = root2.query("GET_TOTAL_ITEMS");
    let maxItems = root2.query("GET_MAX_FILES");
    const totalBrowseItems = items.length;
    if (!allowMultiple && totalBrowseItems > 1) {
      root2.dispatch("DID_THROW_MAX_FILES", {
        source: items,
        error: createResponse("warning", 0, "Max files")
      });
      return true;
    }
    maxItems = allowMultiple ? maxItems : 1;
    if (!allowMultiple && allowReplace) {
      return false;
    }
    const hasMaxItems = isInt(maxItems);
    if (hasMaxItems && totalItems + totalBrowseItems > maxItems) {
      root2.dispatch("DID_THROW_MAX_FILES", {
        source: items,
        error: createResponse("warning", 0, "Max files")
      });
      return true;
    }
    return false;
  };
  var getDragIndex = (list2, children, position) => {
    const itemList = list2.childViews[0];
    return getItemIndexByPosition(itemList, children, {
      left: position.scopeLeft - itemList.rect.element.left,
      top: position.scopeTop - (list2.rect.outer.top + list2.rect.element.marginTop + list2.rect.element.scrollTop)
    });
  };
  var toggleDrop = (root2) => {
    const isAllowed = root2.query("GET_ALLOW_DROP");
    const isDisabled = root2.query("GET_DISABLED");
    const enabled = isAllowed && !isDisabled;
    if (enabled && !root2.ref.hopper) {
      const hopper = createHopper(
        root2.element,
        (items) => {
          const beforeDropFile = root2.query("GET_BEFORE_DROP_FILE") || (() => true);
          const dropValidation = root2.query("GET_DROP_VALIDATION");
          return dropValidation ? items.every(
            (item2) => applyFilters("ALLOW_HOPPER_ITEM", item2, {
              query: root2.query
            }).every((result) => result === true) && beforeDropFile(item2)
          ) : true;
        },
        {
          filterItems: (items) => {
            const ignoredFiles = root2.query("GET_IGNORED_FILES");
            return items.filter((item2) => {
              if (isFile(item2)) {
                return !ignoredFiles.includes(item2.name.toLowerCase());
              }
              return true;
            });
          },
          catchesDropsOnPage: root2.query("GET_DROP_ON_PAGE"),
          requiresDropOnElement: root2.query("GET_DROP_ON_ELEMENT")
        }
      );
      hopper.onload = (items, position) => {
        const list2 = root2.ref.list.childViews[0];
        const visibleChildren = list2.childViews.filter((child) => child.rect.element.height);
        const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
        applyFilterChain("ADD_ITEMS", items, { dispatch: root2.dispatch }).then((queue) => {
          if (exceedsMaxFiles(root2, queue)) return false;
          root2.dispatch("ADD_ITEMS", {
            items: queue,
            index: getDragIndex(root2.ref.list, children, position),
            interactionMethod: InteractionMethod.DROP
          });
        });
        root2.dispatch("DID_DROP", { position });
        root2.dispatch("DID_END_DRAG", { position });
      };
      hopper.ondragstart = (position) => {
        root2.dispatch("DID_START_DRAG", { position });
      };
      hopper.ondrag = debounce((position) => {
        root2.dispatch("DID_DRAG", { position });
      });
      hopper.ondragend = (position) => {
        root2.dispatch("DID_END_DRAG", { position });
      };
      root2.ref.hopper = hopper;
      root2.ref.drip = root2.appendChildView(root2.createChildView(drip));
    } else if (!enabled && root2.ref.hopper) {
      root2.ref.hopper.destroy();
      root2.ref.hopper = null;
      root2.removeChildView(root2.ref.drip);
    }
  };
  var toggleBrowse = (root2, props) => {
    const isAllowed = root2.query("GET_ALLOW_BROWSE");
    const isDisabled = root2.query("GET_DISABLED");
    const enabled = isAllowed && !isDisabled;
    if (enabled && !root2.ref.browser) {
      root2.ref.browser = root2.appendChildView(
        root2.createChildView(browser, {
          ...props,
          onload: (items) => {
            applyFilterChain("ADD_ITEMS", items, {
              dispatch: root2.dispatch
            }).then((queue) => {
              if (exceedsMaxFiles(root2, queue)) return false;
              root2.dispatch("ADD_ITEMS", {
                items: queue,
                index: -1,
                interactionMethod: InteractionMethod.BROWSE
              });
            });
          }
        }),
        0
      );
    } else if (!enabled && root2.ref.browser) {
      root2.removeChildView(root2.ref.browser);
      root2.ref.browser = null;
    }
  };
  var togglePaste = (root2) => {
    const isAllowed = root2.query("GET_ALLOW_PASTE");
    const isDisabled = root2.query("GET_DISABLED");
    const enabled = isAllowed && !isDisabled;
    if (enabled && !root2.ref.paster) {
      root2.ref.paster = createPaster();
      root2.ref.paster.onload = (items) => {
        applyFilterChain("ADD_ITEMS", items, { dispatch: root2.dispatch }).then((queue) => {
          if (exceedsMaxFiles(root2, queue)) return false;
          root2.dispatch("ADD_ITEMS", {
            items: queue,
            index: -1,
            interactionMethod: InteractionMethod.PASTE
          });
        });
      };
    } else if (!enabled && root2.ref.paster) {
      root2.ref.paster.destroy();
      root2.ref.paster = null;
    }
  };
  var route$5 = createRoute({
    DID_SET_ALLOW_BROWSE: ({ root: root2, props }) => {
      toggleBrowse(root2, props);
    },
    DID_SET_ALLOW_DROP: ({ root: root2 }) => {
      toggleDrop(root2);
    },
    DID_SET_ALLOW_PASTE: ({ root: root2 }) => {
      togglePaste(root2);
    },
    DID_SET_DISABLED: ({ root: root2, props }) => {
      toggleDrop(root2);
      togglePaste(root2);
      toggleBrowse(root2, props);
      const isDisabled = root2.query("GET_DISABLED");
      if (isDisabled) {
        root2.element.dataset.disabled = "disabled";
      } else {
        root2.element.removeAttribute("data-disabled");
      }
    }
  });
  var root = createView({
    name: "root",
    read: ({ root: root2 }) => {
      if (root2.ref.measure) {
        root2.ref.measureHeight = root2.ref.measure.offsetHeight;
      }
    },
    create: create$e,
    write: write$9,
    destroy: ({ root: root2 }) => {
      if (root2.ref.paster) {
        root2.ref.paster.destroy();
      }
      if (root2.ref.hopper) {
        root2.ref.hopper.destroy();
      }
      root2.element.removeEventListener("touchmove", prevent);
      root2.element.removeEventListener("gesturestart", prevent);
    },
    mixins: {
      styles: ["height"]
    }
  });
  var createApp = (initialOptions = {}) => {
    let originalElement = null;
    const defaultOptions2 = getOptions();
    const store = createStore(
      // initial state (should be serializable)
      createInitialState(defaultOptions2),
      // queries
      [queries, createOptionQueries(defaultOptions2)],
      // action handlers
      [actions, createOptionActions(defaultOptions2)]
    );
    store.dispatch("SET_OPTIONS", { options: initialOptions });
    const visibilityHandler = () => {
      if (document.hidden) return;
      store.dispatch("KICK");
    };
    document.addEventListener("visibilitychange", visibilityHandler);
    let resizeDoneTimer = null;
    let isResizing = false;
    let isResizingHorizontally = false;
    let initialWindowWidth = null;
    let currentWindowWidth = null;
    const resizeHandler = () => {
      if (!isResizing) {
        isResizing = true;
      }
      clearTimeout(resizeDoneTimer);
      resizeDoneTimer = setTimeout(() => {
        isResizing = false;
        initialWindowWidth = null;
        currentWindowWidth = null;
        if (isResizingHorizontally) {
          isResizingHorizontally = false;
          store.dispatch("DID_STOP_RESIZE");
        }
      }, 500);
    };
    window.addEventListener("resize", resizeHandler);
    const view = root(store, { id: getUniqueId() });
    let isResting = false;
    let isHidden = false;
    const readWriteApi = {
      // necessary for update loop
      /**
       * Reads from dom (never call manually)
       * @private
       */
      _read: () => {
        if (isResizing) {
          currentWindowWidth = window.innerWidth;
          if (!initialWindowWidth) {
            initialWindowWidth = currentWindowWidth;
          }
          if (!isResizingHorizontally && currentWindowWidth !== initialWindowWidth) {
            store.dispatch("DID_START_RESIZE");
            isResizingHorizontally = true;
          }
        }
        if (isHidden && isResting) {
          isResting = view.element.offsetParent === null;
        }
        if (isResting) return;
        view._read();
        isHidden = view.rect.element.hidden;
      },
      /**
       * Writes to dom (never call manually)
       * @private
       */
      _write: (ts) => {
        const actions2 = store.processActionQueue().filter((action) => !/^SET_/.test(action.type));
        if (isResting && !actions2.length) return;
        routeActionsToEvents(actions2);
        isResting = view._write(ts, actions2, isResizingHorizontally);
        removeReleasedItems(store.query("GET_ITEMS"));
        if (isResting) {
          store.processDispatchQueue();
        }
      }
    };
    const createEvent = (name2) => (data3) => {
      const event = {
        type: name2
      };
      if (!data3) {
        return event;
      }
      if (data3.hasOwnProperty("error")) {
        event.error = data3.error ? { ...data3.error } : null;
      }
      if (data3.status) {
        event.status = { ...data3.status };
      }
      if (data3.file) {
        event.output = data3.file;
      }
      if (data3.source) {
        event.file = data3.source;
      } else if (data3.item || data3.id) {
        const item2 = data3.item ? data3.item : store.query("GET_ITEM", data3.id);
        event.file = item2 ? createItemAPI(item2) : null;
      }
      if (data3.items) {
        event.items = data3.items.map(createItemAPI);
      }
      if (/progress/.test(name2)) {
        event.progress = data3.progress;
      }
      if (data3.hasOwnProperty("origin") && data3.hasOwnProperty("target")) {
        event.origin = data3.origin;
        event.target = data3.target;
      }
      return event;
    };
    const eventRoutes = {
      DID_DESTROY: createEvent("destroy"),
      DID_INIT: createEvent("init"),
      DID_THROW_MAX_FILES: createEvent("warning"),
      DID_INIT_ITEM: createEvent("initfile"),
      DID_START_ITEM_LOAD: createEvent("addfilestart"),
      DID_UPDATE_ITEM_LOAD_PROGRESS: createEvent("addfileprogress"),
      DID_LOAD_ITEM: createEvent("addfile"),
      DID_THROW_ITEM_INVALID: [createEvent("error"), createEvent("addfile")],
      DID_THROW_ITEM_LOAD_ERROR: [createEvent("error"), createEvent("addfile")],
      DID_THROW_ITEM_REMOVE_ERROR: [createEvent("error"), createEvent("removefile")],
      DID_PREPARE_OUTPUT: createEvent("preparefile"),
      DID_START_ITEM_PROCESSING: createEvent("processfilestart"),
      DID_UPDATE_ITEM_PROCESS_PROGRESS: createEvent("processfileprogress"),
      DID_ABORT_ITEM_PROCESSING: createEvent("processfileabort"),
      DID_COMPLETE_ITEM_PROCESSING: createEvent("processfile"),
      DID_COMPLETE_ITEM_PROCESSING_ALL: createEvent("processfiles"),
      DID_REVERT_ITEM_PROCESSING: createEvent("processfilerevert"),
      DID_THROW_ITEM_PROCESSING_ERROR: [createEvent("error"), createEvent("processfile")],
      DID_REMOVE_ITEM: createEvent("removefile"),
      DID_UPDATE_ITEMS: createEvent("updatefiles"),
      DID_ACTIVATE_ITEM: createEvent("activatefile"),
      DID_REORDER_ITEMS: createEvent("reorderfiles")
    };
    const exposeEvent = (event) => {
      const detail = { pond: exports, ...event };
      delete detail.type;
      view.element.dispatchEvent(
        new CustomEvent(`FilePond:${event.type}`, {
          // event info
          detail,
          // event behaviour
          bubbles: true,
          cancelable: true,
          composed: true
          // triggers listeners outside of shadow root
        })
      );
      const params = [];
      if (event.hasOwnProperty("error")) {
        params.push(event.error);
      }
      if (event.hasOwnProperty("file")) {
        params.push(event.file);
      }
      const filtered = ["type", "error", "file"];
      Object.keys(event).filter((key) => !filtered.includes(key)).forEach((key) => params.push(event[key]));
      exports.fire(event.type, ...params);
      const handler = store.query(`GET_ON${event.type.toUpperCase()}`);
      if (handler) {
        handler(...params);
      }
    };
    const routeActionsToEvents = (actions2) => {
      if (!actions2.length) return;
      actions2.filter((action) => eventRoutes[action.type]).forEach((action) => {
        const routes = eventRoutes[action.type];
        (Array.isArray(routes) ? routes : [routes]).forEach((route2) => {
          if (action.type === "DID_INIT_ITEM") {
            exposeEvent(route2(action.data));
          } else {
            setTimeout(() => {
              exposeEvent(route2(action.data));
            }, 0);
          }
        });
      });
    };
    const setOptions2 = (options) => store.dispatch("SET_OPTIONS", { options });
    const getFile = (query) => store.query("GET_ACTIVE_ITEM", query);
    const prepareFile = (query) => new Promise((resolve, reject) => {
      store.dispatch("REQUEST_ITEM_PREPARE", {
        query,
        success: (item2) => {
          resolve(item2);
        },
        failure: (error2) => {
          reject(error2);
        }
      });
    });
    const addFile = (source, options = {}) => new Promise((resolve, reject) => {
      addFiles([{ source, options }], { index: options.index }).then((items) => resolve(items && items[0])).catch(reject);
    });
    const isFilePondFile = (obj) => obj.file && obj.id;
    const removeFile = (query, options) => {
      if (typeof query === "object" && !isFilePondFile(query) && !options) {
        options = query;
        query = void 0;
      }
      store.dispatch("REMOVE_ITEM", { ...options, query });
      return store.query("GET_ACTIVE_ITEM", query) === null;
    };
    const addFiles = (...args) => new Promise((resolve, reject) => {
      const sources = [];
      const options = {};
      if (isArray(args[0])) {
        sources.push.apply(sources, args[0]);
        Object.assign(options, args[1] || {});
      } else {
        const lastArgument = args[args.length - 1];
        if (typeof lastArgument === "object" && !(lastArgument instanceof Blob)) {
          Object.assign(options, args.pop());
        }
        sources.push(...args);
      }
      store.dispatch("ADD_ITEMS", {
        items: sources,
        index: options.index,
        interactionMethod: InteractionMethod.API,
        success: resolve,
        failure: reject
      });
    });
    const getFiles2 = () => store.query("GET_ACTIVE_ITEMS");
    const processFile = (query) => new Promise((resolve, reject) => {
      store.dispatch("REQUEST_ITEM_PROCESSING", {
        query,
        success: (item2) => {
          resolve(item2);
        },
        failure: (error2) => {
          reject(error2);
        }
      });
    });
    const prepareFiles = (...args) => {
      const queries2 = Array.isArray(args[0]) ? args[0] : args;
      const items = queries2.length ? queries2 : getFiles2();
      return Promise.all(items.map(prepareFile));
    };
    const processFiles = (...args) => {
      const queries2 = Array.isArray(args[0]) ? args[0] : args;
      if (!queries2.length) {
        const files = getFiles2().filter(
          (item2) => !(item2.status === ItemStatus.IDLE && item2.origin === FileOrigin.LOCAL) && item2.status !== ItemStatus.PROCESSING && item2.status !== ItemStatus.PROCESSING_COMPLETE && item2.status !== ItemStatus.PROCESSING_REVERT_ERROR
        );
        return Promise.all(files.map(processFile));
      }
      return Promise.all(queries2.map(processFile));
    };
    const removeFiles = (...args) => {
      const queries2 = Array.isArray(args[0]) ? args[0] : args;
      let options;
      if (typeof queries2[queries2.length - 1] === "object") {
        options = queries2.pop();
      } else if (Array.isArray(args[0])) {
        options = args[1];
      }
      const files = getFiles2();
      if (!queries2.length) return Promise.all(files.map((file2) => removeFile(file2, options)));
      const mappedQueries = queries2.map((query) => isNumber(query) ? files[query] ? files[query].id : null : query).filter((query) => query);
      return mappedQueries.map((q) => removeFile(q, options));
    };
    const exports = {
      // supports events
      ...on(),
      // inject private api methods
      ...readWriteApi,
      // inject all getters and setters
      ...createOptionAPI(store, defaultOptions2),
      /**
       * Override options defined in options object
       * @param options
       */
      setOptions: setOptions2,
      /**
       * Load the given file
       * @param source - the source of the file (either a File, base64 data uri or url)
       * @param options - object, { index: 0 }
       */
      addFile,
      /**
       * Load the given files
       * @param sources - the sources of the files to load
       * @param options - object, { index: 0 }
       */
      addFiles,
      /**
       * Returns the file objects matching the given query
       * @param query { string, number, null }
       */
      getFile,
      /**
       * Upload file with given name
       * @param query { string, number, null  }
       */
      processFile,
      /**
       * Request prepare output for file with given name
       * @param query { string, number, null  }
       */
      prepareFile,
      /**
       * Removes a file by its name
       * @param query { string, number, null  }
       */
      removeFile,
      /**
       * Moves a file to a new location in the files list
       */
      moveFile: (query, index) => store.dispatch("MOVE_ITEM", { query, index }),
      /**
       * Returns all files (wrapped in public api)
       */
      getFiles: getFiles2,
      /**
       * Starts uploading all files
       */
      processFiles,
      /**
       * Clears all files from the files list
       */
      removeFiles,
      /**
       * Starts preparing output of all files
       */
      prepareFiles,
      /**
       * Sort list of files
       */
      sort: (compare) => store.dispatch("SORT", { compare }),
      /**
       * Browse the file system for a file
       */
      browse: () => {
        var input = view.element.querySelector("input[type=file]");
        if (input) {
          input.click();
        }
      },
      /**
       * Destroys the app
       */
      destroy: () => {
        exports.fire("destroy", view.element);
        store.dispatch("ABORT_ALL");
        view._destroy();
        window.removeEventListener("resize", resizeHandler);
        document.removeEventListener("visibilitychange", visibilityHandler);
        store.dispatch("DID_DESTROY");
      },
      /**
       * Inserts the plugin before the target element
       */
      insertBefore: (element) => insertBefore(view.element, element),
      /**
       * Inserts the plugin after the target element
       */
      insertAfter: (element) => insertAfter(view.element, element),
      /**
       * Appends the plugin to the target element
       */
      appendTo: (element) => element.appendChild(view.element),
      /**
       * Replaces an element with the app
       */
      replaceElement: (element) => {
        insertBefore(view.element, element);
        element.parentNode.removeChild(element);
        originalElement = element;
      },
      /**
       * Restores the original element
       */
      restoreElement: () => {
        if (!originalElement) {
          return;
        }
        insertAfter(originalElement, view.element);
        view.element.parentNode.removeChild(view.element);
        originalElement = null;
      },
      /**
       * Returns true if the app root is attached to given element
       * @param element
       */
      isAttachedTo: (element) => view.element === element || originalElement === element,
      /**
       * Returns the root element
       */
      element: {
        get: () => view.element
      },
      /**
       * Returns the current pond status
       */
      status: {
        get: () => store.query("GET_STATUS")
      }
    };
    store.dispatch("DID_INIT");
    return createObject(exports);
  };
  var createAppObject = (customOptions = {}) => {
    const defaultOptions2 = {};
    forin(getOptions(), (key, value) => {
      defaultOptions2[key] = value[0];
    });
    const app = createApp({
      // default options
      ...defaultOptions2,
      // custom options
      ...customOptions
    });
    return app;
  };
  var lowerCaseFirstLetter = (string) => string.charAt(0).toLowerCase() + string.slice(1);
  var attributeNameToPropertyName = (attributeName) => toCamels(attributeName.replace(/^data-/, ""));
  var mapObject = (object, propertyMap) => {
    forin(propertyMap, (selector, mapping) => {
      forin(object, (property, value) => {
        const selectorRegExp = new RegExp(selector);
        const matches = selectorRegExp.test(property);
        if (!matches) {
          return;
        }
        delete object[property];
        if (mapping === false) {
          return;
        }
        if (isString(mapping)) {
          object[mapping] = value;
          return;
        }
        const group = mapping.group;
        if (isObject(mapping) && !object[group]) {
          object[group] = {};
        }
        object[group][lowerCaseFirstLetter(property.replace(selectorRegExp, ""))] = value;
      });
      if (mapping.mapping) {
        mapObject(object[mapping.group], mapping.mapping);
      }
    });
  };
  var getAttributesAsObject = (node, attributeMapping = {}) => {
    const attributes = [];
    forin(node.attributes, (index) => {
      attributes.push(node.attributes[index]);
    });
    const output = attributes.filter((attribute) => attribute.name).reduce((obj, attribute) => {
      const value = attr(node, attribute.name);
      obj[attributeNameToPropertyName(attribute.name)] = value === attribute.name ? true : value;
      return obj;
    }, {});
    mapObject(output, attributeMapping);
    return output;
  };
  var createAppAtElement = (element, options = {}) => {
    const attributeMapping = {
      // translate to other name
      "^class$": "className",
      "^multiple$": "allowMultiple",
      "^capture$": "captureMethod",
      "^webkitdirectory$": "allowDirectoriesOnly",
      // group under single property
      "^server": {
        group: "server",
        mapping: {
          "^process": {
            group: "process"
          },
          "^revert": {
            group: "revert"
          },
          "^fetch": {
            group: "fetch"
          },
          "^restore": {
            group: "restore"
          },
          "^load": {
            group: "load"
          }
        }
      },
      // don't include in object
      "^type$": false,
      "^files$": false
    };
    applyFilters("SET_ATTRIBUTE_TO_OPTION_MAP", attributeMapping);
    const mergedOptions = {
      ...options
    };
    const attributeOptions = getAttributesAsObject(
      element.nodeName === "FIELDSET" ? element.querySelector("input[type=file]") : element,
      attributeMapping
    );
    Object.keys(attributeOptions).forEach((key) => {
      if (isObject(attributeOptions[key])) {
        if (!isObject(mergedOptions[key])) {
          mergedOptions[key] = {};
        }
        Object.assign(mergedOptions[key], attributeOptions[key]);
      } else {
        mergedOptions[key] = attributeOptions[key];
      }
    });
    mergedOptions.files = (options.files || []).concat(
      Array.from(element.querySelectorAll("input:not([type=file])")).map((input) => ({
        source: input.value,
        options: {
          type: input.dataset.type
        }
      }))
    );
    const app = createAppObject(mergedOptions);
    if (element.files) {
      Array.from(element.files).forEach((file2) => {
        app.addFile(file2);
      });
    }
    app.replaceElement(element);
    return app;
  };
  var createApp$1 = (...args) => isNode(args[0]) ? createAppAtElement(...args) : createAppObject(...args);
  var PRIVATE_METHODS = ["fire", "_read", "_write"];
  var createAppAPI = (app) => {
    const api = {};
    copyObjectPropertiesToObject(app, api, PRIVATE_METHODS);
    return api;
  };
  var replaceInString = (string, replacements) => string.replace(/(?:{([a-zA-Z]+)})/g, (match, group) => replacements[group]);
  var createWorker = (fn2) => {
    const workerBlob = new Blob(["(", fn2.toString(), ")()"], {
      type: "application/javascript"
    });
    const workerURL = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerURL);
    return {
      transfer: (message, cb) => {
      },
      post: (message, cb, transferList) => {
        const id = getUniqueId();
        worker.onmessage = (e) => {
          if (e.data.id === id) {
            cb(e.data.message);
          }
        };
        worker.postMessage(
          {
            id,
            message
          },
          transferList
        );
      },
      terminate: () => {
        worker.terminate();
        URL.revokeObjectURL(workerURL);
      }
    };
  };
  var loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
  var renameFile = (file2, name2) => {
    const renamedFile = file2.slice(0, file2.size, file2.type);
    renamedFile.lastModifiedDate = file2.lastModifiedDate;
    renamedFile.name = name2;
    return renamedFile;
  };
  var copyFile = (file2) => renameFile(file2, file2.name);
  var registeredPlugins = [];
  var createAppPlugin = (plugin11) => {
    if (registeredPlugins.includes(plugin11)) {
      return;
    }
    registeredPlugins.push(plugin11);
    const pluginOutline = plugin11({
      addFilter,
      utils: {
        Type,
        forin,
        isString,
        isFile,
        toNaturalFileSize,
        replaceInString,
        getExtensionFromFilename,
        getFilenameWithoutExtension,
        guesstimateMimeType,
        getFileFromBlob,
        getFilenameFromURL,
        createRoute,
        createWorker,
        createView,
        createItemAPI,
        loadImage,
        copyFile,
        renameFile,
        createBlob,
        applyFilterChain,
        text,
        getNumericAspectRatioFromString
      },
      views: {
        fileActionButton
      }
    });
    extendDefaultOptions(pluginOutline.options);
  };
  var isOperaMini = () => Object.prototype.toString.call(window.operamini) === "[object OperaMini]";
  var hasPromises = () => "Promise" in window;
  var hasBlobSlice = () => "slice" in Blob.prototype;
  var hasCreateObjectURL = () => "URL" in window && "createObjectURL" in window.URL;
  var hasVisibility = () => "visibilityState" in document;
  var hasTiming = () => "performance" in window;
  var hasCSSSupports = () => "supports" in (window.CSS || {});
  var isIE11 = () => /MSIE|Trident/.test(window.navigator.userAgent);
  var supported = (() => {
    const isSupported = (
      // Has to be a browser
      isBrowser() && // Can't run on Opera Mini due to lack of everything
      !isOperaMini() && // Require these APIs to feature detect a modern browser
      hasVisibility() && hasPromises() && hasBlobSlice() && hasCreateObjectURL() && hasTiming() && // doesn't need CSSSupports but is a good way to detect Safari 9+ (we do want to support IE11 though)
      (hasCSSSupports() || isIE11())
    );
    return () => isSupported;
  })();
  var state = {
    // active app instances, used to redraw the apps and to find the later
    apps: []
  };
  var name = "filepond";
  var fn = () => {
  };
  var Status$1 = {};
  var FileStatus = {};
  var FileOrigin$1 = {};
  var OptionTypes = {};
  var create$f = fn;
  var destroy = fn;
  var parse = fn;
  var find = fn;
  var registerPlugin = fn;
  var getOptions$1 = fn;
  var setOptions$1 = fn;
  if (supported()) {
    createPainter(
      () => {
        state.apps.forEach((app) => app._read());
      },
      (ts) => {
        state.apps.forEach((app) => app._write(ts));
      }
    );
    const dispatch = () => {
      document.dispatchEvent(
        new CustomEvent("FilePond:loaded", {
          detail: {
            supported,
            create: create$f,
            destroy,
            parse,
            find,
            registerPlugin,
            setOptions: setOptions$1
          }
        })
      );
      document.removeEventListener("DOMContentLoaded", dispatch);
    };
    if (document.readyState !== "loading") {
      setTimeout(() => dispatch(), 0);
    } else {
      document.addEventListener("DOMContentLoaded", dispatch);
    }
    const updateOptionTypes = () => forin(getOptions(), (key, value) => {
      OptionTypes[key] = value[1];
    });
    Status$1 = { ...Status };
    FileOrigin$1 = { ...FileOrigin };
    FileStatus = { ...ItemStatus };
    OptionTypes = {};
    updateOptionTypes();
    create$f = (...args) => {
      const app = createApp$1(...args);
      app.on("destroy", destroy);
      state.apps.push(app);
      return createAppAPI(app);
    };
    destroy = (hook) => {
      const indexToRemove = state.apps.findIndex((app) => app.isAttachedTo(hook));
      if (indexToRemove >= 0) {
        const app = state.apps.splice(indexToRemove, 1)[0];
        app.restoreElement();
        return true;
      }
      return false;
    };
    parse = (context) => {
      const matchedHooks = Array.from(context.querySelectorAll(`.${name}`));
      const newHooks = matchedHooks.filter(
        (newHook) => !state.apps.find((app) => app.isAttachedTo(newHook))
      );
      return newHooks.map((hook) => create$f(hook));
    };
    find = (hook) => {
      const app = state.apps.find((app2) => app2.isAttachedTo(hook));
      if (!app) {
        return null;
      }
      return createAppAPI(app);
    };
    registerPlugin = (...plugins) => {
      plugins.forEach(createAppPlugin);
      updateOptionTypes();
    };
    getOptions$1 = () => {
      const opts = {};
      forin(getOptions(), (key, value) => {
        opts[key] = value[0];
      });
      return opts;
    };
    setOptions$1 = (opts) => {
      if (isObject(opts)) {
        state.apps.forEach((app) => {
          app.setOptions(opts);
        });
        setOptions(opts);
      }
      return getOptions$1();
    };
  }

  // node_modules/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js
  var plugin = ({ addFilter: addFilter2, utils }) => {
    const {
      Type: Type2,
      isString: isString2,
      replaceInString: replaceInString2,
      guesstimateMimeType: guesstimateMimeType2,
      getExtensionFromFilename: getExtensionFromFilename2,
      getFilenameFromURL: getFilenameFromURL2
    } = utils;
    const mimeTypeMatchesWildCard = (mimeType, wildcard) => {
      const mimeTypeGroup = (/^[^/]+/.exec(mimeType) || []).pop();
      const wildcardGroup = wildcard.slice(0, -2);
      return mimeTypeGroup === wildcardGroup;
    };
    const isValidMimeType = (acceptedTypes, userInputType) => acceptedTypes.some((acceptedType) => {
      if (/\*$/.test(acceptedType)) {
        return mimeTypeMatchesWildCard(userInputType, acceptedType);
      }
      return acceptedType === userInputType;
    });
    const getItemType = (item2) => {
      let type = "";
      if (isString2(item2)) {
        const filename = getFilenameFromURL2(item2);
        const extension = getExtensionFromFilename2(filename);
        if (extension) {
          type = guesstimateMimeType2(extension);
        }
      } else {
        type = item2.type;
      }
      return type;
    };
    const validateFile = (item2, acceptedFileTypes, typeDetector) => {
      if (acceptedFileTypes.length === 0) {
        return true;
      }
      const type = getItemType(item2);
      if (!typeDetector) {
        return isValidMimeType(acceptedFileTypes, type);
      }
      return new Promise((resolve, reject) => {
        typeDetector(item2, type).then((detectedType) => {
          if (isValidMimeType(acceptedFileTypes, detectedType)) {
            resolve();
          } else {
            reject();
          }
        }).catch(reject);
      });
    };
    const applyMimeTypeMap = (map2) => (acceptedFileType) => map2[acceptedFileType] === null ? false : map2[acceptedFileType] || acceptedFileType;
    addFilter2(
      "SET_ATTRIBUTE_TO_OPTION_MAP",
      (map2) => Object.assign(map2, {
        accept: "acceptedFileTypes"
      })
    );
    addFilter2("ALLOW_HOPPER_ITEM", (file2, { query }) => {
      if (!query("GET_ALLOW_FILE_TYPE_VALIDATION")) {
        return true;
      }
      return validateFile(file2, query("GET_ACCEPTED_FILE_TYPES"));
    });
    addFilter2(
      "LOAD_FILE",
      (file2, { query }) => new Promise((resolve, reject) => {
        if (!query("GET_ALLOW_FILE_TYPE_VALIDATION")) {
          resolve(file2);
          return;
        }
        const acceptedFileTypes = query("GET_ACCEPTED_FILE_TYPES");
        const typeDetector = query("GET_FILE_VALIDATE_TYPE_DETECT_TYPE");
        const validationResult = validateFile(file2, acceptedFileTypes, typeDetector);
        const handleRejection = () => {
          const acceptedFileTypesMapped = acceptedFileTypes.map(
            applyMimeTypeMap(
              query("GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES_MAP")
            )
          ).filter((label) => label !== false);
          const acceptedFileTypesMappedUnique = acceptedFileTypesMapped.filter(
            (item2, index) => acceptedFileTypesMapped.indexOf(item2) === index
          );
          reject({
            status: {
              main: query("GET_LABEL_FILE_TYPE_NOT_ALLOWED"),
              sub: replaceInString2(
                query("GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES"),
                {
                  allTypes: acceptedFileTypesMappedUnique.join(", "),
                  allButLastType: acceptedFileTypesMappedUnique.slice(0, -1).join(", "),
                  lastType: acceptedFileTypesMappedUnique[acceptedFileTypesMappedUnique.length - 1]
                }
              )
            }
          });
        };
        if (typeof validationResult === "boolean") {
          if (!validationResult) {
            return handleRejection();
          }
          return resolve(file2);
        }
        validationResult.then(() => {
          resolve(file2);
        }).catch(handleRejection);
      })
    );
    return {
      // default options
      options: {
        // Enable or disable file type validation
        allowFileTypeValidation: [true, Type2.BOOLEAN],
        // What file types to accept
        acceptedFileTypes: [[], Type2.ARRAY],
        // - must be comma separated
        // - mime types: image/png, image/jpeg, image/gif
        // - extensions: .png, .jpg, .jpeg ( not enabled yet )
        // - wildcards: image/*
        // label to show when a type is not allowed
        labelFileTypeNotAllowed: ["File is of invalid type", Type2.STRING],
        // nicer label
        fileValidateTypeLabelExpectedTypes: [
          "Expects {allButLastType} or {lastType}",
          Type2.STRING
        ],
        // map mime types to extensions
        fileValidateTypeLabelExpectedTypesMap: [{}, Type2.OBJECT],
        // Custom function to detect type of file
        fileValidateTypeDetectType: [null, Type2.FUNCTION]
      }
    };
  };
  var isBrowser2 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser2) {
    document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: plugin }));
  }
  var filepond_plugin_file_validate_type_esm_default = plugin;

  // node_modules/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.esm.js
  var plugin2 = ({ addFilter: addFilter2, utils }) => {
    const { Type: Type2, replaceInString: replaceInString2, toNaturalFileSize: toNaturalFileSize2 } = utils;
    addFilter2("ALLOW_HOPPER_ITEM", (file2, { query }) => {
      if (!query("GET_ALLOW_FILE_SIZE_VALIDATION")) {
        return true;
      }
      const sizeMax = query("GET_MAX_FILE_SIZE");
      if (sizeMax !== null && file2.size > sizeMax) {
        return false;
      }
      const sizeMin = query("GET_MIN_FILE_SIZE");
      if (sizeMin !== null && file2.size < sizeMin) {
        return false;
      }
      return true;
    });
    addFilter2(
      "LOAD_FILE",
      (file2, { query }) => new Promise((resolve, reject) => {
        if (!query("GET_ALLOW_FILE_SIZE_VALIDATION")) {
          return resolve(file2);
        }
        const fileFilter = query("GET_FILE_VALIDATE_SIZE_FILTER");
        if (fileFilter && !fileFilter(file2)) {
          return resolve(file2);
        }
        const sizeMax = query("GET_MAX_FILE_SIZE");
        if (sizeMax !== null && file2.size > sizeMax) {
          reject({
            status: {
              main: query("GET_LABEL_MAX_FILE_SIZE_EXCEEDED"),
              sub: replaceInString2(query("GET_LABEL_MAX_FILE_SIZE"), {
                filesize: toNaturalFileSize2(
                  sizeMax,
                  ".",
                  query("GET_FILE_SIZE_BASE"),
                  query("GET_FILE_SIZE_LABELS", query)
                )
              })
            }
          });
          return;
        }
        const sizeMin = query("GET_MIN_FILE_SIZE");
        if (sizeMin !== null && file2.size < sizeMin) {
          reject({
            status: {
              main: query("GET_LABEL_MIN_FILE_SIZE_EXCEEDED"),
              sub: replaceInString2(query("GET_LABEL_MIN_FILE_SIZE"), {
                filesize: toNaturalFileSize2(
                  sizeMin,
                  ".",
                  query("GET_FILE_SIZE_BASE"),
                  query("GET_FILE_SIZE_LABELS", query)
                )
              })
            }
          });
          return;
        }
        const totalSizeMax = query("GET_MAX_TOTAL_FILE_SIZE");
        if (totalSizeMax !== null) {
          const currentTotalSize = query("GET_ACTIVE_ITEMS").reduce((total, item2) => {
            return total + item2.fileSize;
          }, 0);
          if (currentTotalSize > totalSizeMax) {
            reject({
              status: {
                main: query("GET_LABEL_MAX_TOTAL_FILE_SIZE_EXCEEDED"),
                sub: replaceInString2(query("GET_LABEL_MAX_TOTAL_FILE_SIZE"), {
                  filesize: toNaturalFileSize2(
                    totalSizeMax,
                    ".",
                    query("GET_FILE_SIZE_BASE"),
                    query("GET_FILE_SIZE_LABELS", query)
                  )
                })
              }
            });
            return;
          }
        }
        resolve(file2);
      })
    );
    return {
      options: {
        // Enable or disable file type validation
        allowFileSizeValidation: [true, Type2.BOOLEAN],
        // Max individual file size in bytes
        maxFileSize: [null, Type2.INT],
        // Min individual file size in bytes
        minFileSize: [null, Type2.INT],
        // Max total file size in bytes
        maxTotalFileSize: [null, Type2.INT],
        // Filter the files that need to be validated for size
        fileValidateSizeFilter: [null, Type2.FUNCTION],
        // error labels
        labelMinFileSizeExceeded: ["File is too small", Type2.STRING],
        labelMinFileSize: ["Minimum file size is {filesize}", Type2.STRING],
        labelMaxFileSizeExceeded: ["File is too large", Type2.STRING],
        labelMaxFileSize: ["Maximum file size is {filesize}", Type2.STRING],
        labelMaxTotalFileSizeExceeded: ["Maximum total size exceeded", Type2.STRING],
        labelMaxTotalFileSize: ["Maximum total file size is {filesize}", Type2.STRING]
      }
    };
  };
  var isBrowser3 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser3) {
    document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: plugin2 }));
  }
  var filepond_plugin_file_validate_size_esm_default = plugin2;

  // node_modules/filepond-plugin-file-poster/dist/filepond-plugin-file-poster.esm.js
  var IMAGE_SCALE_SPRING_PROPS = {
    type: "spring",
    stiffness: 0.5,
    damping: 0.45,
    mass: 10
  };
  var createPosterView = (_) => _.utils.createView({
    name: "file-poster",
    tag: "div",
    ignoreRect: true,
    create: ({ root: root2 }) => {
      root2.ref.image = document.createElement("img");
      root2.element.appendChild(root2.ref.image);
    },
    write: _.utils.createRoute({
      DID_FILE_POSTER_LOAD: ({ root: root2, props }) => {
        const { id } = props;
        const item2 = root2.query("GET_ITEM", { id: props.id });
        if (!item2) return;
        const poster = item2.getMetadata("poster");
        root2.ref.image.src = poster;
        root2.dispatch("DID_FILE_POSTER_DRAW", { id });
      }
    }),
    mixins: {
      styles: ["scaleX", "scaleY", "opacity"],
      animations: {
        scaleX: IMAGE_SCALE_SPRING_PROPS,
        scaleY: IMAGE_SCALE_SPRING_PROPS,
        opacity: { type: "tween", duration: 750 }
      }
    }
  });
  var applyTemplate = (source, target) => {
    target.width = source.width;
    target.height = source.height;
    const ctx = target.getContext("2d");
    ctx.drawImage(source, 0, 0);
  };
  var createPosterOverlayView = (fpAPI) => fpAPI.utils.createView({
    name: "file-poster-overlay",
    tag: "canvas",
    ignoreRect: true,
    create: ({ root: root2, props }) => {
      applyTemplate(props.template, root2.element);
    },
    mixins: {
      styles: ["opacity"],
      animations: {
        opacity: { type: "spring", mass: 25 }
      }
    }
  });
  var getImageSize = (url, cb) => {
    let image = new Image();
    image.onload = () => {
      const width2 = image.naturalWidth;
      const height2 = image.naturalHeight;
      image = null;
      cb(width2, height2);
    };
    image.src = url;
  };
  var easeInOutSine = (t) => -0.5 * (Math.cos(Math.PI * t) - 1);
  var addGradientSteps = (gradient, color, alpha = 1, easeFn = easeInOutSine, steps = 10, offset = 0) => {
    const range = 1 - offset;
    const rgb = color.join(",");
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const stop = offset + range * p;
      gradient.addColorStop(stop, `rgba(${rgb}, ${easeFn(p) * alpha})`);
    }
  };
  var MAX_WIDTH = 10;
  var MAX_HEIGHT = 10;
  var calculateAverageColor = (image) => {
    const scalar = Math.min(MAX_WIDTH / image.width, MAX_HEIGHT / image.height);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width2 = canvas.width = Math.ceil(image.width * scalar);
    const height2 = canvas.height = Math.ceil(image.height * scalar);
    ctx.drawImage(image, 0, 0, width2, height2);
    let data3 = null;
    try {
      data3 = ctx.getImageData(0, 0, width2, height2).data;
    } catch (e) {
      return null;
    }
    const l = data3.length;
    let r = 0;
    let g = 0;
    let b = 0;
    let i = 0;
    for (; i < l; i += 4) {
      r += data3[i] * data3[i];
      g += data3[i + 1] * data3[i + 1];
      b += data3[i + 2] * data3[i + 2];
    }
    r = averageColor(r, l);
    g = averageColor(g, l);
    b = averageColor(b, l);
    return { r, g, b };
  };
  var averageColor = (c, l) => Math.floor(Math.sqrt(c / (l / 4)));
  var drawTemplate = (canvas, width2, height2, color, alphaTarget) => {
    canvas.width = width2;
    canvas.height = height2;
    const ctx = canvas.getContext("2d");
    const horizontalCenter = width2 * 0.5;
    const grad = ctx.createRadialGradient(
      horizontalCenter,
      height2 + 110,
      height2 - 100,
      horizontalCenter,
      height2 + 110,
      height2 + 100
    );
    addGradientSteps(grad, color, alphaTarget, void 0, 8, 0.4);
    ctx.save();
    ctx.translate(-width2 * 0.5, 0);
    ctx.scale(2, 1);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width2, height2);
    ctx.restore();
  };
  var hasNavigator = typeof navigator !== "undefined";
  var width = 500;
  var height = 200;
  var overlayTemplateShadow = hasNavigator && document.createElement("canvas");
  var overlayTemplateError = hasNavigator && document.createElement("canvas");
  var overlayTemplateSuccess = hasNavigator && document.createElement("canvas");
  var itemShadowColor = [40, 40, 40];
  var itemErrorColor = [196, 78, 71];
  var itemSuccessColor = [54, 151, 99];
  if (hasNavigator) {
    drawTemplate(overlayTemplateShadow, width, height, itemShadowColor, 0.85);
    drawTemplate(overlayTemplateError, width, height, itemErrorColor, 1);
    drawTemplate(overlayTemplateSuccess, width, height, itemSuccessColor, 1);
  }
  var loadImage2 = (url, crossOriginValue) => new Promise((resolve, reject) => {
    const img = new Image();
    if (typeof crossOrigin === "string") {
      img.crossOrigin = crossOriginValue;
    }
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
  var createPosterWrapperView = (_) => {
    const overlay = createPosterOverlayView(_);
    const didCreatePreviewContainer = ({ root: root2, props }) => {
      const { id } = props;
      const item2 = root2.query("GET_ITEM", id);
      if (!item2) return;
      const fileURL = item2.getMetadata("poster");
      const previewImageLoaded = (data3) => {
        const averageColor3 = root2.query(
          "GET_FILE_POSTER_CALCULATE_AVERAGE_IMAGE_COLOR"
        ) ? calculateAverageColor(data3) : null;
        item2.setMetadata("color", averageColor3, true);
        root2.dispatch("DID_FILE_POSTER_LOAD", {
          id,
          data: data3
        });
      };
      getImageSize(fileURL, (width2, height2) => {
        root2.dispatch("DID_FILE_POSTER_CALCULATE_SIZE", {
          id,
          width: width2,
          height: height2
        });
        loadImage2(
          fileURL,
          root2.query("GET_FILE_POSTER_CROSS_ORIGIN_ATTRIBUTE_VALUE")
        ).then(previewImageLoaded);
      });
    };
    const didLoadPreview = ({ root: root2 }) => {
      root2.ref.overlayShadow.opacity = 1;
    };
    const didDrawPreview = ({ root: root2 }) => {
      const { image } = root2.ref;
      image.scaleX = 1;
      image.scaleY = 1;
      image.opacity = 1;
    };
    const restoreOverlay = ({ root: root2 }) => {
      root2.ref.overlayShadow.opacity = 1;
      root2.ref.overlayError.opacity = 0;
      root2.ref.overlaySuccess.opacity = 0;
    };
    const didThrowError = ({ root: root2 }) => {
      root2.ref.overlayShadow.opacity = 0.25;
      root2.ref.overlayError.opacity = 1;
    };
    const didCompleteProcessing = ({ root: root2 }) => {
      root2.ref.overlayShadow.opacity = 0.25;
      root2.ref.overlaySuccess.opacity = 1;
    };
    const create2 = ({ root: root2, props }) => {
      const itemShadowColorProp = root2.query(
        "GET_FILE_POSTER_ITEM_OVERLAY_SHADOW_COLOR"
      );
      const itemErrorColorProp = root2.query(
        "GET_FILE_POSTER_ITEM_OVERLAY_ERROR_COLOR"
      );
      const itemSuccessColorProp = root2.query(
        "GET_FILE_POSTER_ITEM_OVERLAY_SUCCESS_COLOR"
      );
      if (itemShadowColorProp && itemShadowColorProp !== itemShadowColor) {
        itemShadowColor = itemShadowColorProp;
        drawTemplate(overlayTemplateShadow, width, height, itemShadowColor, 0.85);
      }
      if (itemErrorColorProp && itemErrorColorProp !== itemErrorColor) {
        itemErrorColor = itemErrorColorProp;
        drawTemplate(overlayTemplateError, width, height, itemErrorColor, 1);
      }
      if (itemSuccessColorProp && itemSuccessColorProp !== itemSuccessColor) {
        itemSuccessColor = itemSuccessColorProp;
        drawTemplate(overlayTemplateSuccess, width, height, itemSuccessColor, 1);
      }
      const image = createPosterView(_);
      root2.ref.image = root2.appendChildView(
        root2.createChildView(image, {
          id: props.id,
          scaleX: 1.25,
          scaleY: 1.25,
          opacity: 0
        })
      );
      root2.ref.overlayShadow = root2.appendChildView(
        root2.createChildView(overlay, {
          template: overlayTemplateShadow,
          opacity: 0
        })
      );
      root2.ref.overlaySuccess = root2.appendChildView(
        root2.createChildView(overlay, {
          template: overlayTemplateSuccess,
          opacity: 0
        })
      );
      root2.ref.overlayError = root2.appendChildView(
        root2.createChildView(overlay, {
          template: overlayTemplateError,
          opacity: 0
        })
      );
    };
    return _.utils.createView({
      name: "file-poster-wrapper",
      create: create2,
      write: _.utils.createRoute({
        // image preview stated
        DID_FILE_POSTER_LOAD: didLoadPreview,
        DID_FILE_POSTER_DRAW: didDrawPreview,
        DID_FILE_POSTER_CONTAINER_CREATE: didCreatePreviewContainer,
        // file states
        DID_THROW_ITEM_LOAD_ERROR: didThrowError,
        DID_THROW_ITEM_PROCESSING_ERROR: didThrowError,
        DID_THROW_ITEM_INVALID: didThrowError,
        DID_COMPLETE_ITEM_PROCESSING: didCompleteProcessing,
        DID_START_ITEM_PROCESSING: restoreOverlay,
        DID_REVERT_ITEM_PROCESSING: restoreOverlay
      })
    });
  };
  var plugin3 = (fpAPI) => {
    const { addFilter: addFilter2, utils } = fpAPI;
    const { Type: Type2, createRoute: createRoute2 } = utils;
    const filePosterView = createPosterWrapperView(fpAPI);
    addFilter2("CREATE_VIEW", (viewAPI) => {
      const { is, view, query } = viewAPI;
      if (!is("file") || !query("GET_ALLOW_FILE_POSTER")) return;
      const didLoadItem2 = ({ root: root2, props }) => {
        updateItemPoster(root2, props);
      };
      const didUpdateItemMetadata = ({ root: root2, props, action }) => {
        if (!/poster/.test(action.change.key)) return;
        updateItemPoster(root2, props);
      };
      const updateItemPoster = (root2, props) => {
        const { id } = props;
        const item2 = query("GET_ITEM", id);
        if (!item2 || !item2.getMetadata("poster") || item2.archived) return;
        if (root2.ref.previousPoster === item2.getMetadata("poster")) return;
        root2.ref.previousPoster = item2.getMetadata("poster");
        if (!query("GET_FILE_POSTER_FILTER_ITEM")(item2)) return;
        if (root2.ref.filePoster) {
          view.removeChildView(root2.ref.filePoster);
        }
        root2.ref.filePoster = view.appendChildView(
          view.createChildView(filePosterView, { id })
        );
        root2.dispatch("DID_FILE_POSTER_CONTAINER_CREATE", { id });
      };
      const didCalculatePreviewSize = ({ root: root2, action }) => {
        if (!root2.ref.filePoster) return;
        root2.ref.imageWidth = action.width;
        root2.ref.imageHeight = action.height;
        root2.ref.shouldUpdatePanelHeight = true;
        root2.dispatch("KICK");
      };
      const getPosterHeight = ({ root: root2 }) => {
        let fixedPosterHeight = root2.query("GET_FILE_POSTER_HEIGHT");
        if (fixedPosterHeight) {
          return fixedPosterHeight;
        }
        const minPosterHeight = root2.query("GET_FILE_POSTER_MIN_HEIGHT");
        const maxPosterHeight = root2.query("GET_FILE_POSTER_MAX_HEIGHT");
        if (minPosterHeight && root2.ref.imageHeight < minPosterHeight) {
          return minPosterHeight;
        }
        let height2 = root2.rect.element.width * (root2.ref.imageHeight / root2.ref.imageWidth);
        if (minPosterHeight && height2 < minPosterHeight) {
          return minPosterHeight;
        }
        if (maxPosterHeight && height2 > maxPosterHeight) {
          return maxPosterHeight;
        }
        return height2;
      };
      view.registerWriter(
        createRoute2(
          {
            DID_LOAD_ITEM: didLoadItem2,
            DID_FILE_POSTER_CALCULATE_SIZE: didCalculatePreviewSize,
            DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata
          },
          ({ root: root2, props }) => {
            if (!root2.ref.filePoster) return;
            if (root2.rect.element.hidden) return;
            if (root2.ref.shouldUpdatePanelHeight) {
              root2.dispatch("DID_UPDATE_PANEL_HEIGHT", {
                id: props.id,
                height: getPosterHeight({ root: root2 })
              });
              root2.ref.shouldUpdatePanelHeight = false;
            }
          }
        )
      );
    });
    return {
      options: {
        // Enable or disable file poster
        allowFilePoster: [true, Type2.BOOLEAN],
        // Fixed preview height
        filePosterHeight: [null, Type2.INT],
        // Min image height
        filePosterMinHeight: [null, Type2.INT],
        // Max image height
        filePosterMaxHeight: [null, Type2.INT],
        // filters file items to determine which are shown as poster
        filePosterFilterItem: [() => true, Type2.FUNCTION],
        // Enables or disables reading average image color
        filePosterCalculateAverageImageColor: [false, Type2.BOOLEAN],
        // Allows setting the value of the CORS attribute (null is don't set attribute)
        filePosterCrossOriginAttributeValue: ["Anonymous", Type2.STRING],
        // Colors used for item overlay gradient
        filePosterItemOverlayShadowColor: [null, Type2.ARRAY],
        filePosterItemOverlayErrorColor: [null, Type2.ARRAY],
        filePosterItemOverlaySuccessColor: [null, Type2.ARRAY]
      }
    };
  };
  var isBrowser4 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser4) {
    document.dispatchEvent(
      new CustomEvent("FilePond:pluginloaded", { detail: plugin3 })
    );
  }
  var filepond_plugin_file_poster_esm_default = plugin3;

  // node_modules/filepond-plugin-file-metadata/dist/filepond-plugin-file-metadata.esm.js
  var plugin4 = ({ addFilter: addFilter2, utils }) => {
    const { Type: Type2 } = utils;
    addFilter2(
      "SET_ATTRIBUTE_TO_OPTION_MAP",
      (map2) => Object.assign(map2, {
        "^fileMetadata": {
          group: "fileMetadataObject"
        }
      })
    );
    addFilter2(
      "DID_LOAD_ITEM",
      (item2, { query }) => new Promise((resolve) => {
        if (!query("GET_ALLOW_FILE_METADATA")) {
          return resolve(item2);
        }
        const data3 = query("GET_FILE_METADATA_OBJECT");
        if (typeof data3 === "object" && data3 !== null) {
          Object.keys(data3).forEach((key) => {
            item2.setMetadata(key, data3[key], true);
          });
        }
        resolve(item2);
      })
    );
    return {
      options: {
        // Enable or disable file renaming
        allowFileMetadata: [true, Type2.BOOLEAN],
        // A metadata object to add to all files
        fileMetadataObject: [null, Type2.OBJECT]
      }
    };
  };
  var isBrowser5 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser5) {
    document.dispatchEvent(
      new CustomEvent("FilePond:pluginloaded", { detail: plugin4 })
    );
  }
  var filepond_plugin_file_metadata_esm_default = plugin4;

  // node_modules/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.esm.js
  var isJPEG = (file2) => /^image\/jpeg/.test(file2.type);
  var Marker = {
    JPEG: 65496,
    APP1: 65505,
    EXIF: 1165519206,
    TIFF: 18761,
    Orientation: 274,
    Unknown: 65280
  };
  var getUint16 = (view, offset, little = false) => view.getUint16(offset, little);
  var getUint32 = (view, offset, little = false) => view.getUint32(offset, little);
  var getImageOrientation = (file2) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const view = new DataView(e.target.result);
      if (getUint16(view, 0) !== Marker.JPEG) {
        resolve(-1);
        return;
      }
      const length = view.byteLength;
      let offset = 2;
      while (offset < length) {
        const marker = getUint16(view, offset);
        offset += 2;
        if (marker === Marker.APP1) {
          if (getUint32(view, offset += 2) !== Marker.EXIF) {
            break;
          }
          const little = getUint16(view, offset += 6) === Marker.TIFF;
          offset += getUint32(view, offset + 4, little);
          const tags = getUint16(view, offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (getUint16(view, offset + i * 12, little) === Marker.Orientation) {
              resolve(getUint16(view, offset + i * 12 + 8, little));
              return;
            }
          }
        } else if ((marker & Marker.Unknown) !== Marker.Unknown) {
          break;
        } else {
          offset += getUint16(view, offset);
        }
      }
      resolve(-1);
    };
    reader.readAsArrayBuffer(file2.slice(0, 64 * 1024));
  });
  var IS_BROWSER2 = (() => typeof window !== "undefined" && typeof window.document !== "undefined")();
  var isBrowser6 = () => IS_BROWSER2;
  var testSrc = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QA6RXhpZgAATU0AKgAAAAgAAwESAAMAAAABAAYAAAEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAIBASIA/8QAJgABAAAAAAAAAAAAAAAAAAAAAxABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwBH/9k=";
  var shouldCorrect = void 0;
  var testImage = isBrowser6() ? new Image() : {};
  testImage.onload = () => shouldCorrect = testImage.naturalWidth > testImage.naturalHeight;
  testImage.src = testSrc;
  var shouldCorrectImageExifOrientation = () => shouldCorrect;
  var plugin5 = ({ addFilter: addFilter2, utils }) => {
    const { Type: Type2, isFile: isFile2 } = utils;
    addFilter2(
      "DID_LOAD_ITEM",
      (item2, { query }) => new Promise((resolve, reject) => {
        const file2 = item2.file;
        if (!isFile2(file2) || !isJPEG(file2) || !query("GET_ALLOW_IMAGE_EXIF_ORIENTATION") || !shouldCorrectImageExifOrientation()) {
          return resolve(item2);
        }
        getImageOrientation(file2).then((orientation) => {
          item2.setMetadata("exif", { orientation });
          resolve(item2);
        });
      })
    );
    return {
      options: {
        // Enable or disable image orientation reading
        allowImageExifOrientation: [true, Type2.BOOLEAN]
      }
    };
  };
  var isBrowser$1 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser$1) {
    document.dispatchEvent(
      new CustomEvent("FilePond:pluginloaded", { detail: plugin5 })
    );
  }
  var filepond_plugin_image_exif_orientation_esm_default = plugin5;

  // node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js
  var isPreviewableImage = (file2) => /^image/.test(file2.type);
  var vectorMultiply = (v, amount) => createVector(v.x * amount, v.y * amount);
  var vectorAdd = (a, b) => createVector(a.x + b.x, a.y + b.y);
  var vectorNormalize = (v) => {
    const l = Math.sqrt(v.x * v.x + v.y * v.y);
    if (l === 0) {
      return {
        x: 0,
        y: 0
      };
    }
    return createVector(v.x / l, v.y / l);
  };
  var vectorRotate = (v, radians, origin) => {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const t = createVector(v.x - origin.x, v.y - origin.y);
    return createVector(
      origin.x + cos * t.x - sin * t.y,
      origin.y + sin * t.x + cos * t.y
    );
  };
  var createVector = (x = 0, y = 0) => ({ x, y });
  var getMarkupValue = (value, size, scalar = 1, axis) => {
    if (typeof value === "string") {
      return parseFloat(value) * scalar;
    }
    if (typeof value === "number") {
      return value * (axis ? size[axis] : Math.min(size.width, size.height));
    }
    return;
  };
  var getMarkupStyles = (markup, size, scale) => {
    const lineStyle = markup.borderStyle || markup.lineStyle || "solid";
    const fill = markup.backgroundColor || markup.fontColor || "transparent";
    const stroke = markup.borderColor || markup.lineColor || "transparent";
    const strokeWidth = getMarkupValue(
      markup.borderWidth || markup.lineWidth,
      size,
      scale
    );
    const lineCap = markup.lineCap || "round";
    const lineJoin = markup.lineJoin || "round";
    const dashes = typeof lineStyle === "string" ? "" : lineStyle.map((v) => getMarkupValue(v, size, scale)).join(",");
    const opacity = markup.opacity || 1;
    return {
      "stroke-linecap": lineCap,
      "stroke-linejoin": lineJoin,
      "stroke-width": strokeWidth || 0,
      "stroke-dasharray": dashes,
      stroke,
      fill,
      opacity
    };
  };
  var isDefined2 = (value) => value != null;
  var getMarkupRect = (rect, size, scalar = 1) => {
    let left = getMarkupValue(rect.x, size, scalar, "width") || getMarkupValue(rect.left, size, scalar, "width");
    let top = getMarkupValue(rect.y, size, scalar, "height") || getMarkupValue(rect.top, size, scalar, "height");
    let width2 = getMarkupValue(rect.width, size, scalar, "width");
    let height2 = getMarkupValue(rect.height, size, scalar, "height");
    let right = getMarkupValue(rect.right, size, scalar, "width");
    let bottom = getMarkupValue(rect.bottom, size, scalar, "height");
    if (!isDefined2(top)) {
      if (isDefined2(height2) && isDefined2(bottom)) {
        top = size.height - height2 - bottom;
      } else {
        top = bottom;
      }
    }
    if (!isDefined2(left)) {
      if (isDefined2(width2) && isDefined2(right)) {
        left = size.width - width2 - right;
      } else {
        left = right;
      }
    }
    if (!isDefined2(width2)) {
      if (isDefined2(left) && isDefined2(right)) {
        width2 = size.width - left - right;
      } else {
        width2 = 0;
      }
    }
    if (!isDefined2(height2)) {
      if (isDefined2(top) && isDefined2(bottom)) {
        height2 = size.height - top - bottom;
      } else {
        height2 = 0;
      }
    }
    return {
      x: left || 0,
      y: top || 0,
      width: width2 || 0,
      height: height2 || 0
    };
  };
  var pointsToPathShape = (points) => points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  var setAttributes = (element, attr2) => Object.keys(attr2).forEach((key) => element.setAttribute(key, attr2[key]));
  var ns2 = "http://www.w3.org/2000/svg";
  var svg = (tag, attr2) => {
    const element = document.createElementNS(ns2, tag);
    if (attr2) {
      setAttributes(element, attr2);
    }
    return element;
  };
  var updateRect2 = (element) => setAttributes(element, {
    ...element.rect,
    ...element.styles
  });
  var updateEllipse = (element) => {
    const cx = element.rect.x + element.rect.width * 0.5;
    const cy = element.rect.y + element.rect.height * 0.5;
    const rx = element.rect.width * 0.5;
    const ry = element.rect.height * 0.5;
    return setAttributes(element, {
      cx,
      cy,
      rx,
      ry,
      ...element.styles
    });
  };
  var IMAGE_FIT_STYLE = {
    contain: "xMidYMid meet",
    cover: "xMidYMid slice"
  };
  var updateImage = (element, markup) => {
    setAttributes(element, {
      ...element.rect,
      ...element.styles,
      preserveAspectRatio: IMAGE_FIT_STYLE[markup.fit] || "none"
    });
  };
  var TEXT_ANCHOR = {
    left: "start",
    center: "middle",
    right: "end"
  };
  var updateText = (element, markup, size, scale) => {
    const fontSize = getMarkupValue(markup.fontSize, size, scale);
    const fontFamily = markup.fontFamily || "sans-serif";
    const fontWeight = markup.fontWeight || "normal";
    const textAlign = TEXT_ANCHOR[markup.textAlign] || "start";
    setAttributes(element, {
      ...element.rect,
      ...element.styles,
      "stroke-width": 0,
      "font-weight": fontWeight,
      "font-size": fontSize,
      "font-family": fontFamily,
      "text-anchor": textAlign
    });
    if (element.text !== markup.text) {
      element.text = markup.text;
      element.textContent = markup.text.length ? markup.text : " ";
    }
  };
  var updateLine = (element, markup, size, scale) => {
    setAttributes(element, {
      ...element.rect,
      ...element.styles,
      fill: "none"
    });
    const line = element.childNodes[0];
    const begin = element.childNodes[1];
    const end = element.childNodes[2];
    const origin = element.rect;
    const target = {
      x: element.rect.x + element.rect.width,
      y: element.rect.y + element.rect.height
    };
    setAttributes(line, {
      x1: origin.x,
      y1: origin.y,
      x2: target.x,
      y2: target.y
    });
    if (!markup.lineDecoration) return;
    begin.style.display = "none";
    end.style.display = "none";
    const v = vectorNormalize({
      x: target.x - origin.x,
      y: target.y - origin.y
    });
    const l = getMarkupValue(0.05, size, scale);
    if (markup.lineDecoration.indexOf("arrow-begin") !== -1) {
      const arrowBeginRotationPoint = vectorMultiply(v, l);
      const arrowBeginCenter = vectorAdd(origin, arrowBeginRotationPoint);
      const arrowBeginA = vectorRotate(origin, 2, arrowBeginCenter);
      const arrowBeginB = vectorRotate(origin, -2, arrowBeginCenter);
      setAttributes(begin, {
        style: "display:block;",
        d: `M${arrowBeginA.x},${arrowBeginA.y} L${origin.x},${origin.y} L${arrowBeginB.x},${arrowBeginB.y}`
      });
    }
    if (markup.lineDecoration.indexOf("arrow-end") !== -1) {
      const arrowEndRotationPoint = vectorMultiply(v, -l);
      const arrowEndCenter = vectorAdd(target, arrowEndRotationPoint);
      const arrowEndA = vectorRotate(target, 2, arrowEndCenter);
      const arrowEndB = vectorRotate(target, -2, arrowEndCenter);
      setAttributes(end, {
        style: "display:block;",
        d: `M${arrowEndA.x},${arrowEndA.y} L${target.x},${target.y} L${arrowEndB.x},${arrowEndB.y}`
      });
    }
  };
  var updatePath = (element, markup, size, scale) => {
    setAttributes(element, {
      ...element.styles,
      fill: "none",
      d: pointsToPathShape(
        markup.points.map((point) => ({
          x: getMarkupValue(point.x, size, scale, "width"),
          y: getMarkupValue(point.y, size, scale, "height")
        }))
      )
    });
  };
  var createShape = (node) => (markup) => svg(node, { id: markup.id });
  var createImage = (markup) => {
    const shape = svg("image", {
      id: markup.id,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      opacity: "0"
    });
    shape.onload = () => {
      shape.setAttribute("opacity", markup.opacity || 1);
    };
    shape.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      markup.src
    );
    return shape;
  };
  var createLine = (markup) => {
    const shape = svg("g", {
      id: markup.id,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    });
    const line = svg("line");
    shape.appendChild(line);
    const begin = svg("path");
    shape.appendChild(begin);
    const end = svg("path");
    shape.appendChild(end);
    return shape;
  };
  var CREATE_TYPE_ROUTES = {
    image: createImage,
    rect: createShape("rect"),
    ellipse: createShape("ellipse"),
    text: createShape("text"),
    path: createShape("path"),
    line: createLine
  };
  var UPDATE_TYPE_ROUTES = {
    rect: updateRect2,
    ellipse: updateEllipse,
    image: updateImage,
    text: updateText,
    path: updatePath,
    line: updateLine
  };
  var createMarkupByType = (type, markup) => CREATE_TYPE_ROUTES[type](markup);
  var updateMarkupByType = (element, type, markup, size, scale) => {
    if (type !== "path") {
      element.rect = getMarkupRect(markup, size, scale);
    }
    element.styles = getMarkupStyles(markup, size, scale);
    UPDATE_TYPE_ROUTES[type](element, markup, size, scale);
  };
  var MARKUP_RECT = [
    "x",
    "y",
    "left",
    "top",
    "right",
    "bottom",
    "width",
    "height"
  ];
  var toOptionalFraction = (value) => typeof value === "string" && /%/.test(value) ? parseFloat(value) / 100 : value;
  var prepareMarkup = (markup) => {
    const [type, props] = markup;
    const rect = props.points ? {} : MARKUP_RECT.reduce((prev, curr) => {
      prev[curr] = toOptionalFraction(props[curr]);
      return prev;
    }, {});
    return [
      type,
      {
        zIndex: 0,
        ...props,
        ...rect
      }
    ];
  };
  var sortMarkupByZIndex = (a, b) => {
    if (a[1].zIndex > b[1].zIndex) {
      return 1;
    }
    if (a[1].zIndex < b[1].zIndex) {
      return -1;
    }
    return 0;
  };
  var createMarkupView = (_) => _.utils.createView({
    name: "image-preview-markup",
    tag: "svg",
    ignoreRect: true,
    mixins: {
      apis: ["width", "height", "crop", "markup", "resize", "dirty"]
    },
    write: ({ root: root2, props }) => {
      if (!props.dirty) return;
      const { crop, resize, markup } = props;
      const viewWidth = props.width;
      const viewHeight = props.height;
      let cropWidth = crop.width;
      let cropHeight = crop.height;
      if (resize) {
        const { size: size2 } = resize;
        let outputWidth = size2 && size2.width;
        let outputHeight = size2 && size2.height;
        const outputFit = resize.mode;
        const outputUpscale = resize.upscale;
        if (outputWidth && !outputHeight) outputHeight = outputWidth;
        if (outputHeight && !outputWidth) outputWidth = outputHeight;
        const shouldUpscale = cropWidth < outputWidth && cropHeight < outputHeight;
        if (!shouldUpscale || shouldUpscale && outputUpscale) {
          let scalarWidth = outputWidth / cropWidth;
          let scalarHeight = outputHeight / cropHeight;
          if (outputFit === "force") {
            cropWidth = outputWidth;
            cropHeight = outputHeight;
          } else {
            let scalar;
            if (outputFit === "cover") {
              scalar = Math.max(scalarWidth, scalarHeight);
            } else if (outputFit === "contain") {
              scalar = Math.min(scalarWidth, scalarHeight);
            }
            cropWidth = cropWidth * scalar;
            cropHeight = cropHeight * scalar;
          }
        }
      }
      const size = {
        width: viewWidth,
        height: viewHeight
      };
      root2.element.setAttribute("width", size.width);
      root2.element.setAttribute("height", size.height);
      const scale = Math.min(viewWidth / cropWidth, viewHeight / cropHeight);
      root2.element.innerHTML = "";
      const markupFilter = root2.query("GET_IMAGE_PREVIEW_MARKUP_FILTER");
      markup.filter(markupFilter).map(prepareMarkup).sort(sortMarkupByZIndex).forEach((markup2) => {
        const [type, settings] = markup2;
        const element = createMarkupByType(type, settings);
        updateMarkupByType(element, type, settings, size, scale);
        root2.element.appendChild(element);
      });
    }
  });
  var createVector$1 = (x, y) => ({ x, y });
  var vectorDot = (a, b) => a.x * b.x + a.y * b.y;
  var vectorSubtract = (a, b) => createVector$1(a.x - b.x, a.y - b.y);
  var vectorDistanceSquared = (a, b) => vectorDot(vectorSubtract(a, b), vectorSubtract(a, b));
  var vectorDistance = (a, b) => Math.sqrt(vectorDistanceSquared(a, b));
  var getOffsetPointOnEdge = (length, rotation) => {
    const a = length;
    const A = 1.5707963267948966;
    const B = rotation;
    const C = 1.5707963267948966 - rotation;
    const sinA = Math.sin(A);
    const sinB = Math.sin(B);
    const sinC = Math.sin(C);
    const cosC = Math.cos(C);
    const ratio = a / sinA;
    const b = ratio * sinB;
    const c = ratio * sinC;
    return createVector$1(cosC * b, cosC * c);
  };
  var getRotatedRectSize = (rect, rotation) => {
    const w = rect.width;
    const h = rect.height;
    const hor = getOffsetPointOnEdge(w, rotation);
    const ver = getOffsetPointOnEdge(h, rotation);
    const tl = createVector$1(rect.x + Math.abs(hor.x), rect.y - Math.abs(hor.y));
    const tr = createVector$1(
      rect.x + rect.width + Math.abs(ver.y),
      rect.y + Math.abs(ver.x)
    );
    const bl = createVector$1(
      rect.x - Math.abs(ver.y),
      rect.y + rect.height - Math.abs(ver.x)
    );
    return {
      width: vectorDistance(tl, tr),
      height: vectorDistance(tl, bl)
    };
  };
  var calculateCanvasSize = (image, canvasAspectRatio, zoom = 1) => {
    const imageAspectRatio = image.height / image.width;
    let canvasWidth = 1;
    let canvasHeight = canvasAspectRatio;
    let imgWidth = 1;
    let imgHeight = imageAspectRatio;
    if (imgHeight > canvasHeight) {
      imgHeight = canvasHeight;
      imgWidth = imgHeight / imageAspectRatio;
    }
    const scalar = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const width2 = image.width / (zoom * scalar * imgWidth);
    const height2 = width2 * canvasAspectRatio;
    return {
      width: width2,
      height: height2
    };
  };
  var getImageRectZoomFactor = (imageRect, cropRect, rotation, center2) => {
    const cx = center2.x > 0.5 ? 1 - center2.x : center2.x;
    const cy = center2.y > 0.5 ? 1 - center2.y : center2.y;
    const imageWidth = cx * 2 * imageRect.width;
    const imageHeight = cy * 2 * imageRect.height;
    const rotatedCropSize = getRotatedRectSize(cropRect, rotation);
    return Math.max(
      rotatedCropSize.width / imageWidth,
      rotatedCropSize.height / imageHeight
    );
  };
  var getCenteredCropRect = (container, aspectRatio) => {
    let width2 = container.width;
    let height2 = width2 * aspectRatio;
    if (height2 > container.height) {
      height2 = container.height;
      width2 = height2 / aspectRatio;
    }
    const x = (container.width - width2) * 0.5;
    const y = (container.height - height2) * 0.5;
    return {
      x,
      y,
      width: width2,
      height: height2
    };
  };
  var getCurrentCropSize = (imageSize, crop = {}) => {
    let { zoom, rotation, center: center2, aspectRatio } = crop;
    if (!aspectRatio) aspectRatio = imageSize.height / imageSize.width;
    const canvasSize = calculateCanvasSize(imageSize, aspectRatio, zoom);
    const canvasCenter = {
      x: canvasSize.width * 0.5,
      y: canvasSize.height * 0.5
    };
    const stage = {
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      center: canvasCenter
    };
    const shouldLimit = typeof crop.scaleToFit === "undefined" || crop.scaleToFit;
    const stageZoomFactor = getImageRectZoomFactor(
      imageSize,
      getCenteredCropRect(stage, aspectRatio),
      rotation,
      shouldLimit ? center2 : { x: 0.5, y: 0.5 }
    );
    const scale = zoom * stageZoomFactor;
    return {
      widthFloat: canvasSize.width / scale,
      heightFloat: canvasSize.height / scale,
      width: Math.round(canvasSize.width / scale),
      height: Math.round(canvasSize.height / scale)
    };
  };
  var IMAGE_SCALE_SPRING_PROPS2 = {
    type: "spring",
    stiffness: 0.5,
    damping: 0.45,
    mass: 10
  };
  var createBitmapView = (_) => _.utils.createView({
    name: "image-bitmap",
    ignoreRect: true,
    mixins: { styles: ["scaleX", "scaleY"] },
    create: ({ root: root2, props }) => {
      root2.appendChild(props.image);
    }
  });
  var createImageCanvasWrapper = (_) => _.utils.createView({
    name: "image-canvas-wrapper",
    tag: "div",
    ignoreRect: true,
    mixins: {
      apis: ["crop", "width", "height"],
      styles: [
        "originX",
        "originY",
        "translateX",
        "translateY",
        "scaleX",
        "scaleY",
        "rotateZ"
      ],
      animations: {
        originX: IMAGE_SCALE_SPRING_PROPS2,
        originY: IMAGE_SCALE_SPRING_PROPS2,
        scaleX: IMAGE_SCALE_SPRING_PROPS2,
        scaleY: IMAGE_SCALE_SPRING_PROPS2,
        translateX: IMAGE_SCALE_SPRING_PROPS2,
        translateY: IMAGE_SCALE_SPRING_PROPS2,
        rotateZ: IMAGE_SCALE_SPRING_PROPS2
      }
    },
    create: ({ root: root2, props }) => {
      props.width = props.image.width;
      props.height = props.image.height;
      root2.ref.bitmap = root2.appendChildView(
        root2.createChildView(createBitmapView(_), { image: props.image })
      );
    },
    write: ({ root: root2, props }) => {
      const { flip } = props.crop;
      const { bitmap } = root2.ref;
      bitmap.scaleX = flip.horizontal ? -1 : 1;
      bitmap.scaleY = flip.vertical ? -1 : 1;
    }
  });
  var createClipView = (_) => _.utils.createView({
    name: "image-clip",
    tag: "div",
    ignoreRect: true,
    mixins: {
      apis: [
        "crop",
        "markup",
        "resize",
        "width",
        "height",
        "dirty",
        "background"
      ],
      styles: ["width", "height", "opacity"],
      animations: {
        opacity: { type: "tween", duration: 250 }
      }
    },
    didWriteView: function({ root: root2, props }) {
      if (!props.background) return;
      root2.element.style.backgroundColor = props.background;
    },
    create: ({ root: root2, props }) => {
      root2.ref.image = root2.appendChildView(
        root2.createChildView(
          createImageCanvasWrapper(_),
          Object.assign({}, props)
        )
      );
      root2.ref.createMarkup = () => {
        if (root2.ref.markup) return;
        root2.ref.markup = root2.appendChildView(
          root2.createChildView(createMarkupView(_), Object.assign({}, props))
        );
      };
      root2.ref.destroyMarkup = () => {
        if (!root2.ref.markup) return;
        root2.removeChildView(root2.ref.markup);
        root2.ref.markup = null;
      };
      const transparencyIndicator = root2.query(
        "GET_IMAGE_PREVIEW_TRANSPARENCY_INDICATOR"
      );
      if (transparencyIndicator === null) return;
      if (transparencyIndicator === "grid") {
        root2.element.dataset.transparencyIndicator = transparencyIndicator;
      } else {
        root2.element.dataset.transparencyIndicator = "color";
      }
    },
    write: ({ root: root2, props, shouldOptimize }) => {
      const { crop, markup, resize, dirty, width: width2, height: height2 } = props;
      root2.ref.image.crop = crop;
      const stage = {
        x: 0,
        y: 0,
        width: width2,
        height: height2,
        center: {
          x: width2 * 0.5,
          y: height2 * 0.5
        }
      };
      const image = {
        width: root2.ref.image.width,
        height: root2.ref.image.height
      };
      const origin = {
        x: crop.center.x * image.width,
        y: crop.center.y * image.height
      };
      const translation = {
        x: stage.center.x - image.width * crop.center.x,
        y: stage.center.y - image.height * crop.center.y
      };
      const rotation = Math.PI * 2 + crop.rotation % (Math.PI * 2);
      const cropAspectRatio = crop.aspectRatio || image.height / image.width;
      const shouldLimit = typeof crop.scaleToFit === "undefined" || crop.scaleToFit;
      const stageZoomFactor = getImageRectZoomFactor(
        image,
        getCenteredCropRect(stage, cropAspectRatio),
        rotation,
        shouldLimit ? crop.center : { x: 0.5, y: 0.5 }
      );
      const scale = crop.zoom * stageZoomFactor;
      if (markup && markup.length) {
        root2.ref.createMarkup();
        root2.ref.markup.width = width2;
        root2.ref.markup.height = height2;
        root2.ref.markup.resize = resize;
        root2.ref.markup.dirty = dirty;
        root2.ref.markup.markup = markup;
        root2.ref.markup.crop = getCurrentCropSize(image, crop);
      } else if (root2.ref.markup) {
        root2.ref.destroyMarkup();
      }
      const imageView = root2.ref.image;
      if (shouldOptimize) {
        imageView.originX = null;
        imageView.originY = null;
        imageView.translateX = null;
        imageView.translateY = null;
        imageView.rotateZ = null;
        imageView.scaleX = null;
        imageView.scaleY = null;
        return;
      }
      imageView.originX = origin.x;
      imageView.originY = origin.y;
      imageView.translateX = translation.x;
      imageView.translateY = translation.y;
      imageView.rotateZ = rotation;
      imageView.scaleX = scale;
      imageView.scaleY = scale;
    }
  });
  var createImageView = (_) => _.utils.createView({
    name: "image-preview",
    tag: "div",
    ignoreRect: true,
    mixins: {
      apis: ["image", "crop", "markup", "resize", "dirty", "background"],
      styles: ["translateY", "scaleX", "scaleY", "opacity"],
      animations: {
        scaleX: IMAGE_SCALE_SPRING_PROPS2,
        scaleY: IMAGE_SCALE_SPRING_PROPS2,
        translateY: IMAGE_SCALE_SPRING_PROPS2,
        opacity: { type: "tween", duration: 400 }
      }
    },
    create: ({ root: root2, props }) => {
      root2.ref.clip = root2.appendChildView(
        root2.createChildView(createClipView(_), {
          id: props.id,
          image: props.image,
          crop: props.crop,
          markup: props.markup,
          resize: props.resize,
          dirty: props.dirty,
          background: props.background
        })
      );
    },
    write: ({ root: root2, props, shouldOptimize }) => {
      const { clip } = root2.ref;
      const { image, crop, markup, resize, dirty } = props;
      clip.crop = crop;
      clip.markup = markup;
      clip.resize = resize;
      clip.dirty = dirty;
      clip.opacity = shouldOptimize ? 0 : 1;
      if (shouldOptimize || root2.rect.element.hidden) return;
      const imageAspectRatio = image.height / image.width;
      let aspectRatio = crop.aspectRatio || imageAspectRatio;
      const containerWidth = root2.rect.inner.width;
      const containerHeight = root2.rect.inner.height;
      let fixedPreviewHeight = root2.query("GET_IMAGE_PREVIEW_HEIGHT");
      const minPreviewHeight = root2.query("GET_IMAGE_PREVIEW_MIN_HEIGHT");
      const maxPreviewHeight = root2.query("GET_IMAGE_PREVIEW_MAX_HEIGHT");
      const panelAspectRatio = root2.query("GET_PANEL_ASPECT_RATIO");
      const allowMultiple = root2.query("GET_ALLOW_MULTIPLE");
      if (panelAspectRatio && !allowMultiple) {
        fixedPreviewHeight = containerWidth * panelAspectRatio;
        aspectRatio = panelAspectRatio;
      }
      let clipHeight = fixedPreviewHeight !== null ? fixedPreviewHeight : Math.max(
        minPreviewHeight,
        Math.min(containerWidth * aspectRatio, maxPreviewHeight)
      );
      let clipWidth = clipHeight / aspectRatio;
      if (clipWidth > containerWidth) {
        clipWidth = containerWidth;
        clipHeight = clipWidth * aspectRatio;
      }
      if (clipHeight > containerHeight) {
        clipHeight = containerHeight;
        clipWidth = containerHeight / aspectRatio;
      }
      clip.width = clipWidth;
      clip.height = clipHeight;
    }
  });
  var SVG_MASK = `<svg width="500" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
    <defs>
        <radialGradient id="gradient-__UID__" cx=".5" cy="1.25" r="1.15">
            <stop offset='50%' stop-color='#000000'/>
            <stop offset='56%' stop-color='#0a0a0a'/>
            <stop offset='63%' stop-color='#262626'/>
            <stop offset='69%' stop-color='#4f4f4f'/>
            <stop offset='75%' stop-color='#808080'/>
            <stop offset='81%' stop-color='#b1b1b1'/>
            <stop offset='88%' stop-color='#dadada'/>
            <stop offset='94%' stop-color='#f6f6f6'/>
            <stop offset='100%' stop-color='#ffffff'/>
        </radialGradient>
        <mask id="mask-__UID__">
            <rect x="0" y="0" width="500" height="200" fill="url(#gradient-__UID__)"></rect>
        </mask>
    </defs>
    <rect x="0" width="500" height="200" fill="currentColor" mask="url(#mask-__UID__)"></rect>
</svg>`;
  var SVGMaskUniqueId = 0;
  var createImageOverlayView = (fpAPI) => fpAPI.utils.createView({
    name: "image-preview-overlay",
    tag: "div",
    ignoreRect: true,
    create: ({ root: root2, props }) => {
      let mask = SVG_MASK;
      if (document.querySelector("base")) {
        const url = new URL(
          window.location.href.replace(window.location.hash, "")
        ).href;
        mask = mask.replace(/url\(\#/g, "url(" + url + "#");
      }
      SVGMaskUniqueId++;
      root2.element.classList.add(
        `filepond--image-preview-overlay-${props.status}`
      );
      root2.element.innerHTML = mask.replace(/__UID__/g, SVGMaskUniqueId);
    },
    mixins: {
      styles: ["opacity"],
      animations: {
        opacity: { type: "spring", mass: 25 }
      }
    }
  });
  var BitmapWorker = function() {
    self.onmessage = (e) => {
      createImageBitmap(e.data.message.file).then((bitmap) => {
        self.postMessage({ id: e.data.id, message: bitmap }, [bitmap]);
      });
    };
  };
  var ColorMatrixWorker = function() {
    self.onmessage = (e) => {
      const imageData = e.data.message.imageData;
      const matrix = e.data.message.colorMatrix;
      const data3 = imageData.data;
      const l = data3.length;
      const m11 = matrix[0];
      const m12 = matrix[1];
      const m13 = matrix[2];
      const m14 = matrix[3];
      const m15 = matrix[4];
      const m21 = matrix[5];
      const m22 = matrix[6];
      const m23 = matrix[7];
      const m24 = matrix[8];
      const m25 = matrix[9];
      const m31 = matrix[10];
      const m32 = matrix[11];
      const m33 = matrix[12];
      const m34 = matrix[13];
      const m35 = matrix[14];
      const m41 = matrix[15];
      const m42 = matrix[16];
      const m43 = matrix[17];
      const m44 = matrix[18];
      const m45 = matrix[19];
      let index = 0, r = 0, g = 0, b = 0, a = 0;
      for (; index < l; index += 4) {
        r = data3[index] / 255;
        g = data3[index + 1] / 255;
        b = data3[index + 2] / 255;
        a = data3[index + 3] / 255;
        data3[index] = Math.max(
          0,
          Math.min((r * m11 + g * m12 + b * m13 + a * m14 + m15) * 255, 255)
        );
        data3[index + 1] = Math.max(
          0,
          Math.min((r * m21 + g * m22 + b * m23 + a * m24 + m25) * 255, 255)
        );
        data3[index + 2] = Math.max(
          0,
          Math.min((r * m31 + g * m32 + b * m33 + a * m34 + m35) * 255, 255)
        );
        data3[index + 3] = Math.max(
          0,
          Math.min((r * m41 + g * m42 + b * m43 + a * m44 + m45) * 255, 255)
        );
      }
      self.postMessage({ id: e.data.id, message: imageData }, [
        imageData.data.buffer
      ]);
    };
  };
  var getImageSize2 = (url, cb) => {
    let image = new Image();
    image.onload = () => {
      const width2 = image.naturalWidth;
      const height2 = image.naturalHeight;
      image = null;
      cb(width2, height2);
    };
    image.src = url;
  };
  var transforms = {
    1: () => [1, 0, 0, 1, 0, 0],
    2: (width2) => [-1, 0, 0, 1, width2, 0],
    3: (width2, height2) => [-1, 0, 0, -1, width2, height2],
    4: (width2, height2) => [1, 0, 0, -1, 0, height2],
    5: () => [0, 1, 1, 0, 0, 0],
    6: (width2, height2) => [0, 1, -1, 0, height2, 0],
    7: (width2, height2) => [0, -1, -1, 0, height2, width2],
    8: (width2) => [0, -1, 1, 0, 0, width2]
  };
  var fixImageOrientation = (ctx, width2, height2, orientation) => {
    if (orientation === -1) {
      return;
    }
    ctx.transform.apply(ctx, transforms[orientation](width2, height2));
  };
  var createPreviewImage = (data3, width2, height2, orientation) => {
    width2 = Math.round(width2);
    height2 = Math.round(height2);
    const canvas = document.createElement("canvas");
    canvas.width = width2;
    canvas.height = height2;
    const ctx = canvas.getContext("2d");
    if (orientation >= 5 && orientation <= 8) {
      [width2, height2] = [height2, width2];
    }
    fixImageOrientation(ctx, width2, height2, orientation);
    ctx.drawImage(data3, 0, 0, width2, height2);
    return canvas;
  };
  var isBitmap = (file2) => /^image/.test(file2.type) && !/svg/.test(file2.type);
  var MAX_WIDTH2 = 10;
  var MAX_HEIGHT2 = 10;
  var calculateAverageColor2 = (image) => {
    const scalar = Math.min(MAX_WIDTH2 / image.width, MAX_HEIGHT2 / image.height);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width2 = canvas.width = Math.ceil(image.width * scalar);
    const height2 = canvas.height = Math.ceil(image.height * scalar);
    ctx.drawImage(image, 0, 0, width2, height2);
    let data3 = null;
    try {
      data3 = ctx.getImageData(0, 0, width2, height2).data;
    } catch (e) {
      return null;
    }
    const l = data3.length;
    let r = 0;
    let g = 0;
    let b = 0;
    let i = 0;
    for (; i < l; i += 4) {
      r += data3[i] * data3[i];
      g += data3[i + 1] * data3[i + 1];
      b += data3[i + 2] * data3[i + 2];
    }
    r = averageColor2(r, l);
    g = averageColor2(g, l);
    b = averageColor2(b, l);
    return { r, g, b };
  };
  var averageColor2 = (c, l) => Math.floor(Math.sqrt(c / (l / 4)));
  var cloneCanvas = (origin, target) => {
    target = target || document.createElement("canvas");
    target.width = origin.width;
    target.height = origin.height;
    const ctx = target.getContext("2d");
    ctx.drawImage(origin, 0, 0);
    return target;
  };
  var cloneImageData = (imageData) => {
    let id;
    try {
      id = new ImageData(imageData.width, imageData.height);
    } catch (e) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      id = ctx.createImageData(imageData.width, imageData.height);
    }
    id.data.set(new Uint8ClampedArray(imageData.data));
    return id;
  };
  var loadImage3 = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
  var createImageWrapperView = (_) => {
    const OverlayView = createImageOverlayView(_);
    const ImageView = createImageView(_);
    const { createWorker: createWorker3 } = _.utils;
    const applyFilter = (root2, filter, target) => new Promise((resolve) => {
      if (!root2.ref.imageData) {
        root2.ref.imageData = target.getContext("2d").getImageData(0, 0, target.width, target.height);
      }
      const imageData = cloneImageData(root2.ref.imageData);
      if (!filter || filter.length !== 20) {
        target.getContext("2d").putImageData(imageData, 0, 0);
        return resolve();
      }
      const worker = createWorker3(ColorMatrixWorker);
      worker.post(
        {
          imageData,
          colorMatrix: filter
        },
        (response) => {
          target.getContext("2d").putImageData(response, 0, 0);
          worker.terminate();
          resolve();
        },
        [imageData.data.buffer]
      );
    });
    const removeImageView = (root2, imageView) => {
      root2.removeChildView(imageView);
      imageView.image.width = 1;
      imageView.image.height = 1;
      imageView._destroy();
    };
    const shiftImage = ({ root: root2 }) => {
      const imageView = root2.ref.images.shift();
      imageView.opacity = 0;
      imageView.translateY = -15;
      root2.ref.imageViewBin.push(imageView);
      return imageView;
    };
    const pushImage = ({ root: root2, props, image }) => {
      const id = props.id;
      const item2 = root2.query("GET_ITEM", { id });
      if (!item2) return;
      const crop = item2.getMetadata("crop") || {
        center: {
          x: 0.5,
          y: 0.5
        },
        flip: {
          horizontal: false,
          vertical: false
        },
        zoom: 1,
        rotation: 0,
        aspectRatio: null
      };
      const background = root2.query(
        "GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR"
      );
      let markup;
      let resize;
      let dirty = false;
      if (root2.query("GET_IMAGE_PREVIEW_MARKUP_SHOW")) {
        markup = item2.getMetadata("markup") || [];
        resize = item2.getMetadata("resize");
        dirty = true;
      }
      const imageView = root2.appendChildView(
        root2.createChildView(ImageView, {
          id,
          image,
          crop,
          resize,
          markup,
          dirty,
          background,
          opacity: 0,
          scaleX: 1.15,
          scaleY: 1.15,
          translateY: 15
        }),
        root2.childViews.length
      );
      root2.ref.images.push(imageView);
      imageView.opacity = 1;
      imageView.scaleX = 1;
      imageView.scaleY = 1;
      imageView.translateY = 0;
      setTimeout(() => {
        root2.dispatch("DID_IMAGE_PREVIEW_SHOW", { id });
      }, 250);
    };
    const updateImage3 = ({ root: root2, props }) => {
      const item2 = root2.query("GET_ITEM", { id: props.id });
      if (!item2) return;
      const imageView = root2.ref.images[root2.ref.images.length - 1];
      imageView.crop = item2.getMetadata("crop");
      imageView.background = root2.query(
        "GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR"
      );
      if (root2.query("GET_IMAGE_PREVIEW_MARKUP_SHOW")) {
        imageView.dirty = true;
        imageView.resize = item2.getMetadata("resize");
        imageView.markup = item2.getMetadata("markup");
      }
    };
    const didUpdateItemMetadata = ({ root: root2, props, action }) => {
      if (!/crop|filter|markup|resize/.test(action.change.key)) return;
      if (!root2.ref.images.length) return;
      const item2 = root2.query("GET_ITEM", { id: props.id });
      if (!item2) return;
      if (/filter/.test(action.change.key)) {
        const imageView = root2.ref.images[root2.ref.images.length - 1];
        applyFilter(root2, action.change.value, imageView.image);
        return;
      }
      if (/crop|markup|resize/.test(action.change.key)) {
        const crop = item2.getMetadata("crop");
        const image = root2.ref.images[root2.ref.images.length - 1];
        if (crop && crop.aspectRatio && image.crop && image.crop.aspectRatio && Math.abs(crop.aspectRatio - image.crop.aspectRatio) > 1e-5) {
          const imageView = shiftImage({ root: root2 });
          pushImage({ root: root2, props, image: cloneCanvas(imageView.image) });
        } else {
          updateImage3({ root: root2, props });
        }
      }
    };
    const canCreateImageBitmap = (file2) => {
      const userAgent = window.navigator.userAgent;
      const isFirefox = userAgent.match(/Firefox\/([0-9]+)\./);
      const firefoxVersion = isFirefox ? parseInt(isFirefox[1]) : null;
      if (firefoxVersion !== null && firefoxVersion <= 58) return false;
      return "createImageBitmap" in window && isBitmap(file2);
    };
    const didCreatePreviewContainer = ({ root: root2, props }) => {
      const { id } = props;
      const item2 = root2.query("GET_ITEM", id);
      if (!item2) return;
      const fileURL = URL.createObjectURL(item2.file);
      getImageSize2(fileURL, (width2, height2) => {
        root2.dispatch("DID_IMAGE_PREVIEW_CALCULATE_SIZE", {
          id,
          width: width2,
          height: height2
        });
      });
    };
    const drawPreview = ({ root: root2, props }) => {
      const { id } = props;
      const item2 = root2.query("GET_ITEM", id);
      if (!item2) return;
      const fileURL = URL.createObjectURL(item2.file);
      const loadPreviewFallback = () => {
        loadImage3(fileURL).then(previewImageLoaded);
      };
      const previewImageLoaded = (imageData) => {
        URL.revokeObjectURL(fileURL);
        const exif = item2.getMetadata("exif") || {};
        const orientation = exif.orientation || -1;
        let { width: width2, height: height2 } = imageData;
        if (!width2 || !height2) return;
        if (orientation >= 5 && orientation <= 8) {
          [width2, height2] = [height2, width2];
        }
        const pixelDensityFactor = Math.max(1, window.devicePixelRatio * 0.75);
        const zoomFactor = root2.query("GET_IMAGE_PREVIEW_ZOOM_FACTOR");
        const scaleFactor = zoomFactor * pixelDensityFactor;
        const previewImageRatio = height2 / width2;
        const previewContainerWidth = root2.rect.element.width;
        const previewContainerHeight = root2.rect.element.height;
        let imageWidth = previewContainerWidth;
        let imageHeight = imageWidth * previewImageRatio;
        if (previewImageRatio > 1) {
          imageWidth = Math.min(width2, previewContainerWidth * scaleFactor);
          imageHeight = imageWidth * previewImageRatio;
        } else {
          imageHeight = Math.min(height2, previewContainerHeight * scaleFactor);
          imageWidth = imageHeight / previewImageRatio;
        }
        const previewImage = createPreviewImage(
          imageData,
          imageWidth,
          imageHeight,
          orientation
        );
        const done = () => {
          const averageColor3 = root2.query(
            "GET_IMAGE_PREVIEW_CALCULATE_AVERAGE_IMAGE_COLOR"
          ) ? calculateAverageColor2(data) : null;
          item2.setMetadata("color", averageColor3, true);
          if ("close" in imageData) {
            imageData.close();
          }
          root2.ref.overlayShadow.opacity = 1;
          pushImage({ root: root2, props, image: previewImage });
        };
        const filter = item2.getMetadata("filter");
        if (filter) {
          applyFilter(root2, filter, previewImage).then(done);
        } else {
          done();
        }
      };
      if (canCreateImageBitmap(item2.file)) {
        const worker = createWorker3(BitmapWorker);
        worker.post(
          {
            file: item2.file
          },
          (imageBitmap) => {
            worker.terminate();
            if (!imageBitmap) {
              loadPreviewFallback();
              return;
            }
            previewImageLoaded(imageBitmap);
          }
        );
      } else {
        loadPreviewFallback();
      }
    };
    const didDrawPreview = ({ root: root2 }) => {
      const image = root2.ref.images[root2.ref.images.length - 1];
      image.translateY = 0;
      image.scaleX = 1;
      image.scaleY = 1;
      image.opacity = 1;
    };
    const restoreOverlay = ({ root: root2 }) => {
      root2.ref.overlayShadow.opacity = 1;
      root2.ref.overlayError.opacity = 0;
      root2.ref.overlaySuccess.opacity = 0;
    };
    const didThrowError = ({ root: root2 }) => {
      root2.ref.overlayShadow.opacity = 0.25;
      root2.ref.overlayError.opacity = 1;
    };
    const didCompleteProcessing = ({ root: root2 }) => {
      root2.ref.overlayShadow.opacity = 0.25;
      root2.ref.overlaySuccess.opacity = 1;
    };
    const create2 = ({ root: root2 }) => {
      root2.ref.images = [];
      root2.ref.imageData = null;
      root2.ref.imageViewBin = [];
      root2.ref.overlayShadow = root2.appendChildView(
        root2.createChildView(OverlayView, {
          opacity: 0,
          status: "idle"
        })
      );
      root2.ref.overlaySuccess = root2.appendChildView(
        root2.createChildView(OverlayView, {
          opacity: 0,
          status: "success"
        })
      );
      root2.ref.overlayError = root2.appendChildView(
        root2.createChildView(OverlayView, {
          opacity: 0,
          status: "failure"
        })
      );
    };
    return _.utils.createView({
      name: "image-preview-wrapper",
      create: create2,
      styles: ["height"],
      apis: ["height"],
      destroy: ({ root: root2 }) => {
        root2.ref.images.forEach((imageView) => {
          imageView.image.width = 1;
          imageView.image.height = 1;
        });
      },
      didWriteView: ({ root: root2 }) => {
        root2.ref.images.forEach((imageView) => {
          imageView.dirty = false;
        });
      },
      write: _.utils.createRoute(
        {
          // image preview stated
          DID_IMAGE_PREVIEW_DRAW: didDrawPreview,
          DID_IMAGE_PREVIEW_CONTAINER_CREATE: didCreatePreviewContainer,
          DID_FINISH_CALCULATE_PREVIEWSIZE: drawPreview,
          DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata,
          // file states
          DID_THROW_ITEM_LOAD_ERROR: didThrowError,
          DID_THROW_ITEM_PROCESSING_ERROR: didThrowError,
          DID_THROW_ITEM_INVALID: didThrowError,
          DID_COMPLETE_ITEM_PROCESSING: didCompleteProcessing,
          DID_START_ITEM_PROCESSING: restoreOverlay,
          DID_REVERT_ITEM_PROCESSING: restoreOverlay
        },
        ({ root: root2 }) => {
          const viewsToRemove = root2.ref.imageViewBin.filter(
            (imageView) => imageView.opacity === 0
          );
          root2.ref.imageViewBin = root2.ref.imageViewBin.filter(
            (imageView) => imageView.opacity > 0
          );
          viewsToRemove.forEach((imageView) => removeImageView(root2, imageView));
          viewsToRemove.length = 0;
        }
      )
    });
  };
  var plugin6 = (fpAPI) => {
    const { addFilter: addFilter2, utils } = fpAPI;
    const { Type: Type2, createRoute: createRoute2, isFile: isFile2 } = utils;
    const imagePreviewView = createImageWrapperView(fpAPI);
    addFilter2("CREATE_VIEW", (viewAPI) => {
      const { is, view, query } = viewAPI;
      if (!is("file") || !query("GET_ALLOW_IMAGE_PREVIEW")) return;
      const didLoadItem2 = ({ root: root2, props }) => {
        const { id } = props;
        const item2 = query("GET_ITEM", id);
        if (!item2 || !isFile2(item2.file) || item2.archived) return;
        const file2 = item2.file;
        if (!isPreviewableImage(file2)) return;
        if (!query("GET_IMAGE_PREVIEW_FILTER_ITEM")(item2)) return;
        const supportsCreateImageBitmap = "createImageBitmap" in (window || {});
        const maxPreviewFileSize = query("GET_IMAGE_PREVIEW_MAX_FILE_SIZE");
        if (!supportsCreateImageBitmap && (maxPreviewFileSize && file2.size > maxPreviewFileSize))
          return;
        root2.ref.imagePreview = view.appendChildView(
          view.createChildView(imagePreviewView, { id })
        );
        const fixedPreviewHeight = root2.query("GET_IMAGE_PREVIEW_HEIGHT");
        if (fixedPreviewHeight) {
          root2.dispatch("DID_UPDATE_PANEL_HEIGHT", {
            id: item2.id,
            height: fixedPreviewHeight
          });
        }
        const queue = !supportsCreateImageBitmap && file2.size > query("GET_IMAGE_PREVIEW_MAX_INSTANT_PREVIEW_FILE_SIZE");
        root2.dispatch("DID_IMAGE_PREVIEW_CONTAINER_CREATE", { id }, queue);
      };
      const rescaleItem = (root2, props) => {
        if (!root2.ref.imagePreview) return;
        let { id } = props;
        const item2 = root2.query("GET_ITEM", { id });
        if (!item2) return;
        const panelAspectRatio = root2.query("GET_PANEL_ASPECT_RATIO");
        const itemPanelAspectRatio = root2.query("GET_ITEM_PANEL_ASPECT_RATIO");
        const fixedHeight = root2.query("GET_IMAGE_PREVIEW_HEIGHT");
        if (panelAspectRatio || itemPanelAspectRatio || fixedHeight) return;
        let { imageWidth, imageHeight } = root2.ref;
        if (!imageWidth || !imageHeight) return;
        const minPreviewHeight = root2.query("GET_IMAGE_PREVIEW_MIN_HEIGHT");
        const maxPreviewHeight = root2.query("GET_IMAGE_PREVIEW_MAX_HEIGHT");
        const exif = item2.getMetadata("exif") || {};
        const orientation = exif.orientation || -1;
        if (orientation >= 5 && orientation <= 8)
          [imageWidth, imageHeight] = [imageHeight, imageWidth];
        if (!isBitmap(item2.file) || root2.query("GET_IMAGE_PREVIEW_UPSCALE")) {
          const scalar = 2048 / imageWidth;
          imageWidth *= scalar;
          imageHeight *= scalar;
        }
        const imageAspectRatio = imageHeight / imageWidth;
        const previewAspectRatio = (item2.getMetadata("crop") || {}).aspectRatio || imageAspectRatio;
        let previewHeightMax = Math.max(
          minPreviewHeight,
          Math.min(imageHeight, maxPreviewHeight)
        );
        const itemWidth = root2.rect.element.width;
        const previewHeight = Math.min(
          itemWidth * previewAspectRatio,
          previewHeightMax
        );
        root2.dispatch("DID_UPDATE_PANEL_HEIGHT", {
          id: item2.id,
          height: previewHeight
        });
      };
      const didResizeView = ({ root: root2 }) => {
        root2.ref.shouldRescale = true;
      };
      const didUpdateItemMetadata = ({ root: root2, action }) => {
        if (action.change.key !== "crop") return;
        root2.ref.shouldRescale = true;
      };
      const didCalculatePreviewSize = ({ root: root2, action }) => {
        root2.ref.imageWidth = action.width;
        root2.ref.imageHeight = action.height;
        root2.ref.shouldRescale = true;
        root2.ref.shouldDrawPreview = true;
        root2.dispatch("KICK");
      };
      view.registerWriter(
        createRoute2(
          {
            DID_RESIZE_ROOT: didResizeView,
            DID_STOP_RESIZE: didResizeView,
            DID_LOAD_ITEM: didLoadItem2,
            DID_IMAGE_PREVIEW_CALCULATE_SIZE: didCalculatePreviewSize,
            DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata
          },
          ({ root: root2, props }) => {
            if (!root2.ref.imagePreview) return;
            if (root2.rect.element.hidden) return;
            if (root2.ref.shouldRescale) {
              rescaleItem(root2, props);
              root2.ref.shouldRescale = false;
            }
            if (root2.ref.shouldDrawPreview) {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  root2.dispatch("DID_FINISH_CALCULATE_PREVIEWSIZE", {
                    id: props.id
                  });
                });
              });
              root2.ref.shouldDrawPreview = false;
            }
          }
        )
      );
    });
    return {
      options: {
        // Enable or disable image preview
        allowImagePreview: [true, Type2.BOOLEAN],
        // filters file items to determine which are shown as preview
        imagePreviewFilterItem: [() => true, Type2.FUNCTION],
        // Fixed preview height
        imagePreviewHeight: [null, Type2.INT],
        // Min image height
        imagePreviewMinHeight: [44, Type2.INT],
        // Max image height
        imagePreviewMaxHeight: [256, Type2.INT],
        // Max size of preview file for when createImageBitmap is not supported
        imagePreviewMaxFileSize: [null, Type2.INT],
        // The amount of extra pixels added to the image preview to allow comfortable zooming
        imagePreviewZoomFactor: [2, Type2.INT],
        // Should we upscale small images to fit the max bounding box of the preview area
        imagePreviewUpscale: [false, Type2.BOOLEAN],
        // Max size of preview file that we allow to try to instant preview if createImageBitmap is not supported, else image is queued for loading
        imagePreviewMaxInstantPreviewFileSize: [1e6, Type2.INT],
        // Style of the transparancy indicator used behind images
        imagePreviewTransparencyIndicator: [null, Type2.STRING],
        // Enables or disables reading average image color
        imagePreviewCalculateAverageImageColor: [false, Type2.BOOLEAN],
        // Enables or disables the previewing of markup
        imagePreviewMarkupShow: [true, Type2.BOOLEAN],
        // Allows filtering of markup to only show certain shapes
        imagePreviewMarkupFilter: [() => true, Type2.FUNCTION]
      }
    };
  };
  var isBrowser7 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser7) {
    document.dispatchEvent(
      new CustomEvent("FilePond:pluginloaded", { detail: plugin6 })
    );
  }
  var filepond_plugin_image_preview_esm_default = plugin6;

  // node_modules/filepond-plugin-image-crop/dist/filepond-plugin-image-crop.esm.js
  var isImage = (file2) => /^image/.test(file2.type);
  var plugin7 = ({ addFilter: addFilter2, utils }) => {
    const { Type: Type2, isFile: isFile2, getNumericAspectRatioFromString: getNumericAspectRatioFromString2 } = utils;
    const allowCrop = (item2, query) => !(!isImage(item2.file) || !query("GET_ALLOW_IMAGE_CROP"));
    const isObject2 = (value) => typeof value === "object";
    const isNumber2 = (value) => typeof value === "number";
    const updateCrop = (item2, obj) => item2.setMetadata("crop", Object.assign({}, item2.getMetadata("crop"), obj));
    addFilter2("DID_CREATE_ITEM", (item2, { query }) => {
      item2.extend("setImageCrop", (crop) => {
        if (!allowCrop(item2, query) || !isObject2(center)) return;
        item2.setMetadata("crop", crop);
        return crop;
      });
      item2.extend("setImageCropCenter", (center2) => {
        if (!allowCrop(item2, query) || !isObject2(center2)) return;
        return updateCrop(item2, { center: center2 });
      });
      item2.extend("setImageCropZoom", (zoom) => {
        if (!allowCrop(item2, query) || !isNumber2(zoom)) return;
        return updateCrop(item2, { zoom: Math.max(1, zoom) });
      });
      item2.extend("setImageCropRotation", (rotation) => {
        if (!allowCrop(item2, query) || !isNumber2(rotation)) return;
        return updateCrop(item2, { rotation });
      });
      item2.extend("setImageCropFlip", (flip) => {
        if (!allowCrop(item2, query) || !isObject2(flip)) return;
        return updateCrop(item2, { flip });
      });
      item2.extend("setImageCropAspectRatio", (newAspectRatio) => {
        if (!allowCrop(item2, query) || typeof newAspectRatio === "undefined")
          return;
        const currentCrop = item2.getMetadata("crop");
        const aspectRatio = getNumericAspectRatioFromString2(newAspectRatio);
        const newCrop = {
          center: {
            x: 0.5,
            y: 0.5
          },
          flip: currentCrop ? Object.assign({}, currentCrop.flip) : {
            horizontal: false,
            vertical: false
          },
          rotation: 0,
          zoom: 1,
          aspectRatio
        };
        item2.setMetadata("crop", newCrop);
        return newCrop;
      });
    });
    addFilter2(
      "DID_LOAD_ITEM",
      (item2, { query }) => new Promise((resolve, reject) => {
        const file2 = item2.file;
        if (!isFile2(file2) || !isImage(file2) || !query("GET_ALLOW_IMAGE_CROP")) {
          return resolve(item2);
        }
        const crop = item2.getMetadata("crop");
        if (crop) {
          return resolve(item2);
        }
        const humanAspectRatio = query("GET_IMAGE_CROP_ASPECT_RATIO");
        item2.setMetadata("crop", {
          center: {
            x: 0.5,
            y: 0.5
          },
          flip: {
            horizontal: false,
            vertical: false
          },
          rotation: 0,
          zoom: 1,
          aspectRatio: humanAspectRatio ? getNumericAspectRatioFromString2(humanAspectRatio) : null
        });
        resolve(item2);
      })
    );
    return {
      options: {
        // enable or disable image cropping
        allowImageCrop: [true, Type2.BOOLEAN],
        // the aspect ratio of the crop ('1:1', '16:9', etc)
        imageCropAspectRatio: [null, Type2.STRING]
      }
    };
  };
  var isBrowser8 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser8) {
    document.dispatchEvent(
      new CustomEvent("FilePond:pluginloaded", { detail: plugin7 })
    );
  }
  var filepond_plugin_image_crop_esm_default = plugin7;

  // node_modules/filepond-plugin-image-resize/dist/filepond-plugin-image-resize.esm.js
  var isImage2 = (file2) => /^image/.test(file2.type);
  var getImageSize3 = (url, cb) => {
    let image = new Image();
    image.onload = () => {
      const width2 = image.naturalWidth;
      const height2 = image.naturalHeight;
      image = null;
      cb({ width: width2, height: height2 });
    };
    image.onerror = () => cb(null);
    image.src = url;
  };
  var plugin8 = ({ addFilter: addFilter2, utils }) => {
    const { Type: Type2 } = utils;
    addFilter2(
      "DID_LOAD_ITEM",
      (item2, { query }) => new Promise((resolve, reject) => {
        const file2 = item2.file;
        if (!isImage2(file2) || !query("GET_ALLOW_IMAGE_RESIZE")) {
          return resolve(item2);
        }
        const mode = query("GET_IMAGE_RESIZE_MODE");
        const width2 = query("GET_IMAGE_RESIZE_TARGET_WIDTH");
        const height2 = query("GET_IMAGE_RESIZE_TARGET_HEIGHT");
        const upscale = query("GET_IMAGE_RESIZE_UPSCALE");
        if (width2 === null && height2 === null) return resolve(item2);
        const targetWidth = width2 === null ? height2 : width2;
        const targetHeight = height2 === null ? targetWidth : height2;
        const fileURL = URL.createObjectURL(file2);
        getImageSize3(fileURL, (size) => {
          URL.revokeObjectURL(fileURL);
          if (!size) return resolve(item2);
          let { width: imageWidth, height: imageHeight } = size;
          const orientation = (item2.getMetadata("exif") || {}).orientation || -1;
          if (orientation >= 5 && orientation <= 8) {
            [imageWidth, imageHeight] = [imageHeight, imageWidth];
          }
          if (imageWidth === targetWidth && imageHeight === targetHeight)
            return resolve(item2);
          if (!upscale) {
            if (mode === "cover") {
              if (imageWidth <= targetWidth || imageHeight <= targetHeight)
                return resolve(item2);
            } else if (imageWidth <= targetWidth && imageHeight <= targetWidth) {
              return resolve(item2);
            }
          }
          item2.setMetadata("resize", {
            mode,
            upscale,
            size: {
              width: targetWidth,
              height: targetHeight
            }
          });
          resolve(item2);
        });
      })
    );
    return {
      options: {
        // Enable or disable image resizing
        allowImageResize: [true, Type2.BOOLEAN],
        // the method of rescaling
        // - force => force set size
        // - cover => pick biggest dimension
        // - contain => pick smaller dimension
        imageResizeMode: ["cover", Type2.STRING],
        // set to false to disable upscaling of image smaller than the target width / height
        imageResizeUpscale: [true, Type2.BOOLEAN],
        // target width
        imageResizeTargetWidth: [null, Type2.INT],
        // target height
        imageResizeTargetHeight: [null, Type2.INT]
      }
    };
  };
  var isBrowser9 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser9) {
    document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: plugin8 }));
  }
  var filepond_plugin_image_resize_esm_default = plugin8;

  // node_modules/filepond-plugin-image-transform/dist/filepond-plugin-image-transform.esm.js
  var isImage3 = (file2) => /^image/.test(file2.type);
  var getFilenameWithoutExtension2 = (name2) => name2.substr(0, name2.lastIndexOf(".")) || name2;
  var ExtensionMap = {
    jpeg: "jpg",
    "svg+xml": "svg"
  };
  var renameFileToMatchMimeType = (filename, mimeType) => {
    const name2 = getFilenameWithoutExtension2(filename);
    const type = mimeType.split("/")[1];
    const extension = ExtensionMap[type] || type;
    return `${name2}.${extension}`;
  };
  var getValidOutputMimeType = (type) => /jpeg|png|svg\+xml/.test(type) ? type : "image/jpeg";
  var isImage$1 = (file2) => /^image/.test(file2.type);
  var MATRICES = {
    1: () => [1, 0, 0, 1, 0, 0],
    2: (width2) => [-1, 0, 0, 1, width2, 0],
    3: (width2, height2) => [-1, 0, 0, -1, width2, height2],
    4: (width2, height2) => [1, 0, 0, -1, 0, height2],
    5: () => [0, 1, 1, 0, 0, 0],
    6: (width2, height2) => [0, 1, -1, 0, height2, 0],
    7: (width2, height2) => [0, -1, -1, 0, height2, width2],
    8: (width2) => [0, -1, 1, 0, 0, width2]
  };
  var getImageOrientationMatrix = (width2, height2, orientation) => {
    if (orientation === -1) {
      orientation = 1;
    }
    return MATRICES[orientation](width2, height2);
  };
  var createVector2 = (x, y) => ({ x, y });
  var vectorDot2 = (a, b) => a.x * b.x + a.y * b.y;
  var vectorSubtract2 = (a, b) => createVector2(a.x - b.x, a.y - b.y);
  var vectorDistanceSquared2 = (a, b) => vectorDot2(vectorSubtract2(a, b), vectorSubtract2(a, b));
  var vectorDistance2 = (a, b) => Math.sqrt(vectorDistanceSquared2(a, b));
  var getOffsetPointOnEdge2 = (length, rotation) => {
    const a = length;
    const A = 1.5707963267948966;
    const B = rotation;
    const C = 1.5707963267948966 - rotation;
    const sinA = Math.sin(A);
    const sinB = Math.sin(B);
    const sinC = Math.sin(C);
    const cosC = Math.cos(C);
    const ratio = a / sinA;
    const b = ratio * sinB;
    const c = ratio * sinC;
    return createVector2(cosC * b, cosC * c);
  };
  var getRotatedRectSize2 = (rect, rotation) => {
    const w = rect.width;
    const h = rect.height;
    const hor = getOffsetPointOnEdge2(w, rotation);
    const ver = getOffsetPointOnEdge2(h, rotation);
    const tl = createVector2(rect.x + Math.abs(hor.x), rect.y - Math.abs(hor.y));
    const tr = createVector2(rect.x + rect.width + Math.abs(ver.y), rect.y + Math.abs(ver.x));
    const bl = createVector2(rect.x - Math.abs(ver.y), rect.y + rect.height - Math.abs(ver.x));
    return {
      width: vectorDistance2(tl, tr),
      height: vectorDistance2(tl, bl)
    };
  };
  var getImageRectZoomFactor2 = (imageRect, cropRect, rotation = 0, center2 = { x: 0.5, y: 0.5 }) => {
    const cx = center2.x > 0.5 ? 1 - center2.x : center2.x;
    const cy = center2.y > 0.5 ? 1 - center2.y : center2.y;
    const imageWidth = cx * 2 * imageRect.width;
    const imageHeight = cy * 2 * imageRect.height;
    const rotatedCropSize = getRotatedRectSize2(cropRect, rotation);
    return Math.max(rotatedCropSize.width / imageWidth, rotatedCropSize.height / imageHeight);
  };
  var getCenteredCropRect2 = (container, aspectRatio) => {
    let width2 = container.width;
    let height2 = width2 * aspectRatio;
    if (height2 > container.height) {
      height2 = container.height;
      width2 = height2 / aspectRatio;
    }
    const x = (container.width - width2) * 0.5;
    const y = (container.height - height2) * 0.5;
    return {
      x,
      y,
      width: width2,
      height: height2
    };
  };
  var calculateCanvasSize2 = (image, canvasAspectRatio, zoom = 1) => {
    const imageAspectRatio = image.height / image.width;
    let canvasWidth = 1;
    let canvasHeight = canvasAspectRatio;
    let imgWidth = 1;
    let imgHeight = imageAspectRatio;
    if (imgHeight > canvasHeight) {
      imgHeight = canvasHeight;
      imgWidth = imgHeight / imageAspectRatio;
    }
    const scalar = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const width2 = image.width / (zoom * scalar * imgWidth);
    const height2 = width2 * canvasAspectRatio;
    return {
      width: width2,
      height: height2
    };
  };
  var canvasRelease = (canvas) => {
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1, 1);
  };
  var isFlipped = (flip) => flip && (flip.horizontal || flip.vertical);
  var getBitmap = (image, orientation, flip) => {
    if (orientation <= 1 && !isFlipped(flip)) {
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
      return image;
    }
    const canvas = document.createElement("canvas");
    const width2 = image.naturalWidth;
    const height2 = image.naturalHeight;
    const swapped = orientation >= 5 && orientation <= 8;
    if (swapped) {
      canvas.width = height2;
      canvas.height = width2;
    } else {
      canvas.width = width2;
      canvas.height = height2;
    }
    const ctx = canvas.getContext("2d");
    if (orientation) {
      ctx.transform.apply(ctx, getImageOrientationMatrix(width2, height2, orientation));
    }
    if (isFlipped(flip)) {
      const matrix = [1, 0, 0, 1, 0, 0];
      if (!swapped && flip.horizontal || swapped & flip.vertical) {
        matrix[0] = -1;
        matrix[4] = width2;
      }
      if (!swapped && flip.vertical || swapped && flip.horizontal) {
        matrix[3] = -1;
        matrix[5] = height2;
      }
      ctx.transform(...matrix);
    }
    ctx.drawImage(image, 0, 0, width2, height2);
    return canvas;
  };
  var imageToImageData = (imageElement, orientation, crop = {}, options = {}) => {
    const { canvasMemoryLimit, background = null } = options;
    const zoom = crop.zoom || 1;
    const bitmap = getBitmap(imageElement, orientation, crop.flip);
    const imageSize = {
      width: bitmap.width,
      height: bitmap.height
    };
    const aspectRatio = crop.aspectRatio || imageSize.height / imageSize.width;
    let canvasSize = calculateCanvasSize2(imageSize, aspectRatio, zoom);
    if (canvasMemoryLimit) {
      const requiredMemory = canvasSize.width * canvasSize.height;
      if (requiredMemory > canvasMemoryLimit) {
        const scalar = Math.sqrt(canvasMemoryLimit) / Math.sqrt(requiredMemory);
        imageSize.width = Math.floor(imageSize.width * scalar);
        imageSize.height = Math.floor(imageSize.height * scalar);
        canvasSize = calculateCanvasSize2(imageSize, aspectRatio, zoom);
      }
    }
    const canvas = document.createElement("canvas");
    const canvasCenter = {
      x: canvasSize.width * 0.5,
      y: canvasSize.height * 0.5
    };
    const stage = {
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      center: canvasCenter
    };
    const shouldLimit = typeof crop.scaleToFit === "undefined" || crop.scaleToFit;
    const scale = zoom * getImageRectZoomFactor2(
      imageSize,
      getCenteredCropRect2(stage, aspectRatio),
      crop.rotation,
      shouldLimit ? crop.center : { x: 0.5, y: 0.5 }
    );
    canvas.width = Math.round(canvasSize.width / scale);
    canvas.height = Math.round(canvasSize.height / scale);
    canvasCenter.x /= scale;
    canvasCenter.y /= scale;
    const imageOffset = {
      x: canvasCenter.x - imageSize.width * (crop.center ? crop.center.x : 0.5),
      y: canvasCenter.y - imageSize.height * (crop.center ? crop.center.y : 0.5)
    };
    const ctx = canvas.getContext("2d");
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.translate(canvasCenter.x, canvasCenter.y);
    ctx.rotate(crop.rotation || 0);
    ctx.drawImage(
      bitmap,
      imageOffset.x - canvasCenter.x,
      imageOffset.y - canvasCenter.y,
      imageSize.width,
      imageSize.height
    );
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvasRelease(canvas);
    return imageData;
  };
  var IS_BROWSER3 = (() => typeof window !== "undefined" && typeof window.document !== "undefined")();
  if (IS_BROWSER3) {
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value: function(callback, type, quality) {
          var dataURL = this.toDataURL(type, quality).split(",")[1];
          setTimeout(function() {
            var binStr = atob(dataURL);
            var len = binStr.length;
            var arr = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }
            callback(new Blob([arr], { type: type || "image/png" }));
          });
        }
      });
    }
  }
  var canvasToBlob = (canvas, options, beforeCreateBlob = null) => new Promise((resolve) => {
    const promisedImage = beforeCreateBlob ? beforeCreateBlob(canvas) : canvas;
    Promise.resolve(promisedImage).then((canvas2) => {
      canvas2.toBlob(resolve, options.type, options.quality);
    });
  });
  var vectorMultiply2 = (v, amount) => createVector$12(v.x * amount, v.y * amount);
  var vectorAdd2 = (a, b) => createVector$12(a.x + b.x, a.y + b.y);
  var vectorNormalize2 = (v) => {
    const l = Math.sqrt(v.x * v.x + v.y * v.y);
    if (l === 0) {
      return {
        x: 0,
        y: 0
      };
    }
    return createVector$12(v.x / l, v.y / l);
  };
  var vectorRotate2 = (v, radians, origin) => {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const t = createVector$12(v.x - origin.x, v.y - origin.y);
    return createVector$12(origin.x + cos * t.x - sin * t.y, origin.y + sin * t.x + cos * t.y);
  };
  var createVector$12 = (x = 0, y = 0) => ({ x, y });
  var getMarkupValue2 = (value, size, scalar = 1, axis) => {
    if (typeof value === "string") {
      return parseFloat(value) * scalar;
    }
    if (typeof value === "number") {
      return value * (axis ? size[axis] : Math.min(size.width, size.height));
    }
    return;
  };
  var getMarkupStyles2 = (markup, size, scale) => {
    const lineStyle = markup.borderStyle || markup.lineStyle || "solid";
    const fill = markup.backgroundColor || markup.fontColor || "transparent";
    const stroke = markup.borderColor || markup.lineColor || "transparent";
    const strokeWidth = getMarkupValue2(markup.borderWidth || markup.lineWidth, size, scale);
    const lineCap = markup.lineCap || "round";
    const lineJoin = markup.lineJoin || "round";
    const dashes = typeof lineStyle === "string" ? "" : lineStyle.map((v) => getMarkupValue2(v, size, scale)).join(",");
    const opacity = markup.opacity || 1;
    return {
      "stroke-linecap": lineCap,
      "stroke-linejoin": lineJoin,
      "stroke-width": strokeWidth || 0,
      "stroke-dasharray": dashes,
      stroke,
      fill,
      opacity
    };
  };
  var isDefined3 = (value) => value != null;
  var getMarkupRect2 = (rect, size, scalar = 1) => {
    let left = getMarkupValue2(rect.x, size, scalar, "width") || getMarkupValue2(rect.left, size, scalar, "width");
    let top = getMarkupValue2(rect.y, size, scalar, "height") || getMarkupValue2(rect.top, size, scalar, "height");
    let width2 = getMarkupValue2(rect.width, size, scalar, "width");
    let height2 = getMarkupValue2(rect.height, size, scalar, "height");
    let right = getMarkupValue2(rect.right, size, scalar, "width");
    let bottom = getMarkupValue2(rect.bottom, size, scalar, "height");
    if (!isDefined3(top)) {
      if (isDefined3(height2) && isDefined3(bottom)) {
        top = size.height - height2 - bottom;
      } else {
        top = bottom;
      }
    }
    if (!isDefined3(left)) {
      if (isDefined3(width2) && isDefined3(right)) {
        left = size.width - width2 - right;
      } else {
        left = right;
      }
    }
    if (!isDefined3(width2)) {
      if (isDefined3(left) && isDefined3(right)) {
        width2 = size.width - left - right;
      } else {
        width2 = 0;
      }
    }
    if (!isDefined3(height2)) {
      if (isDefined3(top) && isDefined3(bottom)) {
        height2 = size.height - top - bottom;
      } else {
        height2 = 0;
      }
    }
    return {
      x: left || 0,
      y: top || 0,
      width: width2 || 0,
      height: height2 || 0
    };
  };
  var pointsToPathShape2 = (points) => points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  var setAttributes2 = (element, attr2) => Object.keys(attr2).forEach((key) => element.setAttribute(key, attr2[key]));
  var ns3 = "http://www.w3.org/2000/svg";
  var svg2 = (tag, attr2) => {
    const element = document.createElementNS(ns3, tag);
    if (attr2) {
      setAttributes2(element, attr2);
    }
    return element;
  };
  var updateRect3 = (element) => setAttributes2(element, {
    ...element.rect,
    ...element.styles
  });
  var updateEllipse2 = (element) => {
    const cx = element.rect.x + element.rect.width * 0.5;
    const cy = element.rect.y + element.rect.height * 0.5;
    const rx = element.rect.width * 0.5;
    const ry = element.rect.height * 0.5;
    return setAttributes2(element, {
      cx,
      cy,
      rx,
      ry,
      ...element.styles
    });
  };
  var IMAGE_FIT_STYLE2 = {
    contain: "xMidYMid meet",
    cover: "xMidYMid slice"
  };
  var updateImage2 = (element, markup) => {
    setAttributes2(element, {
      ...element.rect,
      ...element.styles,
      preserveAspectRatio: IMAGE_FIT_STYLE2[markup.fit] || "none"
    });
  };
  var TEXT_ANCHOR2 = {
    left: "start",
    center: "middle",
    right: "end"
  };
  var updateText2 = (element, markup, size, scale) => {
    const fontSize = getMarkupValue2(markup.fontSize, size, scale);
    const fontFamily = markup.fontFamily || "sans-serif";
    const fontWeight = markup.fontWeight || "normal";
    const textAlign = TEXT_ANCHOR2[markup.textAlign] || "start";
    setAttributes2(element, {
      ...element.rect,
      ...element.styles,
      "stroke-width": 0,
      "font-weight": fontWeight,
      "font-size": fontSize,
      "font-family": fontFamily,
      "text-anchor": textAlign
    });
    if (element.text !== markup.text) {
      element.text = markup.text;
      element.textContent = markup.text.length ? markup.text : " ";
    }
  };
  var updateLine2 = (element, markup, size, scale) => {
    setAttributes2(element, {
      ...element.rect,
      ...element.styles,
      fill: "none"
    });
    const line = element.childNodes[0];
    const begin = element.childNodes[1];
    const end = element.childNodes[2];
    const origin = element.rect;
    const target = {
      x: element.rect.x + element.rect.width,
      y: element.rect.y + element.rect.height
    };
    setAttributes2(line, {
      x1: origin.x,
      y1: origin.y,
      x2: target.x,
      y2: target.y
    });
    if (!markup.lineDecoration) return;
    begin.style.display = "none";
    end.style.display = "none";
    const v = vectorNormalize2({
      x: target.x - origin.x,
      y: target.y - origin.y
    });
    const l = getMarkupValue2(0.05, size, scale);
    if (markup.lineDecoration.indexOf("arrow-begin") !== -1) {
      const arrowBeginRotationPoint = vectorMultiply2(v, l);
      const arrowBeginCenter = vectorAdd2(origin, arrowBeginRotationPoint);
      const arrowBeginA = vectorRotate2(origin, 2, arrowBeginCenter);
      const arrowBeginB = vectorRotate2(origin, -2, arrowBeginCenter);
      setAttributes2(begin, {
        style: "display:block;",
        d: `M${arrowBeginA.x},${arrowBeginA.y} L${origin.x},${origin.y} L${arrowBeginB.x},${arrowBeginB.y}`
      });
    }
    if (markup.lineDecoration.indexOf("arrow-end") !== -1) {
      const arrowEndRotationPoint = vectorMultiply2(v, -l);
      const arrowEndCenter = vectorAdd2(target, arrowEndRotationPoint);
      const arrowEndA = vectorRotate2(target, 2, arrowEndCenter);
      const arrowEndB = vectorRotate2(target, -2, arrowEndCenter);
      setAttributes2(end, {
        style: "display:block;",
        d: `M${arrowEndA.x},${arrowEndA.y} L${target.x},${target.y} L${arrowEndB.x},${arrowEndB.y}`
      });
    }
  };
  var updatePath2 = (element, markup, size, scale) => {
    setAttributes2(element, {
      ...element.styles,
      fill: "none",
      d: pointsToPathShape2(
        markup.points.map((point) => ({
          x: getMarkupValue2(point.x, size, scale, "width"),
          y: getMarkupValue2(point.y, size, scale, "height")
        }))
      )
    });
  };
  var createShape2 = (node) => (markup) => svg2(node, { id: markup.id });
  var createImage2 = (markup) => {
    const shape = svg2("image", {
      id: markup.id,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      opacity: "0"
    });
    shape.onload = () => {
      shape.setAttribute("opacity", markup.opacity || 1);
    };
    shape.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", markup.src);
    return shape;
  };
  var createLine2 = (markup) => {
    const shape = svg2("g", {
      id: markup.id,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    });
    const line = svg2("line");
    shape.appendChild(line);
    const begin = svg2("path");
    shape.appendChild(begin);
    const end = svg2("path");
    shape.appendChild(end);
    return shape;
  };
  var CREATE_TYPE_ROUTES2 = {
    image: createImage2,
    rect: createShape2("rect"),
    ellipse: createShape2("ellipse"),
    text: createShape2("text"),
    path: createShape2("path"),
    line: createLine2
  };
  var UPDATE_TYPE_ROUTES2 = {
    rect: updateRect3,
    ellipse: updateEllipse2,
    image: updateImage2,
    text: updateText2,
    path: updatePath2,
    line: updateLine2
  };
  var createMarkupByType2 = (type, markup) => CREATE_TYPE_ROUTES2[type](markup);
  var updateMarkupByType2 = (element, type, markup, size, scale) => {
    if (type !== "path") {
      element.rect = getMarkupRect2(markup, size, scale);
    }
    element.styles = getMarkupStyles2(markup, size, scale);
    UPDATE_TYPE_ROUTES2[type](element, markup, size, scale);
  };
  var sortMarkupByZIndex2 = (a, b) => {
    if (a[1].zIndex > b[1].zIndex) {
      return 1;
    }
    if (a[1].zIndex < b[1].zIndex) {
      return -1;
    }
    return 0;
  };
  var cropSVG = (blob2, crop = {}, markup, options) => new Promise((resolve) => {
    const { background = null } = options;
    const fr = new FileReader();
    fr.onloadend = () => {
      const text2 = fr.result;
      const original = document.createElement("div");
      original.style.cssText = `position:absolute;pointer-events:none;width:0;height:0;visibility:hidden;`;
      original.innerHTML = text2;
      const originalNode = original.querySelector("svg");
      document.body.appendChild(original);
      const bBox = originalNode.getBBox();
      original.parentNode.removeChild(original);
      const titleNode = original.querySelector("title");
      const viewBoxAttribute = originalNode.getAttribute("viewBox") || "";
      const widthAttribute = originalNode.getAttribute("width") || "";
      const heightAttribute = originalNode.getAttribute("height") || "";
      let width2 = parseFloat(widthAttribute) || null;
      let height2 = parseFloat(heightAttribute) || null;
      const widthUnits = (widthAttribute.match(/[a-z]+/) || [])[0] || "";
      const heightUnits = (heightAttribute.match(/[a-z]+/) || [])[0] || "";
      const viewBoxList = viewBoxAttribute.split(" ").map(parseFloat);
      const viewBox = viewBoxList.length ? {
        x: viewBoxList[0],
        y: viewBoxList[1],
        width: viewBoxList[2],
        height: viewBoxList[3]
      } : bBox;
      let imageWidth = width2 != null ? width2 : viewBox.width;
      let imageHeight = height2 != null ? height2 : viewBox.height;
      originalNode.style.overflow = "visible";
      originalNode.setAttribute("width", imageWidth);
      originalNode.setAttribute("height", imageHeight);
      let markupSVG = "";
      if (markup && markup.length) {
        const size = {
          width: imageWidth,
          height: imageHeight
        };
        markupSVG = markup.sort(sortMarkupByZIndex2).reduce((prev, shape) => {
          const el = createMarkupByType2(shape[0], shape[1]);
          updateMarkupByType2(el, shape[0], shape[1], size);
          el.removeAttribute("id");
          if (el.getAttribute("opacity") === 1) {
            el.removeAttribute("opacity");
          }
          return prev + "\n" + el.outerHTML + "\n";
        }, "");
        markupSVG = `

<g>${markupSVG.replace(/&nbsp;/g, " ")}</g>

`;
      }
      const aspectRatio = crop.aspectRatio || imageHeight / imageWidth;
      const canvasWidth = imageWidth;
      const canvasHeight = canvasWidth * aspectRatio;
      const shouldLimit = typeof crop.scaleToFit === "undefined" || crop.scaleToFit;
      const cropCenterX = crop.center ? crop.center.x : 0.5;
      const cropCenterY = crop.center ? crop.center.y : 0.5;
      const canvasZoomFactor = getImageRectZoomFactor2(
        {
          width: imageWidth,
          height: imageHeight
        },
        getCenteredCropRect2(
          {
            width: canvasWidth,
            height: canvasHeight
          },
          aspectRatio
        ),
        crop.rotation,
        shouldLimit ? { x: cropCenterX, y: cropCenterY } : {
          x: 0.5,
          y: 0.5
        }
      );
      const scale = crop.zoom * canvasZoomFactor;
      const rotation = crop.rotation * (180 / Math.PI);
      const canvasCenter = {
        x: canvasWidth * 0.5,
        y: canvasHeight * 0.5
      };
      const imageOffset = {
        x: canvasCenter.x - imageWidth * cropCenterX,
        y: canvasCenter.y - imageHeight * cropCenterY
      };
      const cropTransforms = [
        // rotate
        `rotate(${rotation} ${canvasCenter.x} ${canvasCenter.y})`,
        // scale
        `translate(${canvasCenter.x} ${canvasCenter.y})`,
        `scale(${scale})`,
        `translate(${-canvasCenter.x} ${-canvasCenter.y})`,
        // offset
        `translate(${imageOffset.x} ${imageOffset.y})`
      ];
      const cropFlipHorizontal = crop.flip && crop.flip.horizontal;
      const cropFlipVertical = crop.flip && crop.flip.vertical;
      const flipTransforms = [
        `scale(${cropFlipHorizontal ? -1 : 1} ${cropFlipVertical ? -1 : 1})`,
        `translate(${cropFlipHorizontal ? -imageWidth : 0} ${cropFlipVertical ? -imageHeight : 0})`
      ];
      const transformed = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvasWidth}${widthUnits}" height="${canvasHeight}${heightUnits}" 
viewBox="0 0 ${canvasWidth} ${canvasHeight}" ${background ? 'style="background:' + background + '" ' : ""}
preserveAspectRatio="xMinYMin"
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns="http://www.w3.org/2000/svg">
<!-- Generated by PQINA - https://pqina.nl/ -->
<title>${titleNode ? titleNode.textContent : ""}</title>
<g transform="${cropTransforms.join(" ")}">
<g transform="${flipTransforms.join(" ")}">
${originalNode.outerHTML}${markupSVG}
</g>
</g>
</svg>`;
      resolve(transformed);
    };
    fr.readAsText(blob2);
  });
  var objectToImageData = (obj) => {
    let imageData;
    try {
      imageData = new ImageData(obj.width, obj.height);
    } catch (e) {
      const canvas = document.createElement("canvas");
      imageData = canvas.getContext("2d").createImageData(obj.width, obj.height);
    }
    imageData.data.set(obj.data);
    return imageData;
  };
  var TransformWorker = () => {
    const TRANSFORMS = { resize, filter };
    const applyTransforms = (transforms2, imageData) => {
      transforms2.forEach((transform2) => {
        imageData = TRANSFORMS[transform2.type](imageData, transform2.data);
      });
      return imageData;
    };
    const transform = (data3, cb) => {
      let transforms2 = data3.transforms;
      let filterTransform = null;
      transforms2.forEach((transform2) => {
        if (transform2.type === "filter") {
          filterTransform = transform2;
        }
      });
      if (filterTransform) {
        let resizeTransform = null;
        transforms2.forEach((transform2) => {
          if (transform2.type === "resize") {
            resizeTransform = transform2;
          }
        });
        if (resizeTransform) {
          resizeTransform.data.matrix = filterTransform.data;
          transforms2 = transforms2.filter((transform2) => transform2.type !== "filter");
        }
      }
      cb(applyTransforms(transforms2, data3.imageData));
    };
    self.onmessage = (e) => {
      transform(e.data.message, (response) => {
        self.postMessage({ id: e.data.id, message: response }, [response.data.buffer]);
      });
    };
    const br = 1;
    const bg = 1;
    const bb = 1;
    function applyFilterMatrix(index, data3, m2) {
      const ir = data3[index] / 255;
      const ig = data3[index + 1] / 255;
      const ib = data3[index + 2] / 255;
      const ia = data3[index + 3] / 255;
      const mr = ir * m2[0] + ig * m2[1] + ib * m2[2] + ia * m2[3] + m2[4];
      const mg = ir * m2[5] + ig * m2[6] + ib * m2[7] + ia * m2[8] + m2[9];
      const mb = ir * m2[10] + ig * m2[11] + ib * m2[12] + ia * m2[13] + m2[14];
      const ma = ir * m2[15] + ig * m2[16] + ib * m2[17] + ia * m2[18] + m2[19];
      const or = Math.max(0, mr * ma) + br * (1 - ma);
      const og = Math.max(0, mg * ma) + bg * (1 - ma);
      const ob = Math.max(0, mb * ma) + bb * (1 - ma);
      data3[index] = Math.max(0, Math.min(1, or)) * 255;
      data3[index + 1] = Math.max(0, Math.min(1, og)) * 255;
      data3[index + 2] = Math.max(0, Math.min(1, ob)) * 255;
    }
    const identityMatrix = self.JSON.stringify([
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ]);
    function isIdentityMatrix(filter2) {
      return self.JSON.stringify(filter2 || []) === identityMatrix;
    }
    function filter(imageData, matrix) {
      if (!matrix || isIdentityMatrix(matrix)) return imageData;
      const data3 = imageData.data;
      const l = data3.length;
      const m11 = matrix[0];
      const m12 = matrix[1];
      const m13 = matrix[2];
      const m14 = matrix[3];
      const m15 = matrix[4];
      const m21 = matrix[5];
      const m22 = matrix[6];
      const m23 = matrix[7];
      const m24 = matrix[8];
      const m25 = matrix[9];
      const m31 = matrix[10];
      const m32 = matrix[11];
      const m33 = matrix[12];
      const m34 = matrix[13];
      const m35 = matrix[14];
      const m41 = matrix[15];
      const m42 = matrix[16];
      const m43 = matrix[17];
      const m44 = matrix[18];
      const m45 = matrix[19];
      let index = 0, r = 0, g = 0, b = 0, a = 0, mr = 0, mg = 0, mb = 0, ma = 0, or = 0, og = 0, ob = 0;
      for (; index < l; index += 4) {
        r = data3[index] / 255;
        g = data3[index + 1] / 255;
        b = data3[index + 2] / 255;
        a = data3[index + 3] / 255;
        mr = r * m11 + g * m12 + b * m13 + a * m14 + m15;
        mg = r * m21 + g * m22 + b * m23 + a * m24 + m25;
        mb = r * m31 + g * m32 + b * m33 + a * m34 + m35;
        ma = r * m41 + g * m42 + b * m43 + a * m44 + m45;
        or = Math.max(0, mr * ma) + br * (1 - ma);
        og = Math.max(0, mg * ma) + bg * (1 - ma);
        ob = Math.max(0, mb * ma) + bb * (1 - ma);
        data3[index] = Math.max(0, Math.min(1, or)) * 255;
        data3[index + 1] = Math.max(0, Math.min(1, og)) * 255;
        data3[index + 2] = Math.max(0, Math.min(1, ob)) * 255;
      }
      return imageData;
    }
    function resize(imageData, data3) {
      let { mode = "contain", upscale = false, width: width2, height: height2, matrix } = data3;
      matrix = !matrix || isIdentityMatrix(matrix) ? null : matrix;
      if (!width2 && !height2) {
        return filter(imageData, matrix);
      }
      if (width2 === null) {
        width2 = height2;
      } else if (height2 === null) {
        height2 = width2;
      }
      if (mode !== "force") {
        let scalarWidth = width2 / imageData.width;
        let scalarHeight = height2 / imageData.height;
        let scalar = 1;
        if (mode === "cover") {
          scalar = Math.max(scalarWidth, scalarHeight);
        } else if (mode === "contain") {
          scalar = Math.min(scalarWidth, scalarHeight);
        }
        if (scalar > 1 && upscale === false) {
          return filter(imageData, matrix);
        }
        width2 = imageData.width * scalar;
        height2 = imageData.height * scalar;
      }
      const originWidth = imageData.width;
      const originHeight = imageData.height;
      const targetWidth = Math.round(width2);
      const targetHeight = Math.round(height2);
      const inputData = imageData.data;
      const outputData = new Uint8ClampedArray(targetWidth * targetHeight * 4);
      const ratioWidth = originWidth / targetWidth;
      const ratioHeight = originHeight / targetHeight;
      const ratioWidthHalf = Math.ceil(ratioWidth * 0.5);
      const ratioHeightHalf = Math.ceil(ratioHeight * 0.5);
      for (let j = 0; j < targetHeight; j++) {
        for (let i = 0; i < targetWidth; i++) {
          let x2 = (i + j * targetWidth) * 4;
          let weight = 0;
          let weights = 0;
          let weightsAlpha = 0;
          let r = 0;
          let g = 0;
          let b = 0;
          let a = 0;
          let centerY = (j + 0.5) * ratioHeight;
          for (let yy = Math.floor(j * ratioHeight); yy < (j + 1) * ratioHeight; yy++) {
            let dy = Math.abs(centerY - (yy + 0.5)) / ratioHeightHalf;
            let centerX = (i + 0.5) * ratioWidth;
            let w0 = dy * dy;
            for (let xx = Math.floor(i * ratioWidth); xx < (i + 1) * ratioWidth; xx++) {
              let dx = Math.abs(centerX - (xx + 0.5)) / ratioWidthHalf;
              let w = Math.sqrt(w0 + dx * dx);
              if (w >= -1 && w <= 1) {
                weight = 2 * w * w * w - 3 * w * w + 1;
                if (weight > 0) {
                  dx = 4 * (xx + yy * originWidth);
                  let ref = inputData[dx + 3];
                  a += weight * ref;
                  weightsAlpha += weight;
                  if (ref < 255) {
                    weight = weight * ref / 250;
                  }
                  r += weight * inputData[dx];
                  g += weight * inputData[dx + 1];
                  b += weight * inputData[dx + 2];
                  weights += weight;
                }
              }
            }
          }
          outputData[x2] = r / weights;
          outputData[x2 + 1] = g / weights;
          outputData[x2 + 2] = b / weights;
          outputData[x2 + 3] = a / weightsAlpha;
          matrix && applyFilterMatrix(x2, outputData, matrix);
        }
      }
      return {
        data: outputData,
        width: targetWidth,
        height: targetHeight
      };
    }
  };
  var correctOrientation = (view, offset) => {
    if (view.getUint32(offset + 4, false) !== 1165519206) return;
    offset += 4;
    const intelByteAligned = view.getUint16(offset += 6, false) === 18761;
    offset += view.getUint32(offset + 4, intelByteAligned);
    const tags = view.getUint16(offset, intelByteAligned);
    offset += 2;
    for (let i = 0; i < tags; i++) {
      if (view.getUint16(offset + i * 12, intelByteAligned) === 274) {
        view.setUint16(offset + i * 12 + 8, 1, intelByteAligned);
        return true;
      }
    }
    return false;
  };
  var readData = (data3) => {
    const view = new DataView(data3);
    if (view.getUint16(0) !== 65496) return null;
    let offset = 2;
    let marker;
    let markerLength;
    let orientationCorrected = false;
    while (offset < view.byteLength) {
      marker = view.getUint16(offset, false);
      markerLength = view.getUint16(offset + 2, false) + 2;
      const isData = marker >= 65504 && marker <= 65519 || marker === 65534;
      if (!isData) {
        break;
      }
      if (!orientationCorrected) {
        orientationCorrected = correctOrientation(view, offset, markerLength);
      }
      if (offset + markerLength > view.byteLength) {
        break;
      }
      offset += markerLength;
    }
    return data3.slice(0, offset);
  };
  var getImageHead = (file2) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(readData(reader.result) || null);
    reader.readAsArrayBuffer(file2.slice(0, 256 * 1024));
  });
  var getBlobBuilder2 = () => {
    return window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  };
  var createBlob2 = (arrayBuffer, mimeType) => {
    const BB = getBlobBuilder2();
    if (BB) {
      const bb = new BB();
      bb.append(arrayBuffer);
      return bb.getBlob(mimeType);
    }
    return new Blob([arrayBuffer], {
      type: mimeType
    });
  };
  var getUniqueId2 = () => Math.random().toString(36).substr(2, 9);
  var createWorker2 = (fn2) => {
    const workerBlob = new Blob(["(", fn2.toString(), ")()"], { type: "application/javascript" });
    const workerURL = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerURL);
    const trips = [];
    return {
      transfer: () => {
      },
      // (message, cb) => {}
      post: (message, cb, transferList) => {
        const id = getUniqueId2();
        trips[id] = cb;
        worker.onmessage = (e) => {
          const cb2 = trips[e.data.id];
          if (!cb2) return;
          cb2(e.data.message);
          delete trips[e.data.id];
        };
        worker.postMessage(
          {
            id,
            message
          },
          transferList
        );
      },
      terminate: () => {
        worker.terminate();
        URL.revokeObjectURL(workerURL);
      }
    };
  };
  var loadImage4 = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
  var chain = (funcs) => funcs.reduce(
    (promise, func) => promise.then((result) => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  );
  var canvasApplyMarkup = (canvas, markup) => new Promise((resolve) => {
    const size = {
      width: canvas.width,
      height: canvas.height
    };
    const ctx = canvas.getContext("2d");
    const drawers = markup.sort(sortMarkupByZIndex2).map(
      (item2) => () => new Promise((resolve2) => {
        const result = TYPE_DRAW_ROUTES[item2[0]](ctx, size, item2[1], resolve2);
        if (result) resolve2();
      })
    );
    chain(drawers).then(() => resolve(canvas));
  });
  var applyMarkupStyles = (ctx, styles2) => {
    ctx.beginPath();
    ctx.lineCap = styles2["stroke-linecap"];
    ctx.lineJoin = styles2["stroke-linejoin"];
    ctx.lineWidth = styles2["stroke-width"];
    if (styles2["stroke-dasharray"].length) {
      ctx.setLineDash(styles2["stroke-dasharray"].split(","));
    }
    ctx.fillStyle = styles2["fill"];
    ctx.strokeStyle = styles2["stroke"];
    ctx.globalAlpha = styles2.opacity || 1;
  };
  var drawMarkupStyles = (ctx) => {
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  var drawRect = (ctx, size, markup) => {
    const rect = getMarkupRect2(markup, size);
    const styles2 = getMarkupStyles2(markup, size);
    applyMarkupStyles(ctx, styles2);
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    drawMarkupStyles(ctx, styles2);
    return true;
  };
  var drawEllipse = (ctx, size, markup) => {
    const rect = getMarkupRect2(markup, size);
    const styles2 = getMarkupStyles2(markup, size);
    applyMarkupStyles(ctx, styles2);
    const x = rect.x, y = rect.y, w = rect.width, h = rect.height, kappa = 0.5522848, ox = w / 2 * kappa, oy = h / 2 * kappa, xe = x + w, ye = y + h, xm = x + w / 2, ym = y + h / 2;
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    drawMarkupStyles(ctx, styles2);
    return true;
  };
  var drawImage = (ctx, size, markup, done) => {
    const rect = getMarkupRect2(markup, size);
    const styles2 = getMarkupStyles2(markup, size);
    applyMarkupStyles(ctx, styles2);
    const image = new Image();
    const isCrossOriginImage = new URL(markup.src, window.location.href).origin !== window.location.origin;
    if (isCrossOriginImage) image.crossOrigin = "";
    image.onload = () => {
      if (markup.fit === "cover") {
        const ar = rect.width / rect.height;
        const width2 = ar > 1 ? image.width : image.height * ar;
        const height2 = ar > 1 ? image.width / ar : image.height;
        const x = image.width * 0.5 - width2 * 0.5;
        const y = image.height * 0.5 - height2 * 0.5;
        ctx.drawImage(image, x, y, width2, height2, rect.x, rect.y, rect.width, rect.height);
      } else if (markup.fit === "contain") {
        const scalar = Math.min(rect.width / image.width, rect.height / image.height);
        const width2 = scalar * image.width;
        const height2 = scalar * image.height;
        const x = rect.x + rect.width * 0.5 - width2 * 0.5;
        const y = rect.y + rect.height * 0.5 - height2 * 0.5;
        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, width2, height2);
      } else {
        ctx.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          rect.x,
          rect.y,
          rect.width,
          rect.height
        );
      }
      drawMarkupStyles(ctx, styles2);
      done();
    };
    image.src = markup.src;
  };
  var drawText = (ctx, size, markup) => {
    const rect = getMarkupRect2(markup, size);
    const styles2 = getMarkupStyles2(markup, size);
    applyMarkupStyles(ctx, styles2);
    const fontSize = getMarkupValue2(markup.fontSize, size);
    const fontFamily = markup.fontFamily || "sans-serif";
    const fontWeight = markup.fontWeight || "normal";
    const textAlign = markup.textAlign || "left";
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign;
    ctx.fillText(markup.text, rect.x, rect.y);
    drawMarkupStyles(ctx, styles2);
    return true;
  };
  var drawPath = (ctx, size, markup) => {
    const styles2 = getMarkupStyles2(markup, size);
    applyMarkupStyles(ctx, styles2);
    ctx.beginPath();
    const points = markup.points.map((point) => ({
      x: getMarkupValue2(point.x, size, 1, "width"),
      y: getMarkupValue2(point.y, size, 1, "height")
    }));
    ctx.moveTo(points[0].x, points[0].y);
    const l = points.length;
    for (let i = 1; i < l; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    drawMarkupStyles(ctx, styles2);
    return true;
  };
  var drawLine = (ctx, size, markup) => {
    const rect = getMarkupRect2(markup, size);
    const styles2 = getMarkupStyles2(markup, size);
    applyMarkupStyles(ctx, styles2);
    ctx.beginPath();
    const origin = {
      x: rect.x,
      y: rect.y
    };
    const target = {
      x: rect.x + rect.width,
      y: rect.y + rect.height
    };
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(target.x, target.y);
    const v = vectorNormalize2({
      x: target.x - origin.x,
      y: target.y - origin.y
    });
    const l = 0.04 * Math.min(size.width, size.height);
    if (markup.lineDecoration.indexOf("arrow-begin") !== -1) {
      const arrowBeginRotationPoint = vectorMultiply2(v, l);
      const arrowBeginCenter = vectorAdd2(origin, arrowBeginRotationPoint);
      const arrowBeginA = vectorRotate2(origin, 2, arrowBeginCenter);
      const arrowBeginB = vectorRotate2(origin, -2, arrowBeginCenter);
      ctx.moveTo(arrowBeginA.x, arrowBeginA.y);
      ctx.lineTo(origin.x, origin.y);
      ctx.lineTo(arrowBeginB.x, arrowBeginB.y);
    }
    if (markup.lineDecoration.indexOf("arrow-end") !== -1) {
      const arrowEndRotationPoint = vectorMultiply2(v, -l);
      const arrowEndCenter = vectorAdd2(target, arrowEndRotationPoint);
      const arrowEndA = vectorRotate2(target, 2, arrowEndCenter);
      const arrowEndB = vectorRotate2(target, -2, arrowEndCenter);
      ctx.moveTo(arrowEndA.x, arrowEndA.y);
      ctx.lineTo(target.x, target.y);
      ctx.lineTo(arrowEndB.x, arrowEndB.y);
    }
    drawMarkupStyles(ctx, styles2);
    return true;
  };
  var TYPE_DRAW_ROUTES = {
    rect: drawRect,
    ellipse: drawEllipse,
    image: drawImage,
    text: drawText,
    line: drawLine,
    path: drawPath
  };
  var imageDataToCanvas = (imageData) => {
    const image = document.createElement("canvas");
    image.width = imageData.width;
    image.height = imageData.height;
    const ctx = image.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
    return image;
  };
  var transformImage = (file2, instructions, options = {}) => new Promise((resolve, reject) => {
    if (!file2 || !isImage$1(file2)) return reject({ status: "not an image file", file: file2 });
    const { stripImageHead, beforeCreateBlob, afterCreateBlob, canvasMemoryLimit } = options;
    const { crop, size, filter, markup, output } = instructions;
    const orientation = instructions.image && instructions.image.orientation ? Math.max(1, Math.min(8, instructions.image.orientation)) : null;
    const qualityAsPercentage = output && output.quality;
    const quality = qualityAsPercentage === null ? null : qualityAsPercentage / 100;
    const type = output && output.type || null;
    const background = output && output.background || null;
    const transforms2 = [];
    if (size && (typeof size.width === "number" || typeof size.height === "number")) {
      transforms2.push({ type: "resize", data: size });
    }
    if (filter && filter.length === 20) {
      transforms2.push({ type: "filter", data: filter });
    }
    const resolveWithBlob = (blob2) => {
      const promisedBlob = afterCreateBlob ? afterCreateBlob(blob2) : blob2;
      Promise.resolve(promisedBlob).then(resolve);
    };
    const toBlob = (imageData, options2) => {
      const canvas = imageDataToCanvas(imageData);
      const promisedCanvas = markup.length ? canvasApplyMarkup(canvas, markup) : canvas;
      Promise.resolve(promisedCanvas).then((canvas2) => {
        canvasToBlob(canvas2, options2, beforeCreateBlob).then((blob2) => {
          canvasRelease(canvas2);
          if (stripImageHead) return resolveWithBlob(blob2);
          getImageHead(file2).then((imageHead) => {
            if (imageHead !== null) {
              blob2 = new Blob([imageHead, blob2.slice(20)], { type: blob2.type });
            }
            resolveWithBlob(blob2);
          });
        }).catch(reject);
      });
    };
    if (/svg/.test(file2.type) && type === null) {
      return cropSVG(file2, crop, markup, { background }).then((text2) => {
        resolve(createBlob2(text2, "image/svg+xml"));
      });
    }
    const url = URL.createObjectURL(file2);
    loadImage4(url).then((image) => {
      URL.revokeObjectURL(url);
      const imageData = imageToImageData(image, orientation, crop, {
        canvasMemoryLimit,
        background
      });
      const outputFormat = {
        quality,
        type: type || file2.type
      };
      if (!transforms2.length) {
        return toBlob(imageData, outputFormat);
      }
      const worker = createWorker2(TransformWorker);
      worker.post(
        {
          transforms: transforms2,
          imageData
        },
        (response) => {
          toBlob(objectToImageData(response), outputFormat);
          worker.terminate();
        },
        [imageData.data.buffer]
      );
    }).catch(reject);
  });
  var MARKUP_RECT2 = ["x", "y", "left", "top", "right", "bottom", "width", "height"];
  var toOptionalFraction2 = (value) => typeof value === "string" && /%/.test(value) ? parseFloat(value) / 100 : value;
  var prepareMarkup2 = (markup) => {
    const [type, props] = markup;
    const rect = props.points ? {} : MARKUP_RECT2.reduce((prev, curr) => {
      prev[curr] = toOptionalFraction2(props[curr]);
      return prev;
    }, {});
    return [
      type,
      {
        zIndex: 0,
        ...props,
        ...rect
      }
    ];
  };
  var getImageSize4 = (file2) => new Promise((resolve, reject) => {
    const imageElement = new Image();
    imageElement.src = URL.createObjectURL(file2);
    const measure = () => {
      const width2 = imageElement.naturalWidth;
      const height2 = imageElement.naturalHeight;
      const hasSize = width2 && height2;
      if (!hasSize) return;
      URL.revokeObjectURL(imageElement.src);
      clearInterval(intervalId);
      resolve({ width: width2, height: height2 });
    };
    imageElement.onerror = (err) => {
      URL.revokeObjectURL(imageElement.src);
      clearInterval(intervalId);
      reject(err);
    };
    const intervalId = setInterval(measure, 1);
    measure();
  });
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value: function(cb, type, quality) {
          const canvas = this;
          setTimeout(() => {
            const dataURL = canvas.toDataURL(type, quality).split(",")[1];
            const binStr = atob(dataURL);
            let index = binStr.length;
            const data3 = new Uint8Array(index);
            while (index--) {
              data3[index] = binStr.charCodeAt(index);
            }
            cb(new Blob([data3], { type: type || "image/png" }));
          });
        }
      });
    }
  }
  var isBrowser10 = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isIOS = isBrowser10 && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var plugin9 = ({ addFilter: addFilter2, utils }) => {
    const { Type: Type2, forin: forin2, getFileFromBlob: getFileFromBlob2, isFile: isFile2 } = utils;
    const TRANSFORM_LIST = ["crop", "resize", "filter", "markup", "output"];
    const createVariantCreator = (updateMetadata) => (transform, file2, metadata) => transform(file2, updateMetadata ? updateMetadata(metadata) : metadata);
    const isDefaultCrop = (crop) => crop.aspectRatio === null && crop.rotation === 0 && crop.zoom === 1 && crop.center && crop.center.x === 0.5 && crop.center.y === 0.5 && crop.flip && crop.flip.horizontal === false && crop.flip.vertical === false;
    addFilter2(
      "SHOULD_PREPARE_OUTPUT",
      (shouldPrepareOutput, { query }) => new Promise((resolve) => {
        resolve(!query("IS_ASYNC"));
      })
    );
    const shouldTransformFile = (query, file2, item2) => new Promise((resolve) => {
      if (!query("GET_ALLOW_IMAGE_TRANSFORM") || item2.archived || !isFile2(file2) || !isImage3(file2)) {
        return resolve(false);
      }
      getImageSize4(file2).then(() => {
        const fn2 = query("GET_IMAGE_TRANSFORM_IMAGE_FILTER");
        if (fn2) {
          const filterResult = fn2(file2);
          if (filterResult == null) {
            return handleRevert(true);
          }
          if (typeof filterResult === "boolean") {
            return resolve(filterResult);
          }
          if (typeof filterResult.then === "function") {
            return filterResult.then(resolve);
          }
        }
        resolve(true);
      }).catch((err) => {
        resolve(false);
      });
    });
    addFilter2("DID_CREATE_ITEM", (item2, { query, dispatch }) => {
      if (!query("GET_ALLOW_IMAGE_TRANSFORM")) return;
      item2.extend(
        "requestPrepare",
        () => new Promise((resolve, reject) => {
          dispatch(
            "REQUEST_PREPARE_OUTPUT",
            {
              query: item2.id,
              item: item2,
              success: resolve,
              failure: reject
            },
            true
          );
        })
      );
    });
    addFilter2(
      "PREPARE_OUTPUT",
      (file2, { query, item: item2 }) => new Promise((resolve) => {
        shouldTransformFile(query, file2, item2).then((shouldTransform) => {
          if (!shouldTransform) return resolve(file2);
          const variants = [];
          if (query("GET_IMAGE_TRANSFORM_VARIANTS_INCLUDE_ORIGINAL")) {
            variants.push(
              () => new Promise((resolve2) => {
                resolve2({
                  name: query("GET_IMAGE_TRANSFORM_VARIANTS_ORIGINAL_NAME"),
                  file: file2
                });
              })
            );
          }
          if (query("GET_IMAGE_TRANSFORM_VARIANTS_INCLUDE_DEFAULT")) {
            variants.push(
              (transform2, file3, metadata) => new Promise((resolve2) => {
                transform2(file3, metadata).then(
                  (file4) => resolve2({
                    name: query(
                      "GET_IMAGE_TRANSFORM_VARIANTS_DEFAULT_NAME"
                    ),
                    file: file4
                  })
                );
              })
            );
          }
          const variantsDefinition = query("GET_IMAGE_TRANSFORM_VARIANTS") || {};
          forin2(variantsDefinition, (key, fn2) => {
            const createVariant = createVariantCreator(fn2);
            variants.push(
              (transform2, file3, metadata) => new Promise((resolve2) => {
                createVariant(transform2, file3, metadata).then(
                  (file4) => resolve2({ name: key, file: file4 })
                );
              })
            );
          });
          const qualityAsPercentage = query("GET_IMAGE_TRANSFORM_OUTPUT_QUALITY");
          const qualityMode = query("GET_IMAGE_TRANSFORM_OUTPUT_QUALITY_MODE");
          const quality = qualityAsPercentage === null ? null : qualityAsPercentage / 100;
          const type = query("GET_IMAGE_TRANSFORM_OUTPUT_MIME_TYPE");
          const clientTransforms = query("GET_IMAGE_TRANSFORM_CLIENT_TRANSFORMS") || TRANSFORM_LIST;
          item2.setMetadata(
            "output",
            {
              type,
              quality,
              client: clientTransforms
            },
            true
          );
          const transform = (file3, metadata) => new Promise((resolve2, reject) => {
            const filteredMetadata = { ...metadata };
            Object.keys(filteredMetadata).filter((instruction) => instruction !== "exif").forEach((instruction) => {
              if (clientTransforms.indexOf(instruction) === -1) {
                delete filteredMetadata[instruction];
              }
            });
            const { resize, exif, output, crop, filter, markup } = filteredMetadata;
            const instructions = {
              image: {
                orientation: exif ? exif.orientation : null
              },
              output: output && (output.type || typeof output.quality === "number" || output.background) ? {
                type: output.type,
                quality: typeof output.quality === "number" ? output.quality * 100 : null,
                background: output.background || query(
                  "GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR"
                ) || null
              } : void 0,
              size: resize && (resize.size.width || resize.size.height) ? {
                mode: resize.mode,
                upscale: resize.upscale,
                ...resize.size
              } : void 0,
              crop: crop && !isDefaultCrop(crop) ? {
                ...crop
              } : void 0,
              markup: markup && markup.length ? markup.map(prepareMarkup2) : [],
              filter
            };
            if (instructions.output) {
              const willChangeType = output.type ? (
                // type set
                output.type !== file3.type
              ) : (
                // type not set
                false
              );
              const canChangeQuality = /\/jpe?g$/.test(file3.type);
              const willChangeQuality = output.quality !== null ? (
                // quality set
                canChangeQuality && qualityMode === "always"
              ) : (
                // quality not set
                false
              );
              const willModifyImageData = !!(instructions.size || instructions.crop || instructions.filter || willChangeType || willChangeQuality);
              if (!willModifyImageData) return resolve2(file3);
            }
            const options = {
              beforeCreateBlob: query("GET_IMAGE_TRANSFORM_BEFORE_CREATE_BLOB"),
              afterCreateBlob: query("GET_IMAGE_TRANSFORM_AFTER_CREATE_BLOB"),
              canvasMemoryLimit: query("GET_IMAGE_TRANSFORM_CANVAS_MEMORY_LIMIT"),
              stripImageHead: query(
                "GET_IMAGE_TRANSFORM_OUTPUT_STRIP_IMAGE_HEAD"
              )
            };
            transformImage(file3, instructions, options).then((blob2) => {
              const out = getFileFromBlob2(
                blob2,
                // rename the original filename to match the mime type of the output image
                renameFileToMatchMimeType(
                  file3.name,
                  getValidOutputMimeType(blob2.type)
                )
              );
              resolve2(out);
            }).catch(reject);
          });
          const variantPromises = variants.map(
            (create2) => create2(transform, file2, item2.getMetadata())
          );
          Promise.all(variantPromises).then((files) => {
            resolve(
              files.length === 1 && files[0].name === null ? (
                // return the File object
                files[0].file
              ) : (
                // return an array of files { name:'name', file:File }
                files
              )
            );
          });
        });
      })
    );
    return {
      options: {
        allowImageTransform: [true, Type2.BOOLEAN],
        // filter images to transform
        imageTransformImageFilter: [null, Type2.FUNCTION],
        // null, 'image/jpeg', 'image/png'
        imageTransformOutputMimeType: [null, Type2.STRING],
        // null, 0 - 100
        imageTransformOutputQuality: [null, Type2.INT],
        // set to false to copy image exif data to output
        imageTransformOutputStripImageHead: [true, Type2.BOOLEAN],
        // only apply transforms in this list
        imageTransformClientTransforms: [null, Type2.ARRAY],
        // only apply output quality when a transform is required
        imageTransformOutputQualityMode: ["always", Type2.STRING],
        // 'always'
        // 'optional'
        // 'mismatch' (future feature, only applied if quality differs from input)
        // get image transform variants
        imageTransformVariants: [null, Type2.OBJECT],
        // should we post the default transformed file
        imageTransformVariantsIncludeDefault: [true, Type2.BOOLEAN],
        // which name to prefix the default transformed file with
        imageTransformVariantsDefaultName: [null, Type2.STRING],
        // should we post the original file
        imageTransformVariantsIncludeOriginal: [false, Type2.BOOLEAN],
        // which name to prefix the original file with
        imageTransformVariantsOriginalName: ["original_", Type2.STRING],
        // called before creating the blob, receives canvas, expects promise resolve with canvas
        imageTransformBeforeCreateBlob: [null, Type2.FUNCTION],
        // expects promise resolved with blob
        imageTransformAfterCreateBlob: [null, Type2.FUNCTION],
        // canvas memory limit
        imageTransformCanvasMemoryLimit: [isBrowser10 && isIOS ? 4096 * 4096 : null, Type2.INT],
        // background image of the output canvas
        imageTransformCanvasBackgroundColor: [null, Type2.STRING]
      }
    };
  };
  if (isBrowser10) {
    document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: plugin9 }));
  }
  var filepond_plugin_image_transform_esm_default = plugin9;

  // node_modules/filepond-plugin-image-validate-size/dist/filepond-plugin-image-validate-size.esm.js
  var isImage4 = (file2) => /^image/.test(file2.type);
  var getImageSize5 = (file2) => new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.src = URL.createObjectURL(file2);
    image.onerror = (err) => {
      clearInterval(intervalId);
      reject(err);
    };
    const intervalId = setInterval(() => {
      if (image.naturalWidth && image.naturalHeight) {
        clearInterval(intervalId);
        URL.revokeObjectURL(image.src);
        resolve({
          width: image.naturalWidth,
          height: image.naturalHeight
        });
      }
    }, 1);
  });
  var plugin10 = ({ addFilter: addFilter2, utils }) => {
    const { Type: Type2, replaceInString: replaceInString2, isFile: isFile2 } = utils;
    const validateFile = (file2, bounds, measure) => new Promise((resolve, reject) => {
      const onReceiveSize = ({ width: width2, height: height2 }) => {
        const {
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
          minResolution,
          maxResolution
        } = bounds;
        const resolution = width2 * height2;
        if (width2 < minWidth || height2 < minHeight) {
          reject("TOO_SMALL");
        } else if (width2 > maxWidth || height2 > maxHeight) {
          reject("TOO_BIG");
        } else if (minResolution !== null && resolution < minResolution) {
          reject("TOO_LOW_RES");
        } else if (maxResolution !== null && resolution > maxResolution) {
          reject("TOO_HIGH_RES");
        }
        resolve();
      };
      getImageSize5(file2).then(onReceiveSize).catch(() => {
        if (!measure) {
          reject();
          return;
        }
        measure(file2, bounds).then(onReceiveSize).catch(() => reject());
      });
    });
    addFilter2(
      "LOAD_FILE",
      (file2, { query }) => new Promise((resolve, reject) => {
        if (!isFile2(file2) || !isImage4(file2) || !query("GET_ALLOW_IMAGE_VALIDATE_SIZE")) {
          resolve(file2);
          return;
        }
        const bounds = {
          minWidth: query("GET_IMAGE_VALIDATE_SIZE_MIN_WIDTH"),
          minHeight: query("GET_IMAGE_VALIDATE_SIZE_MIN_HEIGHT"),
          maxWidth: query("GET_IMAGE_VALIDATE_SIZE_MAX_WIDTH"),
          maxHeight: query("GET_IMAGE_VALIDATE_SIZE_MAX_HEIGHT"),
          minResolution: query("GET_IMAGE_VALIDATE_SIZE_MIN_RESOLUTION"),
          maxResolution: query("GET_IMAGE_VALIDATE_SIZE_MAX_RESOLUTION")
        };
        const measure = query("GET_IMAGE_VALIDATE_SIZE_MEASURE");
        validateFile(file2, bounds, measure).then(() => {
          resolve(file2);
        }).catch((error2) => {
          const status = error2 ? {
            TOO_SMALL: {
              label: query(
                "GET_IMAGE_VALIDATE_SIZE_LABEL_IMAGE_SIZE_TOO_SMALL"
              ),
              details: query(
                "GET_IMAGE_VALIDATE_SIZE_LABEL_EXPECTED_MIN_SIZE"
              )
            },
            TOO_BIG: {
              label: query(
                "GET_IMAGE_VALIDATE_SIZE_LABEL_IMAGE_SIZE_TOO_BIG"
              ),
              details: query(
                "GET_IMAGE_VALIDATE_SIZE_LABEL_EXPECTED_MAX_SIZE"
              )
            },
            TOO_LOW_RES: {
              label: query(
                "GET_IMAGE_VALIDATE_SIZE_LABEL_IMAGE_RESOLUTION_TOO_LOW"
              ),
              details: query(
                "GET_IMAGE_VALIDATE_SIZE_LABEL_EXPECTED_MIN_RESOLUTION"
              )
            },
            TOO_HIGH_RES: {
              label: query(
                "GET_IMAGE_VALIDATE_SIZE_LABEL_IMAGE_RESOLUTION_TOO_HIGH"
              ),
              details: query(
                "GET_IMAGE_VALIDATE_SIZE_LABEL_EXPECTED_MAX_RESOLUTION"
              )
            }
          }[error2] : {
            label: query("GET_IMAGE_VALIDATE_SIZE_LABEL_FORMAT_ERROR"),
            details: file2.type
          };
          reject({
            status: {
              main: status.label,
              sub: error2 ? replaceInString2(status.details, bounds) : status.details
            }
          });
        });
      })
    );
    return {
      // default options
      options: {
        // Enable or disable file type validation
        allowImageValidateSize: [true, Type2.BOOLEAN],
        // Error thrown when image can not be loaded
        imageValidateSizeLabelFormatError: [
          "Image type not supported",
          Type2.STRING
        ],
        // Custom function to use as image measure
        imageValidateSizeMeasure: [null, Type2.FUNCTION],
        // Required amount of pixels in the image
        imageValidateSizeMinResolution: [null, Type2.INT],
        imageValidateSizeMaxResolution: [null, Type2.INT],
        imageValidateSizeLabelImageResolutionTooLow: [
          "Resolution is too low",
          Type2.STRING
        ],
        imageValidateSizeLabelImageResolutionTooHigh: [
          "Resolution is too high",
          Type2.STRING
        ],
        imageValidateSizeLabelExpectedMinResolution: [
          "Minimum resolution is {minResolution}",
          Type2.STRING
        ],
        imageValidateSizeLabelExpectedMaxResolution: [
          "Maximum resolution is {maxResolution}",
          Type2.STRING
        ],
        // Required dimensions
        imageValidateSizeMinWidth: [1, Type2.INT],
        // needs to be at least one pixel
        imageValidateSizeMinHeight: [1, Type2.INT],
        imageValidateSizeMaxWidth: [65535, Type2.INT],
        // maximum size of JPEG, fine for now I guess
        imageValidateSizeMaxHeight: [65535, Type2.INT],
        // Label to show when an image is too small or image is too big
        imageValidateSizeLabelImageSizeTooSmall: [
          "Image is too small",
          Type2.STRING
        ],
        imageValidateSizeLabelImageSizeTooBig: ["Image is too big", Type2.STRING],
        imageValidateSizeLabelExpectedMinSize: [
          "Minimum size is {minWidth} \xD7 {minHeight}",
          Type2.STRING
        ],
        imageValidateSizeLabelExpectedMaxSize: [
          "Maximum size is {maxWidth} \xD7 {maxHeight}",
          Type2.STRING
        ]
      }
    };
  };
  var isBrowser11 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser11) {
    document.dispatchEvent(
      new CustomEvent("FilePond:pluginloaded", { detail: plugin10 })
    );
  }
  var filepond_plugin_image_validate_size_esm_default = plugin10;

  // src/utils/isString.js
  var isString_default = (v) => {
    return typeof v == "string";
  };

  // src/utils/getGlobalFn.js
  var getGlobalFn_default = (fn2) => fn2.split(".").reduce((r, p) => r[p], window);

  // src/utils/replaceCallbacks.js
  var replaceCallbacks = (obj) => {
    if (isString_default(obj)) {
      obj = obj[0] == "{" ? JSON.parse(obj) : getGlobalFn_default(obj);
    }
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v == "object") {
        const fn2 = v["__fn"];
        if (isString_default(fn2)) {
          obj[k] = getGlobalFn_default(fn2);
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

  // src/classes/FilePondInput.js
  registerPlugin(
    filepond_plugin_file_validate_type_esm_default,
    filepond_plugin_file_validate_size_esm_default,
    filepond_plugin_file_metadata_esm_default,
    filepond_plugin_file_poster_esm_default,
    filepond_plugin_image_exif_orientation_esm_default,
    filepond_plugin_image_preview_esm_default,
    filepond_plugin_image_crop_esm_default,
    filepond_plugin_image_resize_esm_default,
    filepond_plugin_image_transform_esm_default,
    filepond_plugin_image_validate_size_esm_default
  );
  var FilePondInput = class extends FormidableElement_default {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
      return this.querySelector("input");
    }
    created() {
      const el = this.el;
      this.config = Object.assign(
        {
          credits: false
        },
        this.config
      );
      if (this.dataset.name) {
        this.config["name"] = el.getAttribute("name");
      }
      const renamer = this.config["fileRenameFunction"];
      if (typeof renamer === "string") {
        this.config["fileRenameFunction"] = /**
         * @param {Object} file
         * @returns {string}
         */
        (file2) => {
          return renamer + file2.extension;
        };
      }
      this.filepond = create$f(el, this.config);
    }
    destroyed() {
      if (this.filepond) {
        this.filepond.destroy();
        this.filepond = null;
      }
    }
  };
  var FilePondInput_default = FilePondInput;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name2, cls) => {
    if (!registry.get(name2)) {
      registry.define(name2, cls);
    }
  };

  // src/filepond-input.raw.js
  defineEl_default("filepond-input", FilePondInput_default);
  var filepond_input_raw_default = FilePondInput_default;
})();
/*! Bundled license information:

filepond/dist/filepond.esm.js:
  (*!
   * FilePond 4.31.4
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js:
  (*!
   * FilePondPluginFileValidateType 1.2.9
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.esm.js:
  (*!
   * FilePondPluginFileValidateSize 2.2.8
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-file-poster/dist/filepond-plugin-file-poster.esm.js:
  (*!
   * FilePondPluginFilePoster 2.5.1
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-file-metadata/dist/filepond-plugin-file-metadata.esm.js:
  (*!
   * FilePondPluginFileMetadata 1.0.8
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.esm.js:
  (*!
   * FilePondPluginImageExifOrientation 1.0.11
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js:
  (*!
   * FilePondPluginImagePreview 4.6.12
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-image-crop/dist/filepond-plugin-image-crop.esm.js:
  (*!
   * FilePondPluginImageCrop 2.0.6
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-image-resize/dist/filepond-plugin-image-resize.esm.js:
  (*!
   * FilePondPluginImageResize 2.0.10
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-image-transform/dist/filepond-plugin-image-transform.esm.js:
  (*!
   * FilePondPluginImageTransform 3.8.7
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)

filepond-plugin-image-validate-size/dist/filepond-plugin-image-validate-size.esm.js:
  (*!
   * FilePondPluginImageValidateSize 1.2.7
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   *)
*/
