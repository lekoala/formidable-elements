import Tags from "bootstrap5-tags";
import FormidableElement from "./utils/formidable-element.js";
import injectStyles from "./utils/injectStyles.js";
const name = "bs-tags";

// use proper import here
// WARNING: global side effect: with this, focus styles rely only on css variables now
const styles = `.form-control-focus,.form-control:focus{color:var(--bs-body-color, #212529);background-color:var(--bs-form-control-bg, #fff);border-color:rgba(var(--bs-primary-rgb, 13, 110, 253), 0.5);outline:0;box-shadow:0 0 0 var(--bs-focus-ring-width) rgba(var(--bs-primary-rgb, 13, 110, 253), 0.25)}.was-validated :valid+.form-control-focus,.was-validated :valid+.form-control:focus{border-color:var(--bs-success, #198754);box-shadow:0 0 0 var(--bs-focus-ring-width) rgba(var(--bs-success-rgb, 25, 135, 84), 0.25)}.was-validated :invalid+.form-control-focus,.was-validated :invalid+.form-control:focus{border-color:var(--bs-danger, #dc3545);box-shadow:0 0 0 var(--bs-focus-ring-width, 0.25rem) rgba(var(--bs-danger-rgb, 220, 53, 69), 0.25)}.form-floating .form-control.form-placeholder-shown:not(.form-control-focus)~label{opacity:unset;transform:unset}.form-control-disabled{background-color:var(--bs-form-control-disabled-bg, #e9ecef);opacity:1}.tags-menu mark{text-decoration:underline;background:none;color:currentColor;padding:0}`;
injectStyles(name, styles);

/**
 */
class BsTags extends FormidableElement {
  /**
   * @returns {HTMLSelectElement}
   */
  get el() {
    return this.querySelector("select");
  }

  created() {
    // cleanup html if cloned
    const dropmenu = this.querySelector("div.dropdown");
    if (dropmenu) {
      dropmenu.remove();
    }
    this.tags = new Tags(this.el, this.config);
  }

  destroyed() {
    this.tags.dispose();
    this.tags = null;
  }
}

customElements.define(name, BsTags);

export default BsTags;
