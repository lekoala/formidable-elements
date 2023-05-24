export const simpleRowFormatter = (row) => {
  const data = row.getData();
  if (data._color) {
    row.getElement().style.backgroundColor = data._color;
  }
  if (data._class) {
    row.getElement().classList.add(data._class);
  }
};
