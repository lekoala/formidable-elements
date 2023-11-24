import EventfulElement from "../utils/EventfulElement.js";
import ce from "../utils/ce.js";
import fetchJson from "../utils/fetchJson.js";
import formDataToObject from "../utils/formDataToObject.js";

function notify(text, opts = {}) {
  const pop = customElements.get("pop-notify");
  if (pop) {
    //@ts-ignore
    pop.notify(text, opts);
  }
}

/**
 * Handle progressive actions
 * @param {ProgressButton} inst
 * @param {String} url
 * @param {Object} formData
 */
function progressiveCall(inst, url, formData) {
  fetchJson(url, formData, {
    headers: {
      "X-Progressive": 1,
    },
    method: "POST",
  })
    .then((data) => {
      if (data === null) {
        notify("Invalid handler");
        return;
      }

      // Progress can return messages
      if (data.message) {
        const opts = data.message_options || {};
        notify(data.message, opts);
      }

      const total = parseInt(data.progress_total);
      const curr = parseInt(data.progress_step);

      // It's finished when mark as such or if we are above total step !
      const isProgressComplete = total && curr >= total;
      if (data.finished || isProgressComplete) {
        // Set end label
        inst.setProgress(100);
        if (data.label) {
          inst.setText(data.label);
        }

        // Reload/redirect if needed
        if (data.reload) {
          window.location.reload();
        } else if (data.url) {
          window.location.href = data.url;
        } else if (!data.label) {
          // We can do it again if there is no end label
          inst.clearProgress();
        }
        return;
      }

      // Update progress data
      Object.assign(formData, data);

      // Update UI. Maybe we don't know how many step there will be...
      if (curr && total) {
        const perc = Math.round((curr / total) * 100);
        inst.setProgress(perc);
      } else {
        // Make same pseudo ui progress without displaying an actual %
        inst.dataset.hideTextProgress = "1";
        let perc = curr * 10;
        if (perc > 50) {
          // curr starts at 5 (5*10)
          perc = 25 + curr * 5;
        }
        if (perc > 75) {
          // curr starts at 10 (25 + 10 * 5)
          perc = 50 + curr * 2.5;
        }
        // Stale value by really small increments
        if (curr > 90) {
          perc = curr;
        }
        if (perc > 90) {
          perc = 90;
        }
        inst.setProgress(perc);
      }

      // Keep going until finished
      progressiveCall(inst, url, formData);
    })
    .catch((err) => {
      inst.clearProgress();
      inst.setText("Error");
      console.error(err);
    });
}

/**
 */
class ProgressButton extends EventfulElement {
  get events() {
    return ["click"];
  }

  /**
   * @returns {HTMLButtonElement|HTMLAnchorElement}
   */
  get el() {
    return this.querySelector("button,a");
  }

  /**
   * @returns {HTMLDivElement}
   */
  get progress() {
    return this.querySelector("div");
  }

  created() {
    // Needed for positioning
    this.style.display = "inline-block";
    this.style.position = "relative";
  }

  $click(ev) {
    // Do not submit form
    ev.preventDefault();

    const el = this.el;

    // Button is disabled
    if (el.classList.contains("disabled") || el.hasAttribute("disabled")) {
      return;
    }

    // Confirm message
    const msg = this.dataset.confirmMessage;
    if (msg) {
      if (!confirm(msg)) {
        return;
      }
    }

    let url = el.dataset.url;
    if (!url) {
      url = el.dataset.href || el.getAttribute("href");
    }

    // Related form
    /**
     * @type {HTMLFormElement}
     */
    let form = el.closest("form");
    if (el.hasAttribute("form")) {
      form = document.querySelector(`${el.getAttribute("form")}`);
    }

    let formData = {};

    if (form) {
      // No specific url, use form action
      if (!url) {
        url = form.getAttribute("action");
      }

      // Add data
      //@ts-ignore
      formData = formDataToObject(new FormData(form));
    }

    // Add current button value
    if (el instanceof HTMLButtonElement) {
      formData[el.getAttribute("name") || "_action"] = el.value || el.innerText;
    }

    // And step
    formData["progress_step"] = 0;

    // Total can be preset, eg if you want to apply x time something based on some front end decision
    const progressTotal = this.dataset.progressTotal;
    if (typeof progressTotal !== "undefined" && progressTotal !== null) {
      formData["progress_total"] = progressTotal;
    }

    // Disable it while in progress
    el.classList.add("disabled");
    el.setAttribute("disabled", "");

    const progress = ce("div");
    Object.assign(progress.style, {
      position: "absolute",
      width: 0,
      top: 0,
      bottom: 0,
      left: 0,
      background: "#000",
      borderRadius: window.getComputedStyle(el).borderRadius,
      zIndex: "-1",
      transition: "width 0.1s ease",
    });
    this.appendChild(progress);

    if (this.dataset.waitMessage) {
      this.setText(this.dataset.waitMessage);
    } else {
      this.setProgress(0);
    }

    progressiveCall(this, url, formData);
  }

  setProgress(perc) {
    if (!this.dataset.hideTextProgress) {
      this.setText(perc + "%");
    }

    this.el.style.opacity = "0.5";
    this.progress.style.width = `${perc}%`;
  }

  clearProgress() {
    this.restoreText();
    this.el.style.opacity = "unset";
    this.progress.remove();
    this.el.classList.remove("disabled");
    this.el.removeAttribute("disabled");
  }

  setText(str) {
    const el = this.el;

    // Don't change width
    el.style.width = `${el.getBoundingClientRect().width}px`;

    // Nested span ?
    const txt = el.querySelector("span") || el;
    if (!this.original) {
      this.original = txt.innerHTML;
    }
    txt.innerHTML = str;
  }

  restoreText() {
    if (this.original) {
      this.setText(this.original);
    }
  }
}

export default ProgressButton;
