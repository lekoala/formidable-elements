import ce from "./ce";
import isRTL from "./isRTL";

/**
 * @typedef Field
 * @property {string} name
 * @property {string} title
 * @property {string} [value]
 * @property {string} [type]
 * @property {string} [inputmode]
 * @property {Boolean} [checked]
 */

/**
 * @typedef DropmenuOptions
 * @property {string} [menuClass]
 * @property {Object} [menuStyles]
 * @property {Object} [menuExtraStyles]
 * @property {Array} [btnClasses]
 * @property {string} [btnLabel]
 * @property {Array} [fieldClasses]
 * @property {Array} [checkboxClasses]
 * @property {Function} [submitCallback]
 */

/**
 * Create a simple drop menu anchored to the anchor
 * The menu will be added inside the anchor which will be made relativily positioned
 *
 * @param {HTMLElement} anchor
 * @param {Array<Field>} fields
 * @param {DropmenuOptions} options
 */
export default (anchor, fields = [], options = {}) => {
  const menuClass = options.menuClass || "dropmenu";
  const menuStyles = options.menuStyles || {
    background: "var(--bs-body-bg, #fff)",
    border: "1px solid var(--bs-border-color, #dee2e6)",
    padding: "1rem",
    textAlign: "left",
    zIndex: "2",
  };
  const menuExtraStyles = options.menuExtraStyles || {};
  const btnClasses = options.btnClasses || ["btn", "btn-primary"];
  const btnLabel = options.btnLabel || "Submit";

  const fieldClasses = options.fieldClasses || ["form-control"];
  const checkboxClasses = options.checkboxClasses || ["form-checkbox-input"];
  const submitCallback = options.submitCallback;

  const rtl = isRTL();

  const menu = ce("div");
  menu.classList.add(menuClass);
  Object.assign(menu.style, menuStyles, menuExtraStyles);

  // Clicks on menu shouldn't trigger parent element
  menu.addEventListener("click", (ev) => {
    ev.stopPropagation();
  });

  // Don't use a form object because this can be nested in another form which is invalid
  fields.forEach((field) => {
    const type = field.type || "text";
    const inputmode = field.inputmode || "text";
    const input = ce("input");
    input.type = type;
    input.name = field.name;
    input.value = field.value || "";
    if (field.type != "checkbox") {
      input.placeholder = field.title;
    }

    input.inputMode = inputmode;
    input.style.marginBottom = "0.5rem";

    if (field.type == "checkbox") {
      const wrapper = ce("label");
      const span = ce("span");
      span.innerHTML = field.title;
      span.style.display = "inline-block";
      span.style.paddingInline = "0.5rem";
      wrapper.style.marginBottom = "0.5rem";

      input.checked = field.checked || false;

      input.classList.add(...checkboxClasses);
      wrapper.appendChild(input);
      wrapper.appendChild(span);
      menu.appendChild(wrapper);
    } else {
      input.classList.add(...fieldClasses);
      menu.appendChild(input);
    }
  });

  if (submitCallback) {
    const btn = ce("button");
    btn.type = "button";
    btn.innerHTML = btnLabel;
    btn.classList.add(...btnClasses);
    menu.appendChild(btn);

    btn.addEventListener("click", (ev) => {
      const data = {};
      menu.querySelectorAll("input").forEach((input) => (data[input.name] = input.type == "checkbox" ? input.checked : input.value));
      submitCallback(data);
    });
  }

  anchor.parentElement.insertBefore(menu, anchor);

  anchor.style.position = "relative";
  anchor.appendChild(menu);

  let top = anchor.offsetHeight;
  let side = rtl ? "right" : "left";
  let otherSide = rtl ? "left" : "right";

  const pos = {
    position: "absolute",
    top: `${top}px`,
  };
  pos[side] = "0px";
  Object.assign(menu.style, pos);

  // Overflow check
  const menuBounds = menu.getBoundingClientRect();
  if (menuBounds.x < 0 || menuBounds.x + menuBounds.width > window.innerWidth) {
    menu.style[side] = "";
    menu.style[otherSide] = "0px";
  }

  return menu;
};
