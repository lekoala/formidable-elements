import safeGlobalFn from "../../../../utils/safeGlobalFn.js";

export default function (cell, formatterParams, onRendered) {
  const v = cell.getValue();
  const editable = cell.getRow().getData()._editable || false;

  let formatted = "";
  if (v || formatterParams["notNull"]) {
    formatted = safeGlobalFn(formatterParams["function"])(v);
  } else if (formatterParams["editPlaceholder"] && editable) {
    formatted = `<em class="tabulator-value-placeholder">${formatterParams["editPlaceholder"]}</em>`;
  } else if (formatterParams["placeholder"]) {
    formatted = `<em class="tabulator-value-placeholder">${formatterParams["placeholder"]}</em>`;
  }
  return formatted;
}
