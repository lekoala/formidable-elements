export default (obj, k, defaults = null) => {
  const v = obj[k] ?? defaults;
  delete obj[k];
  return v;
};
