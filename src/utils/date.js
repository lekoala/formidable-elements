/**
 * @typedef DateExpression
 * @property {Number} seconds
 * @property {Number} minutes
 * @property {Number} hours
 * @property {Number} days
 */

/**
 * @param {DateExpression} expr
 * @param {Date|Number} dateOrTime
 * @returns {Date}
 */
export function changeDate(expr, dateOrTime = null) {
  if (!dateOrTime) {
    dateOrTime = new Date();
  }
  let t = dateOrTime instanceof Date ? dateOrTime.getTime() : dateOrTime;
  if (expr.seconds) t += 1000 * expr.seconds;
  if (expr.minutes) t += 1000 * 60 * expr.minutes;
  if (expr.hours) t += 1000 * 60 * 60 * expr.hours;
  if (expr.days) t += 1000 * 60 * 60 * 24 * expr.days;
  return new Date(t);
}

/**
 * @param {Date|Number} dateOrTime
 * @returns {DateExpression}
 */
export function dateParts(dateOrTime) {
  const t = dateOrTime instanceof Date ? dateOrTime.getTime() : dateOrTime;
  const expr = {
    days: Math.floor(t / (1000 * 60 * 60 * 24)),
    hours: Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((t % (1000 * 60)) / 1000),
  };
  return expr;
}

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
