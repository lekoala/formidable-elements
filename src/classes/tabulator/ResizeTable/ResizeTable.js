//@ts-nocheck
import ResizeTable from "../../../../node_modules/tabulator-tables/src/js/modules/ResizeTable/ResizeTable.js";

export default class MyResizeTable extends ResizeTable {
  static moduleName = "resizeTable";

  initialize() {
    if (this.table.options.autoResize) {
      var table = this.table,
        tableStyle;

      this.tableHeight = table.element.clientHeight;
      this.tableWidth = table.element.clientWidth;

      if (table.element.parentNode) {
        this.containerHeight = table.element.parentNode.clientHeight;
        this.containerWidth = table.element.parentNode.clientWidth;
      }

      if (
        typeof IntersectionObserver !== "undefined" &&
        typeof ResizeObserver !== "undefined" &&
        table.rowManager.getRenderMode() === "virtual"
      ) {
        this.initializeVisibilityObserver();

        this.autoResize = true;

        this.resizeObserver = new ResizeObserver((entry) => {
          if (
            !table.browserMobile ||
            (table.browserMobile && (!table.modules.edit || (table.modules.edit && !table.modules.edit.currentCell)))
          ) {
            var nodeHeight = Math.floor(entry[0].contentRect.height);
            var nodeWidth = Math.floor(entry[0].contentRect.width);

            if (this.tableHeight != nodeHeight || this.tableWidth != nodeWidth) {
              this.tableHeight = nodeHeight;
              this.tableWidth = nodeWidth;

              if (table.element.parentNode) {
                this.containerHeight = table.element.parentNode.clientHeight;
                this.containerWidth = table.element.parentNode.clientWidth;
              }

              this.redrawTable();
            }
          }
        });

        this.resizeObserver.observe(table.element);

        tableStyle = window.getComputedStyle(table.element);

        if (
          this.table.element.parentNode &&
          !this.table.rowManager.fixedHeight &&
          (tableStyle.getPropertyValue("max-height") || tableStyle.getPropertyValue("min-height"))
        ) {
          this.containerObserver = new ResizeObserver((entry) => {
            if (
              !table.browserMobile ||
              (table.browserMobile && (!table.modules.edit || (table.modules.edit && !table.modules.edit.currentCell)))
            ) {
              var nodeHeight = Math.floor(entry[0].contentRect.height);
              var nodeWidth = Math.floor(entry[0].contentRect.width);

              if (this.containerHeight != nodeHeight || this.containerWidth != nodeWidth) {
                this.containerHeight = nodeHeight;
                this.containerWidth = nodeWidth;
                this.tableHeight = table.element.clientHeight;
                this.tableWidth = table.element.clientWidth;
              }

              this.redrawTable();
            }
          });

          this.containerObserver.observe(this.table.element.parentNode);
        }

        this.subscribe("table-resize", this.tableResized.bind(this));
      } else {
        this.binding = function () {
          if (
            !table.browserMobile ||
            (table.browserMobile && (!table.modules.edit || (table.modules.edit && !table.modules.edit.currentCell)))
          ) {
            table.columnManager.rerenderColumns(true);
            table.redraw();
          }
        };

        // Always subscribe to prevent built in redraw
        this.subscribe("table-resize", this.basicTableResized.bind(this));
        window.addEventListener("resize", this.binding);
      }

      this.subscribe("table-destroy", this.clearBindings.bind(this));
    }
  }

  initializeVisibilityObserver() {
    this.visibilityObserver = new IntersectionObserver((entries) => {
      this.visible = entries[0].isIntersecting;

      if (!this.initialized) {
        this.initialized = true;
        this.initialRedraw = !this.visible;
      } else {
        if (this.visible) {
          this.redrawTable(this.initialRedraw);
          this.initialRedraw = false;
        }
      }
    });

    this.visibilityObserver.observe(this.table.element);
  }

  blockRedraw() {
    this.redrawBlock = true;
  }

  restoreRedraw() {
    this.redrawBlock = false;
  }

  redrawTable(force) {
    if (this.redrawBlock) {
      return;
    }
    if (this.initialized && this.visible) {
      this.table.columnManager.rerenderColumns(true);
      this.table.redraw(force);
    }
  }

  basicTableResized() {
    if (this.redrawBlock) {
      return;
    }
    this.table.rowManager.redraw();
  }

  tableResized() {
    if (this.redrawBlock) {
      return;
    }
    this.table.rowManager.redraw();
  }

  clearBindings() {
    if (this.binding) {
      window.removeEventListener("resize", this.binding);
    }

    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.table.element);
    }

    if (this.visibilityObserver) {
      this.visibilityObserver.unobserve(this.table.element);
    }

    if (this.containerObserver) {
      this.containerObserver.unobserve(this.table.element.parentNode);
    }
  }
}
