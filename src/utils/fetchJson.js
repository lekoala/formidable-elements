import fetchWrapper from "./fetchWrapper.js";

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @param {URL|string} url
 * @param {Object} params
 * @param {Object|RequestInit} options
 */
export default (url, params = {}, options = {}) => {
  const headers = options.headers || {};

  // Hint that we want JSON in return
  headers["Accept"] = "application/json";

  // Explicit json posting, otherwise pass it in params if you want to post like a form but expect a json response
  if (options.body && typeof options.body != "string" && options.method == "POST") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  options.headers = headers;

  return fetchWrapper(url, params, options).then((response) => {
    return response.text().then((text) => {
      let data;
      let showError = !response.ok;
      try {
        data = text && JSON.parse(text);
      } catch (e) {
        showError = true;
        data = {
          message: "Invalid JSON response",
        };
      }
      if (showError) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      return data;
    });
  });
};
