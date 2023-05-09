const name = "growing-textarea";

class GrowingTextarea extends HTMLElement {
  handleEvent(ev) {
    const target = this.firstElementChild;
    if (target instanceof HTMLTextAreaElement) {
      target.style.overflow = "hidden";
      target.style.height = "0";
      target.style.height = target.scrollHeight + "px";
    }
  }
  connectedCallback() {
    this.addEventListener("input", this);
  }
  disconnectedCallback() {
    this.removeEventListener("input", this);
  }
}

if (!customElements.get(name)) {
  customElements.define(name, GrowingTextarea);
}

export default GrowingTextarea;
