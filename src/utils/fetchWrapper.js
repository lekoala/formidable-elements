const map = new Map();

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @param {URL|string} url
 * @param {Object} params
 * @param {Object|RequestInit} options
 */
export default (url, params = {}, options = {}) => {
  if (url instanceof URL) {
    url = url.toString();
  }

  const base = {
    method: "GET",
  };

  // Create an abort controller per url if none set
  // Don't forget to debounce as well
  if (!options.signal) {
    let ctrl = map.get(url);
    if (ctrl) {
      ctrl.abort();
    }
    ctrl = new AbortController();
    map.set(url, ctrl);
    base["signal"] = ctrl.signal;
  }

  // Create fetch options
  let fetchOptions = Object.assign(base, options);

  // XMLHttpRequest compat
  const headers = fetchOptions.headers || {};
  // This can cause CORS issues witj jsdelivr
  if (!url.includes("https://cdn.jsdelivr.net")) {
    headers["X-Requested-With"] = "XMLHttpRequest";
  }
  fetchOptions.headers = headers;

  const searchParams = new URLSearchParams(params);

  // For POST, set body and Content Type if no body is set explicitely
  if (fetchOptions.method === "POST" && !fetchOptions.body) {
    fetchOptions.body = searchParams;
    fetchOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
  } else {
    url += "?" + searchParams.toString();
  }

  return fetch(url, fetchOptions);
};
