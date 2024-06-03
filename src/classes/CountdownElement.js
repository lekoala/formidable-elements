import FormidableElement from "../utils/FormidableElement.js";
import { asDate, dateParts, changeDate, isDay, currentDay } from "../utils/date.js";
import { q } from "../utils/query.js";
import localeProvider from "../utils/localeProvider.js";

/**
 * @typedef CountdownConfig
 * @property {string|Object|Date} start Start time or date expression
 * @property {string|Object|Date} end End time or date expression
 * @property {string} url Url on complete
 * @property {string} unit Unit to use instead of various components (could be one of days|hours|minutes|seconds)
 * @property {string} locale Locale
 * @property {Boolean} timer Self updating timer (true by default). If false, disable callbacks (onXYZ functions).
 * @property {Boolean} pad Pad h/m/s with 0
 * @property {Number} decimalDigits Number of decimals to show for fractional numbers
 * @property {Object} labels Units labels
 * @property {Number} interval Time between timer update (1s by default)
 * @property {Boolean} reloadOnComplete Reload page at the end of the count down
 * @property {Function} onInit Callback on init
 * @property {Function} onTick Callback on tick
 * @property {Function} onComplete Callback on complete
 */
const name = "count-down";

/**
 * @param {*} v
 * @param {Number} qt
 * @returns {string}
 */
function pad(v, qt = 2) {
  return v.toString().padStart(qt, "0");
}

/**
 * @param {Object} parts with days, hours, minutes, seconds
 * @param {string} toUnit
 * @param {Number} digits
 * @returns {string}
 */
function fraction(parts, toUnit, digits = 2) {
  const units = {
    seconds: 60,
    minutes: 60,
    hours: 24,
    days: 1,
  };
  let v = 0;
  let multiply = false;
  for (const [unit, factor] of Object.entries(units)) {
    const vv = parts[unit];
    if (unit == toUnit) {
      v += vv;
      multiply = true;
    } else {
      if (multiply) {
        v += vv * factor;
      } else {
        v += vv / factor;
      }
    }
  }
  return (Math.round(v * 100) / 100).toFixed(digits);
}

/**
 * @param {Object} data
 * @param {CountdownElement} inst
 */
function computeData(data, inst) {
  const parts = dateParts(data.diff);

  // We want a specific unit
  if (inst.config.unit) {
    data[inst.config.unit] = fraction(parts, inst.config.unit, inst.config.decimalDigits);
  } else {
    // Display in days/hours/minutes/seconds
    const qt = inst.config.pad ? 2 : 1;
    data.days = parts.days.toString();
    data.hours = pad(parts.hours, qt);
    data.minutes = pad(parts.minutes, qt);
    data.seconds = pad(parts.seconds, qt);
  }
  for (const [name, value] of Object.entries(inst.config.labels)) {
    const valueEl = q(`.${name} .value`, null, inst);
    const labelEl = q(`.${name} .label`, null, inst);

    // Don't touch dom unless changed (make sure we have strings in data object)
    if (valueEl && valueEl.innerHTML != data[name]) {
      valueEl.innerHTML = data[name];
      // Hide days if empty
      if (name === "days" && "0" == data[name]) {
        valueEl.parentElement.setAttribute("hidden", "");
      }
    }
    // Singular/plural
    if (labelEl) {
      if (labelEl.dataset.singular && (data[name] == "1" || data[name] == "01")) {
        labelEl.innerHTML = labelEl.dataset.singular;
      } else if (labelEl.dataset.plural) {
        labelEl.innerHTML = labelEl.dataset.plural;
      }
    }
  }
}

/**
 * @param {Object} data
 * @param {CountdownElement} inst
 * @returns {Boolean}
 */
function checkFinished(data, inst) {
  if (data.diff > 0) {
    return false;
  }
  clearInterval(inst.interval);

  // Refresh display
  data.diff = 0;
  computeData(data, inst);

  // Trigger on complete
  if (inst.config.onComplete) {
    inst.config.onComplete(inst);
  }
  // Reload or replace
  if (inst.config.reloadOnComplete) {
    window.location.reload();
  } else if (inst.config.url) {
    window.location.replace(inst.config.url);
  }
  return true;
}

/**
 * This is a simple coutdown elements
 * It's not meant to compute more than days (weeks, months, etc)
 * Because that is not very convenient due to months not having the same number of days, 2 weeks sometimes meaning 15 days...
 */
class CountdownElement extends FormidableElement {
  created() {
    /**
     * @type {CountdownConfig}
     */
    this.config = Object.assign(
      {
        locale: this.dataset.locale || "default",
        timer: true,
        pad: false,
        decimalDigits: 0,
        labels: {
          days: "d",
          hours: "h",
          minutes: "m",
          seconds: "s",
        },
        interval: 1000, // in ms
      },
      this.config
    );

    // Use locale-provider for labels
    this.config.labels = localeProvider(name, this.config.locale, this.config.labels);

    // Expose common parameters as data attr
    ["start", "end", "url"].forEach((attr) => {
      /**
       * @type {string|Date}
       */
      const v = this.dataset[attr];
      if (v) {
        this.config[attr] = v;
      }
      // Replace date expressions
      if (typeof this.config[attr] == "object") {
        this.config[attr] = changeDate(this.config[attr]);
      }
    });

    const start = asDate(this.config.start);
    const end = asDate(this.config.end);
    // Keep default state
    if (!start || !end) {
      return;
    }

    // Is day comparison
    let isDayComparison = false;
    if (isDay(start) && isDay(end)) {
      isDayComparison = true;
    }
    let base = isDayComparison ? currentDay() : new Date();

    // Create template if needed
    if (!this.firstChild) {
      this.innerHTML = Object.keys(this.config.labels).reduce((pv, cv) => {
        if (this.config.unit && this.config.unit != cv) {
          return pv;
        }
        return `${pv} <span class="unit ${cv}"><span class="value"></span><span class="label">${this.config.labels[cv]}</span></span>`;
      }, "");
    }

    // Compute our initial difference based on current time
    // This amount will be substracted from current time to compute interval
    const initDiff = base.getTime() - start.getTime();

    // Compute difference between end and start time
    const data = {};
    data.diff = end.getTime() - start.getTime();

    // It's in the past
    if (checkFinished(data, this)) {
      return;
    }

    // Show computed timer
    computeData(data, this);

    // Static timer, no init or tick or on complete
    if (!this.config.timer) {
      return;
    }

    if (this.config.onInit) {
      this.config.onInit(this);
    }

    this.interval = setInterval(() => {
      // It's not started yet
      if (start.getTime() > new Date().getTime()) {
        return;
      }
      // Reached the end
      if (checkFinished(data, this)) {
        return;
      }

      computeData(data, this);

      if (this.config.onTick) {
        this.config.onTick(this, data);
      }

      // Update time based on current time
      // Take into account if we work between dates or datetimes
      // Since we start from current date, initDiff is substracted
      const now = isDayComparison ? currentDay() : new Date();
      data.diff = end.getTime() - now.getTime() + initDiff;
    }, this.config.interval);
  }

  destroyed() {
    if (this.interval) {
      //@ts-ignore
      clearInterval(this.interval);
    }
  }
}

export default CountdownElement;
