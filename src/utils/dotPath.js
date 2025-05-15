/**
 * Find value in object using dot notation
 * @param {string} path
 * @param {Object} scope Defaults to window
 * @returns {*}
 */
export function dotPath(path, scope = window) {
    return path.split(".").reduce((r, p) => r[p], scope);
}
