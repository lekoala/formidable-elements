(() => {
  // src/utils/LazyElement.js
  var observer = new window.IntersectionObserver((entries, obs) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      obs.unobserve(entry.target);
      entry.target.init();
    });
  });
  var LazyElement = class extends HTMLElement {
    connectedCallback() {
      observer.observe(this);
    }
    disconnectedCallback() {
      observer.unobserve(this);
    }
  };
  var LazyElement_default = LazyElement;

  // src/classes/HiMark.js
  function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
  }
  var HiMark = class extends LazyElement_default {
    init() {
      const c = this.innerText.length;
      this.style.setProperty("--mark-duration", `${convertRange(c, [30, 120], [1, 2])}s`);
      this.classList.add("active");
    }
  };
  var HiMark_default = HiMark;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/hi-mark.raw.js
  defineEl_default("hi-mark", HiMark_default);
  var hi_mark_raw_default = HiMark_default;
})();
