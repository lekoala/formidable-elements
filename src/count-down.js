import countdown from "countdown";
import FormidableElement from "./utils/formidable-element.js";
import { asDate } from "./utils/date.js";

const name = "count-down";

class CountdownElement extends FormidableElement {
  created() {
    const fromStart = !!this.config.start;
    const start = asDate(this.config.start);
    const end = asDate(this.config.end);
    const timer = !!this.config.timer;
    const max = this.config.max || 0;

    // deal with bitmask as constants
    let units = null;
    if (this.config.units) {
      this.config.units.forEach((u) => {
        if (units === null) {
          units = countdown[u];
        } else {
          units = units | countdown[u];
        }
      });
    }

    if (timer) {
      const ontick = this.config.ontick || ((ts) => {});
      const renderer = this.config.renderer || ((ts) => ts.toString());
      const ticker = (ts) => {
        ontick(ts);
        this.innerHTML = renderer(ts);
      };
      let arg1 = fromStart ? start : ticker;
      let arg2 = fromStart ? ticker : end;
      this.interval = countdown(arg1, arg2, units, max);
    } else {
      this.innerHTML = countdown(start, end, units, max).toString();
    }
  }

  destroyed() {
    if (this.interval) {
      //@ts-ignore
      clearInterval(this.interval);
    }
  }
}

customElements.define(name, CountdownElement);

export default CountdownElement;
