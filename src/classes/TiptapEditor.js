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

import EventfulElement from "../utils/EventfulElement.js";
import ce from "../utils/ce.js";
import { q } from "../utils/query.js";
import hasBootstrap from "../utils/hasBootstrap.js";
import * as icons from "../utils/bootstrap-icons.js";
import { props } from "../utils/props.js";
import isExternalURL from "../utils/isExternalURL.js";
import dropmenu from "../utils/dropmenu.js";

const CLASS_PREFIX = "content-";
const name = "tiptap-editor";

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
	if (textarea.style.minHeight) {
		editor.style.minHeight = textarea.style.minHeight;
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
 * @param {Editor} editor
 */
function checkButtonActive(btn, el, editor) {
	const params = btn.params;
	if (editor.isActive(btn.name, params)) {
		el.classList.add("is-active");
	} else {
		el.classList.remove("is-active");
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
		if (w === t.dataset.width) {
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
 * Warning: loading prose mirror is tricky
 * https://github.com/ueberdosis/tiptap/issues/577
 */
class TiptapEditor extends EventfulElement {
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
			const el = ce("textarea");
			props(el, {
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
		el.style.minHeight = `${el.rows * 16}px`;

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
		this.buttons = [];
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
						icon: icons.html,
					},
				],
			];

			const allowedButtons = this.dataset.buttons
				? this.dataset.buttons.split(",")
				: [];
			const disallowedButtons = this.dataset.removeButtons
				? this.dataset.removeButtons.split(",")
				: [];
			const makeButton = (btn, parent = toolbar) => {
				const btnName = btn.name;
				if (allowedButtons.length && !allowedButtons.includes(btnName)) {
					return;
				}
				if (disallowedButtons.length && disallowedButtons.includes(btnName)) {
					return;
				}

				const el = ce("button");

				el.type = "button";
				el.innerHTML = btn.icon;
				el.dataset.name = btnName;

				const btnAction = btn.action;
				const btnParams = Object.assign({}, btn.params || {});
				el.onclick = () => {
					if (editor.hasAttribute("hidden") && btnName !== "html") {
						return;
					}
					switch (btnName) {
						case "link":
							return this._toggleLinkModal(el);
						case "image":
							return this._toggleImageModal(el);
						case "html":
							return this._toggleHtmlView(el);
					}
					this._removeModalMenu();
					this.tiptap.chain().focus()[btnAction](btnParams).run();
					checkButtonActive(btn, el, this.tiptap);
				};
				el.ariaLabel = btn.name; // to improve
				parent.appendChild(el);

				this.buttons.push({
					el,
					btn,
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
					BulletList.configure({
						HTMLAttributes: {
							class: `${CLASS_PREFIX}list`,
						},
					}),
					ListItem.configure({
						HTMLAttributes: {
							class: `${CLASS_PREFIX}list-item`,
						},
					}),
					OrderedList.configure({
						HTMLAttributes: {
							class: `${CLASS_PREFIX}list`,
						},
					}),
					Typography,
					Link.configure({
						openOnClick: false,
						// we will add it back later
						HTMLAttributes: {
							target: null,
							rel: null,
							class: null,
						},
					}),
					ImageExtension.configure({
						allowBase64: true,
						HTMLAttributes: {
							class: `${CLASS_PREFIX}image`,
						},
					}),
				],
				element: editor,
				editable: !textarea.readOnly && !textarea.disabled,
				content: textarea.value,
				//@link https://tiptap.dev/api/events#option-1-configuration
				onSelectionUpdate: ({ editor }) => {
					// Check which formatting options are enabled ?
					this.buttons.forEach((obj) => {
						checkButtonActive(obj.btn, obj.el, this.tiptap);
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
									alert(
										`Your images need to be less than ${pasteSize} pixels in height and width.`,
									);
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
			this.config,
		);
		this.tiptap = new Editor(this.config);

		if (hasBootstrap()) {
			// It's nested inside the editor
			editor.firstElementChild.classList.add("form-control");
		}
		// @ts-ignore
		adjustStyles(editor.firstElementChild, toolbar, textarea);
	}

	get events() {
		return ["input", "focusout"];
	}

	connected() {
		resizeObserver.observe(this);
	}

	disconnected() {
		resizeObserver.unobserve(this);
	}

	_undoStateChange(ev) {
		this.$input(ev);
	}

	_removeModalMenu() {
		if (this._modalMenu) {
			this._modalMenu.remove();
			this._modalMenu = null;
			this.style.zIndex = "";
		}
	}

	_toggleLinkModal(anchor) {
		const isActive = this.tiptap.isActive("link");
		if (this._modalMenu) {
			this._removeModalMenu();
		} else {
			const { view, state } = this.tiptap;
			const { from, to } = view.state.selection;
			const text = state.doc.textBetween(from, to, "");

			// You probably never want to select the last space
			const lastChar = text[text.length - 1];
			if (lastChar === " ") {
				this.tiptap.commands.setTextSelection({
					from: from,
					to: to - 1,
				});
			}

			let attrs = {};
			if (isActive) {
				attrs = this.tiptap.getAttributes("link");
			}

			this.style.zIndex = "3";
			this._modalMenu = dropmenu(
				anchor,
				[
					{
						name: "href",
						title: "URL",
						inputmode: "url",
						value: attrs.href || "",
					},
					{
						name: "new_window",
						title: "Open in a new window ?",
						type: "checkbox",
						checked: attrs.target ? true : false,
					},
				],
				{
					btnLabel: "Insert",
					menuExtraStyles: {
						minWidth: "254px",
					},
					submitCallback: (data) => {
						const href = data.href;
						const btnParams = {};
						btnParams.target = data.new_window ? "_blank" : "";
						if (href) {
							btnParams.href = href.trim();
							// Update params
							if (isExternalURL(href)) {
								Object.assign(btnParams, {
									rel: "noopener noreferrer nofollow",
								});
							}
							this.tiptap.chain().focus().setLink(btnParams).run();
						} else {
							this.tiptap.chain().focus().unsetLink().run();
						}

						this._removeModalMenu();
					},
				},
			);
		}
	}

	_toggleImageModal(anchor) {
		const isActive = this.tiptap.isActive("image");
		if (this._modalMenu) {
			this._removeModalMenu();
		} else {
			let attrs = {};
			if (isActive) {
				attrs = this.tiptap.getAttributes("image");
			}

			// since we have a z-index 2 for our toolbar, we need to set a higher index for our dropmenu container
			// this is not ideal and will not work in all cases but it covers basic usage
			this.style.zIndex = "3";
			this._modalMenu = dropmenu(
				anchor,
				[
					{
						name: "src",
						title: "URL",
						inputmode: "url",
						value: attrs.src || "",
					},
					{
						name: "alt",
						title: "Alternative text",
						value: attrs.alt || "",
					},
					{
						name: "title",
						title: "Title",
						value: attrs.title || "",
					},
				],
				{
					btnLabel: "Insert",
					menuExtraStyles: {
						minWidth: "254px",
					},
					submitCallback: (data) => {
						const src = data.src;
						const alt = data.alt || "";
						const title = data.title || "";
						const btnParams = {};

						if (src) {
							btnParams.src = src.trim();
							this.tiptap
								.chain()
								.focus()
								.setImage({
									src,
									alt,
									title,
								})
								.run();
						}

						this._removeModalMenu();
					},
				},
			);
		}
	}

	_toggleHtmlView(anchor) {
		const editor = q("div", ".tiptap-input", this);
		const textarea = q("textarea", null, this);
		if (textarea.hasAttribute("hidden")) {
			if (!textarea.dataset.fixedHeight) {
				const h = Math.max(
					parseInt(window.getComputedStyle(editor).height),
					textarea.scrollHeight,
				);
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
			if (!textarea.dataset.fixedHeight) {
				textarea.style.height = "";
			}
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
	}

	destroyed() {
		if (this.tiptap) {
			this.tiptap.destroy();
			this.tiptap = null;
		}
		this.buttons = null;
	}

	$focusout(ev) {
		if (!ev.relatedTarget || !this.contains(ev.relatedTarget)) {
			// clicked outside
			this._removeModalMenu();
		}
	}

	$input(ev) {
		const textarea = this.el;
		if (ev.target === textarea && !textarea.dataset.fixedHeight) {
			// auto growing textarea
			textarea.style.height = "0";
			textarea.style.height = textarea.scrollHeight + "px";
		}
	}
}

export default TiptapEditor;
