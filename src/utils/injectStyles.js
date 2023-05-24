/**
 * @param {string} name
 * @param {string} styles
 */
export default (name, styles) => {
  if (!document.head.querySelector(`#${name}-style`)) {
    const style = document.createElement("style");
    style.id = `${name}-style`;
    style.innerText = styles;
    document.head.append(style);
  }
};
