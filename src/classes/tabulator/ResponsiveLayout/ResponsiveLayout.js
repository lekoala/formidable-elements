//@ts-nocheck
import ResponsiveLayout from "../../../../node_modules/tabulator-tables/src/js/modules/ResponsiveLayout/ResponsiveLayout.js";

/**
 * Introduce a new "flexCollapse" mode that depends on flex order for showing responsive rows
 * flexCollapse allows editable collapsed cells
 *
 * Rows are toggled with row-responsive-toggled that is triggered by the updated responsiveCollapse formatter
 */
class MyResponsiveLayout extends ResponsiveLayout {
  static moduleName = "responsiveLayout";

  initialize() {
    super.initialize();
    if (this.table.options.responsiveLayout === "flexCollapse") {
      this.subscribe("row-init", this.initializeRow.bind(this));
      this.subscribe("row-responsive-toggled", this.toggleFlexRow.bind(this));
    }
  }

  initializeResponsivity() {
    var columns = [];

    this.mode = this.table.options.responsiveLayout;
    this.collapseFormatter = this.table.options.responsiveLayoutCollapseFormatter || this.formatCollapsedData;
    this.collapseStartOpen = this.table.options.responsiveLayoutCollapseStartOpen;
    this.hiddenColumns = [];

    //determine level of responsivity for each column
    this.table.columnManager.columnsByIndex.forEach((column, i) => {
      if (column.modules.responsive) {
        if (column.modules.responsive.order && column.modules.responsive.visible) {
          column.modules.responsive.index = i;
          columns.push(column);

          if (!column.visible && (this.mode === "collapse" || this.mode === "flexCollapse")) {
            this.hiddenColumns.push(column);
          }
        }
      }
    });

    //sort list by responsivity
    columns = columns.reverse();
    columns = columns.sort((a, b) => {
      var diff = b.modules.responsive.order - a.modules.responsive.order;
      return diff || b.modules.responsive.index - a.modules.responsive.index;
    });

    this.columns = columns;

    if (this.mode === "collapse") {
      this.generateCollapsedContent();
    }

    //assign collapse column
    for (let col of this.table.columnManager.columnsByIndex) {
      if (col.definition.formatter == "responsiveCollapse") {
        this.collapseHandleColumn = col;
        break;
      }
    }

    if (this.collapseHandleColumn) {
      if (this.hiddenColumns.length) {
        this.collapseHandleColumn.show();
      } else {
        this.collapseHandleColumn.hide();
      }
    }
  }

  toggleFlexRow(row, isOpen) {
    if (isOpen) {
      row.getElement().classList.add("tabulator-responsive-flex-open");
      row.getCells().forEach(function (cell) {
        var el = cell.getElement();
        var title = cell.getColumn().getDefinition().title;
        if (el.style.display === "none") {
          el.style.display = "block";
          el.style.width = "100%";
          if (title && typeof title !== "undefined") {
            el.dataset.label = title;
          }
          el.classList.add("tabulator-responsive-flex-cell");
        }
      });
    } else {
      row.getElement().classList.remove("tabulator-responsive-flex-open");
      row.getCells().forEach(function (cell) {
        var el = cell.getElement();
        if (!el.classList.contains("tabulator-responsive-flex-cell")) {
          return;
        }
        el.style.display = "none";
        el.classList.remove("tabulator-responsive-flex-cell");
      });
    }
  }

  initializeRow(row) {
    var el;

    if (row.type !== "calc") {
      if (this.table.options.responsiveLayout === "collapse") {
        el = document.createElement("div");
        el.classList.add("tabulator-responsive-collapse");
      }

      row.modules.responsiveLayout = {
        element: el,
        open: this.collapseStartOpen,
      };

      if (this.collapseStartOpen) {
        el.style.display = "none";
      }
    }
  }

  hideColumn(column) {
    var colCount = this.hiddenColumns.length;

    column.hide(false, true);

    if (this.mode === "collapse" || this.mode === "flexCollapse") {
      this.hiddenColumns.unshift(column);
      if (this.mode === "collapse") {
        this.generateCollapsedContent();
      }

      if (this.collapseHandleColumn && !colCount) {
        this.collapseHandleColumn.show();
      }
    }
  }

  showColumn(column) {
    var index;

    column.show(false, true);
    //set column width to prevent calculation loops on uninitialized columns
    column.setWidth(column.getWidth());

    if (this.mode === "collapse" || this.mode === "flexCollapse") {
      index = this.hiddenColumns.indexOf(column);

      if (index > -1) {
        this.hiddenColumns.splice(index, 1);
      }

      if (this.mode === "collapse") {
        this.generateCollapsedContent();
      }
      if (this.mode === "flexCollapse") {
        column.getCells().forEach(function (cell) {
          var el = cell.getElement();
          el.classList.remove("tabulator-responsive-flex-cell");
        });
      }

      if (this.collapseHandleColumn && !this.hiddenColumns.length) {
        this.collapseHandleColumn.hide();
      }
    }
  }
}

export default MyResponsiveLayout;
