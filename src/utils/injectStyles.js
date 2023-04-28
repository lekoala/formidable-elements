/**
 * @param {string} name
 * @param {string} styles
 */
export default function injectStyles(name, styles) {
  if (!document.head.querySelector(`#${name}-style`)) {
    const style = document.createElement("style");
    style.id = `${name}-style`;
    style.innerText = styles;
    document.head.append(style);
  }
}
