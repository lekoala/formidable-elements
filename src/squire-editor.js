import Editor from "../node_modules/squire-rte/dist/squire.mjs";

import FormidableElement from "./utils/formidable-element.js";
import attr from "./utils/attr.js";
import ce from "./utils/ce.js";
import parseHTML from "./utils/parseHTML.js";
import setHTML, { loadDOMPurify } from "./utils/setHTML.js";
import hasBootstrap from "./utils/hasBootstrap.js";

const name = "squire-editor";

/**
 */
class SquireEditor extends FormidableElement {
  /**
   * @returns {HTMLTextAreaElement}
   */
  get el() {
    return this.querySelector("textarea");
  }

  created() {
    // Allow creation of element if necessary
    if (!this.el) {
      const el = ce("textarea");
      el.name = attr(this, "name");
      // this should be sanitized by yourself
      el.value = attr(this, "value");
      this.appendChild(el);
    }

    this.el.style.display = "none";

    this.init();
  }

  async init() {
    await loadDOMPurify(true);

    // Create toolbar
    const toolbar = ce("div");
    toolbar.classList.add(...["mb-2"]);
    this.appendChild(toolbar);

    const buttons = [
      [
        {
          action: "bold",
          format: "b",
          removeAction: "removeBold",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
      </svg>`,
        },
        {
          action: "italic",
          format: "i",
          removeAction: "removeItalic",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
      </svg>`,
        },
        {
          action: "underline",
          format: "u",
          removeAction: "removeUnderline",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
      </svg>`,
        },
        {
          action: "code",
          format: "code",
          removeAction: "removeCode",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code" viewBox="0 0 16 16">
        <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
      </svg>`,
        },
        {
          action: "removeAllFormatting",
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" focusable="false">
        <path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8ZM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1Z" fill-rule="evenodd"></path>
      </svg>`,
        },
      ],
      [
        {
          action: "makeLink",
          prompt: true,
          format: "a",
          removeAction: "removeLink",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
        </svg>`,
        },
        {
          action: "makeUnorderedList",
          format: "ul",
          removeAction: "removeList",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>`,
        },
        {
          action: "makeOrderedList",
          format: "ul",
          removeAction: "removeList",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
          <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
        </svg>`,
        },
        {
          action: "increaseQuoteLevel",
          format: "blockquote",
          removeAction: "removeQuote",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
        </svg>`,
        },
      ],
      [
        {
          action: "undo",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
          <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
        </svg>`,
        },
        {
          action: "redo",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
        </svg>`,
        },
      ],
    ];

    const makeButton = (btn, parent = toolbar) => {
      const el = ce("button");
      el.type = "button";
      el.classList.add(...["btn", "btn-light"]);
      el.innerHTML = btn.icon;
      el.dataset.action = btn.action;
      el.dataset.removeAction = btn.removeAction;
      el.dataset.format = btn.format;
      el.dataset.prompt = btn.prompt || "";
      parent.appendChild(el);
    };
    buttons.forEach((btn) => {
      if (Array.isArray(btn)) {
        const group = ce("div");
        group.classList.add(...["btn-group", "me-2"]);
        toolbar.appendChild(group);
        btn.forEach((subBtn) => makeButton(subBtn, group));
      } else {
        makeButton(btn);
      }
    });

    // Create editor div (inject content later)
    const editor = ce("div");
    if (hasBootstrap()) {
      editor.classList.add("form-control");
    }
    this.appendChild(editor);

    this.config = Object.assign(
      {
        blockTag: "p",
        tagAttributes: {
          blockquote: { class: "blockquote" },
        },
        sanitizeToDOMFragment: (html, editor) => {
          // not ideal, but in chrome, calling setHTML on a template doesn't seem to be working atm
          const tmp = ce("div");
          setHTML(tmp, html);
          const frag = parseHTML(tmp.innerHTML);
          return frag ? document.importNode(frag, true) : document.createDocumentFragment();
        },
      },
      this.config
    );

    // This will instantiate a new Squire instance.
    // Please note, this will remove any current children of the node;
    // you must use the setHTML command after initialising to set any content.
    this.editor = new Editor(editor, this.config);
    this.editor.setHTML(this.el.value);
  }

  connected() {
    this.addEventListener("click", this);
    this.addEventListener("input", this);
  }

  disconnected() {
    this.removeEventListener("click", this);
    this.removeEventListener("input", this);
  }

  handleEvent(ev) {
    this[`_${ev.type}`](ev);
  }

  _input(ev) {
    this.el.value = this.editor.getHTML();
  }

  _click(ev) {
    const btn = ev.target.closest("button");
    if (!btn) {
      return;
    }

    const ed = this.editor;
    const action = btn.dataset.action;
    const removeAction = btn.dataset.removeAction;
    const format = btn.dataset.format;
    const prompt = btn.dataset.prompt;

    const selection = ed.getSelection();

    let value;
    if (action && ed && ed[action]) {
      if (format && removeAction && ed.hasFormat(format)) {
        ed[removeAction]();
      } else {
        if (prompt) {
          // no selection
          if (selection.collapsed) {
            return;
          }
          value = window.prompt();
          if (!value) {
            ed[removeAction]();
            return;
          }
        }
        ed[action](value);
      }
    }
  }

  destroyed() {
    this.editor.destroy();
    this.editor = null;
  }
}

customElements.define(name, SquireEditor);

export default SquireEditor;
