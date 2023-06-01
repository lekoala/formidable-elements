import fetchWrapper from "./fetchWrapper.js";

const handleJsonResponse = (response) => {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
};

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @param {URL|string} url
 * @param {Object} params
 * @param {Object|RequestInit} options
 */
export default (url, params = {}, options = {}) => {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";
  options.headers = headers;
  // body data type must match "Content-Type" header
  if (options.body && typeof options.body != "string") {
    options.body = JSON.stringify(options.body);
  }
  return fetchWrapper(url, params, options).then(handleJsonResponse);
};
