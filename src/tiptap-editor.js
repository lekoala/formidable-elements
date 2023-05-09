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
.tiptap-editor .tiptap-toolbar button:hover {
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

    this.classList.add("tiptap-editor");

    const el = this.el;
    el.setAttribute("hidden", "");
    el.style.overflow = "hidden";
    el.spellcheck = false;

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
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
        </svg>`,
          },
          {
            name: "italic",
            action: "toggleItalic",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
        </svg>`,
          },
          {
            name: "underline",
            action: "toggleUnderline",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
        </svg>`,
          },
          {
            name: "strikethrough",
            action: "toggleStrike",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z"/>
          </svg>`,
          },
          {
            name: "code",
            action: "toggleCode",
            icon: `<svg width="16" height="16" fill="currentColor" class="bi bi-code" viewBox="0 0 16 16">
          <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
        </svg>`,
          },
          {
            name: "link",
            action: "toggleLink",
            prompt: "href",
            params: { href: null },
            icon: `<svg width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
          </svg>`,
          },
          {
            name: "remove_formatting",
            action: "unsetAllMarks",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" focusable="false">
          <path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8ZM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1Z" fill-rule="evenodd"></path>
        </svg>`,
          },
        ],
        [
          {
            name: "p",
            action: "setParagraph",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.5 15a.5.5 0 0 1-.5-.5V2H9v12.5a.5.5 0 0 1-1 0V9H7a4 4 0 1 1 0-8h5.5a.5.5 0 0 1 0 1H11v12.5a.5.5 0 0 1-.5.5z"/>
          </svg>`,
          },
          {
            name: "h1",
            action: "toggleHeading",
            params: { level: 1 },
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.637 13V3.669H7.379V7.62H2.758V3.67H1.5V13h1.258V8.728h4.62V13h1.259zm5.329 0V3.669h-1.244L10.5 5.316v1.265l2.16-1.565h.062V13h1.244z"/>
          </svg>`,
          },
          {
            name: "h2",
            action: "toggleHeading",
            params: { level: 2 },
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z"/>
          </svg>`,
          },
          {
            name: "h3",
            action: "toggleHeading",
            params: { level: 3 },
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.637 13V3.669H6.379V7.62H1.758V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.625-4.272h1.018c1.142 0 1.935.67 1.949 1.674.013 1.005-.78 1.737-2.01 1.73-1.08-.007-1.853-.588-1.935-1.32H9.108c.069 1.327 1.224 2.386 3.083 2.386 1.935 0 3.343-1.155 3.309-2.789-.027-1.51-1.251-2.16-2.037-2.249v-.068c.704-.123 1.764-.91 1.723-2.229-.035-1.353-1.176-2.4-2.954-2.385-1.873.006-2.857 1.162-2.898 2.358h1.196c.062-.69.711-1.299 1.696-1.299.998 0 1.695.622 1.695 1.525.007.922-.718 1.592-1.695 1.592h-.964v1.074z"/>
          </svg>`,
          },
          {
            name: "ul",
            action: "toggleBulletList",
            removeAction: "removeList",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>`,
          },
          {
            name: "ol",
            action: "toggleOrderedList",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
            <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
          </svg>`,
          },
          {
            name: "quote",
            action: "toggleBlockquote",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
          </svg>`,
          },
          {
            name: "codeblock",
            action: "toggleCodeBlock",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z"/>
          </svg>`,
          },
          {
            name: "hr",
            action: "setHorizontalRule",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.25 7a.25.25 0 0 0-.25.25v1c0 .138.112.25.25.25h11.5a.25.25 0 0 0 .25-.25v-1a.25.25 0 0 0-.25-.25H2.25Z"/>
          </svg>`,
          },
          {
            name: "image",
            action: "setImage",
            prompt: "src",
            params: { src: null },
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
          </svg>`,
          },
        ],
        [
          {
            name: "undo",
            action: "undo",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
          </svg>`,
          },
          {
            name: "redo",
            action: "redo",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
          </svg>`,
          },
          {
            name: "html",
            customAction: "html",
            icon: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-9.736 7.35v3.999h-.791v-1.714H1.79v1.714H1V11.85h.791v1.626h1.682V11.85h.79Zm2.251.662v3.337h-.794v-3.337H4.588v-.662h3.064v.662H6.515Zm2.176 3.337v-2.66h.038l.952 2.159h.516l.946-2.16h.038v2.661h.715V11.85h-.8l-1.14 2.596H9.93L8.79 11.85h-.805v3.999h.706Zm4.71-.674h1.696v.674H12.61V11.85h.79v3.325Z"/>
          </svg>`,
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
          };
        }
        el.ariaLabel = btn.name; // to improve
        parent.appendChild(el);
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
    //@link https://github.com/system-fonts/modern-font-stacks#monospace-code
    textarea.style.fontFamily = "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace";

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
      } else {
        // Inject html back in
        this.tiptap.commands.setContent(textarea.value);

        textarea.setAttribute("hidden", "");
        editor.removeAttribute("hidden");
      }
      return;
    }
  }

  destroyed() {
    this.tiptap.destroy();
    this.tiptap = null;
  }
}

if (!customElements.get(name)) {
  customElements.define(name, TiptapEditor);
}

export default TiptapEditor;
