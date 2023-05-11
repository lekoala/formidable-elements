import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Dropcursor from "@tiptap/extension-dropcursor";
import HardBreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import { Image as ImageExtension } from "@tiptap/extension-image";

import FormidableElement from "./utils/formidable-element.js";
import ce from "./utils/ce.js";
import { q } from "./utils/query.js";
import hasBootstrap from "./utils/hasBootstrap.js";
import injectStyles from "./utils/injectStyles.js";
import * as icons from "./utils/bootstrap-icons.js";
import { MonospaceCode } from "./utils/font-stacks.js";

const name = "tiptap-editor";

const styles = `
.tiptap-editor {
  position:relative;
  display:block;
}
.tiptap-editor .tiptap-toolbar {
  position:absolute;
  background:var(--bs-tertiary-bg, #EFEFEF);
  overflow:hidden;
  z-index:2;
}
.tiptap-editor .tiptap-toolbar-group {
  border-right:1px solid rgba(100,100,100,0.2);
  display:inline-block;
}
.tiptap-editor .tiptap-toolbar-group:last-child {
  border-right:0;
}
.tiptap-editor .tiptap-toolbar button {
  border:0;
  height:38px;
  width:38px;
  background:transparent;
}
.tiptap-editor .tiptap-toolbar button:not([disabled]):hover, .tiptap-editor .tiptap-toolbar button.is-active {
  background:rgba(100,100,100,0.2);
}
.tiptap-editor .ProseMirror-selectednode {
  border:2px solid var(--bs-focus-ring-color, rgba(13, 110, 253, 0.25))
}
`;
injectStyles(name, styles);

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
      const editor = q("div", ".tiptap-input", t);
      const toolbar = q("div", ".tiptap-toolbar", t);
      //@ts-ignore
      adjustStyles(editor.firstElementChild, toolbar, textarea);
    }
  }
});

/**
 */
class TiptapEditor extends FormidableElement {
  /**
   * @returns {HTMLTextAreaElement}
   */
  get el() {
    return q("textarea", null, this);
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
    el.style.overflow = "hidden";
    el.spellcheck = false;
    el.style.fontFamily = MonospaceCode;
    el.style.width = "100%";
    el.style.boxSizing = "border-box";

    this.init();
  }

  async init() {
    let toolbar = q("div", ".tiptap-toolbar", this);
    let editor = q("div", ".tiptap-input", this);
    if (toolbar) {
      toolbar.remove();
    }
    if (editor) {
      editor.remove();
    }

    // Create toolbar
    const hasToolbar = !this.dataset.toolbar;
    if (hasToolbar) {
      toolbar = ce("div");
      toolbar.classList.add("tiptap-toolbar");
      this.appendChild(toolbar);

      const buttons = [
        [
          {
            name: "bold",
            action: "toggleBold",
            icon: icons.bold,
          },
          {
            name: "italic",
            action: "toggleItalic",
            icon: icons.italic,
          },
          {
            name: "underline",
            action: "toggleUnderline",
            icon: icons.underline,
          },
          {
            name: "strikethrough",
            action: "toggleStrike",
            icon: icons.strikethrough,
          },
          {
            name: "code",
            action: "toggleCode",
            icon: icons.code,
          },
          {
            name: "link",
            action: "toggleLink",
            prompt: "href",
            params: { href: null },
            icon: icons.link,
          },
          {
            name: "remove_formatting",
            action: "unsetAllMarks",
            icon: icons.removeFormat,
          },
        ],
        [
          {
            name: "p",
            action: "setParagraph",
            icon: icons.p,
          },
          {
            name: "h1",
            action: "toggleHeading",
            params: { level: 1 },
            icon: icons.h1,
          },
          {
            name: "h2",
            action: "toggleHeading",
            params: { level: 2 },
            icon: icons.h2,
          },
          {
            name: "h3",
            action: "toggleHeading",
            params: { level: 3 },
            icon: icons.h3,
          },
          {
            name: "ul",
            action: "toggleBulletList",
            removeAction: "removeList",
            icon: icons.unorderedList,
          },
          {
            name: "ol",
            action: "toggleOrderedList",
            icon: icons.orderedList,
          },
          {
            name: "quote",
            action: "toggleBlockquote",
            icon: icons.quote,
          },
          {
            name: "codeblock",
            action: "toggleCodeBlock",
            icon: icons.codeBlock,
          },
          {
            name: "hr",
            action: "setHorizontalRule",
            icon: icons.hr,
          },
          {
            name: "image",
            action: "setImage",
            prompt: "src",
            params: { src: null },
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
      this.buttons = [];
      var checkButtonActive = (el, btn) => {
        const params = btn.prompt ? undefined : btn.params;
        if (this.tiptap.isActive(btn.name, params)) {
          el.classList.add("is-active");
        } else {
          el.classList.remove("is-active");
        }
      };
      const makeButton = (btn, parent = toolbar) => {
        if (allowedButtons.length && !allowedButtons.includes(btn.name)) {
          return;
        }
        const el = ce("button");
        el.type = "button";
        el.innerHTML = btn.icon;
        // Delegated to component
        el.dataset.action = btn.customAction || "";
        el.dataset.name = btn.name;
        el.dataset.prompt = btn.prompt || "";
        if (btn.action) {
          el.onclick = () => {
            if (editor.hasAttribute("hidden")) {
              return;
            }
            // Prompt ?
            if (btn.prompt) {
              const v = prompt();
              if (typeof btn.prompt === "string") {
                btn.params[btn.prompt] = v;
              } else {
                btn.params = v;
              }
            }
            this.tiptap.chain().focus()[btn.action](btn.params).run();
            checkButtonActive(el, btn);
          };
        }
        el.ariaLabel = btn.name; // to improve
        parent.appendChild(el);
        this.buttons.push({
          btn,
          el,
        });
      };
      buttons.forEach((btn) => {
        if (Array.isArray(btn)) {
          const group = ce("div");
          group.classList.add("tiptap-toolbar-group");
          toolbar.appendChild(group);
          btn.forEach((subBtn) => makeButton(subBtn, group));
        } else {
          makeButton(btn);
        }
      });
    }

    // Create editor div (inject content later)
    editor = ce("div");
    editor.classList.add("tiptap-input");
    this.appendChild(editor);

    const textarea = this.el;
    const allowPaste = this.dataset.allowPaste;
    const pasteSize = this.dataset.pasteSize || 1920;

    this.config = Object.assign(
      {
        extensions: [
          Document,
          Paragraph,
          Text,
          Heading.configure({
            levels: [1, 2, 3],
          }),
          Italic,
          Bold,
          Strike,
          Underline,
          Blockquote,
          Code,
          CodeBlock,
          Dropcursor,
          HardBreak,
          History,
          HorizontalRule,
          BulletList,
          ListItem,
          OrderedList,
          Typography,
          Link,
          ImageExtension,
        ],
        element: editor,
        editable: !textarea.readOnly && !textarea.disabled,
        content: textarea.value,
        //@link https://tiptap.dev/api/events#option-1-configuration
        onSelectionUpdate: ({ editor }) => {
          // Check which formatting options are enabled ?
          this.buttons.forEach((obj) => {
            checkButtonActive(obj.el, obj.btn);
          });
        },
        onUpdate: ({ editor }) => {
          const html = editor.getHTML();
          this.el.value = html;
        },
        //@link https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/style.ts
        // injectCSS: false,
        editorProps: {
          //@link https://www.codemzy.com/blog/tiptap-pasting-images
          handlePaste: (view, event, slice) => {
            if (!allowPaste) {
              return;
            }
            const items = [...event.clipboardData.items];
            const imageItems = items.filter((item) => /image/.test(item.type));
            if (!imageItems.length) {
              return false;
            }
            const ed = this.tiptap;
            const reader = new FileReader();
            reader.onload = function (loadEvent) {
              const data = "" + loadEvent.target.result;
              var image = new Image();
              image.src = data;
              image.onload = function () {
                // @ts-ignore
                if (this.width > pasteSize || this.height > pasteSize) {
                  alert(`Your images need to be less than ${pasteSize} pixels in height and width.`);
                  return;
                }
                //@ts-ignore
                ed.chain().focus().setImage({ src: data }).run();
              };
            };
            reader.readAsDataURL(imageItems[0].getAsFile());
          },
        },
      },
      this.config
    );
    this.tiptap = new Editor(this.config);

    if (hasBootstrap()) {
      // It's nested inside the editor
      editor.firstElementChild.classList.add("form-control");
    }
    // @ts-ignore
    adjustStyles(editor.firstElementChild, toolbar, textarea);
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

  handleEvent(ev) {
    this[`_${ev.type}`](ev);
  }

  _undoStateChange(ev) {
    this._input(ev);
  }

  _input(ev) {
    const textarea = this.el;
    if (ev.target === textarea && !textarea.dataset.fixedHeight) {
      // auto growing textarea
      textarea.style.height = "0";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }

  _click(ev) {
    const btn = ev.target.closest("button");
    if (!btn) {
      return;
    }

    let action = btn.dataset.action;

    // special html action
    if (action === "html") {
      const editor = q("div", ".tiptap-input", this);
      const textarea = q("textarea", null, this);
      if (textarea.hasAttribute("hidden")) {
        if (!textarea.dataset.fixedHeight) {
          const h = Math.max(parseInt(window.getComputedStyle(editor).height), textarea.scrollHeight);
          textarea.style.height = h + "px";
        }
        editor.setAttribute("hidden", "");
        textarea.removeAttribute("hidden");

        // disable all editor buttons
        this.buttons.forEach((btn) => {
          if (btn.btn.action) {
            btn.el.setAttribute("disabled", "disabled");
          }
        });
      } else {
        // Inject html back in
        this.tiptap.commands.setContent(textarea.value);

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
  }

  destroyed() {
    this.tiptap.destroy();
    this.tiptap = null;
    this.buttons = null;
  }
}

if (!customElements.get(name)) {
  customElements.define(name, TiptapEditor);
}

export default TiptapEditor;
