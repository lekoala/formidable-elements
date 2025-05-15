import getGlobalFn from "./getGlobalFn";

/**
 * Parses json like key: value strings into a proper json string
 * Does not support single quotes inside values
 * @param {string} str
 * @returns {Object}
 */
export default (str) => {
    if (!str) {
        return {};
    }
    if (str[0] !== "{" && str.includes(":")) {
        // make it a valid json string by wrapping in double quotes
        // the regex match key pairs : any valid string, quoted or unquoted => a single quoted string | a double quoted string | an [] | another value (number, bool...)
        str = `{${str.replace(/([^:\s{,]*)\s*:\s*('[^']*'|"[^"]*"|([\[].*?[\]])|[^,'"{\[]*)/g, (m, p1, p2) => `"${p1.replace(/['"]/g, "")}":${p2.includes('"') ? p2 : p2.replace(/'/g, '"')}`)}}`;
    }
    return str[0] === "{" ? JSON.parse(str) : getGlobalFn(str);
};
