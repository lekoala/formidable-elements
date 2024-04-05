// import DataTables from "datatables.net";
import DataTables from "datatables.net-bs5";
import FixedColumns from "datatables.net-fixedcolumns-bs5";
import FixedHeaders from "datatables.net-fixedheader-bs5";
import Buttons from "datatables.net-buttons-bs5";
import Responsive from "datatables.net-responsive-bs5";
import RowGroup from "datatables.net-rowgroup-bs5";
import Select from "datatables.net-select-bs5";
import EventfulElement from "../utils/EventfulElement.js";
import { iconPrev, iconNext, iconFirst, iconLast, iconLoader, iconError } from "../utils/icons.js";
import parseBool from "../utils/parseBool.js";
import getGlobalFn from "../utils/getGlobalFn.js";
import getDelete from "../utils/getDelete.js";
import fetchJson from "../utils/fetchJson.js";

/**
 * @link https://datatables.net/blog/2024/datatables-2
 * @link https://datatables.net/new/2
 * @link https://datatables.net/upgrade/2
 */
class DataTableElement extends EventfulElement {
  /**
   * @returns {HTMLDivElement}
   */
  get el() {
    //@ts-ignore
    return this.firstElementChild;
  }

  created() {
    if (!this.el) {
      this.innerHTML = "<table></table>";
    }
    this.buildDatatable();
  }

  async buildDatatable() {
    const el = this.el;
    const config = this.config;

    // https://datatables.net/plug-ins/i18n/
    if (!config.language) {
      //TODO: expand to valid list
      const fullLocales = {
        fr: "fr-FR",
        nl: "nl-NL",
        es: "es-ES",
      };
      const lang = navigator.language.split("-")[0];
      const locale = fullLocales[lang] || lang;
      const langData = await fetchJson("https://cdn.jsdelivr.net/npm/datatables.net-plugins@2/i18n/" + locale + ".json");
      if (langData) {
        // Custom pagination
        langData["paginate"] = {
          first: iconFirst.replace(/\"24\"/g, "18"),
          last: iconLast.replace(/\"24\"/g, "18"),
          next: iconNext.replace(/\"24\"/g, "18"),
          previous: iconPrev.replace(/\"24\"/g, "18"),
        };
        config.language = langData;
      }
    }

    // init callback
    const initCallback = getDelete(config, "_initCallback");
    const configCallback = getDelete(config, "_configCallback");

    if (configCallback) {
      configCallback(config);
    }

    const datatable = new DataTables(el, this.config);

    this.datatable = datatable;

    // Allow further initialization
    if (initCallback) {
      initCallback(datatable, this);
    }
  }

  destroyed() {
    if (this.datatable) {
      this.datatable.destroy();
      this.datatable = null;
    }
  }
}

export default DataTableElement;
