//tabulator with all modules installed
import { default as Tabulator } from "../../node_modules/tabulator-tables/src/js/core/Tabulator.js";
import * as modules from "./tabulator/optional.js";
import * as editors from "./tabulator/custom-editors.js";
import * as formatters from "./tabulator/custom-formatters.js";
import { simpleRowFormatter, expandTooltips } from "./tabulator/helpers.js";
import ModuleBinder from "../../node_modules/tabulator-tables/src/js/core/tools/ModuleBinder.js";

class TabulatorFull extends Tabulator {}

//bind modules and static functionality
new ModuleBinder(TabulatorFull, modules);

//@ts-ignore
TabulatorFull.extendModule("edit", "editors", editors);
//@ts-ignore
TabulatorFull.extendModule("format", "formatters", formatters);

import EventfulElement from "../utils/EventfulElement.js";
import { iconPrev, iconNext, iconFirst, iconLast, iconLoader, iconError } from "../utils/icons.js";
import parseBool from "../utils/parseBool.js";
import getGlobalFn from "../utils/getGlobalFn.js";
import getDelete from "../utils/getDelete.js";

class TabulatorGrid extends EventfulElement {
  /**
   * @returns {HTMLDivElement}
   */
  get el() {
    //@ts-ignore
    return this.firstElementChild;
  }

  created() {
    if (!this.el) {
      this.innerHTML = "<div></div>";
    }
    const el = this.el;
    const config = this.config;

    //@link https://tabulator.info/docs/5.5/columns#autocolumns
    if (!config.columns) {
      config.autoColumns = true;
    }

    //@link https://tabulator.info/docs/5.5/columns#defaults
    if (!config.columnDefaults) {
      config.columnDefaults = {
        //@link https://tabulator.info/docs/5.5/menu#tooltips-cell
        tooltip: expandTooltips,
        headerFilter: parseBool(this.dataset.filter),
      };
    }

    // Data provider
    if (config.data && typeof config.data == "function") {
      config.data = config.data();
    }

    if (!config.locale) {
      config.locale = navigator.language.split("-")[0];
    }

    // A built-in row formatter based on data (_color and _class)
    if (!config.rowFormatter) {
      config.rowFormatter = simpleRowFormatter;
    }

    // Custom pagination icons
    if (config.locale) {
      if (!config.langs || !config.langs[config.locale]) {
        config.langs = config.langs || {};
        config.langs[config.locale] = {
          pagination: {},
          data: {},
        };
      }
      if (config.langs[config.locale].pagination) {
        Object.assign(config.langs[config.locale].pagination, {
          first: iconFirst,
          last: iconLast,
          next: iconNext,
          prev: iconPrev,
        });
      }
      if (config.langs[config.locale].data) {
        Object.assign(config.langs[config.locale].data, {
          loading: iconLoader,
          error: iconError,
        });
      }
    }

    // init callback
    const initCallback = getDelete(config, "_initCallback");
    const configCallback = getDelete(config, "_configCallback");

    // Restore custom state (eg: server side set in session)
    // You can also use persistence module https://tabulator.info/docs/5.5/persist
    const state = getDelete(config, "_state", {});

    // Delay loading to allow setting limit or page from state
    const ajaxURL = getDelete(config, "ajaxURL");

    const form = el.closest("form");
    let hiddenInput = this.querySelector("input");

    if (configCallback) {
      configCallback(config);
    }

    const tabulator = new TabulatorFull(el, this.config);

    // Update value
    const updateHiddenInput = () => {
      if (hiddenInput) {
        hiddenInput.value = JSON.stringify(tabulator.getData());
      }
    };
    if (hiddenInput) {
      tabulator.on("cellEdited", updateHiddenInput);
    }

    // Click on row to trigger default action
    const rowClickTriggersAction = parseBool(this.dataset.rowClickTriggersAction);
    if (rowClickTriggersAction) {
      tabulator.on("rowClick", function (e, row) {
        const target = e.target.closest(".tabulator-cell");
        if (!target || target.classList.contains("tabulator-editable") || target.classList.contains("tabulator-cell-btn")) {
          return;
        }
        // don't trigger on interactive elements
        if (["A", "INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(target.tagName)) {
          return;
        }
        let firstBtn = null;
        firstBtn = row._row.element.querySelector(".btn.default-action");
        if (!firstBtn) {
          firstBtn = row._row.element.querySelector(".btn");
        }
        if (firstBtn) {
          firstBtn.click();
        }
      });
    }

    // Manual data loading
    tabulator.on("tableBuilt", () => {
      if (state.limit) {
        //@ts-ignore
        tabulator.setPageSize(state.limit);
      }
      if (state.page > 1) {
        //@ts-ignore
        tabulator.setPage(state.page);
      }
      // Delay loading
      let promise = null;
      if (ajaxURL) {
        promise = tabulator.setData(ajaxURL);
      } else if (hiddenInput && hiddenInput.value) {
        // Set initial data from hidden input (eg: json saved from the db)
        promise = tabulator.setData(JSON.parse(hiddenInput.value));
      }

      // This is a basic safeguard, it's probably better to rely on lazy init
      if (promise) {
        promise.then(
          setTimeout(() => {
            const holder = tabulator.element.querySelector(".tabulator-tableholder");
            if (holder.offsetHeight <= 0) {
              tabulator.redraw(true);
            }
          }, 0)
        );
      }
    });

    // Loading classes
    tabulator.on("dataLoading", (data) => {
      //data - the data loading into the table
      el.classList.add(`tabulator-loading`);
    });
    tabulator.on("dataLoaded", (data) => {
      //data - the data loaded into the table
      el.classList.remove(`tabulator-loading`);
    });
    tabulator.on("dataLoadError", (error) => {
      //error - the returned error object
      el.classList.remove(`tabulator-loading`);
    });

    // Fix table size on full redraw
    // @link https://github.com/olifolkerd/tabulator/issues/4155
    const fixedPaginatedHeight = parseBool(this.dataset.fixedPaginatedHeight);
    tabulator.on("renderStarted", () => {
      const holder = tabulator.element.querySelector(".tabulator-tableholder");
      const height = holder.clientHeight || 1;

      holder.style.minHeight = height + "px";
      holder.style.overflowAnchor = "none"; // Without this, it jumps on firefox

      // No overflow if responsive
      if (config.responsiveLayout) {
        holder.style.overflowY = "hidden";
      }
    });
    tabulator.on("renderComplete", () => {
      const holder = tabulator.element.querySelector(".tabulator-tableholder");
      const table = tabulator.element.querySelector(".tabulator-table");

      let height = Math.min(holder.clientHeight, table.clientHeight);
      // If you want to keep table with paginated element with the same size if rows are missing (eg: on last page)
      let paginatedHeight = 0;
      //@ts-ignore
      if (tabulator.options.pagination && fixedPaginatedHeight && table.firstChild) {
        paginatedHeight = this.config.paginationSize * table.firstChild.offsetHeight;
      }
      if (height <= 0) {
        height = 45;
      }
      // Replace height value computed by tabulator and remove minHeight
      if (height > 0) {
        holder.style.height = `${height}px`;
      }
      if (paginatedHeight > 0) {
        holder.style.minHeight = `${paginatedHeight}px`;
      }
    });

    // Add desktop or mobile class
    const navigatorClass = tabulator.browserMobile ? "mobile" : "desktop";
    el.classList.add(`tabulator-navigator-${navigatorClass}`);

    // Sticky shortcut
    if (this.hasAttribute("sticky")) {
      el.classList.add(`tabulator-sticky`);
    }

    // Mitigate issue https://github.com/olifolkerd/tabulator/issues/3692
    if (form) {
      tabulator.element.addEventListener(
        "keydown",
        /**
         * @param {KeyboardEvent} e
         */
        (e) => {
          if (e.keyCode == 13 || e.key == "Enter") {
            e.preventDefault();
          }
        }
      );
    }

    // Grid manipulation support
    const addRow = this.querySelector(".tabulator-add-row");
    const removeRow = this.querySelector(".tabulator-remove-selected");
    //@link https://tabulator.info/docs/5.5/update#addrow
    if (addRow) {
      addRow.addEventListener("click", (event) => {
        tabulator.addRow({}, false); // add to bottom
      });
    }
    if (removeRow) {
      removeRow.addEventListener("click", (event) => {
        //@ts-ignore
        tabulator.getSelectedRows().forEach((row) => {
          row.delete();
        });
        updateHiddenInput();
      });
    }

    // Extra listeners
    const listeners = this.dataset.listeners ? JSON.parse(this.dataset.listeners) : {};
    for (const listenerName in listeners) {
      var cb = getGlobalFn(listeners[listenerName]);
      if (cb) {
        tabulator.on(listenerName, cb);
      }
    }

    this.tabulator = tabulator;

    // Allow further initialization
    if (initCallback) {
      initCallback(tabulator, this);
    }
  }

  destroyed() {
    if (this.tabulator) {
      this.tabulator.destroy();
      this.tabulator = null;
    }
  }
}

export default TabulatorGrid;
