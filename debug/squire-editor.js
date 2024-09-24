(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/squire-rte/dist/squire-raw.mjs
  var SHOW_ELEMENT = 1;
  var SHOW_TEXT = 4;
  var SHOW_ELEMENT_OR_TEXT = 5;
  var always = () => true;
  var TreeIterator = class {
    constructor(root, nodeType, filter) {
      this.root = root;
      this.currentNode = root;
      this.nodeType = nodeType;
      this.filter = filter || always;
    }
    isAcceptableNode(node) {
      const nodeType = node.nodeType;
      const nodeFilterType = nodeType === Node.ELEMENT_NODE ? SHOW_ELEMENT : nodeType === Node.TEXT_NODE ? SHOW_TEXT : 0;
      return !!(nodeFilterType & this.nodeType) && this.filter(node);
    }
    nextNode() {
      const root = this.root;
      let current = this.currentNode;
      let node;
      while (true) {
        node = current.firstChild;
        while (!node && current) {
          if (current === root) {
            break;
          }
          node = current.nextSibling;
          if (!node) {
            current = current.parentNode;
          }
        }
        if (!node) {
          return null;
        }
        if (this.isAcceptableNode(node)) {
          this.currentNode = node;
          return node;
        }
        current = node;
      }
    }
    previousNode() {
      const root = this.root;
      let current = this.currentNode;
      let node;
      while (true) {
        if (current === root) {
          return null;
        }
        node = current.previousSibling;
        if (node) {
          while (current = node.lastChild) {
            node = current;
          }
        } else {
          node = current.parentNode;
        }
        if (!node) {
          return null;
        }
        if (this.isAcceptableNode(node)) {
          this.currentNode = node;
          return node;
        }
        current = node;
      }
    }
    // Previous node in post-order.
    previousPONode() {
      const root = this.root;
      let current = this.currentNode;
      let node;
      while (true) {
        node = current.lastChild;
        while (!node && current) {
          if (current === root) {
            break;
          }
          node = current.previousSibling;
          if (!node) {
            current = current.parentNode;
          }
        }
        if (!node) {
          return null;
        }
        if (this.isAcceptableNode(node)) {
          this.currentNode = node;
          return node;
        }
        current = node;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;
  var DOCUMENT_FRAGMENT_NODE = 11;
  var ZWS = "\u200B";
  var ua = navigator.userAgent;
  var isMac = /Mac OS X/.test(ua);
  var isWin = /Windows NT/.test(ua);
  var isIOS = /iP(?:ad|hone|od)/.test(ua) || isMac && !!navigator.maxTouchPoints;
  var isAndroid = /Android/.test(ua);
  var isGecko = /Gecko\//.test(ua);
  var isLegacyEdge = /Edge\//.test(ua);
  var isWebKit = !isLegacyEdge && /WebKit\//.test(ua);
  var ctrlKey = isMac || isIOS ? "Meta-" : "Ctrl-";
  var cantFocusEmptyTextNodes = isWebKit;
  var supportsInputEvents = "onbeforeinput" in document && "inputType" in new InputEvent("input");
  var notWS = /[^ \t\r\n]/;
  var inlineNodeNames = /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|HR|I(?:FRAME|MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|TIME|U|VAR|WBR)$/;
  var leafNodeNames = /* @__PURE__ */ new Set(["BR", "HR", "IFRAME", "IMG", "INPUT"]);
  var UNKNOWN = 0;
  var INLINE = 1;
  var BLOCK = 2;
  var CONTAINER = 3;
  var cache = /* @__PURE__ */ new WeakMap();
  var resetNodeCategoryCache = () => {
    cache = /* @__PURE__ */ new WeakMap();
  };
  var isLeaf = (node) => {
    return leafNodeNames.has(node.nodeName);
  };
  var getNodeCategory = (node) => {
    switch (node.nodeType) {
      case TEXT_NODE:
        return INLINE;
      case ELEMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        if (cache.has(node)) {
          return cache.get(node);
        }
        break;
      default:
        return UNKNOWN;
    }
    let nodeCategory;
    if (!Array.from(node.childNodes).every(isInline)) {
      nodeCategory = CONTAINER;
    } else if (inlineNodeNames.test(node.nodeName)) {
      nodeCategory = INLINE;
    } else {
      nodeCategory = BLOCK;
    }
    cache.set(node, nodeCategory);
    return nodeCategory;
  };
  var isInline = (node) => {
    return getNodeCategory(node) === INLINE;
  };
  var isBlock = (node) => {
    return getNodeCategory(node) === BLOCK;
  };
  var isContainer = (node) => {
    return getNodeCategory(node) === CONTAINER;
  };
  var createElement = (tag, props2, children) => {
    const el = document.createElement(tag);
    if (props2 instanceof Array) {
      children = props2;
      props2 = null;
    }
    if (props2) {
      for (const attr in props2) {
        const value = props2[attr];
        if (value !== void 0) {
          el.setAttribute(attr, value);
        }
      }
    }
    if (children) {
      children.forEach((node) => el.appendChild(node));
    }
    return el;
  };
  var areAlike = (node, node2) => {
    if (isLeaf(node)) {
      return false;
    }
    if (node.nodeType !== node2.nodeType || node.nodeName !== node2.nodeName) {
      return false;
    }
    if (node instanceof HTMLElement && node2 instanceof HTMLElement) {
      return node.nodeName !== "A" && node.className === node2.className && node.style.cssText === node2.style.cssText;
    }
    return true;
  };
  var hasTagAttributes = (node, tag, attributes) => {
    if (node.nodeName !== tag) {
      return false;
    }
    for (const attr in attributes) {
      if (!("getAttribute" in node) || node.getAttribute(attr) !== attributes[attr]) {
        return false;
      }
    }
    return true;
  };
  var getNearest = (node, root, tag, attributes) => {
    while (node && node !== root) {
      if (hasTagAttributes(node, tag, attributes)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };
  var getNodeBeforeOffset = (node, offset) => {
    let children = node.childNodes;
    while (offset && node instanceof Element) {
      node = children[offset - 1];
      children = node.childNodes;
      offset = children.length;
    }
    return node;
  };
  var getNodeAfterOffset = (node, offset) => {
    let returnNode = node;
    if (returnNode instanceof Element) {
      const children = returnNode.childNodes;
      if (offset < children.length) {
        returnNode = children[offset];
      } else {
        while (returnNode && !returnNode.nextSibling) {
          returnNode = returnNode.parentNode;
        }
        if (returnNode) {
          returnNode = returnNode.nextSibling;
        }
      }
    }
    return returnNode;
  };
  var getLength = (node) => {
    return node instanceof Element || node instanceof DocumentFragment ? node.childNodes.length : node instanceof CharacterData ? node.length : 0;
  };
  var empty = (node) => {
    const frag = document.createDocumentFragment();
    let child = node.firstChild;
    while (child) {
      frag.appendChild(child);
      child = node.firstChild;
    }
    return frag;
  };
  var detach = (node) => {
    const parent = node.parentNode;
    if (parent) {
      parent.removeChild(node);
    }
    return node;
  };
  var replaceWith = (node, node2) => {
    const parent = node.parentNode;
    if (parent) {
      parent.replaceChild(node2, node);
    }
  };
  var notWSTextNode = (node) => {
    return node instanceof Element ? node.nodeName === "BR" : (
      // okay if data is 'undefined' here.
      notWS.test(node.data)
    );
  };
  var isLineBreak = (br, isLBIfEmptyBlock) => {
    let block = br.parentNode;
    while (isInline(block)) {
      block = block.parentNode;
    }
    const walker = new TreeIterator(
      block,
      SHOW_ELEMENT_OR_TEXT,
      notWSTextNode
    );
    walker.currentNode = br;
    return !!walker.nextNode() || isLBIfEmptyBlock && !walker.previousNode();
  };
  var removeZWS = (root, keepNode) => {
    const walker = new TreeIterator(root, SHOW_TEXT);
    let textNode;
    let index;
    while (textNode = walker.nextNode()) {
      while ((index = textNode.data.indexOf(ZWS)) > -1 && // eslint-disable-next-line no-unmodified-loop-condition
      (!keepNode || textNode.parentNode !== keepNode)) {
        if (textNode.length === 1) {
          let node = textNode;
          let parent = node.parentNode;
          while (parent) {
            parent.removeChild(node);
            walker.currentNode = parent;
            if (!isInline(parent) || getLength(parent)) {
              break;
            }
            node = parent;
            parent = node.parentNode;
          }
          break;
        } else {
          textNode.deleteData(index, 1);
        }
      }
    }
  };
  var START_TO_START = 0;
  var START_TO_END = 1;
  var END_TO_END = 2;
  var END_TO_START = 3;
  var isNodeContainedInRange = (range, node, partial) => {
    const nodeRange = document.createRange();
    nodeRange.selectNode(node);
    if (partial) {
      const nodeEndBeforeStart = range.compareBoundaryPoints(END_TO_START, nodeRange) > -1;
      const nodeStartAfterEnd = range.compareBoundaryPoints(START_TO_END, nodeRange) < 1;
      return !nodeEndBeforeStart && !nodeStartAfterEnd;
    } else {
      const nodeStartAfterStart = range.compareBoundaryPoints(START_TO_START, nodeRange) < 1;
      const nodeEndBeforeEnd = range.compareBoundaryPoints(END_TO_END, nodeRange) > -1;
      return nodeStartAfterStart && nodeEndBeforeEnd;
    }
  };
  var moveRangeBoundariesDownTree = (range) => {
    let { startContainer, startOffset, endContainer, endOffset } = range;
    while (!(startContainer instanceof Text)) {
      let child = startContainer.childNodes[startOffset];
      if (!child || isLeaf(child)) {
        if (startOffset) {
          child = startContainer.childNodes[startOffset - 1];
          if (child instanceof Text) {
            let textChild = child;
            let prev;
            while (!textChild.length && (prev = textChild.previousSibling) && prev instanceof Text) {
              textChild.remove();
              textChild = prev;
            }
            startContainer = textChild;
            startOffset = textChild.data.length;
          }
        }
        break;
      }
      startContainer = child;
      startOffset = 0;
    }
    if (endOffset) {
      while (!(endContainer instanceof Text)) {
        const child = endContainer.childNodes[endOffset - 1];
        if (!child || isLeaf(child)) {
          if (child && child.nodeName === "BR" && !isLineBreak(child, false)) {
            endOffset -= 1;
            continue;
          }
          break;
        }
        endContainer = child;
        endOffset = getLength(endContainer);
      }
    } else {
      while (!(endContainer instanceof Text)) {
        const child = endContainer.firstChild;
        if (!child || isLeaf(child)) {
          break;
        }
        endContainer = child;
      }
    }
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  };
  var moveRangeBoundariesUpTree = (range, startMax, endMax, root) => {
    let startContainer = range.startContainer;
    let startOffset = range.startOffset;
    let endContainer = range.endContainer;
    let endOffset = range.endOffset;
    let parent;
    if (!startMax) {
      startMax = range.commonAncestorContainer;
    }
    if (!endMax) {
      endMax = startMax;
    }
    while (!startOffset && startContainer !== startMax && startContainer !== root) {
      parent = startContainer.parentNode;
      startOffset = Array.from(parent.childNodes).indexOf(
        startContainer
      );
      startContainer = parent;
    }
    while (true) {
      if (endContainer === endMax || endContainer === root) {
        break;
      }
      if (endContainer.nodeType !== TEXT_NODE && endContainer.childNodes[endOffset] && endContainer.childNodes[endOffset].nodeName === "BR" && !isLineBreak(endContainer.childNodes[endOffset], false)) {
        endOffset += 1;
      }
      if (endOffset !== getLength(endContainer)) {
        break;
      }
      parent = endContainer.parentNode;
      endOffset = Array.from(parent.childNodes).indexOf(endContainer) + 1;
      endContainer = parent;
    }
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  };
  var moveRangeBoundaryOutOf = (range, tag, root) => {
    let parent = getNearest(range.endContainer, root, tag);
    if (parent && (parent = parent.parentNode)) {
      const clone = range.cloneRange();
      moveRangeBoundariesUpTree(clone, parent, parent, root);
      if (clone.endContainer === parent) {
        range.setStart(clone.endContainer, clone.endOffset);
        range.setEnd(clone.endContainer, clone.endOffset);
      }
    }
    return range;
  };
  var fixCursor = (node) => {
    let fixer = null;
    if (node instanceof Text) {
      return node;
    }
    if (isInline(node)) {
      let child = node.firstChild;
      if (cantFocusEmptyTextNodes) {
        while (child && child instanceof Text && !child.data) {
          node.removeChild(child);
          child = node.firstChild;
        }
      }
      if (!child) {
        if (cantFocusEmptyTextNodes) {
          fixer = document.createTextNode(ZWS);
        } else {
          fixer = document.createTextNode("");
        }
      }
    } else if ((node instanceof Element || node instanceof DocumentFragment) && !node.querySelector("BR")) {
      fixer = createElement("BR");
      let parent = node;
      let child;
      while ((child = parent.lastElementChild) && !isInline(child)) {
        parent = child;
      }
      node = parent;
    }
    if (fixer) {
      try {
        node.appendChild(fixer);
      } catch (error) {
      }
    }
    return node;
  };
  var fixContainer = (container, root) => {
    let wrapper = null;
    Array.from(container.childNodes).forEach((child) => {
      const isBR = child.nodeName === "BR";
      if (!isBR && isInline(child)) {
        if (!wrapper) {
          wrapper = createElement("DIV");
        }
        wrapper.appendChild(child);
      } else if (isBR || wrapper) {
        if (!wrapper) {
          wrapper = createElement("DIV");
        }
        fixCursor(wrapper);
        if (isBR) {
          container.replaceChild(wrapper, child);
        } else {
          container.insertBefore(wrapper, child);
        }
        wrapper = null;
      }
      if (isContainer(child)) {
        fixContainer(child, root);
      }
    });
    if (wrapper) {
      container.appendChild(fixCursor(wrapper));
    }
    return container;
  };
  var split = (node, offset, stopNode, root) => {
    if (node instanceof Text && node !== stopNode) {
      if (typeof offset !== "number") {
        throw new Error("Offset must be a number to split text node!");
      }
      if (!node.parentNode) {
        throw new Error("Cannot split text node with no parent!");
      }
      return split(node.parentNode, node.splitText(offset), stopNode, root);
    }
    let nodeAfterSplit = typeof offset === "number" ? offset < node.childNodes.length ? node.childNodes[offset] : null : offset;
    const parent = node.parentNode;
    if (!parent || node === stopNode || !(node instanceof Element)) {
      return nodeAfterSplit;
    }
    const clone = node.cloneNode(false);
    while (nodeAfterSplit) {
      const next = nodeAfterSplit.nextSibling;
      clone.appendChild(nodeAfterSplit);
      nodeAfterSplit = next;
    }
    if (node instanceof HTMLOListElement && getNearest(node, root, "BLOCKQUOTE")) {
      clone.start = (+node.start || 1) + node.childNodes.length - 1;
    }
    fixCursor(node);
    fixCursor(clone);
    parent.insertBefore(clone, node.nextSibling);
    return split(parent, clone, stopNode, root);
  };
  var _mergeInlines = (node, fakeRange) => {
    const children = node.childNodes;
    let l = children.length;
    const frags = [];
    while (l--) {
      const child = children[l];
      const prev = l ? children[l - 1] : null;
      if (prev && isInline(child) && areAlike(child, prev)) {
        if (fakeRange.startContainer === child) {
          fakeRange.startContainer = prev;
          fakeRange.startOffset += getLength(prev);
        }
        if (fakeRange.endContainer === child) {
          fakeRange.endContainer = prev;
          fakeRange.endOffset += getLength(prev);
        }
        if (fakeRange.startContainer === node) {
          if (fakeRange.startOffset > l) {
            fakeRange.startOffset -= 1;
          } else if (fakeRange.startOffset === l) {
            fakeRange.startContainer = prev;
            fakeRange.startOffset = getLength(prev);
          }
        }
        if (fakeRange.endContainer === node) {
          if (fakeRange.endOffset > l) {
            fakeRange.endOffset -= 1;
          } else if (fakeRange.endOffset === l) {
            fakeRange.endContainer = prev;
            fakeRange.endOffset = getLength(prev);
          }
        }
        detach(child);
        if (child instanceof Text) {
          prev.appendData(child.data);
        } else {
          frags.push(empty(child));
        }
      } else if (child instanceof Element) {
        let frag;
        while (frag = frags.pop()) {
          child.appendChild(frag);
        }
        _mergeInlines(child, fakeRange);
      }
    }
  };
  var mergeInlines = (node, range) => {
    const element = node instanceof Text ? node.parentNode : node;
    if (element instanceof Element) {
      const fakeRange = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
      _mergeInlines(element, fakeRange);
      range.setStart(fakeRange.startContainer, fakeRange.startOffset);
      range.setEnd(fakeRange.endContainer, fakeRange.endOffset);
    }
  };
  var mergeWithBlock = (block, next, range, root) => {
    let container = next;
    let parent;
    let offset;
    while ((parent = container.parentNode) && parent !== root && parent instanceof Element && parent.childNodes.length === 1) {
      container = parent;
    }
    detach(container);
    offset = block.childNodes.length;
    const last = block.lastChild;
    if (last && last.nodeName === "BR") {
      block.removeChild(last);
      offset -= 1;
    }
    block.appendChild(empty(next));
    range.setStart(block, offset);
    range.collapse(true);
    mergeInlines(block, range);
  };
  var mergeContainers = (node, root) => {
    const prev = node.previousSibling;
    const first = node.firstChild;
    const isListItem = node.nodeName === "LI";
    if (isListItem && (!first || !/^[OU]L$/.test(first.nodeName))) {
      return;
    }
    if (prev && areAlike(prev, node)) {
      if (!isContainer(prev)) {
        if (isListItem) {
          const block = createElement("DIV");
          block.appendChild(empty(prev));
          prev.appendChild(block);
        } else {
          return;
        }
      }
      detach(node);
      const needsFix = !isContainer(node);
      prev.appendChild(empty(node));
      if (needsFix) {
        fixContainer(prev, root);
      }
      if (first) {
        mergeContainers(first, root);
      }
    } else if (isListItem) {
      const block = createElement("DIV");
      node.insertBefore(block, first);
      fixCursor(block);
    }
  };
  var styleToSemantic = {
    "font-weight": {
      regexp: /^bold|^700/i,
      replace() {
        return createElement("B");
      }
    },
    "font-style": {
      regexp: /^italic/i,
      replace() {
        return createElement("I");
      }
    },
    "font-family": {
      regexp: notWS,
      replace(classNames, family) {
        return createElement("SPAN", {
          class: classNames.fontFamily,
          style: "font-family:" + family
        });
      }
    },
    "font-size": {
      regexp: notWS,
      replace(classNames, size) {
        return createElement("SPAN", {
          class: classNames.fontSize,
          style: "font-size:" + size
        });
      }
    },
    "text-decoration": {
      regexp: /^underline/i,
      replace() {
        return createElement("U");
      }
    }
  };
  var replaceStyles = (node, _, config) => {
    const style = node.style;
    let newTreeBottom;
    let newTreeTop;
    for (const attr in styleToSemantic) {
      const converter = styleToSemantic[attr];
      const css = style.getPropertyValue(attr);
      if (css && converter.regexp.test(css)) {
        const el = converter.replace(config.classNames, css);
        if (el.nodeName === node.nodeName && el.className === node.className) {
          continue;
        }
        if (!newTreeTop) {
          newTreeTop = el;
        }
        if (newTreeBottom) {
          newTreeBottom.appendChild(el);
        }
        newTreeBottom = el;
        node.style.removeProperty(attr);
      }
    }
    if (newTreeTop && newTreeBottom) {
      newTreeBottom.appendChild(empty(node));
      if (node.style.cssText) {
        node.appendChild(newTreeTop);
      } else {
        replaceWith(node, newTreeTop);
      }
    }
    return newTreeBottom || node;
  };
  var replaceWithTag = (tag) => {
    return (node, parent) => {
      const el = createElement(tag);
      const attributes = node.attributes;
      for (let i = 0, l = attributes.length; i < l; i += 1) {
        const attribute = attributes[i];
        el.setAttribute(attribute.name, attribute.value);
      }
      parent.replaceChild(el, node);
      el.appendChild(empty(node));
      return el;
    };
  };
  var fontSizes = {
    "1": "10",
    "2": "13",
    "3": "16",
    "4": "18",
    "5": "24",
    "6": "32",
    "7": "48"
  };
  var stylesRewriters = {
    STRONG: replaceWithTag("B"),
    EM: replaceWithTag("I"),
    INS: replaceWithTag("U"),
    STRIKE: replaceWithTag("S"),
    SPAN: replaceStyles,
    FONT: (node, parent, config) => {
      const font = node;
      const face = font.face;
      const size = font.size;
      let color = font.color;
      const classNames = config.classNames;
      let fontSpan;
      let sizeSpan;
      let colorSpan;
      let newTreeBottom;
      let newTreeTop;
      if (face) {
        fontSpan = createElement("SPAN", {
          class: classNames.fontFamily,
          style: "font-family:" + face
        });
        newTreeTop = fontSpan;
        newTreeBottom = fontSpan;
      }
      if (size) {
        sizeSpan = createElement("SPAN", {
          class: classNames.fontSize,
          style: "font-size:" + fontSizes[size] + "px"
        });
        if (!newTreeTop) {
          newTreeTop = sizeSpan;
        }
        if (newTreeBottom) {
          newTreeBottom.appendChild(sizeSpan);
        }
        newTreeBottom = sizeSpan;
      }
      if (color && /^#?([\dA-F]{3}){1,2}$/i.test(color)) {
        if (color.charAt(0) !== "#") {
          color = "#" + color;
        }
        colorSpan = createElement("SPAN", {
          class: classNames.color,
          style: "color:" + color
        });
        if (!newTreeTop) {
          newTreeTop = colorSpan;
        }
        if (newTreeBottom) {
          newTreeBottom.appendChild(colorSpan);
        }
        newTreeBottom = colorSpan;
      }
      if (!newTreeTop || !newTreeBottom) {
        newTreeTop = newTreeBottom = createElement("SPAN");
      }
      parent.replaceChild(newTreeTop, font);
      newTreeBottom.appendChild(empty(font));
      return newTreeBottom;
    },
    TT: (node, parent, config) => {
      const el = createElement("SPAN", {
        class: config.classNames.fontFamily,
        style: 'font-family:menlo,consolas,"courier new",monospace'
      });
      parent.replaceChild(el, node);
      el.appendChild(empty(node));
      return el;
    }
  };
  var allowedBlock = /^(?:A(?:DDRESS|RTICLE|SIDE|UDIO)|BLOCKQUOTE|CAPTION|D(?:[DLT]|IV)|F(?:IGURE|IGCAPTION|OOTER)|H[1-6]|HEADER|L(?:ABEL|EGEND|I)|O(?:L|UTPUT)|P(?:RE)?|SECTION|T(?:ABLE|BODY|D|FOOT|H|HEAD|R)|COL(?:GROUP)?|UL)$/;
  var blacklist = /^(?:HEAD|META|STYLE)/;
  var cleanTree = (node, config, preserveWS) => {
    const children = node.childNodes;
    let nonInlineParent = node;
    while (isInline(nonInlineParent)) {
      nonInlineParent = nonInlineParent.parentNode;
    }
    const walker = new TreeIterator(
      nonInlineParent,
      SHOW_ELEMENT_OR_TEXT
    );
    for (let i = 0, l = children.length; i < l; i += 1) {
      let child = children[i];
      const nodeName = child.nodeName;
      const rewriter = stylesRewriters[nodeName];
      if (child instanceof HTMLElement) {
        const childLength = child.childNodes.length;
        if (rewriter) {
          child = rewriter(child, node, config);
        } else if (blacklist.test(nodeName)) {
          node.removeChild(child);
          i -= 1;
          l -= 1;
          continue;
        } else if (!allowedBlock.test(nodeName) && !isInline(child)) {
          i -= 1;
          l += childLength - 1;
          node.replaceChild(empty(child), child);
          continue;
        }
        if (childLength) {
          cleanTree(child, config, preserveWS || nodeName === "PRE");
        }
      } else {
        if (child instanceof Text) {
          let data = child.data;
          const startsWithWS = !notWS.test(data.charAt(0));
          const endsWithWS = !notWS.test(data.charAt(data.length - 1));
          if (preserveWS || !startsWithWS && !endsWithWS) {
            continue;
          }
          if (startsWithWS) {
            walker.currentNode = child;
            let sibling;
            while (sibling = walker.previousPONode()) {
              if (sibling.nodeName === "IMG" || sibling instanceof Text && notWS.test(sibling.data)) {
                break;
              }
              if (!isInline(sibling)) {
                sibling = null;
                break;
              }
            }
            data = data.replace(/^[ \t\r\n]+/g, sibling ? " " : "");
          }
          if (endsWithWS) {
            walker.currentNode = child;
            let sibling;
            while (sibling = walker.nextNode()) {
              if (sibling.nodeName === "IMG" || sibling instanceof Text && notWS.test(sibling.data)) {
                break;
              }
              if (!isInline(sibling)) {
                sibling = null;
                break;
              }
            }
            data = data.replace(/[ \t\r\n]+$/g, sibling ? " " : "");
          }
          if (data) {
            child.data = data;
            continue;
          }
        }
        node.removeChild(child);
        i -= 1;
        l -= 1;
      }
    }
    return node;
  };
  var removeEmptyInlines = (node) => {
    const children = node.childNodes;
    let l = children.length;
    while (l--) {
      const child = children[l];
      if (child instanceof Element && !isLeaf(child)) {
        removeEmptyInlines(child);
        if (isInline(child) && !child.firstChild) {
          node.removeChild(child);
        }
      } else if (child instanceof Text && !child.data) {
        node.removeChild(child);
      }
    }
  };
  var cleanupBRs = (node, root, keepForBlankLine) => {
    const brs = node.querySelectorAll("BR");
    const brBreaksLine = [];
    let l = brs.length;
    for (let i = 0; i < l; i += 1) {
      brBreaksLine[i] = isLineBreak(brs[i], keepForBlankLine);
    }
    while (l--) {
      const br = brs[l];
      const parent = br.parentNode;
      if (!parent) {
        continue;
      }
      if (!brBreaksLine[l]) {
        detach(br);
      } else if (!isInline(parent)) {
        fixContainer(parent, root);
      }
    }
  };
  var escapeHTML = (text) => {
    return text.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;");
  };
  var getBlockWalker = (node, root) => {
    const walker = new TreeIterator(root, SHOW_ELEMENT, isBlock);
    walker.currentNode = node;
    return walker;
  };
  var getPreviousBlock = (node, root) => {
    const block = getBlockWalker(node, root).previousNode();
    return block !== root ? block : null;
  };
  var getNextBlock = (node, root) => {
    const block = getBlockWalker(node, root).nextNode();
    return block !== root ? block : null;
  };
  var isEmptyBlock = (block) => {
    return !block.textContent && !block.querySelector("IMG");
  };
  var getStartBlockOfRange = (range, root) => {
    const container = range.startContainer;
    let block;
    if (isInline(container)) {
      block = getPreviousBlock(container, root);
    } else if (container !== root && container instanceof HTMLElement && isBlock(container)) {
      block = container;
    } else {
      const node = getNodeBeforeOffset(container, range.startOffset);
      block = getNextBlock(node, root);
    }
    return block && isNodeContainedInRange(range, block, true) ? block : null;
  };
  var getEndBlockOfRange = (range, root) => {
    const container = range.endContainer;
    let block;
    if (isInline(container)) {
      block = getPreviousBlock(container, root);
    } else if (container !== root && container instanceof HTMLElement && isBlock(container)) {
      block = container;
    } else {
      let node = getNodeAfterOffset(container, range.endOffset);
      if (!node || !root.contains(node)) {
        node = root;
        let child;
        while (child = node.lastChild) {
          node = child;
        }
      }
      block = getPreviousBlock(node, root);
    }
    return block && isNodeContainedInRange(range, block, true) ? block : null;
  };
  var isContent = (node) => {
    return node instanceof Text ? notWS.test(node.data) : node.nodeName === "IMG";
  };
  var rangeDoesStartAtBlockBoundary = (range, root) => {
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    let nodeAfterCursor;
    if (startContainer instanceof Text) {
      const text = startContainer.data;
      for (let i = startOffset; i > 0; i -= 1) {
        if (text.charAt(i - 1) !== ZWS) {
          return false;
        }
      }
      nodeAfterCursor = startContainer;
    } else {
      nodeAfterCursor = getNodeAfterOffset(startContainer, startOffset);
      if (nodeAfterCursor && !root.contains(nodeAfterCursor)) {
        nodeAfterCursor = null;
      }
      if (!nodeAfterCursor) {
        nodeAfterCursor = getNodeBeforeOffset(startContainer, startOffset);
        if (nodeAfterCursor instanceof Text && nodeAfterCursor.length) {
          return false;
        }
      }
    }
    const block = getStartBlockOfRange(range, root);
    if (!block) {
      return false;
    }
    const contentWalker = new TreeIterator(
      block,
      SHOW_ELEMENT_OR_TEXT,
      isContent
    );
    contentWalker.currentNode = nodeAfterCursor;
    return !contentWalker.previousNode();
  };
  var rangeDoesEndAtBlockBoundary = (range, root) => {
    const endContainer = range.endContainer;
    const endOffset = range.endOffset;
    let currentNode;
    if (endContainer instanceof Text) {
      const text = endContainer.data;
      const length = text.length;
      for (let i = endOffset; i < length; i += 1) {
        if (text.charAt(i) !== ZWS) {
          return false;
        }
      }
      currentNode = endContainer;
    } else {
      currentNode = getNodeBeforeOffset(endContainer, endOffset);
    }
    const block = getEndBlockOfRange(range, root);
    if (!block) {
      return false;
    }
    const contentWalker = new TreeIterator(
      block,
      SHOW_ELEMENT_OR_TEXT,
      isContent
    );
    contentWalker.currentNode = currentNode;
    return !contentWalker.nextNode();
  };
  var expandRangeToBlockBoundaries = (range, root) => {
    const start = getStartBlockOfRange(range, root);
    const end = getEndBlockOfRange(range, root);
    let parent;
    if (start && end) {
      parent = start.parentNode;
      range.setStart(parent, Array.from(parent.childNodes).indexOf(start));
      parent = end.parentNode;
      range.setEnd(parent, Array.from(parent.childNodes).indexOf(end) + 1);
    }
  };
  function createRange(startContainer, startOffset, endContainer, endOffset) {
    const range = document.createRange();
    range.setStart(startContainer, startOffset);
    if (endContainer && typeof endOffset === "number") {
      range.setEnd(endContainer, endOffset);
    } else {
      range.setEnd(startContainer, startOffset);
    }
    return range;
  }
  var insertNodeInRange = (range, node) => {
    let { startContainer, startOffset, endContainer, endOffset } = range;
    let children;
    if (startContainer instanceof Text) {
      const parent = startContainer.parentNode;
      children = parent.childNodes;
      if (startOffset === startContainer.length) {
        startOffset = Array.from(children).indexOf(startContainer) + 1;
        if (range.collapsed) {
          endContainer = parent;
          endOffset = startOffset;
        }
      } else {
        if (startOffset) {
          const afterSplit = startContainer.splitText(startOffset);
          if (endContainer === startContainer) {
            endOffset -= startOffset;
            endContainer = afterSplit;
          } else if (endContainer === parent) {
            endOffset += 1;
          }
          startContainer = afterSplit;
        }
        startOffset = Array.from(children).indexOf(
          startContainer
        );
      }
      startContainer = parent;
    } else {
      children = startContainer.childNodes;
    }
    const childCount = children.length;
    if (startOffset === childCount) {
      startContainer.appendChild(node);
    } else {
      startContainer.insertBefore(node, children[startOffset]);
    }
    if (startContainer === endContainer) {
      endOffset += children.length - childCount;
    }
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  };
  var extractContentsOfRange = (range, common, root) => {
    const frag = document.createDocumentFragment();
    if (range.collapsed) {
      return frag;
    }
    if (!common) {
      common = range.commonAncestorContainer;
    }
    if (common instanceof Text) {
      common = common.parentNode;
    }
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    let endContainer = split(range.endContainer, range.endOffset, common, root);
    let endOffset = 0;
    let node = split(startContainer, startOffset, common, root);
    while (node && node !== endContainer) {
      const next = node.nextSibling;
      frag.appendChild(node);
      node = next;
    }
    node = endContainer && endContainer.previousSibling;
    if (node && node instanceof Text && endContainer instanceof Text) {
      endOffset = node.length;
      node.appendData(endContainer.data);
      detach(endContainer);
      endContainer = node;
    }
    range.setStart(startContainer, startOffset);
    if (endContainer) {
      range.setEnd(endContainer, endOffset);
    } else {
      range.setEnd(common, common.childNodes.length);
    }
    fixCursor(common);
    return frag;
  };
  var getAdjacentInlineNode = (iterator, method, node) => {
    iterator.currentNode = node;
    let nextNode;
    while (nextNode = iterator[method]()) {
      if (nextNode instanceof Text || isLeaf(nextNode)) {
        return nextNode;
      }
      if (!isInline(nextNode)) {
        return null;
      }
    }
    return null;
  };
  var deleteContentsOfRange = (range, root) => {
    const startBlock = getStartBlockOfRange(range, root);
    let endBlock = getEndBlockOfRange(range, root);
    const needsMerge = startBlock !== endBlock;
    if (startBlock && endBlock) {
      moveRangeBoundariesDownTree(range);
      moveRangeBoundariesUpTree(range, startBlock, endBlock, root);
    }
    const frag = extractContentsOfRange(range, null, root);
    moveRangeBoundariesDownTree(range);
    if (needsMerge) {
      endBlock = getEndBlockOfRange(range, root);
      if (startBlock && endBlock && startBlock !== endBlock) {
        mergeWithBlock(startBlock, endBlock, range, root);
      }
    }
    if (startBlock) {
      fixCursor(startBlock);
    }
    const child = root.firstChild;
    if (!child || child.nodeName === "BR") {
      fixCursor(root);
      if (root.firstChild) {
        range.selectNodeContents(root.firstChild);
      }
    }
    range.collapse(true);
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    const iterator = new TreeIterator(root, SHOW_ELEMENT_OR_TEXT);
    let afterNode = startContainer;
    let afterOffset = startOffset;
    if (!(afterNode instanceof Text) || afterOffset === afterNode.data.length) {
      afterNode = getAdjacentInlineNode(iterator, "nextNode", afterNode);
      afterOffset = 0;
    }
    let beforeNode = startContainer;
    let beforeOffset = startOffset - 1;
    if (!(beforeNode instanceof Text) || beforeOffset === -1) {
      beforeNode = getAdjacentInlineNode(
        iterator,
        "previousPONode",
        afterNode || (startContainer instanceof Text ? startContainer : startContainer.childNodes[startOffset] || startContainer)
      );
      if (beforeNode instanceof Text) {
        beforeOffset = beforeNode.data.length;
      }
    }
    let node = null;
    let offset = 0;
    if (afterNode instanceof Text && afterNode.data.charAt(afterOffset) === " " && rangeDoesStartAtBlockBoundary(range, root)) {
      node = afterNode;
      offset = afterOffset;
    } else if (beforeNode instanceof Text && beforeNode.data.charAt(beforeOffset) === " ") {
      if (afterNode instanceof Text && afterNode.data.charAt(afterOffset) === " " || rangeDoesEndAtBlockBoundary(range, root)) {
        node = beforeNode;
        offset = beforeOffset;
      }
    }
    if (node) {
      node.replaceData(offset, 1, "\xA0");
    }
    range.setStart(startContainer, startOffset);
    range.collapse(true);
    return frag;
  };
  var insertTreeFragmentIntoRange = (range, frag, root) => {
    const firstInFragIsInline = frag.firstChild && isInline(frag.firstChild);
    let node;
    fixContainer(frag, root);
    node = frag;
    while (node = getNextBlock(node, root)) {
      fixCursor(node);
    }
    if (!range.collapsed) {
      deleteContentsOfRange(range, root);
    }
    moveRangeBoundariesDownTree(range);
    range.collapse(false);
    const stopPoint = getNearest(range.endContainer, root, "BLOCKQUOTE") || root;
    let block = getStartBlockOfRange(range, root);
    let blockContentsAfterSplit = null;
    const firstBlockInFrag = getNextBlock(frag, frag);
    const replaceBlock = !firstInFragIsInline && !!block && isEmptyBlock(block);
    if (block && firstBlockInFrag && !replaceBlock && // Don't merge table cells or PRE elements into block
    !getNearest(firstBlockInFrag, frag, "PRE") && !getNearest(firstBlockInFrag, frag, "TABLE")) {
      moveRangeBoundariesUpTree(range, block, block, root);
      range.collapse(true);
      let container = range.endContainer;
      let offset = range.endOffset;
      cleanupBRs(block, root, false);
      if (isInline(container)) {
        const nodeAfterSplit = split(
          container,
          offset,
          getPreviousBlock(container, root) || root,
          root
        );
        container = nodeAfterSplit.parentNode;
        offset = Array.from(container.childNodes).indexOf(
          nodeAfterSplit
        );
      }
      if (
        /*isBlock( container ) && */
        offset !== getLength(container)
      ) {
        blockContentsAfterSplit = document.createDocumentFragment();
        while (node = container.childNodes[offset]) {
          blockContentsAfterSplit.appendChild(node);
        }
      }
      mergeWithBlock(container, firstBlockInFrag, range, root);
      offset = Array.from(container.parentNode.childNodes).indexOf(
        container
      ) + 1;
      container = container.parentNode;
      range.setEnd(container, offset);
    }
    if (getLength(frag)) {
      if (replaceBlock && block) {
        range.setEndBefore(block);
        range.collapse(false);
        detach(block);
      }
      moveRangeBoundariesUpTree(range, stopPoint, stopPoint, root);
      let nodeAfterSplit = split(
        range.endContainer,
        range.endOffset,
        stopPoint,
        root
      );
      const nodeBeforeSplit = nodeAfterSplit ? nodeAfterSplit.previousSibling : stopPoint.lastChild;
      stopPoint.insertBefore(frag, nodeAfterSplit);
      if (nodeAfterSplit) {
        range.setEndBefore(nodeAfterSplit);
      } else {
        range.setEnd(stopPoint, getLength(stopPoint));
      }
      block = getEndBlockOfRange(range, root);
      moveRangeBoundariesDownTree(range);
      const container = range.endContainer;
      const offset = range.endOffset;
      if (nodeAfterSplit && isContainer(nodeAfterSplit)) {
        mergeContainers(nodeAfterSplit, root);
      }
      nodeAfterSplit = nodeBeforeSplit && nodeBeforeSplit.nextSibling;
      if (nodeAfterSplit && isContainer(nodeAfterSplit)) {
        mergeContainers(nodeAfterSplit, root);
      }
      range.setEnd(container, offset);
    }
    if (blockContentsAfterSplit && block) {
      const tempRange = range.cloneRange();
      fixCursor(blockContentsAfterSplit);
      mergeWithBlock(block, blockContentsAfterSplit, tempRange, root);
      range.setEnd(tempRange.endContainer, tempRange.endOffset);
    }
    moveRangeBoundariesDownTree(range);
  };
  var getTextContentsOfRange = (range) => {
    if (range.collapsed) {
      return "";
    }
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    const walker = new TreeIterator(
      range.commonAncestorContainer,
      SHOW_ELEMENT_OR_TEXT,
      (node2) => {
        return isNodeContainedInRange(range, node2, true);
      }
    );
    walker.currentNode = startContainer;
    let node = startContainer;
    let textContent = "";
    let addedTextInBlock = false;
    let value;
    if (!(node instanceof Element) && !(node instanceof Text) || !walker.filter(node)) {
      node = walker.nextNode();
    }
    while (node) {
      if (node instanceof Text) {
        value = node.data;
        if (value && /\S/.test(value)) {
          if (node === endContainer) {
            value = value.slice(0, range.endOffset);
          }
          if (node === startContainer) {
            value = value.slice(range.startOffset);
          }
          textContent += value;
          addedTextInBlock = true;
        }
      } else if (node.nodeName === "BR" || addedTextInBlock && !isInline(node)) {
        textContent += "\n";
        addedTextInBlock = false;
      }
      node = walker.nextNode();
    }
    textContent = textContent.replace(/ /g, " ");
    return textContent;
  };
  var indexOf = Array.prototype.indexOf;
  var extractRangeToClipboard = (event, range, root, removeRangeFromDocument, toCleanHTML, toPlainText, plainTextOnly) => {
    const clipboardData = event.clipboardData;
    if (isLegacyEdge || !clipboardData) {
      return false;
    }
    let text = toPlainText ? "" : getTextContentsOfRange(range);
    const startBlock = getStartBlockOfRange(range, root);
    const endBlock = getEndBlockOfRange(range, root);
    let copyRoot = root;
    if (startBlock === endBlock && startBlock?.contains(range.commonAncestorContainer)) {
      copyRoot = startBlock;
    }
    let contents;
    if (removeRangeFromDocument) {
      contents = deleteContentsOfRange(range, root);
    } else {
      range = range.cloneRange();
      moveRangeBoundariesDownTree(range);
      moveRangeBoundariesUpTree(range, copyRoot, copyRoot, root);
      contents = range.cloneContents();
    }
    let parent = range.commonAncestorContainer;
    if (parent instanceof Text) {
      parent = parent.parentNode;
    }
    while (parent && parent !== copyRoot) {
      const newContents = parent.cloneNode(false);
      newContents.appendChild(contents);
      contents = newContents;
      parent = parent.parentNode;
    }
    let html2;
    if (contents.childNodes.length === 1 && contents.childNodes[0] instanceof Text) {
      text = contents.childNodes[0].data.replace(/ /g, " ");
      plainTextOnly = true;
    } else {
      const node = createElement("DIV");
      node.appendChild(contents);
      html2 = node.innerHTML;
      if (toCleanHTML) {
        html2 = toCleanHTML(html2);
      }
    }
    if (toPlainText && html2 !== void 0) {
      text = toPlainText(html2);
    }
    if (isWin) {
      text = text.replace(/\r?\n/g, "\r\n");
    }
    if (!plainTextOnly && html2 && text !== html2) {
      html2 = "<!-- squire -->" + html2;
      clipboardData.setData("text/html", html2);
    }
    clipboardData.setData("text/plain", text);
    event.preventDefault();
    return true;
  };
  var _onCut = function(event) {
    const range = this.getSelection();
    const root = this._root;
    if (range.collapsed) {
      event.preventDefault();
      return;
    }
    this.saveUndoState(range);
    const handled = extractRangeToClipboard(
      event,
      range,
      root,
      true,
      this._config.willCutCopy,
      this._config.toPlainText,
      false
    );
    if (!handled) {
      setTimeout(() => {
        try {
          this._ensureBottomLine();
        } catch (error) {
          this._config.didError(error);
        }
      }, 0);
    }
    this.setSelection(range);
  };
  var _onCopy = function(event) {
    extractRangeToClipboard(
      event,
      this.getSelection(),
      this._root,
      false,
      this._config.willCutCopy,
      this._config.toPlainText,
      false
    );
  };
  var _monitorShiftKey = function(event) {
    this._isShiftDown = event.shiftKey;
  };
  var _onPaste = function(event) {
    const clipboardData = event.clipboardData;
    const items = clipboardData?.items;
    const choosePlain = this._isShiftDown;
    let hasRTF = false;
    let hasImage = false;
    let plainItem = null;
    let htmlItem = null;
    if (items) {
      let l = items.length;
      while (l--) {
        const item = items[l];
        const type = item.type;
        if (type === "text/html") {
          htmlItem = item;
        } else if (type === "text/plain" || type === "text/uri-list") {
          plainItem = item;
        } else if (type === "text/rtf") {
          hasRTF = true;
        } else if (/^image\/.*/.test(type)) {
          hasImage = true;
        }
      }
      if (hasImage && !(hasRTF && htmlItem)) {
        event.preventDefault();
        this.fireEvent("pasteImage", {
          clipboardData
        });
        return;
      }
      if (!isLegacyEdge) {
        event.preventDefault();
        if (htmlItem && (!choosePlain || !plainItem)) {
          htmlItem.getAsString((html2) => {
            this.insertHTML(html2, true);
          });
        } else if (plainItem) {
          plainItem.getAsString((text) => {
            let isLink = false;
            const range2 = this.getSelection();
            if (!range2.collapsed && notWS.test(range2.toString())) {
              const match = this.linkRegExp.exec(text);
              isLink = !!match && match[0].length === text.length;
            }
            if (isLink) {
              this.makeLink(text);
            } else {
              this.insertPlainText(text, true);
            }
          });
        }
        return;
      }
    }
    const types = clipboardData?.types;
    if (!isLegacyEdge && types && (indexOf.call(types, "text/html") > -1 || !isGecko && indexOf.call(types, "text/plain") > -1 && indexOf.call(types, "text/rtf") < 0)) {
      event.preventDefault();
      let data;
      if (!choosePlain && (data = clipboardData.getData("text/html"))) {
        this.insertHTML(data, true);
      } else if ((data = clipboardData.getData("text/plain")) || (data = clipboardData.getData("text/uri-list"))) {
        this.insertPlainText(data, true);
      }
      return;
    }
    const body = document.body;
    const range = this.getSelection();
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    const endContainer = range.endContainer;
    const endOffset = range.endOffset;
    let pasteArea = createElement("DIV", {
      contenteditable: "true",
      style: "position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;"
    });
    body.appendChild(pasteArea);
    range.selectNodeContents(pasteArea);
    this.setSelection(range);
    setTimeout(() => {
      try {
        let html2 = "";
        let next = pasteArea;
        let first;
        while (pasteArea = next) {
          next = pasteArea.nextSibling;
          detach(pasteArea);
          first = pasteArea.firstChild;
          if (first && first === pasteArea.lastChild && first instanceof HTMLDivElement) {
            pasteArea = first;
          }
          html2 += pasteArea.innerHTML;
        }
        this.setSelection(
          createRange(
            startContainer,
            startOffset,
            endContainer,
            endOffset
          )
        );
        if (html2) {
          this.insertHTML(html2, true);
        }
      } catch (error) {
        this._config.didError(error);
      }
    }, 0);
  };
  var _onDrop = function(event) {
    if (!event.dataTransfer) {
      return;
    }
    const types = event.dataTransfer.types;
    let l = types.length;
    let hasPlain = false;
    let hasHTML = false;
    while (l--) {
      switch (types[l]) {
        case "text/plain":
          hasPlain = true;
          break;
        case "text/html":
          hasHTML = true;
          break;
        default:
          return;
      }
    }
    if (hasHTML || hasPlain && this.saveUndoState) {
      this.saveUndoState();
    }
  };
  var Enter = (self, event, range) => {
    event.preventDefault();
    self.splitBlock(event.shiftKey, range);
  };
  var afterDelete = (self, range) => {
    try {
      if (!range) {
        range = self.getSelection();
      }
      let node = range.startContainer;
      if (node instanceof Text) {
        node = node.parentNode;
      }
      let parent = node;
      while (isInline(parent) && (!parent.textContent || parent.textContent === ZWS)) {
        node = parent;
        parent = node.parentNode;
      }
      if (node !== parent) {
        range.setStart(
          parent,
          Array.from(parent.childNodes).indexOf(node)
        );
        range.collapse(true);
        parent.removeChild(node);
        if (!isBlock(parent)) {
          parent = getPreviousBlock(parent, self._root) || self._root;
        }
        fixCursor(parent);
        moveRangeBoundariesDownTree(range);
      }
      if (node === self._root && (node = node.firstChild) && node.nodeName === "BR") {
        detach(node);
      }
      self._ensureBottomLine();
      self.setSelection(range);
      self._updatePath(range, true);
    } catch (error) {
      self._config.didError(error);
    }
  };
  var detachUneditableNode = (node, root) => {
    let parent;
    while (parent = node.parentNode) {
      if (parent === root || parent.isContentEditable) {
        break;
      }
      node = parent;
    }
    detach(node);
  };
  var linkifyText = (self, textNode, offset) => {
    if (getNearest(textNode, self._root, "A")) {
      return;
    }
    const data = textNode.data || "";
    const searchFrom = Math.max(
      data.lastIndexOf(" ", offset - 1),
      data.lastIndexOf("\xA0", offset - 1)
    ) + 1;
    const searchText = data.slice(searchFrom, offset);
    const match = self.linkRegExp.exec(searchText);
    if (match) {
      const selection = self.getSelection();
      self._docWasChanged();
      self._recordUndoState(selection);
      self._getRangeAndRemoveBookmark(selection);
      const index = searchFrom + match.index;
      const endIndex = index + match[0].length;
      const needsSelectionUpdate = selection.startContainer === textNode;
      const newSelectionOffset = selection.startOffset - endIndex;
      if (index) {
        textNode = textNode.splitText(index);
      }
      const defaultAttributes = self._config.tagAttributes.a;
      const link2 = createElement(
        "A",
        Object.assign(
          {
            href: match[1] ? /^(?:ht|f)tps?:/i.test(match[1]) ? match[1] : "http://" + match[1] : "mailto:" + match[0]
          },
          defaultAttributes
        )
      );
      link2.textContent = data.slice(index, endIndex);
      textNode.parentNode.insertBefore(link2, textNode);
      textNode.data = data.slice(endIndex);
      if (needsSelectionUpdate) {
        selection.setStart(textNode, newSelectionOffset);
        selection.setEnd(textNode, newSelectionOffset);
      }
      self.setSelection(selection);
    }
  };
  var Backspace = (self, event, range) => {
    const root = self._root;
    self._removeZWS();
    self.saveUndoState(range);
    if (!range.collapsed) {
      event.preventDefault();
      deleteContentsOfRange(range, root);
      afterDelete(self, range);
    } else if (rangeDoesStartAtBlockBoundary(range, root)) {
      event.preventDefault();
      const startBlock = getStartBlockOfRange(range, root);
      if (!startBlock) {
        return;
      }
      let current = startBlock;
      fixContainer(current.parentNode, root);
      const previous = getPreviousBlock(current, root);
      if (previous) {
        if (!previous.isContentEditable) {
          detachUneditableNode(previous, root);
          return;
        }
        mergeWithBlock(previous, current, range, root);
        current = previous.parentNode;
        while (current !== root && !current.nextSibling) {
          current = current.parentNode;
        }
        if (current !== root && (current = current.nextSibling)) {
          mergeContainers(current, root);
        }
        self.setSelection(range);
      } else if (current) {
        if (getNearest(current, root, "UL") || getNearest(current, root, "OL")) {
          self.decreaseListLevel(range);
          return;
        } else if (getNearest(current, root, "BLOCKQUOTE")) {
          self.removeQuote(range);
          return;
        }
        self.setSelection(range);
        self._updatePath(range, true);
      }
    } else {
      moveRangeBoundariesDownTree(range);
      const text = range.startContainer;
      const offset = range.startOffset;
      const a = text.parentNode;
      if (text instanceof Text && a instanceof HTMLAnchorElement && offset && a.href.includes(text.data)) {
        text.deleteData(offset - 1, 1);
        self.setSelection(range);
        self.removeLink();
        event.preventDefault();
      } else {
        self.setSelection(range);
        setTimeout(() => {
          afterDelete(self);
        }, 0);
      }
    }
  };
  var Delete = (self, event, range) => {
    const root = self._root;
    let current;
    let next;
    let originalRange;
    let cursorContainer;
    let cursorOffset;
    let nodeAfterCursor;
    self._removeZWS();
    self.saveUndoState(range);
    if (!range.collapsed) {
      event.preventDefault();
      deleteContentsOfRange(range, root);
      afterDelete(self, range);
    } else if (rangeDoesEndAtBlockBoundary(range, root)) {
      event.preventDefault();
      current = getStartBlockOfRange(range, root);
      if (!current) {
        return;
      }
      fixContainer(current.parentNode, root);
      next = getNextBlock(current, root);
      if (next) {
        if (!next.isContentEditable) {
          detachUneditableNode(next, root);
          return;
        }
        mergeWithBlock(current, next, range, root);
        next = current.parentNode;
        while (next !== root && !next.nextSibling) {
          next = next.parentNode;
        }
        if (next !== root && (next = next.nextSibling)) {
          mergeContainers(next, root);
        }
        self.setSelection(range);
        self._updatePath(range, true);
      }
    } else {
      originalRange = range.cloneRange();
      moveRangeBoundariesUpTree(range, root, root, root);
      cursorContainer = range.endContainer;
      cursorOffset = range.endOffset;
      if (cursorContainer instanceof Element) {
        nodeAfterCursor = cursorContainer.childNodes[cursorOffset];
        if (nodeAfterCursor && nodeAfterCursor.nodeName === "IMG") {
          event.preventDefault();
          detach(nodeAfterCursor);
          moveRangeBoundariesDownTree(range);
          afterDelete(self, range);
          return;
        }
      }
      self.setSelection(originalRange);
      setTimeout(() => {
        afterDelete(self);
      }, 0);
    }
  };
  var Tab = (self, event, range) => {
    const root = self._root;
    self._removeZWS();
    if (range.collapsed && rangeDoesStartAtBlockBoundary(range, root)) {
      let node = getStartBlockOfRange(range, root);
      let parent;
      while (parent = node.parentNode) {
        if (parent.nodeName === "UL" || parent.nodeName === "OL") {
          event.preventDefault();
          self.increaseListLevel(range);
          break;
        }
        node = parent;
      }
    }
  };
  var ShiftTab = (self, event, range) => {
    const root = self._root;
    self._removeZWS();
    if (range.collapsed && rangeDoesStartAtBlockBoundary(range, root)) {
      const node = range.startContainer;
      if (getNearest(node, root, "UL") || getNearest(node, root, "OL")) {
        event.preventDefault();
        self.decreaseListLevel(range);
      }
    }
  };
  var Space = (self, event, range) => {
    let node;
    const root = self._root;
    self._recordUndoState(range);
    self._getRangeAndRemoveBookmark(range);
    if (!range.collapsed) {
      deleteContentsOfRange(range, root);
      self._ensureBottomLine();
      self.setSelection(range);
      self._updatePath(range, true);
    } else if (rangeDoesEndAtBlockBoundary(range, root)) {
      const block = getStartBlockOfRange(range, root);
      if (block && block.nodeName !== "PRE") {
        const text = block.textContent?.trimEnd().replace(ZWS, "");
        if (text === "*" || text === "1.") {
          event.preventDefault();
          self.insertPlainText(" ", false);
          self._docWasChanged();
          self.saveUndoState(range);
          const walker = new TreeIterator(block, SHOW_TEXT);
          let textNode;
          while (textNode = walker.nextNode()) {
            detach(textNode);
          }
          if (text === "*") {
            self.makeUnorderedList();
          } else {
            self.makeOrderedList();
          }
          return;
        }
      }
    }
    node = range.endContainer;
    if (range.endOffset === getLength(node)) {
      do {
        if (node.nodeName === "A") {
          range.setStartAfter(node);
          break;
        }
      } while (!node.nextSibling && (node = node.parentNode) && node !== root);
    }
    if (self._config.addLinks) {
      const linkRange = range.cloneRange();
      moveRangeBoundariesDownTree(linkRange);
      const textNode = linkRange.startContainer;
      const offset = linkRange.startOffset;
      setTimeout(() => {
        linkifyText(self, textNode, offset);
      }, 0);
    }
    self.setSelection(range);
  };
  var _onKey = function(event) {
    if (event.defaultPrevented || event.isComposing) {
      return;
    }
    let key = event.key;
    let modifiers = "";
    const code2 = event.code;
    if (/^Digit\d$/.test(code2)) {
      key = code2.slice(-1);
    }
    if (key !== "Backspace" && key !== "Delete") {
      if (event.altKey) {
        modifiers += "Alt-";
      }
      if (event.ctrlKey) {
        modifiers += "Ctrl-";
      }
      if (event.metaKey) {
        modifiers += "Meta-";
      }
      if (event.shiftKey) {
        modifiers += "Shift-";
      }
    }
    if (isWin && event.shiftKey && key === "Delete") {
      modifiers += "Shift-";
    }
    key = modifiers + key;
    const range = this.getSelection();
    if (this._keyHandlers[key]) {
      this._keyHandlers[key](this, event, range);
    } else if (!range.collapsed && !event.ctrlKey && !event.metaKey && key.length === 1) {
      this.saveUndoState(range);
      deleteContentsOfRange(range, this._root);
      this._ensureBottomLine();
      this.setSelection(range);
      this._updatePath(range, true);
    }
  };
  var keyHandlers = {
    "Backspace": Backspace,
    "Delete": Delete,
    "Tab": Tab,
    "Shift-Tab": ShiftTab,
    " ": Space,
    "ArrowLeft"(self) {
      self._removeZWS();
    },
    "ArrowRight"(self, event, range) {
      self._removeZWS();
      const root = self.getRoot();
      if (rangeDoesEndAtBlockBoundary(range, root)) {
        moveRangeBoundariesDownTree(range);
        let node = range.endContainer;
        do {
          if (node.nodeName === "CODE") {
            let next = node.nextSibling;
            if (!(next instanceof Text)) {
              const textNode = document.createTextNode("\xA0");
              node.parentNode.insertBefore(textNode, next);
              next = textNode;
            }
            range.setStart(next, 1);
            self.setSelection(range);
            event.preventDefault();
            break;
          }
        } while (!node.nextSibling && (node = node.parentNode) && node !== root);
      }
    }
  };
  if (!supportsInputEvents) {
    keyHandlers.Enter = Enter;
    keyHandlers["Shift-Enter"] = Enter;
  }
  if (!isMac && !isIOS) {
    keyHandlers.PageUp = (self) => {
      self.moveCursorToStart();
    };
    keyHandlers.PageDown = (self) => {
      self.moveCursorToEnd();
    };
  }
  var mapKeyToFormat = (tag, remove) => {
    remove = remove || null;
    return (self, event) => {
      event.preventDefault();
      const range = self.getSelection();
      if (self.hasFormat(tag, null, range)) {
        self.changeFormat(null, { tag }, range);
      } else {
        self.changeFormat({ tag }, remove, range);
      }
    };
  };
  keyHandlers[ctrlKey + "b"] = mapKeyToFormat("B");
  keyHandlers[ctrlKey + "i"] = mapKeyToFormat("I");
  keyHandlers[ctrlKey + "u"] = mapKeyToFormat("U");
  keyHandlers[ctrlKey + "Shift-7"] = mapKeyToFormat("S");
  keyHandlers[ctrlKey + "Shift-5"] = mapKeyToFormat("SUB", { tag: "SUP" });
  keyHandlers[ctrlKey + "Shift-6"] = mapKeyToFormat("SUP", { tag: "SUB" });
  keyHandlers[ctrlKey + "Shift-8"] = (self, event) => {
    event.preventDefault();
    const path = self.getPath();
    if (!/(?:^|>)UL/.test(path)) {
      self.makeUnorderedList();
    } else {
      self.removeList();
    }
  };
  keyHandlers[ctrlKey + "Shift-9"] = (self, event) => {
    event.preventDefault();
    const path = self.getPath();
    if (!/(?:^|>)OL/.test(path)) {
      self.makeOrderedList();
    } else {
      self.removeList();
    }
  };
  keyHandlers[ctrlKey + "["] = (self, event) => {
    event.preventDefault();
    const path = self.getPath();
    if (/(?:^|>)BLOCKQUOTE/.test(path) || !/(?:^|>)[OU]L/.test(path)) {
      self.decreaseQuoteLevel();
    } else {
      self.decreaseListLevel();
    }
  };
  keyHandlers[ctrlKey + "]"] = (self, event) => {
    event.preventDefault();
    const path = self.getPath();
    if (/(?:^|>)BLOCKQUOTE/.test(path) || !/(?:^|>)[OU]L/.test(path)) {
      self.increaseQuoteLevel();
    } else {
      self.increaseListLevel();
    }
  };
  keyHandlers[ctrlKey + "d"] = (self, event) => {
    event.preventDefault();
    self.toggleCode();
  };
  keyHandlers[ctrlKey + "z"] = (self, event) => {
    event.preventDefault();
    self.undo();
  };
  keyHandlers[ctrlKey + "y"] = // Depending on platform, the Shift may cause the key to come through as
  // upper case, but sometimes not. Just add both as shortcuts — the browser
  // will only ever fire one or the other.
  keyHandlers[ctrlKey + "Shift-z"] = keyHandlers[ctrlKey + "Shift-Z"] = (self, event) => {
    event.preventDefault();
    self.redo();
  };
  var Squire = class {
    constructor(root, config) {
      this.customEvents = /* @__PURE__ */ new Set([
        "pathChange",
        "select",
        "input",
        "pasteImage",
        "undoStateChange"
      ]);
      this.startSelectionId = "squire-selection-start";
      this.endSelectionId = "squire-selection-end";
      this.linkRegExp = /\b(?:((?:(?:ht|f)tps?:\/\/|www\d{0,3}[.]|[a-z0-9][a-z0-9.\-]*[.][a-z]{2,}\/)(?:[^\s()<>]+|\([^\s()<>]+\))+(?:[^\s?&`!()\[\]{};:'".,<>«»“”‘’]|\([^\s()<>]+\)))|([\w\-.%+]+@(?:[\w\-]+\.)+[a-z]{2,}\b(?:[?][^&?\s]+=[^\s?&`!()\[\]{};:'".,<>«»“”‘’]+(?:&[^&?\s]+=[^\s?&`!()\[\]{};:'".,<>«»“”‘’]+)*)?))/i;
      this.tagAfterSplit = {
        DT: "DD",
        DD: "DT",
        LI: "LI",
        PRE: "PRE"
      };
      this._root = root;
      this._config = this._makeConfig(config);
      this._isFocused = false;
      this._lastSelection = createRange(root, 0);
      this._willRestoreSelection = false;
      this._mayHaveZWS = false;
      this._lastAnchorNode = null;
      this._lastFocusNode = null;
      this._path = "";
      this._events = /* @__PURE__ */ new Map();
      this._undoIndex = -1;
      this._undoStack = [];
      this._undoStackLength = 0;
      this._isInUndoState = false;
      this._ignoreChange = false;
      this._ignoreAllChanges = false;
      this.addEventListener("selectionchange", this._updatePathOnEvent);
      this.addEventListener("blur", this._enableRestoreSelection);
      this.addEventListener("mousedown", this._disableRestoreSelection);
      this.addEventListener("touchstart", this._disableRestoreSelection);
      this.addEventListener("focus", this._restoreSelection);
      this.addEventListener("blur", this._removeZWS);
      this._isShiftDown = false;
      this.addEventListener("cut", _onCut);
      this.addEventListener("copy", _onCopy);
      this.addEventListener("paste", _onPaste);
      this.addEventListener("drop", _onDrop);
      this.addEventListener(
        "keydown",
        _monitorShiftKey
      );
      this.addEventListener("keyup", _monitorShiftKey);
      this.addEventListener("keydown", _onKey);
      this._keyHandlers = Object.create(keyHandlers);
      const mutation = new MutationObserver(() => this._docWasChanged());
      mutation.observe(root, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      });
      this._mutation = mutation;
      root.setAttribute("contenteditable", "true");
      this.addEventListener(
        "beforeinput",
        this._beforeInput
      );
      this.setHTML("");
    }
    destroy() {
      this._events.forEach((_, type) => {
        this.removeEventListener(type);
      });
      this._mutation.disconnect();
      this._undoIndex = -1;
      this._undoStack = [];
      this._undoStackLength = 0;
    }
    _makeConfig(userConfig) {
      const config = {
        blockTag: "DIV",
        blockAttributes: null,
        tagAttributes: {},
        classNames: {
          color: "color",
          fontFamily: "font",
          fontSize: "size",
          highlight: "highlight"
        },
        undo: {
          documentSizeThreshold: -1,
          // -1 means no threshold
          undoLimit: -1
          // -1 means no limit
        },
        addLinks: true,
        willCutCopy: null,
        toPlainText: null,
        sanitizeToDOMFragment: (html2) => {
          const frag = DOMPurify.sanitize(html2, {
            ALLOW_UNKNOWN_PROTOCOLS: true,
            WHOLE_DOCUMENT: false,
            RETURN_DOM: true,
            RETURN_DOM_FRAGMENT: true,
            FORCE_BODY: false
          });
          return frag ? document.importNode(frag, true) : document.createDocumentFragment();
        },
        didError: (error) => console.log(error)
      };
      if (userConfig) {
        Object.assign(config, userConfig);
        config.blockTag = config.blockTag.toUpperCase();
      }
      return config;
    }
    setKeyHandler(key, fn) {
      this._keyHandlers[key] = fn;
      return this;
    }
    _beforeInput(event) {
      switch (event.inputType) {
        case "insertLineBreak":
          event.preventDefault();
          this.splitBlock(true);
          break;
        case "insertParagraph":
          event.preventDefault();
          this.splitBlock(false);
          break;
        case "insertOrderedList":
          event.preventDefault();
          this.makeOrderedList();
          break;
        case "insertUnoderedList":
          event.preventDefault();
          this.makeUnorderedList();
          break;
        case "historyUndo":
          event.preventDefault();
          this.undo();
          break;
        case "historyRedo":
          event.preventDefault();
          this.redo();
          break;
        case "formatBold":
          event.preventDefault();
          this.bold();
          break;
        case "formaItalic":
          event.preventDefault();
          this.italic();
          break;
        case "formatUnderline":
          event.preventDefault();
          this.underline();
          break;
        case "formatStrikeThrough":
          event.preventDefault();
          this.strikethrough();
          break;
        case "formatSuperscript":
          event.preventDefault();
          this.superscript();
          break;
        case "formatSubscript":
          event.preventDefault();
          this.subscript();
          break;
        case "formatJustifyFull":
        case "formatJustifyCenter":
        case "formatJustifyRight":
        case "formatJustifyLeft": {
          event.preventDefault();
          let alignment = event.inputType.slice(13).toLowerCase();
          if (alignment === "full") {
            alignment = "justify";
          }
          this.setTextAlignment(alignment);
          break;
        }
        case "formatRemove":
          event.preventDefault();
          this.removeAllFormatting();
          break;
        case "formatSetBlockTextDirection": {
          event.preventDefault();
          let dir = event.data;
          if (dir === "null") {
            dir = null;
          }
          this.setTextDirection(dir);
          break;
        }
        case "formatBackColor":
          event.preventDefault();
          this.setHighlightColor(event.data);
          break;
        case "formatFontColor":
          event.preventDefault();
          this.setTextColor(event.data);
          break;
        case "formatFontName":
          event.preventDefault();
          this.setFontFace(event.data);
          break;
      }
    }
    // --- Events
    handleEvent(event) {
      this.fireEvent(event.type, event);
    }
    fireEvent(type, detail) {
      let handlers = this._events.get(type);
      if (/^(?:focus|blur)/.test(type)) {
        const isFocused = this._root === document.activeElement;
        if (type === "focus") {
          if (!isFocused || this._isFocused) {
            return this;
          }
          this._isFocused = true;
        } else {
          if (isFocused || !this._isFocused) {
            return this;
          }
          this._isFocused = false;
        }
      }
      if (handlers) {
        const event = detail instanceof Event ? detail : new CustomEvent(type, {
          detail
        });
        handlers = handlers.slice();
        for (const handler of handlers) {
          try {
            if ("handleEvent" in handler) {
              handler.handleEvent(event);
            } else {
              handler.call(this, event);
            }
          } catch (error) {
            this._config.didError(error);
          }
        }
      }
      return this;
    }
    addEventListener(type, fn) {
      let handlers = this._events.get(type);
      let target = this._root;
      if (!handlers) {
        handlers = [];
        this._events.set(type, handlers);
        if (!this.customEvents.has(type)) {
          if (type === "selectionchange") {
            target = document;
          }
          target.addEventListener(type, this, true);
        }
      }
      handlers.push(fn);
      return this;
    }
    removeEventListener(type, fn) {
      const handlers = this._events.get(type);
      let target = this._root;
      if (handlers) {
        if (fn) {
          let l = handlers.length;
          while (l--) {
            if (handlers[l] === fn) {
              handlers.splice(l, 1);
            }
          }
        } else {
          handlers.length = 0;
        }
        if (!handlers.length) {
          this._events.delete(type);
          if (!this.customEvents.has(type)) {
            if (type === "selectionchange") {
              target = document;
            }
            target.removeEventListener(type, this, true);
          }
        }
      }
      return this;
    }
    // --- Focus
    focus() {
      this._root.focus({ preventScroll: true });
      return this;
    }
    blur() {
      this._root.blur();
      return this;
    }
    // --- Selection and bookmarking
    _enableRestoreSelection() {
      this._willRestoreSelection = true;
    }
    _disableRestoreSelection() {
      this._willRestoreSelection = false;
    }
    _restoreSelection() {
      if (this._willRestoreSelection) {
        this.setSelection(this._lastSelection);
      }
    }
    // ---
    _removeZWS() {
      if (!this._mayHaveZWS) {
        return;
      }
      removeZWS(this._root);
      this._mayHaveZWS = false;
    }
    _saveRangeToBookmark(range) {
      let startNode = createElement("INPUT", {
        id: this.startSelectionId,
        type: "hidden"
      });
      let endNode = createElement("INPUT", {
        id: this.endSelectionId,
        type: "hidden"
      });
      let temp;
      insertNodeInRange(range, startNode);
      range.collapse(false);
      insertNodeInRange(range, endNode);
      if (startNode.compareDocumentPosition(endNode) & Node.DOCUMENT_POSITION_PRECEDING) {
        startNode.id = this.endSelectionId;
        endNode.id = this.startSelectionId;
        temp = startNode;
        startNode = endNode;
        endNode = temp;
      }
      range.setStartAfter(startNode);
      range.setEndBefore(endNode);
    }
    _getRangeAndRemoveBookmark(range) {
      const root = this._root;
      const start = root.querySelector("#" + this.startSelectionId);
      const end = root.querySelector("#" + this.endSelectionId);
      if (start && end) {
        let startContainer = start.parentNode;
        let endContainer = end.parentNode;
        const startOffset = Array.from(startContainer.childNodes).indexOf(
          start
        );
        let endOffset = Array.from(endContainer.childNodes).indexOf(end);
        if (startContainer === endContainer) {
          endOffset -= 1;
        }
        start.remove();
        end.remove();
        if (!range) {
          range = document.createRange();
        }
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        mergeInlines(startContainer, range);
        if (startContainer !== endContainer) {
          mergeInlines(endContainer, range);
        }
        if (range.collapsed) {
          startContainer = range.startContainer;
          if (startContainer instanceof Text) {
            endContainer = startContainer.childNodes[range.startOffset];
            if (!endContainer || !(endContainer instanceof Text)) {
              endContainer = startContainer.childNodes[range.startOffset - 1];
            }
            if (endContainer && endContainer instanceof Text) {
              range.setStart(endContainer, 0);
              range.collapse(true);
            }
          }
        }
      }
      return range || null;
    }
    getSelection() {
      const selection = window.getSelection();
      const root = this._root;
      let range = null;
      if (this._isFocused && selection && selection.rangeCount) {
        range = selection.getRangeAt(0).cloneRange();
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        if (startContainer && isLeaf(startContainer)) {
          range.setStartBefore(startContainer);
        }
        if (endContainer && isLeaf(endContainer)) {
          range.setEndBefore(endContainer);
        }
      }
      if (range && root.contains(range.commonAncestorContainer)) {
        this._lastSelection = range;
      } else {
        range = this._lastSelection;
        if (!document.contains(range.commonAncestorContainer)) {
          range = null;
        }
      }
      if (!range) {
        range = createRange(root.firstElementChild || root, 0);
      }
      return range;
    }
    setSelection(range) {
      this._lastSelection = range;
      if (!this._isFocused) {
        this._enableRestoreSelection();
      } else {
        const selection = window.getSelection();
        if (selection) {
          if ("setBaseAndExtent" in Selection.prototype) {
            selection.setBaseAndExtent(
              range.startContainer,
              range.startOffset,
              range.endContainer,
              range.endOffset
            );
          } else {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
      return this;
    }
    // ---
    _moveCursorTo(toStart) {
      const root = this._root;
      const range = createRange(root, toStart ? 0 : root.childNodes.length);
      moveRangeBoundariesDownTree(range);
      this.setSelection(range);
      return this;
    }
    moveCursorToStart() {
      return this._moveCursorTo(true);
    }
    moveCursorToEnd() {
      return this._moveCursorTo(false);
    }
    // ---
    getCursorPosition() {
      const range = this.getSelection();
      let rect = range.getBoundingClientRect();
      if (rect && !rect.top) {
        this._ignoreChange = true;
        const node = createElement("SPAN");
        node.textContent = ZWS;
        insertNodeInRange(range, node);
        rect = node.getBoundingClientRect();
        const parent = node.parentNode;
        parent.removeChild(node);
        mergeInlines(parent, range);
      }
      return rect;
    }
    // --- Path
    getPath() {
      return this._path;
    }
    _updatePathOnEvent() {
      if (this._isFocused) {
        this._updatePath(this.getSelection());
      }
    }
    _updatePath(range, force) {
      const anchor = range.startContainer;
      const focus = range.endContainer;
      let newPath;
      if (force || anchor !== this._lastAnchorNode || focus !== this._lastFocusNode) {
        this._lastAnchorNode = anchor;
        this._lastFocusNode = focus;
        newPath = anchor && focus ? anchor === focus ? this._getPath(focus) : "(selection)" : "";
        if (this._path !== newPath || anchor !== focus) {
          this._path = newPath;
          this.fireEvent("pathChange", {
            path: newPath
          });
        }
      }
      this.fireEvent(range.collapsed ? "cursor" : "select", {
        range
      });
    }
    _getPath(node) {
      const root = this._root;
      const config = this._config;
      let path = "";
      if (node && node !== root) {
        const parent = node.parentNode;
        path = parent ? this._getPath(parent) : "";
        if (node instanceof HTMLElement) {
          const id = node.id;
          const classList = node.classList;
          const classNames = Array.from(classList).sort();
          const dir = node.dir;
          const styleNames = config.classNames;
          path += (path ? ">" : "") + node.nodeName;
          if (id) {
            path += "#" + id;
          }
          if (classNames.length) {
            path += ".";
            path += classNames.join(".");
          }
          if (dir) {
            path += "[dir=" + dir + "]";
          }
          if (classList.contains(styleNames.highlight)) {
            path += "[backgroundColor=" + node.style.backgroundColor.replace(/ /g, "") + "]";
          }
          if (classList.contains(styleNames.color)) {
            path += "[color=" + node.style.color.replace(/ /g, "") + "]";
          }
          if (classList.contains(styleNames.fontFamily)) {
            path += "[fontFamily=" + node.style.fontFamily.replace(/ /g, "") + "]";
          }
          if (classList.contains(styleNames.fontSize)) {
            path += "[fontSize=" + node.style.fontSize + "]";
          }
        }
      }
      return path;
    }
    // --- History
    modifyDocument(modificationFn) {
      const mutation = this._mutation;
      if (mutation) {
        if (mutation.takeRecords().length) {
          this._docWasChanged();
        }
        mutation.disconnect();
      }
      this._ignoreAllChanges = true;
      modificationFn();
      this._ignoreAllChanges = false;
      if (mutation) {
        mutation.observe(this._root, {
          childList: true,
          attributes: true,
          characterData: true,
          subtree: true
        });
        this._ignoreChange = false;
      }
      return this;
    }
    _docWasChanged() {
      resetNodeCategoryCache();
      this._mayHaveZWS = true;
      if (this._ignoreAllChanges) {
        return;
      }
      if (this._ignoreChange) {
        this._ignoreChange = false;
        return;
      }
      if (this._isInUndoState) {
        this._isInUndoState = false;
        this.fireEvent("undoStateChange", {
          canUndo: true,
          canRedo: false
        });
      }
      this.fireEvent("input");
    }
    /**
     * Leaves bookmark.
     */
    _recordUndoState(range, replace) {
      const isInUndoState = this._isInUndoState;
      if (!isInUndoState || replace) {
        let undoIndex = this._undoIndex + 1;
        const undoStack = this._undoStack;
        const undoConfig = this._config.undo;
        const undoThreshold = undoConfig.documentSizeThreshold;
        const undoLimit = undoConfig.undoLimit;
        if (undoIndex < this._undoStackLength) {
          undoStack.length = this._undoStackLength = undoIndex;
        }
        if (range) {
          this._saveRangeToBookmark(range);
        }
        if (isInUndoState) {
          return this;
        }
        const html2 = this._getRawHTML();
        if (replace) {
          undoIndex -= 1;
        }
        if (undoThreshold > -1 && html2.length * 2 > undoThreshold) {
          if (undoLimit > -1 && undoIndex > undoLimit) {
            undoStack.splice(0, undoIndex - undoLimit);
            undoIndex = undoLimit;
            this._undoStackLength = undoLimit;
          }
        }
        undoStack[undoIndex] = html2;
        this._undoIndex = undoIndex;
        this._undoStackLength += 1;
        this._isInUndoState = true;
      }
      return this;
    }
    saveUndoState(range) {
      if (!range) {
        range = this.getSelection();
      }
      this._recordUndoState(range, this._isInUndoState);
      this._getRangeAndRemoveBookmark(range);
      return this;
    }
    undo() {
      if (this._undoIndex !== 0 || !this._isInUndoState) {
        this._recordUndoState(this.getSelection(), false);
        this._undoIndex -= 1;
        this._setRawHTML(this._undoStack[this._undoIndex]);
        const range = this._getRangeAndRemoveBookmark();
        if (range) {
          this.setSelection(range);
        }
        this._isInUndoState = true;
        this.fireEvent("undoStateChange", {
          canUndo: this._undoIndex !== 0,
          canRedo: true
        });
        this.fireEvent("input");
      }
      return this.focus();
    }
    redo() {
      const undoIndex = this._undoIndex;
      const undoStackLength = this._undoStackLength;
      if (undoIndex + 1 < undoStackLength && this._isInUndoState) {
        this._undoIndex += 1;
        this._setRawHTML(this._undoStack[this._undoIndex]);
        const range = this._getRangeAndRemoveBookmark();
        if (range) {
          this.setSelection(range);
        }
        this.fireEvent("undoStateChange", {
          canUndo: true,
          canRedo: undoIndex + 2 < undoStackLength
        });
        this.fireEvent("input");
      }
      return this.focus();
    }
    // --- Get and set data
    getRoot() {
      return this._root;
    }
    _getRawHTML() {
      return this._root.innerHTML;
    }
    _setRawHTML(html2) {
      const root = this._root;
      root.innerHTML = html2;
      let node = root;
      const child = node.firstChild;
      if (!child || child.nodeName === "BR") {
        const block = this.createDefaultBlock();
        if (child) {
          node.replaceChild(block, child);
        } else {
          node.appendChild(block);
        }
      } else {
        while (node = getNextBlock(node, root)) {
          fixCursor(node);
        }
      }
      this._ignoreChange = true;
      return this;
    }
    getHTML(withBookmark) {
      let range;
      if (withBookmark) {
        range = this.getSelection();
        this._saveRangeToBookmark(range);
      }
      const html2 = this._getRawHTML().replace(/\u200B/g, "");
      if (withBookmark) {
        this._getRangeAndRemoveBookmark(range);
      }
      return html2;
    }
    setHTML(html2) {
      const frag = this._config.sanitizeToDOMFragment(html2, this);
      const root = this._root;
      cleanTree(frag, this._config);
      cleanupBRs(frag, root, false);
      fixContainer(frag, root);
      let node = frag;
      let child = node.firstChild;
      if (!child || child.nodeName === "BR") {
        const block = this.createDefaultBlock();
        if (child) {
          node.replaceChild(block, child);
        } else {
          node.appendChild(block);
        }
      } else {
        while (node = getNextBlock(node, root)) {
          fixCursor(node);
        }
      }
      this._ignoreChange = true;
      while (child = root.lastChild) {
        root.removeChild(child);
      }
      root.appendChild(frag);
      this._undoIndex = -1;
      this._undoStack.length = 0;
      this._undoStackLength = 0;
      this._isInUndoState = false;
      const range = this._getRangeAndRemoveBookmark() || createRange(root.firstElementChild || root, 0);
      this.saveUndoState(range);
      this.setSelection(range);
      this._updatePath(range, true);
      return this;
    }
    /**
     * Insert HTML at the cursor location. If the selection is not collapsed
     * insertTreeFragmentIntoRange will delete the selection so that it is
     * replaced by the html being inserted.
     */
    insertHTML(html2, isPaste) {
      const config = this._config;
      let frag = config.sanitizeToDOMFragment(html2, this);
      const range = this.getSelection();
      this.saveUndoState(range);
      try {
        const root = this._root;
        if (config.addLinks) {
          this.addDetectedLinks(frag, frag);
        }
        cleanTree(frag, this._config);
        cleanupBRs(frag, root, false);
        removeEmptyInlines(frag);
        frag.normalize();
        let node = frag;
        while (node = getNextBlock(node, frag)) {
          fixCursor(node);
        }
        let doInsert = true;
        if (isPaste) {
          const event = new CustomEvent("willPaste", {
            cancelable: true,
            detail: {
              html: html2,
              fragment: frag
            }
          });
          this.fireEvent("willPaste", event);
          frag = event.detail.fragment;
          doInsert = !event.defaultPrevented;
        }
        if (doInsert) {
          insertTreeFragmentIntoRange(range, frag, root);
          range.collapse(false);
          moveRangeBoundaryOutOf(range, "A", root);
          this._ensureBottomLine();
        }
        this.setSelection(range);
        this._updatePath(range, true);
        if (isPaste) {
          this.focus();
        }
      } catch (error) {
        this._config.didError(error);
      }
      return this;
    }
    insertElement(el, range) {
      if (!range) {
        range = this.getSelection();
      }
      range.collapse(true);
      if (isInline(el)) {
        insertNodeInRange(range, el);
        range.setStartAfter(el);
      } else {
        const root = this._root;
        const startNode = getStartBlockOfRange(
          range,
          root
        );
        let splitNode = startNode || root;
        let nodeAfterSplit = null;
        while (splitNode !== root && !splitNode.nextSibling) {
          splitNode = splitNode.parentNode;
        }
        if (splitNode !== root) {
          const parent = splitNode.parentNode;
          nodeAfterSplit = split(
            parent,
            splitNode.nextSibling,
            root,
            root
          );
        }
        if (startNode && isEmptyBlock(startNode)) {
          detach(startNode);
        }
        root.insertBefore(el, nodeAfterSplit);
        const blankLine = this.createDefaultBlock();
        root.insertBefore(blankLine, nodeAfterSplit);
        range.setStart(blankLine, 0);
        range.setEnd(blankLine, 0);
        moveRangeBoundariesDownTree(range);
      }
      this.focus();
      this.setSelection(range);
      this._updatePath(range);
      return this;
    }
    insertImage(src, attributes) {
      const img = createElement(
        "IMG",
        Object.assign(
          {
            src
          },
          attributes
        )
      );
      this.insertElement(img);
      return img;
    }
    insertPlainText(plainText, isPaste) {
      const range = this.getSelection();
      if (range.collapsed && getNearest(range.startContainer, this._root, "PRE")) {
        const startContainer = range.startContainer;
        let offset = range.startOffset;
        let textNode;
        if (!startContainer || !(startContainer instanceof Text)) {
          const text = document.createTextNode("");
          startContainer.insertBefore(
            text,
            startContainer.childNodes[offset]
          );
          textNode = text;
          offset = 0;
        } else {
          textNode = startContainer;
        }
        let doInsert = true;
        if (isPaste) {
          const event = new CustomEvent("willPaste", {
            cancelable: true,
            detail: {
              text: plainText
            }
          });
          this.fireEvent("willPaste", event);
          plainText = event.detail.text;
          doInsert = !event.defaultPrevented;
        }
        if (doInsert) {
          textNode.insertData(offset, plainText);
          range.setStart(textNode, offset + plainText.length);
          range.collapse(true);
        }
        this.setSelection(range);
        return this;
      }
      const lines = plainText.split("\n");
      const config = this._config;
      const tag = config.blockTag;
      const attributes = config.blockAttributes;
      const closeBlock = "</" + tag + ">";
      let openBlock = "<" + tag;
      for (const attr in attributes) {
        openBlock += " " + attr + '="' + escapeHTML(attributes[attr]) + '"';
      }
      openBlock += ">";
      for (let i = 0, l = lines.length; i < l; i += 1) {
        let line = lines[i];
        line = escapeHTML(line).replace(/ (?=(?: |$))/g, "&nbsp;");
        if (i) {
          line = openBlock + (line || "<BR>") + closeBlock;
        }
        lines[i] = line;
      }
      return this.insertHTML(lines.join(""), isPaste);
    }
    getSelectedText(range) {
      return getTextContentsOfRange(range || this.getSelection());
    }
    // --- Inline formatting
    /**
     * Extracts the font-family and font-size (if any) of the element
     * holding the cursor. If there's a selection, returns an empty object.
     */
    getFontInfo(range) {
      const fontInfo = {
        color: void 0,
        backgroundColor: void 0,
        fontFamily: void 0,
        fontSize: void 0
      };
      if (!range) {
        range = this.getSelection();
      }
      moveRangeBoundariesDownTree(range);
      let seenAttributes = 0;
      let element = range.commonAncestorContainer;
      if (range.collapsed || element instanceof Text) {
        if (element instanceof Text) {
          element = element.parentNode;
        }
        while (seenAttributes < 4 && element) {
          const style = element.style;
          if (style) {
            const color = style.color;
            if (!fontInfo.color && color) {
              fontInfo.color = color;
              seenAttributes += 1;
            }
            const backgroundColor = style.backgroundColor;
            if (!fontInfo.backgroundColor && backgroundColor) {
              fontInfo.backgroundColor = backgroundColor;
              seenAttributes += 1;
            }
            const fontFamily = style.fontFamily;
            if (!fontInfo.fontFamily && fontFamily) {
              fontInfo.fontFamily = fontFamily;
              seenAttributes += 1;
            }
            const fontSize = style.fontSize;
            if (!fontInfo.fontSize && fontSize) {
              fontInfo.fontSize = fontSize;
              seenAttributes += 1;
            }
          }
          element = element.parentNode;
        }
      }
      return fontInfo;
    }
    /**
     * Looks for matching tag and attributes, so won't work if <strong>
     * instead of <b> etc.
     */
    hasFormat(tag, attributes, range) {
      tag = tag.toUpperCase();
      if (!attributes) {
        attributes = {};
      }
      if (!range) {
        range = this.getSelection();
      }
      if (!range.collapsed && range.startContainer instanceof Text && range.startOffset === range.startContainer.length && range.startContainer.nextSibling) {
        range.setStartBefore(range.startContainer.nextSibling);
      }
      if (!range.collapsed && range.endContainer instanceof Text && range.endOffset === 0 && range.endContainer.previousSibling) {
        range.setEndAfter(range.endContainer.previousSibling);
      }
      const root = this._root;
      const common = range.commonAncestorContainer;
      if (getNearest(common, root, tag, attributes)) {
        return true;
      }
      if (common instanceof Text) {
        return false;
      }
      const walker = new TreeIterator(common, SHOW_TEXT, (node2) => {
        return isNodeContainedInRange(range, node2, true);
      });
      let seenNode = false;
      let node;
      while (node = walker.nextNode()) {
        if (!getNearest(node, root, tag, attributes)) {
          return false;
        }
        seenNode = true;
      }
      return seenNode;
    }
    changeFormat(add, remove, range, partial) {
      if (!range) {
        range = this.getSelection();
      }
      this.saveUndoState(range);
      if (remove) {
        range = this._removeFormat(
          remove.tag.toUpperCase(),
          remove.attributes || {},
          range,
          partial
        );
      }
      if (add) {
        range = this._addFormat(
          add.tag.toUpperCase(),
          add.attributes || {},
          range
        );
      }
      this.setSelection(range);
      this._updatePath(range, true);
      return this.focus();
    }
    _addFormat(tag, attributes, range) {
      const root = this._root;
      if (range.collapsed) {
        const el = fixCursor(createElement(tag, attributes));
        insertNodeInRange(range, el);
        const focusNode = el.firstChild || el;
        const focusOffset = focusNode instanceof Text ? focusNode.length : 0;
        range.setStart(focusNode, focusOffset);
        range.collapse(true);
        let block = el;
        while (isInline(block)) {
          block = block.parentNode;
        }
        removeZWS(block, el);
      } else {
        const walker = new TreeIterator(
          range.commonAncestorContainer,
          SHOW_ELEMENT_OR_TEXT,
          (node) => {
            return (node instanceof Text || node.nodeName === "BR" || node.nodeName === "IMG") && isNodeContainedInRange(range, node, true);
          }
        );
        let { startContainer, startOffset, endContainer, endOffset } = range;
        walker.currentNode = startContainer;
        if (!(startContainer instanceof Element) && !(startContainer instanceof Text) || !walker.filter(startContainer)) {
          const next = walker.nextNode();
          if (!next) {
            return range;
          }
          startContainer = next;
          startOffset = 0;
        }
        do {
          let node = walker.currentNode;
          const needsFormat = !getNearest(node, root, tag, attributes);
          if (needsFormat) {
            if (node === endContainer && node.length > endOffset) {
              node.splitText(endOffset);
            }
            if (node === startContainer && startOffset) {
              node = node.splitText(startOffset);
              if (endContainer === startContainer) {
                endContainer = node;
                endOffset -= startOffset;
              } else if (endContainer === startContainer.parentNode) {
                endOffset += 1;
              }
              startContainer = node;
              startOffset = 0;
            }
            const el = createElement(tag, attributes);
            replaceWith(node, el);
            el.appendChild(node);
          }
        } while (walker.nextNode());
        range = createRange(
          startContainer,
          startOffset,
          endContainer,
          endOffset
        );
      }
      return range;
    }
    _removeFormat(tag, attributes, range, partial) {
      this._saveRangeToBookmark(range);
      let fixer;
      if (range.collapsed) {
        if (cantFocusEmptyTextNodes) {
          fixer = document.createTextNode(ZWS);
        } else {
          fixer = document.createTextNode("");
        }
        insertNodeInRange(range, fixer);
      }
      let root = range.commonAncestorContainer;
      while (isInline(root)) {
        root = root.parentNode;
      }
      const startContainer = range.startContainer;
      const startOffset = range.startOffset;
      const endContainer = range.endContainer;
      const endOffset = range.endOffset;
      const toWrap = [];
      const examineNode = (node, exemplar) => {
        if (isNodeContainedInRange(range, node, false)) {
          return;
        }
        let child;
        let next;
        if (!isNodeContainedInRange(range, node, true)) {
          if (!(node instanceof HTMLInputElement) && (!(node instanceof Text) || node.data)) {
            toWrap.push([exemplar, node]);
          }
          return;
        }
        if (node instanceof Text) {
          if (node === endContainer && endOffset !== node.length) {
            toWrap.push([exemplar, node.splitText(endOffset)]);
          }
          if (node === startContainer && startOffset) {
            node.splitText(startOffset);
            toWrap.push([exemplar, node]);
          }
        } else {
          for (child = node.firstChild; child; child = next) {
            next = child.nextSibling;
            examineNode(child, exemplar);
          }
        }
      };
      const formatTags = Array.from(
        root.getElementsByTagName(tag)
      ).filter((el) => {
        return isNodeContainedInRange(range, el, true) && hasTagAttributes(el, tag, attributes);
      });
      if (!partial) {
        formatTags.forEach((node) => {
          examineNode(node, node);
        });
      }
      toWrap.forEach(([el, node]) => {
        el = el.cloneNode(false);
        replaceWith(node, el);
        el.appendChild(node);
      });
      formatTags.forEach((el) => {
        replaceWith(el, empty(el));
      });
      if (cantFocusEmptyTextNodes && fixer) {
        fixer = fixer.parentNode;
        let block = fixer;
        while (block && isInline(block)) {
          block = block.parentNode;
        }
        if (block) {
          removeZWS(block, fixer);
        }
      }
      this._getRangeAndRemoveBookmark(range);
      if (fixer) {
        range.collapse(false);
      }
      mergeInlines(root, range);
      return range;
    }
    // ---
    bold() {
      return this.changeFormat({ tag: "B" });
    }
    removeBold() {
      return this.changeFormat(null, { tag: "B" });
    }
    italic() {
      return this.changeFormat({ tag: "I" });
    }
    removeItalic() {
      return this.changeFormat(null, { tag: "I" });
    }
    underline() {
      return this.changeFormat({ tag: "U" });
    }
    removeUnderline() {
      return this.changeFormat(null, { tag: "U" });
    }
    strikethrough() {
      return this.changeFormat({ tag: "S" });
    }
    removeStrikethrough() {
      return this.changeFormat(null, { tag: "S" });
    }
    subscript() {
      return this.changeFormat({ tag: "SUB" }, { tag: "SUP" });
    }
    removeSubscript() {
      return this.changeFormat(null, { tag: "SUB" });
    }
    superscript() {
      return this.changeFormat({ tag: "SUP" }, { tag: "SUB" });
    }
    removeSuperscript() {
      return this.changeFormat(null, { tag: "SUP" });
    }
    // ---
    makeLink(url, attributes) {
      const range = this.getSelection();
      if (range.collapsed) {
        let protocolEnd = url.indexOf(":") + 1;
        if (protocolEnd) {
          while (url[protocolEnd] === "/") {
            protocolEnd += 1;
          }
        }
        insertNodeInRange(
          range,
          document.createTextNode(url.slice(protocolEnd))
        );
      }
      attributes = Object.assign(
        {
          href: url
        },
        this._config.tagAttributes.a,
        attributes
      );
      return this.changeFormat(
        {
          tag: "A",
          attributes
        },
        {
          tag: "A"
        },
        range
      );
    }
    removeLink() {
      return this.changeFormat(
        null,
        {
          tag: "A"
        },
        this.getSelection(),
        true
      );
    }
    addDetectedLinks(searchInNode, root) {
      const walker = new TreeIterator(
        searchInNode,
        SHOW_TEXT,
        (node2) => !getNearest(node2, root || this._root, "A")
      );
      const linkRegExp = this.linkRegExp;
      const defaultAttributes = this._config.tagAttributes.a;
      let node;
      while (node = walker.nextNode()) {
        const parent = node.parentNode;
        let data = node.data;
        let match;
        while (match = linkRegExp.exec(data)) {
          const index = match.index;
          const endIndex = index + match[0].length;
          if (index) {
            parent.insertBefore(
              document.createTextNode(data.slice(0, index)),
              node
            );
          }
          const child = createElement(
            "A",
            Object.assign(
              {
                href: match[1] ? /^(?:ht|f)tps?:/i.test(match[1]) ? match[1] : "http://" + match[1] : "mailto:" + match[0]
              },
              defaultAttributes
            )
          );
          child.textContent = data.slice(index, endIndex);
          parent.insertBefore(child, node);
          node.data = data = data.slice(endIndex);
        }
      }
      return this;
    }
    // ---
    setFontFace(name2) {
      const className = this._config.classNames.fontFamily;
      return this.changeFormat(
        name2 ? {
          tag: "SPAN",
          attributes: {
            class: className,
            style: "font-family: " + name2 + ", sans-serif;"
          }
        } : null,
        {
          tag: "SPAN",
          attributes: { class: className }
        }
      );
    }
    setFontSize(size) {
      const className = this._config.classNames.fontSize;
      return this.changeFormat(
        size ? {
          tag: "SPAN",
          attributes: {
            class: className,
            style: "font-size: " + (typeof size === "number" ? size + "px" : size)
          }
        } : null,
        {
          tag: "SPAN",
          attributes: { class: className }
        }
      );
    }
    setTextColor(color) {
      const className = this._config.classNames.color;
      return this.changeFormat(
        color ? {
          tag: "SPAN",
          attributes: {
            class: className,
            style: "color:" + color
          }
        } : null,
        {
          tag: "SPAN",
          attributes: { class: className }
        }
      );
    }
    setHighlightColor(color) {
      const className = this._config.classNames.highlight;
      return this.changeFormat(
        color ? {
          tag: "SPAN",
          attributes: {
            class: className,
            style: "background-color:" + color
          }
        } : null,
        {
          tag: "SPAN",
          attributes: { class: className }
        }
      );
    }
    // --- Block formatting
    _ensureBottomLine() {
      const root = this._root;
      const last = root.lastElementChild;
      if (!last || last.nodeName !== this._config.blockTag || !isBlock(last)) {
        root.appendChild(this.createDefaultBlock());
      }
    }
    createDefaultBlock(children) {
      const config = this._config;
      return fixCursor(
        createElement(config.blockTag, config.blockAttributes, children)
      );
    }
    splitBlock(lineBreakOnly, range) {
      if (!range) {
        range = this.getSelection();
      }
      const root = this._root;
      let block;
      let parent;
      let node;
      let nodeAfterSplit;
      this._recordUndoState(range);
      this._removeZWS();
      this._getRangeAndRemoveBookmark(range);
      if (!range.collapsed) {
        deleteContentsOfRange(range, root);
      }
      if (this._config.addLinks) {
        moveRangeBoundariesDownTree(range);
        const textNode = range.startContainer;
        const offset2 = range.startOffset;
        setTimeout(() => {
          linkifyText(this, textNode, offset2);
        }, 0);
      }
      block = getStartBlockOfRange(range, root);
      if (block && (parent = getNearest(block, root, "PRE"))) {
        moveRangeBoundariesDownTree(range);
        node = range.startContainer;
        const offset2 = range.startOffset;
        if (!(node instanceof Text)) {
          node = document.createTextNode("");
          parent.insertBefore(node, parent.firstChild);
        }
        if (!lineBreakOnly && node instanceof Text && (node.data.charAt(offset2 - 1) === "\n" || rangeDoesStartAtBlockBoundary(range, root)) && (node.data.charAt(offset2) === "\n" || rangeDoesEndAtBlockBoundary(range, root))) {
          node.deleteData(offset2 && offset2 - 1, offset2 ? 2 : 1);
          nodeAfterSplit = split(
            node,
            offset2 && offset2 - 1,
            root,
            root
          );
          node = nodeAfterSplit.previousSibling;
          if (!node.textContent) {
            detach(node);
          }
          node = this.createDefaultBlock();
          nodeAfterSplit.parentNode.insertBefore(node, nodeAfterSplit);
          if (!nodeAfterSplit.textContent) {
            detach(nodeAfterSplit);
          }
          range.setStart(node, 0);
        } else {
          node.insertData(offset2, "\n");
          fixCursor(parent);
          if (node.length === offset2 + 1) {
            range.setStartAfter(node);
          } else {
            range.setStart(node, offset2 + 1);
          }
        }
        range.collapse(true);
        this.setSelection(range);
        this._updatePath(range, true);
        this._docWasChanged();
        return this;
      }
      if (!block || lineBreakOnly || /^T[HD]$/.test(block.nodeName)) {
        moveRangeBoundaryOutOf(range, "A", root);
        insertNodeInRange(range, createElement("BR"));
        range.collapse(false);
        this.setSelection(range);
        this._updatePath(range, true);
        return this;
      }
      if (parent = getNearest(block, root, "LI")) {
        block = parent;
      }
      if (isEmptyBlock(block)) {
        if (getNearest(block, root, "UL") || getNearest(block, root, "OL")) {
          this.decreaseListLevel(range);
          return this;
        } else if (getNearest(block, root, "BLOCKQUOTE")) {
          this.replaceWithBlankLine(range);
          return this;
        }
      }
      node = range.startContainer;
      const offset = range.startOffset;
      let splitTag = this.tagAfterSplit[block.nodeName];
      nodeAfterSplit = split(
        node,
        offset,
        block.parentNode,
        this._root
      );
      const config = this._config;
      let splitProperties = null;
      if (!splitTag) {
        splitTag = config.blockTag;
        splitProperties = config.blockAttributes;
      }
      if (!hasTagAttributes(nodeAfterSplit, splitTag, splitProperties)) {
        block = createElement(splitTag, splitProperties);
        if (nodeAfterSplit.dir) {
          block.dir = nodeAfterSplit.dir;
        }
        replaceWith(nodeAfterSplit, block);
        block.appendChild(empty(nodeAfterSplit));
        nodeAfterSplit = block;
      }
      removeZWS(block);
      removeEmptyInlines(block);
      fixCursor(block);
      while (nodeAfterSplit instanceof Element) {
        let child = nodeAfterSplit.firstChild;
        let next;
        if (nodeAfterSplit.nodeName === "A" && (!nodeAfterSplit.textContent || nodeAfterSplit.textContent === ZWS)) {
          child = document.createTextNode("");
          replaceWith(nodeAfterSplit, child);
          nodeAfterSplit = child;
          break;
        }
        while (child && child instanceof Text && !child.data) {
          next = child.nextSibling;
          if (!next || next.nodeName === "BR") {
            break;
          }
          detach(child);
          child = next;
        }
        if (!child || child.nodeName === "BR" || child instanceof Text) {
          break;
        }
        nodeAfterSplit = child;
      }
      range = createRange(nodeAfterSplit, 0);
      this.setSelection(range);
      this._updatePath(range, true);
      return this;
    }
    forEachBlock(fn, mutates, range) {
      if (!range) {
        range = this.getSelection();
      }
      if (mutates) {
        this.saveUndoState(range);
      }
      const root = this._root;
      let start = getStartBlockOfRange(range, root);
      const end = getEndBlockOfRange(range, root);
      if (start && end) {
        do {
          if (fn(start) || start === end) {
            break;
          }
        } while (start = getNextBlock(start, root));
      }
      if (mutates) {
        this.setSelection(range);
        this._updatePath(range, true);
      }
      return this;
    }
    modifyBlocks(modify, range) {
      if (!range) {
        range = this.getSelection();
      }
      this._recordUndoState(range, this._isInUndoState);
      const root = this._root;
      expandRangeToBlockBoundaries(range, root);
      moveRangeBoundariesUpTree(range, root, root, root);
      const frag = extractContentsOfRange(range, root, root);
      if (!range.collapsed) {
        let node = range.endContainer;
        if (node === root) {
          range.collapse(false);
        } else {
          while (node.parentNode !== root) {
            node = node.parentNode;
          }
          range.setStartBefore(node);
          range.collapse(true);
        }
      }
      insertNodeInRange(range, modify.call(this, frag));
      if (range.endOffset < range.endContainer.childNodes.length) {
        mergeContainers(
          range.endContainer.childNodes[range.endOffset],
          root
        );
      }
      mergeContainers(
        range.startContainer.childNodes[range.startOffset],
        root
      );
      this._getRangeAndRemoveBookmark(range);
      this.setSelection(range);
      this._updatePath(range, true);
      return this;
    }
    // ---
    setTextAlignment(alignment) {
      this.forEachBlock((block) => {
        const className = block.className.split(/\s+/).filter((klass) => {
          return !!klass && !/^align/.test(klass);
        }).join(" ");
        if (alignment) {
          block.className = className + " align-" + alignment;
          block.style.textAlign = alignment;
        } else {
          block.className = className;
          block.style.textAlign = "";
        }
      }, true);
      return this.focus();
    }
    setTextDirection(direction) {
      this.forEachBlock((block) => {
        if (direction) {
          block.dir = direction;
        } else {
          block.removeAttribute("dir");
        }
      }, true);
      return this.focus();
    }
    // ---
    _getListSelection(range, root) {
      let list = range.commonAncestorContainer;
      let startLi = range.startContainer;
      let endLi = range.endContainer;
      while (list && list !== root && !/^[OU]L$/.test(list.nodeName)) {
        list = list.parentNode;
      }
      if (!list || list === root) {
        return null;
      }
      if (startLi === list) {
        startLi = startLi.childNodes[range.startOffset];
      }
      if (endLi === list) {
        endLi = endLi.childNodes[range.endOffset];
      }
      while (startLi && startLi.parentNode !== list) {
        startLi = startLi.parentNode;
      }
      while (endLi && endLi.parentNode !== list) {
        endLi = endLi.parentNode;
      }
      return [list, startLi, endLi];
    }
    increaseListLevel(range) {
      if (!range) {
        range = this.getSelection();
      }
      const root = this._root;
      const listSelection = this._getListSelection(range, root);
      if (!listSelection) {
        return this.focus();
      }
      let [list, startLi, endLi] = listSelection;
      if (!startLi || startLi === list.firstChild) {
        return this.focus();
      }
      this._recordUndoState(range, this._isInUndoState);
      const type = list.nodeName;
      let newParent = startLi.previousSibling;
      let listAttrs;
      let next;
      if (newParent.nodeName !== type) {
        listAttrs = this._config.tagAttributes[type.toLowerCase()];
        newParent = createElement(type, listAttrs);
        list.insertBefore(newParent, startLi);
      }
      do {
        next = startLi === endLi ? null : startLi.nextSibling;
        newParent.appendChild(startLi);
      } while (startLi = next);
      next = newParent.nextSibling;
      if (next) {
        mergeContainers(next, root);
      }
      this._getRangeAndRemoveBookmark(range);
      this.setSelection(range);
      this._updatePath(range, true);
      return this.focus();
    }
    decreaseListLevel(range) {
      if (!range) {
        range = this.getSelection();
      }
      const root = this._root;
      const listSelection = this._getListSelection(range, root);
      if (!listSelection) {
        return this.focus();
      }
      let [list, startLi, endLi] = listSelection;
      if (!startLi) {
        startLi = list.firstChild;
      }
      if (!endLi) {
        endLi = list.lastChild;
      }
      this._recordUndoState(range, this._isInUndoState);
      let next;
      let insertBefore = null;
      if (startLi) {
        let newParent = list.parentNode;
        insertBefore = !endLi.nextSibling ? list.nextSibling : split(list, endLi.nextSibling, newParent, root);
        if (newParent !== root && newParent.nodeName === "LI") {
          newParent = newParent.parentNode;
          while (insertBefore) {
            next = insertBefore.nextSibling;
            endLi.appendChild(insertBefore);
            insertBefore = next;
          }
          insertBefore = list.parentNode.nextSibling;
        }
        const makeNotList = !/^[OU]L$/.test(newParent.nodeName);
        do {
          next = startLi === endLi ? null : startLi.nextSibling;
          list.removeChild(startLi);
          if (makeNotList && startLi.nodeName === "LI") {
            startLi = this.createDefaultBlock([empty(startLi)]);
          }
          newParent.insertBefore(startLi, insertBefore);
        } while (startLi = next);
      }
      if (!list.firstChild) {
        detach(list);
      }
      if (insertBefore) {
        mergeContainers(insertBefore, root);
      }
      this._getRangeAndRemoveBookmark(range);
      this.setSelection(range);
      this._updatePath(range, true);
      return this.focus();
    }
    _makeList(frag, type) {
      const walker = getBlockWalker(frag, this._root);
      const tagAttributes = this._config.tagAttributes;
      const listAttrs = tagAttributes[type.toLowerCase()];
      const listItemAttrs = tagAttributes.li;
      let node;
      while (node = walker.nextNode()) {
        if (node.parentNode instanceof HTMLLIElement) {
          node = node.parentNode;
          walker.currentNode = node.lastChild;
        }
        if (!(node instanceof HTMLLIElement)) {
          const newLi = createElement("LI", listItemAttrs);
          if (node.dir) {
            newLi.dir = node.dir;
          }
          const prev = node.previousSibling;
          if (prev && prev.nodeName === type) {
            prev.appendChild(newLi);
            detach(node);
          } else {
            replaceWith(node, createElement(type, listAttrs, [newLi]));
          }
          newLi.appendChild(empty(node));
          walker.currentNode = newLi;
        } else {
          node = node.parentNode;
          const tag = node.nodeName;
          if (tag !== type && /^[OU]L$/.test(tag)) {
            replaceWith(
              node,
              createElement(type, listAttrs, [empty(node)])
            );
          }
        }
      }
      return frag;
    }
    makeUnorderedList() {
      this.modifyBlocks((frag) => this._makeList(frag, "UL"));
      return this.focus();
    }
    makeOrderedList() {
      this.modifyBlocks((frag) => this._makeList(frag, "OL"));
      return this.focus();
    }
    removeList() {
      this.modifyBlocks((frag) => {
        const lists = frag.querySelectorAll("UL, OL");
        const items = frag.querySelectorAll("LI");
        const root = this._root;
        for (let i = 0, l = lists.length; i < l; i += 1) {
          const list = lists[i];
          const listFrag = empty(list);
          fixContainer(listFrag, root);
          replaceWith(list, listFrag);
        }
        for (let i = 0, l = items.length; i < l; i += 1) {
          const item = items[i];
          if (isBlock(item)) {
            replaceWith(item, this.createDefaultBlock([empty(item)]));
          } else {
            fixContainer(item, root);
            replaceWith(item, empty(item));
          }
        }
        return frag;
      });
      return this.focus();
    }
    // ---
    increaseQuoteLevel(range) {
      this.modifyBlocks(
        (frag) => createElement(
          "BLOCKQUOTE",
          this._config.tagAttributes.blockquote,
          [frag]
        ),
        range
      );
      return this.focus();
    }
    decreaseQuoteLevel(range) {
      this.modifyBlocks((frag) => {
        Array.from(frag.querySelectorAll("blockquote")).filter((el) => {
          return !getNearest(el.parentNode, frag, "BLOCKQUOTE");
        }).forEach((el) => {
          replaceWith(el, empty(el));
        });
        return frag;
      }, range);
      return this.focus();
    }
    removeQuote(range) {
      this.modifyBlocks((frag) => {
        Array.from(frag.querySelectorAll("blockquote")).forEach(
          (el) => {
            replaceWith(el, empty(el));
          }
        );
        return frag;
      }, range);
      return this.focus();
    }
    replaceWithBlankLine(range) {
      this.modifyBlocks(
        () => this.createDefaultBlock([
          createElement("INPUT", {
            id: this.startSelectionId,
            type: "hidden"
          }),
          createElement("INPUT", {
            id: this.endSelectionId,
            type: "hidden"
          })
        ]),
        range
      );
      return this.focus();
    }
    // ---
    code() {
      const range = this.getSelection();
      if (range.collapsed || isContainer(range.commonAncestorContainer)) {
        this.modifyBlocks((frag) => {
          const root = this._root;
          const output = document.createDocumentFragment();
          const blockWalker = getBlockWalker(frag, root);
          let node;
          while (node = blockWalker.nextNode()) {
            let nodes = node.querySelectorAll("BR");
            const brBreaksLine = [];
            let l = nodes.length;
            for (let i = 0; i < l; i += 1) {
              brBreaksLine[i] = isLineBreak(nodes[i], false);
            }
            while (l--) {
              const br = nodes[l];
              if (!brBreaksLine[l]) {
                detach(br);
              } else {
                replaceWith(br, document.createTextNode("\n"));
              }
            }
            nodes = node.querySelectorAll("CODE");
            l = nodes.length;
            while (l--) {
              replaceWith(nodes[l], empty(nodes[l]));
            }
            if (output.childNodes.length) {
              output.appendChild(document.createTextNode("\n"));
            }
            output.appendChild(empty(node));
          }
          const textWalker = new TreeIterator(output, SHOW_TEXT);
          while (node = textWalker.nextNode()) {
            node.data = node.data.replace(/ /g, " ");
          }
          output.normalize();
          return fixCursor(
            createElement("PRE", this._config.tagAttributes.pre, [
              output
            ])
          );
        }, range);
        this.focus();
      } else {
        this.changeFormat(
          {
            tag: "CODE",
            attributes: this._config.tagAttributes.code
          },
          null,
          range
        );
      }
      return this;
    }
    removeCode() {
      const range = this.getSelection();
      const ancestor = range.commonAncestorContainer;
      const inPre = getNearest(ancestor, this._root, "PRE");
      if (inPre) {
        this.modifyBlocks((frag) => {
          const root = this._root;
          const pres = frag.querySelectorAll("PRE");
          let l = pres.length;
          while (l--) {
            const pre = pres[l];
            const walker = new TreeIterator(pre, SHOW_TEXT);
            let node;
            while (node = walker.nextNode()) {
              let value = node.data;
              value = value.replace(/ (?= )/g, "\xA0");
              const contents = document.createDocumentFragment();
              let index;
              while ((index = value.indexOf("\n")) > -1) {
                contents.appendChild(
                  document.createTextNode(value.slice(0, index))
                );
                contents.appendChild(createElement("BR"));
                value = value.slice(index + 1);
              }
              node.parentNode.insertBefore(contents, node);
              node.data = value;
            }
            fixContainer(pre, root);
            replaceWith(pre, empty(pre));
          }
          return frag;
        }, range);
        this.focus();
      } else {
        this.changeFormat(null, { tag: "CODE" }, range);
      }
      return this;
    }
    toggleCode() {
      if (this.hasFormat("PRE") || this.hasFormat("CODE")) {
        this.removeCode();
      } else {
        this.code();
      }
      return this;
    }
    // ---
    _removeFormatting(root, clean) {
      for (let node = root.firstChild, next; node; node = next) {
        next = node.nextSibling;
        if (isInline(node)) {
          if (node instanceof Text || node.nodeName === "BR" || node.nodeName === "IMG") {
            clean.appendChild(node);
            continue;
          }
        } else if (isBlock(node)) {
          clean.appendChild(
            this.createDefaultBlock([
              this._removeFormatting(
                node,
                document.createDocumentFragment()
              )
            ])
          );
          continue;
        }
        this._removeFormatting(node, clean);
      }
      return clean;
    }
    removeAllFormatting(range) {
      if (!range) {
        range = this.getSelection();
      }
      if (range.collapsed) {
        return this.focus();
      }
      const root = this._root;
      let stopNode = range.commonAncestorContainer;
      while (stopNode && !isBlock(stopNode)) {
        stopNode = stopNode.parentNode;
      }
      if (!stopNode) {
        expandRangeToBlockBoundaries(range, root);
        stopNode = root;
      }
      if (stopNode instanceof Text) {
        return this.focus();
      }
      this.saveUndoState(range);
      moveRangeBoundariesUpTree(range, stopNode, stopNode, root);
      const startContainer = range.startContainer;
      let startOffset = range.startOffset;
      const endContainer = range.endContainer;
      let endOffset = range.endOffset;
      const formattedNodes = document.createDocumentFragment();
      const cleanNodes = document.createDocumentFragment();
      const nodeAfterSplit = split(endContainer, endOffset, stopNode, root);
      let nodeInSplit = split(startContainer, startOffset, stopNode, root);
      let nextNode;
      while (nodeInSplit !== nodeAfterSplit) {
        nextNode = nodeInSplit.nextSibling;
        formattedNodes.appendChild(nodeInSplit);
        nodeInSplit = nextNode;
      }
      this._removeFormatting(formattedNodes, cleanNodes);
      cleanNodes.normalize();
      nodeInSplit = cleanNodes.firstChild;
      nextNode = cleanNodes.lastChild;
      if (nodeInSplit) {
        stopNode.insertBefore(cleanNodes, nodeAfterSplit);
        const childNodes = Array.from(stopNode.childNodes);
        startOffset = childNodes.indexOf(nodeInSplit);
        endOffset = nextNode ? childNodes.indexOf(nextNode) + 1 : 0;
      } else if (nodeAfterSplit) {
        const childNodes = Array.from(stopNode.childNodes);
        startOffset = childNodes.indexOf(nodeAfterSplit);
        endOffset = startOffset;
      }
      range.setStart(stopNode, startOffset);
      range.setEnd(stopNode, endOffset);
      mergeInlines(stopNode, range);
      moveRangeBoundariesDownTree(range);
      this.setSelection(range);
      this._updatePath(range, true);
      return this.focus();
    }
  };
  var Squire_default = Squire;

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

  // src/utils/EventfulElement.js
  var observer = new window.IntersectionObserver((entries, obs) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      const target = entry.target;
      obs.unobserve(target);
      target.doCreate();
    });
  });
  var EventfulElement = class extends FormidableElement_default {
    get events() {
      return [];
    }
    parsedCallback() {
      this.lazy = this.hasAttribute("lazy");
      if (!this.config) {
        if (this.lazy) {
          observer.observe(this);
        } else {
          this.doCreate();
        }
      }
      if (this.config) {
        this.connected();
      }
    }
    doCreate() {
      this.config = replaceCallbacks_default(simpleConfig_default(this.dataset.config));
      this.created();
    }
    connectedCallback() {
      super.connectedCallback();
      this.events.forEach((t) => this.addEventListener(t, this));
    }
    trackFocus(ev) {
      if (ev.type == "focusin") {
        this.classList.add("has-focus");
      } else if (ev.type == "focusout") {
        this.classList.remove("has-focus");
      }
    }
    // Use arrow function to make sure that the scope is always this and cannot be rebound
    // Automatically call any $event method (don't use "on" as prefix as it will collide with existing handler)
    handleEvent = (ev) => {
      this.trackFocus(ev);
      this[`$${ev.type}`](ev);
    };
    disconnectedCallback() {
      if (this.lazy && this.config) {
        observer.unobserve(this);
      }
      this.events.forEach((t) => this.removeEventListener(t, this));
      super.disconnectedCallback();
    }
  };
  var EventfulElement_default = EventfulElement;

  // src/utils/ce.js
  var ce_default = (tagName) => {
    return document.createElement(tagName);
  };

  // src/utils/query.js
  function s(tagName, selector, ctx) {
    selector = selector || tagName;
    if (ctx.nodeType == 1) {
      selector = `:scope ${selector}`;
    }
    return selector;
  }
  function q(tagName, selector = null, ctx = document) {
    return ctx.querySelector(s(tagName, selector, ctx));
  }

  // src/utils/parseHTML.js
  var parseHTML_default = (html2) => {
    const template = ce_default("template");
    template.innerHTML = html2;
    return template.content;
  };

  // src/utils/setHTML.js
  function setHTML(el, html2, force = false) {
    if (window.Sanitizer && !force) {
      el.setHTML(html2);
    } else if (window["DOMPurify"]) {
      el.innerHTML = window["DOMPurify"].sanitize(html2, {
        WHOLE_DOCUMENT: false,
        FORCE_BODY: false
      });
    } else {
      el.innerHTML = html2;
    }
  }
  async function loadDOMPurify(force = false) {
    if ((!window.Sanitizer || force) && !window["DOMPurify"]) {
      window["DOMPurify"] = (await import("https://cdn.jsdelivr.net/npm/dompurify@3/+esm")).default;
    }
  }

  // src/utils/hasBootstrap.js
  var hasBootstrap_default = () => {
    return !!window.bootstrap;
  };

  // src/utils/bootstrap-icons.js
  var bold = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
</svg>`;
  var italic = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
</svg>`;
  var underline = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
</svg>`;
  var strikethrough = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z"/>
</svg>`;
  var code = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
</svg>`;
  var link = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
<path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
</svg>`;
  var removeFormat = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
<path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8ZM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1Z" fill-rule="evenodd"></path>
</svg>`;
  var h1 = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z"/>
</svg>`;
  var h2 = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z"/>
</svg>`;
  var h3 = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z"/>
</svg>`;
  var unorderedList = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg>`;
  var orderedList = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
<path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
</svg>`;
  var quote = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
</svg>`;
  var image = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
</svg>`;
  var undo = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg>`;
  var redo = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
</svg>`;
  var html = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-9.736 7.35v3.999h-.791v-1.714H1.79v1.714H1V11.85h.791v1.626h1.682V11.85h.79Zm2.251.662v3.337h-.794v-3.337H4.588v-.662h3.064v.662H6.515Zm2.176 3.337v-2.66h.038l.952 2.159h.516l.946-2.16h.038v2.661h.715V11.85h-.8l-1.14 2.596H9.93L8.79 11.85h-.805v3.999h.706Zm4.71-.674h1.696v.674H12.61V11.85h.79v3.325Z"/>
</svg>`;

  // src/utils/props.js
  function props(el, obj, prop = null) {
    const target = prop ? el[prop] : el;
    Object.assign(target, obj);
  }

  // src/classes/SquireEditor.js
  var FORCE_DOMPURIFY = false;
  var name = "squire-editor";
  function adjustStyles(editor, toolbar, textarea) {
    if (textarea.style.height) {
      textarea.dataset.fixedHeight = "1";
    }
    if (textarea.style.height || textarea.style.maxHeight) {
      if (editor) {
        editor.style.height = textarea.style.height;
        editor.style.maxHeight = textarea.style.maxHeight;
        editor.style.overflowY = "scroll";
        editor.style.borderTopRightRadius = "0";
        editor.style.borderBottomRightRadius = "0";
      }
      textarea.style.borderTopRightRadius = "0";
      textarea.style.borderBottomRightRadius = "0";
      textarea.style.overflowY = "scroll";
    }
    if (!editor || !toolbar) {
      return;
    }
    const editorStyles = window.getComputedStyle(editor);
    const toolbarStyles = window.getComputedStyle(toolbar);
    const textareaStyles = window.getComputedStyle(textarea);
    const scrollbarWidth = editor.offsetWidth - editor.clientWidth;
    if (!editor.dataset.defaultPadding) {
      editor.dataset.defaultPadding = editorStyles.paddingTop;
    }
    if (!textarea.dataset.defaultPadding) {
      textarea.dataset.defaultPadding = textareaStyles.paddingTop;
    }
    toolbar.style.top = `${editorStyles.borderTopWidth}`;
    toolbar.style.left = `${editorStyles.borderLeftWidth}`;
    toolbar.style.right = `${parseInt(editorStyles.borderRightWidth) + scrollbarWidth}px`;
    if (!textarea.style.height && !textarea.style.maxHeight) {
      toolbar.style.borderTopRightRadius = `${textareaStyles.borderTopRightRadius}`;
    }
    toolbar.style.borderTopLeftRadius = `${textareaStyles.borderTopLeftRadius}`;
    editor.style.paddingTop = `calc(${editor.dataset.defaultPadding} + ${toolbarStyles.height})`;
    textarea.style.paddingTop = `calc(${textarea.dataset.defaultPadding} + ${toolbarStyles.height})`;
  }
  function checkButtonActive(btn, el, editor) {
    if (btn.format) {
      if (editor.hasFormat(btn.format)) {
        el.classList.add("is-active");
      } else {
        el.classList.remove("is-active");
      }
    }
  }
  var resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const t = entry.target;
      const w = t.offsetWidth.toString();
      if (w == t.dataset.width) {
        continue;
      }
      t.dataset.width = w;
      if (entry.contentBoxSize) {
        const textarea = q("textarea", null, t);
        const editor = q("div", ".squire-input", t);
        const toolbar = q("div", ".squire-toolbar", t);
        adjustStyles(editor, toolbar, textarea);
      }
    }
  });
  var SquireEditor = class extends EventfulElement_default {
    /**
     * @returns {HTMLTextAreaElement}
     */
    get el() {
      return q("textarea", null, this);
    }
    get value() {
      return this.el.value;
    }
    created() {
      if (!this.el) {
        const el2 = ce_default("textarea");
        props(el2, {
          name: this.getAttribute("name"),
          // this should be sanitized by yourself
          value: this.getAttribute("value")
        });
        if (hasBootstrap_default()) {
          el2.classList.add("form-control");
        }
        this.appendChild(el2);
      }
      this.classList.add(name);
      const el = this.el;
      el.setAttribute("hidden", "");
      el.spellcheck = false;
      this.init();
    }
    async init() {
      await loadDOMPurify(FORCE_DOMPURIFY);
      let toolbar = q("div", ".squire-toolbar", this);
      let editor = q("div", ".squire-input", this);
      if (toolbar) {
        toolbar.remove();
      }
      if (editor) {
        editor.remove();
      }
      const hasToolbar = !this.dataset.toolbar;
      this.buttons = [];
      if (hasToolbar) {
        toolbar = ce_default("div");
        toolbar.classList.add("squire-toolbar");
        this.appendChild(toolbar);
        const buttons = [
          [
            {
              name: "bold",
              action: "bold",
              format: "b",
              removeAction: "removeBold",
              icon: bold
            },
            {
              name: "italic",
              action: "italic",
              format: "i",
              removeAction: "removeItalic",
              icon: italic
            },
            {
              name: "underline",
              action: "underline",
              format: "u",
              removeAction: "removeUnderline",
              icon: underline
            },
            {
              name: "strikethrough",
              action: "strikethrough",
              format: "s",
              removeAction: "removeStrikethrough",
              icon: strikethrough
            },
            {
              name: "code",
              action: "code",
              format: "code",
              removeAction: "removeCode",
              icon: code
            },
            {
              name: "link",
              action: "makeLink",
              prompt: true,
              format: "a",
              removeAction: "removeLink",
              icon: link
            },
            {
              name: "remove_formatting",
              action: "removeAllFormatting",
              icon: removeFormat
            }
          ],
          [
            {
              name: "h1",
              action: "changeFormat",
              format: "h1",
              removeAction: "changeFormat",
              icon: h1
            },
            {
              name: "h2",
              action: "changeFormat",
              format: "h2",
              removeAction: "changeFormat",
              icon: h2
            },
            {
              name: "h3",
              action: "changeFormat",
              format: "h3",
              removeAction: "changeFormat",
              icon: h3
            },
            {
              name: "ul",
              action: "makeUnorderedList",
              format: "ul",
              removeAction: "removeList",
              icon: unorderedList
            },
            {
              name: "ol",
              action: "makeOrderedList",
              format: "ol",
              removeAction: "removeList",
              icon: orderedList
            },
            {
              name: "quote",
              action: "increaseQuoteLevel",
              format: "blockquote",
              removeAction: "removeQuote",
              icon: quote
            },
            {
              name: "image",
              action: "insertImage",
              prompt: true,
              icon: image
            }
          ],
          [
            {
              name: "undo",
              action: "undo",
              icon: undo
            },
            {
              name: "redo",
              action: "redo",
              icon: redo
            },
            {
              name: "html",
              customAction: "html",
              icon: html
            }
          ]
        ];
        const allowedButtons = this.dataset.buttons ? this.dataset.buttons.split(",") : [];
        const makeButton = (btn, parent = toolbar) => {
          if (allowedButtons.length && !allowedButtons.includes(btn.name)) {
            return;
          }
          const el = ce_default("button");
          el.type = "button";
          el.innerHTML = btn.icon;
          el.dataset.action = btn.customAction || btn.action;
          el.dataset.removeAction = btn.removeAction || "";
          el.dataset.format = btn.format || "";
          el.dataset.prompt = btn.prompt || "";
          el.ariaLabel = btn.name;
          parent.appendChild(el);
          this.buttons.push({
            el,
            btn
          });
        };
        buttons.forEach((btn) => {
          if (Array.isArray(btn)) {
            const group = ce_default("div");
            group.classList.add("squire-toolbar-group");
            toolbar.appendChild(group);
            btn.forEach((subBtn) => makeButton(subBtn, group));
          } else {
            makeButton(btn);
          }
        });
      }
      editor = ce_default("div");
      editor.classList.add("squire-input");
      if (hasBootstrap_default()) {
        editor.classList.add("form-control");
      }
      this.appendChild(editor);
      const textarea = this.el;
      adjustStyles(editor, toolbar, textarea);
      this.config = Object.assign(
        {
          //@link https://github.com/fastmail/Squire/issues/432
          blockTag: "div",
          blockAttributes: { class: "paragraph" },
          tagAttributes: {
            blockquote: { class: "blockquote" }
          },
          sanitizeToDOMFragment: (html2, editor2) => {
            const tmp = ce_default("div");
            setHTML(tmp, html2, FORCE_DOMPURIFY);
            const frag = parseHTML_default(tmp.innerHTML);
            return frag ? document.importNode(frag, true) : document.createDocumentFragment();
          }
        },
        this.config
      );
      const allowPaste = this.dataset.allowPaste;
      const pasteSize = this.dataset.pasteSize || 1920;
      this.squire = new Squire_default(editor, this.config);
      this.squire.setHTML(textarea.value);
      this.squire.addEventListener("input", () => {
        const html2 = this.squire.getHTML();
        this.el.value = html2;
      });
      this.squire.addEventListener("cursor", () => {
        const cursorPosition = this.squire.getCursorPosition();
        if (!cursorPosition) {
          return;
        }
        const scrollViewOffsetTop = editor.getBoundingClientRect().top;
        const offsetTop = cursorPosition.top - scrollViewOffsetTop;
        const offsetBottom = cursorPosition.bottom - scrollViewOffsetTop;
        let scrollBy = 0;
        const topToolbarHeight = 0;
        const scrollViewHeight = editor.offsetHeight;
        const minimumGapToScrollEdge = 16;
        if (offsetTop < topToolbarHeight + minimumGapToScrollEdge) {
          scrollBy = offsetTop - topToolbarHeight - minimumGapToScrollEdge;
        } else if (offsetBottom > scrollViewHeight - minimumGapToScrollEdge) {
          scrollBy = offsetBottom + minimumGapToScrollEdge - scrollViewHeight;
        }
        if (scrollBy) {
          editor.scrollBy(0, Math.round(scrollBy));
        }
        this.buttons.forEach((obj) => {
          checkButtonActive(obj.btn, obj.el, this.squire);
        });
      });
      if (allowPaste) {
        this.squire.addEventListener("pasteImage", (event) => {
          const items = [...event.detail.clipboardData.items];
          const imageItems = items.filter((item) => /image/.test(item.type));
          if (!imageItems.length) {
            return false;
          }
          let reader = new FileReader();
          reader.onload = (loadEvent) => {
            const data = "" + loadEvent.target.result;
            const ed = this.squire;
            var image2 = new Image();
            image2.src = data;
            image2.onload = function() {
              if (this.width > pasteSize || this.height > pasteSize) {
                alert(`Your images need to be less than ${pasteSize} pixels in height and width.`);
                return;
              }
              ed.insertImage(data);
            };
          };
          reader.readAsDataURL(imageItems[0].getAsFile());
        });
      }
    }
    connected() {
      this.addEventListener("click", this);
      this.addEventListener("input", this);
      resizeObserver.observe(this);
    }
    disconnected() {
      this.removeEventListener("click", this);
      this.removeEventListener("input", this);
      resizeObserver.unobserve(this);
    }
    destroyed() {
      if (this.squire) {
        this.squire.destroy();
        this.squire = null;
      }
      this.buttons = null;
    }
    $input(ev) {
      const textarea = this.el;
      if (ev.target === textarea && !textarea.dataset.fixedHeight) {
        textarea.style.height = "0";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    }
    $click(ev) {
      const btn = ev.target.closest("button");
      if (!btn) {
        return;
      }
      const ed = this.squire;
      let action = btn.dataset.action;
      let removeAction = btn.dataset.removeAction;
      const format = btn.dataset.format;
      const prompt = btn.dataset.prompt;
      let value, otherValue;
      const editor = q("div", ".squire-input", this);
      if (action === "html") {
        const textarea = q("textarea", null, this);
        if (textarea.hasAttribute("hidden")) {
          if (!textarea.dataset.fixedHeight) {
            const h = Math.max(parseInt(window.getComputedStyle(editor).height), textarea.scrollHeight);
            textarea.style.height = h + "px";
          }
          editor.setAttribute("hidden", "");
          textarea.removeAttribute("hidden");
          this.buttons.forEach((obj) => {
            if (obj.btn.action) {
              obj.el.setAttribute("disabled", "disabled");
              obj.el.classList.remove("is-active");
            }
          });
        } else {
          this.squire.setHTML(textarea.value);
          textarea.setAttribute("hidden", "");
          editor.removeAttribute("hidden");
          this.buttons.forEach((obj) => {
            if (obj.btn.action) {
              obj.el.removeAttribute("disabled");
            }
          });
        }
        return;
      }
      if (action && ed && ed[action]) {
        if (editor.hasAttribute("hidden")) {
          return;
        }
        const selection = ed.getSelection();
        if (format && removeAction && ed.hasFormat(format)) {
          if (removeAction === "changeFormat") {
            value = null;
            otherValue = { tag: format };
          }
          ed[removeAction](value, otherValue);
        } else {
          if (prompt) {
            if (selection.collapsed && format) {
              return;
            }
            value = window.prompt();
            if (!value) {
              ed[removeAction](value, otherValue);
              return;
            }
          }
          if (action === "changeFormat") {
            value = { tag: format };
          }
          ed[action](value, otherValue);
        }
      }
    }
  };
  var SquireEditor_default = SquireEditor;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name2, cls) => {
    if (!registry.get(name2)) {
      registry.define(name2, cls);
    }
  };

  // src/css/squire-editor.min.css
  var squire_editor_min_default = ".squire-editor{position:relative;display:block}.squire-editor *{box-sizing:border-box}.squire-editor textarea{font-family:ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,'DejaVu Sans Mono',monospace;width:100%;overflow:hidden}.squire-editor .squire-toolbar{position:absolute;background:var(--bs-tertiary-bg,#efefef);z-index:2}.squire-editor .squire-toolbar-group{border-right:1px solid rgba(100,100,100,.2);display:inline-block}.squire-editor .squire-toolbar-group:last-child{border-right:0}.squire-editor .squire-toolbar button{border:0;height:38px;width:38px;background:0 0}.squire-editor .squire-toolbar button.is-active,.squire-editor .squire-toolbar button:hover{background:rgba(100,100,100,.2)}";

  // src/utils/injectStyles.js
  var injectStyles_default = (name2, styles) => {
    if (!document.head.querySelector(`#${name2}-style`)) {
      const style = document.createElement("style");
      style.id = `${name2}-style`;
      style.innerText = styles;
      document.head.append(style);
    }
  };

  // src/squire-editor.js
  injectStyles_default("squire-editor", squire_editor_min_default);
  defineEl_default("squire-editor", SquireEditor_default);
  var squire_editor_default = SquireEditor_default;
})();
