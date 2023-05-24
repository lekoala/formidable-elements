const map = {
  uk: "gb",
};
export default function (cell, formatterParams, onRendered) {
  if (!cell.getValue()) {
    return;
  }
  let iconName = cell.getValue().toLowerCase();
  if (!customElements.get("l-i")) {
    return iconName;
  }
  iconName = map[iconName] ? map[iconName] : iconName;
  return `<l-i name="${iconName}" set="fl" size="16"></l-i>`;
}
