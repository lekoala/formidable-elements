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

  // src/css/hi-mark.min.css
  var hi_mark_min_default = "@media (prefers-reduced-motion:no-preference){hi-mark{--mark-bg-color:var(--text-highlight, #f5cf38);--mark-text-color:var(--text-dark, #333);--mark-duration:1s;--mark-ease:cubic-bezier(0.25, 1, 0.5, 1);background-repeat:no-repeat;background-size:0 100%;background-image:linear-gradient(var(--mark-bg-color),var(--mark-bg-color));transition:color calc(var(--mark-duration)/ 4) var(--mark-ease),background-color calc(var(--mark-duration)/ 4) var(--mark-ease),background-size var(--mark-duration) var(--mark-ease)}hi-mark.active{background-size:100% 100%;color:var(--mark-text-color)}}";

  // src/utils/injectStyles.js
  var injectStyles_default = (name, styles) => {
    if (!document.head.querySelector(`#${name}-style`)) {
      const style = document.createElement("style");
      style.id = `${name}-style`;
      style.innerText = styles;
      document.head.append(style);
    }
  };

  // src/hi-mark.js
  injectStyles_default("hi-mark", hi_mark_min_default);
  defineEl_default("hi-mark", HiMark_default);
  var hi_mark_default = HiMark_default;
})();
