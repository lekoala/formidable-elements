/**
 * @typedef DateExpression
 * @property {Number} seconds
 * @property {Number} minutes
 * @property {Number} hours
 * @property {Number} days
 */

/**
 * Mutates a date with a given expression
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
 * String to Date in the current timezone
 * @param {Date|string} str
 * @returns {Date}
 */
export function asDate(str = null) {
    if (!str) {
        return new Date();
    }
    if (str instanceof Date) {
        return str;
    }
    return new Date(expandDate(str));
}

/**
 * Expand string in iso formatting
 * 2024 => 2024-01-01 00:00:00
 * 2024-01 => 2024-01-01 00:00:00
 * 2024-01-01 => 2024-01-01 00:00:00
 * 2024-01-01 10:00 => 2024-01-01 10:00:00
 *
 * @param {string} str
 * @returns {string}
 */
export function expandDate(str) {
    const s = "0000-01-01 00:00:00";
    while (str.length < s.length) {
        str += s[str.length];
    }
    return str;
}

/**
 * @param {Date|string} date
 * @returns {Boolean}
 */
export function isDay(date) {
    date = asDate(date);
    return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
}

/**
 * @returns {Date}
 */
export function currentDay() {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    return day;
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
