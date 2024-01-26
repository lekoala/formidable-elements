import LazyElement from "../utils/LazyElement.js";

function convertRange(value, r1, r2) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

class HiMark extends LazyElement {
  init() {
    // adjust duration to text length
    const c = this.innerText.length;
    this.style.setProperty("--mark-duration", `${convertRange(c, [30, 120], [1, 2])}s`);
    // start animation
    this.classList.add("active");
  }
}

export default HiMark;
