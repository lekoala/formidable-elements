import FormidableElement from "../utils/FormidableElement.js";
import { asDate, dateParts, changeDate } from "../utils/date.js";
import { q } from "../utils/query.js";
import localeProvider from "../utils/localeProvider.js";

const name = "count-down";

function pad(v, qt = 2) {
  return v.toString().padStart(qt, "0");
}

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

function computeData(data, inst) {
  const parts = dateParts(data.diff);

  if (inst.config.unit) {
    data[inst.config.unit] = fraction(parts, inst.config.unit, inst.config.decimalDigits);
  } else {
    const qt = inst.config.pad ? 2 : 1;
    data.days = parts.days;
    data.hours = pad(parts.hours, qt);
    data.minutes = pad(parts.minutes, qt);
    data.seconds = pad(parts.seconds, qt);
  }
  for (const [name, value] of Object.entries(inst.config.labels)) {
    const el = q(`.${name} .value`, null, inst);
    // Don't touch dom unless changed
    if (el && el.innerHTML != data[name]) {
      el.innerHTML = data[name];
    }
  }
}

class CountdownElement extends FormidableElement {
  created() {
    this.config = Object.assign(
      {
        locale: this.dataset.locale || "default",
        timer: true,
        pad: true,
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
    if (this.dataset.start) {
      this.config.start = this.dataset.start;
    }
    if (this.dataset.end) {
      this.config.end = this.dataset.end;
    }
    if (this.dataset.url) {
      this.config.url = this.dataset.url;
    }

    if (typeof this.config.start == "object") {
      this.config.start = changeDate(this.config.start);
    }
    if (typeof this.config.end == "object") {
      this.config.end = changeDate(this.config.end);
    }

    const start = asDate(this.config.start);
    const end = asDate(this.config.end);

    // Keep default state
    if (!start || !end) {
      return;
    }

    // Create template if needed
    if (!this.firstChild) {
      this.innerHTML = Object.keys(this.config.labels).reduce((pv, cv) => {
        if (this.config.unit && this.config.unit != cv) {
          return pv;
        }
        return `${pv} <span class="${cv}"><span class="value"></span><span class="label">${this.config.labels[cv]}</span></span>`;
      }, "");
    }

    // Compute our initial difference based on current time (useful for interval)
    const initDiff = new Date().getTime() - start.getTime();

    // Compute difference between end and start time
    const data = {};
    data.diff = end.getTime() - start.getTime();

    computeData(data, this);

    // Static timer
    if (!this.config.timer) {
      return;
    }

    if (this.config.onInit) {
      this.config.onInit(this);
    }

    this.interval = setInterval(() => {
      // Reached the end
      if (data.diff <= 0) {
        clearInterval(this.interval);

        // Refresh display
        data.diff = 0;
        computeData(data, this);

        // Trigger on complete
        if (this.config.onComplete) {
          this.config.onComplete(this);
        }
        // Reload or replace
        if (this.config.reloadOnComplete) {
          window.location.reload();
        } else if (this.config.url) {
          window.location.replace(this.config.url);
        }
        return;
      }

      computeData(data, this);

      if (this.config.onTick) {
        this.config.onTick(this, data);
      }

      // Update time
      const now = new Date();
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
