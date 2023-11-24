/**
 * @param {Object} obj
 * @returns {FormData}
 */
export default (obj) => {
  if (!(obj instanceof Object)) {
    console.log("Invalid object", obj);
  }
  let formData = new FormData();

  for (const key in obj) {
    formData.append(key, obj[key] ?? "");
  }

  return formData;
};
