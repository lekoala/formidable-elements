/**
 * String to Date
 * @param {Date|string} str
 * @returns {Date}
 */
export function asDate(str) {
  if (!str) {
    return new Date();
  }
  if (str instanceof Date) {
    return str;
  }
  return new Date(str);
}

/**
 * Convert to a datetime, ignoring timezone (will use actual day being picked)
 * @param {Date|string} date
 * @returns {string} YYYY-MM-DD HH:MM:SS
 */
export function toDateTime(date) {
  date = asDate(date);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split(".")[0].replace("T", " ");
}

/**
 * @param {Date} date
 * @returns {string} YYYY-MM-DD
 */
export function toDate(date) {
  return toDateTime(date).split(" ")[0];
}

/**
 * @param {Date} date
 * @returns {string} HH:MM:SS
 */
export function toTime(date) {
  return toDateTime(date).split(" ")[1];
}

/**
 * @param {String|Date|null} date
 * @returns {Number}
 */
export function ts(date = null) {
  if (!date) {
    return 0;
  }
  return asDate(date).getTime();
}
