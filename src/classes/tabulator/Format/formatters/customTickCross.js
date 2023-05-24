import { iconTick, iconCross } from "../../../../utils/icons.js";

export default function (cell, formatterParams, onRendered) {
  let el;
  let color = formatterParams.color || null;
  let empty = formatterParams.allowEmpty;
  let element = cell.getElement();
  let value = cell.getValue();
  if (value) {
    element.setAttribute("aria-checked", true);
    el = formatterParams.onlyCross ? "" : iconTick;
    color = formatterParams.tickColor || color;
  } else {
    if (empty && (value === "null" || value === "" || value === null || value === undefined)) {
      element.setAttribute("aria-checked", "mixed");
    } else {
      element.setAttribute("aria-checked", false);
      el = formatterParams.onlyTick ? "" : iconCross;
      color = formatterParams.crossColor || color;
    }
  }
  if (formatterParams.size) {
    el = el.replace('width="16"', 'width="' + formatterParams.size + '"');
    el = el.replace('height="16"', 'height="' + formatterParams.size + '"');
  }
  if (color) {
    el = `<span style="color:${color}">${el}</span>`;
  }
  return el;
}
