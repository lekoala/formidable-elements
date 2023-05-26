/**
 * Add a color or a class based on _ data in row
 * @param {*} row 
 */
export const simpleRowFormatter = (row) => {
  const data = row.getData();
  if (data._color) {
    row.getElement().style.backgroundColor = data._color;
  }
  if (data._class) {
    row.getElement().classList.add(data._class);
  }
};

/**
 * Expand by default the cell to a tooltip if the column isn't wide enough
 * @param {*} e 
 * @param {*} cell 
 * @param {*} onRendered 
 * @returns {string}
 */
export const expandTooltips = (e, cell, onRendered) => {
  const el = cell._cell.element;
  const isTruncated = el.scrollWidth > el.clientWidth;
  if (isTruncated) {
    return cell._cell.value;
  }
  return "";
};
