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

  const searchParams = new URLSearchParams(params);
  // Append params for GET/POST
  if (fetchOptions.method === "POST" && !fetchOptions.body) {
    fetchOptions.body = searchParams;
  } else {
    url += "?" + searchParams.toString();
  }

  return fetch(url, fetchOptions);
};
