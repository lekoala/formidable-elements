import Editor from "../../node_modules/squire-rte/dist/squire-raw.mjs";

import EventfulElement from "../utils/EventfulElement.js";
import ce from "../utils/ce.js";
import { q } from "../utils/query.js";
import parseHTML from "../utils/parseHTML.js";
import setHTML, { loadDOMPurify } from "../utils/setHTML.js";
import hasBootstrap from "../utils/hasBootstrap.js";
import * as icons from "../utils/bootstrap-icons.js";

const FORCE_DOMPURIFY = false;
const name = "squire-editor";

/**
 * @param {HTMLElement} editor
 * @param {HTMLElement} toolbar
 * @param {HTMLElement} textarea
 */
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

/**
 * @param {Object} btn
 * @param {HTMLButtonElement} el
 * @param {Object} editor
 */
function checkButtonActive(btn, el, editor) {
  if (btn.format) {
    if (editor.hasFormat(btn.format)) {
      el.classList.add("is-active");
    } else {
      el.classList.remove("is-active");
    }
  }
}

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    /**
     * @type {HTMLElement}
     */
    //@ts-ignore
    const t = entry.target;
    // Only compute if width has changed
    const w = t.offsetWidth.toString();
    if (w == t.dataset.width) {
      continue;
    }
    t.dataset.width = w;
    if (entry.contentBoxSize) {
      const textarea = q("textarea", null, t);
      const editor = q("div", ".squire-input", t);
      const toolbar = q("div", ".squire-toolbar", t);
      //@ts-ignore
      adjustStyles(editor, toolbar, textarea);
    }
  }
});

/**
 */
class SquireEditor extends EventfulElement {
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
    // Allow creation of element if necessary
    if (!this.el) {
      const el = ce("textarea", {
        name: this.getAttribute("name"),
        // this should be sanitized by yourself
        value: this.getAttribute("value"),
      });
      if (hasBootstrap()) {
        el.classList.add("form-control");
      }
      this.appendChild(el);
    }
    this.classList.add(name);

    // Configure textarea
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

    // Create toolbar
    const hasToolbar = !this.dataset.toolbar;
    this.buttons = [];

    if (hasToolbar) {
      toolbar = ce("div");
      toolbar.classList.add("squire-toolbar");
      this.appendChild(toolbar);

      const buttons = [
        [
          {
            name: "bold",
            action: "bold",
            format: "b",
            removeAction: "removeBold",
            icon: icons.bold,
          },
          {
            name: "italic",
            action: "italic",
            format: "i",
            removeAction: "removeItalic",
            icon: icons.italic,
          },
          {
            name: "underline",
            action: "underline",
            format: "u",
            removeAction: "removeUnderline",
            icon: icons.underline,
          },
          {
            name: "strikethrough",
            action: "strikethrough",
            format: "s",
            removeAction: "removeStrikethrough",
            icon: icons.strikethrough,
          },
          {
            name: "code",
            action: "code",
            format: "code",
            removeAction: "removeCode",
            icon: icons.code,
          },
          {
            name: "link",
            action: "makeLink",
            prompt: true,
            format: "a",
            removeAction: "removeLink",
            icon: icons.link,
          },
          {
            name: "remove_formatting",
            action: "removeAllFormatting",
            icon: icons.removeFormat,
          },
        ],
        [
          {
            name: "h1",
            action: "changeFormat",
            format: "h1",
            removeAction: "changeFormat",
            icon: icons.h1,
          },
          {
            name: "h2",
            action: "changeFormat",
            format: "h2",
            removeAction: "changeFormat",
            icon: icons.h2,
          },
          {
            name: "h3",
            action: "changeFormat",
            format: "h3",
            removeAction: "changeFormat",
            icon: icons.h3,
          },
          {
            name: "ul",
            action: "makeUnorderedList",
            format: "ul",
            removeAction: "removeList",
            icon: icons.unorderedList,
          },
          {
            name: "ol",
            action: "makeOrderedList",
            format: "ol",
            removeAction: "removeList",
            icon: icons.orderedList,
          },
          {
            name: "quote",
            action: "increaseQuoteLevel",
            format: "blockquote",
            removeAction: "removeQuote",
            icon: icons.quote,
          },
          {
            name: "image",
            action: "insertImage",
            prompt: true,
            icon: icons.image,
          },
        ],
        [
          {
            name: "undo",
            action: "undo",
            icon: icons.undo,
          },
          {
            name: "redo",
            action: "redo",
            icon: icons.redo,
          },
          {
            name: "html",
            customAction: "html",
            icon: icons.html,
          },
        ],
      ];

      const allowedButtons = this.dataset.buttons ? this.dataset.buttons.split(",") : [];
      const makeButton = (btn, parent = toolbar) => {
        if (allowedButtons.length && !allowedButtons.includes(btn.name)) {
          return;
        }
        const el = ce("button");

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
          btn,
        });
      };
      buttons.forEach((btn) => {
        if (Array.isArray(btn)) {
          const group = ce("div");
          group.classList.add("squire-toolbar-group");
          toolbar.appendChild(group);
          btn.forEach((subBtn) => makeButton(subBtn, group));
        } else {
          makeButton(btn);
        }
      });
    }

    // Create editor div (inject content later)
    editor = ce("div");
    editor.classList.add("squire-input");
    if (hasBootstrap()) {
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
          blockquote: { class: "blockquote" },
        },
        sanitizeToDOMFragment: (html, editor) => {
          // not ideal, but in chrome, calling setHTML on a template doesn't seem to be working atm
          const tmp = ce("div");
          setHTML(tmp, html, FORCE_DOMPURIFY);
          const frag = parseHTML(tmp.innerHTML);
          return frag ? document.importNode(frag, true) : document.createDocumentFragment();
        },
      },
      this.config
    );

    const allowPaste = this.dataset.allowPaste;
    const pasteSize = this.dataset.pasteSize || 1920;

    // This will instantiate a new Squire instance.
    // Please note, this will remove any current children of the node;
    // you must use the setHTML command after initialising to set any content.
    this.squire = new Editor(editor, this.config);
    this.squire.setHTML(textarea.value);
    this.squire.addEventListener("input", () => {
      const html = this.squire.getHTML();
      this.el.value = html;
    });
    // Make sure cursor stays into view
    // @link https://github.com/fastmail/overture/blob/master/source/views/controls/RichTextView.js#L347
    this.squire.addEventListener("cursor", () => {
      const cursorPosition = this.squire.getCursorPosition();
      if (!cursorPosition) {
        return;
      }

      // Adjust position
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

      // Check which formatting options are enabled ?
      this.buttons.forEach((obj) => {
        checkButtonActive(obj.btn, obj.el, this.squire);
      });
    });

    // Opt in
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

          var image = new Image();
          image.src = data;
          image.onload = function () {
            // @ts-ignore
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

    // special action
    if (action === "html") {
      const textarea = q("textarea", null, this);
      if (textarea.hasAttribute("hidden")) {
        if (!textarea.dataset.fixedHeight) {
          const h = Math.max(parseInt(window.getComputedStyle(editor).height), textarea.scrollHeight);
          textarea.style.height = h + "px";
        }

        editor.setAttribute("hidden", "");
        textarea.removeAttribute("hidden");

        // disable all editor buttons
        this.buttons.forEach((obj) => {
          if (obj.btn.action) {
            obj.el.setAttribute("disabled", "disabled");
            obj.el.classList.remove("is-active");
          }
        });
      } else {
        // Inject html back in
        this.squire.setHTML(textarea.value);

        textarea.setAttribute("hidden", "");
        editor.removeAttribute("hidden");

        // enable all editor buttons
        this.buttons.forEach((obj) => {
          if (obj.btn.action) {
            obj.el.removeAttribute("disabled");
          }
        });
      }
      return;
    }

    if (action && ed && ed[action]) {
      // Editor is hidden
      if (editor.hasAttribute("hidden")) {
        return;
      }

      const selection = ed.getSelection();

      if (format && removeAction && ed.hasFormat(format)) {
        if (removeAction === "changeFormat") {
          // changeFormat(null, { tag: "B" });
          value = null;
          otherValue = { tag: format };
        }
        ed[removeAction](value, otherValue);
      } else {
        if (prompt) {
          // no selection
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
}

export default SquireEditor;
