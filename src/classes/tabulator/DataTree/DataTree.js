//@ts-nocheck
import DataTree from "../../../../node_modules/tabulator-tables/src/js/modules/DataTree/DataTree.js";

export default class MyDataTree extends DataTree {
  static moduleName = "dataTree";

  static closeResponsiveRow(row) {
    if (row.modules.responsiveLayout && row.modules.responsiveLayout.open) {
      const toggle = row.element.querySelector(".tabulator-responsive-collapse-toggle");
      if (toggle) {
        toggle.classList.remove("open");
        row.modules.responsiveLayout.open = false;
        return true;
      }
    }
    return false;
  }

  static openResponsiveRow(row) {
    if (row.modules.responsiveLayout && !row.modules.responsiveLayout.open) {
      const toggle = row.element.querySelector(".tabulator-responsive-collapse-toggle");
      if (toggle) {
        toggle.classList.add("open");
        row.modules.responsiveLayout.open = true;
        return true;
      }
    }
    return false;
  }

  expandRow(row, silent) {
    var config = row.modules.dataTree;

    if (config.children !== false) {
      config.open = true;

      const wasOpen = MyDataTree.closeResponsiveRow(row);
      //TODO: we should reopen it again if it was open

      row.reinitialize();

      this.refreshData(true);

      this.dispatchExternal("dataTreeRowExpanded", row.getComponent(), row.modules.dataTree.index);
    }
  }

  collapseRow(row) {
    var config = row.modules.dataTree;

    if (config.children !== false) {
      config.open = false;

      MyDataTree.closeResponsiveRow(row);

      row.reinitialize();

      this.refreshData(true);

      this.dispatchExternal("dataTreeRowCollapsed", row.getComponent(), row.modules.dataTree.index);
    }
  }
}
