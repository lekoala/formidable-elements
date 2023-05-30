/**
 * @link https://stackoverflow.com/questions/35939886/find-first-scrollable-parent
 */
export default (el, includeHidden = true) => {
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  let parent = el.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
};
