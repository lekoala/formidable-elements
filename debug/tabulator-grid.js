(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/tabulator-tables/src/js/core/defaults/options.js
  var options_default = {
    debugEventsExternal: false,
    //flag to console log events
    debugEventsInternal: false,
    //flag to console log events
    debugInvalidOptions: true,
    //allow toggling of invalid option warnings
    debugInvalidComponentFuncs: true,
    //allow toggling of invalid component warnings
    debugInitialization: true,
    //allow toggling of pre initialization function call warnings
    debugDeprecation: true,
    //allow toggling of deprecation warnings
    height: false,
    //height of tabulator
    minHeight: false,
    //minimum height of tabulator
    maxHeight: false,
    //maximum height of tabulator
    columnHeaderVertAlign: "top",
    //vertical alignment of column headers
    popupContainer: false,
    columns: [],
    //store for colum header info
    columnDefaults: {},
    //store column default props
    rowHeader: false,
    data: false,
    //default starting data
    autoColumns: false,
    //build columns from data row structure
    autoColumnsDefinitions: false,
    nestedFieldSeparator: ".",
    //separator for nested data
    footerElement: false,
    //hold footer element
    index: "id",
    //filed for row index
    textDirection: "auto",
    addRowPos: "bottom",
    //position to insert blank rows, top|bottom
    headerVisible: true,
    //hide header
    renderVertical: "virtual",
    renderHorizontal: "basic",
    renderVerticalBuffer: 0,
    // set virtual DOM buffer size
    scrollToRowPosition: "top",
    scrollToRowIfVisible: true,
    scrollToColumnPosition: "left",
    scrollToColumnIfVisible: true,
    rowFormatter: false,
    rowFormatterPrint: null,
    rowFormatterClipboard: null,
    rowFormatterHtmlOutput: null,
    rowHeight: null,
    placeholder: false,
    dataLoader: true,
    dataLoaderLoading: false,
    dataLoaderError: false,
    dataLoaderErrorTimeout: 3e3,
    dataSendParams: {},
    dataReceiveParams: {}
  };

  // node_modules/tabulator-tables/src/js/core/CoreFeature.js
  var CoreFeature = class {
    constructor(table) {
      this.table = table;
    }
    //////////////////////////////////////////
    /////////////// DataLoad /////////////////
    //////////////////////////////////////////
    reloadData(data, silent, columnsChanged) {
      return this.table.dataLoader.load(data, void 0, void 0, void 0, silent, columnsChanged);
    }
    //////////////////////////////////////////
    ///////////// Localization ///////////////
    //////////////////////////////////////////
    langText() {
      return this.table.modules.localize.getText(...arguments);
    }
    langBind() {
      return this.table.modules.localize.bind(...arguments);
    }
    langLocale() {
      return this.table.modules.localize.getLocale(...arguments);
    }
    //////////////////////////////////////////
    ////////// Inter Table Comms /////////////
    //////////////////////////////////////////
    commsConnections() {
      return this.table.modules.comms.getConnections(...arguments);
    }
    commsSend() {
      return this.table.modules.comms.send(...arguments);
    }
    //////////////////////////////////////////
    //////////////// Layout  /////////////////
    //////////////////////////////////////////
    layoutMode() {
      return this.table.modules.layout.getMode();
    }
    layoutRefresh(force) {
      return this.table.modules.layout.layout(force);
    }
    //////////////////////////////////////////
    /////////////// Event Bus ////////////////
    //////////////////////////////////////////
    subscribe() {
      return this.table.eventBus.subscribe(...arguments);
    }
    unsubscribe() {
      return this.table.eventBus.unsubscribe(...arguments);
    }
    subscribed(key) {
      return this.table.eventBus.subscribed(key);
    }
    subscriptionChange() {
      return this.table.eventBus.subscriptionChange(...arguments);
    }
    dispatch() {
      return this.table.eventBus.dispatch(...arguments);
    }
    chain() {
      return this.table.eventBus.chain(...arguments);
    }
    confirm() {
      return this.table.eventBus.confirm(...arguments);
    }
    dispatchExternal() {
      return this.table.externalEvents.dispatch(...arguments);
    }
    subscribedExternal(key) {
      return this.table.externalEvents.subscribed(key);
    }
    subscriptionChangeExternal() {
      return this.table.externalEvents.subscriptionChange(...arguments);
    }
    //////////////////////////////////////////
    //////////////// Options /////////////////
    //////////////////////////////////////////
    options(key) {
      return this.table.options[key];
    }
    setOption(key, value) {
      if (typeof value !== "undefined") {
        this.table.options[key] = value;
      }
      return this.table.options[key];
    }
    //////////////////////////////////////////
    /////////// Deprecation Checks ///////////
    //////////////////////////////////////////
    deprecationCheck(oldOption, newOption, convert) {
      return this.table.deprecationAdvisor.check(oldOption, newOption, convert);
    }
    deprecationCheckMsg(oldOption, msg) {
      return this.table.deprecationAdvisor.checkMsg(oldOption, msg);
    }
    deprecationMsg(msg) {
      return this.table.deprecationAdvisor.msg(msg);
    }
    //////////////////////////////////////////
    //////////////// Modules /////////////////
    //////////////////////////////////////////
    module(key) {
      return this.table.module(key);
    }
  };

  // node_modules/tabulator-tables/src/js/core/column/ColumnComponent.js
  var ColumnComponent = class {
    constructor(column) {
      this._column = column;
      this.type = "ColumnComponent";
      return new Proxy(this, {
        get: function(target, name, receiver) {
          if (typeof target[name] !== "undefined") {
            return target[name];
          } else {
            return target._column.table.componentFunctionBinder.handle("column", target._column, name);
          }
        }
      });
    }
    getElement() {
      return this._column.getElement();
    }
    getDefinition() {
      return this._column.getDefinition();
    }
    getField() {
      return this._column.getField();
    }
    getTitleDownload() {
      return this._column.getTitleDownload();
    }
    getCells() {
      var cells = [];
      this._column.cells.forEach(function(cell) {
        cells.push(cell.getComponent());
      });
      return cells;
    }
    isVisible() {
      return this._column.visible;
    }
    show() {
      if (this._column.isGroup) {
        this._column.columns.forEach(function(column) {
          column.show();
        });
      } else {
        this._column.show();
      }
    }
    hide() {
      if (this._column.isGroup) {
        this._column.columns.forEach(function(column) {
          column.hide();
        });
      } else {
        this._column.hide();
      }
    }
    toggle() {
      if (this._column.visible) {
        this.hide();
      } else {
        this.show();
      }
    }
    delete() {
      return this._column.delete();
    }
    getSubColumns() {
      var output = [];
      if (this._column.columns.length) {
        this._column.columns.forEach(function(column) {
          output.push(column.getComponent());
        });
      }
      return output;
    }
    getParentColumn() {
      return this._column.getParentComponent();
    }
    _getSelf() {
      return this._column;
    }
    scrollTo(position, ifVisible) {
      return this._column.table.columnManager.scrollToColumn(this._column, position, ifVisible);
    }
    getTable() {
      return this._column.table;
    }
    move(to, after) {
      var toColumn = this._column.table.columnManager.findColumn(to);
      if (toColumn) {
        this._column.table.columnManager.moveColumn(this._column, toColumn, after);
      } else {
        console.warn("Move Error - No matching column found:", toColumn);
      }
    }
    getNextColumn() {
      var nextCol = this._column.nextColumn();
      return nextCol ? nextCol.getComponent() : false;
    }
    getPrevColumn() {
      var prevCol = this._column.prevColumn();
      return prevCol ? prevCol.getComponent() : false;
    }
    updateDefinition(updates) {
      return this._column.updateDefinition(updates);
    }
    getWidth() {
      return this._column.getWidth();
    }
    setWidth(width) {
      var result;
      if (width === true) {
        result = this._column.reinitializeWidth(true);
      } else {
        result = this._column.setWidth(width);
      }
      this._column.table.columnManager.rerenderColumns(true);
      return result;
    }
  };

  // node_modules/tabulator-tables/src/js/core/column/defaults/options.js
  var options_default2 = {
    "title": void 0,
    "field": void 0,
    "columns": void 0,
    "visible": void 0,
    "hozAlign": void 0,
    "vertAlign": void 0,
    "width": void 0,
    "minWidth": 40,
    "maxWidth": void 0,
    "maxInitialWidth": void 0,
    "cssClass": void 0,
    "variableHeight": void 0,
    "headerVertical": void 0,
    "headerHozAlign": void 0,
    "headerWordWrap": false,
    "editableTitle": void 0
  };

  // node_modules/tabulator-tables/src/js/core/cell/CellComponent.js
  var CellComponent = class {
    constructor(cell) {
      this._cell = cell;
      return new Proxy(this, {
        get: function(target, name, receiver) {
          if (typeof target[name] !== "undefined") {
            return target[name];
          } else {
            return target._cell.table.componentFunctionBinder.handle("cell", target._cell, name);
          }
        }
      });
    }
    getValue() {
      return this._cell.getValue();
    }
    getOldValue() {
      return this._cell.getOldValue();
    }
    getInitialValue() {
      return this._cell.initialValue;
    }
    getElement() {
      return this._cell.getElement();
    }
    getRow() {
      return this._cell.row.getComponent();
    }
    getData(transform) {
      return this._cell.row.getData(transform);
    }
    getType() {
      return "cell";
    }
    getField() {
      return this._cell.column.getField();
    }
    getColumn() {
      return this._cell.column.getComponent();
    }
    setValue(value, mutate) {
      if (typeof mutate == "undefined") {
        mutate = true;
      }
      this._cell.setValue(value, mutate);
    }
    restoreOldValue() {
      this._cell.setValueActual(this._cell.getOldValue());
    }
    restoreInitialValue() {
      this._cell.setValueActual(this._cell.initialValue);
    }
    checkHeight() {
      this._cell.checkHeight();
    }
    getTable() {
      return this._cell.table;
    }
    _getSelf() {
      return this._cell;
    }
  };

  // node_modules/tabulator-tables/src/js/core/cell/Cell.js
  var Cell = class extends CoreFeature {
    constructor(column, row) {
      super(column.table);
      this.table = column.table;
      this.column = column;
      this.row = row;
      this.element = null;
      this.value = null;
      this.initialValue;
      this.oldValue = null;
      this.modules = {};
      this.height = null;
      this.width = null;
      this.minWidth = null;
      this.component = null;
      this.loaded = false;
      this.build();
    }
    //////////////// Setup Functions /////////////////
    //generate element
    build() {
      this.generateElement();
      this.setWidth();
      this._configureCell();
      this.setValueActual(this.column.getFieldValue(this.row.data));
      this.initialValue = this.value;
    }
    generateElement() {
      this.element = document.createElement("div");
      this.element.className = "tabulator-cell";
      this.element.setAttribute("role", "gridcell");
      if (this.column.isRowHeader) {
        this.element.classList.add("tabulator-row-header");
      }
    }
    _configureCell() {
      var element = this.element, field = this.column.getField(), vertAligns = {
        top: "flex-start",
        bottom: "flex-end",
        middle: "center"
      }, hozAligns = {
        left: "flex-start",
        right: "flex-end",
        center: "center"
      };
      element.style.textAlign = this.column.hozAlign;
      if (this.column.vertAlign) {
        element.style.display = "inline-flex";
        element.style.alignItems = vertAligns[this.column.vertAlign] || "";
        if (this.column.hozAlign) {
          element.style.justifyContent = hozAligns[this.column.hozAlign] || "";
        }
      }
      if (field) {
        element.setAttribute("tabulator-field", field);
      }
      if (this.column.definition.cssClass) {
        var classNames = this.column.definition.cssClass.split(" ");
        classNames.forEach((className) => {
          element.classList.add(className);
        });
      }
      this.dispatch("cell-init", this);
      if (!this.column.visible) {
        this.hide();
      }
    }
    //generate cell contents
    _generateContents() {
      var val;
      val = this.chain("cell-format", this, null, () => {
        return this.element.innerHTML = this.value;
      });
      switch (typeof val) {
        case "object":
          if (val instanceof Node) {
            while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
            this.element.appendChild(val);
          } else {
            this.element.innerHTML = "";
            if (val != null) {
              console.warn("Format Error - Formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", val);
            }
          }
          break;
        case "undefined":
          this.element.innerHTML = "";
          break;
        default:
          this.element.innerHTML = val;
      }
    }
    cellRendered() {
      this.dispatch("cell-rendered", this);
    }
    //////////////////// Getters ////////////////////
    getElement(containerOnly) {
      if (!this.loaded) {
        this.loaded = true;
        if (!containerOnly) {
          this.layoutElement();
        }
      }
      return this.element;
    }
    getValue() {
      return this.value;
    }
    getOldValue() {
      return this.oldValue;
    }
    //////////////////// Actions ////////////////////
    setValue(value, mutate, force) {
      var changed = this.setValueProcessData(value, mutate, force);
      if (changed) {
        this.dispatch("cell-value-updated", this);
        this.cellRendered();
        if (this.column.definition.cellEdited) {
          this.column.definition.cellEdited.call(this.table, this.getComponent());
        }
        this.dispatchExternal("cellEdited", this.getComponent());
        if (this.subscribedExternal("dataChanged")) {
          this.dispatchExternal("dataChanged", this.table.rowManager.getData());
        }
      }
    }
    setValueProcessData(value, mutate, force) {
      var changed = false;
      if (this.value !== value || force) {
        changed = true;
        if (mutate) {
          value = this.chain("cell-value-changing", [this, value], null, value);
        }
      }
      this.setValueActual(value);
      if (changed) {
        this.dispatch("cell-value-changed", this);
      }
      return changed;
    }
    setValueActual(value) {
      this.oldValue = this.value;
      this.value = value;
      this.dispatch("cell-value-save-before", this);
      this.column.setFieldValue(this.row.data, value);
      this.dispatch("cell-value-save-after", this);
      if (this.loaded) {
        this.layoutElement();
      }
    }
    layoutElement() {
      this._generateContents();
      this.dispatch("cell-layout", this);
    }
    setWidth() {
      this.width = this.column.width;
      this.element.style.width = this.column.widthStyled;
    }
    clearWidth() {
      this.width = "";
      this.element.style.width = "";
    }
    getWidth() {
      return this.width || this.element.offsetWidth;
    }
    setMinWidth() {
      this.minWidth = this.column.minWidth;
      this.element.style.minWidth = this.column.minWidthStyled;
    }
    setMaxWidth() {
      this.maxWidth = this.column.maxWidth;
      this.element.style.maxWidth = this.column.maxWidthStyled;
    }
    checkHeight() {
      this.row.reinitializeHeight();
    }
    clearHeight() {
      this.element.style.height = "";
      this.height = null;
      this.dispatch("cell-height", this, "");
    }
    setHeight() {
      this.height = this.row.height;
      this.element.style.height = this.row.heightStyled;
      this.dispatch("cell-height", this, this.row.heightStyled);
    }
    getHeight() {
      return this.height || this.element.offsetHeight;
    }
    show() {
      this.element.style.display = this.column.vertAlign ? "inline-flex" : "";
    }
    hide() {
      this.element.style.display = "none";
    }
    delete() {
      this.dispatch("cell-delete", this);
      if (!this.table.rowManager.redrawBlock && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = false;
      this.column.deleteCell(this);
      this.row.deleteCell(this);
      this.calcs = {};
    }
    getIndex() {
      return this.row.getCellIndex(this);
    }
    //////////////// Object Generation /////////////////
    getComponent() {
      if (!this.component) {
        this.component = new CellComponent(this);
      }
      return this.component;
    }
  };

  // node_modules/tabulator-tables/src/js/core/column/Column.js
  var Column = class _Column extends CoreFeature {
    static defaultOptionList = options_default2;
    constructor(def, parent, rowHeader) {
      super(parent.table);
      this.definition = def;
      this.parent = parent;
      this.type = "column";
      this.columns = [];
      this.cells = [];
      this.isGroup = false;
      this.isRowHeader = rowHeader;
      this.element = this.createElement();
      this.contentElement = false;
      this.titleHolderElement = false;
      this.titleElement = false;
      this.groupElement = this.createGroupElement();
      this.hozAlign = "";
      this.vertAlign = "";
      this.field = "";
      this.fieldStructure = "";
      this.getFieldValue = "";
      this.setFieldValue = "";
      this.titleDownload = null;
      this.titleFormatterRendered = false;
      this.mapDefinitions();
      this.setField(this.definition.field);
      this.modules = {};
      this.width = null;
      this.widthStyled = "";
      this.maxWidth = null;
      this.maxWidthStyled = "";
      this.maxInitialWidth = null;
      this.minWidth = null;
      this.minWidthStyled = "";
      this.widthFixed = false;
      this.visible = true;
      this.component = null;
      if (this.definition.columns) {
        this.isGroup = true;
        this.definition.columns.forEach((def2, i) => {
          var newCol = new _Column(def2, this);
          this.attachColumn(newCol);
        });
        this.checkColumnVisibility();
      } else {
        parent.registerColumnField(this);
      }
      this._initialize();
    }
    createElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-col");
      el.setAttribute("role", "columnheader");
      el.setAttribute("aria-sort", "none");
      if (this.isRowHeader) {
        el.classList.add("tabulator-row-header");
      }
      switch (this.table.options.columnHeaderVertAlign) {
        case "middle":
          el.style.justifyContent = "center";
          break;
        case "bottom":
          el.style.justifyContent = "flex-end";
          break;
      }
      return el;
    }
    createGroupElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-col-group-cols");
      return el;
    }
    mapDefinitions() {
      var defaults = this.table.options.columnDefaults;
      if (defaults) {
        for (let key in defaults) {
          if (typeof this.definition[key] === "undefined") {
            this.definition[key] = defaults[key];
          }
        }
      }
      this.definition = this.table.columnManager.optionsList.generate(_Column.defaultOptionList, this.definition);
    }
    checkDefinition() {
      Object.keys(this.definition).forEach((key) => {
        if (_Column.defaultOptionList.indexOf(key) === -1) {
          console.warn("Invalid column definition option in '" + (this.field || this.definition.title) + "' column:", key);
        }
      });
    }
    setField(field) {
      this.field = field;
      this.fieldStructure = field ? this.table.options.nestedFieldSeparator ? field.split(this.table.options.nestedFieldSeparator) : [field] : [];
      this.getFieldValue = this.fieldStructure.length > 1 ? this._getNestedData : this._getFlatData;
      this.setFieldValue = this.fieldStructure.length > 1 ? this._setNestedData : this._setFlatData;
    }
    //register column position with column manager
    registerColumnPosition(column) {
      this.parent.registerColumnPosition(column);
    }
    //register column position with column manager
    registerColumnField(column) {
      this.parent.registerColumnField(column);
    }
    //trigger position registration
    reRegisterPosition() {
      if (this.isGroup) {
        this.columns.forEach(function(column) {
          column.reRegisterPosition();
        });
      } else {
        this.registerColumnPosition(this);
      }
    }
    //build header element
    _initialize() {
      var def = this.definition;
      while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
      if (def.headerVertical) {
        this.element.classList.add("tabulator-col-vertical");
        if (def.headerVertical === "flip") {
          this.element.classList.add("tabulator-col-vertical-flip");
        }
      }
      this.contentElement = this._buildColumnHeaderContent();
      this.element.appendChild(this.contentElement);
      if (this.isGroup) {
        this._buildGroupHeader();
      } else {
        this._buildColumnHeader();
      }
      this.dispatch("column-init", this);
    }
    //build header element for header
    _buildColumnHeader() {
      var def = this.definition;
      this.dispatch("column-layout", this);
      if (typeof def.visible != "undefined") {
        if (def.visible) {
          this.show(true);
        } else {
          this.hide(true);
        }
      }
      if (def.cssClass) {
        var classNames = def.cssClass.split(" ");
        classNames.forEach((className) => {
          this.element.classList.add(className);
        });
      }
      if (def.field) {
        this.element.setAttribute("tabulator-field", def.field);
      }
      this.setMinWidth(parseInt(def.minWidth));
      if (def.maxInitialWidth) {
        this.maxInitialWidth = parseInt(def.maxInitialWidth);
      }
      if (def.maxWidth) {
        this.setMaxWidth(parseInt(def.maxWidth));
      }
      this.reinitializeWidth();
      this.hozAlign = this.definition.hozAlign;
      this.vertAlign = this.definition.vertAlign;
      this.titleElement.style.textAlign = this.definition.headerHozAlign;
    }
    _buildColumnHeaderContent() {
      var contentElement = document.createElement("div");
      contentElement.classList.add("tabulator-col-content");
      this.titleHolderElement = document.createElement("div");
      this.titleHolderElement.classList.add("tabulator-col-title-holder");
      contentElement.appendChild(this.titleHolderElement);
      this.titleElement = this._buildColumnHeaderTitle();
      this.titleHolderElement.appendChild(this.titleElement);
      return contentElement;
    }
    //build title element of column
    _buildColumnHeaderTitle() {
      var def = this.definition;
      var titleHolderElement = document.createElement("div");
      titleHolderElement.classList.add("tabulator-col-title");
      if (def.headerWordWrap) {
        titleHolderElement.classList.add("tabulator-col-title-wrap");
      }
      if (def.editableTitle) {
        var titleElement = document.createElement("input");
        titleElement.classList.add("tabulator-title-editor");
        titleElement.addEventListener("click", (e) => {
          e.stopPropagation();
          titleElement.focus();
        });
        titleElement.addEventListener("mousedown", (e) => {
          e.stopPropagation();
        });
        titleElement.addEventListener("change", () => {
          def.title = titleElement.value;
          this.dispatchExternal("columnTitleChanged", this.getComponent());
        });
        titleHolderElement.appendChild(titleElement);
        if (def.field) {
          this.langBind("columns|" + def.field, (text) => {
            titleElement.value = text || (def.title || "&nbsp;");
          });
        } else {
          titleElement.value = def.title || "&nbsp;";
        }
      } else {
        if (def.field) {
          this.langBind("columns|" + def.field, (text) => {
            this._formatColumnHeaderTitle(titleHolderElement, text || (def.title || "&nbsp;"));
          });
        } else {
          this._formatColumnHeaderTitle(titleHolderElement, def.title || "&nbsp;");
        }
      }
      return titleHolderElement;
    }
    _formatColumnHeaderTitle(el, title) {
      var contents = this.chain("column-format", [this, title, el], null, () => {
        return title;
      });
      switch (typeof contents) {
        case "object":
          if (contents instanceof Node) {
            el.appendChild(contents);
          } else {
            el.innerHTML = "";
            console.warn("Format Error - Title formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", contents);
          }
          break;
        case "undefined":
          el.innerHTML = "";
          break;
        default:
          el.innerHTML = contents;
      }
    }
    //build header element for column group
    _buildGroupHeader() {
      this.element.classList.add("tabulator-col-group");
      this.element.setAttribute("role", "columngroup");
      this.element.setAttribute("aria-title", this.definition.title);
      if (this.definition.cssClass) {
        var classNames = this.definition.cssClass.split(" ");
        classNames.forEach((className) => {
          this.element.classList.add(className);
        });
      }
      this.titleElement.style.textAlign = this.definition.headerHozAlign;
      this.element.appendChild(this.groupElement);
    }
    //flat field lookup
    _getFlatData(data) {
      return data[this.field];
    }
    //nested field lookup
    _getNestedData(data) {
      var dataObj = data, structure = this.fieldStructure, length = structure.length, output;
      for (let i = 0; i < length; i++) {
        dataObj = dataObj[structure[i]];
        output = dataObj;
        if (!dataObj) {
          break;
        }
      }
      return output;
    }
    //flat field set
    _setFlatData(data, value) {
      if (this.field) {
        data[this.field] = value;
      }
    }
    //nested field set
    _setNestedData(data, value) {
      var dataObj = data, structure = this.fieldStructure, length = structure.length;
      for (let i = 0; i < length; i++) {
        if (i == length - 1) {
          dataObj[structure[i]] = value;
        } else {
          if (!dataObj[structure[i]]) {
            if (typeof value !== "undefined") {
              dataObj[structure[i]] = {};
            } else {
              break;
            }
          }
          dataObj = dataObj[structure[i]];
        }
      }
    }
    //attach column to this group
    attachColumn(column) {
      if (this.groupElement) {
        this.columns.push(column);
        this.groupElement.appendChild(column.getElement());
        column.columnRendered();
      } else {
        console.warn("Column Warning - Column being attached to another column instead of column group");
      }
    }
    //vertically align header in column
    verticalAlign(alignment, height) {
      var parentHeight = this.parent.isGroup ? this.parent.getGroupElement().clientHeight : height || this.parent.getHeadersElement().clientHeight;
      this.element.style.height = parentHeight + "px";
      this.dispatch("column-height", this, this.element.style.height);
      if (this.isGroup) {
        this.groupElement.style.minHeight = parentHeight - this.contentElement.offsetHeight + "px";
      }
      this.columns.forEach(function(column) {
        column.verticalAlign(alignment);
      });
    }
    //clear vertical alignment
    clearVerticalAlign() {
      this.element.style.paddingTop = "";
      this.element.style.height = "";
      this.element.style.minHeight = "";
      this.groupElement.style.minHeight = "";
      this.columns.forEach(function(column) {
        column.clearVerticalAlign();
      });
      this.dispatch("column-height", this, "");
    }
    //// Retrieve Column Information ////
    //return column header element
    getElement() {
      return this.element;
    }
    //return column group element
    getGroupElement() {
      return this.groupElement;
    }
    //return field name
    getField() {
      return this.field;
    }
    getTitleDownload() {
      return this.titleDownload;
    }
    //return the first column in a group
    getFirstColumn() {
      if (!this.isGroup) {
        return this;
      } else {
        if (this.columns.length) {
          return this.columns[0].getFirstColumn();
        } else {
          return false;
        }
      }
    }
    //return the last column in a group
    getLastColumn() {
      if (!this.isGroup) {
        return this;
      } else {
        if (this.columns.length) {
          return this.columns[this.columns.length - 1].getLastColumn();
        } else {
          return false;
        }
      }
    }
    //return all columns in a group
    getColumns(traverse) {
      var columns = [];
      if (traverse) {
        this.columns.forEach((column) => {
          columns.push(column);
          columns = columns.concat(column.getColumns(true));
        });
      } else {
        columns = this.columns;
      }
      return columns;
    }
    //return all columns in a group
    getCells() {
      return this.cells;
    }
    //retrieve the top column in a group of columns
    getTopColumn() {
      if (this.parent.isGroup) {
        return this.parent.getTopColumn();
      } else {
        return this;
      }
    }
    //return column definition object
    getDefinition(updateBranches) {
      var colDefs = [];
      if (this.isGroup && updateBranches) {
        this.columns.forEach(function(column) {
          colDefs.push(column.getDefinition(true));
        });
        this.definition.columns = colDefs;
      }
      return this.definition;
    }
    //////////////////// Actions ////////////////////
    checkColumnVisibility() {
      var visible = false;
      this.columns.forEach(function(column) {
        if (column.visible) {
          visible = true;
        }
      });
      if (visible) {
        this.show();
        this.dispatchExternal("columnVisibilityChanged", this.getComponent(), false);
      } else {
        this.hide();
      }
    }
    //show column
    show(silent, responsiveToggle) {
      if (!this.visible) {
        this.visible = true;
        this.element.style.display = "";
        if (this.parent.isGroup) {
          this.parent.checkColumnVisibility();
        }
        this.cells.forEach(function(cell) {
          cell.show();
        });
        if (!this.isGroup && this.width === null) {
          this.reinitializeWidth();
        }
        this.table.columnManager.verticalAlignHeaders();
        this.dispatch("column-show", this, responsiveToggle);
        if (!silent) {
          this.dispatchExternal("columnVisibilityChanged", this.getComponent(), true);
        }
        if (this.parent.isGroup) {
          this.parent.matchChildWidths();
        }
        if (!this.silent) {
          this.table.columnManager.rerenderColumns();
        }
      }
    }
    //hide column
    hide(silent, responsiveToggle) {
      if (this.visible) {
        this.visible = false;
        this.element.style.display = "none";
        this.table.columnManager.verticalAlignHeaders();
        if (this.parent.isGroup) {
          this.parent.checkColumnVisibility();
        }
        this.cells.forEach(function(cell) {
          cell.hide();
        });
        this.dispatch("column-hide", this, responsiveToggle);
        if (!silent) {
          this.dispatchExternal("columnVisibilityChanged", this.getComponent(), false);
        }
        if (this.parent.isGroup) {
          this.parent.matchChildWidths();
        }
        if (!this.silent) {
          this.table.columnManager.rerenderColumns();
        }
      }
    }
    matchChildWidths() {
      var childWidth = 0;
      if (this.contentElement && this.columns.length) {
        this.columns.forEach(function(column) {
          if (column.visible) {
            childWidth += column.getWidth();
          }
        });
        this.contentElement.style.maxWidth = childWidth - 1 + "px";
        if (this.parent.isGroup) {
          this.parent.matchChildWidths();
        }
      }
    }
    removeChild(child) {
      var index = this.columns.indexOf(child);
      if (index > -1) {
        this.columns.splice(index, 1);
      }
      if (!this.columns.length) {
        this.delete();
      }
    }
    setWidth(width) {
      this.widthFixed = true;
      this.setWidthActual(width);
    }
    setWidthActual(width) {
      if (isNaN(width)) {
        width = Math.floor(this.table.element.clientWidth / 100 * parseInt(width));
      }
      width = Math.max(this.minWidth, width);
      if (this.maxWidth) {
        width = Math.min(this.maxWidth, width);
      }
      this.width = width;
      this.widthStyled = width ? width + "px" : "";
      this.element.style.width = this.widthStyled;
      if (!this.isGroup) {
        this.cells.forEach(function(cell) {
          cell.setWidth();
        });
      }
      if (this.parent.isGroup) {
        this.parent.matchChildWidths();
      }
      this.dispatch("column-width", this);
      if (this.subscribedExternal("columnWidth")) {
        this.dispatchExternal("columnWidth", this.getComponent());
      }
    }
    checkCellHeights() {
      var rows = [];
      this.cells.forEach(function(cell) {
        if (cell.row.heightInitialized) {
          if (cell.row.getElement().offsetParent !== null) {
            rows.push(cell.row);
            cell.row.clearCellHeight();
          } else {
            cell.row.heightInitialized = false;
          }
        }
      });
      rows.forEach(function(row) {
        row.calcHeight();
      });
      rows.forEach(function(row) {
        row.setCellHeight();
      });
    }
    getWidth() {
      var width = 0;
      if (this.isGroup) {
        this.columns.forEach(function(column) {
          if (column.visible) {
            width += column.getWidth();
          }
        });
      } else {
        width = this.width;
      }
      return width;
    }
    getLeftOffset() {
      var offset = this.element.offsetLeft;
      if (this.parent.isGroup) {
        offset += this.parent.getLeftOffset();
      }
      return offset;
    }
    getHeight() {
      return Math.ceil(this.element.getBoundingClientRect().height);
    }
    setMinWidth(minWidth) {
      if (this.maxWidth && minWidth > this.maxWidth) {
        minWidth = this.maxWidth;
        console.warn("the minWidth (" + minWidth + "px) for column '" + this.field + "' cannot be bigger that its maxWidth (" + this.maxWidthStyled + ")");
      }
      this.minWidth = minWidth;
      this.minWidthStyled = minWidth ? minWidth + "px" : "";
      this.element.style.minWidth = this.minWidthStyled;
      this.cells.forEach(function(cell) {
        cell.setMinWidth();
      });
    }
    setMaxWidth(maxWidth) {
      if (this.minWidth && maxWidth < this.minWidth) {
        maxWidth = this.minWidth;
        console.warn("the maxWidth (" + maxWidth + "px) for column '" + this.field + "' cannot be smaller that its minWidth (" + this.minWidthStyled + ")");
      }
      this.maxWidth = maxWidth;
      this.maxWidthStyled = maxWidth ? maxWidth + "px" : "";
      this.element.style.maxWidth = this.maxWidthStyled;
      this.cells.forEach(function(cell) {
        cell.setMaxWidth();
      });
    }
    delete() {
      return new Promise((resolve, reject) => {
        if (this.isGroup) {
          this.columns.forEach(function(column) {
            column.delete();
          });
        }
        this.dispatch("column-delete", this);
        var cellCount = this.cells.length;
        for (let i = 0; i < cellCount; i++) {
          this.cells[0].delete();
        }
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        this.element = false;
        this.contentElement = false;
        this.titleElement = false;
        this.groupElement = false;
        if (this.parent.isGroup) {
          this.parent.removeChild(this);
        }
        this.table.columnManager.deregisterColumn(this);
        this.table.columnManager.rerenderColumns(true);
        this.dispatch("column-deleted", this);
        resolve();
      });
    }
    columnRendered() {
      if (this.titleFormatterRendered) {
        this.titleFormatterRendered();
      }
      this.dispatch("column-rendered", this);
    }
    //////////////// Cell Management /////////////////
    //generate cell for this column
    generateCell(row) {
      var cell = new Cell(this, row);
      this.cells.push(cell);
      return cell;
    }
    nextColumn() {
      var index = this.table.columnManager.findColumnIndex(this);
      return index > -1 ? this._nextVisibleColumn(index + 1) : false;
    }
    _nextVisibleColumn(index) {
      var column = this.table.columnManager.getColumnByIndex(index);
      return !column || column.visible ? column : this._nextVisibleColumn(index + 1);
    }
    prevColumn() {
      var index = this.table.columnManager.findColumnIndex(this);
      return index > -1 ? this._prevVisibleColumn(index - 1) : false;
    }
    _prevVisibleColumn(index) {
      var column = this.table.columnManager.getColumnByIndex(index);
      return !column || column.visible ? column : this._prevVisibleColumn(index - 1);
    }
    reinitializeWidth(force) {
      this.widthFixed = false;
      if (typeof this.definition.width !== "undefined" && !force) {
        this.setWidth(this.definition.width);
      }
      this.dispatch("column-width-fit-before", this);
      this.fitToData(force);
      this.dispatch("column-width-fit-after", this);
    }
    //set column width to maximum cell width for non group columns
    fitToData(force) {
      if (this.isGroup) {
        return;
      }
      if (!this.widthFixed) {
        this.element.style.width = "";
        this.cells.forEach((cell) => {
          cell.clearWidth();
        });
      }
      var maxWidth = this.element.offsetWidth;
      if (!this.width || !this.widthFixed) {
        this.cells.forEach((cell) => {
          var width = cell.getWidth();
          if (width > maxWidth) {
            maxWidth = width;
          }
        });
        if (maxWidth) {
          var setTo = maxWidth + 1;
          if (this.maxInitialWidth && !force) {
            setTo = Math.min(setTo, this.maxInitialWidth);
          }
          this.setWidthActual(setTo);
        }
      }
    }
    updateDefinition(updates) {
      var definition;
      if (!this.isGroup) {
        if (!this.parent.isGroup) {
          definition = Object.assign({}, this.getDefinition());
          definition = Object.assign(definition, updates);
          return this.table.columnManager.addColumn(definition, false, this).then((column) => {
            if (definition.field == this.field) {
              this.field = false;
            }
            return this.delete().then(() => {
              return column.getComponent();
            });
          });
        } else {
          console.error("Column Update Error - The updateDefinition function is only available on ungrouped columns");
          return Promise.reject("Column Update Error - The updateDefinition function is only available on columns, not column groups");
        }
      } else {
        console.error("Column Update Error - The updateDefinition function is only available on ungrouped columns");
        return Promise.reject("Column Update Error - The updateDefinition function is only available on columns, not column groups");
      }
    }
    deleteCell(cell) {
      var index = this.cells.indexOf(cell);
      if (index > -1) {
        this.cells.splice(index, 1);
      }
    }
    //////////////// Object Generation /////////////////
    getComponent() {
      if (!this.component) {
        this.component = new ColumnComponent(this);
      }
      return this.component;
    }
    getPosition() {
      return this.table.columnManager.getVisibleColumnsByIndex().indexOf(this) + 1;
    }
    getParentComponent() {
      return this.parent instanceof _Column ? this.parent.getComponent() : false;
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/Helpers.js
  var Helpers = class {
    static elVisible(el) {
      return !(el.offsetWidth <= 0 && el.offsetHeight <= 0);
    }
    static elOffset(el) {
      var box = el.getBoundingClientRect();
      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      };
    }
    static retrieveNestedData(separator, field, data) {
      var structure = separator ? field.split(separator) : [field], length = structure.length, output;
      for (let i = 0; i < length; i++) {
        data = data[structure[i]];
        output = data;
        if (!data) {
          break;
        }
      }
      return output;
    }
    static deepClone(obj, clone, list = []) {
      var objectProto = {}.__proto__, arrayProto = [].__proto__;
      if (!clone) {
        clone = Object.assign(Array.isArray(obj) ? [] : {}, obj);
      }
      for (var i in obj) {
        let subject = obj[i], match, copy;
        if (subject != null && typeof subject === "object" && (subject.__proto__ === objectProto || subject.__proto__ === arrayProto)) {
          match = list.findIndex((item) => {
            return item.subject === subject;
          });
          if (match > -1) {
            clone[i] = list[match].copy;
          } else {
            copy = Object.assign(Array.isArray(subject) ? [] : {}, subject);
            list.unshift({ subject, copy });
            clone[i] = this.deepClone(subject, copy, list);
          }
        }
      }
      return clone;
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/OptionsList.js
  var OptionsList = class {
    constructor(table, msgType, defaults = {}) {
      this.table = table;
      this.msgType = msgType;
      this.registeredDefaults = Object.assign({}, defaults);
    }
    register(option, value) {
      this.registeredDefaults[option] = value;
    }
    generate(defaultOptions, userOptions = {}) {
      var output = Object.assign({}, this.registeredDefaults), warn = this.table.options.debugInvalidOptions || userOptions.debugInvalidOptions === true;
      Object.assign(output, defaultOptions);
      for (let key in userOptions) {
        if (!output.hasOwnProperty(key)) {
          if (warn) {
            console.warn("Invalid " + this.msgType + " option:", key);
          }
          output[key] = userOptions.key;
        }
      }
      for (let key in output) {
        if (key in userOptions) {
          output[key] = userOptions[key];
        } else {
          if (Array.isArray(output[key])) {
            output[key] = Object.assign([], output[key]);
          } else if (typeof output[key] === "object" && output[key] !== null) {
            output[key] = Object.assign({}, output[key]);
          } else if (typeof output[key] === "undefined") {
            delete output[key];
          }
        }
      }
      return output;
    }
  };

  // node_modules/tabulator-tables/src/js/core/rendering/Renderer.js
  var Renderer = class extends CoreFeature {
    constructor(table) {
      super(table);
      this.elementVertical = table.rowManager.element;
      this.elementHorizontal = table.columnManager.element;
      this.tableElement = table.rowManager.tableElement;
      this.verticalFillMode = "fit";
    }
    ///////////////////////////////////
    /////// Internal Bindings /////////
    ///////////////////////////////////
    initialize() {
    }
    clearRows() {
    }
    clearColumns() {
    }
    reinitializeColumnWidths(columns) {
    }
    renderRows() {
    }
    renderColumns() {
    }
    rerenderRows(callback) {
      if (callback) {
        callback();
      }
    }
    rerenderColumns(update, blockRedraw) {
    }
    renderRowCells(row) {
    }
    rerenderRowCells(row, force) {
    }
    scrollColumns(left, dir) {
    }
    scrollRows(top, dir) {
    }
    resize() {
    }
    scrollToRow(row) {
    }
    scrollToRowNearestTop(row) {
    }
    visibleRows(includingBuffer) {
      return [];
    }
    ///////////////////////////////////
    //////// Helper Functions /////////
    ///////////////////////////////////
    rows() {
      return this.table.rowManager.getDisplayRows();
    }
    styleRow(row, index) {
      var rowEl = row.getElement();
      if (index % 2) {
        rowEl.classList.add("tabulator-row-even");
        rowEl.classList.remove("tabulator-row-odd");
      } else {
        rowEl.classList.add("tabulator-row-odd");
        rowEl.classList.remove("tabulator-row-even");
      }
    }
    ///////////////////////////////////
    /////// External Triggers /////////
    /////// (DO NOT OVERRIDE) /////////
    ///////////////////////////////////
    clear() {
      this.clearRows();
      this.clearColumns();
    }
    render() {
      this.renderRows();
      this.renderColumns();
    }
    rerender(callback) {
      this.rerenderRows();
      this.rerenderColumns();
    }
    scrollToRowPosition(row, position, ifVisible) {
      var rowIndex = this.rows().indexOf(row), rowEl = row.getElement(), offset = 0;
      return new Promise((resolve, reject) => {
        if (rowIndex > -1) {
          if (typeof ifVisible === "undefined") {
            ifVisible = this.table.options.scrollToRowIfVisible;
          }
          if (!ifVisible) {
            if (Helpers.elVisible(rowEl)) {
              offset = Helpers.elOffset(rowEl).top - Helpers.elOffset(this.elementVertical).top;
              if (offset > 0 && offset < this.elementVertical.clientHeight - rowEl.offsetHeight) {
                resolve();
                return false;
              }
            }
          }
          if (typeof position === "undefined") {
            position = this.table.options.scrollToRowPosition;
          }
          if (position === "nearest") {
            position = this.scrollToRowNearestTop(row) ? "top" : "bottom";
          }
          this.scrollToRow(row);
          switch (position) {
            case "middle":
            case "center":
              if (this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight) {
                this.elementVertical.scrollTop = this.elementVertical.scrollTop + (rowEl.offsetTop - this.elementVertical.scrollTop) - (this.elementVertical.scrollHeight - rowEl.offsetTop) / 2;
              } else {
                this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight / 2;
              }
              break;
            case "bottom":
              if (this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight) {
                this.elementVertical.scrollTop = this.elementVertical.scrollTop - (this.elementVertical.scrollHeight - rowEl.offsetTop) + rowEl.offsetHeight;
              } else {
                this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight + rowEl.offsetHeight;
              }
              break;
            case "top":
              this.elementVertical.scrollTop = rowEl.offsetTop;
              break;
          }
          resolve();
        } else {
          console.warn("Scroll Error - Row not visible");
          reject("Scroll Error - Row not visible");
        }
      });
    }
  };

  // node_modules/tabulator-tables/src/js/core/rendering/renderers/BasicHorizontal.js
  var BasicHorizontal = class extends Renderer {
    constructor(table) {
      super(table);
    }
    renderRowCells(row, inFragment) {
      const rowFrag = document.createDocumentFragment();
      row.cells.forEach((cell) => {
        rowFrag.appendChild(cell.getElement());
      });
      row.element.appendChild(rowFrag);
      if (!inFragment) {
        row.cells.forEach((cell) => {
          cell.cellRendered();
        });
      }
    }
    reinitializeColumnWidths(columns) {
      columns.forEach(function(column) {
        column.reinitializeWidth();
      });
    }
  };

  // node_modules/tabulator-tables/src/js/core/rendering/renderers/VirtualDomHorizontal.js
  var VirtualDomHorizontal = class extends Renderer {
    constructor(table) {
      super(table);
      this.leftCol = 0;
      this.rightCol = 0;
      this.scrollLeft = 0;
      this.vDomScrollPosLeft = 0;
      this.vDomScrollPosRight = 0;
      this.vDomPadLeft = 0;
      this.vDomPadRight = 0;
      this.fitDataColAvg = 0;
      this.windowBuffer = 200;
      this.visibleRows = null;
      this.initialized = false;
      this.isFitData = false;
      this.columns = [];
    }
    initialize() {
      this.compatibilityCheck();
      this.layoutCheck();
      this.vertScrollListen();
    }
    compatibilityCheck() {
      if (this.options("layout") == "fitDataTable") {
        console.warn("Horizontal Virtual DOM is not compatible with fitDataTable layout mode");
      }
      if (this.options("responsiveLayout")) {
        console.warn("Horizontal Virtual DOM is not compatible with responsive columns");
      }
      if (this.options("rtl")) {
        console.warn("Horizontal Virtual DOM is not currently compatible with RTL text direction");
      }
    }
    layoutCheck() {
      this.isFitData = this.options("layout").startsWith("fitData");
    }
    vertScrollListen() {
      this.subscribe("scroll-vertical", this.clearVisRowCache.bind(this));
      this.subscribe("data-refreshed", this.clearVisRowCache.bind(this));
    }
    clearVisRowCache() {
      this.visibleRows = null;
    }
    //////////////////////////////////////
    ///////// Public Functions ///////////
    //////////////////////////////////////
    renderColumns(row, force) {
      this.dataChange();
    }
    scrollColumns(left, dir) {
      if (this.scrollLeft != left) {
        this.scrollLeft = left;
        this.scroll(left - (this.vDomScrollPosLeft + this.windowBuffer));
      }
    }
    calcWindowBuffer() {
      var buffer = this.elementVertical.clientWidth;
      this.table.columnManager.columnsByIndex.forEach((column) => {
        if (column.visible) {
          var width = column.getWidth();
          if (width > buffer) {
            buffer = width;
          }
        }
      });
      this.windowBuffer = buffer * 2;
    }
    rerenderColumns(update, blockRedraw) {
      var old = {
        cols: this.columns,
        leftCol: this.leftCol,
        rightCol: this.rightCol
      }, colPos = 0;
      if (update && !this.initialized) {
        return;
      }
      this.clear();
      this.calcWindowBuffer();
      this.scrollLeft = this.elementVertical.scrollLeft;
      this.vDomScrollPosLeft = this.scrollLeft - this.windowBuffer;
      this.vDomScrollPosRight = this.scrollLeft + this.elementVertical.clientWidth + this.windowBuffer;
      this.table.columnManager.columnsByIndex.forEach((column) => {
        var config = {}, width;
        if (column.visible) {
          if (!column.modules.frozen) {
            width = column.getWidth();
            config.leftPos = colPos;
            config.rightPos = colPos + width;
            config.width = width;
            if (this.isFitData) {
              config.fitDataCheck = column.modules.vdomHoz ? column.modules.vdomHoz.fitDataCheck : true;
            }
            if (colPos + width > this.vDomScrollPosLeft && colPos < this.vDomScrollPosRight) {
              if (this.leftCol == -1) {
                this.leftCol = this.columns.length;
                this.vDomPadLeft = colPos;
              }
              this.rightCol = this.columns.length;
            } else {
              if (this.leftCol !== -1) {
                this.vDomPadRight += width;
              }
            }
            this.columns.push(column);
            column.modules.vdomHoz = config;
            colPos += width;
          }
        }
      });
      this.tableElement.style.paddingLeft = this.vDomPadLeft + "px";
      this.tableElement.style.paddingRight = this.vDomPadRight + "px";
      this.initialized = true;
      if (!blockRedraw) {
        if (!update || this.reinitChanged(old)) {
          this.reinitializeRows();
        }
      }
      this.elementVertical.scrollLeft = this.scrollLeft;
    }
    renderRowCells(row) {
      if (this.initialized) {
        this.initializeRow(row);
      } else {
        const rowFrag = document.createDocumentFragment();
        row.cells.forEach((cell) => {
          rowFrag.appendChild(cell.getElement());
        });
        row.element.appendChild(rowFrag);
        row.cells.forEach((cell) => {
          cell.cellRendered();
        });
      }
    }
    rerenderRowCells(row, force) {
      this.reinitializeRow(row, force);
    }
    reinitializeColumnWidths(columns) {
      for (let i = this.leftCol; i <= this.rightCol; i++) {
        this.columns[i].reinitializeWidth();
      }
    }
    //////////////////////////////////////
    //////// Internal Rendering //////////
    //////////////////////////////////////
    deinitialize() {
      this.initialized = false;
    }
    clear() {
      this.columns = [];
      this.leftCol = -1;
      this.rightCol = 0;
      this.vDomScrollPosLeft = 0;
      this.vDomScrollPosRight = 0;
      this.vDomPadLeft = 0;
      this.vDomPadRight = 0;
    }
    dataChange() {
      var change = false, row, rowEl;
      if (this.isFitData) {
        this.table.columnManager.columnsByIndex.forEach((column) => {
          if (!column.definition.width && column.visible) {
            change = true;
          }
        });
        if (change && this.table.rowManager.getDisplayRows().length) {
          this.vDomScrollPosRight = this.scrollLeft + this.elementVertical.clientWidth + this.windowBuffer;
          row = this.chain("rows-sample", [1], [], () => {
            return this.table.rowManager.getDisplayRows();
          })[0];
          if (row) {
            rowEl = row.getElement();
            row.generateCells();
            this.tableElement.appendChild(rowEl);
            for (let colEnd = 0; colEnd < row.cells.length; colEnd++) {
              let cell = row.cells[colEnd];
              rowEl.appendChild(cell.getElement());
              cell.column.reinitializeWidth();
            }
            rowEl.parentNode.removeChild(rowEl);
            this.rerenderColumns(false, true);
          }
        }
      } else {
        if (this.options("layout") === "fitColumns") {
          this.layoutRefresh();
          this.rerenderColumns(false, true);
        }
      }
    }
    reinitChanged(old) {
      var match = true;
      if (old.cols.length !== this.columns.length || old.leftCol !== this.leftCol || old.rightCol !== this.rightCol) {
        return true;
      }
      old.cols.forEach((col, i) => {
        if (col !== this.columns[i]) {
          match = false;
        }
      });
      return !match;
    }
    reinitializeRows() {
      var visibleRows = this.getVisibleRows(), otherRows = this.table.rowManager.getRows().filter((row) => !visibleRows.includes(row));
      visibleRows.forEach((row) => {
        this.reinitializeRow(row, true);
      });
      otherRows.forEach((row) => {
        row.deinitialize();
      });
    }
    getVisibleRows() {
      if (!this.visibleRows) {
        this.visibleRows = this.table.rowManager.getVisibleRows();
      }
      return this.visibleRows;
    }
    scroll(diff) {
      this.vDomScrollPosLeft += diff;
      this.vDomScrollPosRight += diff;
      if (Math.abs(diff) > this.windowBuffer / 2) {
        this.rerenderColumns();
      } else {
        if (diff > 0) {
          this.addColRight();
          this.removeColLeft();
        } else {
          this.addColLeft();
          this.removeColRight();
        }
      }
    }
    colPositionAdjust(start, end, diff) {
      for (let i = start; i < end; i++) {
        let column = this.columns[i];
        column.modules.vdomHoz.leftPos += diff;
        column.modules.vdomHoz.rightPos += diff;
      }
    }
    addColRight() {
      var changes = false, working = true;
      while (working) {
        let column = this.columns[this.rightCol + 1];
        if (column) {
          if (column.modules.vdomHoz.leftPos <= this.vDomScrollPosRight) {
            changes = true;
            this.getVisibleRows().forEach((row) => {
              if (row.type !== "group") {
                var cell = row.getCell(column);
                row.getElement().insertBefore(cell.getElement(), row.getCell(this.columns[this.rightCol]).getElement().nextSibling);
                cell.cellRendered();
              }
            });
            this.fitDataColActualWidthCheck(column);
            this.rightCol++;
            this.getVisibleRows().forEach((row) => {
              if (row.type !== "group") {
                row.modules.vdomHoz.rightCol = this.rightCol;
              }
            });
            if (this.rightCol >= this.columns.length - 1) {
              this.vDomPadRight = 0;
            } else {
              this.vDomPadRight -= column.getWidth();
            }
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      }
      if (changes) {
        this.tableElement.style.paddingRight = this.vDomPadRight + "px";
      }
    }
    addColLeft() {
      var changes = false, working = true;
      while (working) {
        let column = this.columns[this.leftCol - 1];
        if (column) {
          if (column.modules.vdomHoz.rightPos >= this.vDomScrollPosLeft) {
            changes = true;
            this.getVisibleRows().forEach((row) => {
              if (row.type !== "group") {
                var cell = row.getCell(column);
                row.getElement().insertBefore(cell.getElement(), row.getCell(this.columns[this.leftCol]).getElement());
                cell.cellRendered();
              }
            });
            this.leftCol--;
            this.getVisibleRows().forEach((row) => {
              if (row.type !== "group") {
                row.modules.vdomHoz.leftCol = this.leftCol;
              }
            });
            if (this.leftCol <= 0) {
              this.vDomPadLeft = 0;
            } else {
              this.vDomPadLeft -= column.getWidth();
            }
            let diff = this.fitDataColActualWidthCheck(column);
            if (diff) {
              this.scrollLeft = this.elementVertical.scrollLeft = this.elementVertical.scrollLeft + diff;
              this.vDomPadRight -= diff;
            }
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      }
      if (changes) {
        this.tableElement.style.paddingLeft = this.vDomPadLeft + "px";
      }
    }
    removeColRight() {
      var changes = false, working = true;
      while (working) {
        let column = this.columns[this.rightCol];
        if (column) {
          if (column.modules.vdomHoz.leftPos > this.vDomScrollPosRight) {
            changes = true;
            this.getVisibleRows().forEach((row) => {
              if (row.type !== "group") {
                var cell = row.getCell(column);
                try {
                  row.getElement().removeChild(cell.getElement());
                } catch (ex) {
                  console.warn("Could not removeColRight", ex.message);
                }
              }
            });
            this.vDomPadRight += column.getWidth();
            this.rightCol--;
            this.getVisibleRows().forEach((row) => {
              if (row.type !== "group") {
                row.modules.vdomHoz.rightCol = this.rightCol;
              }
            });
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      }
      if (changes) {
        this.tableElement.style.paddingRight = this.vDomPadRight + "px";
      }
    }
    removeColLeft() {
      var changes = false, working = true;
      while (working) {
        let column = this.columns[this.leftCol];
        if (column) {
          if (column.modules.vdomHoz.rightPos < this.vDomScrollPosLeft) {
            changes = true;
            this.getVisibleRows().forEach((row) => {
              if (row.type !== "group") {
                var cell = row.getCell(column);
                try {
                  row.getElement().removeChild(cell.getElement());
                } catch (ex) {
                  console.warn("Could not removeColLeft", ex.message);
                }
              }
            });
            this.vDomPadLeft += column.getWidth();
            this.leftCol++;
            this.getVisibleRows().forEach((row) => {
              if (row.type !== "group") {
                row.modules.vdomHoz.leftCol = this.leftCol;
              }
            });
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      }
      if (changes) {
        this.tableElement.style.paddingLeft = this.vDomPadLeft + "px";
      }
    }
    fitDataColActualWidthCheck(column) {
      var newWidth, widthDiff;
      if (column.modules.vdomHoz.fitDataCheck) {
        column.reinitializeWidth();
        newWidth = column.getWidth();
        widthDiff = newWidth - column.modules.vdomHoz.width;
        if (widthDiff) {
          column.modules.vdomHoz.rightPos += widthDiff;
          column.modules.vdomHoz.width = newWidth;
          this.colPositionAdjust(this.columns.indexOf(column) + 1, this.columns.length, widthDiff);
        }
        column.modules.vdomHoz.fitDataCheck = false;
      }
      return widthDiff;
    }
    initializeRow(row) {
      if (row.type !== "group") {
        row.modules.vdomHoz = {
          leftCol: this.leftCol,
          rightCol: this.rightCol
        };
        if (this.table.modules.frozenColumns) {
          this.table.modules.frozenColumns.leftColumns.forEach((column) => {
            this.appendCell(row, column);
          });
        }
        for (let i = this.leftCol; i <= this.rightCol; i++) {
          this.appendCell(row, this.columns[i]);
        }
        if (this.table.modules.frozenColumns) {
          this.table.modules.frozenColumns.rightColumns.forEach((column) => {
            this.appendCell(row, column);
          });
        }
      }
    }
    appendCell(row, column) {
      if (column && column.visible) {
        let cell = row.getCell(column);
        row.getElement().appendChild(cell.getElement());
        cell.cellRendered();
      }
    }
    reinitializeRow(row, force) {
      if (row.type !== "group") {
        if (force || !row.modules.vdomHoz || row.modules.vdomHoz.leftCol !== this.leftCol || row.modules.vdomHoz.rightCol !== this.rightCol) {
          var rowEl = row.getElement();
          while (rowEl.firstChild) rowEl.removeChild(rowEl.firstChild);
          this.initializeRow(row);
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/core/ColumnManager.js
  var ColumnManager = class extends CoreFeature {
    constructor(table) {
      super(table);
      this.blockHozScrollEvent = false;
      this.headersElement = null;
      this.contentsElement = null;
      this.rowHeader = null;
      this.element = null;
      this.columns = [];
      this.columnsByIndex = [];
      this.columnsByField = {};
      this.scrollLeft = 0;
      this.optionsList = new OptionsList(this.table, "column definition", options_default2);
      this.redrawBlock = false;
      this.redrawBlockUpdate = null;
      this.renderer = null;
    }
    ////////////// Setup Functions /////////////////
    initialize() {
      this.initializeRenderer();
      this.headersElement = this.createHeadersElement();
      this.contentsElement = this.createHeaderContentsElement();
      this.element = this.createHeaderElement();
      this.contentsElement.insertBefore(this.headersElement, this.contentsElement.firstChild);
      this.element.insertBefore(this.contentsElement, this.element.firstChild);
      this.initializeScrollWheelWatcher();
      this.subscribe("scroll-horizontal", this.scrollHorizontal.bind(this));
      this.subscribe("scrollbar-vertical", this.padVerticalScrollbar.bind(this));
    }
    padVerticalScrollbar(width) {
      if (this.table.rtl) {
        this.headersElement.style.marginLeft = width + "px";
      } else {
        this.headersElement.style.marginRight = width + "px";
      }
    }
    initializeRenderer() {
      var renderClass;
      var renderers = {
        "virtual": VirtualDomHorizontal,
        "basic": BasicHorizontal
      };
      if (typeof this.table.options.renderHorizontal === "string") {
        renderClass = renderers[this.table.options.renderHorizontal];
      } else {
        renderClass = this.table.options.renderHorizontal;
      }
      if (renderClass) {
        this.renderer = new renderClass(this.table, this.element, this.tableElement);
        this.renderer.initialize();
      } else {
        console.error("Unable to find matching renderer:", this.table.options.renderHorizontal);
      }
    }
    createHeadersElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-headers");
      el.setAttribute("role", "row");
      return el;
    }
    createHeaderContentsElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-header-contents");
      el.setAttribute("role", "rowgroup");
      return el;
    }
    createHeaderElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-header");
      el.setAttribute("role", "rowgroup");
      if (!this.table.options.headerVisible) {
        el.classList.add("tabulator-header-hidden");
      }
      return el;
    }
    //return containing element
    getElement() {
      return this.element;
    }
    //return containing contents element
    getContentsElement() {
      return this.contentsElement;
    }
    //return header containing element
    getHeadersElement() {
      return this.headersElement;
    }
    //scroll horizontally to match table body
    scrollHorizontal(left) {
      this.contentsElement.scrollLeft = left;
      this.scrollLeft = left;
      this.renderer.scrollColumns(left);
    }
    initializeScrollWheelWatcher() {
      this.contentsElement.addEventListener("wheel", (e) => {
        var left;
        if (e.deltaX) {
          left = this.contentsElement.scrollLeft + e.deltaX;
          this.table.rowManager.scrollHorizontal(left);
          this.table.columnManager.scrollHorizontal(left);
        }
      });
    }
    ///////////// Column Setup Functions /////////////
    generateColumnsFromRowData(data) {
      var cols = [], collProgress = {}, rowSample = this.table.options.autoColumns === "full" ? data : [data[0]], definitions = this.table.options.autoColumnsDefinitions;
      if (data && data.length) {
        rowSample.forEach((row) => {
          Object.keys(row).forEach((key, index) => {
            let value = row[key], col;
            if (!collProgress[key]) {
              col = {
                field: key,
                title: key,
                sorter: this.calculateSorterFromValue(value)
              };
              cols.splice(index, 0, col);
              collProgress[key] = typeof value === "undefined" ? col : true;
            } else if (collProgress[key] !== true) {
              if (typeof value !== "undefined") {
                collProgress[key].sorter = this.calculateSorterFromValue(value);
                collProgress[key] = true;
              }
            }
          });
        });
        if (definitions) {
          switch (typeof definitions) {
            case "function":
              this.table.options.columns = definitions.call(this.table, cols);
              break;
            case "object":
              if (Array.isArray(definitions)) {
                cols.forEach((col) => {
                  var match = definitions.find((def) => {
                    return def.field === col.field;
                  });
                  if (match) {
                    Object.assign(col, match);
                  }
                });
              } else {
                cols.forEach((col) => {
                  if (definitions[col.field]) {
                    Object.assign(col, definitions[col.field]);
                  }
                });
              }
              this.table.options.columns = cols;
              break;
          }
        } else {
          this.table.options.columns = cols;
        }
        this.setColumns(this.table.options.columns);
      }
    }
    calculateSorterFromValue(value) {
      var sorter;
      switch (typeof value) {
        case "undefined":
          sorter = "string";
          break;
        case "boolean":
          sorter = "boolean";
          break;
        case "number":
          sorter = "number";
          break;
        case "object":
          if (Array.isArray(value)) {
            sorter = "array";
          } else {
            sorter = "string";
          }
          break;
        default:
          if (!isNaN(value) && value !== "") {
            sorter = "number";
          } else {
            if (value.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i)) {
              sorter = "alphanum";
            } else {
              sorter = "string";
            }
          }
          break;
      }
      return sorter;
    }
    setColumns(cols, row) {
      while (this.headersElement.firstChild) this.headersElement.removeChild(this.headersElement.firstChild);
      this.columns = [];
      this.columnsByIndex = [];
      this.columnsByField = {};
      this.dispatch("columns-loading");
      this.dispatchExternal("columnsLoading");
      if (this.table.options.rowHeader) {
        this.rowHeader = new Column(this.table.options.rowHeader === true ? {} : this.table.options.rowHeader, this, true);
        this.columns.push(this.rowHeader);
        this.headersElement.appendChild(this.rowHeader.getElement());
        this.rowHeader.columnRendered();
      }
      cols.forEach((def, i) => {
        this._addColumn(def);
      });
      this._reIndexColumns();
      this.dispatch("columns-loaded");
      if (this.subscribedExternal("columnsLoaded")) {
        this.dispatchExternal("columnsLoaded", this.getComponents());
      }
      this.rerenderColumns(false, true);
      this.redraw(true);
    }
    _addColumn(definition, before, nextToColumn) {
      var column = new Column(definition, this), colEl = column.getElement(), index = nextToColumn ? this.findColumnIndex(nextToColumn) : nextToColumn;
      if (before && this.rowHeader && (!nextToColumn || nextToColumn === this.rowHeader)) {
        before = false;
        nextToColumn = this.rowHeader;
        index = 0;
      }
      if (nextToColumn && index > -1) {
        var topColumn = nextToColumn.getTopColumn();
        var parentIndex = this.columns.indexOf(topColumn);
        var nextEl = topColumn.getElement();
        if (before) {
          this.columns.splice(parentIndex, 0, column);
          nextEl.parentNode.insertBefore(colEl, nextEl);
        } else {
          this.columns.splice(parentIndex + 1, 0, column);
          nextEl.parentNode.insertBefore(colEl, nextEl.nextSibling);
        }
      } else {
        if (before) {
          this.columns.unshift(column);
          this.headersElement.insertBefore(column.getElement(), this.headersElement.firstChild);
        } else {
          this.columns.push(column);
          this.headersElement.appendChild(column.getElement());
        }
      }
      column.columnRendered();
      return column;
    }
    registerColumnField(col) {
      if (col.definition.field) {
        this.columnsByField[col.definition.field] = col;
      }
    }
    registerColumnPosition(col) {
      this.columnsByIndex.push(col);
    }
    _reIndexColumns() {
      this.columnsByIndex = [];
      this.columns.forEach(function(column) {
        column.reRegisterPosition();
      });
    }
    //ensure column headers take up the correct amount of space in column groups
    verticalAlignHeaders() {
      var minHeight = 0;
      if (!this.redrawBlock) {
        this.headersElement.style.height = "";
        this.columns.forEach((column) => {
          column.clearVerticalAlign();
        });
        this.columns.forEach((column) => {
          var height = column.getHeight();
          if (height > minHeight) {
            minHeight = height;
          }
        });
        this.headersElement.style.height = minHeight + "px";
        this.columns.forEach((column) => {
          column.verticalAlign(this.table.options.columnHeaderVertAlign, minHeight);
        });
        this.table.rowManager.adjustTableSize();
      }
    }
    //////////////// Column Details /////////////////
    findColumn(subject) {
      var columns;
      if (typeof subject == "object") {
        if (subject instanceof Column) {
          return subject;
        } else if (subject instanceof ColumnComponent) {
          return subject._getSelf() || false;
        } else if (typeof HTMLElement !== "undefined" && subject instanceof HTMLElement) {
          columns = [];
          this.columns.forEach((column) => {
            columns.push(column);
            columns = columns.concat(column.getColumns(true));
          });
          let match = columns.find((column) => {
            return column.element === subject;
          });
          return match || false;
        }
      } else {
        return this.columnsByField[subject] || false;
      }
      return false;
    }
    getColumnByField(field) {
      return this.columnsByField[field];
    }
    getColumnsByFieldRoot(root) {
      var matches = [];
      Object.keys(this.columnsByField).forEach((field) => {
        var fieldRoot = this.table.options.nestedFieldSeparator ? field.split(this.table.options.nestedFieldSeparator)[0] : field;
        if (fieldRoot === root) {
          matches.push(this.columnsByField[field]);
        }
      });
      return matches;
    }
    getColumnByIndex(index) {
      return this.columnsByIndex[index];
    }
    getFirstVisibleColumn() {
      var index = this.columnsByIndex.findIndex((col) => {
        return col.visible;
      });
      return index > -1 ? this.columnsByIndex[index] : false;
    }
    getVisibleColumnsByIndex() {
      return this.columnsByIndex.filter((col) => col.visible);
    }
    getColumns() {
      return this.columns;
    }
    findColumnIndex(column) {
      return this.columnsByIndex.findIndex((col) => {
        return column === col;
      });
    }
    //return all columns that are not groups
    getRealColumns() {
      return this.columnsByIndex;
    }
    //traverse across columns and call action
    traverse(callback) {
      this.columnsByIndex.forEach((column, i) => {
        callback(column, i);
      });
    }
    //get definitions of actual columns
    getDefinitions(active) {
      var output = [];
      this.columnsByIndex.forEach((column) => {
        if (!active || active && column.visible) {
          output.push(column.getDefinition());
        }
      });
      return output;
    }
    //get full nested definition tree
    getDefinitionTree() {
      var output = [];
      this.columns.forEach((column) => {
        output.push(column.getDefinition(true));
      });
      return output;
    }
    getComponents(structured) {
      var output = [], columns = structured ? this.columns : this.columnsByIndex;
      columns.forEach((column) => {
        output.push(column.getComponent());
      });
      return output;
    }
    getWidth() {
      var width = 0;
      this.columnsByIndex.forEach((column) => {
        if (column.visible) {
          width += column.getWidth();
        }
      });
      return width;
    }
    moveColumn(from, to, after) {
      to.element.parentNode.insertBefore(from.element, to.element);
      if (after) {
        to.element.parentNode.insertBefore(to.element, from.element);
      }
      this.moveColumnActual(from, to, after);
      this.verticalAlignHeaders();
      this.table.rowManager.reinitialize();
    }
    moveColumnActual(from, to, after) {
      if (from.parent.isGroup) {
        this._moveColumnInArray(from.parent.columns, from, to, after);
      } else {
        this._moveColumnInArray(this.columns, from, to, after);
      }
      this._moveColumnInArray(this.columnsByIndex, from, to, after, true);
      this.rerenderColumns(true);
      this.dispatch("column-moved", from, to, after);
      if (this.subscribedExternal("columnMoved")) {
        this.dispatchExternal("columnMoved", from.getComponent(), this.table.columnManager.getComponents());
      }
    }
    _moveColumnInArray(columns, from, to, after, updateRows) {
      var fromIndex = columns.indexOf(from), toIndex, rows = [];
      if (fromIndex > -1) {
        columns.splice(fromIndex, 1);
        toIndex = columns.indexOf(to);
        if (toIndex > -1) {
          if (after) {
            toIndex = toIndex + 1;
          }
        } else {
          toIndex = fromIndex;
        }
        columns.splice(toIndex, 0, from);
        if (updateRows) {
          rows = this.chain("column-moving-rows", [from, to, after], null, []) || [];
          rows = rows.concat(this.table.rowManager.rows);
          rows.forEach(function(row) {
            if (row.cells.length) {
              var cell = row.cells.splice(fromIndex, 1)[0];
              row.cells.splice(toIndex, 0, cell);
            }
          });
        }
      }
    }
    scrollToColumn(column, position, ifVisible) {
      var left = 0, offset = column.getLeftOffset(), adjust = 0, colEl = column.getElement();
      return new Promise((resolve, reject) => {
        if (typeof position === "undefined") {
          position = this.table.options.scrollToColumnPosition;
        }
        if (typeof ifVisible === "undefined") {
          ifVisible = this.table.options.scrollToColumnIfVisible;
        }
        if (column.visible) {
          switch (position) {
            case "middle":
            case "center":
              adjust = -this.element.clientWidth / 2;
              break;
            case "right":
              adjust = colEl.clientWidth - this.headersElement.clientWidth;
              break;
          }
          if (!ifVisible) {
            if (offset > 0 && offset + colEl.offsetWidth < this.element.clientWidth) {
              return false;
            }
          }
          left = offset + adjust;
          left = Math.max(Math.min(left, this.table.rowManager.element.scrollWidth - this.table.rowManager.element.clientWidth), 0);
          this.table.rowManager.scrollHorizontal(left);
          this.scrollHorizontal(left);
          resolve();
        } else {
          console.warn("Scroll Error - Column not visible");
          reject("Scroll Error - Column not visible");
        }
      });
    }
    //////////////// Cell Management /////////////////
    generateCells(row) {
      var cells = [];
      this.columnsByIndex.forEach((column) => {
        cells.push(column.generateCell(row));
      });
      return cells;
    }
    //////////////// Column Management /////////////////
    getFlexBaseWidth() {
      var totalWidth = this.table.element.clientWidth, fixedWidth = 0;
      if (this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight) {
        totalWidth -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth;
      }
      this.columnsByIndex.forEach(function(column) {
        var width, minWidth, colWidth;
        if (column.visible) {
          width = column.definition.width || 0;
          minWidth = parseInt(column.minWidth);
          if (typeof width == "string") {
            if (width.indexOf("%") > -1) {
              colWidth = totalWidth / 100 * parseInt(width);
            } else {
              colWidth = parseInt(width);
            }
          } else {
            colWidth = width;
          }
          fixedWidth += colWidth > minWidth ? colWidth : minWidth;
        }
      });
      return fixedWidth;
    }
    addColumn(definition, before, nextToColumn) {
      return new Promise((resolve, reject) => {
        var column = this._addColumn(definition, before, nextToColumn);
        this._reIndexColumns();
        this.dispatch("column-add", definition, before, nextToColumn);
        if (this.layoutMode() != "fitColumns") {
          column.reinitializeWidth();
        }
        this.redraw(true);
        this.table.rowManager.reinitialize();
        this.rerenderColumns();
        resolve(column);
      });
    }
    //remove column from system
    deregisterColumn(column) {
      var field = column.getField(), index;
      if (field) {
        delete this.columnsByField[field];
      }
      index = this.columnsByIndex.indexOf(column);
      if (index > -1) {
        this.columnsByIndex.splice(index, 1);
      }
      index = this.columns.indexOf(column);
      if (index > -1) {
        this.columns.splice(index, 1);
      }
      this.verticalAlignHeaders();
      this.redraw();
    }
    rerenderColumns(update, silent) {
      if (!this.redrawBlock) {
        this.renderer.rerenderColumns(update, silent);
      } else {
        if (update === false || update === true && this.redrawBlockUpdate === null) {
          this.redrawBlockUpdate = update;
        }
      }
    }
    blockRedraw() {
      this.redrawBlock = true;
      this.redrawBlockUpdate = null;
    }
    restoreRedraw() {
      this.redrawBlock = false;
      this.verticalAlignHeaders();
      this.renderer.rerenderColumns(this.redrawBlockUpdate);
    }
    //redraw columns
    redraw(force) {
      if (Helpers.elVisible(this.element)) {
        this.verticalAlignHeaders();
      }
      if (force) {
        this.table.rowManager.resetScroll();
        this.table.rowManager.reinitialize();
      }
      if (!this.confirm("table-redrawing", force)) {
        this.layoutRefresh(force);
      }
      this.dispatch("table-redraw", force);
      this.table.footerManager.redraw();
    }
  };

  // node_modules/tabulator-tables/src/js/core/row/RowComponent.js
  var RowComponent = class {
    constructor(row) {
      this._row = row;
      return new Proxy(this, {
        get: function(target, name, receiver) {
          if (typeof target[name] !== "undefined") {
            return target[name];
          } else {
            return target._row.table.componentFunctionBinder.handle("row", target._row, name);
          }
        }
      });
    }
    getData(transform) {
      return this._row.getData(transform);
    }
    getElement() {
      return this._row.getElement();
    }
    getCells() {
      var cells = [];
      this._row.getCells().forEach(function(cell) {
        cells.push(cell.getComponent());
      });
      return cells;
    }
    getCell(column) {
      var cell = this._row.getCell(column);
      return cell ? cell.getComponent() : false;
    }
    getIndex() {
      return this._row.getData("data")[this._row.table.options.index];
    }
    getPosition() {
      return this._row.getPosition();
    }
    watchPosition(callback) {
      return this._row.watchPosition(callback);
    }
    delete() {
      return this._row.delete();
    }
    scrollTo(position, ifVisible) {
      return this._row.table.rowManager.scrollToRow(this._row, position, ifVisible);
    }
    move(to, after) {
      this._row.moveToRow(to, after);
    }
    update(data) {
      return this._row.updateData(data);
    }
    normalizeHeight() {
      this._row.normalizeHeight(true);
    }
    _getSelf() {
      return this._row;
    }
    reformat() {
      return this._row.reinitialize();
    }
    getTable() {
      return this._row.table;
    }
    getNextRow() {
      var row = this._row.nextRow();
      return row ? row.getComponent() : row;
    }
    getPrevRow() {
      var row = this._row.prevRow();
      return row ? row.getComponent() : row;
    }
  };

  // node_modules/tabulator-tables/src/js/core/row/Row.js
  var Row = class extends CoreFeature {
    constructor(data, parent, type = "row") {
      super(parent.table);
      this.parent = parent;
      this.data = {};
      this.type = type;
      this.element = false;
      this.modules = {};
      this.cells = [];
      this.height = 0;
      this.heightStyled = "";
      this.manualHeight = false;
      this.outerHeight = 0;
      this.initialized = false;
      this.heightInitialized = false;
      this.position = 0;
      this.positionWatchers = [];
      this.component = null;
      this.created = false;
      this.setData(data);
    }
    create() {
      if (!this.created) {
        this.created = true;
        this.generateElement();
      }
    }
    createElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-row");
      el.setAttribute("role", "row");
      this.element = el;
    }
    getElement() {
      this.create();
      return this.element;
    }
    detachElement() {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
    generateElement() {
      this.createElement();
      this.dispatch("row-init", this);
    }
    generateCells() {
      this.cells = this.table.columnManager.generateCells(this);
    }
    //functions to setup on first render
    initialize(force, inFragment) {
      this.create();
      if (!this.initialized || force) {
        this.deleteCells();
        while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
        this.dispatch("row-layout-before", this);
        this.generateCells();
        this.initialized = true;
        this.table.columnManager.renderer.renderRowCells(this, inFragment);
        if (force) {
          this.normalizeHeight();
        }
        this.dispatch("row-layout", this);
        if (this.table.options.rowFormatter) {
          this.table.options.rowFormatter(this.getComponent());
        }
        this.dispatch("row-layout-after", this);
      } else {
        this.table.columnManager.renderer.rerenderRowCells(this, inFragment);
      }
    }
    rendered() {
      this.cells.forEach((cell) => {
        cell.cellRendered();
      });
    }
    reinitializeHeight() {
      this.heightInitialized = false;
      if (this.element && this.element.offsetParent !== null) {
        this.normalizeHeight(true);
      }
    }
    deinitialize() {
      this.initialized = false;
    }
    deinitializeHeight() {
      this.heightInitialized = false;
    }
    reinitialize(children) {
      this.initialized = false;
      this.heightInitialized = false;
      if (!this.manualHeight) {
        this.height = 0;
        this.heightStyled = "";
      }
      if (this.element && this.element.offsetParent !== null) {
        this.initialize(true);
      }
      this.dispatch("row-relayout", this);
    }
    //get heights when doing bulk row style calcs in virtual DOM
    calcHeight(force) {
      var maxHeight = 0, minHeight = 0;
      if (this.table.options.rowHeight) {
        this.height = this.table.options.rowHeight;
      } else {
        minHeight = this.calcMinHeight();
        maxHeight = this.calcMaxHeight();
        if (force) {
          this.height = Math.max(maxHeight, minHeight);
        } else {
          this.height = this.manualHeight ? this.height : Math.max(maxHeight, minHeight);
        }
      }
      this.heightStyled = this.height ? this.height + "px" : "";
      this.outerHeight = this.element.offsetHeight;
    }
    calcMinHeight() {
      return this.table.options.resizableRows ? this.element.clientHeight : 0;
    }
    calcMaxHeight() {
      var maxHeight = 0;
      this.cells.forEach(function(cell) {
        var height = cell.getHeight();
        if (height > maxHeight) {
          maxHeight = height;
        }
      });
      return maxHeight;
    }
    //set of cells
    setCellHeight() {
      this.cells.forEach(function(cell) {
        cell.setHeight();
      });
      this.heightInitialized = true;
    }
    clearCellHeight() {
      this.cells.forEach(function(cell) {
        cell.clearHeight();
      });
    }
    //normalize the height of elements in the row
    normalizeHeight(force) {
      if (force && !this.table.options.rowHeight) {
        this.clearCellHeight();
      }
      this.calcHeight(force);
      this.setCellHeight();
    }
    //set height of rows
    setHeight(height, force) {
      if (this.height != height || force) {
        this.manualHeight = true;
        this.height = height;
        this.heightStyled = height ? height + "px" : "";
        this.setCellHeight();
        this.outerHeight = this.element.offsetHeight;
        if (this.subscribedExternal("rowHeight")) {
          this.dispatchExternal("rowHeight", this.getComponent());
        }
      }
    }
    //return rows outer height
    getHeight() {
      return this.outerHeight;
    }
    //return rows outer Width
    getWidth() {
      return this.element.offsetWidth;
    }
    //////////////// Cell Management /////////////////
    deleteCell(cell) {
      var index = this.cells.indexOf(cell);
      if (index > -1) {
        this.cells.splice(index, 1);
      }
    }
    //////////////// Data Management /////////////////
    setData(data) {
      this.data = this.chain("row-data-init-before", [this, data], void 0, data);
      this.dispatch("row-data-init-after", this);
    }
    //update the rows data
    updateData(updatedData) {
      var visible = this.element && Helpers.elVisible(this.element), tempData = {}, newRowData;
      return new Promise((resolve, reject) => {
        if (typeof updatedData === "string") {
          updatedData = JSON.parse(updatedData);
        }
        this.dispatch("row-data-save-before", this);
        if (this.subscribed("row-data-changing")) {
          tempData = Object.assign(tempData, this.data);
          tempData = Object.assign(tempData, updatedData);
        }
        newRowData = this.chain("row-data-changing", [this, tempData, updatedData], null, updatedData);
        for (let attrname in newRowData) {
          this.data[attrname] = newRowData[attrname];
        }
        this.dispatch("row-data-save-after", this);
        for (let attrname in updatedData) {
          let columns = this.table.columnManager.getColumnsByFieldRoot(attrname);
          columns.forEach((column) => {
            let cell = this.getCell(column.getField());
            if (cell) {
              let value = column.getFieldValue(newRowData);
              if (cell.getValue() !== value) {
                cell.setValueProcessData(value);
                if (visible) {
                  cell.cellRendered();
                }
              }
            }
          });
        }
        if (visible) {
          this.normalizeHeight(true);
          if (this.table.options.rowFormatter) {
            this.table.options.rowFormatter(this.getComponent());
          }
        } else {
          this.initialized = false;
          this.height = 0;
          this.heightStyled = "";
        }
        this.dispatch("row-data-changed", this, visible, updatedData);
        this.dispatchExternal("rowUpdated", this.getComponent());
        if (this.subscribedExternal("dataChanged")) {
          this.dispatchExternal("dataChanged", this.table.rowManager.getData());
        }
        resolve();
      });
    }
    getData(transform) {
      if (transform) {
        return this.chain("row-data-retrieve", [this, transform], null, this.data);
      }
      return this.data;
    }
    getCell(column) {
      var match = false;
      column = this.table.columnManager.findColumn(column);
      if (!this.initialized && this.cells.length === 0) {
        this.generateCells();
      }
      match = this.cells.find(function(cell) {
        return cell.column === column;
      });
      return match;
    }
    getCellIndex(findCell) {
      return this.cells.findIndex(function(cell) {
        return cell === findCell;
      });
    }
    findCell(subject) {
      return this.cells.find((cell) => {
        return cell.element === subject;
      });
    }
    getCells() {
      if (!this.initialized && this.cells.length === 0) {
        this.generateCells();
      }
      return this.cells;
    }
    nextRow() {
      var row = this.table.rowManager.nextDisplayRow(this, true);
      return row || false;
    }
    prevRow() {
      var row = this.table.rowManager.prevDisplayRow(this, true);
      return row || false;
    }
    moveToRow(to, before) {
      var toRow = this.table.rowManager.findRow(to);
      if (toRow) {
        this.table.rowManager.moveRowActual(this, toRow, !before);
        this.table.rowManager.refreshActiveData("display", false, true);
      } else {
        console.warn("Move Error - No matching row found:", to);
      }
    }
    ///////////////////// Actions  /////////////////////
    delete() {
      this.dispatch("row-delete", this);
      this.deleteActual();
      return Promise.resolve();
    }
    deleteActual(blockRedraw) {
      this.detachModules();
      this.table.rowManager.deleteRow(this, blockRedraw);
      this.deleteCells();
      this.initialized = false;
      this.heightInitialized = false;
      this.element = false;
      this.dispatch("row-deleted", this);
    }
    detachModules() {
      this.dispatch("row-deleting", this);
    }
    deleteCells() {
      var cellCount = this.cells.length;
      for (let i = 0; i < cellCount; i++) {
        this.cells[0].delete();
      }
    }
    wipe() {
      this.detachModules();
      this.deleteCells();
      if (this.element) {
        while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }
      this.element = false;
      this.modules = {};
    }
    isDisplayed() {
      return this.table.rowManager.getDisplayRows().includes(this);
    }
    getPosition() {
      return this.isDisplayed() ? this.position : false;
    }
    setPosition(position) {
      if (position != this.position) {
        this.position = position;
        this.positionWatchers.forEach((callback) => {
          callback(this.position);
        });
      }
    }
    watchPosition(callback) {
      this.positionWatchers.push(callback);
      callback(this.position);
    }
    getGroup() {
      return this.modules.group || false;
    }
    //////////////// Object Generation /////////////////
    getComponent() {
      if (!this.component) {
        this.component = new RowComponent(this);
      }
      return this.component;
    }
  };

  // node_modules/tabulator-tables/src/js/core/rendering/renderers/BasicVertical.js
  var BasicVertical = class extends Renderer {
    constructor(table) {
      super(table);
      this.verticalFillMode = "fill";
      this.scrollTop = 0;
      this.scrollLeft = 0;
      this.scrollTop = 0;
      this.scrollLeft = 0;
    }
    clearRows() {
      var element = this.tableElement;
      while (element.firstChild) element.removeChild(element.firstChild);
      element.scrollTop = 0;
      element.scrollLeft = 0;
      element.style.minWidth = "";
      element.style.minHeight = "";
      element.style.display = "";
      element.style.visibility = "";
    }
    renderRows() {
      var element = this.tableElement, onlyGroupHeaders = true, tableFrag = document.createDocumentFragment(), rows = this.rows();
      rows.forEach((row, index) => {
        this.styleRow(row, index);
        row.initialize(false, true);
        if (row.type !== "group") {
          onlyGroupHeaders = false;
        }
        tableFrag.appendChild(row.getElement());
      });
      element.appendChild(tableFrag);
      rows.forEach((row) => {
        row.rendered();
        if (!row.heightInitialized) {
          row.calcHeight(true);
        }
      });
      rows.forEach((row) => {
        if (!row.heightInitialized) {
          row.setCellHeight();
        }
      });
      if (onlyGroupHeaders) {
        element.style.minWidth = this.table.columnManager.getWidth() + "px";
      } else {
        element.style.minWidth = "";
      }
    }
    rerenderRows(callback) {
      this.clearRows();
      if (callback) {
        callback();
      }
      this.renderRows();
      if (!this.rows().length) {
        this.table.rowManager.tableEmpty();
      }
    }
    scrollToRowNearestTop(row) {
      var rowTop = Helpers.elOffset(row.getElement()).top;
      return !(Math.abs(this.elementVertical.scrollTop - rowTop) > Math.abs(this.elementVertical.scrollTop + this.elementVertical.clientHeight - rowTop));
    }
    scrollToRow(row) {
      var rowEl = row.getElement();
      this.elementVertical.scrollTop = Helpers.elOffset(rowEl).top - Helpers.elOffset(this.elementVertical).top + this.elementVertical.scrollTop;
    }
    visibleRows(includingBuffer) {
      return this.rows();
    }
  };

  // node_modules/tabulator-tables/src/js/core/rendering/renderers/VirtualDomVertical.js
  var VirtualDomVertical = class extends Renderer {
    constructor(table) {
      super(table);
      this.verticalFillMode = "fill";
      this.scrollTop = 0;
      this.scrollLeft = 0;
      this.vDomRowHeight = 20;
      this.vDomTop = 0;
      this.vDomBottom = 0;
      this.vDomScrollPosTop = 0;
      this.vDomScrollPosBottom = 0;
      this.vDomTopPad = 0;
      this.vDomBottomPad = 0;
      this.vDomMaxRenderChain = 90;
      this.vDomWindowBuffer = 0;
      this.vDomWindowMinTotalRows = 20;
      this.vDomWindowMinMarginRows = 5;
      this.vDomTopNewRows = [];
      this.vDomBottomNewRows = [];
    }
    //////////////////////////////////////
    ///////// Public Functions ///////////
    //////////////////////////////////////
    clearRows() {
      var element = this.tableElement;
      while (element.firstChild) element.removeChild(element.firstChild);
      element.style.paddingTop = "";
      element.style.paddingBottom = "";
      element.style.minHeight = "";
      element.style.display = "";
      element.style.visibility = "";
      this.elementVertical.scrollTop = 0;
      this.elementVertical.scrollLeft = 0;
      this.scrollTop = 0;
      this.scrollLeft = 0;
      this.vDomTop = 0;
      this.vDomBottom = 0;
      this.vDomTopPad = 0;
      this.vDomBottomPad = 0;
      this.vDomScrollPosTop = 0;
      this.vDomScrollPosBottom = 0;
    }
    renderRows() {
      this._virtualRenderFill();
    }
    rerenderRows(callback) {
      var scrollTop = this.elementVertical.scrollTop;
      var topRow = false;
      var topOffset = false;
      var left = this.table.rowManager.scrollLeft;
      var rows = this.rows();
      for (var i = this.vDomTop; i <= this.vDomBottom; i++) {
        if (rows[i]) {
          var diff = scrollTop - rows[i].getElement().offsetTop;
          if (topOffset === false || Math.abs(diff) < topOffset) {
            topOffset = diff;
            topRow = i;
          } else {
            break;
          }
        }
      }
      rows.forEach((row) => {
        row.deinitializeHeight();
      });
      if (callback) {
        callback();
      }
      if (this.rows().length) {
        this._virtualRenderFill(topRow === false ? this.rows.length - 1 : topRow, true, topOffset || 0);
      } else {
        this.clear();
        this.table.rowManager.tableEmpty();
      }
      this.scrollColumns(left);
    }
    scrollColumns(left) {
      this.table.rowManager.scrollHorizontal(left);
    }
    scrollRows(top, dir) {
      var topDiff = top - this.vDomScrollPosTop;
      var bottomDiff = top - this.vDomScrollPosBottom;
      var margin = this.vDomWindowBuffer * 2;
      var rows = this.rows();
      this.scrollTop = top;
      if (-topDiff > margin || bottomDiff > margin) {
        var left = this.table.rowManager.scrollLeft;
        this._virtualRenderFill(Math.floor(this.elementVertical.scrollTop / this.elementVertical.scrollHeight * rows.length));
        this.scrollColumns(left);
      } else {
        if (dir) {
          if (topDiff < 0) {
            this._addTopRow(rows, -topDiff);
          }
          if (bottomDiff < 0) {
            if (this.vDomScrollHeight - this.scrollTop > this.vDomWindowBuffer) {
              this._removeBottomRow(rows, -bottomDiff);
            } else {
              this.vDomScrollPosBottom = this.scrollTop;
            }
          }
        } else {
          if (bottomDiff >= 0) {
            this._addBottomRow(rows, bottomDiff);
          }
          if (topDiff >= 0) {
            if (this.scrollTop > this.vDomWindowBuffer) {
              this._removeTopRow(rows, topDiff);
            } else {
              this.vDomScrollPosTop = this.scrollTop;
            }
          }
        }
      }
    }
    resize() {
      this.vDomWindowBuffer = this.table.options.renderVerticalBuffer || this.elementVertical.clientHeight;
    }
    scrollToRowNearestTop(row) {
      var rowIndex = this.rows().indexOf(row);
      return !(Math.abs(this.vDomTop - rowIndex) > Math.abs(this.vDomBottom - rowIndex));
    }
    scrollToRow(row) {
      var index = this.rows().indexOf(row);
      if (index > -1) {
        this._virtualRenderFill(index, true);
      }
    }
    visibleRows(includingBuffer) {
      var topEdge = this.elementVertical.scrollTop, bottomEdge = this.elementVertical.clientHeight + topEdge, topFound = false, topRow = 0, bottomRow = 0, rows = this.rows();
      if (includingBuffer) {
        topRow = this.vDomTop;
        bottomRow = this.vDomBottom;
      } else {
        for (var i = this.vDomTop; i <= this.vDomBottom; i++) {
          if (rows[i]) {
            if (!topFound) {
              if (topEdge - rows[i].getElement().offsetTop >= 0) {
                topRow = i;
              } else {
                topFound = true;
                if (bottomEdge - rows[i].getElement().offsetTop >= 0) {
                  bottomRow = i;
                } else {
                  break;
                }
              }
            } else {
              if (bottomEdge - rows[i].getElement().offsetTop >= 0) {
                bottomRow = i;
              } else {
                break;
              }
            }
          }
        }
      }
      return rows.slice(topRow, bottomRow + 1);
    }
    //////////////////////////////////////
    //////// Internal Rendering //////////
    //////////////////////////////////////
    //full virtual render
    _virtualRenderFill(position, forceMove, offset) {
      var element = this.tableElement, holder = this.elementVertical, topPad = 0, rowsHeight = 0, rowHeight = 0, heightOccupied = 0, topPadHeight = 0, i = 0, rows = this.rows(), rowsCount = rows.length, index = 0, row, rowFragment, renderedRows = [], totalRowsRendered = 0, rowsToRender = 0, fixedHeight = this.table.rowManager.fixedHeight, containerHeight = this.elementVertical.clientHeight, avgRowHeight = this.table.options.rowHeight, resized = true;
      position = position || 0;
      offset = offset || 0;
      if (!position) {
        this.clear();
      } else {
        while (element.firstChild) element.removeChild(element.firstChild);
        heightOccupied = (rowsCount - position + 1) * this.vDomRowHeight;
        if (heightOccupied < containerHeight) {
          position -= Math.ceil((containerHeight - heightOccupied) / this.vDomRowHeight);
          if (position < 0) {
            position = 0;
          }
        }
        topPad = Math.min(Math.max(Math.floor(this.vDomWindowBuffer / this.vDomRowHeight), this.vDomWindowMinMarginRows), position);
        position -= topPad;
      }
      if (rowsCount && Helpers.elVisible(this.elementVertical)) {
        this.vDomTop = position;
        this.vDomBottom = position - 1;
        if (fixedHeight || this.table.options.maxHeight) {
          if (avgRowHeight) {
            rowsToRender = containerHeight / avgRowHeight + this.vDomWindowBuffer / avgRowHeight;
          }
          rowsToRender = Math.max(this.vDomWindowMinTotalRows, Math.ceil(rowsToRender));
        } else {
          rowsToRender = rowsCount;
        }
        while ((rowsToRender == rowsCount || rowsHeight <= containerHeight + this.vDomWindowBuffer || totalRowsRendered < this.vDomWindowMinTotalRows) && this.vDomBottom < rowsCount - 1) {
          renderedRows = [];
          rowFragment = document.createDocumentFragment();
          i = 0;
          while (i < rowsToRender && this.vDomBottom < rowsCount - 1) {
            index = this.vDomBottom + 1, row = rows[index];
            this.styleRow(row, index);
            row.initialize(false, true);
            if (!row.heightInitialized && !this.table.options.rowHeight) {
              row.clearCellHeight();
            }
            rowFragment.appendChild(row.getElement());
            renderedRows.push(row);
            this.vDomBottom++;
            i++;
          }
          if (!renderedRows.length) {
            break;
          }
          element.appendChild(rowFragment);
          renderedRows.forEach((row2) => {
            row2.rendered();
            if (!row2.heightInitialized) {
              row2.calcHeight(true);
            }
          });
          renderedRows.forEach((row2) => {
            if (!row2.heightInitialized) {
              row2.setCellHeight();
            }
          });
          renderedRows.forEach((row2) => {
            rowHeight = row2.getHeight();
            if (totalRowsRendered < topPad) {
              topPadHeight += rowHeight;
            } else {
              rowsHeight += rowHeight;
            }
            if (rowHeight > this.vDomWindowBuffer) {
              this.vDomWindowBuffer = rowHeight * 2;
            }
            totalRowsRendered++;
          });
          resized = this.table.rowManager.adjustTableSize();
          containerHeight = this.elementVertical.clientHeight;
          if (resized && (fixedHeight || this.table.options.maxHeight)) {
            avgRowHeight = rowsHeight / totalRowsRendered;
            rowsToRender = Math.max(this.vDomWindowMinTotalRows, Math.ceil(containerHeight / avgRowHeight + this.vDomWindowBuffer / avgRowHeight));
          }
        }
        if (!position) {
          this.vDomTopPad = 0;
          this.vDomRowHeight = Math.floor((rowsHeight + topPadHeight) / totalRowsRendered);
          this.vDomBottomPad = this.vDomRowHeight * (rowsCount - this.vDomBottom - 1);
          this.vDomScrollHeight = topPadHeight + rowsHeight + this.vDomBottomPad - containerHeight;
        } else {
          this.vDomTopPad = !forceMove ? this.scrollTop - topPadHeight : this.vDomRowHeight * this.vDomTop + offset;
          this.vDomBottomPad = this.vDomBottom == rowsCount - 1 ? 0 : Math.max(this.vDomScrollHeight - this.vDomTopPad - rowsHeight - topPadHeight, 0);
        }
        element.style.paddingTop = this.vDomTopPad + "px";
        element.style.paddingBottom = this.vDomBottomPad + "px";
        if (forceMove) {
          this.scrollTop = this.vDomTopPad + topPadHeight + offset - (this.elementVertical.scrollWidth > this.elementVertical.clientWidth ? this.elementVertical.offsetHeight - containerHeight : 0);
        }
        this.scrollTop = Math.min(this.scrollTop, this.elementVertical.scrollHeight - containerHeight);
        if (this.elementVertical.scrollWidth > this.elementVertical.clientWidth && forceMove) {
          this.scrollTop += this.elementVertical.offsetHeight - containerHeight;
        }
        this.vDomScrollPosTop = this.scrollTop;
        this.vDomScrollPosBottom = this.scrollTop;
        holder.scrollTop = this.scrollTop;
        this.dispatch("render-virtual-fill");
      }
    }
    _addTopRow(rows, fillableSpace) {
      var table = this.tableElement, addedRows = [], paddingAdjust = 0, index = this.vDomTop - 1, i = 0, working = true;
      while (working) {
        if (this.vDomTop) {
          let row = rows[index], rowHeight, initialized;
          if (row && i < this.vDomMaxRenderChain) {
            rowHeight = row.getHeight() || this.vDomRowHeight;
            initialized = row.initialized;
            if (fillableSpace >= rowHeight) {
              this.styleRow(row, index);
              table.insertBefore(row.getElement(), table.firstChild);
              if (!row.initialized || !row.heightInitialized) {
                addedRows.push(row);
              }
              row.initialize();
              if (!initialized) {
                rowHeight = row.getElement().offsetHeight;
                if (rowHeight > this.vDomWindowBuffer) {
                  this.vDomWindowBuffer = rowHeight * 2;
                }
              }
              fillableSpace -= rowHeight;
              paddingAdjust += rowHeight;
              this.vDomTop--;
              index--;
              i++;
            } else {
              working = false;
            }
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      }
      for (let row of addedRows) {
        row.clearCellHeight();
      }
      this._quickNormalizeRowHeight(addedRows);
      if (paddingAdjust) {
        this.vDomTopPad -= paddingAdjust;
        if (this.vDomTopPad < 0) {
          this.vDomTopPad = index * this.vDomRowHeight;
        }
        if (index < 1) {
          this.vDomTopPad = 0;
        }
        table.style.paddingTop = this.vDomTopPad + "px";
        this.vDomScrollPosTop -= paddingAdjust;
      }
    }
    _removeTopRow(rows, fillableSpace) {
      var removableRows = [], paddingAdjust = 0, i = 0, working = true;
      while (working) {
        let row = rows[this.vDomTop], rowHeight;
        if (row && i < this.vDomMaxRenderChain) {
          rowHeight = row.getHeight() || this.vDomRowHeight;
          if (fillableSpace >= rowHeight) {
            this.vDomTop++;
            fillableSpace -= rowHeight;
            paddingAdjust += rowHeight;
            removableRows.push(row);
            i++;
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      }
      for (let row of removableRows) {
        let rowEl = row.getElement();
        if (rowEl.parentNode) {
          rowEl.parentNode.removeChild(rowEl);
        }
      }
      if (paddingAdjust) {
        this.vDomTopPad += paddingAdjust;
        this.tableElement.style.paddingTop = this.vDomTopPad + "px";
        this.vDomScrollPosTop += this.vDomTop ? paddingAdjust : paddingAdjust + this.vDomWindowBuffer;
      }
    }
    _addBottomRow(rows, fillableSpace) {
      var table = this.tableElement, addedRows = [], paddingAdjust = 0, index = this.vDomBottom + 1, i = 0, working = true;
      while (working) {
        let row = rows[index], rowHeight, initialized;
        if (row && i < this.vDomMaxRenderChain) {
          rowHeight = row.getHeight() || this.vDomRowHeight;
          initialized = row.initialized;
          if (fillableSpace >= rowHeight) {
            this.styleRow(row, index);
            table.appendChild(row.getElement());
            if (!row.initialized || !row.heightInitialized) {
              addedRows.push(row);
            }
            row.initialize();
            if (!initialized) {
              rowHeight = row.getElement().offsetHeight;
              if (rowHeight > this.vDomWindowBuffer) {
                this.vDomWindowBuffer = rowHeight * 2;
              }
            }
            fillableSpace -= rowHeight;
            paddingAdjust += rowHeight;
            this.vDomBottom++;
            index++;
            i++;
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      }
      for (let row of addedRows) {
        row.clearCellHeight();
      }
      this._quickNormalizeRowHeight(addedRows);
      if (paddingAdjust) {
        this.vDomBottomPad -= paddingAdjust;
        if (this.vDomBottomPad < 0 || index == rows.length - 1) {
          this.vDomBottomPad = 0;
        }
        table.style.paddingBottom = this.vDomBottomPad + "px";
        this.vDomScrollPosBottom += paddingAdjust;
      }
    }
    _removeBottomRow(rows, fillableSpace) {
      var removableRows = [], paddingAdjust = 0, i = 0, working = true;
      while (working) {
        let row = rows[this.vDomBottom], rowHeight;
        if (row && i < this.vDomMaxRenderChain) {
          rowHeight = row.getHeight() || this.vDomRowHeight;
          if (fillableSpace >= rowHeight) {
            this.vDomBottom--;
            fillableSpace -= rowHeight;
            paddingAdjust += rowHeight;
            removableRows.push(row);
            i++;
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      }
      for (let row of removableRows) {
        let rowEl = row.getElement();
        if (rowEl.parentNode) {
          rowEl.parentNode.removeChild(rowEl);
        }
      }
      if (paddingAdjust) {
        this.vDomBottomPad += paddingAdjust;
        if (this.vDomBottomPad < 0) {
          this.vDomBottomPad = 0;
        }
        this.tableElement.style.paddingBottom = this.vDomBottomPad + "px";
        this.vDomScrollPosBottom -= paddingAdjust;
      }
    }
    _quickNormalizeRowHeight(rows) {
      for (let row of rows) {
        row.calcHeight();
      }
      for (let row of rows) {
        row.setCellHeight();
      }
    }
  };

  // node_modules/tabulator-tables/src/js/core/RowManager.js
  var RowManager = class extends CoreFeature {
    constructor(table) {
      super(table);
      this.element = this.createHolderElement();
      this.tableElement = this.createTableElement();
      this.heightFixer = this.createTableElement();
      this.placeholder = null;
      this.placeholderContents = null;
      this.firstRender = false;
      this.renderMode = "virtual";
      this.fixedHeight = false;
      this.rows = [];
      this.activeRowsPipeline = [];
      this.activeRows = [];
      this.activeRowsCount = 0;
      this.displayRows = [];
      this.displayRowsCount = 0;
      this.scrollTop = 0;
      this.scrollLeft = 0;
      this.redrawBlock = false;
      this.redrawBlockRestoreConfig = false;
      this.redrawBlockRenderInPosition = false;
      this.dataPipeline = [];
      this.displayPipeline = [];
      this.scrollbarWidth = 0;
      this.renderer = null;
    }
    //////////////// Setup Functions /////////////////
    createHolderElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-tableholder");
      el.setAttribute("tabindex", 0);
      return el;
    }
    createTableElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-table");
      el.setAttribute("role", "rowgroup");
      return el;
    }
    initializePlaceholder() {
      var placeholder = this.table.options.placeholder;
      if (typeof placeholder === "function") {
        placeholder = placeholder.call(this.table);
      }
      placeholder = this.chain("placeholder", [placeholder], placeholder, placeholder) || placeholder;
      if (placeholder) {
        let el = document.createElement("div");
        el.classList.add("tabulator-placeholder");
        if (typeof placeholder == "string") {
          let contents = document.createElement("div");
          contents.classList.add("tabulator-placeholder-contents");
          contents.innerHTML = placeholder;
          el.appendChild(contents);
          this.placeholderContents = contents;
        } else if (typeof HTMLElement !== "undefined" && placeholder instanceof HTMLElement) {
          el.appendChild(placeholder);
          this.placeholderContents = placeholder;
        } else {
          console.warn("Invalid placeholder provided, must be string or HTML Element", placeholder);
          this.el = null;
        }
        this.placeholder = el;
      }
    }
    //return containing element
    getElement() {
      return this.element;
    }
    //return table element
    getTableElement() {
      return this.tableElement;
    }
    initialize() {
      this.initializePlaceholder();
      this.initializeRenderer();
      this.element.appendChild(this.tableElement);
      this.firstRender = true;
      this.element.addEventListener("scroll", () => {
        var left = this.element.scrollLeft, leftDir = this.scrollLeft > left, top = this.element.scrollTop, topDir = this.scrollTop > top;
        if (this.scrollLeft != left) {
          this.scrollLeft = left;
          this.dispatch("scroll-horizontal", left, leftDir);
          this.dispatchExternal("scrollHorizontal", left, leftDir);
          this._positionPlaceholder();
        }
        if (this.scrollTop != top) {
          this.scrollTop = top;
          this.renderer.scrollRows(top, topDir);
          this.dispatch("scroll-vertical", top, topDir);
          this.dispatchExternal("scrollVertical", top, topDir);
        }
      });
    }
    ////////////////// Row Manipulation //////////////////
    findRow(subject) {
      if (typeof subject == "object") {
        if (subject instanceof Row) {
          return subject;
        } else if (subject instanceof RowComponent) {
          return subject._getSelf() || false;
        } else if (typeof HTMLElement !== "undefined" && subject instanceof HTMLElement) {
          let match = this.rows.find((row) => {
            return row.getElement() === subject;
          });
          return match || false;
        } else if (subject === null) {
          return false;
        }
      } else if (typeof subject == "undefined") {
        return false;
      } else {
        let match = this.rows.find((row) => {
          return row.data[this.table.options.index] == subject;
        });
        return match || false;
      }
      return false;
    }
    getRowFromDataObject(data) {
      var match = this.rows.find((row) => {
        return row.data === data;
      });
      return match || false;
    }
    getRowFromPosition(position) {
      return this.getDisplayRows().find((row) => {
        return row.type === "row" && row.getPosition() === position && row.isDisplayed();
      });
    }
    scrollToRow(row, position, ifVisible) {
      return this.renderer.scrollToRowPosition(row, position, ifVisible);
    }
    ////////////////// Data Handling //////////////////
    setData(data, renderInPosition, columnsChanged) {
      return new Promise((resolve, reject) => {
        if (renderInPosition && this.getDisplayRows().length) {
          if (this.table.options.pagination) {
            this._setDataActual(data, true);
          } else {
            this.reRenderInPosition(() => {
              this._setDataActual(data);
            });
          }
        } else {
          if (this.table.options.autoColumns && columnsChanged && this.table.initialized) {
            this.table.columnManager.generateColumnsFromRowData(data);
          }
          this.resetScroll();
          this._setDataActual(data);
        }
        resolve();
      });
    }
    _setDataActual(data, renderInPosition) {
      this.dispatchExternal("dataProcessing", data);
      this._wipeElements();
      if (Array.isArray(data)) {
        this.dispatch("data-processing", data);
        data.forEach((def, i) => {
          if (def && typeof def === "object") {
            var row = new Row(def, this);
            this.rows.push(row);
          } else {
            console.warn("Data Loading Warning - Invalid row data detected and ignored, expecting object but received:", def);
          }
        });
        this.refreshActiveData(false, false, renderInPosition);
        this.dispatch("data-processed", data);
        this.dispatchExternal("dataProcessed", data);
      } else {
        console.error("Data Loading Error - Unable to process data due to invalid data type \nExpecting: array \nReceived: ", typeof data, "\nData:     ", data);
      }
    }
    _wipeElements() {
      this.dispatch("rows-wipe");
      this.destroy();
      this.adjustTableSize();
      this.dispatch("rows-wiped");
    }
    destroy() {
      this.rows.forEach((row) => {
        row.wipe();
      });
      this.rows = [];
      this.activeRows = [];
      this.activeRowsPipeline = [];
      this.activeRowsCount = 0;
      this.displayRows = [];
      this.displayRowsCount = 0;
    }
    deleteRow(row, blockRedraw) {
      var allIndex = this.rows.indexOf(row), activeIndex = this.activeRows.indexOf(row);
      if (activeIndex > -1) {
        this.activeRows.splice(activeIndex, 1);
      }
      if (allIndex > -1) {
        this.rows.splice(allIndex, 1);
      }
      this.setActiveRows(this.activeRows);
      this.displayRowIterator((rows) => {
        var displayIndex = rows.indexOf(row);
        if (displayIndex > -1) {
          rows.splice(displayIndex, 1);
        }
      });
      if (!blockRedraw) {
        this.reRenderInPosition();
      }
      this.regenerateRowPositions();
      this.dispatchExternal("rowDeleted", row.getComponent());
      if (!this.displayRowsCount) {
        this.tableEmpty();
      }
      if (this.subscribedExternal("dataChanged")) {
        this.dispatchExternal("dataChanged", this.getData());
      }
    }
    addRow(data, pos, index, blockRedraw) {
      var row = this.addRowActual(data, pos, index, blockRedraw);
      return row;
    }
    //add multiple rows
    addRows(data, pos, index, refreshDisplayOnly) {
      var rows = [];
      return new Promise((resolve, reject) => {
        pos = this.findAddRowPos(pos);
        if (!Array.isArray(data)) {
          data = [data];
        }
        if (typeof index == "undefined" && pos || typeof index !== "undefined" && !pos) {
          data.reverse();
        }
        data.forEach((item, i) => {
          var row = this.addRow(item, pos, index, true);
          rows.push(row);
          this.dispatch("row-added", row, item, pos, index);
        });
        this.refreshActiveData(refreshDisplayOnly ? "displayPipeline" : false, false, true);
        this.regenerateRowPositions();
        if (this.displayRowsCount) {
          this._clearPlaceholder();
        }
        resolve(rows);
      });
    }
    findAddRowPos(pos) {
      if (typeof pos === "undefined") {
        pos = this.table.options.addRowPos;
      }
      if (pos === "pos") {
        pos = true;
      }
      if (pos === "bottom") {
        pos = false;
      }
      return pos;
    }
    addRowActual(data, pos, index, blockRedraw) {
      var row = data instanceof Row ? data : new Row(data || {}, this), top = this.findAddRowPos(pos), allIndex = -1, activeIndex, chainResult;
      if (!index) {
        chainResult = this.chain("row-adding-position", [row, top], null, { index, top });
        index = chainResult.index;
        top = chainResult.top;
      }
      if (typeof index !== "undefined") {
        index = this.findRow(index);
      }
      index = this.chain("row-adding-index", [row, index, top], null, index);
      if (index) {
        allIndex = this.rows.indexOf(index);
      }
      if (index && allIndex > -1) {
        activeIndex = this.activeRows.indexOf(index);
        this.displayRowIterator(function(rows) {
          var displayIndex = rows.indexOf(index);
          if (displayIndex > -1) {
            rows.splice(top ? displayIndex : displayIndex + 1, 0, row);
          }
        });
        if (activeIndex > -1) {
          this.activeRows.splice(top ? activeIndex : activeIndex + 1, 0, row);
        }
        this.rows.splice(top ? allIndex : allIndex + 1, 0, row);
      } else {
        if (top) {
          this.displayRowIterator(function(rows) {
            rows.unshift(row);
          });
          this.activeRows.unshift(row);
          this.rows.unshift(row);
        } else {
          this.displayRowIterator(function(rows) {
            rows.push(row);
          });
          this.activeRows.push(row);
          this.rows.push(row);
        }
      }
      this.setActiveRows(this.activeRows);
      this.dispatchExternal("rowAdded", row.getComponent());
      if (this.subscribedExternal("dataChanged")) {
        this.dispatchExternal("dataChanged", this.table.rowManager.getData());
      }
      if (!blockRedraw) {
        this.reRenderInPosition();
      }
      return row;
    }
    moveRow(from, to, after) {
      this.dispatch("row-move", from, to, after);
      this.moveRowActual(from, to, after);
      this.regenerateRowPositions();
      this.dispatch("row-moved", from, to, after);
      this.dispatchExternal("rowMoved", from.getComponent());
    }
    moveRowActual(from, to, after) {
      this.moveRowInArray(this.rows, from, to, after);
      this.moveRowInArray(this.activeRows, from, to, after);
      this.displayRowIterator((rows) => {
        this.moveRowInArray(rows, from, to, after);
      });
      this.dispatch("row-moving", from, to, after);
    }
    moveRowInArray(rows, from, to, after) {
      var fromIndex, toIndex, start, end;
      if (from !== to) {
        fromIndex = rows.indexOf(from);
        if (fromIndex > -1) {
          rows.splice(fromIndex, 1);
          toIndex = rows.indexOf(to);
          if (toIndex > -1) {
            if (after) {
              rows.splice(toIndex + 1, 0, from);
            } else {
              rows.splice(toIndex, 0, from);
            }
          } else {
            rows.splice(fromIndex, 0, from);
          }
        }
        if (rows === this.getDisplayRows()) {
          start = fromIndex < toIndex ? fromIndex : toIndex;
          end = toIndex > fromIndex ? toIndex : fromIndex + 1;
          for (let i = start; i <= end; i++) {
            if (rows[i]) {
              this.styleRow(rows[i], i);
            }
          }
        }
      }
    }
    clearData() {
      this.setData([]);
    }
    getRowIndex(row) {
      return this.findRowIndex(row, this.rows);
    }
    getDisplayRowIndex(row) {
      var index = this.getDisplayRows().indexOf(row);
      return index > -1 ? index : false;
    }
    nextDisplayRow(row, rowOnly) {
      var index = this.getDisplayRowIndex(row), nextRow = false;
      if (index !== false && index < this.displayRowsCount - 1) {
        nextRow = this.getDisplayRows()[index + 1];
      }
      if (nextRow && (!(nextRow instanceof Row) || nextRow.type != "row")) {
        return this.nextDisplayRow(nextRow, rowOnly);
      }
      return nextRow;
    }
    prevDisplayRow(row, rowOnly) {
      var index = this.getDisplayRowIndex(row), prevRow = false;
      if (index) {
        prevRow = this.getDisplayRows()[index - 1];
      }
      if (rowOnly && prevRow && (!(prevRow instanceof Row) || prevRow.type != "row")) {
        return this.prevDisplayRow(prevRow, rowOnly);
      }
      return prevRow;
    }
    findRowIndex(row, list) {
      var rowIndex;
      row = this.findRow(row);
      if (row) {
        rowIndex = list.indexOf(row);
        if (rowIndex > -1) {
          return rowIndex;
        }
      }
      return false;
    }
    getData(active, transform) {
      var output = [], rows = this.getRows(active);
      rows.forEach(function(row) {
        if (row.type == "row") {
          output.push(row.getData(transform || "data"));
        }
      });
      return output;
    }
    getComponents(active) {
      var output = [], rows = this.getRows(active);
      rows.forEach(function(row) {
        output.push(row.getComponent());
      });
      return output;
    }
    getDataCount(active) {
      var rows = this.getRows(active);
      return rows.length;
    }
    scrollHorizontal(left) {
      this.scrollLeft = left;
      this.element.scrollLeft = left;
      this.dispatch("scroll-horizontal", left);
    }
    registerDataPipelineHandler(handler, priority) {
      if (typeof priority !== "undefined") {
        this.dataPipeline.push({ handler, priority });
        this.dataPipeline.sort((a, b) => {
          return a.priority - b.priority;
        });
      } else {
        console.error("Data pipeline handlers must have a priority in order to be registered");
      }
    }
    registerDisplayPipelineHandler(handler, priority) {
      if (typeof priority !== "undefined") {
        this.displayPipeline.push({ handler, priority });
        this.displayPipeline.sort((a, b) => {
          return a.priority - b.priority;
        });
      } else {
        console.error("Display pipeline handlers must have a priority in order to be registered");
      }
    }
    //set active data set
    refreshActiveData(handler, skipStage, renderInPosition) {
      var table = this.table, stage = "", index = 0, cascadeOrder = ["all", "dataPipeline", "display", "displayPipeline", "end"];
      if (!this.table.destroyed) {
        if (typeof handler === "function") {
          index = this.dataPipeline.findIndex((item) => {
            return item.handler === handler;
          });
          if (index > -1) {
            stage = "dataPipeline";
            if (skipStage) {
              if (index == this.dataPipeline.length - 1) {
                stage = "display";
              } else {
                index++;
              }
            }
          } else {
            index = this.displayPipeline.findIndex((item) => {
              return item.handler === handler;
            });
            if (index > -1) {
              stage = "displayPipeline";
              if (skipStage) {
                if (index == this.displayPipeline.length - 1) {
                  stage = "end";
                } else {
                  index++;
                }
              }
            } else {
              console.error("Unable to refresh data, invalid handler provided", handler);
              return;
            }
          }
        } else {
          stage = handler || "all";
          index = 0;
        }
        if (this.redrawBlock) {
          if (!this.redrawBlockRestoreConfig || this.redrawBlockRestoreConfig && (this.redrawBlockRestoreConfig.stage === stage && index < this.redrawBlockRestoreConfig.index || cascadeOrder.indexOf(stage) < cascadeOrder.indexOf(this.redrawBlockRestoreConfig.stage))) {
            this.redrawBlockRestoreConfig = {
              handler,
              skipStage,
              renderInPosition,
              stage,
              index
            };
          }
          return;
        } else {
          if (Helpers.elVisible(this.element)) {
            if (renderInPosition) {
              this.reRenderInPosition(this.refreshPipelines.bind(this, handler, stage, index, renderInPosition));
            } else {
              this.refreshPipelines(handler, stage, index, renderInPosition);
              if (!handler) {
                this.table.columnManager.renderer.renderColumns();
              }
              this.renderTable();
              if (table.options.layoutColumnsOnNewData) {
                this.table.columnManager.redraw(true);
              }
            }
          } else {
            this.refreshPipelines(handler, stage, index, renderInPosition);
          }
          this.dispatch("data-refreshed");
        }
      }
    }
    refreshPipelines(handler, stage, index, renderInPosition) {
      this.dispatch("data-refreshing");
      if (!handler || !this.activeRowsPipeline[0]) {
        this.activeRowsPipeline[0] = this.rows.slice(0);
      }
      switch (stage) {
        case "all":
        case "dataPipeline":
          for (let i = index; i < this.dataPipeline.length; i++) {
            let result = this.dataPipeline[i].handler(this.activeRowsPipeline[i].slice(0));
            this.activeRowsPipeline[i + 1] = result || this.activeRowsPipeline[i].slice(0);
          }
          this.setActiveRows(this.activeRowsPipeline[this.dataPipeline.length]);
        case "display":
          index = 0;
          this.resetDisplayRows();
        case "displayPipeline":
          for (let i = index; i < this.displayPipeline.length; i++) {
            let result = this.displayPipeline[i].handler((i ? this.getDisplayRows(i - 1) : this.activeRows).slice(0), renderInPosition);
            this.setDisplayRows(result || this.getDisplayRows(i - 1).slice(0), i);
          }
        case "end":
          this.regenerateRowPositions();
      }
      if (this.getDisplayRows().length) {
        this._clearPlaceholder();
      }
    }
    //regenerate row positions
    regenerateRowPositions() {
      var rows = this.getDisplayRows();
      var index = 1;
      rows.forEach((row) => {
        if (row.type === "row") {
          row.setPosition(index);
          index++;
        }
      });
    }
    setActiveRows(activeRows) {
      this.activeRows = this.activeRows = Object.assign([], activeRows);
      this.activeRowsCount = this.activeRows.length;
    }
    //reset display rows array
    resetDisplayRows() {
      this.displayRows = [];
      this.displayRows.push(this.activeRows.slice(0));
      this.displayRowsCount = this.displayRows[0].length;
    }
    //set display row pipeline data
    setDisplayRows(displayRows, index) {
      this.displayRows[index] = displayRows;
      if (index == this.displayRows.length - 1) {
        this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length;
      }
    }
    getDisplayRows(index) {
      if (typeof index == "undefined") {
        return this.displayRows.length ? this.displayRows[this.displayRows.length - 1] : [];
      } else {
        return this.displayRows[index] || [];
      }
    }
    getVisibleRows(chain, viewable) {
      var rows = Object.assign([], this.renderer.visibleRows(!viewable));
      if (chain) {
        rows = this.chain("rows-visible", [viewable], rows, rows);
      }
      return rows;
    }
    //repeat action across display rows
    displayRowIterator(callback) {
      this.activeRowsPipeline.forEach(callback);
      this.displayRows.forEach(callback);
      this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length;
    }
    //return only actual rows (not group headers etc)
    getRows(type) {
      var rows = [];
      switch (type) {
        case "active":
          rows = this.activeRows;
          break;
        case "display":
          rows = this.table.rowManager.getDisplayRows();
          break;
        case "visible":
          rows = this.getVisibleRows(false, true);
          break;
        default:
          rows = this.chain("rows-retrieve", type, null, this.rows) || this.rows;
      }
      return rows;
    }
    ///////////////// Table Rendering /////////////////
    //trigger rerender of table in current position
    reRenderInPosition(callback) {
      if (this.redrawBlock) {
        if (callback) {
          callback();
        } else {
          this.redrawBlockRenderInPosition = true;
        }
      } else {
        this.dispatchExternal("renderStarted");
        this.renderer.rerenderRows(callback);
        if (!this.fixedHeight) {
          this.adjustTableSize();
        }
        this.scrollBarCheck();
        this.dispatchExternal("renderComplete");
      }
    }
    scrollBarCheck() {
      var scrollbarWidth = 0;
      if (this.element.scrollHeight > this.element.clientHeight) {
        scrollbarWidth = this.element.offsetWidth - this.element.clientWidth;
      }
      if (scrollbarWidth !== this.scrollbarWidth) {
        this.scrollbarWidth = scrollbarWidth;
        this.dispatch("scrollbar-vertical", scrollbarWidth);
      }
    }
    initializeRenderer() {
      var renderClass;
      var renderers = {
        "virtual": VirtualDomVertical,
        "basic": BasicVertical
      };
      if (typeof this.table.options.renderVertical === "string") {
        renderClass = renderers[this.table.options.renderVertical];
      } else {
        renderClass = this.table.options.renderVertical;
      }
      if (renderClass) {
        this.renderMode = this.table.options.renderVertical;
        this.renderer = new renderClass(this.table, this.element, this.tableElement);
        this.renderer.initialize();
        if ((this.table.element.clientHeight || this.table.options.height) && !(this.table.options.minHeight && this.table.options.maxHeight)) {
          this.fixedHeight = true;
        } else {
          this.fixedHeight = false;
        }
      } else {
        console.error("Unable to find matching renderer:", this.table.options.renderVertical);
      }
    }
    getRenderMode() {
      return this.renderMode;
    }
    renderTable() {
      this.dispatchExternal("renderStarted");
      this.element.scrollTop = 0;
      this._clearTable();
      if (this.displayRowsCount) {
        this.renderer.renderRows();
        if (this.firstRender) {
          this.firstRender = false;
          if (!this.fixedHeight) {
            this.adjustTableSize();
          }
          this.layoutRefresh(true);
        }
      } else {
        this.renderEmptyScroll();
      }
      if (!this.fixedHeight) {
        this.adjustTableSize();
      }
      this.dispatch("table-layout");
      if (!this.displayRowsCount) {
        this._showPlaceholder();
      }
      this.scrollBarCheck();
      this.dispatchExternal("renderComplete");
    }
    //show scrollbars on empty table div
    renderEmptyScroll() {
      if (this.placeholder) {
        this.tableElement.style.display = "none";
      } else {
        this.tableElement.style.minWidth = this.table.columnManager.getWidth() + "px";
      }
    }
    _clearTable() {
      this._clearPlaceholder();
      this.scrollTop = 0;
      this.scrollLeft = 0;
      this.renderer.clearRows();
    }
    tableEmpty() {
      this.renderEmptyScroll();
      this._showPlaceholder();
    }
    checkPlaceholder() {
      if (this.displayRowsCount) {
        this._clearPlaceholder();
      } else {
        this.tableEmpty();
      }
    }
    _showPlaceholder() {
      if (this.placeholder) {
        if (this.placeholder && this.placeholder.parentNode) {
          this.placeholder.parentNode.removeChild(this.placeholder);
        }
        this.initializePlaceholder();
        this.placeholder.setAttribute("tabulator-render-mode", this.renderMode);
        this.getElement().appendChild(this.placeholder);
        this._positionPlaceholder();
        this.adjustTableSize();
      }
    }
    _clearPlaceholder() {
      if (this.placeholder && this.placeholder.parentNode) {
        this.placeholder.parentNode.removeChild(this.placeholder);
      }
      this.tableElement.style.minWidth = "";
      this.tableElement.style.display = "";
    }
    _positionPlaceholder() {
      if (this.placeholder && this.placeholder.parentNode) {
        this.placeholder.style.width = this.table.columnManager.getWidth() + "px";
        this.placeholderContents.style.width = this.table.rowManager.element.clientWidth + "px";
        this.placeholderContents.style.marginLeft = this.scrollLeft + "px";
      }
    }
    styleRow(row, index) {
      var rowEl = row.getElement();
      if (index % 2) {
        rowEl.classList.add("tabulator-row-even");
        rowEl.classList.remove("tabulator-row-odd");
      } else {
        rowEl.classList.add("tabulator-row-odd");
        rowEl.classList.remove("tabulator-row-even");
      }
    }
    //normalize height of active rows
    normalizeHeight() {
      this.activeRows.forEach(function(row) {
        row.normalizeHeight();
      });
    }
    //adjust the height of the table holder to fit in the Tabulator element
    adjustTableSize() {
      let initialHeight = this.element.clientHeight, minHeight;
      let resized = false;
      if (this.renderer.verticalFillMode === "fill") {
        let otherHeight = Math.floor(this.table.columnManager.getElement().getBoundingClientRect().height + (this.table.footerManager && this.table.footerManager.active && !this.table.footerManager.external ? this.table.footerManager.getElement().getBoundingClientRect().height : 0));
        if (this.fixedHeight) {
          minHeight = isNaN(this.table.options.minHeight) ? this.table.options.minHeight : this.table.options.minHeight + "px";
          const height = "calc(100% - " + otherHeight + "px)";
          this.element.style.minHeight = minHeight || "calc(100% - " + otherHeight + "px)";
          this.element.style.height = height;
          this.element.style.maxHeight = height;
        } else {
          this.element.style.height = "";
          this.element.style.height = this.table.element.clientHeight - otherHeight + "px";
          this.element.scrollTop = this.scrollTop;
        }
        this.renderer.resize();
        if (!this.fixedHeight && initialHeight != this.element.clientHeight) {
          resized = true;
          if (this.subscribed("table-resize")) {
            this.dispatch("table-resize");
          } else {
            this.redraw();
          }
        }
        this.scrollBarCheck();
      }
      this._positionPlaceholder();
      return resized;
    }
    //reinitialize all rows
    reinitialize() {
      this.rows.forEach(function(row) {
        row.reinitialize(true);
      });
    }
    //prevent table from being redrawn
    blockRedraw() {
      this.redrawBlock = true;
      this.redrawBlockRestoreConfig = false;
    }
    //restore table redrawing
    restoreRedraw() {
      this.redrawBlock = false;
      if (this.redrawBlockRestoreConfig) {
        this.refreshActiveData(this.redrawBlockRestoreConfig.handler, this.redrawBlockRestoreConfig.skipStage, this.redrawBlockRestoreConfig.renderInPosition);
        this.redrawBlockRestoreConfig = false;
      } else {
        if (this.redrawBlockRenderInPosition) {
          this.reRenderInPosition();
        }
      }
      this.redrawBlockRenderInPosition = false;
    }
    //redraw table
    redraw(force) {
      this.adjustTableSize();
      this.table.tableWidth = this.table.element.clientWidth;
      if (!force) {
        this.reRenderInPosition();
        this.scrollHorizontal(this.scrollLeft);
      } else {
        this.renderTable();
      }
    }
    resetScroll() {
      this.element.scrollLeft = 0;
      this.element.scrollTop = 0;
      if (this.table.browser === "ie") {
        var event = document.createEvent("Event");
        event.initEvent("scroll", false, true);
        this.element.dispatchEvent(event);
      } else {
        this.element.dispatchEvent(new Event("scroll"));
      }
    }
  };

  // node_modules/tabulator-tables/src/js/core/FooterManager.js
  var FooterManager = class extends CoreFeature {
    constructor(table) {
      super(table);
      this.active = false;
      this.element = this.createElement();
      this.containerElement = this.createContainerElement();
      this.external = false;
    }
    initialize() {
      this.initializeElement();
    }
    createElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-footer");
      return el;
    }
    createContainerElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-footer-contents");
      this.element.appendChild(el);
      return el;
    }
    initializeElement() {
      if (this.table.options.footerElement) {
        switch (typeof this.table.options.footerElement) {
          case "string":
            if (this.table.options.footerElement[0] === "<") {
              this.containerElement.innerHTML = this.table.options.footerElement;
            } else {
              this.external = true;
              this.containerElement = document.querySelector(this.table.options.footerElement);
            }
            break;
          default:
            this.element = this.table.options.footerElement;
            break;
        }
      }
    }
    getElement() {
      return this.element;
    }
    append(element) {
      this.activate();
      this.containerElement.appendChild(element);
      this.table.rowManager.adjustTableSize();
    }
    prepend(element) {
      this.activate();
      this.element.insertBefore(element, this.element.firstChild);
      this.table.rowManager.adjustTableSize();
    }
    remove(element) {
      element.parentNode.removeChild(element);
      this.deactivate();
    }
    deactivate(force) {
      if (!this.element.firstChild || force) {
        if (!this.external) {
          this.element.parentNode.removeChild(this.element);
        }
        this.active = false;
      }
    }
    activate() {
      if (!this.active) {
        this.active = true;
        if (!this.external) {
          this.table.element.appendChild(this.getElement());
          this.table.element.style.display = "";
        }
      }
    }
    redraw() {
      this.dispatch("footer-redraw");
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/InteractionMonitor.js
  var InteractionManager = class extends CoreFeature {
    constructor(table) {
      super(table);
      this.el = null;
      this.abortClasses = ["tabulator-headers", "tabulator-table"];
      this.previousTargets = {};
      this.listeners = [
        "click",
        "dblclick",
        "contextmenu",
        "mouseenter",
        "mouseleave",
        "mouseover",
        "mouseout",
        "mousemove",
        "mouseup",
        "mousedown",
        "touchstart",
        "touchend"
      ];
      this.componentMap = {
        "tabulator-cell": "cell",
        "tabulator-row": "row",
        "tabulator-group": "group",
        "tabulator-col": "column"
      };
      this.pseudoTrackers = {
        "row": {
          subscriber: null,
          target: null
        },
        "cell": {
          subscriber: null,
          target: null
        },
        "group": {
          subscriber: null,
          target: null
        },
        "column": {
          subscriber: null,
          target: null
        }
      };
      this.pseudoTracking = false;
    }
    initialize() {
      this.el = this.table.element;
      this.buildListenerMap();
      this.bindSubscriptionWatchers();
    }
    buildListenerMap() {
      var listenerMap = {};
      this.listeners.forEach((listener) => {
        listenerMap[listener] = {
          handler: null,
          components: []
        };
      });
      this.listeners = listenerMap;
    }
    bindPseudoEvents() {
      Object.keys(this.pseudoTrackers).forEach((key) => {
        this.pseudoTrackers[key].subscriber = this.pseudoMouseEnter.bind(this, key);
        this.subscribe(key + "-mouseover", this.pseudoTrackers[key].subscriber);
      });
      this.pseudoTracking = true;
    }
    pseudoMouseEnter(key, e, target) {
      if (this.pseudoTrackers[key].target !== target) {
        if (this.pseudoTrackers[key].target) {
          this.dispatch(key + "-mouseleave", e, this.pseudoTrackers[key].target);
        }
        this.pseudoMouseLeave(key, e);
        this.pseudoTrackers[key].target = target;
        this.dispatch(key + "-mouseenter", e, target);
      }
    }
    pseudoMouseLeave(key, e) {
      var leaveList = Object.keys(this.pseudoTrackers), linkedKeys = {
        "row": ["cell"],
        "cell": ["row"]
      };
      leaveList = leaveList.filter((item) => {
        var links = linkedKeys[key];
        return item !== key && (!links || links && !links.includes(item));
      });
      leaveList.forEach((key2) => {
        var target = this.pseudoTrackers[key2].target;
        if (this.pseudoTrackers[key2].target) {
          this.dispatch(key2 + "-mouseleave", e, target);
          this.pseudoTrackers[key2].target = null;
        }
      });
    }
    bindSubscriptionWatchers() {
      var listeners = Object.keys(this.listeners), components = Object.values(this.componentMap);
      for (let comp of components) {
        for (let listener of listeners) {
          let key = comp + "-" + listener;
          this.subscriptionChange(key, this.subscriptionChanged.bind(this, comp, listener));
        }
      }
      this.subscribe("table-destroy", this.clearWatchers.bind(this));
    }
    subscriptionChanged(component, key, added) {
      var listener = this.listeners[key].components, index = listener.indexOf(component), changed = false;
      if (added) {
        if (index === -1) {
          listener.push(component);
          changed = true;
        }
      } else {
        if (!this.subscribed(component + "-" + key)) {
          if (index > -1) {
            listener.splice(index, 1);
            changed = true;
          }
        }
      }
      if ((key === "mouseenter" || key === "mouseleave") && !this.pseudoTracking) {
        this.bindPseudoEvents();
      }
      if (changed) {
        this.updateEventListeners();
      }
    }
    updateEventListeners() {
      for (let key in this.listeners) {
        let listener = this.listeners[key];
        if (listener.components.length) {
          if (!listener.handler) {
            listener.handler = this.track.bind(this, key);
            this.el.addEventListener(key, listener.handler);
          }
        } else {
          if (listener.handler) {
            this.el.removeEventListener(key, listener.handler);
            listener.handler = null;
          }
        }
      }
    }
    track(type, e) {
      var path = e.composedPath && e.composedPath() || e.path;
      var targets = this.findTargets(path);
      targets = this.bindComponents(type, targets);
      this.triggerEvents(type, e, targets);
      if (this.pseudoTracking && (type == "mouseover" || type == "mouseleave") && !Object.keys(targets).length) {
        this.pseudoMouseLeave("none", e);
      }
    }
    findTargets(path) {
      var targets = {};
      let componentMap = Object.keys(this.componentMap);
      for (let el of path) {
        let classList = el.classList ? [...el.classList] : [];
        let abort = classList.filter((item) => {
          return this.abortClasses.includes(item);
        });
        if (abort.length) {
          break;
        }
        let elTargets = classList.filter((item) => {
          return componentMap.includes(item);
        });
        for (let target of elTargets) {
          if (!targets[this.componentMap[target]]) {
            targets[this.componentMap[target]] = el;
          }
        }
      }
      if (targets.group && targets.group === targets.row) {
        delete targets.row;
      }
      return targets;
    }
    bindComponents(type, targets) {
      var keys = Object.keys(targets).reverse(), listener = this.listeners[type], matches = {}, targetMatches = {};
      for (let key of keys) {
        let component, target = targets[key], previousTarget = this.previousTargets[key];
        if (previousTarget && previousTarget.target === target) {
          component = previousTarget.component;
        } else {
          switch (key) {
            case "row":
            case "group":
              if (listener.components.includes("row") || listener.components.includes("cell") || listener.components.includes("group")) {
                let rows = this.table.rowManager.getVisibleRows(true);
                component = rows.find((row) => {
                  return row.getElement() === target;
                });
                if (targets["row"] && targets["row"].parentNode && targets["row"].parentNode.closest(".tabulator-row")) {
                  targets[key] = false;
                }
              }
              break;
            case "column":
              if (listener.components.includes("column")) {
                component = this.table.columnManager.findColumn(target);
              }
              break;
            case "cell":
              if (listener.components.includes("cell")) {
                if (matches["row"] instanceof Row) {
                  component = matches["row"].findCell(target);
                } else {
                  if (targets["row"]) {
                    console.warn("Event Target Lookup Error - The row this cell is attached to cannot be found, has the table been reinitialized without being destroyed first?");
                  }
                }
              }
              break;
          }
        }
        if (component) {
          matches[key] = component;
          targetMatches[key] = {
            target,
            component
          };
        }
      }
      this.previousTargets = targetMatches;
      return matches;
    }
    triggerEvents(type, e, targets) {
      var listener = this.listeners[type];
      for (let key in targets) {
        if (targets[key] && listener.components.includes(key)) {
          this.dispatch(key + "-" + type, e, targets[key]);
        }
      }
    }
    clearWatchers() {
      for (let key in this.listeners) {
        let listener = this.listeners[key];
        if (listener.handler) {
          this.el.removeEventListener(key, listener.handler);
          listener.handler = null;
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/ComponentFunctionBinder.js
  var ComponentFunctionBinder = class {
    constructor(table) {
      this.table = table;
      this.bindings = {};
    }
    bind(type, funcName, handler) {
      if (!this.bindings[type]) {
        this.bindings[type] = {};
      }
      if (this.bindings[type][funcName]) {
        console.warn("Unable to bind component handler, a matching function name is already bound", type, funcName, handler);
      } else {
        this.bindings[type][funcName] = handler;
      }
    }
    handle(type, component, name) {
      if (this.bindings[type] && this.bindings[type][name] && typeof this.bindings[type][name].bind === "function") {
        return this.bindings[type][name].bind(null, component);
      } else {
        if (name !== "then" && typeof name === "string" && !name.startsWith("_")) {
          if (this.table.options.debugInvalidComponentFuncs) {
            console.error("The " + type + " component does not have a " + name + " function, have you checked that you have the correct Tabulator module installed?");
          }
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/DataLoader.js
  var DataLoader = class extends CoreFeature {
    constructor(table) {
      super(table);
      this.requestOrder = 0;
      this.loading = false;
    }
    initialize() {
    }
    load(data, params, config, replace, silent, columnsChanged) {
      var requestNo = ++this.requestOrder;
      if (this.table.destroyed) {
        return Promise.resolve();
      }
      this.dispatchExternal("dataLoading", data);
      if (data && (data.indexOf("{") == 0 || data.indexOf("[") == 0)) {
        data = JSON.parse(data);
      }
      if (this.confirm("data-loading", [data, params, config, silent])) {
        this.loading = true;
        if (!silent) {
          this.alertLoader();
        }
        params = this.chain("data-params", [data, config, silent], params || {}, params || {});
        params = this.mapParams(params, this.table.options.dataSendParams);
        var result = this.chain("data-load", [data, params, config, silent], false, Promise.resolve([]));
        return result.then((response) => {
          if (!this.table.destroyed) {
            if (!Array.isArray(response) && typeof response == "object") {
              response = this.mapParams(response, this.objectInvert(this.table.options.dataReceiveParams));
            }
            var rowData = this.chain("data-loaded", [response], null, response);
            if (requestNo == this.requestOrder) {
              this.clearAlert();
              if (rowData !== false) {
                this.dispatchExternal("dataLoaded", rowData);
                this.table.rowManager.setData(rowData, replace, typeof columnsChanged === "undefined" ? !replace : columnsChanged);
              }
            } else {
              console.warn("Data Load Response Blocked - An active data load request was blocked by an attempt to change table data while the request was being made");
            }
          } else {
            console.warn("Data Load Response Blocked - Table has been destroyed");
          }
        }).catch((error) => {
          console.error("Data Load Error: ", error);
          this.dispatchExternal("dataLoadError", error);
          if (!silent) {
            this.alertError();
          }
          setTimeout(() => {
            this.clearAlert();
          }, this.table.options.dataLoaderErrorTimeout);
        }).finally(() => {
          this.loading = false;
        });
      } else {
        this.dispatchExternal("dataLoaded", data);
        if (!data) {
          data = [];
        }
        this.table.rowManager.setData(data, replace, typeof columnsChanged === "undefined" ? !replace : columnsChanged);
        return Promise.resolve();
      }
    }
    mapParams(params, map2) {
      var output = {};
      for (let key in params) {
        output[map2.hasOwnProperty(key) ? map2[key] : key] = params[key];
      }
      return output;
    }
    objectInvert(obj) {
      var output = {};
      for (let key in obj) {
        output[obj[key]] = key;
      }
      return output;
    }
    blockActiveLoad() {
      this.requestOrder++;
    }
    alertLoader() {
      var shouldLoad = typeof this.table.options.dataLoader === "function" ? this.table.options.dataLoader() : this.table.options.dataLoader;
      if (shouldLoad) {
        this.table.alertManager.alert(this.table.options.dataLoaderLoading || this.langText("data|loading"));
      }
    }
    alertError() {
      this.table.alertManager.alert(this.table.options.dataLoaderError || this.langText("data|error"), "error");
    }
    clearAlert() {
      this.table.alertManager.clear();
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/ExternalEventBus.js
  var ExternalEventBus = class {
    constructor(table, optionsList, debug) {
      this.table = table;
      this.events = {};
      this.optionsList = optionsList || {};
      this.subscriptionNotifiers = {};
      this.dispatch = debug ? this._debugDispatch.bind(this) : this._dispatch.bind(this);
      this.debug = debug;
    }
    subscriptionChange(key, callback) {
      if (!this.subscriptionNotifiers[key]) {
        this.subscriptionNotifiers[key] = [];
      }
      this.subscriptionNotifiers[key].push(callback);
      if (this.subscribed(key)) {
        this._notifySubscriptionChange(key, true);
      }
    }
    subscribe(key, callback) {
      if (!this.events[key]) {
        this.events[key] = [];
      }
      this.events[key].push(callback);
      this._notifySubscriptionChange(key, true);
    }
    unsubscribe(key, callback) {
      var index;
      if (this.events[key]) {
        if (callback) {
          index = this.events[key].findIndex((item) => {
            return item === callback;
          });
          if (index > -1) {
            this.events[key].splice(index, 1);
          } else {
            console.warn("Cannot remove event, no matching event found:", key, callback);
            return;
          }
        } else {
          delete this.events[key];
        }
      } else {
        console.warn("Cannot remove event, no events set on:", key);
        return;
      }
      this._notifySubscriptionChange(key, false);
    }
    subscribed(key) {
      return this.events[key] && this.events[key].length;
    }
    _notifySubscriptionChange(key, subscribed) {
      var notifiers = this.subscriptionNotifiers[key];
      if (notifiers) {
        notifiers.forEach((callback) => {
          callback(subscribed);
        });
      }
    }
    _dispatch() {
      var args = Array.from(arguments), key = args.shift(), result;
      if (this.events[key]) {
        this.events[key].forEach((callback, i) => {
          let callResult = callback.apply(this.table, args);
          if (!i) {
            result = callResult;
          }
        });
      }
      return result;
    }
    _debugDispatch() {
      var args = Array.from(arguments), key = args[0];
      args[0] = "ExternalEvent:" + args[0];
      if (this.debug === true || this.debug.includes(key)) {
        console.log(...args);
      }
      return this._dispatch(...arguments);
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/InternalEventBus.js
  var InternalEventBus = class {
    constructor(debug) {
      this.events = {};
      this.subscriptionNotifiers = {};
      this.dispatch = debug ? this._debugDispatch.bind(this) : this._dispatch.bind(this);
      this.chain = debug ? this._debugChain.bind(this) : this._chain.bind(this);
      this.confirm = debug ? this._debugConfirm.bind(this) : this._confirm.bind(this);
      this.debug = debug;
    }
    subscriptionChange(key, callback) {
      if (!this.subscriptionNotifiers[key]) {
        this.subscriptionNotifiers[key] = [];
      }
      this.subscriptionNotifiers[key].push(callback);
      if (this.subscribed(key)) {
        this._notifySubscriptionChange(key, true);
      }
    }
    subscribe(key, callback, priority = 1e4) {
      if (!this.events[key]) {
        this.events[key] = [];
      }
      this.events[key].push({ callback, priority });
      this.events[key].sort((a, b) => {
        return a.priority - b.priority;
      });
      this._notifySubscriptionChange(key, true);
    }
    unsubscribe(key, callback) {
      var index;
      if (this.events[key]) {
        if (callback) {
          index = this.events[key].findIndex((item) => {
            return item.callback === callback;
          });
          if (index > -1) {
            this.events[key].splice(index, 1);
          } else {
            console.warn("Cannot remove event, no matching event found:", key, callback);
            return;
          }
        }
      } else {
        console.warn("Cannot remove event, no events set on:", key);
        return;
      }
      this._notifySubscriptionChange(key, false);
    }
    subscribed(key) {
      return this.events[key] && this.events[key].length;
    }
    _chain(key, args, initialValue, fallback) {
      var value = initialValue;
      if (!Array.isArray(args)) {
        args = [args];
      }
      if (this.subscribed(key)) {
        this.events[key].forEach((subscriber, i) => {
          value = subscriber.callback.apply(this, args.concat([value]));
        });
        return value;
      } else {
        return typeof fallback === "function" ? fallback() : fallback;
      }
    }
    _confirm(key, args) {
      var confirmed = false;
      if (!Array.isArray(args)) {
        args = [args];
      }
      if (this.subscribed(key)) {
        this.events[key].forEach((subscriber, i) => {
          if (subscriber.callback.apply(this, args)) {
            confirmed = true;
          }
        });
      }
      return confirmed;
    }
    _notifySubscriptionChange(key, subscribed) {
      var notifiers = this.subscriptionNotifiers[key];
      if (notifiers) {
        notifiers.forEach((callback) => {
          callback(subscribed);
        });
      }
    }
    _dispatch() {
      var args = Array.from(arguments), key = args.shift();
      if (this.events[key]) {
        this.events[key].forEach((subscriber) => {
          subscriber.callback.apply(this, args);
        });
      }
    }
    _debugDispatch() {
      var args = Array.from(arguments), key = args[0];
      args[0] = "InternalEvent:" + key;
      if (this.debug === true || this.debug.includes(key)) {
        console.log(...args);
      }
      return this._dispatch(...arguments);
    }
    _debugChain() {
      var args = Array.from(arguments), key = args[0];
      args[0] = "InternalEvent:" + key;
      if (this.debug === true || this.debug.includes(key)) {
        console.log(...args);
      }
      return this._chain(...arguments);
    }
    _debugConfirm() {
      var args = Array.from(arguments), key = args[0];
      args[0] = "InternalEvent:" + key;
      if (this.debug === true || this.debug.includes(key)) {
        console.log(...args);
      }
      return this._confirm(...arguments);
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/DeprecationAdvisor.js
  var DeprecationAdvisor = class extends CoreFeature {
    constructor(table) {
      super(table);
    }
    _warnUser() {
      if (this.options("debugDeprecation")) {
        console.warn(...arguments);
      }
    }
    check(oldOption, newOption, convert) {
      var msg = "";
      if (typeof this.options(oldOption) !== "undefined") {
        msg = "Deprecated Setup Option - Use of the %c" + oldOption + "%c option is now deprecated";
        if (newOption) {
          msg = msg + ", Please use the %c" + newOption + "%c option instead";
          this._warnUser(msg, "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;");
          if (convert) {
            this.table.options[newOption] = this.table.options[oldOption];
          }
        } else {
          this._warnUser(msg, "font-weight: bold;", "font-weight: normal;");
        }
        return false;
      } else {
        return true;
      }
    }
    checkMsg(oldOption, msg) {
      if (typeof this.options(oldOption) !== "undefined") {
        this._warnUser("%cDeprecated Setup Option - Use of the %c" + oldOption + " %c option is now deprecated, " + msg, "font-weight: normal;", "font-weight: bold;", "font-weight: normal;");
        return false;
      } else {
        return true;
      }
    }
    msg(msg) {
      this._warnUser(msg);
    }
  };

  // node_modules/tabulator-tables/src/js/core/modules/core.js
  var core_exports = {};
  __export(core_exports, {
    CommsModule: () => Comms,
    LayoutModule: () => Layout,
    LocalizeModule: () => Localize
  });

  // node_modules/tabulator-tables/src/js/core/tools/Popup.js
  var Popup = class _Popup extends CoreFeature {
    constructor(table, element, parent) {
      super(table);
      this.element = element;
      this.container = this._lookupContainer();
      this.parent = parent;
      this.reversedX = false;
      this.childPopup = null;
      this.blurable = false;
      this.blurCallback = null;
      this.blurEventsBound = false;
      this.renderedCallback = null;
      this.visible = false;
      this.hideable = true;
      this.element.classList.add("tabulator-popup-container");
      this.blurEvent = this.hide.bind(this, false);
      this.escEvent = this._escapeCheck.bind(this);
      this.destroyBinding = this.tableDestroyed.bind(this);
      this.destroyed = false;
    }
    tableDestroyed() {
      this.destroyed = true;
      this.hide(true);
    }
    _lookupContainer() {
      var container = this.table.options.popupContainer;
      if (typeof container === "string") {
        container = document.querySelector(container);
        if (!container) {
          console.warn("Menu Error - no container element found matching selector:", this.table.options.popupContainer, "(defaulting to document body)");
        }
      } else if (container === true) {
        container = this.table.element;
      }
      if (container && !this._checkContainerIsParent(container)) {
        container = false;
        console.warn("Menu Error - container element does not contain this table:", this.table.options.popupContainer, "(defaulting to document body)");
      }
      if (!container) {
        container = document.body;
      }
      return container;
    }
    _checkContainerIsParent(container, element = this.table.element) {
      if (container === element) {
        return true;
      } else {
        return element.parentNode ? this._checkContainerIsParent(container, element.parentNode) : false;
      }
    }
    renderCallback(callback) {
      this.renderedCallback = callback;
    }
    containerEventCoords(e) {
      var touch = !(e instanceof MouseEvent);
      var x = touch ? e.touches[0].pageX : e.pageX;
      var y = touch ? e.touches[0].pageY : e.pageY;
      if (this.container !== document.body) {
        let parentOffset = Helpers.elOffset(this.container);
        x -= parentOffset.left;
        y -= parentOffset.top;
      }
      return { x, y };
    }
    elementPositionCoords(element, position = "right") {
      var offset = Helpers.elOffset(element), containerOffset, x, y;
      if (this.container !== document.body) {
        containerOffset = Helpers.elOffset(this.container);
        offset.left -= containerOffset.left;
        offset.top -= containerOffset.top;
      }
      switch (position) {
        case "right":
          x = offset.left + element.offsetWidth;
          y = offset.top - 1;
          break;
        case "bottom":
          x = offset.left;
          y = offset.top + element.offsetHeight;
          break;
        case "left":
          x = offset.left;
          y = offset.top - 1;
          break;
        case "top":
          x = offset.left;
          y = offset.top;
          break;
        case "center":
          x = offset.left + element.offsetWidth / 2;
          y = offset.top + element.offsetHeight / 2;
          break;
      }
      return { x, y, offset };
    }
    show(origin, position) {
      var x, y, parentEl, parentOffset, coords;
      if (this.destroyed || this.table.destroyed) {
        return this;
      }
      if (origin instanceof HTMLElement) {
        parentEl = origin;
        coords = this.elementPositionCoords(origin, position);
        parentOffset = coords.offset;
        x = coords.x;
        y = coords.y;
      } else if (typeof origin === "number") {
        parentOffset = { top: 0, left: 0 };
        x = origin;
        y = position;
      } else {
        coords = this.containerEventCoords(origin);
        x = coords.x;
        y = coords.y;
        this.reversedX = false;
      }
      this.element.style.top = y + "px";
      this.element.style.left = x + "px";
      this.container.appendChild(this.element);
      if (typeof this.renderedCallback === "function") {
        this.renderedCallback();
      }
      this._fitToScreen(x, y, parentEl, parentOffset, position);
      this.visible = true;
      this.subscribe("table-destroy", this.destroyBinding);
      this.element.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
      return this;
    }
    _fitToScreen(x, y, parentEl, parentOffset, position) {
      var scrollTop = this.container === document.body ? document.documentElement.scrollTop : this.container.scrollTop;
      if (x + this.element.offsetWidth >= this.container.offsetWidth || this.reversedX) {
        this.element.style.left = "";
        if (parentEl) {
          this.element.style.right = this.container.offsetWidth - parentOffset.left + "px";
        } else {
          this.element.style.right = this.container.offsetWidth - x + "px";
        }
        this.reversedX = true;
      }
      let offsetHeight = Math.max(this.container.offsetHeight, scrollTop ? this.container.scrollHeight : 0);
      if (y + this.element.offsetHeight > offsetHeight) {
        if (parentEl) {
          switch (position) {
            case "bottom":
              this.element.style.top = parseInt(this.element.style.top) - this.element.offsetHeight - parentEl.offsetHeight - 1 + "px";
              break;
            default:
              this.element.style.top = parseInt(this.element.style.top) - this.element.offsetHeight + parentEl.offsetHeight + 1 + "px";
          }
        } else {
          this.element.style.height = offsetHeight + "px";
        }
      }
    }
    isVisible() {
      return this.visible;
    }
    hideOnBlur(callback) {
      this.blurable = true;
      if (this.visible) {
        setTimeout(() => {
          if (this.visible) {
            this.table.rowManager.element.addEventListener("scroll", this.blurEvent);
            this.subscribe("cell-editing", this.blurEvent);
            document.body.addEventListener("click", this.blurEvent);
            document.body.addEventListener("contextmenu", this.blurEvent);
            document.body.addEventListener("mousedown", this.blurEvent);
            window.addEventListener("resize", this.blurEvent);
            document.body.addEventListener("keydown", this.escEvent);
            this.blurEventsBound = true;
          }
        }, 100);
        this.blurCallback = callback;
      }
      return this;
    }
    _escapeCheck(e) {
      if (e.keyCode == 27) {
        this.hide();
      }
    }
    blockHide() {
      this.hideable = false;
    }
    restoreHide() {
      this.hideable = true;
    }
    hide(silent = false) {
      if (this.visible && this.hideable) {
        if (this.blurable && this.blurEventsBound) {
          document.body.removeEventListener("keydown", this.escEvent);
          document.body.removeEventListener("click", this.blurEvent);
          document.body.removeEventListener("contextmenu", this.blurEvent);
          document.body.removeEventListener("mousedown", this.blurEvent);
          window.removeEventListener("resize", this.blurEvent);
          this.table.rowManager.element.removeEventListener("scroll", this.blurEvent);
          this.unsubscribe("cell-editing", this.blurEvent);
          this.blurEventsBound = false;
        }
        if (this.childPopup) {
          this.childPopup.hide();
        }
        if (this.parent) {
          this.parent.childPopup = null;
        }
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        this.visible = false;
        if (this.blurCallback && !silent) {
          this.blurCallback();
        }
        this.unsubscribe("table-destroy", this.destroyBinding);
      }
      return this;
    }
    child(element) {
      if (this.childPopup) {
        this.childPopup.hide();
      }
      this.childPopup = new _Popup(this.table, element, this);
      return this.childPopup;
    }
  };

  // node_modules/tabulator-tables/src/js/core/Module.js
  var Module = class extends CoreFeature {
    constructor(table, name) {
      super(table);
      this._handler = null;
    }
    initialize() {
    }
    ///////////////////////////////////
    ////// Options Registration ///////
    ///////////////////////////////////
    registerTableOption(key, value) {
      this.table.optionsList.register(key, value);
    }
    registerColumnOption(key, value) {
      this.table.columnManager.optionsList.register(key, value);
    }
    ///////////////////////////////////
    /// Public Function Registration ///
    ///////////////////////////////////
    registerTableFunction(name, func) {
      if (typeof this.table[name] === "undefined") {
        this.table[name] = (...args) => {
          this.table.initGuard(name);
          return func(...args);
        };
      } else {
        console.warn("Unable to bind table function, name already in use", name);
      }
    }
    registerComponentFunction(component, func, handler) {
      return this.table.componentFunctionBinder.bind(component, func, handler);
    }
    ///////////////////////////////////
    ////////// Data Pipeline //////////
    ///////////////////////////////////
    registerDataHandler(handler, priority) {
      this.table.rowManager.registerDataPipelineHandler(handler, priority);
      this._handler = handler;
    }
    registerDisplayHandler(handler, priority) {
      this.table.rowManager.registerDisplayPipelineHandler(handler, priority);
      this._handler = handler;
    }
    displayRows(adjust) {
      var index = this.table.rowManager.displayRows.length - 1, lookupIndex;
      if (this._handler) {
        lookupIndex = this.table.rowManager.displayPipeline.findIndex((item) => {
          return item.handler === this._handler;
        });
        if (lookupIndex > -1) {
          index = lookupIndex;
        }
      }
      if (adjust) {
        index = index + adjust;
      }
      if (this._handler) {
        if (index > -1) {
          return this.table.rowManager.getDisplayRows(index);
        } else {
          return this.activeRows();
        }
      }
    }
    activeRows() {
      return this.table.rowManager.activeRows;
    }
    refreshData(renderInPosition, handler) {
      if (!handler) {
        handler = this._handler;
      }
      if (handler) {
        this.table.rowManager.refreshActiveData(handler, false, renderInPosition);
      }
    }
    ///////////////////////////////////
    //////// Footer Management ////////
    ///////////////////////////////////
    footerAppend(element) {
      return this.table.footerManager.append(element);
    }
    footerPrepend(element) {
      return this.table.footerManager.prepend(element);
    }
    footerRemove(element) {
      return this.table.footerManager.remove(element);
    }
    ///////////////////////////////////
    //////// Popups Management ////////
    ///////////////////////////////////
    popup(menuEl, menuContainer) {
      return new Popup(this.table, menuEl, menuContainer);
    }
    ///////////////////////////////////
    //////// Alert Management ////////
    ///////////////////////////////////
    alert(content, type) {
      return this.table.alertManager.alert(content, type);
    }
    clearAlert() {
      return this.table.alertManager.clear();
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Layout/defaults/modes/fitData.js
  function fitData_default(columns, forced) {
    if (forced) {
      this.table.columnManager.renderer.reinitializeColumnWidths(columns);
    }
    if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
      this.table.modules.responsiveLayout.update();
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Layout/defaults/modes/fitDataGeneral.js
  function fitDataGeneral_default(columns, forced) {
    columns.forEach(function(column) {
      column.reinitializeWidth();
    });
    if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
      this.table.modules.responsiveLayout.update();
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Layout/defaults/modes/fitDataStretch.js
  function fitDataStretch_default(columns, forced) {
    var colsWidth = 0, tableWidth = this.table.rowManager.element.clientWidth, gap = 0, lastCol = false;
    columns.forEach((column, i) => {
      if (!column.widthFixed) {
        column.reinitializeWidth();
      }
      if (this.table.options.responsiveLayout ? column.modules.responsive.visible : column.visible) {
        lastCol = column;
      }
      if (column.visible) {
        colsWidth += column.getWidth();
      }
    });
    if (lastCol) {
      gap = tableWidth - colsWidth + lastCol.getWidth();
      if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
        lastCol.setWidth(0);
        this.table.modules.responsiveLayout.update();
      }
      if (gap > 0) {
        lastCol.setWidth(gap);
      } else {
        lastCol.reinitializeWidth();
      }
    } else {
      if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
        this.table.modules.responsiveLayout.update();
      }
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Layout/defaults/modes/fitColumns.js
  function fitColumns_default(columns, forced) {
    var totalWidth = this.table.rowManager.element.getBoundingClientRect().width;
    var fixedWidth = 0;
    var flexWidth = 0;
    var flexGrowUnits = 0;
    var flexColWidth = 0;
    var flexColumns = [];
    var fixedShrinkColumns = [];
    var flexShrinkUnits = 0;
    var overflowWidth = 0;
    var gapFill = 0;
    function calcWidth(width) {
      var colWidth;
      if (typeof width == "string") {
        if (width.indexOf("%") > -1) {
          colWidth = totalWidth / 100 * parseInt(width);
        } else {
          colWidth = parseInt(width);
        }
      } else {
        colWidth = width;
      }
      return colWidth;
    }
    function scaleColumns(columns2, freeSpace, colWidth, shrinkCols) {
      var oversizeCols = [], oversizeSpace = 0, remainingSpace = 0, nextColWidth = 0, remainingFlexGrowUnits = flexGrowUnits, gap = 0, changeUnits = 0, undersizeCols = [];
      function calcGrow(col) {
        return colWidth * (col.column.definition.widthGrow || 1);
      }
      function calcShrink(col) {
        return calcWidth(col.width) - colWidth * (col.column.definition.widthShrink || 0);
      }
      columns2.forEach(function(col, i) {
        var width = shrinkCols ? calcShrink(col) : calcGrow(col);
        if (col.column.minWidth >= width) {
          oversizeCols.push(col);
        } else {
          if (col.column.maxWidth && col.column.maxWidth < width) {
            col.width = col.column.maxWidth;
            freeSpace -= col.column.maxWidth;
            remainingFlexGrowUnits -= shrinkCols ? col.column.definition.widthShrink || 1 : col.column.definition.widthGrow || 1;
            if (remainingFlexGrowUnits) {
              colWidth = Math.floor(freeSpace / remainingFlexGrowUnits);
            }
          } else {
            undersizeCols.push(col);
            changeUnits += shrinkCols ? col.column.definition.widthShrink || 1 : col.column.definition.widthGrow || 1;
          }
        }
      });
      if (oversizeCols.length) {
        oversizeCols.forEach(function(col) {
          oversizeSpace += shrinkCols ? col.width - col.column.minWidth : col.column.minWidth;
          col.width = col.column.minWidth;
        });
        remainingSpace = freeSpace - oversizeSpace;
        nextColWidth = changeUnits ? Math.floor(remainingSpace / changeUnits) : remainingSpace;
        gap = scaleColumns(undersizeCols, remainingSpace, nextColWidth, shrinkCols);
      } else {
        gap = changeUnits ? freeSpace - Math.floor(freeSpace / changeUnits) * changeUnits : freeSpace;
        undersizeCols.forEach(function(column) {
          column.width = shrinkCols ? calcShrink(column) : calcGrow(column);
        });
      }
      return gap;
    }
    if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
      this.table.modules.responsiveLayout.update();
    }
    if (this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight) {
      totalWidth -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth;
    }
    columns.forEach(function(column) {
      var width, minWidth, colWidth;
      if (column.visible) {
        width = column.definition.width;
        minWidth = parseInt(column.minWidth);
        if (width) {
          colWidth = calcWidth(width);
          fixedWidth += colWidth > minWidth ? colWidth : minWidth;
          if (column.definition.widthShrink) {
            fixedShrinkColumns.push({
              column,
              width: colWidth > minWidth ? colWidth : minWidth
            });
            flexShrinkUnits += column.definition.widthShrink;
          }
        } else {
          flexColumns.push({
            column,
            width: 0
          });
          flexGrowUnits += column.definition.widthGrow || 1;
        }
      }
    });
    flexWidth = totalWidth - fixedWidth;
    flexColWidth = Math.floor(flexWidth / flexGrowUnits);
    gapFill = scaleColumns(flexColumns, flexWidth, flexColWidth, false);
    if (flexColumns.length && gapFill > 0) {
      flexColumns[flexColumns.length - 1].width += gapFill;
    }
    flexColumns.forEach(function(col) {
      flexWidth -= col.width;
    });
    overflowWidth = Math.abs(gapFill) + flexWidth;
    if (overflowWidth > 0 && flexShrinkUnits) {
      gapFill = scaleColumns(fixedShrinkColumns, overflowWidth, Math.floor(overflowWidth / flexShrinkUnits), true);
    }
    if (gapFill && fixedShrinkColumns.length) {
      fixedShrinkColumns[fixedShrinkColumns.length - 1].width -= gapFill;
    }
    flexColumns.forEach(function(col) {
      col.column.setWidth(col.width);
    });
    fixedShrinkColumns.forEach(function(col) {
      col.column.setWidth(col.width);
    });
  }

  // node_modules/tabulator-tables/src/js/modules/Layout/defaults/modes.js
  var modes_default = {
    fitData: fitData_default,
    fitDataFill: fitDataGeneral_default,
    fitDataTable: fitDataGeneral_default,
    fitDataStretch: fitDataStretch_default,
    fitColumns: fitColumns_default
  };

  // node_modules/tabulator-tables/src/js/modules/Layout/Layout.js
  var Layout = class _Layout extends Module {
    static moduleName = "layout";
    //load defaults
    static modes = modes_default;
    constructor(table) {
      super(table, "layout");
      this.mode = null;
      this.registerTableOption("layout", "fitData");
      this.registerTableOption("layoutColumnsOnNewData", false);
      this.registerColumnOption("widthGrow");
      this.registerColumnOption("widthShrink");
    }
    //initialize layout system
    initialize() {
      var layout = this.table.options.layout;
      if (_Layout.modes[layout]) {
        this.mode = layout;
      } else {
        console.warn("Layout Error - invalid mode set, defaulting to 'fitData' : " + layout);
        this.mode = "fitData";
      }
      this.table.element.setAttribute("tabulator-layout", this.mode);
      this.subscribe("column-init", this.initializeColumn.bind(this));
    }
    initializeColumn(column) {
      if (column.definition.widthGrow) {
        column.definition.widthGrow = Number(column.definition.widthGrow);
      }
      if (column.definition.widthShrink) {
        column.definition.widthShrink = Number(column.definition.widthShrink);
      }
    }
    getMode() {
      return this.mode;
    }
    //trigger table layout
    layout(dataChanged) {
      this.dispatch("layout-refreshing");
      _Layout.modes[this.mode].call(this, this.table.columnManager.columnsByIndex, dataChanged);
      this.dispatch("layout-refreshed");
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Localize/defaults/langs.js
  var langs_default = {
    "default": {
      //hold default locale text
      "groups": {
        "item": "item",
        "items": "items"
      },
      "columns": {},
      "data": {
        "loading": "Loading",
        "error": "Error"
      },
      "pagination": {
        "page_size": "Page Size",
        "page_title": "Show Page",
        "first": "First",
        "first_title": "First Page",
        "last": "Last",
        "last_title": "Last Page",
        "prev": "Prev",
        "prev_title": "Prev Page",
        "next": "Next",
        "next_title": "Next Page",
        "all": "All",
        "counter": {
          "showing": "Showing",
          "of": "of",
          "rows": "rows",
          "pages": "pages"
        }
      },
      "headerFilters": {
        "default": "filter column...",
        "columns": {}
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Localize/Localize.js
  var Localize = class _Localize extends Module {
    static moduleName = "localize";
    //load defaults
    static langs = langs_default;
    constructor(table) {
      super(table);
      this.locale = "default";
      this.lang = false;
      this.bindings = {};
      this.langList = {};
      this.registerTableOption("locale", false);
      this.registerTableOption("langs", {});
    }
    initialize() {
      this.langList = Helpers.deepClone(_Localize.langs);
      if (this.table.options.columnDefaults.headerFilterPlaceholder !== false) {
        this.setHeaderFilterPlaceholder(this.table.options.columnDefaults.headerFilterPlaceholder);
      }
      for (let locale in this.table.options.langs) {
        this.installLang(locale, this.table.options.langs[locale]);
      }
      this.setLocale(this.table.options.locale);
      this.registerTableFunction("setLocale", this.setLocale.bind(this));
      this.registerTableFunction("getLocale", this.getLocale.bind(this));
      this.registerTableFunction("getLang", this.getLang.bind(this));
    }
    //set header placeholder
    setHeaderFilterPlaceholder(placeholder) {
      this.langList.default.headerFilters.default = placeholder;
    }
    //setup a lang description object
    installLang(locale, lang) {
      if (this.langList[locale]) {
        this._setLangProp(this.langList[locale], lang);
      } else {
        this.langList[locale] = lang;
      }
    }
    _setLangProp(lang, values) {
      for (let key in values) {
        if (lang[key] && typeof lang[key] == "object") {
          this._setLangProp(lang[key], values[key]);
        } else {
          lang[key] = values[key];
        }
      }
    }
    //set current locale
    setLocale(desiredLocale) {
      desiredLocale = desiredLocale || "default";
      function traverseLang(trans, path) {
        for (var prop in trans) {
          if (typeof trans[prop] == "object") {
            if (!path[prop]) {
              path[prop] = {};
            }
            traverseLang(trans[prop], path[prop]);
          } else {
            path[prop] = trans[prop];
          }
        }
      }
      if (desiredLocale === true && navigator.language) {
        desiredLocale = navigator.language.toLowerCase();
      }
      if (desiredLocale) {
        if (!this.langList[desiredLocale]) {
          let prefix = desiredLocale.split("-")[0];
          if (this.langList[prefix]) {
            console.warn("Localization Error - Exact matching locale not found, using closest match: ", desiredLocale, prefix);
            desiredLocale = prefix;
          } else {
            console.warn("Localization Error - Matching locale not found, using default: ", desiredLocale);
            desiredLocale = "default";
          }
        }
      }
      this.locale = desiredLocale;
      this.lang = Helpers.deepClone(this.langList.default || {});
      if (desiredLocale != "default") {
        traverseLang(this.langList[desiredLocale], this.lang);
      }
      this.dispatchExternal("localized", this.locale, this.lang);
      this._executeBindings();
    }
    //get current locale
    getLocale(locale) {
      return this.locale;
    }
    //get lang object for given local or current if none provided
    getLang(locale) {
      return locale ? this.langList[locale] : this.lang;
    }
    //get text for current locale
    getText(path, value) {
      var fillPath = value ? path + "|" + value : path, pathArray = fillPath.split("|"), text = this._getLangElement(pathArray, this.locale);
      return text || "";
    }
    //traverse langs object and find localized copy
    _getLangElement(path, locale) {
      var root = this.lang;
      path.forEach(function(level) {
        var rootPath;
        if (root) {
          rootPath = root[level];
          if (typeof rootPath != "undefined") {
            root = rootPath;
          } else {
            root = false;
          }
        }
      });
      return root;
    }
    //set update binding
    bind(path, callback) {
      if (!this.bindings[path]) {
        this.bindings[path] = [];
      }
      this.bindings[path].push(callback);
      callback(this.getText(path), this.lang);
    }
    //iterate through bindings and trigger updates
    _executeBindings() {
      for (let path in this.bindings) {
        this.bindings[path].forEach((binding) => {
          binding(this.getText(path), this.lang);
        });
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Comms/Comms.js
  var Comms = class extends Module {
    static moduleName = "comms";
    constructor(table) {
      super(table);
    }
    initialize() {
      this.registerTableFunction("tableComms", this.receive.bind(this));
    }
    getConnections(selectors) {
      var connections = [], connection;
      connection = this.table.constructor.registry.lookupTable(selectors);
      connection.forEach((con) => {
        if (this.table !== con) {
          connections.push(con);
        }
      });
      return connections;
    }
    send(selectors, module, action, data) {
      var connections = this.getConnections(selectors);
      connections.forEach((connection) => {
        connection.tableComms(this.table.element, module, action, data);
      });
      if (!connections.length && selectors) {
        console.warn("Table Connection Error - No tables matching selector found", selectors);
      }
    }
    receive(table, module, action, data) {
      if (this.table.modExists(module)) {
        return this.table.modules[module].commsReceived(table, action, data);
      } else {
        console.warn("Inter-table Comms Error - no such module:", module);
      }
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/TableRegistry.js
  var TableRegistry = class _TableRegistry {
    static registry = {
      tables: [],
      register(table) {
        _TableRegistry.registry.tables.push(table);
      },
      deregister(table) {
        var index = _TableRegistry.registry.tables.indexOf(table);
        if (index > -1) {
          _TableRegistry.registry.tables.splice(index, 1);
        }
      },
      lookupTable(query, silent) {
        var results = [], matches, match;
        if (typeof query === "string") {
          matches = document.querySelectorAll(query);
          if (matches.length) {
            for (var i = 0; i < matches.length; i++) {
              match = _TableRegistry.registry.matchElement(matches[i]);
              if (match) {
                results.push(match);
              }
            }
          }
        } else if (typeof HTMLElement !== "undefined" && query instanceof HTMLElement || query instanceof _TableRegistry) {
          match = _TableRegistry.registry.matchElement(query);
          if (match) {
            results.push(match);
          }
        } else if (Array.isArray(query)) {
          query.forEach(function(item) {
            results = results.concat(_TableRegistry.registry.lookupTable(item));
          });
        } else {
          if (!silent) {
            console.warn("Table Connection Error - Invalid Selector", query);
          }
        }
        return results;
      },
      matchElement(element) {
        return _TableRegistry.registry.tables.find(function(table) {
          return element instanceof _TableRegistry ? table === element : table.element === element;
        });
      }
    };
    static findTable(query) {
      var results = _TableRegistry.registry.lookupTable(query, true);
      return Array.isArray(results) && !results.length ? false : results;
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/ModuleBinder.js
  var ModuleBinder = class _ModuleBinder extends TableRegistry {
    static moduleBindings = {};
    static moduleExtensions = {};
    static modulesRegistered = false;
    static defaultModules = false;
    constructor() {
      super();
    }
    static initializeModuleBinder(defaultModules) {
      if (!_ModuleBinder.modulesRegistered) {
        _ModuleBinder.modulesRegistered = true;
        _ModuleBinder._registerModules(core_exports, true);
        if (defaultModules) {
          _ModuleBinder._registerModules(defaultModules);
        }
      }
    }
    static _extendModule(name, property, values) {
      if (_ModuleBinder.moduleBindings[name]) {
        var source = _ModuleBinder.moduleBindings[name][property];
        if (source) {
          if (typeof values == "object") {
            for (let key in values) {
              source[key] = values[key];
            }
          } else {
            console.warn("Module Error - Invalid value type, it must be an object");
          }
        } else {
          console.warn("Module Error - property does not exist:", property);
        }
      } else {
        console.warn("Module Error - module does not exist:", name);
      }
    }
    static _registerModules(modules, core) {
      var mods = Object.values(modules);
      if (core) {
        mods.forEach((mod) => {
          mod.prototype.moduleCore = true;
        });
      }
      _ModuleBinder._registerModule(mods);
    }
    static _registerModule(modules) {
      if (!Array.isArray(modules)) {
        modules = [modules];
      }
      modules.forEach((mod) => {
        _ModuleBinder._registerModuleBinding(mod);
        _ModuleBinder._registerModuleExtensions(mod);
      });
    }
    static _registerModuleBinding(mod) {
      if (mod.moduleName) {
        _ModuleBinder.moduleBindings[mod.moduleName] = mod;
      } else {
        console.error("Unable to bind module, no moduleName defined", mod.moduleName);
      }
    }
    static _registerModuleExtensions(mod) {
      var extensions = mod.moduleExtensions;
      if (mod.moduleExtensions) {
        for (let modKey in extensions) {
          let ext = extensions[modKey];
          if (_ModuleBinder.moduleBindings[modKey]) {
            for (let propKey in ext) {
              _ModuleBinder._extendModule(modKey, propKey, ext[propKey]);
            }
          } else {
            if (!_ModuleBinder.moduleExtensions[modKey]) {
              _ModuleBinder.moduleExtensions[modKey] = {};
            }
            for (let propKey in ext) {
              if (!_ModuleBinder.moduleExtensions[modKey][propKey]) {
                _ModuleBinder.moduleExtensions[modKey][propKey] = {};
              }
              Object.assign(_ModuleBinder.moduleExtensions[modKey][propKey], ext[propKey]);
            }
          }
        }
      }
      _ModuleBinder._extendModuleFromQueue(mod);
    }
    static _extendModuleFromQueue(mod) {
      var extensions = _ModuleBinder.moduleExtensions[mod.moduleName];
      if (extensions) {
        for (let propKey in extensions) {
          _ModuleBinder._extendModule(mod.moduleName, propKey, extensions[propKey]);
        }
      }
    }
    //ensure that module are bound to instantiated function
    _bindModules() {
      var orderedStartMods = [], orderedEndMods = [], unOrderedMods = [];
      this.modules = {};
      for (var name in _ModuleBinder.moduleBindings) {
        let mod = _ModuleBinder.moduleBindings[name];
        let module = new mod(this);
        this.modules[name] = module;
        if (mod.prototype.moduleCore) {
          this.modulesCore.push(module);
        } else {
          if (mod.moduleInitOrder) {
            if (mod.moduleInitOrder < 0) {
              orderedStartMods.push(module);
            } else {
              orderedEndMods.push(module);
            }
          } else {
            unOrderedMods.push(module);
          }
        }
      }
      orderedStartMods.sort((a, b) => a.moduleInitOrder > b.moduleInitOrder ? 1 : -1);
      orderedEndMods.sort((a, b) => a.moduleInitOrder > b.moduleInitOrder ? 1 : -1);
      this.modulesRegular = orderedStartMods.concat(unOrderedMods.concat(orderedEndMods));
    }
  };

  // node_modules/tabulator-tables/src/js/core/tools/Alert.js
  var Alert = class extends CoreFeature {
    constructor(table) {
      super(table);
      this.element = this._createAlertElement();
      this.msgElement = this._createMsgElement();
      this.type = null;
      this.element.appendChild(this.msgElement);
    }
    _createAlertElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-alert");
      return el;
    }
    _createMsgElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-alert-msg");
      el.setAttribute("role", "alert");
      return el;
    }
    _typeClass() {
      return "tabulator-alert-state-" + this.type;
    }
    alert(content, type = "msg") {
      if (content) {
        this.clear();
        this.dispatch("alert-show", type);
        this.type = type;
        while (this.msgElement.firstChild) this.msgElement.removeChild(this.msgElement.firstChild);
        this.msgElement.classList.add(this._typeClass());
        if (typeof content === "function") {
          content = content();
        }
        if (content instanceof HTMLElement) {
          this.msgElement.appendChild(content);
        } else {
          this.msgElement.innerHTML = content;
        }
        this.table.element.appendChild(this.element);
      }
    }
    clear() {
      this.dispatch("alert-hide", this.type);
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.msgElement.classList.remove(this._typeClass());
    }
  };

  // node_modules/tabulator-tables/src/js/core/Tabulator.js
  var Tabulator = class _Tabulator extends ModuleBinder {
    //default setup options
    static defaultOptions = options_default;
    static extendModule() {
      _Tabulator.initializeModuleBinder();
      _Tabulator._extendModule(...arguments);
    }
    static registerModule() {
      _Tabulator.initializeModuleBinder();
      _Tabulator._registerModule(...arguments);
    }
    constructor(element, options, modules) {
      super();
      _Tabulator.initializeModuleBinder(modules);
      this.options = {};
      this.columnManager = null;
      this.rowManager = null;
      this.footerManager = null;
      this.alertManager = null;
      this.vdomHoz = null;
      this.externalEvents = null;
      this.eventBus = null;
      this.interactionMonitor = false;
      this.browser = "";
      this.browserSlow = false;
      this.browserMobile = false;
      this.rtl = false;
      this.originalElement = null;
      this.componentFunctionBinder = new ComponentFunctionBinder(this);
      this.dataLoader = false;
      this.modules = {};
      this.modulesCore = [];
      this.modulesRegular = [];
      this.deprecationAdvisor = new DeprecationAdvisor(this);
      this.optionsList = new OptionsList(this, "table constructor");
      this.initialized = false;
      this.destroyed = false;
      if (this.initializeElement(element)) {
        this.initializeCoreSystems(options);
        setTimeout(() => {
          this._create();
        });
      }
      this.constructor.registry.register(this);
    }
    initializeElement(element) {
      if (typeof HTMLElement !== "undefined" && element instanceof HTMLElement) {
        this.element = element;
        return true;
      } else if (typeof element === "string") {
        this.element = document.querySelector(element);
        if (this.element) {
          return true;
        } else {
          console.error("Tabulator Creation Error - no element found matching selector: ", element);
          return false;
        }
      } else {
        console.error("Tabulator Creation Error - Invalid element provided:", element);
        return false;
      }
    }
    initializeCoreSystems(options) {
      this.columnManager = new ColumnManager(this);
      this.rowManager = new RowManager(this);
      this.footerManager = new FooterManager(this);
      this.dataLoader = new DataLoader(this);
      this.alertManager = new Alert(this);
      this._bindModules();
      this.options = this.optionsList.generate(_Tabulator.defaultOptions, options);
      this._clearObjectPointers();
      this._mapDeprecatedFunctionality();
      this.externalEvents = new ExternalEventBus(this, this.options, this.options.debugEventsExternal);
      this.eventBus = new InternalEventBus(this.options.debugEventsInternal);
      this.interactionMonitor = new InteractionManager(this);
      this.dataLoader.initialize();
      this.footerManager.initialize();
    }
    //convert deprecated functionality to new functions
    _mapDeprecatedFunctionality() {
    }
    _clearSelection() {
      this.element.classList.add("tabulator-block-select");
      if (window.getSelection) {
        if (window.getSelection().empty) {
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {
        document.selection.empty();
      }
      this.element.classList.remove("tabulator-block-select");
    }
    //create table
    _create() {
      this.externalEvents.dispatch("tableBuilding");
      this.eventBus.dispatch("table-building");
      this._rtlCheck();
      this._buildElement();
      this._initializeTable();
      this.initialized = true;
      this._loadInitialData().finally(() => {
        this.eventBus.dispatch("table-initialized");
        this.externalEvents.dispatch("tableBuilt");
      });
    }
    _rtlCheck() {
      var style = window.getComputedStyle(this.element);
      switch (this.options.textDirection) {
        case "auto":
          if (style.direction !== "rtl") {
            break;
          }
        case "rtl":
          this.element.classList.add("tabulator-rtl");
          this.rtl = true;
          break;
        case "ltr":
          this.element.classList.add("tabulator-ltr");
        default:
          this.rtl = false;
      }
    }
    //clear pointers to objects in default config object
    _clearObjectPointers() {
      this.options.columns = this.options.columns.slice(0);
      if (Array.isArray(this.options.data) && !this.options.reactiveData) {
        this.options.data = this.options.data.slice(0);
      }
    }
    //build tabulator element
    _buildElement() {
      var element = this.element, options = this.options, newElement;
      if (element.tagName === "TABLE") {
        this.originalElement = this.element;
        newElement = document.createElement("div");
        var attributes = element.attributes;
        for (var i in attributes) {
          if (typeof attributes[i] == "object") {
            newElement.setAttribute(attributes[i].name, attributes[i].value);
          }
        }
        element.parentNode.replaceChild(newElement, element);
        this.element = element = newElement;
      }
      element.classList.add("tabulator");
      element.setAttribute("role", "grid");
      while (element.firstChild) element.removeChild(element.firstChild);
      if (options.height) {
        options.height = isNaN(options.height) ? options.height : options.height + "px";
        element.style.height = options.height;
      }
      if (options.minHeight !== false) {
        options.minHeight = isNaN(options.minHeight) ? options.minHeight : options.minHeight + "px";
        element.style.minHeight = options.minHeight;
      }
      if (options.maxHeight !== false) {
        options.maxHeight = isNaN(options.maxHeight) ? options.maxHeight : options.maxHeight + "px";
        element.style.maxHeight = options.maxHeight;
      }
    }
    //initialize core systems and modules
    _initializeTable() {
      var element = this.element, options = this.options;
      this.interactionMonitor.initialize();
      this.columnManager.initialize();
      this.rowManager.initialize();
      this._detectBrowser();
      this.modulesCore.forEach((mod) => {
        mod.initialize();
      });
      element.appendChild(this.columnManager.getElement());
      element.appendChild(this.rowManager.getElement());
      if (options.footerElement) {
        this.footerManager.activate();
      }
      if (options.autoColumns && options.data) {
        this.columnManager.generateColumnsFromRowData(this.options.data);
      }
      this.modulesRegular.forEach((mod) => {
        mod.initialize();
      });
      this.columnManager.setColumns(options.columns);
      this.eventBus.dispatch("table-built");
    }
    _loadInitialData() {
      return this.dataLoader.load(this.options.data).finally(() => {
        this.columnManager.verticalAlignHeaders();
      });
    }
    //deconstructor
    destroy() {
      var element = this.element;
      this.destroyed = true;
      this.constructor.registry.deregister(this);
      this.eventBus.dispatch("table-destroy");
      this.rowManager.destroy();
      while (element.firstChild) element.removeChild(element.firstChild);
      element.classList.remove("tabulator");
      this.externalEvents.dispatch("tableDestroyed");
    }
    _detectBrowser() {
      var ua = navigator.userAgent || navigator.vendor || window.opera;
      if (ua.indexOf("Trident") > -1) {
        this.browser = "ie";
        this.browserSlow = true;
      } else if (ua.indexOf("Edge") > -1) {
        this.browser = "edge";
        this.browserSlow = true;
      } else if (ua.indexOf("Firefox") > -1) {
        this.browser = "firefox";
        this.browserSlow = false;
      } else if (ua.indexOf("Mac OS") > -1) {
        this.browser = "safari";
        this.browserSlow = false;
      } else {
        this.browser = "other";
        this.browserSlow = false;
      }
      this.browserMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(ua.slice(0, 4));
    }
    initGuard(func, msg) {
      var stack, line;
      if (this.options.debugInitialization && !this.initialized) {
        if (!func) {
          stack = new Error().stack.split("\n");
          line = stack[0] == "Error" ? stack[2] : stack[1];
          if (line[0] == " ") {
            func = line.trim().split(" ")[1].split(".")[1];
          } else {
            func = line.trim().split("@")[0];
          }
        }
        console.warn("Table Not Initialized - Calling the " + func + " function before the table is initialized may result in inconsistent behavior, Please wait for the `tableBuilt` event before calling this function." + (msg ? " " + msg : ""));
      }
      return this.initialized;
    }
    ////////////////// Data Handling //////////////////
    //block table redrawing
    blockRedraw() {
      this.initGuard();
      this.eventBus.dispatch("redraw-blocking");
      this.rowManager.blockRedraw();
      this.columnManager.blockRedraw();
      this.eventBus.dispatch("redraw-blocked");
    }
    //restore table redrawing
    restoreRedraw() {
      this.initGuard();
      this.eventBus.dispatch("redraw-restoring");
      this.rowManager.restoreRedraw();
      this.columnManager.restoreRedraw();
      this.eventBus.dispatch("redraw-restored");
    }
    //load data
    setData(data, params, config) {
      this.initGuard(false, "To set initial data please use the 'data' property in the table constructor.");
      return this.dataLoader.load(data, params, config, false);
    }
    //clear data
    clearData() {
      this.initGuard();
      this.dataLoader.blockActiveLoad();
      this.rowManager.clearData();
    }
    //get table data array
    getData(active) {
      return this.rowManager.getData(active);
    }
    //get table data array count
    getDataCount(active) {
      return this.rowManager.getDataCount(active);
    }
    //replace data, keeping table in position with same sort
    replaceData(data, params, config) {
      this.initGuard();
      return this.dataLoader.load(data, params, config, true, true);
    }
    //update table data
    updateData(data) {
      var responses = 0;
      this.initGuard();
      return new Promise((resolve, reject) => {
        this.dataLoader.blockActiveLoad();
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        if (data && data.length > 0) {
          data.forEach((item) => {
            var row = this.rowManager.findRow(item[this.options.index]);
            if (row) {
              responses++;
              row.updateData(item).then(() => {
                responses--;
                if (!responses) {
                  resolve();
                }
              }).catch((e) => {
                reject("Update Error - Unable to update row", item, e);
              });
            } else {
              reject("Update Error - Unable to find row", item);
            }
          });
        } else {
          console.warn("Update Error - No data provided");
          reject("Update Error - No data provided");
        }
      });
    }
    addData(data, pos, index) {
      this.initGuard();
      return new Promise((resolve, reject) => {
        this.dataLoader.blockActiveLoad();
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        if (data) {
          this.rowManager.addRows(data, pos, index).then((rows) => {
            var output = [];
            rows.forEach(function(row) {
              output.push(row.getComponent());
            });
            resolve(output);
          });
        } else {
          console.warn("Update Error - No data provided");
          reject("Update Error - No data provided");
        }
      });
    }
    //update table data
    updateOrAddData(data) {
      var rows = [], responses = 0;
      this.initGuard();
      return new Promise((resolve, reject) => {
        this.dataLoader.blockActiveLoad();
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        if (data && data.length > 0) {
          data.forEach((item) => {
            var row = this.rowManager.findRow(item[this.options.index]);
            responses++;
            if (row) {
              row.updateData(item).then(() => {
                responses--;
                rows.push(row.getComponent());
                if (!responses) {
                  resolve(rows);
                }
              });
            } else {
              this.rowManager.addRows(item).then((newRows) => {
                responses--;
                rows.push(newRows[0].getComponent());
                if (!responses) {
                  resolve(rows);
                }
              });
            }
          });
        } else {
          console.warn("Update Error - No data provided");
          reject("Update Error - No data provided");
        }
      });
    }
    //get row object
    getRow(index) {
      var row = this.rowManager.findRow(index);
      if (row) {
        return row.getComponent();
      } else {
        console.warn("Find Error - No matching row found:", index);
        return false;
      }
    }
    //get row object
    getRowFromPosition(position) {
      var row = this.rowManager.getRowFromPosition(position);
      if (row) {
        return row.getComponent();
      } else {
        console.warn("Find Error - No matching row found:", position);
        return false;
      }
    }
    //delete row from table
    deleteRow(index) {
      var foundRows = [];
      this.initGuard();
      if (!Array.isArray(index)) {
        index = [index];
      }
      for (let item of index) {
        let row = this.rowManager.findRow(item, true);
        if (row) {
          foundRows.push(row);
        } else {
          console.error("Delete Error - No matching row found:", item);
          return Promise.reject("Delete Error - No matching row found");
        }
      }
      foundRows.sort((a, b) => {
        return this.rowManager.rows.indexOf(a) > this.rowManager.rows.indexOf(b) ? 1 : -1;
      });
      foundRows.forEach((row) => {
        row.delete();
      });
      this.rowManager.reRenderInPosition();
      return Promise.resolve();
    }
    //add row to table
    addRow(data, pos, index) {
      this.initGuard();
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      return this.rowManager.addRows(data, pos, index, true).then((rows) => {
        return rows[0].getComponent();
      });
    }
    //update a row if it exists otherwise create it
    updateOrAddRow(index, data) {
      var row = this.rowManager.findRow(index);
      this.initGuard();
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      if (row) {
        return row.updateData(data).then(() => {
          return row.getComponent();
        });
      } else {
        return this.rowManager.addRows(data).then((rows) => {
          return rows[0].getComponent();
        });
      }
    }
    //update row data
    updateRow(index, data) {
      var row = this.rowManager.findRow(index);
      this.initGuard();
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      if (row) {
        return row.updateData(data).then(() => {
          return Promise.resolve(row.getComponent());
        });
      } else {
        console.warn("Update Error - No matching row found:", index);
        return Promise.reject("Update Error - No matching row found");
      }
    }
    //scroll to row in DOM
    scrollToRow(index, position, ifVisible) {
      var row = this.rowManager.findRow(index);
      if (row) {
        return this.rowManager.scrollToRow(row, position, ifVisible);
      } else {
        console.warn("Scroll Error - No matching row found:", index);
        return Promise.reject("Scroll Error - No matching row found");
      }
    }
    moveRow(from, to, after) {
      var fromRow = this.rowManager.findRow(from);
      this.initGuard();
      if (fromRow) {
        fromRow.moveToRow(to, after);
      } else {
        console.warn("Move Error - No matching row found:", from);
      }
    }
    getRows(active) {
      return this.rowManager.getComponents(active);
    }
    //get position of row in table
    getRowPosition(index) {
      var row = this.rowManager.findRow(index);
      if (row) {
        return row.getPosition();
      } else {
        console.warn("Position Error - No matching row found:", index);
        return false;
      }
    }
    /////////////// Column Functions  ///////////////
    setColumns(definition) {
      this.initGuard(false, "To set initial columns please use the 'columns' property in the table constructor");
      this.columnManager.setColumns(definition);
    }
    getColumns(structured) {
      return this.columnManager.getComponents(structured);
    }
    getColumn(field) {
      var column = this.columnManager.findColumn(field);
      if (column) {
        return column.getComponent();
      } else {
        console.warn("Find Error - No matching column found:", field);
        return false;
      }
    }
    getColumnDefinitions() {
      return this.columnManager.getDefinitionTree();
    }
    showColumn(field) {
      var column = this.columnManager.findColumn(field);
      this.initGuard();
      if (column) {
        column.show();
      } else {
        console.warn("Column Show Error - No matching column found:", field);
        return false;
      }
    }
    hideColumn(field) {
      var column = this.columnManager.findColumn(field);
      this.initGuard();
      if (column) {
        column.hide();
      } else {
        console.warn("Column Hide Error - No matching column found:", field);
        return false;
      }
    }
    toggleColumn(field) {
      var column = this.columnManager.findColumn(field);
      this.initGuard();
      if (column) {
        if (column.visible) {
          column.hide();
        } else {
          column.show();
        }
      } else {
        console.warn("Column Visibility Toggle Error - No matching column found:", field);
        return false;
      }
    }
    addColumn(definition, before, field) {
      var column = this.columnManager.findColumn(field);
      this.initGuard();
      return this.columnManager.addColumn(definition, before, column).then((column2) => {
        return column2.getComponent();
      });
    }
    deleteColumn(field) {
      var column = this.columnManager.findColumn(field);
      this.initGuard();
      if (column) {
        return column.delete();
      } else {
        console.warn("Column Delete Error - No matching column found:", field);
        return Promise.reject();
      }
    }
    updateColumnDefinition(field, definition) {
      var column = this.columnManager.findColumn(field);
      this.initGuard();
      if (column) {
        return column.updateDefinition(definition);
      } else {
        console.warn("Column Update Error - No matching column found:", field);
        return Promise.reject();
      }
    }
    moveColumn(from, to, after) {
      var fromColumn = this.columnManager.findColumn(from), toColumn = this.columnManager.findColumn(to);
      this.initGuard();
      if (fromColumn) {
        if (toColumn) {
          this.columnManager.moveColumn(fromColumn, toColumn, after);
        } else {
          console.warn("Move Error - No matching column found:", toColumn);
        }
      } else {
        console.warn("Move Error - No matching column found:", from);
      }
    }
    //scroll to column in DOM
    scrollToColumn(field, position, ifVisible) {
      return new Promise((resolve, reject) => {
        var column = this.columnManager.findColumn(field);
        if (column) {
          return this.columnManager.scrollToColumn(column, position, ifVisible);
        } else {
          console.warn("Scroll Error - No matching column found:", field);
          return Promise.reject("Scroll Error - No matching column found");
        }
      });
    }
    //////////// General Public Functions ////////////
    //redraw list without updating data
    redraw(force) {
      this.initGuard();
      this.columnManager.redraw(force);
      this.rowManager.redraw(force);
    }
    setHeight(height) {
      this.options.height = isNaN(height) ? height : height + "px";
      this.element.style.height = this.options.height;
      this.rowManager.initializeRenderer();
      this.rowManager.redraw(true);
    }
    //////////////////// Event Bus ///////////////////
    on(key, callback) {
      this.externalEvents.subscribe(key, callback);
    }
    off(key, callback) {
      this.externalEvents.unsubscribe(key, callback);
    }
    dispatchEvent() {
      var args = Array.from(arguments);
      args.shift();
      this.externalEvents.dispatch(...arguments);
    }
    //////////////////// Alerts ///////////////////
    alert(contents, type) {
      this.initGuard();
      this.alertManager.alert(contents, type);
    }
    clearAlert() {
      this.initGuard();
      this.alertManager.clear();
    }
    ////////////// Extension Management //////////////
    modExists(plugin, required) {
      if (this.modules[plugin]) {
        return true;
      } else {
        if (required) {
          console.error("Tabulator Module Not Installed: " + plugin);
        }
        return false;
      }
    }
    module(key) {
      var mod = this.modules[key];
      if (!mod) {
        console.error("Tabulator module not installed: " + key);
      }
      return mod;
    }
  };
  var Tabulator_default = Tabulator;

  // src/classes/tabulator/optional.js
  var optional_exports = {};
  __export(optional_exports, {
    AccessorModule: () => Accessor,
    AjaxModule: () => Ajax,
    ClipboardModule: () => Clipboard,
    ColumnCalcsModule: () => ColumnCalcs,
    DataTreeModule: () => MyDataTree,
    DownloadModule: () => Download,
    EditModule: () => Edit2,
    ExportModule: () => Export,
    FilterModule: () => Filter,
    FormatModule: () => Format,
    FrozenColumnsModule: () => FrozenColumns,
    FrozenRowsModule: () => FrozenRows,
    GroupRowsModule: () => GroupRows,
    HistoryModule: () => History,
    HtmlTableImportModule: () => HtmlTableImport,
    ImportModule: () => Import,
    InteractionModule: () => Interaction,
    KeybindingsModule: () => Keybindings,
    MenuModule: () => Menu,
    MoveColumnsModule: () => MoveColumns,
    MoveRowsModule: () => MoveRows,
    MutatorModule: () => Mutator,
    PageModule: () => Page,
    PersistenceModule: () => Persistence,
    PopupModule: () => Popup2,
    PrintModule: () => Print,
    ReactiveDataModule: () => ReactiveData,
    ResizeColumnsModule: () => ResizeColumns,
    ResizeRowsModule: () => ResizeRows,
    ResizeTableModule: () => MyResizeTable,
    ResponsiveLayoutModule: () => ResponsiveLayout_default,
    SelectRowModule: () => SelectRow,
    SortModule: () => Sort,
    TooltipModule: () => Tooltip,
    ValidateModule: () => Validate
  });

  // node_modules/tabulator-tables/src/js/modules/Accessor/defaults/accessors.js
  var accessors_default = {
    rownum: function(value, data, type, params, column, row) {
      return row.getPosition();
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Accessor/Accessor.js
  var Accessor = class _Accessor extends Module {
    static moduleName = "accessor";
    //load defaults
    static accessors = accessors_default;
    constructor(table) {
      super(table);
      this.allowedTypes = ["", "data", "download", "clipboard", "print", "htmlOutput"];
      this.registerColumnOption("accessor");
      this.registerColumnOption("accessorParams");
      this.registerColumnOption("accessorData");
      this.registerColumnOption("accessorDataParams");
      this.registerColumnOption("accessorDownload");
      this.registerColumnOption("accessorDownloadParams");
      this.registerColumnOption("accessorClipboard");
      this.registerColumnOption("accessorClipboardParams");
      this.registerColumnOption("accessorPrint");
      this.registerColumnOption("accessorPrintParams");
      this.registerColumnOption("accessorHtmlOutput");
      this.registerColumnOption("accessorHtmlOutputParams");
    }
    initialize() {
      this.subscribe("column-layout", this.initializeColumn.bind(this));
      this.subscribe("row-data-retrieve", this.transformRow.bind(this));
    }
    //initialize column accessor
    initializeColumn(column) {
      var match = false, config = {};
      this.allowedTypes.forEach((type) => {
        var key = "accessor" + (type.charAt(0).toUpperCase() + type.slice(1)), accessor;
        if (column.definition[key]) {
          accessor = this.lookupAccessor(column.definition[key]);
          if (accessor) {
            match = true;
            config[key] = {
              accessor,
              params: column.definition[key + "Params"] || {}
            };
          }
        }
      });
      if (match) {
        column.modules.accessor = config;
      }
    }
    lookupAccessor(value) {
      var accessor = false;
      switch (typeof value) {
        case "string":
          if (_Accessor.accessors[value]) {
            accessor = _Accessor.accessors[value];
          } else {
            console.warn("Accessor Error - No such accessor found, ignoring: ", value);
          }
          break;
        case "function":
          accessor = value;
          break;
      }
      return accessor;
    }
    //apply accessor to row
    transformRow(row, type) {
      var key = "accessor" + (type.charAt(0).toUpperCase() + type.slice(1)), rowComponent = row.getComponent();
      var data = Helpers.deepClone(row.data || {});
      this.table.columnManager.traverse(function(column) {
        var value, accessor, params, colComponent;
        if (column.modules.accessor) {
          accessor = column.modules.accessor[key] || column.modules.accessor.accessor || false;
          if (accessor) {
            value = column.getFieldValue(data);
            if (value != "undefined") {
              colComponent = column.getComponent();
              params = typeof accessor.params === "function" ? accessor.params(value, data, type, colComponent, rowComponent) : accessor.params;
              column.setFieldValue(data, accessor.accessor(value, data, type, params, colComponent, rowComponent));
            }
          }
        }
      });
      return data;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Ajax/defaults/config.js
  var config_default = {
    method: "GET"
  };

  // node_modules/tabulator-tables/src/js/modules/Ajax/defaults/urlGenerator.js
  function generateParamsList(data, prefix) {
    var output = [];
    prefix = prefix || "";
    if (Array.isArray(data)) {
      data.forEach((item, i) => {
        output = output.concat(generateParamsList(item, prefix ? prefix + "[" + i + "]" : i));
      });
    } else if (typeof data === "object") {
      for (var key in data) {
        output = output.concat(generateParamsList(data[key], prefix ? prefix + "[" + key + "]" : key));
      }
    } else {
      output.push({ key: prefix, value: data });
    }
    return output;
  }
  function serializeParams(params) {
    var output = generateParamsList(params), encoded = [];
    output.forEach(function(item) {
      encoded.push(encodeURIComponent(item.key) + "=" + encodeURIComponent(item.value));
    });
    return encoded.join("&");
  }
  function urlGenerator_default(url, config, params) {
    if (url) {
      if (params && Object.keys(params).length) {
        if (!config.method || config.method.toLowerCase() == "get") {
          config.method = "get";
          url += (url.includes("?") ? "&" : "?") + serializeParams(params);
        }
      }
    }
    return url;
  }

  // node_modules/tabulator-tables/src/js/modules/Ajax/defaults/loaderPromise.js
  function loaderPromise_default(url, config, params) {
    var contentType;
    return new Promise((resolve, reject) => {
      url = this.urlGenerator.call(this.table, url, config, params);
      if (config.method.toUpperCase() != "GET") {
        contentType = typeof this.table.options.ajaxContentType === "object" ? this.table.options.ajaxContentType : this.contentTypeFormatters[this.table.options.ajaxContentType];
        if (contentType) {
          for (var key in contentType.headers) {
            if (!config.headers) {
              config.headers = {};
            }
            if (typeof config.headers[key] === "undefined") {
              config.headers[key] = contentType.headers[key];
            }
          }
          config.body = contentType.body.call(this, url, config, params);
        } else {
          console.warn("Ajax Error - Invalid ajaxContentType value:", this.table.options.ajaxContentType);
        }
      }
      if (url) {
        if (typeof config.headers === "undefined") {
          config.headers = {};
        }
        if (typeof config.headers.Accept === "undefined") {
          config.headers.Accept = "application/json";
        }
        if (typeof config.headers["X-Requested-With"] === "undefined") {
          config.headers["X-Requested-With"] = "XMLHttpRequest";
        }
        if (typeof config.mode === "undefined") {
          config.mode = "cors";
        }
        if (config.mode == "cors") {
          if (typeof config.headers["Origin"] === "undefined") {
            config.headers["Origin"] = window.location.origin;
          }
          if (typeof config.credentials === "undefined") {
            config.credentials = "same-origin";
          }
        } else {
          if (typeof config.credentials === "undefined") {
            config.credentials = "include";
          }
        }
        fetch(url, config).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              resolve(data);
            }).catch((error) => {
              reject(error);
              console.warn("Ajax Load Error - Invalid JSON returned", error);
            });
          } else {
            console.error("Ajax Load Error - Connection Error: " + response.status, response.statusText);
            reject(response);
          }
        }).catch((error) => {
          console.error("Ajax Load Error - Connection Error: ", error);
          reject(error);
        });
      } else {
        console.warn("Ajax Load Error - No URL Set");
        resolve([]);
      }
    });
  }

  // node_modules/tabulator-tables/src/js/modules/Ajax/defaults/contentTypeFormatters.js
  function generateParamsList2(data, prefix) {
    var output = [];
    prefix = prefix || "";
    if (Array.isArray(data)) {
      data.forEach((item, i) => {
        output = output.concat(generateParamsList2(item, prefix ? prefix + "[" + i + "]" : i));
      });
    } else if (typeof data === "object") {
      for (var key in data) {
        output = output.concat(generateParamsList2(data[key], prefix ? prefix + "[" + key + "]" : key));
      }
    } else {
      output.push({ key: prefix, value: data });
    }
    return output;
  }
  var contentTypeFormatters_default = {
    "json": {
      headers: {
        "Content-Type": "application/json"
      },
      body: function(url, config, params) {
        return JSON.stringify(params);
      }
    },
    "form": {
      headers: {},
      body: function(url, config, params) {
        var output = generateParamsList2(params), form = new FormData();
        output.forEach(function(item) {
          form.append(item.key, item.value);
        });
        return form;
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Ajax/Ajax.js
  var Ajax = class _Ajax extends Module {
    static moduleName = "ajax";
    //load defaults
    static defaultConfig = config_default;
    static defaultURLGenerator = urlGenerator_default;
    static defaultLoaderPromise = loaderPromise_default;
    static contentTypeFormatters = contentTypeFormatters_default;
    constructor(table) {
      super(table);
      this.config = {};
      this.url = "";
      this.urlGenerator = false;
      this.params = false;
      this.loaderPromise = false;
      this.registerTableOption("ajaxURL", false);
      this.registerTableOption("ajaxURLGenerator", false);
      this.registerTableOption("ajaxParams", {});
      this.registerTableOption("ajaxConfig", "get");
      this.registerTableOption("ajaxContentType", "form");
      this.registerTableOption("ajaxRequestFunc", false);
      this.registerTableOption("ajaxRequesting", function() {
      });
      this.registerTableOption("ajaxResponse", false);
      this.contentTypeFormatters = _Ajax.contentTypeFormatters;
    }
    //initialize setup options
    initialize() {
      this.loaderPromise = this.table.options.ajaxRequestFunc || _Ajax.defaultLoaderPromise;
      this.urlGenerator = this.table.options.ajaxURLGenerator || _Ajax.defaultURLGenerator;
      if (this.table.options.ajaxURL) {
        this.setUrl(this.table.options.ajaxURL);
      }
      this.setDefaultConfig(this.table.options.ajaxConfig);
      this.registerTableFunction("getAjaxUrl", this.getUrl.bind(this));
      this.subscribe("data-loading", this.requestDataCheck.bind(this));
      this.subscribe("data-params", this.requestParams.bind(this));
      this.subscribe("data-load", this.requestData.bind(this));
    }
    requestParams(data, config, silent, params) {
      var ajaxParams = this.table.options.ajaxParams;
      if (ajaxParams) {
        if (typeof ajaxParams === "function") {
          ajaxParams = ajaxParams.call(this.table);
        }
        params = Object.assign(Object.assign({}, ajaxParams), params);
      }
      return params;
    }
    requestDataCheck(data, params, config, silent) {
      return !!(!data && this.url || typeof data === "string");
    }
    requestData(url, params, config, silent, previousData) {
      var ajaxConfig;
      if (!previousData && this.requestDataCheck(url)) {
        if (url) {
          this.setUrl(url);
        }
        ajaxConfig = this.generateConfig(config);
        return this.sendRequest(this.url, params, ajaxConfig);
      } else {
        return previousData;
      }
    }
    setDefaultConfig(config = {}) {
      this.config = Object.assign({}, _Ajax.defaultConfig);
      if (typeof config == "string") {
        this.config.method = config;
      } else {
        Object.assign(this.config, config);
      }
    }
    //load config object
    generateConfig(config = {}) {
      var ajaxConfig = Object.assign({}, this.config);
      if (typeof config == "string") {
        ajaxConfig.method = config;
      } else {
        Object.assign(ajaxConfig, config);
      }
      return ajaxConfig;
    }
    //set request url
    setUrl(url) {
      this.url = url;
    }
    //get request url
    getUrl() {
      return this.url;
    }
    //send ajax request
    sendRequest(url, params, config) {
      if (this.table.options.ajaxRequesting.call(this.table, url, params) !== false) {
        return this.loaderPromise(url, config, params).then((data) => {
          if (this.table.options.ajaxResponse) {
            data = this.table.options.ajaxResponse.call(this.table, url, params, data);
          }
          return data;
        });
      } else {
        return Promise.reject();
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Clipboard/defaults/pasteActions.js
  var pasteActions_default = {
    replace: function(data) {
      return this.table.setData(data);
    },
    update: function(data) {
      return this.table.updateOrAddData(data);
    },
    insert: function(data) {
      return this.table.addData(data);
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Clipboard/defaults/pasteParsers.js
  var pasteParsers_default = {
    table: function(clipboard) {
      var data = [], headerFindSuccess = true, columns = this.table.columnManager.columns, columnMap = [], rows = [];
      clipboard = clipboard.split("\n");
      clipboard.forEach(function(row) {
        data.push(row.split("	"));
      });
      if (data.length && !(data.length === 1 && data[0].length < 2)) {
        data[0].forEach(function(value) {
          var column = columns.find(function(column2) {
            return value && column2.definition.title && value.trim() && column2.definition.title.trim() === value.trim();
          });
          if (column) {
            columnMap.push(column);
          } else {
            headerFindSuccess = false;
          }
        });
        if (!headerFindSuccess) {
          headerFindSuccess = true;
          columnMap = [];
          data[0].forEach(function(value) {
            var column = columns.find(function(column2) {
              return value && column2.field && value.trim() && column2.field.trim() === value.trim();
            });
            if (column) {
              columnMap.push(column);
            } else {
              headerFindSuccess = false;
            }
          });
          if (!headerFindSuccess) {
            columnMap = this.table.columnManager.columnsByIndex;
          }
        }
        if (headerFindSuccess) {
          data.shift();
        }
        data.forEach(function(item) {
          var row = {};
          item.forEach(function(value, i) {
            if (columnMap[i]) {
              row[columnMap[i].field] = value;
            }
          });
          rows.push(row);
        });
        return rows;
      } else {
        return false;
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Clipboard/extensions/keybindings/bindings.js
  var bindings_default = {
    copyToClipboard: ["ctrl + 67", "meta + 67"]
  };

  // node_modules/tabulator-tables/src/js/modules/Clipboard/extensions/keybindings/actions.js
  var actions_default = {
    copyToClipboard: function(e) {
      if (!this.table.modules.edit.currentCell) {
        if (this.table.modExists("clipboard", true)) {
          this.table.modules.clipboard.copy(false, true);
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Clipboard/extensions/extensions.js
  var extensions_default = {
    keybindings: {
      bindings: bindings_default,
      actions: actions_default
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Clipboard/Clipboard.js
  var Clipboard = class _Clipboard extends Module {
    static moduleName = "clipboard";
    static moduleExtensions = extensions_default;
    //load defaults
    static pasteActions = pasteActions_default;
    static pasteParsers = pasteParsers_default;
    constructor(table) {
      super(table);
      this.mode = true;
      this.pasteParser = function() {
      };
      this.pasteAction = function() {
      };
      this.customSelection = false;
      this.rowRange = false;
      this.blocked = true;
      this.registerTableOption("clipboard", false);
      this.registerTableOption("clipboardCopyStyled", true);
      this.registerTableOption("clipboardCopyConfig", false);
      this.registerTableOption("clipboardCopyFormatter", false);
      this.registerTableOption("clipboardCopyRowRange", "active");
      this.registerTableOption("clipboardPasteParser", "table");
      this.registerTableOption("clipboardPasteAction", "insert");
      this.registerColumnOption("clipboard");
      this.registerColumnOption("titleClipboard");
    }
    initialize() {
      this.mode = this.table.options.clipboard;
      this.rowRange = this.table.options.clipboardCopyRowRange;
      if (this.mode === true || this.mode === "copy") {
        this.table.element.addEventListener("copy", (e) => {
          var plain, html, list;
          if (!this.blocked) {
            e.preventDefault();
            if (this.customSelection) {
              plain = this.customSelection;
              if (this.table.options.clipboardCopyFormatter) {
                plain = this.table.options.clipboardCopyFormatter("plain", plain);
              }
            } else {
              list = this.table.modules.export.generateExportList(this.table.options.clipboardCopyConfig, this.table.options.clipboardCopyStyled, this.rowRange, "clipboard");
              html = this.table.modules.export.generateHTMLTable(list);
              plain = html ? this.generatePlainContent(list) : "";
              if (this.table.options.clipboardCopyFormatter) {
                plain = this.table.options.clipboardCopyFormatter("plain", plain);
                html = this.table.options.clipboardCopyFormatter("html", html);
              }
            }
            if (window.clipboardData && window.clipboardData.setData) {
              window.clipboardData.setData("Text", plain);
            } else if (e.clipboardData && e.clipboardData.setData) {
              e.clipboardData.setData("text/plain", plain);
              if (html) {
                e.clipboardData.setData("text/html", html);
              }
            } else if (e.originalEvent && e.originalEvent.clipboardData.setData) {
              e.originalEvent.clipboardData.setData("text/plain", plain);
              if (html) {
                e.originalEvent.clipboardData.setData("text/html", html);
              }
            }
            this.dispatchExternal("clipboardCopied", plain, html);
            this.reset();
          }
        });
      }
      if (this.mode === true || this.mode === "paste") {
        this.table.element.addEventListener("paste", (e) => {
          this.paste(e);
        });
      }
      this.setPasteParser(this.table.options.clipboardPasteParser);
      this.setPasteAction(this.table.options.clipboardPasteAction);
      this.registerTableFunction("copyToClipboard", this.copy.bind(this));
    }
    reset() {
      this.blocked = true;
      this.customSelection = false;
    }
    generatePlainContent(list) {
      var output = [];
      list.forEach((row) => {
        var rowData = [];
        row.columns.forEach((col) => {
          var value = "";
          if (col) {
            if (row.type === "group") {
              col.value = col.component.getKey();
            }
            if (col.value === null) {
              value = "";
            } else {
              switch (typeof col.value) {
                case "object":
                  value = JSON.stringify(col.value);
                  break;
                case "undefined":
                  value = "";
                  break;
                default:
                  value = col.value;
              }
            }
          }
          rowData.push(value);
        });
        output.push(rowData.join("	"));
      });
      return output.join("\n");
    }
    copy(range, internal) {
      var sel, textRange;
      this.blocked = false;
      this.customSelection = false;
      if (this.mode === true || this.mode === "copy") {
        this.rowRange = range || this.table.options.clipboardCopyRowRange;
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
          range = document.createRange();
          range.selectNodeContents(this.table.element);
          sel = window.getSelection();
          if (sel.toString() && internal) {
            this.customSelection = sel.toString();
          }
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
          textRange = document.body.createTextRange();
          textRange.moveToElementText(this.table.element);
          textRange.select();
        }
        document.execCommand("copy");
        if (sel) {
          sel.removeAllRanges();
        }
      }
    }
    //PASTE EVENT HANDLING
    setPasteAction(action) {
      switch (typeof action) {
        case "string":
          this.pasteAction = _Clipboard.pasteActions[action];
          if (!this.pasteAction) {
            console.warn("Clipboard Error - No such paste action found:", action);
          }
          break;
        case "function":
          this.pasteAction = action;
          break;
      }
    }
    setPasteParser(parser) {
      switch (typeof parser) {
        case "string":
          this.pasteParser = _Clipboard.pasteParsers[parser];
          if (!this.pasteParser) {
            console.warn("Clipboard Error - No such paste parser found:", parser);
          }
          break;
        case "function":
          this.pasteParser = parser;
          break;
      }
    }
    paste(e) {
      var data, rowData, rows;
      if (this.checkPasteOrigin(e)) {
        data = this.getPasteData(e);
        rowData = this.pasteParser.call(this, data);
        if (rowData) {
          e.preventDefault();
          if (this.table.modExists("mutator")) {
            rowData = this.mutateData(rowData);
          }
          rows = this.pasteAction.call(this, rowData);
          this.dispatchExternal("clipboardPasted", data, rowData, rows);
        } else {
          this.dispatchExternal("clipboardPasteError", data);
        }
      }
    }
    mutateData(data) {
      var output = [];
      if (Array.isArray(data)) {
        data.forEach((row) => {
          output.push(this.table.modules.mutator.transformRow(row, "clipboard"));
        });
      } else {
        output = data;
      }
      return output;
    }
    checkPasteOrigin(e) {
      var valid = true;
      var blocked = this.confirm("clipboard-paste", [e]);
      if (blocked || !["DIV", "SPAN"].includes(e.target.tagName)) {
        valid = false;
      }
      return valid;
    }
    getPasteData(e) {
      var data;
      if (window.clipboardData && window.clipboardData.getData) {
        data = window.clipboardData.getData("Text");
      } else if (e.clipboardData && e.clipboardData.getData) {
        data = e.clipboardData.getData("text/plain");
      } else if (e.originalEvent && e.originalEvent.clipboardData.getData) {
        data = e.originalEvent.clipboardData.getData("text/plain");
      }
      return data;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/ColumnCalcs/CalcComponent.js
  var CalcComponent = class {
    constructor(row) {
      this._row = row;
      return new Proxy(this, {
        get: function(target, name, receiver) {
          if (typeof target[name] !== "undefined") {
            return target[name];
          } else {
            return target._row.table.componentFunctionBinder.handle("row", target._row, name);
          }
        }
      });
    }
    getData(transform) {
      return this._row.getData(transform);
    }
    getElement() {
      return this._row.getElement();
    }
    getTable() {
      return this._row.table;
    }
    getCells() {
      var cells = [];
      this._row.getCells().forEach(function(cell) {
        cells.push(cell.getComponent());
      });
      return cells;
    }
    getCell(column) {
      var cell = this._row.getCell(column);
      return cell ? cell.getComponent() : false;
    }
    _getSelf() {
      return this._row;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/ColumnCalcs/defaults/calculations.js
  var calculations_default = {
    "avg": function(values, data, calcParams) {
      var output = 0, precision = typeof calcParams.precision !== "undefined" ? calcParams.precision : 2;
      if (values.length) {
        output = values.reduce(function(sum, value) {
          return Number(sum) + Number(value);
        });
        output = output / values.length;
        output = precision !== false ? output.toFixed(precision) : output;
      }
      return parseFloat(output).toString();
    },
    "max": function(values, data, calcParams) {
      var output = null, precision = typeof calcParams.precision !== "undefined" ? calcParams.precision : false;
      values.forEach(function(value) {
        value = Number(value);
        if (value > output || output === null) {
          output = value;
        }
      });
      return output !== null ? precision !== false ? output.toFixed(precision) : output : "";
    },
    "min": function(values, data, calcParams) {
      var output = null, precision = typeof calcParams.precision !== "undefined" ? calcParams.precision : false;
      values.forEach(function(value) {
        value = Number(value);
        if (value < output || output === null) {
          output = value;
        }
      });
      return output !== null ? precision !== false ? output.toFixed(precision) : output : "";
    },
    "sum": function(values, data, calcParams) {
      var output = 0, precision = typeof calcParams.precision !== "undefined" ? calcParams.precision : false;
      if (values.length) {
        values.forEach(function(value) {
          value = Number(value);
          output += !isNaN(value) ? Number(value) : 0;
        });
      }
      return precision !== false ? output.toFixed(precision) : output;
    },
    "concat": function(values, data, calcParams) {
      var output = 0;
      if (values.length) {
        output = values.reduce(function(sum, value) {
          return String(sum) + String(value);
        });
      }
      return output;
    },
    "count": function(values, data, calcParams) {
      var output = 0;
      if (values.length) {
        values.forEach(function(value) {
          if (value) {
            output++;
          }
        });
      }
      return output;
    },
    "unique": function(values, data, calcParams) {
      var unique = values.filter((value, index) => {
        return (values || value === 0) && values.indexOf(value) === index;
      });
      return unique.length;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/ColumnCalcs/ColumnCalcs.js
  var ColumnCalcs = class _ColumnCalcs extends Module {
    static moduleName = "columnCalcs";
    //load defaults
    static calculations = calculations_default;
    constructor(table) {
      super(table);
      this.topCalcs = [];
      this.botCalcs = [];
      this.genColumn = false;
      this.topElement = this.createElement();
      this.botElement = this.createElement();
      this.topRow = false;
      this.botRow = false;
      this.topInitialized = false;
      this.botInitialized = false;
      this.blocked = false;
      this.recalcAfterBlock = false;
      this.registerTableOption("columnCalcs", true);
      this.registerColumnOption("topCalc");
      this.registerColumnOption("topCalcParams");
      this.registerColumnOption("topCalcFormatter");
      this.registerColumnOption("topCalcFormatterParams");
      this.registerColumnOption("bottomCalc");
      this.registerColumnOption("bottomCalcParams");
      this.registerColumnOption("bottomCalcFormatter");
      this.registerColumnOption("bottomCalcFormatterParams");
    }
    createElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-calcs-holder");
      return el;
    }
    initialize() {
      this.genColumn = new Column({ field: "value" }, this);
      this.subscribe("cell-value-changed", this.cellValueChanged.bind(this));
      this.subscribe("column-init", this.initializeColumnCheck.bind(this));
      this.subscribe("row-deleted", this.rowsUpdated.bind(this));
      this.subscribe("scroll-horizontal", this.scrollHorizontal.bind(this));
      this.subscribe("row-added", this.rowsUpdated.bind(this));
      this.subscribe("column-moved", this.recalcActiveRows.bind(this));
      this.subscribe("column-add", this.recalcActiveRows.bind(this));
      this.subscribe("data-refreshed", this.recalcActiveRowsRefresh.bind(this));
      this.subscribe("table-redraw", this.tableRedraw.bind(this));
      this.subscribe("rows-visible", this.visibleRows.bind(this));
      this.subscribe("scrollbar-vertical", this.adjustForScrollbar.bind(this));
      this.subscribe("redraw-blocked", this.blockRedraw.bind(this));
      this.subscribe("redraw-restored", this.restoreRedraw.bind(this));
      this.subscribe("table-redrawing", this.resizeHolderWidth.bind(this));
      this.subscribe("column-resized", this.resizeHolderWidth.bind(this));
      this.subscribe("column-show", this.resizeHolderWidth.bind(this));
      this.subscribe("column-hide", this.resizeHolderWidth.bind(this));
      this.registerTableFunction("getCalcResults", this.getResults.bind(this));
      this.registerTableFunction("recalc", this.userRecalc.bind(this));
      this.resizeHolderWidth();
    }
    resizeHolderWidth() {
      this.topElement.style.minWidth = this.table.columnManager.headersElement.offsetWidth + "px";
    }
    tableRedraw(force) {
      this.recalc(this.table.rowManager.activeRows);
      if (force) {
        this.redraw();
      }
    }
    blockRedraw() {
      this.blocked = true;
      this.recalcAfterBlock = false;
    }
    restoreRedraw() {
      this.blocked = false;
      if (this.recalcAfterBlock) {
        this.recalcAfterBlock = false;
        this.recalcActiveRowsRefresh();
      }
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    userRecalc() {
      this.recalc(this.table.rowManager.activeRows);
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    blockCheck() {
      if (this.blocked) {
        this.recalcAfterBlock = true;
      }
      return this.blocked;
    }
    visibleRows(viewable, rows) {
      if (this.topRow) {
        rows.unshift(this.topRow);
      }
      if (this.botRow) {
        rows.push(this.botRow);
      }
      return rows;
    }
    rowsUpdated(row) {
      if (this.table.options.groupBy) {
        this.recalcRowGroup(row);
      } else {
        this.recalcActiveRows();
      }
    }
    recalcActiveRowsRefresh() {
      if (this.table.options.groupBy && this.table.options.dataTreeStartExpanded && this.table.options.dataTree) {
        this.recalcAll();
      } else {
        this.recalcActiveRows();
      }
    }
    recalcActiveRows() {
      this.recalc(this.table.rowManager.activeRows);
    }
    cellValueChanged(cell) {
      if (cell.column.definition.topCalc || cell.column.definition.bottomCalc) {
        if (this.table.options.groupBy) {
          if (this.table.options.columnCalcs == "table" || this.table.options.columnCalcs == "both") {
            this.recalcActiveRows();
          }
          if (this.table.options.columnCalcs != "table") {
            this.recalcRowGroup(cell.row);
          }
        } else {
          this.recalcActiveRows();
        }
      }
    }
    initializeColumnCheck(column) {
      if (column.definition.topCalc || column.definition.bottomCalc) {
        this.initializeColumn(column);
      }
    }
    //initialize column calcs
    initializeColumn(column) {
      var def = column.definition;
      var config = {
        topCalcParams: def.topCalcParams || {},
        botCalcParams: def.bottomCalcParams || {}
      };
      if (def.topCalc) {
        switch (typeof def.topCalc) {
          case "string":
            if (_ColumnCalcs.calculations[def.topCalc]) {
              config.topCalc = _ColumnCalcs.calculations[def.topCalc];
            } else {
              console.warn("Column Calc Error - No such calculation found, ignoring: ", def.topCalc);
            }
            break;
          case "function":
            config.topCalc = def.topCalc;
            break;
        }
        if (config.topCalc) {
          column.modules.columnCalcs = config;
          this.topCalcs.push(column);
          if (this.table.options.columnCalcs != "group") {
            this.initializeTopRow();
          }
        }
      }
      if (def.bottomCalc) {
        switch (typeof def.bottomCalc) {
          case "string":
            if (_ColumnCalcs.calculations[def.bottomCalc]) {
              config.botCalc = _ColumnCalcs.calculations[def.bottomCalc];
            } else {
              console.warn("Column Calc Error - No such calculation found, ignoring: ", def.bottomCalc);
            }
            break;
          case "function":
            config.botCalc = def.bottomCalc;
            break;
        }
        if (config.botCalc) {
          column.modules.columnCalcs = config;
          this.botCalcs.push(column);
          if (this.table.options.columnCalcs != "group") {
            this.initializeBottomRow();
          }
        }
      }
    }
    //dummy functions to handle being mock column manager
    registerColumnField() {
    }
    removeCalcs() {
      var changed = false;
      if (this.topInitialized) {
        this.topInitialized = false;
        this.topElement.parentNode.removeChild(this.topElement);
        changed = true;
      }
      if (this.botInitialized) {
        this.botInitialized = false;
        this.footerRemove(this.botElement);
        changed = true;
      }
      if (changed) {
        this.table.rowManager.adjustTableSize();
      }
    }
    reinitializeCalcs() {
      if (this.topCalcs.length) {
        this.initializeTopRow();
      }
      if (this.botCalcs.length) {
        this.initializeBottomRow();
      }
    }
    initializeTopRow() {
      var fragment = document.createDocumentFragment();
      if (!this.topInitialized) {
        fragment.appendChild(document.createElement("br"));
        fragment.appendChild(this.topElement);
        this.table.columnManager.getContentsElement().insertBefore(fragment, this.table.columnManager.headersElement.nextSibling);
        this.topInitialized = true;
      }
    }
    initializeBottomRow() {
      if (!this.botInitialized) {
        this.footerPrepend(this.botElement);
        this.botInitialized = true;
      }
    }
    scrollHorizontal(left) {
      if (this.botInitialized && this.botRow) {
        this.botElement.scrollLeft = left;
      }
    }
    recalc(rows) {
      var data, row;
      if (!this.blockCheck()) {
        if (this.topInitialized || this.botInitialized) {
          data = this.rowsToData(rows);
          if (this.topInitialized) {
            if (this.topRow) {
              this.topRow.deleteCells();
            }
            row = this.generateRow("top", data);
            this.topRow = row;
            while (this.topElement.firstChild) this.topElement.removeChild(this.topElement.firstChild);
            this.topElement.appendChild(row.getElement());
            row.initialize(true);
          }
          if (this.botInitialized) {
            if (this.botRow) {
              this.botRow.deleteCells();
            }
            row = this.generateRow("bottom", data);
            this.botRow = row;
            while (this.botElement.firstChild) this.botElement.removeChild(this.botElement.firstChild);
            this.botElement.appendChild(row.getElement());
            row.initialize(true);
          }
          this.table.rowManager.adjustTableSize();
          if (this.table.modExists("frozenColumns")) {
            this.table.modules.frozenColumns.layout();
          }
        }
      }
    }
    recalcRowGroup(row) {
      this.recalcGroup(this.table.modules.groupRows.getRowGroup(row));
    }
    recalcAll() {
      if (this.topCalcs.length || this.botCalcs.length) {
        if (this.table.options.columnCalcs !== "group") {
          this.recalcActiveRows();
        }
        if (this.table.options.groupBy && this.table.options.columnCalcs !== "table") {
          var groups = this.table.modules.groupRows.getChildGroups();
          groups.forEach((group) => {
            this.recalcGroup(group);
          });
        }
      }
    }
    recalcGroup(group) {
      var data, rowData;
      if (!this.blockCheck()) {
        if (group) {
          if (group.calcs) {
            if (group.calcs.bottom) {
              data = this.rowsToData(group.rows);
              rowData = this.generateRowData("bottom", data);
              group.calcs.bottom.updateData(rowData);
              group.calcs.bottom.reinitialize();
            }
            if (group.calcs.top) {
              data = this.rowsToData(group.rows);
              rowData = this.generateRowData("top", data);
              group.calcs.top.updateData(rowData);
              group.calcs.top.reinitialize();
            }
          }
        }
      }
    }
    //generate top stats row
    generateTopRow(rows) {
      return this.generateRow("top", this.rowsToData(rows));
    }
    //generate bottom stats row
    generateBottomRow(rows) {
      return this.generateRow("bottom", this.rowsToData(rows));
    }
    rowsToData(rows) {
      var data = [], hasDataTreeColumnCalcs = this.table.options.dataTree && this.table.options.dataTreeChildColumnCalcs, dataTree = this.table.modules.dataTree;
      rows.forEach((row) => {
        data.push(row.getData());
        if (hasDataTreeColumnCalcs && row.modules.dataTree?.open) {
          this.rowsToData(dataTree.getFilteredTreeChildren(row)).forEach((dataRow) => {
            data.push(row);
          });
        }
      });
      return data;
    }
    //generate stats row
    generateRow(pos, data) {
      var rowData = this.generateRowData(pos, data), row;
      if (this.table.modExists("mutator")) {
        this.table.modules.mutator.disable();
      }
      row = new Row(rowData, this, "calc");
      if (this.table.modExists("mutator")) {
        this.table.modules.mutator.enable();
      }
      row.getElement().classList.add("tabulator-calcs", "tabulator-calcs-" + pos);
      row.component = false;
      row.getComponent = () => {
        if (!row.component) {
          row.component = new CalcComponent(row);
        }
        return row.component;
      };
      row.generateCells = () => {
        var cells = [];
        this.table.columnManager.columnsByIndex.forEach((column) => {
          this.genColumn.setField(column.getField());
          this.genColumn.hozAlign = column.hozAlign;
          if (column.definition[pos + "CalcFormatter"] && this.table.modExists("format")) {
            this.genColumn.modules.format = {
              formatter: this.table.modules.format.getFormatter(column.definition[pos + "CalcFormatter"]),
              params: column.definition[pos + "CalcFormatterParams"] || {}
            };
          } else {
            this.genColumn.modules.format = {
              formatter: this.table.modules.format.getFormatter("plaintext"),
              params: {}
            };
          }
          this.genColumn.definition.cssClass = column.definition.cssClass;
          var cell = new Cell(this.genColumn, row);
          cell.getElement();
          cell.column = column;
          cell.setWidth();
          column.cells.push(cell);
          cells.push(cell);
          if (!column.visible) {
            cell.hide();
          }
        });
        row.cells = cells;
      };
      return row;
    }
    //generate stats row
    generateRowData(pos, data) {
      var rowData = {}, calcs = pos == "top" ? this.topCalcs : this.botCalcs, type = pos == "top" ? "topCalc" : "botCalc", params, paramKey;
      calcs.forEach(function(column) {
        var values = [];
        if (column.modules.columnCalcs && column.modules.columnCalcs[type]) {
          data.forEach(function(item) {
            values.push(column.getFieldValue(item));
          });
          paramKey = type + "Params";
          params = typeof column.modules.columnCalcs[paramKey] === "function" ? column.modules.columnCalcs[paramKey](values, data) : column.modules.columnCalcs[paramKey];
          column.setFieldValue(rowData, column.modules.columnCalcs[type](values, data, params));
        }
      });
      return rowData;
    }
    hasTopCalcs() {
      return !!this.topCalcs.length;
    }
    hasBottomCalcs() {
      return !!this.botCalcs.length;
    }
    //handle table redraw
    redraw() {
      if (this.topRow) {
        this.topRow.normalizeHeight(true);
      }
      if (this.botRow) {
        this.botRow.normalizeHeight(true);
      }
    }
    //return the calculated
    getResults() {
      var results = {}, groups;
      if (this.table.options.groupBy && this.table.modExists("groupRows")) {
        groups = this.table.modules.groupRows.getGroups(true);
        groups.forEach((group) => {
          results[group.getKey()] = this.getGroupResults(group);
        });
      } else {
        results = {
          top: this.topRow ? this.topRow.getData() : {},
          bottom: this.botRow ? this.botRow.getData() : {}
        };
      }
      return results;
    }
    //get results from a group
    getGroupResults(group) {
      var groupObj = group._getSelf(), subGroups = group.getSubGroups(), subGroupResults = {}, results = {};
      subGroups.forEach((subgroup) => {
        subGroupResults[subgroup.getKey()] = this.getGroupResults(subgroup);
      });
      results = {
        top: groupObj.calcs.top ? groupObj.calcs.top.getData() : {},
        bottom: groupObj.calcs.bottom ? groupObj.calcs.bottom.getData() : {},
        groups: subGroupResults
      };
      return results;
    }
    adjustForScrollbar(width) {
      if (this.botRow) {
        if (this.table.rtl) {
          this.botElement.style.paddingLeft = width + "px";
        } else {
          this.botElement.style.paddingRight = width + "px";
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/DataTree/DataTree.js
  var DataTree = class extends Module {
    static moduleName = "dataTree";
    constructor(table) {
      super(table);
      this.indent = 10;
      this.field = "";
      this.collapseEl = null;
      this.expandEl = null;
      this.branchEl = null;
      this.elementField = false;
      this.startOpen = function() {
      };
      this.registerTableOption("dataTree", false);
      this.registerTableOption("dataTreeFilter", true);
      this.registerTableOption("dataTreeSort", true);
      this.registerTableOption("dataTreeElementColumn", false);
      this.registerTableOption("dataTreeBranchElement", true);
      this.registerTableOption("dataTreeChildIndent", 9);
      this.registerTableOption("dataTreeChildField", "_children");
      this.registerTableOption("dataTreeCollapseElement", false);
      this.registerTableOption("dataTreeExpandElement", false);
      this.registerTableOption("dataTreeStartExpanded", false);
      this.registerTableOption("dataTreeChildColumnCalcs", false);
      this.registerTableOption("dataTreeSelectPropagate", false);
      this.registerComponentFunction("row", "treeCollapse", this.collapseRow.bind(this));
      this.registerComponentFunction("row", "treeExpand", this.expandRow.bind(this));
      this.registerComponentFunction("row", "treeToggle", this.toggleRow.bind(this));
      this.registerComponentFunction("row", "getTreeParent", this.getTreeParent.bind(this));
      this.registerComponentFunction("row", "getTreeChildren", this.getRowChildren.bind(this));
      this.registerComponentFunction("row", "addTreeChild", this.addTreeChildRow.bind(this));
      this.registerComponentFunction("row", "isTreeExpanded", this.isRowExpanded.bind(this));
    }
    initialize() {
      if (this.table.options.dataTree) {
        var dummyEl = null, options = this.table.options;
        this.field = options.dataTreeChildField;
        this.indent = options.dataTreeChildIndent;
        if (this.options("movableRows")) {
          console.warn("The movableRows option is not available with dataTree enabled, moving of child rows could result in unpredictable behavior");
        }
        if (options.dataTreeBranchElement) {
          if (options.dataTreeBranchElement === true) {
            this.branchEl = document.createElement("div");
            this.branchEl.classList.add("tabulator-data-tree-branch");
          } else {
            if (typeof options.dataTreeBranchElement === "string") {
              dummyEl = document.createElement("div");
              dummyEl.innerHTML = options.dataTreeBranchElement;
              this.branchEl = dummyEl.firstChild;
            } else {
              this.branchEl = options.dataTreeBranchElement;
            }
          }
        } else {
          this.branchEl = document.createElement("div");
          this.branchEl.classList.add("tabulator-data-tree-branch-empty");
        }
        if (options.dataTreeCollapseElement) {
          if (typeof options.dataTreeCollapseElement === "string") {
            dummyEl = document.createElement("div");
            dummyEl.innerHTML = options.dataTreeCollapseElement;
            this.collapseEl = dummyEl.firstChild;
          } else {
            this.collapseEl = options.dataTreeCollapseElement;
          }
        } else {
          this.collapseEl = document.createElement("div");
          this.collapseEl.classList.add("tabulator-data-tree-control");
          this.collapseEl.tabIndex = 0;
          this.collapseEl.innerHTML = "<div class='tabulator-data-tree-control-collapse'></div>";
        }
        if (options.dataTreeExpandElement) {
          if (typeof options.dataTreeExpandElement === "string") {
            dummyEl = document.createElement("div");
            dummyEl.innerHTML = options.dataTreeExpandElement;
            this.expandEl = dummyEl.firstChild;
          } else {
            this.expandEl = options.dataTreeExpandElement;
          }
        } else {
          this.expandEl = document.createElement("div");
          this.expandEl.classList.add("tabulator-data-tree-control");
          this.expandEl.tabIndex = 0;
          this.expandEl.innerHTML = "<div class='tabulator-data-tree-control-expand'></div>";
        }
        switch (typeof options.dataTreeStartExpanded) {
          case "boolean":
            this.startOpen = function(row, index) {
              return options.dataTreeStartExpanded;
            };
            break;
          case "function":
            this.startOpen = options.dataTreeStartExpanded;
            break;
          default:
            this.startOpen = function(row, index) {
              return options.dataTreeStartExpanded[index];
            };
            break;
        }
        this.subscribe("row-init", this.initializeRow.bind(this));
        this.subscribe("row-layout-after", this.layoutRow.bind(this));
        this.subscribe("row-deleted", this.rowDelete.bind(this), 0);
        this.subscribe("row-data-changed", this.rowDataChanged.bind(this), 10);
        this.subscribe("cell-value-updated", this.cellValueChanged.bind(this));
        this.subscribe("edit-cancelled", this.cellValueChanged.bind(this));
        this.subscribe("column-moving-rows", this.columnMoving.bind(this));
        this.subscribe("table-built", this.initializeElementField.bind(this));
        this.subscribe("table-redrawing", this.tableRedrawing.bind(this));
        this.registerDisplayHandler(this.getRows.bind(this), 30);
      }
    }
    tableRedrawing(force) {
      var rows;
      if (force) {
        rows = this.table.rowManager.getRows();
        rows.forEach((row) => {
          this.reinitializeRowChildren(row);
        });
      }
    }
    initializeElementField() {
      var firstCol = this.table.columnManager.getFirstVisibleColumn();
      this.elementField = this.table.options.dataTreeElementColumn || (firstCol ? firstCol.field : false);
    }
    getRowChildren(row) {
      return this.getTreeChildren(row, true);
    }
    columnMoving() {
      var rows = [];
      this.table.rowManager.rows.forEach((row) => {
        rows = rows.concat(this.getTreeChildren(row, false, true));
      });
      return rows;
    }
    rowDataChanged(row, visible, updatedData) {
      if (this.redrawNeeded(updatedData)) {
        this.initializeRow(row);
        if (visible) {
          this.layoutRow(row);
          this.refreshData(true);
        }
      }
    }
    cellValueChanged(cell) {
      var field = cell.column.getField();
      if (field === this.elementField) {
        this.layoutRow(cell.row);
      }
    }
    initializeRow(row) {
      var childArray = row.getData()[this.field];
      var isArray = Array.isArray(childArray);
      var children = isArray || !isArray && typeof childArray === "object" && childArray !== null;
      if (!children && row.modules.dataTree && row.modules.dataTree.branchEl) {
        row.modules.dataTree.branchEl.parentNode.removeChild(row.modules.dataTree.branchEl);
      }
      if (!children && row.modules.dataTree && row.modules.dataTree.controlEl) {
        row.modules.dataTree.controlEl.parentNode.removeChild(row.modules.dataTree.controlEl);
      }
      row.modules.dataTree = {
        index: row.modules.dataTree ? row.modules.dataTree.index : 0,
        open: children ? row.modules.dataTree ? row.modules.dataTree.open : this.startOpen(row.getComponent(), 0) : false,
        controlEl: row.modules.dataTree && children ? row.modules.dataTree.controlEl : false,
        branchEl: row.modules.dataTree && children ? row.modules.dataTree.branchEl : false,
        parent: row.modules.dataTree ? row.modules.dataTree.parent : false,
        children
      };
    }
    reinitializeRowChildren(row) {
      var children = this.getTreeChildren(row, false, true);
      children.forEach(function(child) {
        child.reinitialize(true);
      });
    }
    layoutRow(row) {
      var cell = this.elementField ? row.getCell(this.elementField) : row.getCells()[0], el = cell.getElement(), config = row.modules.dataTree;
      if (config.branchEl) {
        if (config.branchEl.parentNode) {
          config.branchEl.parentNode.removeChild(config.branchEl);
        }
        config.branchEl = false;
      }
      if (config.controlEl) {
        if (config.controlEl.parentNode) {
          config.controlEl.parentNode.removeChild(config.controlEl);
        }
        config.controlEl = false;
      }
      this.generateControlElement(row, el);
      row.getElement().classList.add("tabulator-tree-level-" + config.index);
      if (config.index) {
        if (this.branchEl) {
          config.branchEl = this.branchEl.cloneNode(true);
          el.insertBefore(config.branchEl, el.firstChild);
          if (this.table.rtl) {
            config.branchEl.style.marginRight = (config.branchEl.offsetWidth + config.branchEl.style.marginLeft) * (config.index - 1) + config.index * this.indent + "px";
          } else {
            config.branchEl.style.marginLeft = (config.branchEl.offsetWidth + config.branchEl.style.marginRight) * (config.index - 1) + config.index * this.indent + "px";
          }
        } else {
          if (this.table.rtl) {
            el.style.paddingRight = parseInt(window.getComputedStyle(el, null).getPropertyValue("padding-right")) + config.index * this.indent + "px";
          } else {
            el.style.paddingLeft = parseInt(window.getComputedStyle(el, null).getPropertyValue("padding-left")) + config.index * this.indent + "px";
          }
        }
      }
    }
    generateControlElement(row, el) {
      var config = row.modules.dataTree, oldControl = config.controlEl;
      el = el || row.getCells()[0].getElement();
      if (config.children !== false) {
        if (config.open) {
          config.controlEl = this.collapseEl.cloneNode(true);
          config.controlEl.addEventListener("click", (e) => {
            e.stopPropagation();
            this.collapseRow(row);
          });
        } else {
          config.controlEl = this.expandEl.cloneNode(true);
          config.controlEl.addEventListener("click", (e) => {
            e.stopPropagation();
            this.expandRow(row);
          });
        }
        config.controlEl.addEventListener("mousedown", (e) => {
          e.stopPropagation();
        });
        if (oldControl && oldControl.parentNode === el) {
          oldControl.parentNode.replaceChild(config.controlEl, oldControl);
        } else {
          el.insertBefore(config.controlEl, el.firstChild);
        }
      }
    }
    getRows(rows) {
      var output = [];
      rows.forEach((row, i) => {
        var config, children;
        output.push(row);
        if (row instanceof Row) {
          row.create();
          config = row.modules.dataTree;
          if (!config.index && config.children !== false) {
            children = this.getChildren(row, false, true);
            children.forEach((child) => {
              child.create();
              output.push(child);
            });
          }
        }
      });
      return output;
    }
    getChildren(row, allChildren, sortOnly) {
      var config = row.modules.dataTree, children = [], output = [];
      if (config.children !== false && (config.open || allChildren)) {
        if (!Array.isArray(config.children)) {
          config.children = this.generateChildren(row);
        }
        if (this.table.modExists("filter") && this.table.options.dataTreeFilter) {
          children = this.table.modules.filter.filter(config.children);
        } else {
          children = config.children;
        }
        if (this.table.modExists("sort") && this.table.options.dataTreeSort) {
          this.table.modules.sort.sort(children, sortOnly);
        }
        children.forEach((child) => {
          output.push(child);
          var subChildren = this.getChildren(child, false, true);
          subChildren.forEach((sub) => {
            output.push(sub);
          });
        });
      }
      return output;
    }
    generateChildren(row) {
      var children = [];
      var childArray = row.getData()[this.field];
      if (!Array.isArray(childArray)) {
        childArray = [childArray];
      }
      childArray.forEach((childData) => {
        var childRow = new Row(childData || {}, this.table.rowManager);
        childRow.create();
        childRow.modules.dataTree.index = row.modules.dataTree.index + 1;
        childRow.modules.dataTree.parent = row;
        if (childRow.modules.dataTree.children) {
          childRow.modules.dataTree.open = this.startOpen(childRow.getComponent(), childRow.modules.dataTree.index);
        }
        children.push(childRow);
      });
      return children;
    }
    expandRow(row, silent) {
      var config = row.modules.dataTree;
      if (config.children !== false) {
        config.open = true;
        row.reinitialize();
        this.refreshData(true);
        this.dispatchExternal("dataTreeRowExpanded", row.getComponent(), row.modules.dataTree.index);
      }
    }
    collapseRow(row) {
      var config = row.modules.dataTree;
      if (config.children !== false) {
        config.open = false;
        row.reinitialize();
        this.refreshData(true);
        this.dispatchExternal("dataTreeRowCollapsed", row.getComponent(), row.modules.dataTree.index);
      }
    }
    toggleRow(row) {
      var config = row.modules.dataTree;
      if (config.children !== false) {
        if (config.open) {
          this.collapseRow(row);
        } else {
          this.expandRow(row);
        }
      }
    }
    isRowExpanded(row) {
      return row.modules.dataTree.open;
    }
    getTreeParent(row) {
      return row.modules.dataTree.parent ? row.modules.dataTree.parent.getComponent() : false;
    }
    getTreeParentRoot(row) {
      return row.modules.dataTree && row.modules.dataTree.parent ? this.getTreeParentRoot(row.modules.dataTree.parent) : row;
    }
    getFilteredTreeChildren(row) {
      var config = row.modules.dataTree, output = [], children;
      if (config.children) {
        if (!Array.isArray(config.children)) {
          config.children = this.generateChildren(row);
        }
        if (this.table.modExists("filter") && this.table.options.dataTreeFilter) {
          children = this.table.modules.filter.filter(config.children);
        } else {
          children = config.children;
        }
        children.forEach((childRow) => {
          if (childRow instanceof Row) {
            output.push(childRow);
          }
        });
      }
      return output;
    }
    rowDelete(row) {
      var parent = row.modules.dataTree.parent, childIndex;
      if (parent) {
        childIndex = this.findChildIndex(row, parent);
        if (childIndex !== false) {
          parent.data[this.field].splice(childIndex, 1);
        }
        if (!parent.data[this.field].length) {
          delete parent.data[this.field];
        }
        this.initializeRow(parent);
        this.layoutRow(parent);
      }
      this.refreshData(true);
    }
    addTreeChildRow(row, data, top, index) {
      var childIndex = false;
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      if (!Array.isArray(row.data[this.field])) {
        row.data[this.field] = [];
        row.modules.dataTree.open = this.startOpen(row.getComponent(), row.modules.dataTree.index);
      }
      if (typeof index !== "undefined") {
        childIndex = this.findChildIndex(index, row);
        if (childIndex !== false) {
          row.data[this.field].splice(top ? childIndex : childIndex + 1, 0, data);
        }
      }
      if (childIndex === false) {
        if (top) {
          row.data[this.field].unshift(data);
        } else {
          row.data[this.field].push(data);
        }
      }
      this.initializeRow(row);
      this.layoutRow(row);
      this.refreshData(true);
    }
    findChildIndex(subject, parent) {
      var match = false;
      if (typeof subject == "object") {
        if (subject instanceof Row) {
          match = subject.data;
        } else if (subject instanceof RowComponent) {
          match = subject._getSelf().data;
        } else if (typeof HTMLElement !== "undefined" && subject instanceof HTMLElement) {
          if (parent.modules.dataTree) {
            match = parent.modules.dataTree.children.find((childRow) => {
              return childRow instanceof Row ? childRow.element === subject : false;
            });
            if (match) {
              match = match.data;
            }
          }
        } else if (subject === null) {
          match = false;
        }
      } else if (typeof subject == "undefined") {
        match = false;
      } else {
        match = parent.data[this.field].find((row) => {
          return row.data[this.table.options.index] == subject;
        });
      }
      if (match) {
        if (Array.isArray(parent.data[this.field])) {
          match = parent.data[this.field].indexOf(match);
        }
        if (match == -1) {
          match = false;
        }
      }
      return match;
    }
    getTreeChildren(row, component, recurse) {
      var config = row.modules.dataTree, output = [];
      if (config && config.children) {
        if (!Array.isArray(config.children)) {
          config.children = this.generateChildren(row);
        }
        config.children.forEach((childRow) => {
          if (childRow instanceof Row) {
            output.push(component ? childRow.getComponent() : childRow);
            if (recurse) {
              this.getTreeChildren(childRow, component, recurse).forEach((child) => {
                output.push(child);
              });
            }
          }
        });
      }
      return output;
    }
    getChildField() {
      return this.field;
    }
    redrawNeeded(data) {
      return (this.field ? typeof data[this.field] !== "undefined" : false) || (this.elementField ? typeof data[this.elementField] !== "undefined" : false);
    }
  };

  // src/classes/tabulator/DataTree/DataTree.js
  var MyDataTree = class _MyDataTree extends DataTree {
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
        const wasOpen = _MyDataTree.closeResponsiveRow(row);
        row.reinitialize();
        this.refreshData(true);
        this.dispatchExternal("dataTreeRowExpanded", row.getComponent(), row.modules.dataTree.index);
      }
    }
    collapseRow(row) {
      var config = row.modules.dataTree;
      if (config.children !== false) {
        config.open = false;
        _MyDataTree.closeResponsiveRow(row);
        row.reinitialize();
        this.refreshData(true);
        this.dispatchExternal("dataTreeRowCollapsed", row.getComponent(), row.modules.dataTree.index);
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Download/defaults/downloaders/csv.js
  function csv_default(list, options = {}, setFileContents) {
    var delimiter = options.delimiter ? options.delimiter : ",", fileContents = [], headers = [];
    list.forEach((row) => {
      var item = [];
      switch (row.type) {
        case "group":
          console.warn("Download Warning - CSV downloader cannot process row groups");
          break;
        case "calc":
          console.warn("Download Warning - CSV downloader cannot process column calculations");
          break;
        case "header":
          row.columns.forEach((col, i) => {
            if (col && col.depth === 1) {
              headers[i] = typeof col.value == "undefined" || col.value === null ? "" : '"' + String(col.value).split('"').join('""') + '"';
            }
          });
          break;
        case "row":
          row.columns.forEach((col) => {
            if (col) {
              switch (typeof col.value) {
                case "object":
                  col.value = col.value !== null ? JSON.stringify(col.value) : "";
                  break;
                case "undefined":
                  col.value = "";
                  break;
              }
              item.push('"' + String(col.value).split('"').join('""') + '"');
            }
          });
          fileContents.push(item.join(delimiter));
          break;
      }
    });
    if (headers.length) {
      fileContents.unshift(headers.join(delimiter));
    }
    fileContents = fileContents.join("\n");
    if (options.bom) {
      fileContents = "\uFEFF" + fileContents;
    }
    setFileContents(fileContents, "text/csv");
  }

  // node_modules/tabulator-tables/src/js/modules/Download/defaults/downloaders/json.js
  function json_default(list, options, setFileContents) {
    var fileContents = [];
    list.forEach((row) => {
      var item = {};
      switch (row.type) {
        case "header":
          break;
        case "group":
          console.warn("Download Warning - JSON downloader cannot process row groups");
          break;
        case "calc":
          console.warn("Download Warning - JSON downloader cannot process column calculations");
          break;
        case "row":
          row.columns.forEach((col) => {
            if (col) {
              item[col.component.getTitleDownload() || col.component.getField()] = col.value;
            }
          });
          fileContents.push(item);
          break;
      }
    });
    fileContents = JSON.stringify(fileContents, null, "	");
    setFileContents(fileContents, "application/json");
  }

  // node_modules/tabulator-tables/src/js/modules/Download/defaults/downloaders/pdf.js
  function pdf_default(list, options = {}, setFileContents) {
    var header = [], body = [], autoTableParams = {}, rowGroupStyles = options.rowGroupStyles || {
      fontStyle: "bold",
      fontSize: 12,
      cellPadding: 6,
      fillColor: 220
    }, rowCalcStyles = options.rowCalcStyles || {
      fontStyle: "bold",
      fontSize: 10,
      cellPadding: 4,
      fillColor: 232
    }, jsPDFParams = options.jsPDF || {}, title = options.title ? options.title : "";
    if (!jsPDFParams.orientation) {
      jsPDFParams.orientation = options.orientation || "landscape";
    }
    if (!jsPDFParams.unit) {
      jsPDFParams.unit = "pt";
    }
    list.forEach((row) => {
      switch (row.type) {
        case "header":
          header.push(parseRow(row));
          break;
        case "group":
          body.push(parseRow(row, rowGroupStyles));
          break;
        case "calc":
          body.push(parseRow(row, rowCalcStyles));
          break;
        case "row":
          body.push(parseRow(row));
          break;
      }
    });
    function parseRow(row, styles) {
      var rowData = [];
      row.columns.forEach((col) => {
        var cell;
        if (col) {
          switch (typeof col.value) {
            case "object":
              col.value = col.value !== null ? JSON.stringify(col.value) : "";
              break;
            case "undefined":
              col.value = "";
              break;
          }
          cell = {
            content: col.value,
            colSpan: col.width,
            rowSpan: col.height
          };
          if (styles) {
            cell.styles = styles;
          }
          rowData.push(cell);
        }
      });
      return rowData;
    }
    var doc = new jspdf.jsPDF(jsPDFParams);
    if (options.autoTable) {
      if (typeof options.autoTable === "function") {
        autoTableParams = options.autoTable(doc) || {};
      } else {
        autoTableParams = options.autoTable;
      }
    }
    if (title) {
      autoTableParams.didDrawPage = function(data) {
        doc.text(title, 40, 30);
      };
    }
    autoTableParams.head = header;
    autoTableParams.body = body;
    doc.autoTable(autoTableParams);
    if (options.documentProcessing) {
      options.documentProcessing(doc);
    }
    setFileContents(doc.output("arraybuffer"), "application/pdf");
  }

  // node_modules/tabulator-tables/src/js/modules/Download/defaults/downloaders/xlsx.js
  function xlsx_default(list, options, setFileContents) {
    var self = this, sheetName = options.sheetName || "Sheet1", workbook = XLSX.utils.book_new(), tableFeatures = new CoreFeature(this), compression = "compress" in options ? options.compress : true, writeOptions = options.writeOptions || { bookType: "xlsx", bookSST: true, compression }, output;
    writeOptions.type = "binary";
    workbook.SheetNames = [];
    workbook.Sheets = {};
    function generateSheet() {
      var rows = [], merges = [], worksheet = {}, range = { s: { c: 0, r: 0 }, e: { c: list[0] ? list[0].columns.reduce((a, b) => a + (b && b.width ? b.width : 1), 0) : 0, r: list.length } };
      list.forEach((row, i) => {
        var rowData = [];
        row.columns.forEach(function(col, j) {
          if (col) {
            rowData.push(!(col.value instanceof Date) && typeof col.value === "object" ? JSON.stringify(col.value) : col.value);
            if (col.width > 1 || col.height > -1) {
              if (col.height > 1 || col.width > 1) {
                merges.push({ s: { r: i, c: j }, e: { r: i + col.height - 1, c: j + col.width - 1 } });
              }
            }
          } else {
            rowData.push("");
          }
        });
        rows.push(rowData);
      });
      XLSX.utils.sheet_add_aoa(worksheet, rows);
      worksheet["!ref"] = XLSX.utils.encode_range(range);
      if (merges.length) {
        worksheet["!merges"] = merges;
      }
      return worksheet;
    }
    if (options.sheetOnly) {
      setFileContents(generateSheet());
      return;
    }
    if (options.sheets) {
      for (var sheet in options.sheets) {
        if (options.sheets[sheet] === true) {
          workbook.SheetNames.push(sheet);
          workbook.Sheets[sheet] = generateSheet();
        } else {
          workbook.SheetNames.push(sheet);
          tableFeatures.commsSend(options.sheets[sheet], "download", "intercept", {
            type: "xlsx",
            options: { sheetOnly: true },
            active: self.active,
            intercept: function(data) {
              workbook.Sheets[sheet] = data;
            }
          });
        }
      }
    } else {
      workbook.SheetNames.push(sheetName);
      workbook.Sheets[sheetName] = generateSheet();
    }
    if (options.documentProcessing) {
      workbook = options.documentProcessing(workbook);
    }
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 255;
      return buf;
    }
    output = XLSX.write(workbook, writeOptions);
    setFileContents(s2ab(output), "application/octet-stream");
  }

  // node_modules/tabulator-tables/src/js/modules/Download/defaults/downloaders/html.js
  function html_default(list, options, setFileContents) {
    if (this.modExists("export", true)) {
      setFileContents(this.modules.export.generateHTMLTable(list), "text/html");
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Download/defaults/downloaders/jsonLines.js
  function jsonLines_default(list, options, setFileContents) {
    const fileContents = [];
    list.forEach((row) => {
      const item = {};
      switch (row.type) {
        case "header":
          break;
        case "group":
          console.warn("Download Warning - JSON downloader cannot process row groups");
          break;
        case "calc":
          console.warn("Download Warning - JSON downloader cannot process column calculations");
          break;
        case "row":
          row.columns.forEach((col) => {
            if (col) {
              item[col.component.getTitleDownload() || col.component.getField()] = col.value;
            }
          });
          fileContents.push(JSON.stringify(item));
          break;
      }
    });
    setFileContents(fileContents.join("\n"), "application/x-ndjson");
  }

  // node_modules/tabulator-tables/src/js/modules/Download/defaults/downloaders.js
  var downloaders_default = {
    csv: csv_default,
    json: json_default,
    jsonLines: jsonLines_default,
    pdf: pdf_default,
    xlsx: xlsx_default,
    html: html_default
  };

  // node_modules/tabulator-tables/src/js/modules/Download/Download.js
  var Download = class _Download extends Module {
    static moduleName = "download";
    //load defaults
    static downloaders = downloaders_default;
    constructor(table) {
      super(table);
      this.registerTableOption("downloadEncoder", function(data, mimeType) {
        return new Blob([data], { type: mimeType });
      });
      this.registerTableOption("downloadConfig", {});
      this.registerTableOption("downloadRowRange", "active");
      this.registerColumnOption("download");
      this.registerColumnOption("titleDownload");
    }
    initialize() {
      this.deprecatedOptionsCheck();
      this.registerTableFunction("download", this.download.bind(this));
      this.registerTableFunction("downloadToTab", this.downloadToTab.bind(this));
    }
    deprecatedOptionsCheck() {
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    downloadToTab(type, filename, options, active) {
      this.download(type, filename, options, active, true);
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    //trigger file download
    download(type, filename, options, range, interceptCallback) {
      var downloadFunc = false;
      function buildLink(data, mime) {
        if (interceptCallback) {
          if (interceptCallback === true) {
            this.triggerDownload(data, mime, type, filename, true);
          } else {
            interceptCallback(data);
          }
        } else {
          this.triggerDownload(data, mime, type, filename);
        }
      }
      if (typeof type == "function") {
        downloadFunc = type;
      } else {
        if (_Download.downloaders[type]) {
          downloadFunc = _Download.downloaders[type];
        } else {
          console.warn("Download Error - No such download type found: ", type);
        }
      }
      if (downloadFunc) {
        var list = this.generateExportList(range);
        downloadFunc.call(this.table, list, options || {}, buildLink.bind(this));
      }
    }
    generateExportList(range) {
      var list = this.table.modules.export.generateExportList(this.table.options.downloadConfig, false, range || this.table.options.downloadRowRange, "download");
      var groupHeader = this.table.options.groupHeaderDownload;
      if (groupHeader && !Array.isArray(groupHeader)) {
        groupHeader = [groupHeader];
      }
      list.forEach((row) => {
        var group;
        if (row.type === "group") {
          group = row.columns[0];
          if (groupHeader && groupHeader[row.indent]) {
            group.value = groupHeader[row.indent](group.value, row.component._group.getRowCount(), row.component._group.getData(), row.component);
          }
        }
      });
      return list;
    }
    triggerDownload(data, mime, type, filename, newTab) {
      var element = document.createElement("a"), blob = this.table.options.downloadEncoder(data, mime);
      if (blob) {
        if (newTab) {
          window.open(window.URL.createObjectURL(blob));
        } else {
          filename = filename || "Tabulator." + (typeof type === "function" ? "txt" : type);
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
          } else {
            element.setAttribute("href", window.URL.createObjectURL(blob));
            element.setAttribute("download", filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }
        }
        this.dispatchExternal("downloadComplete");
      }
    }
    commsReceived(table, action, data) {
      switch (action) {
        case "intercept":
          this.download(data.type, "", data.options, data.active, data.intercept);
          break;
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Edit/inputMask.js
  function maskInput(el, options) {
    var mask = options.mask, maskLetter = typeof options.maskLetterChar !== "undefined" ? options.maskLetterChar : "A", maskNumber = typeof options.maskNumberChar !== "undefined" ? options.maskNumberChar : "9", maskWildcard = typeof options.maskWildcardChar !== "undefined" ? options.maskWildcardChar : "*";
    function fillSymbols(index) {
      var symbol = mask[index];
      if (typeof symbol !== "undefined" && symbol !== maskWildcard && symbol !== maskLetter && symbol !== maskNumber) {
        el.value = el.value + "" + symbol;
        fillSymbols(index + 1);
      }
    }
    el.addEventListener("keydown", (e) => {
      var index = el.value.length, char = e.key;
      if (e.keyCode > 46 && !e.ctrlKey && !e.metaKey) {
        if (index >= mask.length) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        } else {
          switch (mask[index]) {
            case maskLetter:
              if (char.toUpperCase() == char.toLowerCase()) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
              break;
            case maskNumber:
              if (isNaN(char)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
              break;
            case maskWildcard:
              break;
            default:
              if (char !== mask[index]) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
          }
        }
      }
      return;
    });
    el.addEventListener("keyup", (e) => {
      if (e.keyCode > 46) {
        if (options.maskAutoFill) {
          fillSymbols(el.value.length);
        }
      }
    });
    if (!el.placeholder) {
      el.placeholder = mask;
    }
    if (options.maskAutoFill) {
      fillSymbols(el.value.length);
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/input.js
  function input_default(cell, onRendered, success, cancel, editorParams) {
    var cellValue = cell.getValue(), input = document.createElement("input");
    input.setAttribute("type", editorParams.search ? "search" : "text");
    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          input.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    input.value = typeof cellValue !== "undefined" ? cellValue : "";
    onRendered(function() {
      if (cell.getType() === "cell") {
        input.focus({ preventScroll: true });
        input.style.height = "100%";
        if (editorParams.selectContents) {
          input.select();
        }
      }
    });
    function onChange(e) {
      if ((cellValue === null || typeof cellValue === "undefined") && input.value !== "" || input.value !== cellValue) {
        if (success(input.value)) {
          cellValue = input.value;
        }
      } else {
        cancel();
      }
    }
    input.addEventListener("change", onChange);
    input.addEventListener("blur", onChange);
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          onChange(e);
          break;
        case 27:
          cancel();
          break;
        case 35:
        case 36:
          e.stopPropagation();
          break;
      }
    });
    if (editorParams.mask) {
      maskInput(input, editorParams);
    }
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/textarea.js
  function textarea_default(cell, onRendered, success, cancel, editorParams) {
    var cellValue = cell.getValue(), vertNav = editorParams.verticalNavigation || "hybrid", value = String(cellValue !== null && typeof cellValue !== "undefined" ? cellValue : ""), input = document.createElement("textarea"), scrollHeight = 0;
    input.style.display = "block";
    input.style.padding = "2px";
    input.style.height = "100%";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.style.whiteSpace = "pre-wrap";
    input.style.resize = "none";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          input.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    input.value = value;
    onRendered(function() {
      if (cell.getType() === "cell") {
        input.focus({ preventScroll: true });
        input.style.height = "100%";
        input.scrollHeight;
        input.style.height = input.scrollHeight + "px";
        cell.getRow().normalizeHeight();
        if (editorParams.selectContents) {
          input.select();
        }
      }
    });
    function onChange(e) {
      if ((cellValue === null || typeof cellValue === "undefined") && input.value !== "" || input.value !== cellValue) {
        if (success(input.value)) {
          cellValue = input.value;
        }
        setTimeout(function() {
          cell.getRow().normalizeHeight();
        }, 300);
      } else {
        cancel();
      }
    }
    input.addEventListener("change", onChange);
    input.addEventListener("blur", onChange);
    input.addEventListener("keyup", function() {
      input.style.height = "";
      var heightNow = input.scrollHeight;
      input.style.height = heightNow + "px";
      if (heightNow != scrollHeight) {
        scrollHeight = heightNow;
        cell.getRow().normalizeHeight();
      }
    });
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          if (e.shiftKey && editorParams.shiftEnterSubmit) {
            onChange(e);
          }
          break;
        case 27:
          cancel();
          break;
        case 38:
          if (vertNav == "editor" || vertNav == "hybrid" && input.selectionStart) {
            e.stopImmediatePropagation();
            e.stopPropagation();
          }
          break;
        case 40:
          if (vertNav == "editor" || vertNav == "hybrid" && input.selectionStart !== input.value.length) {
            e.stopImmediatePropagation();
            e.stopPropagation();
          }
          break;
        case 35:
        case 36:
          e.stopPropagation();
          break;
      }
    });
    if (editorParams.mask) {
      maskInput(input, editorParams);
    }
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/number.js
  function number_default(cell, onRendered, success, cancel, editorParams) {
    var cellValue = cell.getValue(), vertNav = editorParams.verticalNavigation || "editor", input = document.createElement("input");
    input.setAttribute("type", "number");
    if (typeof editorParams.max != "undefined") {
      input.setAttribute("max", editorParams.max);
    }
    if (typeof editorParams.min != "undefined") {
      input.setAttribute("min", editorParams.min);
    }
    if (typeof editorParams.step != "undefined") {
      input.setAttribute("step", editorParams.step);
    }
    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          input.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    input.value = cellValue;
    var blurFunc = function(e) {
      onChange();
    };
    onRendered(function() {
      if (cell.getType() === "cell") {
        input.removeEventListener("blur", blurFunc);
        input.focus({ preventScroll: true });
        input.style.height = "100%";
        input.addEventListener("blur", blurFunc);
        if (editorParams.selectContents) {
          input.select();
        }
      }
    });
    function onChange() {
      var value = input.value;
      if (!isNaN(value) && value !== "") {
        value = Number(value);
      }
      if (value !== cellValue) {
        if (success(value)) {
          cellValue = value;
        }
      } else {
        cancel();
      }
    }
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          onChange();
          break;
        case 27:
          cancel();
          break;
        case 38:
        case 40:
          if (vertNav == "editor") {
            e.stopImmediatePropagation();
            e.stopPropagation();
          }
          break;
        case 35:
        case 36:
          e.stopPropagation();
          break;
      }
    });
    if (editorParams.mask) {
      maskInput(input, editorParams);
    }
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/range.js
  function range_default(cell, onRendered, success, cancel, editorParams) {
    var cellValue = cell.getValue(), input = document.createElement("input");
    input.setAttribute("type", "range");
    if (typeof editorParams.max != "undefined") {
      input.setAttribute("max", editorParams.max);
    }
    if (typeof editorParams.min != "undefined") {
      input.setAttribute("min", editorParams.min);
    }
    if (typeof editorParams.step != "undefined") {
      input.setAttribute("step", editorParams.step);
    }
    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          input.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    input.value = cellValue;
    onRendered(function() {
      if (cell.getType() === "cell") {
        input.focus({ preventScroll: true });
        input.style.height = "100%";
      }
    });
    function onChange() {
      var value = input.value;
      if (!isNaN(value) && value !== "") {
        value = Number(value);
      }
      if (value != cellValue) {
        if (success(value)) {
          cellValue = value;
        }
      } else {
        cancel();
      }
    }
    input.addEventListener("blur", function(e) {
      onChange();
    });
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          onChange();
          break;
        case 27:
          cancel();
          break;
      }
    });
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/date.js
  function date_default(cell, onRendered, success, cancel, editorParams) {
    var inputFormat = editorParams.format, vertNav = editorParams.verticalNavigation || "editor", DT = inputFormat ? window.DateTime || luxon.DateTime : null;
    var cellValue = cell.getValue(), input = document.createElement("input");
    function convertDate(value) {
      var newDatetime;
      if (DT.isDateTime(value)) {
        newDatetime = value;
      } else if (inputFormat === "iso") {
        newDatetime = DT.fromISO(String(value));
      } else {
        newDatetime = DT.fromFormat(String(value), inputFormat);
      }
      return newDatetime.toFormat("yyyy-MM-dd");
    }
    input.type = "date";
    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    if (editorParams.max) {
      input.setAttribute("max", inputFormat ? convertDate(editorParams.max) : editorParams.max);
    }
    if (editorParams.min) {
      input.setAttribute("min", inputFormat ? convertDate(editorParams.min) : editorParams.min);
    }
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          input.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    cellValue = typeof cellValue !== "undefined" ? cellValue : "";
    if (inputFormat) {
      if (DT) {
        cellValue = convertDate(cellValue);
      } else {
        console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js");
      }
    }
    input.value = cellValue;
    onRendered(function() {
      if (cell.getType() === "cell") {
        input.focus({ preventScroll: true });
        input.style.height = "100%";
        if (editorParams.selectContents) {
          input.select();
        }
      }
    });
    function onChange() {
      var value = input.value, luxDate;
      if ((cellValue === null || typeof cellValue === "undefined") && value !== "" || value !== cellValue) {
        if (value && inputFormat) {
          luxDate = DT.fromFormat(String(value), "yyyy-MM-dd");
          switch (inputFormat) {
            case true:
              value = luxDate;
              break;
            case "iso":
              value = luxDate.toISO();
              break;
            default:
              value = luxDate.toFormat(inputFormat);
          }
        }
        if (success(value)) {
          cellValue = input.value;
        }
      } else {
        cancel();
      }
    }
    input.addEventListener("blur", function(e) {
      if (e.relatedTarget || e.rangeParent || e.explicitOriginalTarget !== input) {
        onChange();
      }
    });
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          onChange();
          break;
        case 27:
          cancel();
          break;
        case 35:
        case 36:
          e.stopPropagation();
          break;
        case 38:
        case 40:
          if (vertNav == "editor") {
            e.stopImmediatePropagation();
            e.stopPropagation();
          }
          break;
      }
    });
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/time.js
  function time_default(cell, onRendered, success, cancel, editorParams) {
    var inputFormat = editorParams.format, vertNav = editorParams.verticalNavigation || "editor", DT = inputFormat ? window.DateTime || luxon.DateTime : null, newDatetime;
    var cellValue = cell.getValue(), input = document.createElement("input");
    input.type = "time";
    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          input.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    cellValue = typeof cellValue !== "undefined" ? cellValue : "";
    if (inputFormat) {
      if (DT) {
        if (DT.isDateTime(cellValue)) {
          newDatetime = cellValue;
        } else if (inputFormat === "iso") {
          newDatetime = DT.fromISO(String(cellValue));
        } else {
          newDatetime = DT.fromFormat(String(cellValue), inputFormat);
        }
        cellValue = newDatetime.toFormat("HH:mm");
      } else {
        console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js");
      }
    }
    input.value = cellValue;
    onRendered(function() {
      if (cell.getType() == "cell") {
        input.focus({ preventScroll: true });
        input.style.height = "100%";
        if (editorParams.selectContents) {
          input.select();
        }
      }
    });
    function onChange() {
      var value = input.value, luxTime;
      if ((cellValue === null || typeof cellValue === "undefined") && value !== "" || value !== cellValue) {
        if (value && inputFormat) {
          luxTime = DT.fromFormat(String(value), "hh:mm");
          switch (inputFormat) {
            case true:
              value = luxTime;
              break;
            case "iso":
              value = luxTime.toISO();
              break;
            default:
              value = luxTime.toFormat(inputFormat);
          }
        }
        if (success(value)) {
          cellValue = input.value;
        }
      } else {
        cancel();
      }
    }
    input.addEventListener("blur", function(e) {
      if (e.relatedTarget || e.rangeParent || e.explicitOriginalTarget !== input) {
        onChange();
      }
    });
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          onChange();
          break;
        case 27:
          cancel();
          break;
        case 35:
        case 36:
          e.stopPropagation();
          break;
        case 38:
        case 40:
          if (vertNav == "editor") {
            e.stopImmediatePropagation();
            e.stopPropagation();
          }
          break;
      }
    });
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/datetime.js
  function datetime_default(cell, onRendered, success, cancel, editorParams) {
    var inputFormat = editorParams.format, vertNav = editorParams.verticalNavigation || "editor", DT = inputFormat ? window.DateTime || luxon.DateTime : null, newDatetime;
    var cellValue = cell.getValue(), input = document.createElement("input");
    input.type = "datetime-local";
    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          input.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    cellValue = typeof cellValue !== "undefined" ? cellValue : "";
    if (inputFormat) {
      if (DT) {
        if (DT.isDateTime(cellValue)) {
          newDatetime = cellValue;
        } else if (inputFormat === "iso") {
          newDatetime = DT.fromISO(String(cellValue));
        } else {
          newDatetime = DT.fromFormat(String(cellValue), inputFormat);
        }
        cellValue = newDatetime.toFormat("yyyy-MM-dd") + "T" + newDatetime.toFormat("HH:mm");
      } else {
        console.error("Editor Error - 'date' editor 'format' param is dependant on luxon.js");
      }
    }
    input.value = cellValue;
    onRendered(function() {
      if (cell.getType() === "cell") {
        input.focus({ preventScroll: true });
        input.style.height = "100%";
        if (editorParams.selectContents) {
          input.select();
        }
      }
    });
    function onChange() {
      var value = input.value, luxDateTime;
      if ((cellValue === null || typeof cellValue === "undefined") && value !== "" || value !== cellValue) {
        if (value && inputFormat) {
          luxDateTime = DT.fromISO(String(value));
          switch (inputFormat) {
            case true:
              value = luxDateTime;
              break;
            case "iso":
              value = luxDateTime.toISO();
              break;
            default:
              value = luxDateTime.toFormat(inputFormat);
          }
        }
        if (success(value)) {
          cellValue = input.value;
        }
      } else {
        cancel();
      }
    }
    input.addEventListener("blur", function(e) {
      if (e.relatedTarget || e.rangeParent || e.explicitOriginalTarget !== input) {
        onChange();
      }
    });
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          onChange();
          break;
        case 27:
          cancel();
          break;
        case 35:
        case 36:
          e.stopPropagation();
          break;
        case 38:
        case 40:
          if (vertNav == "editor") {
            e.stopImmediatePropagation();
            e.stopPropagation();
          }
          break;
      }
    });
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/List.js
  var Edit = class {
    constructor(editor, cell, onRendered, success, cancel, editorParams) {
      this.edit = editor;
      this.table = editor.table;
      this.cell = cell;
      this.params = this._initializeParams(editorParams);
      this.data = [];
      this.displayItems = [];
      this.currentItems = [];
      this.focusedItem = null;
      this.input = this._createInputElement();
      this.listEl = this._createListElement();
      this.initialValues = null;
      this.isFilter = cell.getType() === "header";
      this.filterTimeout = null;
      this.filtered = false;
      this.typing = false;
      this.values = [];
      this.popup = null;
      this.listIteration = 0;
      this.lastAction = "";
      this.filterTerm = "";
      this.blurable = true;
      this.actions = {
        success,
        cancel
      };
      this._deprecatedOptionsCheck();
      this._initializeValue();
      onRendered(this._onRendered.bind(this));
    }
    _deprecatedOptionsCheck() {
    }
    _initializeValue() {
      var initialValue = this.cell.getValue();
      if (typeof initialValue === "undefined" && typeof this.params.defaultValue !== "undefined") {
        initialValue = this.params.defaultValue;
      }
      this.initialValues = this.params.multiselect ? initialValue : [initialValue];
      if (this.isFilter) {
        this.input.value = this.initialValues ? this.initialValues.join(",") : "";
        this.headerFilterInitialListGen();
      }
    }
    _onRendered() {
      var cellEl = this.cell.getElement();
      function clickStop(e) {
        e.stopPropagation();
      }
      if (!this.isFilter) {
        this.input.style.height = "100%";
        this.input.focus({ preventScroll: true });
      }
      cellEl.addEventListener("click", clickStop);
      setTimeout(() => {
        cellEl.removeEventListener("click", clickStop);
      }, 1e3);
      this.input.addEventListener("mousedown", this._preventPopupBlur.bind(this));
    }
    _createListElement() {
      var listEl = document.createElement("div");
      listEl.classList.add("tabulator-edit-list");
      listEl.addEventListener("mousedown", this._preventBlur.bind(this));
      listEl.addEventListener("keydown", this._inputKeyDown.bind(this));
      return listEl;
    }
    _setListWidth() {
      var element = this.isFilter ? this.input : this.cell.getElement();
      this.listEl.style.minWidth = element.offsetWidth + "px";
      if (this.params.maxWidth) {
        if (this.params.maxWidth === true) {
          this.listEl.style.maxWidth = element.offsetWidth + "px";
        } else if (typeof this.params.maxWidth === "number") {
          this.listEl.style.maxWidth = this.params.maxWidth + "px";
        } else {
          this.listEl.style.maxWidth = this.params.maxWidth;
        }
      }
    }
    _createInputElement() {
      var attribs = this.params.elementAttributes;
      var input = document.createElement("input");
      input.setAttribute("type", this.params.clearable ? "search" : "text");
      input.style.padding = "4px";
      input.style.width = "100%";
      input.style.boxSizing = "border-box";
      if (!this.params.autocomplete) {
        input.style.cursor = "default";
        input.style.caretColor = "transparent";
      }
      if (attribs && typeof attribs == "object") {
        for (let key in attribs) {
          if (key.charAt(0) == "+") {
            key = key.slice(1);
            input.setAttribute(key, input.getAttribute(key) + attribs["+" + key]);
          } else {
            input.setAttribute(key, attribs[key]);
          }
        }
      }
      if (this.params.mask) {
        maskInput(input, this.params);
      }
      this._bindInputEvents(input);
      return input;
    }
    _initializeParams(params) {
      var valueKeys = ["values", "valuesURL", "valuesLookup"], valueCheck;
      params = Object.assign({}, params);
      params.verticalNavigation = params.verticalNavigation || "editor";
      params.placeholderLoading = typeof params.placeholderLoading === "undefined" ? "Searching ..." : params.placeholderLoading;
      params.placeholderEmpty = typeof params.placeholderEmpty === "undefined" ? "No Results Found" : params.placeholderEmpty;
      params.filterDelay = typeof params.filterDelay === "undefined" ? 300 : params.filterDelay;
      params.emptyValue = Object.keys(params).includes("emptyValue") ? params.emptyValue : "";
      valueCheck = Object.keys(params).filter((key) => valueKeys.includes(key)).length;
      if (!valueCheck) {
        console.warn("list editor config error - either the values, valuesURL, or valuesLookup option must be set");
      } else if (valueCheck > 1) {
        console.warn("list editor config error - only one of the values, valuesURL, or valuesLookup options can be set on the same editor");
      }
      if (params.autocomplete) {
        if (params.multiselect) {
          params.multiselect = false;
          console.warn("list editor config error - multiselect option is not available when autocomplete is enabled");
        }
      } else {
        if (params.freetext) {
          params.freetext = false;
          console.warn("list editor config error - freetext option is only available when autocomplete is enabled");
        }
        if (params.filterFunc) {
          params.filterFunc = false;
          console.warn("list editor config error - filterFunc option is only available when autocomplete is enabled");
        }
        if (params.filterRemote) {
          params.filterRemote = false;
          console.warn("list editor config error - filterRemote option is only available when autocomplete is enabled");
        }
        if (params.mask) {
          params.mask = false;
          console.warn("list editor config error - mask option is only available when autocomplete is enabled");
        }
        if (params.allowEmpty) {
          params.allowEmpty = false;
          console.warn("list editor config error - allowEmpty option is only available when autocomplete is enabled");
        }
        if (params.listOnEmpty) {
          params.listOnEmpty = false;
          console.warn("list editor config error - listOnEmpty option is only available when autocomplete is enabled");
        }
      }
      if (params.filterRemote && !(typeof params.valuesLookup === "function" || params.valuesURL)) {
        params.filterRemote = false;
        console.warn("list editor config error - filterRemote option should only be used when values list is populated from a remote source");
      }
      return params;
    }
    //////////////////////////////////////
    ////////// Event Handling ////////////
    //////////////////////////////////////
    _bindInputEvents(input) {
      input.addEventListener("focus", this._inputFocus.bind(this));
      input.addEventListener("click", this._inputClick.bind(this));
      input.addEventListener("blur", this._inputBlur.bind(this));
      input.addEventListener("keydown", this._inputKeyDown.bind(this));
      input.addEventListener("search", this._inputSearch.bind(this));
      if (this.params.autocomplete) {
        input.addEventListener("keyup", this._inputKeyUp.bind(this));
      }
    }
    _inputFocus(e) {
      this.rebuildOptionsList();
    }
    _filter() {
      if (this.params.filterRemote) {
        clearTimeout(this.filterTimeout);
        this.filterTimeout = setTimeout(() => {
          this.rebuildOptionsList();
        }, this.params.filterDelay);
      } else {
        this._filterList();
      }
    }
    _inputClick(e) {
      e.stopPropagation();
    }
    _inputBlur(e) {
      if (this.blurable) {
        if (this.popup) {
          this.popup.hide();
        } else {
          this._resolveValue(true);
        }
      }
    }
    _inputSearch() {
      this._clearChoices();
    }
    _inputKeyDown(e) {
      switch (e.keyCode) {
        case 38:
          this._keyUp(e);
          break;
        case 40:
          this._keyDown(e);
          break;
        case 37:
        case 39:
          this._keySide(e);
          break;
        case 13:
          this._keyEnter();
          break;
        case 27:
          this._keyEsc();
          break;
        case 36:
        case 35:
          this._keyHomeEnd(e);
          break;
        case 9:
          this._keyTab(e);
          break;
        default:
          this._keySelectLetter(e);
      }
    }
    _inputKeyUp(e) {
      switch (e.keyCode) {
        case 38:
        case 37:
        case 39:
        case 40:
        case 13:
        case 27:
          break;
        default:
          this._keyAutoCompLetter(e);
      }
    }
    _preventPopupBlur() {
      if (this.popup) {
        this.popup.blockHide();
      }
      setTimeout(() => {
        if (this.popup) {
          this.popup.restoreHide();
        }
      }, 10);
    }
    _preventBlur() {
      this.blurable = false;
      setTimeout(() => {
        this.blurable = true;
      }, 10);
    }
    //////////////////////////////////////
    //////// Keyboard Navigation /////////
    //////////////////////////////////////
    _keyTab(e) {
      if (this.params.autocomplete && this.lastAction === "typing") {
        this._resolveValue(true);
      } else {
        if (this.focusedItem) {
          this._chooseItem(this.focusedItem, true);
        }
      }
    }
    _keyUp(e) {
      var index = this.displayItems.indexOf(this.focusedItem);
      if (this.params.verticalNavigation == "editor" || this.params.verticalNavigation == "hybrid" && index) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        if (index > 0) {
          this._focusItem(this.displayItems[index - 1]);
        }
      }
    }
    _keyDown(e) {
      var index = this.displayItems.indexOf(this.focusedItem);
      if (this.params.verticalNavigation == "editor" || this.params.verticalNavigation == "hybrid" && index < this.displayItems.length - 1) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        if (index < this.displayItems.length - 1) {
          if (index == -1) {
            this._focusItem(this.displayItems[0]);
          } else {
            this._focusItem(this.displayItems[index + 1]);
          }
        }
      }
    }
    _keySide(e) {
      if (!this.params.autocomplete) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
      }
    }
    _keyEnter(e) {
      if (this.params.autocomplete && this.lastAction === "typing") {
        this._resolveValue(true);
      } else {
        if (this.focusedItem) {
          this._chooseItem(this.focusedItem);
        }
      }
    }
    _keyEsc(e) {
      this._cancel();
    }
    _keyHomeEnd(e) {
      if (this.params.autocomplete) {
        e.stopImmediatePropagation();
      }
    }
    _keySelectLetter(e) {
      if (!this.params.autocomplete) {
        e.preventDefault();
        if (e.keyCode >= 38 && e.keyCode <= 90) {
          this._scrollToValue(e.keyCode);
        }
      }
    }
    _keyAutoCompLetter(e) {
      this._filter();
      this.lastAction = "typing";
      this.typing = true;
    }
    _scrollToValue(char) {
      clearTimeout(this.filterTimeout);
      var character = String.fromCharCode(char).toLowerCase();
      this.filterTerm += character.toLowerCase();
      var match = this.displayItems.find((item) => {
        return typeof item.label !== "undefined" && item.label.toLowerCase().startsWith(this.filterTerm);
      });
      if (match) {
        this._focusItem(match);
      }
      this.filterTimeout = setTimeout(() => {
        this.filterTerm = "";
      }, 800);
    }
    _focusItem(item) {
      this.lastAction = "focus";
      if (this.focusedItem && this.focusedItem.element) {
        this.focusedItem.element.classList.remove("focused");
      }
      this.focusedItem = item;
      if (item && item.element) {
        item.element.classList.add("focused");
        item.element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      }
    }
    //////////////////////////////////////
    /////// Data List Generation /////////
    //////////////////////////////////////
    headerFilterInitialListGen() {
      this._generateOptions(true);
    }
    rebuildOptionsList() {
      this._generateOptions().then(this._sortOptions.bind(this)).then(this._buildList.bind(this)).then(this._showList.bind(this)).catch((e) => {
        if (!Number.isInteger(e)) {
          console.error("List generation error", e);
        }
      });
    }
    _filterList() {
      this._buildList(this._filterOptions());
      this._showList();
    }
    _generateOptions(silent) {
      var values = [];
      var iteration = ++this.listIteration;
      this.filtered = false;
      if (this.params.values) {
        values = this.params.values;
      } else if (this.params.valuesURL) {
        values = this._ajaxRequest(this.params.valuesURL, this.input.value);
      } else {
        if (typeof this.params.valuesLookup === "function") {
          values = this.params.valuesLookup(this.cell, this.input.value);
        } else if (this.params.valuesLookup) {
          values = this._uniqueColumnValues(this.params.valuesLookupField);
        }
      }
      if (values instanceof Promise) {
        if (!silent) {
          this._addPlaceholder(this.params.placeholderLoading);
        }
        return values.then().then((responseValues) => {
          if (this.listIteration === iteration) {
            return this._parseList(responseValues);
          } else {
            return Promise.reject(iteration);
          }
        });
      } else {
        return Promise.resolve(this._parseList(values));
      }
    }
    _addPlaceholder(contents) {
      var placeholder = document.createElement("div");
      if (typeof contents === "function") {
        contents = contents(this.cell.getComponent(), this.listEl);
      }
      if (contents) {
        this._clearList();
        if (contents instanceof HTMLElement) {
          placeholder = contents;
        } else {
          placeholder.classList.add("tabulator-edit-list-placeholder");
          placeholder.innerHTML = contents;
        }
        this.listEl.appendChild(placeholder);
        this._showList();
      }
    }
    _ajaxRequest(url, term) {
      var params = this.params.filterRemote ? { term } : {};
      url = urlGenerator_default(url, {}, params);
      return fetch(url).then((response) => {
        if (response.ok) {
          return response.json().catch((error) => {
            console.warn("List Ajax Load Error - Invalid JSON returned", error);
            return Promise.reject(error);
          });
        } else {
          console.error("List Ajax Load Error - Connection Error: " + response.status, response.statusText);
          return Promise.reject(response);
        }
      }).catch((error) => {
        console.error("List Ajax Load Error - Connection Error: ", error);
        return Promise.reject(error);
      });
    }
    _uniqueColumnValues(field) {
      var output = {}, data = this.table.getData(this.params.valuesLookup), column;
      if (field) {
        column = this.table.columnManager.getColumnByField(field);
      } else {
        column = this.cell.getColumn()._getSelf();
      }
      if (column) {
        data.forEach((row) => {
          var val = column.getFieldValue(row);
          if (val !== null && typeof val !== "undefined" && val !== "") {
            output[val] = true;
          }
        });
      } else {
        console.warn("unable to find matching column to create select lookup list:", field);
        output = [];
      }
      return Object.keys(output);
    }
    _parseList(inputValues) {
      var data = [];
      if (!Array.isArray(inputValues)) {
        inputValues = Object.entries(inputValues).map(([key, value]) => {
          return {
            label: value,
            value: key
          };
        });
      }
      inputValues.forEach((value) => {
        if (typeof value !== "object") {
          value = {
            label: value,
            value
          };
        }
        this._parseListItem(value, data, 0);
      });
      if (!this.currentItems.length && this.params.freetext) {
        this.input.value = this.initialValues;
        this.typing = true;
        this.lastAction = "typing";
      }
      this.data = data;
      return data;
    }
    _parseListItem(option, data, level) {
      var item = {};
      if (option.options) {
        item = this._parseListGroup(option, level + 1);
      } else {
        item = {
          label: option.label,
          value: option.value,
          itemParams: option.itemParams,
          elementAttributes: option.elementAttributes,
          element: false,
          selected: false,
          visible: true,
          level,
          original: option
        };
        if (this.initialValues && this.initialValues.indexOf(option.value) > -1) {
          this._chooseItem(item, true);
        }
      }
      data.push(item);
    }
    _parseListGroup(option, level) {
      var item = {
        label: option.label,
        group: true,
        itemParams: option.itemParams,
        elementAttributes: option.elementAttributes,
        element: false,
        visible: true,
        level,
        options: [],
        original: option
      };
      option.options.forEach((child) => {
        this._parseListItem(child, item.options, level);
      });
      return item;
    }
    _sortOptions(options) {
      var sorter;
      if (this.params.sort) {
        sorter = typeof this.params.sort === "function" ? this.params.sort : this._defaultSortFunction.bind(this);
        this._sortGroup(sorter, options);
      }
      return options;
    }
    _sortGroup(sorter, options) {
      options.sort((a, b) => {
        return sorter(a.label, b.label, a.value, b.value, a.original, b.original);
      });
      options.forEach((option) => {
        if (option.group) {
          this._sortGroup(sorter, option.options);
        }
      });
    }
    _defaultSortFunction(as, bs) {
      var a, b, a1, b1, i = 0, L, rx = /(\d+)|(\D+)/g, rd = /\d/;
      var emptyAlign = 0;
      if (this.params.sort === "desc") {
        [as, bs] = [bs, as];
      }
      if (!as && as !== 0) {
        emptyAlign = !bs && bs !== 0 ? 0 : -1;
      } else if (!bs && bs !== 0) {
        emptyAlign = 1;
      } else {
        if (isFinite(as) && isFinite(bs)) return as - bs;
        a = String(as).toLowerCase();
        b = String(bs).toLowerCase();
        if (a === b) return 0;
        if (!(rd.test(a) && rd.test(b))) return a > b ? 1 : -1;
        a = a.match(rx);
        b = b.match(rx);
        L = a.length > b.length ? b.length : a.length;
        while (i < L) {
          a1 = a[i];
          b1 = b[i++];
          if (a1 !== b1) {
            if (isFinite(a1) && isFinite(b1)) {
              if (a1.charAt(0) === "0") a1 = "." + a1;
              if (b1.charAt(0) === "0") b1 = "." + b1;
              return a1 - b1;
            } else return a1 > b1 ? 1 : -1;
          }
        }
        return a.length > b.length;
      }
      return emptyAlign;
    }
    _filterOptions() {
      var filterFunc = this.params.filterFunc || this._defaultFilterFunc, term = this.input.value;
      if (term) {
        this.filtered = true;
        this.data.forEach((item) => {
          this._filterItem(filterFunc, term, item);
        });
      } else {
        this.filtered = false;
      }
      return this.data;
    }
    _filterItem(func, term, item) {
      var matches = false;
      if (!item.group) {
        item.visible = func(term, item.label, item.value, item.original);
      } else {
        item.options.forEach((option) => {
          if (this._filterItem(func, term, option)) {
            matches = true;
          }
        });
        item.visible = matches;
      }
      return item.visible;
    }
    _defaultFilterFunc(term, label, value, item) {
      term = String(term).toLowerCase();
      if (label !== null && typeof label !== "undefined") {
        if (String(label).toLowerCase().indexOf(term) > -1 || String(value).toLowerCase().indexOf(term) > -1) {
          return true;
        }
      }
      return false;
    }
    //////////////////////////////////////
    /////////// Display List /////////////
    //////////////////////////////////////
    _clearList() {
      while (this.listEl.firstChild) this.listEl.removeChild(this.listEl.firstChild);
      this.displayItems = [];
    }
    _buildList(data) {
      this._clearList();
      data.forEach((option) => {
        this._buildItem(option);
      });
      if (!this.displayItems.length) {
        this._addPlaceholder(this.params.placeholderEmpty);
      }
    }
    _buildItem(item) {
      var el = item.element, contents;
      if (!this.filtered || item.visible) {
        if (!el) {
          el = document.createElement("div");
          el.tabIndex = 0;
          contents = this.params.itemFormatter ? this.params.itemFormatter(item.label, item.value, item.original, el) : item.label;
          if (contents instanceof HTMLElement) {
            el.appendChild(contents);
          } else {
            el.innerHTML = contents;
          }
          if (item.group) {
            el.classList.add("tabulator-edit-list-group");
          } else {
            el.classList.add("tabulator-edit-list-item");
          }
          el.classList.add("tabulator-edit-list-group-level-" + item.level);
          if (item.elementAttributes && typeof item.elementAttributes == "object") {
            for (let key in item.elementAttributes) {
              if (key.charAt(0) == "+") {
                key = key.slice(1);
                el.setAttribute(key, this.input.getAttribute(key) + item.elementAttributes["+" + key]);
              } else {
                el.setAttribute(key, item.elementAttributes[key]);
              }
            }
          }
          if (item.group) {
            el.addEventListener("click", this._groupClick.bind(this, item));
          } else {
            el.addEventListener("click", this._itemClick.bind(this, item));
          }
          el.addEventListener("mousedown", this._preventBlur.bind(this));
          item.element = el;
        }
        this._styleItem(item);
        this.listEl.appendChild(el);
        if (item.group) {
          item.options.forEach((option) => {
            this._buildItem(option);
          });
        } else {
          this.displayItems.push(item);
        }
      }
    }
    _showList() {
      var startVis = this.popup && this.popup.isVisible();
      if (this.input.parentNode) {
        if (this.params.autocomplete && this.input.value === "" && !this.params.listOnEmpty) {
          if (this.popup) {
            this.popup.hide(true);
          }
          return;
        }
        this._setListWidth();
        if (!this.popup) {
          this.popup = this.edit.popup(this.listEl);
        }
        this.popup.show(this.cell.getElement(), "bottom");
        if (!startVis) {
          setTimeout(() => {
            this.popup.hideOnBlur(this._resolveValue.bind(this, true));
          }, 10);
        }
      }
    }
    _styleItem(item) {
      if (item && item.element) {
        if (item.selected) {
          item.element.classList.add("active");
        } else {
          item.element.classList.remove("active");
        }
      }
    }
    //////////////////////////////////////
    ///////// User Interaction ///////////
    //////////////////////////////////////
    _itemClick(item, e) {
      e.stopPropagation();
      this._chooseItem(item);
    }
    _groupClick(item, e) {
      e.stopPropagation();
    }
    //////////////////////////////////////
    ////// Current Item Management ///////
    //////////////////////////////////////
    _cancel() {
      this.popup.hide(true);
      this.actions.cancel();
    }
    _clearChoices() {
      this.typing = true;
      this.currentItems.forEach((item) => {
        item.selected = false;
        this._styleItem(item);
      });
      this.currentItems = [];
      this.focusedItem = null;
    }
    _chooseItem(item, silent) {
      var index;
      this.typing = false;
      if (this.params.multiselect) {
        index = this.currentItems.indexOf(item);
        if (index > -1) {
          this.currentItems.splice(index, 1);
          item.selected = false;
        } else {
          this.currentItems.push(item);
          item.selected = true;
        }
        this.input.value = this.currentItems.map((item2) => item2.label).join(",");
        this._styleItem(item);
      } else {
        this.currentItems = [item];
        item.selected = true;
        this.input.value = item.label;
        this._styleItem(item);
        if (!silent) {
          this._resolveValue();
        }
      }
      this._focusItem(item);
    }
    _resolveValue(blur) {
      var output, initialValue;
      if (this.popup) {
        this.popup.hide(true);
      }
      if (this.params.multiselect) {
        output = this.currentItems.map((item) => item.value);
      } else {
        if (blur && this.params.autocomplete && this.typing) {
          if (this.params.freetext || this.params.allowEmpty && this.input.value === "") {
            output = this.input.value;
          } else {
            this.actions.cancel();
            return;
          }
        } else {
          if (this.currentItems[0]) {
            output = this.currentItems[0].value;
          } else {
            initialValue = Array.isArray(this.initialValues) ? this.initialValues[0] : this.initialValues;
            if (initialValue === null || typeof initialValue === "undefined" || initialValue === "") {
              output = initialValue;
            } else {
              output = this.params.emptyValue;
            }
          }
        }
      }
      if (output === "") {
        output = this.params.emptyValue;
      }
      this.actions.success(output);
      if (this.isFilter) {
        this.initialValues = output && !Array.isArray(output) ? [output] : output;
        this.currentItems = [];
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/list.js
  function list_default(cell, onRendered, success, cancel, editorParams) {
    var list = new Edit(this, cell, onRendered, success, cancel, editorParams);
    return list.input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/star.js
  function star_default(cell, onRendered, success, cancel, editorParams) {
    var self = this, element = cell.getElement(), value = cell.getValue(), maxStars = element.getElementsByTagName("svg").length || 5, size = element.getElementsByTagName("svg")[0] ? element.getElementsByTagName("svg")[0].getAttribute("width") : 14, stars = [], starsHolder = document.createElement("div"), star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    function starChange(val) {
      stars.forEach(function(star2, i2) {
        if (i2 < val) {
          if (self.table.browser == "ie") {
            star2.setAttribute("class", "tabulator-star-active");
          } else {
            star2.classList.replace("tabulator-star-inactive", "tabulator-star-active");
          }
          star2.innerHTML = '<polygon fill="#488CE9" stroke="#014AAE" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';
        } else {
          if (self.table.browser == "ie") {
            star2.setAttribute("class", "tabulator-star-inactive");
          } else {
            star2.classList.replace("tabulator-star-active", "tabulator-star-inactive");
          }
          star2.innerHTML = '<polygon fill="#010155" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';
        }
      });
    }
    function buildStar(i2) {
      var starHolder = document.createElement("span");
      var nextStar = star.cloneNode(true);
      stars.push(nextStar);
      starHolder.addEventListener("mouseenter", function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        starChange(i2);
      });
      starHolder.addEventListener("mousemove", function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
      starHolder.addEventListener("click", function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        success(i2);
        element.blur();
      });
      starHolder.appendChild(nextStar);
      starsHolder.appendChild(starHolder);
    }
    function changeValue(val) {
      value = val;
      starChange(val);
    }
    element.style.whiteSpace = "nowrap";
    element.style.overflow = "hidden";
    element.style.textOverflow = "ellipsis";
    starsHolder.style.verticalAlign = "middle";
    starsHolder.style.display = "inline-block";
    starsHolder.style.padding = "4px";
    star.setAttribute("width", size);
    star.setAttribute("height", size);
    star.setAttribute("viewBox", "0 0 512 512");
    star.setAttribute("xml:space", "preserve");
    star.style.padding = "0 1px";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          starsHolder.setAttribute(key, starsHolder.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          starsHolder.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    for (var i = 1; i <= maxStars; i++) {
      buildStar(i);
    }
    value = Math.min(parseInt(value), maxStars);
    starChange(value);
    starsHolder.addEventListener("mousemove", function(e) {
      starChange(0);
    });
    starsHolder.addEventListener("click", function(e) {
      success(0);
    });
    element.addEventListener("blur", function(e) {
      cancel();
    });
    element.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 39:
          changeValue(value + 1);
          break;
        case 37:
          changeValue(value - 1);
          break;
        case 13:
          success(value);
          break;
        case 27:
          cancel();
          break;
      }
    });
    return starsHolder;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/progress.js
  function progress_default(cell, onRendered, success, cancel, editorParams) {
    var element = cell.getElement(), max = typeof editorParams.max === "undefined" ? element.getElementsByTagName("div")[0] && element.getElementsByTagName("div")[0].getAttribute("max") || 100 : editorParams.max, min = typeof editorParams.min === "undefined" ? element.getElementsByTagName("div")[0] && element.getElementsByTagName("div")[0].getAttribute("min") || 0 : editorParams.min, percent = (max - min) / 100, value = cell.getValue() || 0, handle = document.createElement("div"), bar = document.createElement("div"), mouseDrag, mouseDragWidth;
    function updateValue() {
      var style = window.getComputedStyle(element, null);
      var calcVal = percent * Math.round(bar.offsetWidth / ((element.clientWidth - parseInt(style.getPropertyValue("padding-left")) - parseInt(style.getPropertyValue("padding-right"))) / 100)) + min;
      success(calcVal);
      element.setAttribute("aria-valuenow", calcVal);
      element.setAttribute("aria-label", value);
    }
    handle.style.position = "absolute";
    handle.style.right = "0";
    handle.style.top = "0";
    handle.style.bottom = "0";
    handle.style.width = "5px";
    handle.classList.add("tabulator-progress-handle");
    bar.style.display = "inline-block";
    bar.style.position = "relative";
    bar.style.height = "100%";
    bar.style.backgroundColor = "#488CE9";
    bar.style.maxWidth = "100%";
    bar.style.minWidth = "0%";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          bar.setAttribute(key, bar.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          bar.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    element.style.padding = "4px 4px";
    value = Math.min(parseFloat(value), max);
    value = Math.max(parseFloat(value), min);
    value = Math.round((value - min) / percent);
    bar.style.width = value + "%";
    element.setAttribute("aria-valuemin", min);
    element.setAttribute("aria-valuemax", max);
    bar.appendChild(handle);
    handle.addEventListener("mousedown", function(e) {
      mouseDrag = e.screenX;
      mouseDragWidth = bar.offsetWidth;
    });
    handle.addEventListener("mouseover", function() {
      handle.style.cursor = "ew-resize";
    });
    element.addEventListener("mousemove", function(e) {
      if (mouseDrag) {
        bar.style.width = mouseDragWidth + e.screenX - mouseDrag + "px";
      }
    });
    element.addEventListener("mouseup", function(e) {
      if (mouseDrag) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        mouseDrag = false;
        mouseDragWidth = false;
        updateValue();
      }
    });
    element.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 39:
          e.preventDefault();
          bar.style.width = bar.clientWidth + element.clientWidth / 100 + "px";
          break;
        case 37:
          e.preventDefault();
          bar.style.width = bar.clientWidth - element.clientWidth / 100 + "px";
          break;
        case 9:
        case 13:
          updateValue();
          break;
        case 27:
          cancel();
          break;
      }
    });
    element.addEventListener("blur", function() {
      cancel();
    });
    return bar;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors/tickCross.js
  function tickCross_default(cell, onRendered, success, cancel, editorParams) {
    var value = cell.getValue(), input = document.createElement("input"), tristate = editorParams.tristate, indetermValue = typeof editorParams.indeterminateValue === "undefined" ? null : editorParams.indeterminateValue, indetermState = false, trueValueSet = Object.keys(editorParams).includes("trueValue"), falseValueSet = Object.keys(editorParams).includes("falseValue");
    input.setAttribute("type", "checkbox");
    input.style.marginTop = "5px";
    input.style.boxSizing = "border-box";
    if (editorParams.elementAttributes && typeof editorParams.elementAttributes == "object") {
      for (let key in editorParams.elementAttributes) {
        if (key.charAt(0) == "+") {
          key = key.slice(1);
          input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
        } else {
          input.setAttribute(key, editorParams.elementAttributes[key]);
        }
      }
    }
    input.value = value;
    if (tristate && (typeof value === "undefined" || value === indetermValue || value === "")) {
      indetermState = true;
      input.indeterminate = true;
    }
    if (this.table.browser != "firefox" && this.table.browser != "safari") {
      onRendered(function() {
        if (cell.getType() === "cell") {
          input.focus({ preventScroll: true });
        }
      });
    }
    input.checked = trueValueSet ? value === editorParams.trueValue : value === true || value === "true" || value === "True" || value === 1;
    function setValue(blur) {
      var checkedValue = input.checked;
      if (trueValueSet && checkedValue) {
        checkedValue = editorParams.trueValue;
      } else if (falseValueSet && !checkedValue) {
        checkedValue = editorParams.falseValue;
      }
      if (tristate) {
        if (!blur) {
          if (input.checked && !indetermState) {
            input.checked = false;
            input.indeterminate = true;
            indetermState = true;
            return indetermValue;
          } else {
            indetermState = false;
            return checkedValue;
          }
        } else {
          if (indetermState) {
            return indetermValue;
          } else {
            return checkedValue;
          }
        }
      } else {
        return checkedValue;
      }
    }
    input.addEventListener("change", function(e) {
      success(setValue());
    });
    input.addEventListener("blur", function(e) {
      success(setValue(true));
    });
    input.addEventListener("keydown", function(e) {
      if (e.keyCode == 13) {
        success(setValue());
      }
      if (e.keyCode == 27) {
        cancel();
      }
    });
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Edit/defaults/editors.js
  var editors_default = {
    input: input_default,
    textarea: textarea_default,
    number: number_default,
    range: range_default,
    date: date_default,
    time: time_default,
    datetime: datetime_default,
    list: list_default,
    star: star_default,
    progress: progress_default,
    tickCross: tickCross_default
  };

  // node_modules/tabulator-tables/src/js/modules/Edit/Edit.js
  var Edit2 = class _Edit extends Module {
    static moduleName = "edit";
    //load defaults
    static editors = editors_default;
    constructor(table) {
      super(table);
      this.currentCell = false;
      this.mouseClick = false;
      this.recursionBlock = false;
      this.invalidEdit = false;
      this.editedCells = [];
      this.convertEmptyValues = false;
      this.editors = _Edit.editors;
      this.registerTableOption("editTriggerEvent", "focus");
      this.registerTableOption("editorEmptyValue");
      this.registerTableOption("editorEmptyValueFunc", this.emptyValueCheck.bind(this));
      this.registerColumnOption("editable");
      this.registerColumnOption("editor");
      this.registerColumnOption("editorParams");
      this.registerColumnOption("editorEmptyValue");
      this.registerColumnOption("editorEmptyValueFunc");
      this.registerColumnOption("cellEditing");
      this.registerColumnOption("cellEdited");
      this.registerColumnOption("cellEditCancelled");
      this.registerTableFunction("getEditedCells", this.getEditedCells.bind(this));
      this.registerTableFunction("clearCellEdited", this.clearCellEdited.bind(this));
      this.registerTableFunction("navigatePrev", this.navigatePrev.bind(this));
      this.registerTableFunction("navigateNext", this.navigateNext.bind(this));
      this.registerTableFunction("navigateLeft", this.navigateLeft.bind(this));
      this.registerTableFunction("navigateRight", this.navigateRight.bind(this));
      this.registerTableFunction("navigateUp", this.navigateUp.bind(this));
      this.registerTableFunction("navigateDown", this.navigateDown.bind(this));
      this.registerComponentFunction("cell", "isEdited", this.cellIsEdited.bind(this));
      this.registerComponentFunction("cell", "clearEdited", this.clearEdited.bind(this));
      this.registerComponentFunction("cell", "edit", this.editCell.bind(this));
      this.registerComponentFunction("cell", "cancelEdit", this.cellCancelEdit.bind(this));
      this.registerComponentFunction("cell", "navigatePrev", this.navigatePrev.bind(this));
      this.registerComponentFunction("cell", "navigateNext", this.navigateNext.bind(this));
      this.registerComponentFunction("cell", "navigateLeft", this.navigateLeft.bind(this));
      this.registerComponentFunction("cell", "navigateRight", this.navigateRight.bind(this));
      this.registerComponentFunction("cell", "navigateUp", this.navigateUp.bind(this));
      this.registerComponentFunction("cell", "navigateDown", this.navigateDown.bind(this));
    }
    initialize() {
      this.subscribe("cell-init", this.bindEditor.bind(this));
      this.subscribe("cell-delete", this.clearEdited.bind(this));
      this.subscribe("cell-value-changed", this.updateCellClass.bind(this));
      this.subscribe("column-layout", this.initializeColumnCheck.bind(this));
      this.subscribe("column-delete", this.columnDeleteCheck.bind(this));
      this.subscribe("row-deleting", this.rowDeleteCheck.bind(this));
      this.subscribe("row-layout", this.rowEditableCheck.bind(this));
      this.subscribe("data-refreshing", this.cancelEdit.bind(this));
      this.subscribe("clipboard-paste", this.pasteBlocker.bind(this));
      this.subscribe("keybinding-nav-prev", this.navigatePrev.bind(this, void 0));
      this.subscribe("keybinding-nav-next", this.keybindingNavigateNext.bind(this));
      this.subscribe("keybinding-nav-up", this.navigateUp.bind(this, void 0));
      this.subscribe("keybinding-nav-down", this.navigateDown.bind(this, void 0));
      if (Object.keys(this.table.options).includes("editorEmptyValue")) {
        this.convertEmptyValues = true;
      }
    }
    ///////////////////////////////////
    ///////// Paste Negation //////////
    ///////////////////////////////////
    pasteBlocker(e) {
      if (this.currentCell) {
        return true;
      }
    }
    ///////////////////////////////////
    ////// Keybinding Functions ///////
    ///////////////////////////////////
    keybindingNavigateNext(e) {
      var cell = this.currentCell, newRow = this.options("tabEndNewRow");
      if (cell) {
        if (!this.navigateNext(cell, e)) {
          if (newRow) {
            cell.getElement().firstChild.blur();
            if (!this.invalidEdit) {
              if (newRow === true) {
                newRow = this.table.addRow({});
              } else {
                if (typeof newRow == "function") {
                  newRow = this.table.addRow(newRow(cell.row.getComponent()));
                } else {
                  newRow = this.table.addRow(Object.assign({}, newRow));
                }
              }
              newRow.then(() => {
                setTimeout(() => {
                  cell.getComponent().navigateNext();
                });
              });
            }
          }
        }
      }
    }
    ///////////////////////////////////
    ///////// Cell Functions //////////
    ///////////////////////////////////
    cellIsEdited(cell) {
      return !!cell.modules.edit && cell.modules.edit.edited;
    }
    cellCancelEdit(cell) {
      if (cell === this.currentCell) {
        this.table.modules.edit.cancelEdit();
      } else {
        console.warn("Cancel Editor Error - This cell is not currently being edited ");
      }
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    updateCellClass(cell) {
      if (this.allowEdit(cell)) {
        cell.getElement().classList.add("tabulator-editable");
      } else {
        cell.getElement().classList.remove("tabulator-editable");
      }
    }
    clearCellEdited(cells) {
      if (!cells) {
        cells = this.table.modules.edit.getEditedCells();
      }
      if (!Array.isArray(cells)) {
        cells = [cells];
      }
      cells.forEach((cell) => {
        this.table.modules.edit.clearEdited(cell._getSelf());
      });
    }
    navigatePrev(cell = this.currentCell, e) {
      var nextCell, prevRow;
      if (cell) {
        if (e) {
          e.preventDefault();
        }
        nextCell = this.navigateLeft();
        if (nextCell) {
          return true;
        } else {
          prevRow = this.table.rowManager.prevDisplayRow(cell.row, true);
          if (prevRow) {
            nextCell = this.findPrevEditableCell(prevRow, prevRow.cells.length);
            if (nextCell) {
              nextCell.getComponent().edit();
              return true;
            }
          }
        }
      }
      return false;
    }
    navigateNext(cell = this.currentCell, e) {
      var nextCell, nextRow;
      if (cell) {
        if (e) {
          e.preventDefault();
        }
        nextCell = this.navigateRight();
        if (nextCell) {
          return true;
        } else {
          nextRow = this.table.rowManager.nextDisplayRow(cell.row, true);
          if (nextRow) {
            nextCell = this.findNextEditableCell(nextRow, -1);
            if (nextCell) {
              nextCell.getComponent().edit();
              return true;
            }
          }
        }
      }
      return false;
    }
    navigateLeft(cell = this.currentCell, e) {
      var index, nextCell;
      if (cell) {
        if (e) {
          e.preventDefault();
        }
        index = cell.getIndex();
        nextCell = this.findPrevEditableCell(cell.row, index);
        if (nextCell) {
          nextCell.getComponent().edit();
          return true;
        }
      }
      return false;
    }
    navigateRight(cell = this.currentCell, e) {
      var index, nextCell;
      if (cell) {
        if (e) {
          e.preventDefault();
        }
        index = cell.getIndex();
        nextCell = this.findNextEditableCell(cell.row, index);
        if (nextCell) {
          nextCell.getComponent().edit();
          return true;
        }
      }
      return false;
    }
    navigateUp(cell = this.currentCell, e) {
      var index, nextRow;
      if (cell) {
        if (e) {
          e.preventDefault();
        }
        index = cell.getIndex();
        nextRow = this.table.rowManager.prevDisplayRow(cell.row, true);
        if (nextRow) {
          nextRow.cells[index].getComponent().edit();
          return true;
        }
      }
      return false;
    }
    navigateDown(cell = this.currentCell, e) {
      var index, nextRow;
      if (cell) {
        if (e) {
          e.preventDefault();
        }
        index = cell.getIndex();
        nextRow = this.table.rowManager.nextDisplayRow(cell.row, true);
        if (nextRow) {
          nextRow.cells[index].getComponent().edit();
          return true;
        }
      }
      return false;
    }
    findNextEditableCell(row, index) {
      var nextCell = false;
      if (index < row.cells.length - 1) {
        for (var i = index + 1; i < row.cells.length; i++) {
          let cell = row.cells[i];
          if (cell.column.modules.edit && Helpers.elVisible(cell.getElement())) {
            let allowEdit = this.allowEdit(cell);
            if (allowEdit) {
              nextCell = cell;
              break;
            }
          }
        }
      }
      return nextCell;
    }
    findPrevEditableCell(row, index) {
      var prevCell = false;
      if (index > 0) {
        for (var i = index - 1; i >= 0; i--) {
          let cell = row.cells[i];
          if (cell.column.modules.edit && Helpers.elVisible(cell.getElement())) {
            let allowEdit = this.allowEdit(cell);
            if (allowEdit) {
              prevCell = cell;
              break;
            }
          }
        }
      }
      return prevCell;
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    initializeColumnCheck(column) {
      if (typeof column.definition.editor !== "undefined") {
        this.initializeColumn(column);
      }
    }
    columnDeleteCheck(column) {
      if (this.currentCell && this.currentCell.column === column) {
        this.cancelEdit();
      }
    }
    rowDeleteCheck(row) {
      if (this.currentCell && this.currentCell.row === row) {
        this.cancelEdit();
      }
    }
    rowEditableCheck(row) {
      row.getCells().forEach((cell) => {
        if (cell.column.modules.edit && typeof cell.column.modules.edit.check === "function") {
          this.updateCellClass(cell);
        }
      });
    }
    //initialize column editor
    initializeColumn(column) {
      var convertEmpty = Object.keys(column.definition).includes("editorEmptyValue");
      var config = {
        editor: false,
        blocked: false,
        check: column.definition.editable,
        params: column.definition.editorParams || {},
        convertEmptyValues: convertEmpty,
        editorEmptyValue: column.definition.editorEmptyValue,
        editorEmptyValueFunc: column.definition.editorEmptyValueFunc
      };
      switch (typeof column.definition.editor) {
        case "string":
          if (this.editors[column.definition.editor]) {
            config.editor = this.editors[column.definition.editor];
          } else {
            console.warn("Editor Error - No such editor found: ", column.definition.editor);
          }
          break;
        case "function":
          config.editor = column.definition.editor;
          break;
        case "boolean":
          if (column.definition.editor === true) {
            if (typeof column.definition.formatter !== "function") {
              if (this.editors[column.definition.formatter]) {
                config.editor = this.editors[column.definition.formatter];
              } else {
                config.editor = this.editors["input"];
              }
            } else {
              console.warn("Editor Error - Cannot auto lookup editor for a custom formatter: ", column.definition.formatter);
            }
          }
          break;
      }
      if (config.editor) {
        column.modules.edit = config;
      }
    }
    getCurrentCell() {
      return this.currentCell ? this.currentCell.getComponent() : false;
    }
    clearEditor(cancel) {
      var cell = this.currentCell, cellEl;
      this.invalidEdit = false;
      if (cell) {
        this.currentCell = false;
        cellEl = cell.getElement();
        this.dispatch("edit-editor-clear", cell, cancel);
        cellEl.classList.remove("tabulator-editing");
        while (cellEl.firstChild) cellEl.removeChild(cellEl.firstChild);
        cell.row.getElement().classList.remove("tabulator-editing");
        cell.table.element.classList.remove("tabulator-editing");
      }
    }
    cancelEdit() {
      if (this.currentCell) {
        var cell = this.currentCell;
        var component = this.currentCell.getComponent();
        this.clearEditor(true);
        cell.setValueActual(cell.getValue());
        cell.cellRendered();
        if (cell.column.definition.editor == "textarea" || cell.column.definition.variableHeight) {
          cell.row.normalizeHeight(true);
        }
        if (cell.column.definition.cellEditCancelled) {
          cell.column.definition.cellEditCancelled.call(this.table, component);
        }
        this.dispatch("edit-cancelled", cell);
        this.dispatchExternal("cellEditCancelled", component);
      }
    }
    //return a formatted value for a cell
    bindEditor(cell) {
      if (cell.column.modules.edit) {
        var self = this, element = cell.getElement(true);
        this.updateCellClass(cell);
        element.setAttribute("tabindex", 0);
        element.addEventListener("mousedown", function(e) {
          if (e.button === 2) {
            e.preventDefault();
          } else {
            self.mouseClick = true;
          }
        });
        if (this.options("editTriggerEvent") === "dblclick") {
          element.addEventListener("dblclick", function(e) {
            if (!element.classList.contains("tabulator-editing")) {
              element.focus({ preventScroll: true });
              self.edit(cell, e, false);
            }
          });
        }
        if (this.options("editTriggerEvent") === "focus" || this.options("editTriggerEvent") === "click") {
          element.addEventListener("click", function(e) {
            if (!element.classList.contains("tabulator-editing")) {
              element.focus({ preventScroll: true });
              self.edit(cell, e, false);
            }
          });
        }
        if (this.options("editTriggerEvent") === "focus") {
          element.addEventListener("focus", function(e) {
            if (!self.recursionBlock) {
              self.edit(cell, e, false);
            }
          });
        }
      }
    }
    focusCellNoEvent(cell, block) {
      this.recursionBlock = true;
      if (!(block && this.table.browser === "ie")) {
        cell.getElement().focus({ preventScroll: true });
      }
      this.recursionBlock = false;
    }
    editCell(cell, forceEdit) {
      this.focusCellNoEvent(cell);
      this.edit(cell, false, forceEdit);
    }
    focusScrollAdjust(cell) {
      if (this.table.rowManager.getRenderMode() == "virtual") {
        var topEdge = this.table.rowManager.element.scrollTop, bottomEdge = this.table.rowManager.element.clientHeight + this.table.rowManager.element.scrollTop, rowEl = cell.row.getElement();
        if (rowEl.offsetTop < topEdge) {
          this.table.rowManager.element.scrollTop -= topEdge - rowEl.offsetTop;
        } else {
          if (rowEl.offsetTop + rowEl.offsetHeight > bottomEdge) {
            this.table.rowManager.element.scrollTop += rowEl.offsetTop + rowEl.offsetHeight - bottomEdge;
          }
        }
        var leftEdge = this.table.rowManager.element.scrollLeft, rightEdge = this.table.rowManager.element.clientWidth + this.table.rowManager.element.scrollLeft, cellEl = cell.getElement();
        if (this.table.modExists("frozenColumns")) {
          leftEdge += parseInt(this.table.modules.frozenColumns.leftMargin || 0);
          rightEdge -= parseInt(this.table.modules.frozenColumns.rightMargin || 0);
        }
        if (this.table.options.renderHorizontal === "virtual") {
          leftEdge -= parseInt(this.table.columnManager.renderer.vDomPadLeft);
          rightEdge -= parseInt(this.table.columnManager.renderer.vDomPadLeft);
        }
        if (cellEl.offsetLeft < leftEdge) {
          this.table.rowManager.element.scrollLeft -= leftEdge - cellEl.offsetLeft;
        } else {
          if (cellEl.offsetLeft + cellEl.offsetWidth > rightEdge) {
            this.table.rowManager.element.scrollLeft += cellEl.offsetLeft + cellEl.offsetWidth - rightEdge;
          }
        }
      }
    }
    allowEdit(cell) {
      var check = cell.column.modules.edit ? true : false;
      if (cell.column.modules.edit) {
        switch (typeof cell.column.modules.edit.check) {
          case "function":
            if (cell.row.initialized) {
              check = cell.column.modules.edit.check(cell.getComponent());
            }
            break;
          case "string":
            check = !!cell.row.data[cell.column.modules.edit.check];
            break;
          case "boolean":
            check = cell.column.modules.edit.check;
            break;
        }
      }
      return check;
    }
    edit(cell, e, forceEdit) {
      var self = this, allowEdit = true, rendered = function() {
      }, element = cell.getElement(), editFinished = false, cellEditor, component, params;
      if (this.currentCell) {
        if (!this.invalidEdit && this.currentCell !== cell) {
          this.cancelEdit();
        }
        return;
      }
      function success(value) {
        if (self.currentCell === cell && !editFinished) {
          var valid = self.chain("edit-success", [cell, value], true, true);
          if (valid === true || self.table.options.validationMode === "highlight") {
            editFinished = true;
            self.clearEditor();
            if (!cell.modules.edit) {
              cell.modules.edit = {};
            }
            cell.modules.edit.edited = true;
            if (self.editedCells.indexOf(cell) == -1) {
              self.editedCells.push(cell);
            }
            value = self.transformEmptyValues(value, cell);
            cell.setValue(value, true);
            return valid === true;
          } else {
            editFinished = true;
            self.invalidEdit = true;
            self.focusCellNoEvent(cell, true);
            rendered();
            setTimeout(() => {
              editFinished = false;
            }, 10);
            return false;
          }
        } else {
        }
      }
      function cancel() {
        if (self.currentCell === cell && !editFinished) {
          self.cancelEdit();
        } else {
        }
      }
      function onRendered(callback) {
        rendered = callback;
      }
      if (!cell.column.modules.edit.blocked) {
        if (e) {
          e.stopPropagation();
        }
        allowEdit = this.allowEdit(cell);
        if (allowEdit || forceEdit) {
          self.cancelEdit();
          self.currentCell = cell;
          this.focusScrollAdjust(cell);
          component = cell.getComponent();
          if (this.mouseClick) {
            this.mouseClick = false;
            if (cell.column.definition.cellClick) {
              cell.column.definition.cellClick.call(this.table, e, component);
            }
          }
          if (cell.column.definition.cellEditing) {
            cell.column.definition.cellEditing.call(this.table, component);
          }
          this.dispatch("cell-editing", cell);
          this.dispatchExternal("cellEditing", component);
          params = typeof cell.column.modules.edit.params === "function" ? cell.column.modules.edit.params(component) : cell.column.modules.edit.params;
          cellEditor = cell.column.modules.edit.editor.call(self, component, onRendered, success, cancel, params);
          if (this.currentCell && cellEditor !== false) {
            if (cellEditor instanceof Node) {
              element.classList.add("tabulator-editing");
              cell.row.getElement().classList.add("tabulator-editing");
              cell.table.element.classList.add("tabulator-editing");
              while (element.firstChild) element.removeChild(element.firstChild);
              element.appendChild(cellEditor);
              rendered();
              var children = element.children;
              for (var i = 0; i < children.length; i++) {
                children[i].addEventListener("click", function(e2) {
                  e2.stopPropagation();
                });
              }
            } else {
              console.warn("Edit Error - Editor should return an instance of Node, the editor returned:", cellEditor);
              this.blur(element);
              return false;
            }
          } else {
            this.blur(element);
            return false;
          }
          return true;
        } else {
          this.mouseClick = false;
          this.blur(element);
          return false;
        }
      } else {
        this.mouseClick = false;
        this.blur(element);
        return false;
      }
    }
    emptyValueCheck(value) {
      return value === "" || value === null || typeof value === "undefined";
    }
    transformEmptyValues(value, cell) {
      var mod = cell.column.modules.edit, convert = mod.convertEmptyValues || this.convertEmptyValues, checkFunc;
      if (convert) {
        checkFunc = mod.editorEmptyValueFunc || this.options("editorEmptyValueFunc");
        if (checkFunc && checkFunc(value)) {
          value = mod.convertEmptyValues ? mod.editorEmptyValue : this.options("editorEmptyValue");
        }
      }
      return value;
    }
    blur(element) {
      if (!this.confirm("edit-blur", [element])) {
        element.blur();
      }
    }
    getEditedCells() {
      var output = [];
      this.editedCells.forEach((cell) => {
        output.push(cell.getComponent());
      });
      return output;
    }
    clearEdited(cell) {
      var editIndex;
      if (cell.modules.edit && cell.modules.edit.edited) {
        cell.modules.edit.edited = false;
        this.dispatch("edit-edited-clear", cell);
      }
      editIndex = this.editedCells.indexOf(cell);
      if (editIndex > -1) {
        this.editedCells.splice(editIndex, 1);
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Export/ExportRow.js
  var ExportRow = class {
    constructor(type, columns, component, indent) {
      this.type = type;
      this.columns = columns;
      this.component = component || false;
      this.indent = indent || 0;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Export/ExportColumn.js
  var ExportColumn = class {
    constructor(value, component, width, height, depth) {
      this.value = value;
      this.component = component || false;
      this.width = width;
      this.height = height;
      this.depth = depth;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Export/defaults/columnLookups.js
  var columnLookups_default = {};

  // node_modules/tabulator-tables/src/js/modules/Export/defaults/rowLookups.js
  var rowLookups_default = {
    visible: function() {
      return this.rowManager.getVisibleRows(false, true);
    },
    all: function() {
      return this.rowManager.rows;
    },
    selected: function() {
      return this.modules.selectRow.selectedRows;
    },
    active: function() {
      if (this.options.pagination) {
        return this.rowManager.getDisplayRows(this.rowManager.displayRows.length - 2);
      } else {
        return this.rowManager.getDisplayRows();
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Export/Export.js
  var Export = class _Export extends Module {
    static moduleName = "export";
    static columnLookups = columnLookups_default;
    static rowLookups = rowLookups_default;
    constructor(table) {
      super(table);
      this.config = {};
      this.cloneTableStyle = true;
      this.colVisProp = "";
      this.colVisPropAttach = "";
      this.registerTableOption("htmlOutputConfig", false);
      this.registerColumnOption("htmlOutput");
      this.registerColumnOption("titleHtmlOutput");
    }
    initialize() {
      this.registerTableFunction("getHtml", this.getHtml.bind(this));
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    generateExportList(config, style, range, colVisProp) {
      var headers, body, columns, colLookup;
      this.cloneTableStyle = style;
      this.config = config || {};
      this.colVisProp = colVisProp;
      this.colVisPropAttach = this.colVisProp.charAt(0).toUpperCase() + this.colVisProp.slice(1);
      colLookup = _Export.columnLookups[range];
      if (colLookup) {
        columns = colLookup.call(this.table);
        columns = columns.filter((col) => this.columnVisCheck(col));
      }
      headers = this.config.columnHeaders !== false ? this.headersToExportRows(this.generateColumnGroupHeaders(columns)) : [];
      if (columns) {
        columns = columns.map((col) => col.getComponent());
      }
      body = this.bodyToExportRows(this.rowLookup(range), columns);
      return headers.concat(body);
    }
    generateTable(config, style, range, colVisProp) {
      var list = this.generateExportList(config, style, range, colVisProp);
      return this.generateTableElement(list);
    }
    rowLookup(range) {
      var rows = [], rowLookup;
      if (typeof range == "function") {
        range.call(this.table).forEach((row) => {
          row = this.table.rowManager.findRow(row);
          if (row) {
            rows.push(row);
          }
        });
      } else {
        rowLookup = _Export.rowLookups[range] || _Export.rowLookups["active"];
        rows = rowLookup.call(this.table);
      }
      return Object.assign([], rows);
    }
    generateColumnGroupHeaders(columns) {
      var output = [];
      if (!columns) {
        columns = this.config.columnGroups !== false ? this.table.columnManager.columns : this.table.columnManager.columnsByIndex;
      }
      columns.forEach((column) => {
        var colData = this.processColumnGroup(column);
        if (colData) {
          output.push(colData);
        }
      });
      return output;
    }
    processColumnGroup(column) {
      var subGroups = column.columns, maxDepth = 0, title = column.definition["title" + this.colVisPropAttach] || column.definition.title;
      var groupData = {
        title,
        column,
        depth: 1
      };
      if (subGroups.length) {
        groupData.subGroups = [];
        groupData.width = 0;
        subGroups.forEach((subGroup) => {
          var subGroupData = this.processColumnGroup(subGroup);
          if (subGroupData) {
            groupData.width += subGroupData.width;
            groupData.subGroups.push(subGroupData);
            if (subGroupData.depth > maxDepth) {
              maxDepth = subGroupData.depth;
            }
          }
        });
        groupData.depth += maxDepth;
        if (!groupData.width) {
          return false;
        }
      } else {
        if (this.columnVisCheck(column)) {
          groupData.width = 1;
        } else {
          return false;
        }
      }
      return groupData;
    }
    columnVisCheck(column) {
      var visProp = column.definition[this.colVisProp];
      if (this.config.rowHeaders === false && column.isRowHeader) {
        return false;
      }
      if (typeof visProp === "function") {
        visProp = visProp.call(this.table, column.getComponent());
      }
      if (visProp === false || visProp === true) {
        return visProp;
      }
      return column.visible && column.field;
    }
    headersToExportRows(columns) {
      var headers = [], headerDepth = 0, exportRows = [];
      function parseColumnGroup(column, level) {
        var depth = headerDepth - level;
        if (typeof headers[level] === "undefined") {
          headers[level] = [];
        }
        column.height = column.subGroups ? 1 : depth - column.depth + 1;
        headers[level].push(column);
        if (column.height > 1) {
          for (let i = 1; i < column.height; i++) {
            if (typeof headers[level + i] === "undefined") {
              headers[level + i] = [];
            }
            headers[level + i].push(false);
          }
        }
        if (column.width > 1) {
          for (let i = 1; i < column.width; i++) {
            headers[level].push(false);
          }
        }
        if (column.subGroups) {
          column.subGroups.forEach(function(subGroup) {
            parseColumnGroup(subGroup, level + 1);
          });
        }
      }
      columns.forEach(function(column) {
        if (column.depth > headerDepth) {
          headerDepth = column.depth;
        }
      });
      columns.forEach(function(column) {
        parseColumnGroup(column, 0);
      });
      headers.forEach((header) => {
        var columns2 = [];
        header.forEach((col) => {
          if (col) {
            let title = typeof col.title === "undefined" ? "" : col.title;
            columns2.push(new ExportColumn(title, col.column.getComponent(), col.width, col.height, col.depth));
          } else {
            columns2.push(null);
          }
        });
        exportRows.push(new ExportRow("header", columns2));
      });
      return exportRows;
    }
    bodyToExportRows(rows, columns = []) {
      var exportRows = [];
      if (columns.length === 0) {
        this.table.columnManager.columnsByIndex.forEach((column) => {
          if (this.columnVisCheck(column)) {
            columns.push(column.getComponent());
          }
        });
      }
      if (this.config.columnCalcs !== false && this.table.modExists("columnCalcs")) {
        if (this.table.modules.columnCalcs.topInitialized) {
          rows.unshift(this.table.modules.columnCalcs.topRow);
        }
        if (this.table.modules.columnCalcs.botInitialized) {
          rows.push(this.table.modules.columnCalcs.botRow);
        }
      }
      rows = rows.filter((row) => {
        switch (row.type) {
          case "group":
            return this.config.rowGroups !== false;
          case "calc":
            return this.config.columnCalcs !== false;
          case "row":
            return !(this.table.options.dataTree && this.config.dataTree === false && row.modules.dataTree.parent);
        }
        return true;
      });
      rows.forEach((row, i) => {
        var rowData = row.getData(this.colVisProp);
        var exportCols = [];
        var indent = 0;
        switch (row.type) {
          case "group":
            indent = row.level;
            exportCols.push(new ExportColumn(row.key, row.getComponent(), columns.length, 1));
            break;
          case "calc":
          case "row":
            columns.forEach((col) => {
              exportCols.push(new ExportColumn(col._column.getFieldValue(rowData), col, 1, 1));
            });
            if (this.table.options.dataTree && this.config.dataTree !== false) {
              indent = row.modules.dataTree.index;
            }
            break;
        }
        exportRows.push(new ExportRow(row.type, exportCols, row.getComponent(), indent));
      });
      return exportRows;
    }
    generateTableElement(list) {
      var table = document.createElement("table"), headerEl = document.createElement("thead"), bodyEl = document.createElement("tbody"), styles = this.lookupTableStyles(), rowFormatter = this.table.options["rowFormatter" + this.colVisPropAttach], setup = {};
      setup.rowFormatter = rowFormatter !== null ? rowFormatter : this.table.options.rowFormatter;
      if (this.table.options.dataTree && this.config.dataTree !== false && this.table.modExists("columnCalcs")) {
        setup.treeElementField = this.table.modules.dataTree.elementField;
      }
      setup.groupHeader = this.table.options["groupHeader" + this.colVisPropAttach];
      if (setup.groupHeader && !Array.isArray(setup.groupHeader)) {
        setup.groupHeader = [setup.groupHeader];
      }
      table.classList.add("tabulator-print-table");
      this.mapElementStyles(this.table.columnManager.getHeadersElement(), headerEl, ["border-top", "border-left", "border-right", "border-bottom", "background-color", "color", "font-weight", "font-family", "font-size"]);
      if (list.length > 1e3) {
        console.warn("It may take a long time to render an HTML table with more than 1000 rows");
      }
      list.forEach((row, i) => {
        let rowEl;
        switch (row.type) {
          case "header":
            headerEl.appendChild(this.generateHeaderElement(row, setup, styles));
            break;
          case "group":
            bodyEl.appendChild(this.generateGroupElement(row, setup, styles));
            break;
          case "calc":
            bodyEl.appendChild(this.generateCalcElement(row, setup, styles));
            break;
          case "row":
            rowEl = this.generateRowElement(row, setup, styles);
            this.mapElementStyles(i % 2 && styles.evenRow ? styles.evenRow : styles.oddRow, rowEl, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]);
            bodyEl.appendChild(rowEl);
            break;
        }
      });
      if (headerEl.innerHTML) {
        table.appendChild(headerEl);
      }
      table.appendChild(bodyEl);
      this.mapElementStyles(this.table.element, table, ["border-top", "border-left", "border-right", "border-bottom"]);
      return table;
    }
    lookupTableStyles() {
      var styles = {};
      if (this.cloneTableStyle && window.getComputedStyle) {
        styles.oddRow = this.table.element.querySelector(".tabulator-row-odd:not(.tabulator-group):not(.tabulator-calcs)");
        styles.evenRow = this.table.element.querySelector(".tabulator-row-even:not(.tabulator-group):not(.tabulator-calcs)");
        styles.calcRow = this.table.element.querySelector(".tabulator-row.tabulator-calcs");
        styles.firstRow = this.table.element.querySelector(".tabulator-row:not(.tabulator-group):not(.tabulator-calcs)");
        styles.firstGroup = this.table.element.getElementsByClassName("tabulator-group")[0];
        if (styles.firstRow) {
          styles.styleCells = styles.firstRow.getElementsByClassName("tabulator-cell");
          styles.styleRowHeader = styles.firstRow.getElementsByClassName("tabulator-row-header")[0];
          styles.firstCell = styles.styleCells[0];
          styles.lastCell = styles.styleCells[styles.styleCells.length - 1];
        }
      }
      return styles;
    }
    generateHeaderElement(row, setup, styles) {
      var rowEl = document.createElement("tr");
      row.columns.forEach((column) => {
        if (column) {
          var cellEl = document.createElement("th");
          var classNames = column.component._column.definition.cssClass ? column.component._column.definition.cssClass.split(" ") : [];
          cellEl.colSpan = column.width;
          cellEl.rowSpan = column.height;
          cellEl.innerHTML = column.value;
          if (this.cloneTableStyle) {
            cellEl.style.boxSizing = "border-box";
          }
          classNames.forEach(function(className) {
            cellEl.classList.add(className);
          });
          this.mapElementStyles(column.component.getElement(), cellEl, ["text-align", "border-left", "border-right", "background-color", "color", "font-weight", "font-family", "font-size"]);
          this.mapElementStyles(column.component._column.contentElement, cellEl, ["padding-top", "padding-left", "padding-right", "padding-bottom"]);
          if (column.component._column.visible) {
            this.mapElementStyles(column.component.getElement(), cellEl, ["width"]);
          } else {
            if (column.component._column.definition.width) {
              cellEl.style.width = column.component._column.definition.width + "px";
            }
          }
          if (column.component._column.parent && column.component._column.parent.isGroup) {
            this.mapElementStyles(column.component._column.parent.groupElement, cellEl, ["border-top"]);
          } else {
            this.mapElementStyles(column.component.getElement(), cellEl, ["border-top"]);
          }
          if (column.component._column.isGroup) {
            this.mapElementStyles(column.component.getElement(), cellEl, ["border-bottom"]);
          } else {
            this.mapElementStyles(this.table.columnManager.getElement(), cellEl, ["border-bottom"]);
          }
          rowEl.appendChild(cellEl);
        }
      });
      return rowEl;
    }
    generateGroupElement(row, setup, styles) {
      var rowEl = document.createElement("tr"), cellEl = document.createElement("td"), group = row.columns[0];
      rowEl.classList.add("tabulator-print-table-row");
      if (setup.groupHeader && setup.groupHeader[row.indent]) {
        group.value = setup.groupHeader[row.indent](group.value, row.component._group.getRowCount(), row.component._group.getData(), row.component);
      } else {
        if (setup.groupHeader !== false) {
          group.value = row.component._group.generator(group.value, row.component._group.getRowCount(), row.component._group.getData(), row.component);
        }
      }
      cellEl.colSpan = group.width;
      cellEl.innerHTML = group.value;
      rowEl.classList.add("tabulator-print-table-group");
      rowEl.classList.add("tabulator-group-level-" + row.indent);
      if (group.component.isVisible()) {
        rowEl.classList.add("tabulator-group-visible");
      }
      this.mapElementStyles(styles.firstGroup, rowEl, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]);
      this.mapElementStyles(styles.firstGroup, cellEl, ["padding-top", "padding-left", "padding-right", "padding-bottom"]);
      rowEl.appendChild(cellEl);
      return rowEl;
    }
    generateCalcElement(row, setup, styles) {
      var rowEl = this.generateRowElement(row, setup, styles);
      rowEl.classList.add("tabulator-print-table-calcs");
      this.mapElementStyles(styles.calcRow, rowEl, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]);
      return rowEl;
    }
    generateRowElement(row, setup, styles) {
      var rowEl = document.createElement("tr");
      rowEl.classList.add("tabulator-print-table-row");
      row.columns.forEach((col, i) => {
        if (col) {
          var cellEl = document.createElement("td"), column = col.component._column, table = this.table, index = table.columnManager.findColumnIndex(column), value = col.value, cellStyle, styleProps;
          var cellWrapper = {
            modules: {},
            getValue: function() {
              return value;
            },
            getField: function() {
              return column.definition.field;
            },
            getElement: function() {
              return cellEl;
            },
            getType: function() {
              return "cell";
            },
            getColumn: function() {
              return column.getComponent();
            },
            getData: function() {
              return row.component.getData();
            },
            getRow: function() {
              return row.component;
            },
            getTable: function() {
              return table;
            },
            getComponent: function() {
              return cellWrapper;
            },
            column
          };
          var classNames = column.definition.cssClass ? column.definition.cssClass.split(" ") : [];
          classNames.forEach(function(className) {
            cellEl.classList.add(className);
          });
          if (this.table.modExists("format") && this.config.formatCells !== false) {
            value = this.table.modules.format.formatExportValue(cellWrapper, this.colVisProp);
          } else {
            switch (typeof value) {
              case "object":
                value = value !== null ? JSON.stringify(value) : "";
                break;
              case "undefined":
                value = "";
                break;
            }
          }
          if (value instanceof Node) {
            cellEl.appendChild(value);
          } else {
            cellEl.innerHTML = value;
          }
          styleProps = ["padding-top", "padding-left", "padding-right", "padding-bottom", "border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "text-align"];
          if (column.isRowHeader) {
            cellStyle = styles.styleRowHeader;
            styleProps.push("background-color");
          } else {
            cellStyle = styles.styleCells && styles.styleCells[index] ? styles.styleCells[index] : styles.firstCell;
          }
          if (cellStyle) {
            this.mapElementStyles(cellStyle, cellEl, styleProps);
            if (column.definition.align) {
              cellEl.style.textAlign = column.definition.align;
            }
          }
          if (this.table.options.dataTree && this.config.dataTree !== false) {
            if (setup.treeElementField && setup.treeElementField == column.field || !setup.treeElementField && i == 0) {
              if (row.component._row.modules.dataTree.controlEl) {
                cellEl.insertBefore(row.component._row.modules.dataTree.controlEl.cloneNode(true), cellEl.firstChild);
              }
              if (row.component._row.modules.dataTree.branchEl) {
                cellEl.insertBefore(row.component._row.modules.dataTree.branchEl.cloneNode(true), cellEl.firstChild);
              }
            }
          }
          rowEl.appendChild(cellEl);
          if (cellWrapper.modules.format && cellWrapper.modules.format.renderedCallback) {
            cellWrapper.modules.format.renderedCallback();
          }
        }
      });
      if (setup.rowFormatter && row.type === "row" && this.config.formatCells !== false) {
        let formatComponent = Object.assign(row.component);
        formatComponent.getElement = function() {
          return rowEl;
        };
        setup.rowFormatter(row.component);
      }
      return rowEl;
    }
    generateHTMLTable(list) {
      var holder = document.createElement("div");
      holder.appendChild(this.generateTableElement(list));
      return holder.innerHTML;
    }
    getHtml(visible, style, config, colVisProp) {
      var list = this.generateExportList(config || this.table.options.htmlOutputConfig, style, visible, colVisProp || "htmlOutput");
      return this.generateHTMLTable(list);
    }
    mapElementStyles(from, to, props) {
      if (this.cloneTableStyle && from && to) {
        var lookup = {
          "background-color": "backgroundColor",
          "color": "fontColor",
          "width": "width",
          "font-weight": "fontWeight",
          "font-family": "fontFamily",
          "font-size": "fontSize",
          "text-align": "textAlign",
          "border-top": "borderTop",
          "border-left": "borderLeft",
          "border-right": "borderRight",
          "border-bottom": "borderBottom",
          "padding-top": "paddingTop",
          "padding-left": "paddingLeft",
          "padding-right": "paddingRight",
          "padding-bottom": "paddingBottom"
        };
        if (window.getComputedStyle) {
          var fromStyle = window.getComputedStyle(from);
          props.forEach(function(prop) {
            if (!to.style[lookup[prop]]) {
              to.style[lookup[prop]] = fromStyle.getPropertyValue(prop);
            }
          });
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Filter/defaults/filters.js
  var filters_default = {
    //equal to
    "=": function(filterVal, rowVal, rowData, filterParams) {
      return rowVal == filterVal ? true : false;
    },
    //less than
    "<": function(filterVal, rowVal, rowData, filterParams) {
      return rowVal < filterVal ? true : false;
    },
    //less than or equal to
    "<=": function(filterVal, rowVal, rowData, filterParams) {
      return rowVal <= filterVal ? true : false;
    },
    //greater than
    ">": function(filterVal, rowVal, rowData, filterParams) {
      return rowVal > filterVal ? true : false;
    },
    //greater than or equal to
    ">=": function(filterVal, rowVal, rowData, filterParams) {
      return rowVal >= filterVal ? true : false;
    },
    //not equal to
    "!=": function(filterVal, rowVal, rowData, filterParams) {
      return rowVal != filterVal ? true : false;
    },
    "regex": function(filterVal, rowVal, rowData, filterParams) {
      if (typeof filterVal == "string") {
        filterVal = new RegExp(filterVal);
      }
      return filterVal.test(rowVal);
    },
    //contains the string
    "like": function(filterVal, rowVal, rowData, filterParams) {
      if (filterVal === null || typeof filterVal === "undefined") {
        return rowVal === filterVal ? true : false;
      } else {
        if (typeof rowVal !== "undefined" && rowVal !== null) {
          return String(rowVal).toLowerCase().indexOf(filterVal.toLowerCase()) > -1;
        } else {
          return false;
        }
      }
    },
    //contains the keywords
    "keywords": function(filterVal, rowVal, rowData, filterParams) {
      var keywords = filterVal.toLowerCase().split(typeof filterParams.separator === "undefined" ? " " : filterParams.separator), value = String(rowVal === null || typeof rowVal === "undefined" ? "" : rowVal).toLowerCase(), matches = [];
      keywords.forEach((keyword) => {
        if (value.includes(keyword)) {
          matches.push(true);
        }
      });
      return filterParams.matchAll ? matches.length === keywords.length : !!matches.length;
    },
    //starts with the string
    "starts": function(filterVal, rowVal, rowData, filterParams) {
      if (filterVal === null || typeof filterVal === "undefined") {
        return rowVal === filterVal ? true : false;
      } else {
        if (typeof rowVal !== "undefined" && rowVal !== null) {
          return String(rowVal).toLowerCase().startsWith(filterVal.toLowerCase());
        } else {
          return false;
        }
      }
    },
    //ends with the string
    "ends": function(filterVal, rowVal, rowData, filterParams) {
      if (filterVal === null || typeof filterVal === "undefined") {
        return rowVal === filterVal ? true : false;
      } else {
        if (typeof rowVal !== "undefined" && rowVal !== null) {
          return String(rowVal).toLowerCase().endsWith(filterVal.toLowerCase());
        } else {
          return false;
        }
      }
    },
    //in array
    "in": function(filterVal, rowVal, rowData, filterParams) {
      if (Array.isArray(filterVal)) {
        return filterVal.length ? filterVal.indexOf(rowVal) > -1 : true;
      } else {
        console.warn("Filter Error - filter value is not an array:", filterVal);
        return false;
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Filter/Filter.js
  var Filter = class _Filter extends Module {
    static moduleName = "filter";
    //load defaults
    static filters = filters_default;
    constructor(table) {
      super(table);
      this.filterList = [];
      this.headerFilters = {};
      this.headerFilterColumns = [];
      this.prevHeaderFilterChangeCheck = "";
      this.prevHeaderFilterChangeCheck = "{}";
      this.changed = false;
      this.tableInitialized = false;
      this.registerTableOption("filterMode", "local");
      this.registerTableOption("initialFilter", false);
      this.registerTableOption("initialHeaderFilter", false);
      this.registerTableOption("headerFilterLiveFilterDelay", 300);
      this.registerTableOption("placeholderHeaderFilter", false);
      this.registerColumnOption("headerFilter");
      this.registerColumnOption("headerFilterPlaceholder");
      this.registerColumnOption("headerFilterParams");
      this.registerColumnOption("headerFilterEmptyCheck");
      this.registerColumnOption("headerFilterFunc");
      this.registerColumnOption("headerFilterFuncParams");
      this.registerColumnOption("headerFilterLiveFilter");
      this.registerTableFunction("searchRows", this.searchRows.bind(this));
      this.registerTableFunction("searchData", this.searchData.bind(this));
      this.registerTableFunction("setFilter", this.userSetFilter.bind(this));
      this.registerTableFunction("refreshFilter", this.userRefreshFilter.bind(this));
      this.registerTableFunction("addFilter", this.userAddFilter.bind(this));
      this.registerTableFunction("getFilters", this.getFilters.bind(this));
      this.registerTableFunction("setHeaderFilterFocus", this.userSetHeaderFilterFocus.bind(this));
      this.registerTableFunction("getHeaderFilterValue", this.userGetHeaderFilterValue.bind(this));
      this.registerTableFunction("setHeaderFilterValue", this.userSetHeaderFilterValue.bind(this));
      this.registerTableFunction("getHeaderFilters", this.getHeaderFilters.bind(this));
      this.registerTableFunction("removeFilter", this.userRemoveFilter.bind(this));
      this.registerTableFunction("clearFilter", this.userClearFilter.bind(this));
      this.registerTableFunction("clearHeaderFilter", this.userClearHeaderFilter.bind(this));
      this.registerComponentFunction("column", "headerFilterFocus", this.setHeaderFilterFocus.bind(this));
      this.registerComponentFunction("column", "reloadHeaderFilter", this.reloadHeaderFilter.bind(this));
      this.registerComponentFunction("column", "getHeaderFilterValue", this.getHeaderFilterValue.bind(this));
      this.registerComponentFunction("column", "setHeaderFilterValue", this.setHeaderFilterValue.bind(this));
    }
    initialize() {
      this.subscribe("column-init", this.initializeColumnHeaderFilter.bind(this));
      this.subscribe("column-width-fit-before", this.hideHeaderFilterElements.bind(this));
      this.subscribe("column-width-fit-after", this.showHeaderFilterElements.bind(this));
      this.subscribe("table-built", this.tableBuilt.bind(this));
      this.subscribe("placeholder", this.generatePlaceholder.bind(this));
      if (this.table.options.filterMode === "remote") {
        this.subscribe("data-params", this.remoteFilterParams.bind(this));
      }
      this.registerDataHandler(this.filter.bind(this), 10);
    }
    tableBuilt() {
      if (this.table.options.initialFilter) {
        this.setFilter(this.table.options.initialFilter);
      }
      if (this.table.options.initialHeaderFilter) {
        this.table.options.initialHeaderFilter.forEach((item) => {
          var column = this.table.columnManager.findColumn(item.field);
          if (column) {
            this.setHeaderFilterValue(column, item.value);
          } else {
            console.warn("Column Filter Error - No matching column found:", item.field);
            return false;
          }
        });
      }
      this.tableInitialized = true;
    }
    remoteFilterParams(data, config, silent, params) {
      params.filter = this.getFilters(true, true);
      return params;
    }
    generatePlaceholder(text) {
      if (this.table.options.placeholderHeaderFilter && Object.keys(this.headerFilters).length) {
        return this.table.options.placeholderHeaderFilter;
      }
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    //set standard filters
    userSetFilter(field, type, value, params) {
      this.setFilter(field, type, value, params);
      this.refreshFilter();
    }
    //set standard filters
    userRefreshFilter() {
      this.refreshFilter();
    }
    //add filter to array
    userAddFilter(field, type, value, params) {
      this.addFilter(field, type, value, params);
      this.refreshFilter();
    }
    userSetHeaderFilterFocus(field) {
      var column = this.table.columnManager.findColumn(field);
      if (column) {
        this.setHeaderFilterFocus(column);
      } else {
        console.warn("Column Filter Focus Error - No matching column found:", field);
        return false;
      }
    }
    userGetHeaderFilterValue(field) {
      var column = this.table.columnManager.findColumn(field);
      if (column) {
        return this.getHeaderFilterValue(column);
      } else {
        console.warn("Column Filter Error - No matching column found:", field);
      }
    }
    userSetHeaderFilterValue(field, value) {
      var column = this.table.columnManager.findColumn(field);
      if (column) {
        this.setHeaderFilterValue(column, value);
      } else {
        console.warn("Column Filter Error - No matching column found:", field);
        return false;
      }
    }
    //remove filter from array
    userRemoveFilter(field, type, value) {
      this.removeFilter(field, type, value);
      this.refreshFilter();
    }
    //clear filters
    userClearFilter(all) {
      this.clearFilter(all);
      this.refreshFilter();
    }
    //clear header filters
    userClearHeaderFilter() {
      this.clearHeaderFilter();
      this.refreshFilter();
    }
    //search for specific row components
    searchRows(field, type, value) {
      return this.search("rows", field, type, value);
    }
    //search for specific data
    searchData(field, type, value) {
      return this.search("data", field, type, value);
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    initializeColumnHeaderFilter(column) {
      var def = column.definition;
      if (def.headerFilter) {
        this.initializeColumn(column);
      }
    }
    //initialize column header filter
    initializeColumn(column, value) {
      var self = this, field = column.getField();
      function success(value2) {
        var filterType = column.modules.filter.tagType == "input" && column.modules.filter.attrType == "text" || column.modules.filter.tagType == "textarea" ? "partial" : "match", type = "", filterChangeCheck = "", filterFunc;
        if (typeof column.modules.filter.prevSuccess === "undefined" || column.modules.filter.prevSuccess !== value2) {
          column.modules.filter.prevSuccess = value2;
          if (!column.modules.filter.emptyFunc(value2)) {
            column.modules.filter.value = value2;
            switch (typeof column.definition.headerFilterFunc) {
              case "string":
                if (_Filter.filters[column.definition.headerFilterFunc]) {
                  type = column.definition.headerFilterFunc;
                  filterFunc = function(data) {
                    var params = column.definition.headerFilterFuncParams || {};
                    var fieldVal = column.getFieldValue(data);
                    params = typeof params === "function" ? params(value2, fieldVal, data) : params;
                    return _Filter.filters[column.definition.headerFilterFunc](value2, fieldVal, data, params);
                  };
                } else {
                  console.warn("Header Filter Error - Matching filter function not found: ", column.definition.headerFilterFunc);
                }
                break;
              case "function":
                filterFunc = function(data) {
                  var params = column.definition.headerFilterFuncParams || {};
                  var fieldVal = column.getFieldValue(data);
                  params = typeof params === "function" ? params(value2, fieldVal, data) : params;
                  return column.definition.headerFilterFunc(value2, fieldVal, data, params);
                };
                type = filterFunc;
                break;
            }
            if (!filterFunc) {
              switch (filterType) {
                case "partial":
                  filterFunc = function(data) {
                    var colVal = column.getFieldValue(data);
                    if (typeof colVal !== "undefined" && colVal !== null) {
                      return String(colVal).toLowerCase().indexOf(String(value2).toLowerCase()) > -1;
                    } else {
                      return false;
                    }
                  };
                  type = "like";
                  break;
                default:
                  filterFunc = function(data) {
                    return column.getFieldValue(data) == value2;
                  };
                  type = "=";
              }
            }
            self.headerFilters[field] = { value: value2, func: filterFunc, type };
          } else {
            delete self.headerFilters[field];
          }
          column.modules.filter.value = value2;
          filterChangeCheck = JSON.stringify(self.headerFilters);
          if (self.prevHeaderFilterChangeCheck !== filterChangeCheck) {
            self.prevHeaderFilterChangeCheck = filterChangeCheck;
            self.trackChanges();
            self.refreshFilter();
          }
        }
        return true;
      }
      column.modules.filter = {
        success,
        attrType: false,
        tagType: false,
        emptyFunc: false
      };
      this.generateHeaderFilterElement(column);
    }
    generateHeaderFilterElement(column, initialValue, reinitialize) {
      var self = this, success = column.modules.filter.success, field = column.getField(), filterElement, editor, editorElement, cellWrapper, typingTimer, searchTrigger, params, onRenderedCallback;
      column.modules.filter.value = initialValue;
      function cancel() {
      }
      function onRendered(callback) {
        onRenderedCallback = callback;
      }
      if (column.modules.filter.headerElement && column.modules.filter.headerElement.parentNode) {
        column.contentElement.removeChild(column.modules.filter.headerElement.parentNode);
      }
      if (field) {
        column.modules.filter.emptyFunc = column.definition.headerFilterEmptyCheck || function(value) {
          return !value && value !== 0;
        };
        filterElement = document.createElement("div");
        filterElement.classList.add("tabulator-header-filter");
        switch (typeof column.definition.headerFilter) {
          case "string":
            if (self.table.modules.edit.editors[column.definition.headerFilter]) {
              editor = self.table.modules.edit.editors[column.definition.headerFilter];
              if ((column.definition.headerFilter === "tick" || column.definition.headerFilter === "tickCross") && !column.definition.headerFilterEmptyCheck) {
                column.modules.filter.emptyFunc = function(value) {
                  return value !== true && value !== false;
                };
              }
            } else {
              console.warn("Filter Error - Cannot build header filter, No such editor found: ", column.definition.editor);
            }
            break;
          case "function":
            editor = column.definition.headerFilter;
            break;
          case "boolean":
            if (column.modules.edit && column.modules.edit.editor) {
              editor = column.modules.edit.editor;
            } else {
              if (column.definition.formatter && self.table.modules.edit.editors[column.definition.formatter]) {
                editor = self.table.modules.edit.editors[column.definition.formatter];
                if ((column.definition.formatter === "tick" || column.definition.formatter === "tickCross") && !column.definition.headerFilterEmptyCheck) {
                  column.modules.filter.emptyFunc = function(value) {
                    return value !== true && value !== false;
                  };
                }
              } else {
                editor = self.table.modules.edit.editors["input"];
              }
            }
            break;
        }
        if (editor) {
          cellWrapper = {
            getValue: function() {
              return typeof initialValue !== "undefined" ? initialValue : "";
            },
            getField: function() {
              return column.definition.field;
            },
            getElement: function() {
              return filterElement;
            },
            getColumn: function() {
              return column.getComponent();
            },
            getTable: () => {
              return this.table;
            },
            getType: () => {
              return "header";
            },
            getRow: function() {
              return {
                normalizeHeight: function() {
                }
              };
            }
          };
          params = column.definition.headerFilterParams || {};
          params = typeof params === "function" ? params.call(self.table, cellWrapper) : params;
          editorElement = editor.call(this.table.modules.edit, cellWrapper, onRendered, success, cancel, params);
          if (!editorElement) {
            console.warn("Filter Error - Cannot add filter to " + field + " column, editor returned a value of false");
            return;
          }
          if (!(editorElement instanceof Node)) {
            console.warn("Filter Error - Cannot add filter to " + field + " column, editor should return an instance of Node, the editor returned:", editorElement);
            return;
          }
          self.langBind("headerFilters|columns|" + column.definition.field, function(value) {
            editorElement.setAttribute("placeholder", typeof value !== "undefined" && value ? value : column.definition.headerFilterPlaceholder || self.langText("headerFilters|default"));
          });
          editorElement.addEventListener("click", function(e) {
            e.stopPropagation();
            editorElement.focus();
          });
          editorElement.addEventListener("focus", (e) => {
            var left = this.table.columnManager.contentsElement.scrollLeft;
            var headerPos = this.table.rowManager.element.scrollLeft;
            if (left !== headerPos) {
              this.table.rowManager.scrollHorizontal(left);
              this.table.columnManager.scrollHorizontal(left);
            }
          });
          typingTimer = false;
          searchTrigger = function(e) {
            if (typingTimer) {
              clearTimeout(typingTimer);
            }
            typingTimer = setTimeout(function() {
              success(editorElement.value);
            }, self.table.options.headerFilterLiveFilterDelay);
          };
          column.modules.filter.headerElement = editorElement;
          column.modules.filter.attrType = editorElement.hasAttribute("type") ? editorElement.getAttribute("type").toLowerCase() : "";
          column.modules.filter.tagType = editorElement.tagName.toLowerCase();
          if (column.definition.headerFilterLiveFilter !== false) {
            if (!(column.definition.headerFilter === "autocomplete" || column.definition.headerFilter === "tickCross" || (column.definition.editor === "autocomplete" || column.definition.editor === "tickCross") && column.definition.headerFilter === true)) {
              editorElement.addEventListener("keyup", searchTrigger);
              editorElement.addEventListener("search", searchTrigger);
              if (column.modules.filter.attrType == "number") {
                editorElement.addEventListener("change", function(e) {
                  success(editorElement.value);
                });
              }
              if (column.modules.filter.attrType == "text" && this.table.browser !== "ie") {
                editorElement.setAttribute("type", "search");
              }
            }
            if (column.modules.filter.tagType == "input" || column.modules.filter.tagType == "select" || column.modules.filter.tagType == "textarea") {
              editorElement.addEventListener("mousedown", function(e) {
                e.stopPropagation();
              });
            }
          }
          filterElement.appendChild(editorElement);
          column.contentElement.appendChild(filterElement);
          if (!reinitialize) {
            self.headerFilterColumns.push(column);
          }
          if (onRenderedCallback) {
            onRenderedCallback();
          }
        }
      } else {
        console.warn("Filter Error - Cannot add header filter, column has no field set:", column.definition.title);
      }
    }
    //hide all header filter elements (used to ensure correct column widths in "fitData" layout mode)
    hideHeaderFilterElements() {
      this.headerFilterColumns.forEach(function(column) {
        if (column.modules.filter && column.modules.filter.headerElement) {
          column.modules.filter.headerElement.style.display = "none";
        }
      });
    }
    //show all header filter elements (used to ensure correct column widths in "fitData" layout mode)
    showHeaderFilterElements() {
      this.headerFilterColumns.forEach(function(column) {
        if (column.modules.filter && column.modules.filter.headerElement) {
          column.modules.filter.headerElement.style.display = "";
        }
      });
    }
    //programmatically set focus of header filter
    setHeaderFilterFocus(column) {
      if (column.modules.filter && column.modules.filter.headerElement) {
        column.modules.filter.headerElement.focus();
      } else {
        console.warn("Column Filter Focus Error - No header filter set on column:", column.getField());
      }
    }
    //programmatically get value of header filter
    getHeaderFilterValue(column) {
      if (column.modules.filter && column.modules.filter.headerElement) {
        return column.modules.filter.value;
      } else {
        console.warn("Column Filter Error - No header filter set on column:", column.getField());
      }
    }
    //programmatically set value of header filter
    setHeaderFilterValue(column, value) {
      if (column) {
        if (column.modules.filter && column.modules.filter.headerElement) {
          this.generateHeaderFilterElement(column, value, true);
          column.modules.filter.success(value);
        } else {
          console.warn("Column Filter Error - No header filter set on column:", column.getField());
        }
      }
    }
    reloadHeaderFilter(column) {
      if (column) {
        if (column.modules.filter && column.modules.filter.headerElement) {
          this.generateHeaderFilterElement(column, column.modules.filter.value, true);
        } else {
          console.warn("Column Filter Error - No header filter set on column:", column.getField());
        }
      }
    }
    refreshFilter() {
      if (this.tableInitialized) {
        if (this.table.options.filterMode === "remote") {
          this.reloadData(null, false, false);
        } else {
          this.refreshData(true);
        }
      }
    }
    //check if the filters has changed since last use
    trackChanges() {
      this.changed = true;
      this.dispatch("filter-changed");
    }
    //check if the filters has changed since last use
    hasChanged() {
      var changed = this.changed;
      this.changed = false;
      return changed;
    }
    //set standard filters
    setFilter(field, type, value, params) {
      this.filterList = [];
      if (!Array.isArray(field)) {
        field = [{ field, type, value, params }];
      }
      this.addFilter(field);
    }
    //add filter to array
    addFilter(field, type, value, params) {
      var changed = false;
      if (!Array.isArray(field)) {
        field = [{ field, type, value, params }];
      }
      field.forEach((filter) => {
        filter = this.findFilter(filter);
        if (filter) {
          this.filterList.push(filter);
          changed = true;
        }
      });
      if (changed) {
        this.trackChanges();
      }
    }
    findFilter(filter) {
      var column;
      if (Array.isArray(filter)) {
        return this.findSubFilters(filter);
      }
      var filterFunc = false;
      if (typeof filter.field == "function") {
        filterFunc = function(data) {
          return filter.field(data, filter.type || {});
        };
      } else {
        if (_Filter.filters[filter.type]) {
          column = this.table.columnManager.getColumnByField(filter.field);
          if (column) {
            filterFunc = function(data) {
              return _Filter.filters[filter.type](filter.value, column.getFieldValue(data), data, filter.params || {});
            };
          } else {
            filterFunc = function(data) {
              return _Filter.filters[filter.type](filter.value, data[filter.field], data, filter.params || {});
            };
          }
        } else {
          console.warn("Filter Error - No such filter type found, ignoring: ", filter.type);
        }
      }
      filter.func = filterFunc;
      return filter.func ? filter : false;
    }
    findSubFilters(filters) {
      var output = [];
      filters.forEach((filter) => {
        filter = this.findFilter(filter);
        if (filter) {
          output.push(filter);
        }
      });
      return output.length ? output : false;
    }
    //get all filters
    getFilters(all, ajax) {
      var output = [];
      if (all) {
        output = this.getHeaderFilters();
      }
      if (ajax) {
        output.forEach(function(item) {
          if (typeof item.type == "function") {
            item.type = "function";
          }
        });
      }
      output = output.concat(this.filtersToArray(this.filterList, ajax));
      return output;
    }
    //filter to Object
    filtersToArray(filterList, ajax) {
      var output = [];
      filterList.forEach((filter) => {
        var item;
        if (Array.isArray(filter)) {
          output.push(this.filtersToArray(filter, ajax));
        } else {
          item = { field: filter.field, type: filter.type, value: filter.value };
          if (ajax) {
            if (typeof item.type == "function") {
              item.type = "function";
            }
          }
          output.push(item);
        }
      });
      return output;
    }
    //get all filters
    getHeaderFilters() {
      var output = [];
      for (var key in this.headerFilters) {
        output.push({ field: key, type: this.headerFilters[key].type, value: this.headerFilters[key].value });
      }
      return output;
    }
    //remove filter from array
    removeFilter(field, type, value) {
      if (!Array.isArray(field)) {
        field = [{ field, type, value }];
      }
      field.forEach((filter) => {
        var index = -1;
        if (typeof filter.field == "object") {
          index = this.filterList.findIndex((element) => {
            return filter === element;
          });
        } else {
          index = this.filterList.findIndex((element) => {
            return filter.field === element.field && filter.type === element.type && filter.value === element.value;
          });
        }
        if (index > -1) {
          this.filterList.splice(index, 1);
        } else {
          console.warn("Filter Error - No matching filter type found, ignoring: ", filter.type);
        }
      });
      this.trackChanges();
    }
    //clear filters
    clearFilter(all) {
      this.filterList = [];
      if (all) {
        this.clearHeaderFilter();
      }
      this.trackChanges();
    }
    //clear header filters
    clearHeaderFilter() {
      this.headerFilters = {};
      this.prevHeaderFilterChangeCheck = "{}";
      this.headerFilterColumns.forEach((column) => {
        if (typeof column.modules.filter.value !== "undefined") {
          delete column.modules.filter.value;
        }
        column.modules.filter.prevSuccess = void 0;
        this.reloadHeaderFilter(column);
      });
      this.trackChanges();
    }
    //search data and return matching rows
    search(searchType, field, type, value) {
      var activeRows = [], filterList = [];
      if (!Array.isArray(field)) {
        field = [{ field, type, value }];
      }
      field.forEach((filter) => {
        filter = this.findFilter(filter);
        if (filter) {
          filterList.push(filter);
        }
      });
      this.table.rowManager.rows.forEach((row) => {
        var match = true;
        filterList.forEach((filter) => {
          if (!this.filterRecurse(filter, row.getData())) {
            match = false;
          }
        });
        if (match) {
          activeRows.push(searchType === "data" ? row.getData("data") : row.getComponent());
        }
      });
      return activeRows;
    }
    //filter row array
    filter(rowList, filters) {
      var activeRows = [], activeRowComponents = [];
      if (this.subscribedExternal("dataFiltering")) {
        this.dispatchExternal("dataFiltering", this.getFilters(true));
      }
      if (this.table.options.filterMode !== "remote" && (this.filterList.length || Object.keys(this.headerFilters).length)) {
        rowList.forEach((row) => {
          if (this.filterRow(row)) {
            activeRows.push(row);
          }
        });
      } else {
        activeRows = rowList.slice(0);
      }
      if (this.subscribedExternal("dataFiltered")) {
        activeRows.forEach((row) => {
          activeRowComponents.push(row.getComponent());
        });
        this.dispatchExternal("dataFiltered", this.getFilters(true), activeRowComponents);
      }
      return activeRows;
    }
    //filter individual row
    filterRow(row, filters) {
      var match = true, data = row.getData();
      this.filterList.forEach((filter) => {
        if (!this.filterRecurse(filter, data)) {
          match = false;
        }
      });
      for (var field in this.headerFilters) {
        if (!this.headerFilters[field].func(data)) {
          match = false;
        }
      }
      return match;
    }
    filterRecurse(filter, data) {
      var match = false;
      if (Array.isArray(filter)) {
        filter.forEach((subFilter) => {
          if (this.filterRecurse(subFilter, data)) {
            match = true;
          }
        });
      } else {
        match = filter.func(data);
      }
      return match;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/plaintext.js
  function plaintext_default(cell, formatterParams, onRendered) {
    return this.emptyToSpace(this.sanitizeHTML(cell.getValue()));
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/html.js
  function html_default2(cell, formatterParams, onRendered) {
    return cell.getValue();
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/textarea.js
  function textarea_default2(cell, formatterParams, onRendered) {
    cell.getElement().style.whiteSpace = "pre-wrap";
    return this.emptyToSpace(this.sanitizeHTML(cell.getValue()));
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/money.js
  function money_default(cell, formatterParams, onRendered) {
    var floatVal = parseFloat(cell.getValue()), sign = "", number, integer, decimal, rgx, value;
    var decimalSym = formatterParams.decimal || ".";
    var thousandSym = formatterParams.thousand || ",";
    var negativeSign = formatterParams.negativeSign || "-";
    var symbol = formatterParams.symbol || "";
    var after = !!formatterParams.symbolAfter;
    var precision = typeof formatterParams.precision !== "undefined" ? formatterParams.precision : 2;
    if (isNaN(floatVal)) {
      return this.emptyToSpace(this.sanitizeHTML(cell.getValue()));
    }
    if (floatVal < 0) {
      floatVal = Math.abs(floatVal);
      sign = negativeSign;
    }
    number = precision !== false ? floatVal.toFixed(precision) : floatVal;
    number = String(number).split(".");
    integer = number[0];
    decimal = number.length > 1 ? decimalSym + number[1] : "";
    if (formatterParams.thousand !== false) {
      rgx = /(\d+)(\d{3})/;
      while (rgx.test(integer)) {
        integer = integer.replace(rgx, "$1" + thousandSym + "$2");
      }
    }
    value = integer + decimal;
    if (sign === true) {
      value = "(" + value + ")";
      return after ? value + symbol : symbol + value;
    } else {
      return after ? sign + value + symbol : sign + symbol + value;
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/link.js
  function link_default(cell, formatterParams, onRendered) {
    var value = cell.getValue(), urlPrefix = formatterParams.urlPrefix || "", download = formatterParams.download, label = value, el = document.createElement("a"), data;
    function labelTraverse(path, data2) {
      var item = path.shift(), value2 = data2[item];
      if (path.length && typeof value2 === "object") {
        return labelTraverse(path, value2);
      }
      return value2;
    }
    if (formatterParams.labelField) {
      data = cell.getData();
      label = labelTraverse(formatterParams.labelField.split(this.table.options.nestedFieldSeparator), data);
    }
    if (formatterParams.label) {
      switch (typeof formatterParams.label) {
        case "string":
          label = formatterParams.label;
          break;
        case "function":
          label = formatterParams.label(cell);
          break;
      }
    }
    if (label) {
      if (formatterParams.urlField) {
        data = cell.getData();
        value = Helpers.retrieveNestedData(this.table.options.nestedFieldSeparator, formatterParams.urlField, data);
      }
      if (formatterParams.url) {
        switch (typeof formatterParams.url) {
          case "string":
            value = formatterParams.url;
            break;
          case "function":
            value = formatterParams.url(cell);
            break;
        }
      }
      el.setAttribute("href", urlPrefix + value);
      if (formatterParams.target) {
        el.setAttribute("target", formatterParams.target);
      }
      if (formatterParams.download) {
        if (typeof download == "function") {
          download = download(cell);
        } else {
          download = download === true ? "" : download;
        }
        el.setAttribute("download", download);
      }
      el.innerHTML = this.emptyToSpace(this.sanitizeHTML(label));
      return el;
    } else {
      return "&nbsp;";
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/image.js
  function image_default(cell, formatterParams, onRendered) {
    var el = document.createElement("img"), src = cell.getValue();
    if (formatterParams.urlPrefix) {
      src = formatterParams.urlPrefix + cell.getValue();
    }
    if (formatterParams.urlSuffix) {
      src = src + formatterParams.urlSuffix;
    }
    el.setAttribute("src", src);
    switch (typeof formatterParams.height) {
      case "number":
        el.style.height = formatterParams.height + "px";
        break;
      case "string":
        el.style.height = formatterParams.height;
        break;
    }
    switch (typeof formatterParams.width) {
      case "number":
        el.style.width = formatterParams.width + "px";
        break;
      case "string":
        el.style.width = formatterParams.width;
        break;
    }
    el.addEventListener("load", function() {
      cell.getRow().normalizeHeight();
    });
    return el;
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/tickCross.js
  function tickCross_default2(cell, formatterParams, onRendered) {
    var value = cell.getValue(), element = cell.getElement(), empty = formatterParams.allowEmpty, truthy = formatterParams.allowTruthy, trueValueSet = Object.keys(formatterParams).includes("trueValue"), tick = typeof formatterParams.tickElement !== "undefined" ? formatterParams.tickElement : '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>', cross = typeof formatterParams.crossElement !== "undefined" ? formatterParams.crossElement : '<svg enable-background="new 0 0 24 24" height="14" width="14"  viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
    if (trueValueSet && value === formatterParams.trueValue || !trueValueSet && (truthy && value || (value === true || value === "true" || value === "True" || value === 1 || value === "1"))) {
      element.setAttribute("aria-checked", true);
      return tick || "";
    } else {
      if (empty && (value === "null" || value === "" || value === null || typeof value === "undefined")) {
        element.setAttribute("aria-checked", "mixed");
        return "";
      } else {
        element.setAttribute("aria-checked", false);
        return cross || "";
      }
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/datetime.js
  function datetime_default2(cell, formatterParams, onRendered) {
    var DT = window.DateTime || luxon.DateTime;
    var inputFormat = formatterParams.inputFormat || "yyyy-MM-dd HH:mm:ss";
    var outputFormat = formatterParams.outputFormat || "dd/MM/yyyy HH:mm:ss";
    var invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";
    var value = cell.getValue();
    if (typeof DT != "undefined") {
      var newDatetime;
      if (DT.isDateTime(value)) {
        newDatetime = value;
      } else if (inputFormat === "iso") {
        newDatetime = DT.fromISO(String(value));
      } else {
        newDatetime = DT.fromFormat(String(value), inputFormat);
      }
      if (newDatetime.isValid) {
        if (formatterParams.timezone) {
          newDatetime = newDatetime.setZone(formatterParams.timezone);
        }
        return newDatetime.toFormat(outputFormat);
      } else {
        if (invalid === true || !value) {
          return value;
        } else if (typeof invalid === "function") {
          return invalid(value);
        } else {
          return invalid;
        }
      }
    } else {
      console.error("Format Error - 'datetime' formatter is dependant on luxon.js");
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/datetimediff.js
  function datetimediff_default(cell, formatterParams, onRendered) {
    var DT = window.DateTime || luxon.DateTime;
    var inputFormat = formatterParams.inputFormat || "yyyy-MM-dd HH:mm:ss";
    var invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";
    var suffix = typeof formatterParams.suffix !== "undefined" ? formatterParams.suffix : false;
    var unit = typeof formatterParams.unit !== "undefined" ? formatterParams.unit : "days";
    var humanize = typeof formatterParams.humanize !== "undefined" ? formatterParams.humanize : false;
    var date = typeof formatterParams.date !== "undefined" ? formatterParams.date : DT.now();
    var value = cell.getValue();
    if (typeof DT != "undefined") {
      var newDatetime;
      if (DT.isDateTime(value)) {
        newDatetime = value;
      } else if (inputFormat === "iso") {
        newDatetime = DT.fromISO(String(value));
      } else {
        newDatetime = DT.fromFormat(String(value), inputFormat);
      }
      if (newDatetime.isValid) {
        if (humanize) {
          return newDatetime.diff(date, unit).toHuman() + (suffix ? " " + suffix : "");
        } else {
          return parseInt(newDatetime.diff(date, unit)[unit]) + (suffix ? " " + suffix : "");
        }
      } else {
        if (invalid === true) {
          return value;
        } else if (typeof invalid === "function") {
          return invalid(value);
        } else {
          return invalid;
        }
      }
    } else {
      console.error("Format Error - 'datetimediff' formatter is dependant on luxon.js");
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/lookup.js
  function lookup_default(cell, formatterParams, onRendered) {
    var value = cell.getValue();
    if (typeof formatterParams[value] === "undefined") {
      console.warn("Missing display value for " + value);
      return value;
    }
    return formatterParams[value];
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/star.js
  function star_default2(cell, formatterParams, onRendered) {
    var value = cell.getValue(), element = cell.getElement(), maxStars = formatterParams && formatterParams.stars ? formatterParams.stars : 5, stars = document.createElement("span"), star = document.createElementNS("http://www.w3.org/2000/svg", "svg"), starActive = '<polygon fill="#FFEA00" stroke="#C1AB60" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>', starInactive = '<polygon fill="#D2D2D2" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';
    stars.style.verticalAlign = "middle";
    star.setAttribute("width", "14");
    star.setAttribute("height", "14");
    star.setAttribute("viewBox", "0 0 512 512");
    star.setAttribute("xml:space", "preserve");
    star.style.padding = "0 1px";
    value = value && !isNaN(value) ? parseInt(value) : 0;
    value = Math.max(0, Math.min(value, maxStars));
    for (var i = 1; i <= maxStars; i++) {
      var nextStar = star.cloneNode(true);
      nextStar.innerHTML = i <= value ? starActive : starInactive;
      stars.appendChild(nextStar);
    }
    element.style.whiteSpace = "nowrap";
    element.style.overflow = "hidden";
    element.style.textOverflow = "ellipsis";
    element.setAttribute("aria-label", value);
    return stars;
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/traffic.js
  function traffic_default(cell, formatterParams, onRendered) {
    var value = this.sanitizeHTML(cell.getValue()) || 0, el = document.createElement("span"), max = formatterParams && formatterParams.max ? formatterParams.max : 100, min = formatterParams && formatterParams.min ? formatterParams.min : 0, colors = formatterParams && typeof formatterParams.color !== "undefined" ? formatterParams.color : ["red", "orange", "green"], color = "#666666", percent, percentValue;
    if (isNaN(value) || typeof cell.getValue() === "undefined") {
      return;
    }
    el.classList.add("tabulator-traffic-light");
    percentValue = parseFloat(value) <= max ? parseFloat(value) : max;
    percentValue = parseFloat(percentValue) >= min ? parseFloat(percentValue) : min;
    percent = (max - min) / 100;
    percentValue = Math.round((percentValue - min) / percent);
    switch (typeof colors) {
      case "string":
        color = colors;
        break;
      case "function":
        color = colors(value);
        break;
      case "object":
        if (Array.isArray(colors)) {
          var unit = 100 / colors.length;
          var index = Math.floor(percentValue / unit);
          index = Math.min(index, colors.length - 1);
          index = Math.max(index, 0);
          color = colors[index];
          break;
        }
    }
    el.style.backgroundColor = color;
    return el;
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/progress.js
  function progress_default2(cell, formatterParams = {}, onRendered) {
    var value = this.sanitizeHTML(cell.getValue()) || 0, element = cell.getElement(), max = formatterParams.max ? formatterParams.max : 100, min = formatterParams.min ? formatterParams.min : 0, legendAlign = formatterParams.legendAlign ? formatterParams.legendAlign : "center", percent, percentValue, color, legend, legendColor;
    percentValue = parseFloat(value) <= max ? parseFloat(value) : max;
    percentValue = parseFloat(percentValue) >= min ? parseFloat(percentValue) : min;
    percent = (max - min) / 100;
    percentValue = Math.round((percentValue - min) / percent);
    switch (typeof formatterParams.color) {
      case "string":
        color = formatterParams.color;
        break;
      case "function":
        color = formatterParams.color(value);
        break;
      case "object":
        if (Array.isArray(formatterParams.color)) {
          let unit = 100 / formatterParams.color.length;
          let index = Math.floor(percentValue / unit);
          index = Math.min(index, formatterParams.color.length - 1);
          index = Math.max(index, 0);
          color = formatterParams.color[index];
          break;
        }
      default:
        color = "#2DC214";
    }
    switch (typeof formatterParams.legend) {
      case "string":
        legend = formatterParams.legend;
        break;
      case "function":
        legend = formatterParams.legend(value);
        break;
      case "boolean":
        legend = value;
        break;
      default:
        legend = false;
    }
    switch (typeof formatterParams.legendColor) {
      case "string":
        legendColor = formatterParams.legendColor;
        break;
      case "function":
        legendColor = formatterParams.legendColor(value);
        break;
      case "object":
        if (Array.isArray(formatterParams.legendColor)) {
          let unit = 100 / formatterParams.legendColor.length;
          let index = Math.floor(percentValue / unit);
          index = Math.min(index, formatterParams.legendColor.length - 1);
          index = Math.max(index, 0);
          legendColor = formatterParams.legendColor[index];
        }
        break;
      default:
        legendColor = "#000";
    }
    element.style.minWidth = "30px";
    element.style.position = "relative";
    element.setAttribute("aria-label", percentValue);
    var barEl = document.createElement("div");
    barEl.style.display = "inline-block";
    barEl.style.width = percentValue + "%";
    barEl.style.backgroundColor = color;
    barEl.style.height = "100%";
    barEl.setAttribute("data-max", max);
    barEl.setAttribute("data-min", min);
    var barContainer = document.createElement("div");
    barContainer.style.position = "relative";
    barContainer.style.width = "100%";
    barContainer.style.height = "100%";
    if (legend) {
      var legendEl = document.createElement("div");
      legendEl.style.position = "absolute";
      legendEl.style.top = 0;
      legendEl.style.left = 0;
      legendEl.style.textAlign = legendAlign;
      legendEl.style.width = "100%";
      legendEl.style.color = legendColor;
      legendEl.innerHTML = legend;
    }
    onRendered(function() {
      if (!(cell instanceof CellComponent)) {
        var holderEl = document.createElement("div");
        holderEl.style.position = "absolute";
        holderEl.style.top = "4px";
        holderEl.style.bottom = "4px";
        holderEl.style.left = "4px";
        holderEl.style.right = "4px";
        element.appendChild(holderEl);
        element = holderEl;
      }
      element.appendChild(barContainer);
      barContainer.appendChild(barEl);
      if (legend) {
        barContainer.appendChild(legendEl);
      }
    });
    return "";
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/color.js
  function color_default(cell, formatterParams, onRendered) {
    cell.getElement().style.backgroundColor = this.sanitizeHTML(cell.getValue());
    return "";
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/buttonTick.js
  function buttonTick_default(cell, formatterParams, onRendered) {
    return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>';
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/buttonCross.js
  function buttonCross_default(cell, formatterParams, onRendered) {
    return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/toggle.js
  function toggle_default(cell, formatterParams, onRendered) {
    var value = cell.getValue(), size = formatterParams.size || 15, sizePx = size + "px", containEl, switchEl, onValue = formatterParams.hasOwnProperty("onValue") ? formatterParams.onValue : true, offValue = formatterParams.hasOwnProperty("offValue") ? formatterParams.offValue : false, state = formatterParams.onTruthy ? value : value === onValue;
    containEl = document.createElement("div");
    containEl.classList.add("tabulator-toggle");
    if (state) {
      containEl.classList.add("tabulator-toggle-on");
      containEl.style.flexDirection = "row-reverse";
      if (formatterParams.onColor) {
        containEl.style.background = formatterParams.onColor;
      }
    } else {
      if (formatterParams.offColor) {
        containEl.style.background = formatterParams.offColor;
      }
    }
    containEl.style.width = 2.5 * size + "px";
    containEl.style.borderRadius = sizePx;
    if (formatterParams.clickable) {
      containEl.addEventListener("click", (e) => {
        cell.setValue(state ? offValue : onValue);
      });
    }
    switchEl = document.createElement("div");
    switchEl.classList.add("tabulator-toggle-switch");
    switchEl.style.height = sizePx;
    switchEl.style.width = sizePx;
    switchEl.style.borderRadius = sizePx;
    containEl.appendChild(switchEl);
    return containEl;
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/rownum.js
  function rownum_default(cell, formatterParams, onRendered) {
    var content = document.createElement("span");
    var row = cell.getRow();
    var table = cell.getTable();
    row.watchPosition((position) => {
      if (formatterParams.relativeToPage) {
        position += table.modules.page.getPageSize() * (table.modules.page.getPage() - 1);
      }
      content.innerText = position;
    });
    return content;
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters/handle.js
  function handle_default(cell, formatterParams, onRendered) {
    cell.getElement().classList.add("tabulator-row-handle");
    return "<div class='tabulator-row-handle-box'><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div></div>";
  }

  // node_modules/tabulator-tables/src/js/modules/Format/defaults/formatters.js
  var formatters_default = {
    plaintext: plaintext_default,
    html: html_default2,
    textarea: textarea_default2,
    money: money_default,
    link: link_default,
    image: image_default,
    tickCross: tickCross_default2,
    datetime: datetime_default2,
    datetimediff: datetimediff_default,
    lookup: lookup_default,
    star: star_default2,
    traffic: traffic_default,
    progress: progress_default2,
    color: color_default,
    buttonTick: buttonTick_default,
    buttonCross: buttonCross_default,
    toggle: toggle_default,
    rownum: rownum_default,
    handle: handle_default
  };

  // node_modules/tabulator-tables/src/js/modules/Format/Format.js
  var Format = class _Format extends Module {
    static moduleName = "format";
    //load defaults
    static formatters = formatters_default;
    constructor(table) {
      super(table);
      this.registerColumnOption("formatter");
      this.registerColumnOption("formatterParams");
      this.registerColumnOption("formatterPrint");
      this.registerColumnOption("formatterPrintParams");
      this.registerColumnOption("formatterClipboard");
      this.registerColumnOption("formatterClipboardParams");
      this.registerColumnOption("formatterHtmlOutput");
      this.registerColumnOption("formatterHtmlOutputParams");
      this.registerColumnOption("titleFormatter");
      this.registerColumnOption("titleFormatterParams");
    }
    initialize() {
      this.subscribe("cell-format", this.formatValue.bind(this));
      this.subscribe("cell-rendered", this.cellRendered.bind(this));
      this.subscribe("column-layout", this.initializeColumn.bind(this));
      this.subscribe("column-format", this.formatHeader.bind(this));
    }
    //initialize column formatter
    initializeColumn(column) {
      column.modules.format = this.lookupFormatter(column, "");
      if (typeof column.definition.formatterPrint !== "undefined") {
        column.modules.format.print = this.lookupFormatter(column, "Print");
      }
      if (typeof column.definition.formatterClipboard !== "undefined") {
        column.modules.format.clipboard = this.lookupFormatter(column, "Clipboard");
      }
      if (typeof column.definition.formatterHtmlOutput !== "undefined") {
        column.modules.format.htmlOutput = this.lookupFormatter(column, "HtmlOutput");
      }
    }
    lookupFormatter(column, type) {
      var config = { params: column.definition["formatter" + type + "Params"] || {} }, formatter = column.definition["formatter" + type];
      switch (typeof formatter) {
        case "string":
          if (_Format.formatters[formatter]) {
            config.formatter = _Format.formatters[formatter];
          } else {
            console.warn("Formatter Error - No such formatter found: ", formatter);
            config.formatter = _Format.formatters.plaintext;
          }
          break;
        case "function":
          config.formatter = formatter;
          break;
        default:
          config.formatter = _Format.formatters.plaintext;
          break;
      }
      return config;
    }
    cellRendered(cell) {
      if (cell.modules.format && cell.modules.format.renderedCallback && !cell.modules.format.rendered) {
        cell.modules.format.renderedCallback();
        cell.modules.format.rendered = true;
      }
    }
    //return a formatted value for a column header
    formatHeader(column, title, el) {
      var formatter, params, onRendered, mockCell;
      if (column.definition.titleFormatter) {
        formatter = this.getFormatter(column.definition.titleFormatter);
        onRendered = (callback) => {
          column.titleFormatterRendered = callback;
        };
        mockCell = {
          getValue: function() {
            return title;
          },
          getElement: function() {
            return el;
          },
          getType: function() {
            return "header";
          },
          getColumn: function() {
            return column.getComponent();
          },
          getTable: () => {
            return this.table;
          }
        };
        params = column.definition.titleFormatterParams || {};
        params = typeof params === "function" ? params() : params;
        return formatter.call(this, mockCell, params, onRendered);
      } else {
        return title;
      }
    }
    //return a formatted value for a cell
    formatValue(cell) {
      var component = cell.getComponent(), params = typeof cell.column.modules.format.params === "function" ? cell.column.modules.format.params(component) : cell.column.modules.format.params;
      function onRendered(callback) {
        if (!cell.modules.format) {
          cell.modules.format = {};
        }
        cell.modules.format.renderedCallback = callback;
        cell.modules.format.rendered = false;
      }
      return cell.column.modules.format.formatter.call(this, component, params, onRendered);
    }
    formatExportValue(cell, type) {
      var formatter = cell.column.modules.format[type], params;
      if (formatter) {
        let onRendered = function(callback) {
          if (!cell.modules.format) {
            cell.modules.format = {};
          }
          cell.modules.format.renderedCallback = callback;
          cell.modules.format.rendered = false;
        };
        params = typeof formatter.params === "function" ? formatter.params(cell.getComponent()) : formatter.params;
        return formatter.formatter.call(this, cell.getComponent(), params, onRendered);
      } else {
        return this.formatValue(cell);
      }
    }
    sanitizeHTML(value) {
      if (value) {
        var entityMap = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
          "/": "&#x2F;",
          "`": "&#x60;",
          "=": "&#x3D;"
        };
        return String(value).replace(/[&<>"'`=/]/g, function(s) {
          return entityMap[s];
        });
      } else {
        return value;
      }
    }
    emptyToSpace(value) {
      return value === null || typeof value === "undefined" || value === "" ? "&nbsp;" : value;
    }
    //get formatter for cell
    getFormatter(formatter) {
      switch (typeof formatter) {
        case "string":
          if (_Format.formatters[formatter]) {
            formatter = _Format.formatters[formatter];
          } else {
            console.warn("Formatter Error - No such formatter found: ", formatter);
            formatter = _Format.formatters.plaintext;
          }
          break;
        case "function":
          break;
        default:
          formatter = _Format.formatters.plaintext;
          break;
      }
      return formatter;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/FrozenColumns/FrozenColumns.js
  var FrozenColumns = class extends Module {
    static moduleName = "frozenColumns";
    constructor(table) {
      super(table);
      this.leftColumns = [];
      this.rightColumns = [];
      this.initializationMode = "left";
      this.active = false;
      this.blocked = true;
      this.registerColumnOption("frozen");
    }
    //reset initial state
    reset() {
      this.initializationMode = "left";
      this.leftColumns = [];
      this.rightColumns = [];
      this.active = false;
    }
    initialize() {
      this.subscribe("cell-layout", this.layoutCell.bind(this));
      this.subscribe("column-init", this.initializeColumn.bind(this));
      this.subscribe("column-width", this.layout.bind(this));
      this.subscribe("row-layout-after", this.layoutRow.bind(this));
      this.subscribe("table-layout", this.layout.bind(this));
      this.subscribe("columns-loading", this.reset.bind(this));
      this.subscribe("column-add", this.reinitializeColumns.bind(this));
      this.subscribe("column-deleted", this.reinitializeColumns.bind(this));
      this.subscribe("column-hide", this.reinitializeColumns.bind(this));
      this.subscribe("column-show", this.reinitializeColumns.bind(this));
      this.subscribe("columns-loaded", this.reinitializeColumns.bind(this));
      this.subscribe("table-redraw", this.layout.bind(this));
      this.subscribe("layout-refreshing", this.blockLayout.bind(this));
      this.subscribe("layout-refreshed", this.unblockLayout.bind(this));
      this.subscribe("scrollbar-vertical", this.adjustForScrollbar.bind(this));
    }
    blockLayout() {
      this.blocked = true;
    }
    unblockLayout() {
      this.blocked = false;
    }
    layoutCell(cell) {
      this.layoutElement(cell.element, cell.column);
    }
    reinitializeColumns() {
      this.reset();
      this.table.columnManager.columnsByIndex.forEach((column) => {
        this.initializeColumn(column);
      });
      this.layout();
    }
    //initialize specific column
    initializeColumn(column) {
      var config = { margin: 0, edge: false };
      if (!column.isGroup) {
        if (this.frozenCheck(column)) {
          config.position = this.initializationMode;
          if (this.initializationMode == "left") {
            this.leftColumns.push(column);
          } else {
            this.rightColumns.unshift(column);
          }
          this.active = true;
          column.modules.frozen = config;
        } else {
          this.initializationMode = "right";
        }
      }
    }
    frozenCheck(column) {
      if (column.parent.isGroup && column.definition.frozen) {
        console.warn("Frozen Column Error - Parent column group must be frozen, not individual columns or sub column groups");
      }
      if (column.parent.isGroup) {
        return this.frozenCheck(column.parent);
      } else {
        return column.definition.frozen;
      }
    }
    //layout calculation rows
    layoutCalcRows() {
      if (this.table.modExists("columnCalcs")) {
        if (this.table.modules.columnCalcs.topInitialized && this.table.modules.columnCalcs.topRow) {
          this.layoutRow(this.table.modules.columnCalcs.topRow);
        }
        if (this.table.modules.columnCalcs.botInitialized && this.table.modules.columnCalcs.botRow) {
          this.layoutRow(this.table.modules.columnCalcs.botRow);
        }
        if (this.table.modExists("groupRows")) {
          this.layoutGroupCalcs(this.table.modules.groupRows.getGroups());
        }
      }
    }
    layoutGroupCalcs(groups) {
      groups.forEach((group) => {
        if (group.calcs.top) {
          this.layoutRow(group.calcs.top);
        }
        if (group.calcs.bottom) {
          this.layoutRow(group.calcs.bottom);
        }
        if (group.groupList && group.groupList.length) {
          this.layoutGroupCalcs(group.groupList);
        }
      });
    }
    //calculate column positions and layout headers
    layoutColumnPosition(allCells) {
      var leftParents = [];
      var leftMargin = 0;
      var rightMargin = 0;
      this.leftColumns.forEach((column, i) => {
        column.modules.frozen.marginValue = leftMargin;
        column.modules.frozen.margin = column.modules.frozen.marginValue + "px";
        if (column.visible) {
          leftMargin += column.getWidth();
        }
        if (i == this.leftColumns.length - 1) {
          column.modules.frozen.edge = true;
        } else {
          column.modules.frozen.edge = false;
        }
        if (column.parent.isGroup) {
          var parentEl = this.getColGroupParentElement(column);
          if (!leftParents.includes(parentEl)) {
            this.layoutElement(parentEl, column);
            leftParents.push(parentEl);
          }
          parentEl.classList.toggle("tabulator-frozen-left", column.modules.frozen.edge && column.modules.frozen.position === "left");
          parentEl.classList.toggle("tabulator-frozen-right", column.modules.frozen.edge && column.modules.frozen.position === "right");
        } else {
          this.layoutElement(column.getElement(), column);
        }
        if (allCells) {
          column.cells.forEach((cell) => {
            this.layoutElement(cell.getElement(true), column);
          });
        }
      });
      this.rightColumns.forEach((column, i) => {
        column.modules.frozen.marginValue = rightMargin;
        column.modules.frozen.margin = column.modules.frozen.marginValue + "px";
        if (column.visible) {
          rightMargin += column.getWidth();
        }
        if (i == this.rightColumns.length - 1) {
          column.modules.frozen.edge = true;
        } else {
          column.modules.frozen.edge = false;
        }
        if (column.parent.isGroup) {
          this.layoutElement(this.getColGroupParentElement(column), column);
        } else {
          this.layoutElement(column.getElement(), column);
        }
        if (allCells) {
          column.cells.forEach((cell) => {
            this.layoutElement(cell.getElement(true), column);
          });
        }
      });
    }
    getColGroupParentElement(column) {
      return column.parent.isGroup ? this.getColGroupParentElement(column.parent) : column.getElement();
    }
    //layout columns appropriately
    layout() {
      if (this.active && !this.blocked) {
        this.layoutColumnPosition();
        this.reinitializeRows();
        this.layoutCalcRows();
      }
    }
    reinitializeRows() {
      var visibleRows = this.table.rowManager.getVisibleRows(true);
      var otherRows = this.table.rowManager.getRows().filter((row) => !visibleRows.includes(row));
      otherRows.forEach((row) => {
        row.deinitialize();
      });
      visibleRows.forEach((row) => {
        if (row.type === "row") {
          this.layoutRow(row);
        }
      });
    }
    layoutRow(row) {
      if (this.table.options.layout === "fitDataFill" && this.rightColumns.length) {
        this.table.rowManager.getTableElement().style.minWidth = "calc(100% - " + this.rightMargin + ")";
      }
      this.leftColumns.forEach((column) => {
        var cell = row.getCell(column);
        if (cell) {
          this.layoutElement(cell.getElement(true), column);
        }
      });
      this.rightColumns.forEach((column) => {
        var cell = row.getCell(column);
        if (cell) {
          this.layoutElement(cell.getElement(true), column);
        }
      });
    }
    layoutElement(element, column) {
      var position;
      if (column.modules.frozen && element) {
        element.style.position = "sticky";
        if (this.table.rtl) {
          position = column.modules.frozen.position === "left" ? "right" : "left";
        } else {
          position = column.modules.frozen.position;
        }
        element.style[position] = column.modules.frozen.margin;
        element.classList.add("tabulator-frozen");
        element.classList.toggle("tabulator-frozen-left", column.modules.frozen.edge && column.modules.frozen.position === "left");
        element.classList.toggle("tabulator-frozen-right", column.modules.frozen.edge && column.modules.frozen.position === "right");
      }
    }
    adjustForScrollbar(width) {
      if (this.rightColumns.length) {
        this.table.columnManager.getContentsElement().style.width = "calc(100% - " + width + "px)";
      }
    }
    getFrozenColumns() {
      return this.leftColumns.concat(this.rightColumns);
    }
    _calcSpace(columns, index) {
      var width = 0;
      for (let i = 0; i < index; i++) {
        if (columns[i].visible) {
          width += columns[i].getWidth();
        }
      }
      return width;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/FrozenRows/FrozenRows.js
  var FrozenRows = class extends Module {
    static moduleName = "frozenRows";
    constructor(table) {
      super(table);
      this.topElement = document.createElement("div");
      this.rows = [];
      this.registerComponentFunction("row", "freeze", this.freezeRow.bind(this));
      this.registerComponentFunction("row", "unfreeze", this.unfreezeRow.bind(this));
      this.registerComponentFunction("row", "isFrozen", this.isRowFrozen.bind(this));
      this.registerTableOption("frozenRowsField", "id");
      this.registerTableOption("frozenRows", false);
    }
    initialize() {
      var fragment = document.createDocumentFragment();
      this.rows = [];
      this.topElement.classList.add("tabulator-frozen-rows-holder");
      fragment.appendChild(document.createElement("br"));
      fragment.appendChild(this.topElement);
      this.table.columnManager.getContentsElement().insertBefore(fragment, this.table.columnManager.headersElement.nextSibling);
      this.subscribe("row-deleting", this.detachRow.bind(this));
      this.subscribe("rows-visible", this.visibleRows.bind(this));
      this.registerDisplayHandler(this.getRows.bind(this), 10);
      if (this.table.options.frozenRows) {
        this.subscribe("data-processed", this.initializeRows.bind(this));
        this.subscribe("row-added", this.initializeRow.bind(this));
        this.subscribe("table-redrawing", this.resizeHolderWidth.bind(this));
        this.subscribe("column-resized", this.resizeHolderWidth.bind(this));
        this.subscribe("column-show", this.resizeHolderWidth.bind(this));
        this.subscribe("column-hide", this.resizeHolderWidth.bind(this));
      }
      this.resizeHolderWidth();
    }
    resizeHolderWidth() {
      this.topElement.style.minWidth = this.table.columnManager.headersElement.offsetWidth + "px";
    }
    initializeRows() {
      this.table.rowManager.getRows().forEach((row) => {
        this.initializeRow(row);
      });
    }
    initializeRow(row) {
      var frozenRows = this.table.options.frozenRows, rowType = typeof frozenRows;
      if (rowType === "number") {
        if (row.getPosition() && row.getPosition() + this.rows.length <= frozenRows) {
          this.freezeRow(row);
        }
      } else if (rowType === "function") {
        if (frozenRows.call(this.table, row.getComponent())) {
          this.freezeRow(row);
        }
      } else if (Array.isArray(frozenRows)) {
        if (frozenRows.includes(row.data[this.options("frozenRowsField")])) {
          this.freezeRow(row);
        }
      }
    }
    isRowFrozen(row) {
      var index = this.rows.indexOf(row);
      return index > -1;
    }
    isFrozen() {
      return !!this.rows.length;
    }
    visibleRows(viewable, rows) {
      this.rows.forEach((row) => {
        rows.push(row);
      });
      return rows;
    }
    //filter frozen rows out of display data
    getRows(rows) {
      var output = rows.slice(0);
      this.rows.forEach(function(row) {
        var index = output.indexOf(row);
        if (index > -1) {
          output.splice(index, 1);
        }
      });
      return output;
    }
    freezeRow(row) {
      if (!row.modules.frozen) {
        row.modules.frozen = true;
        this.topElement.appendChild(row.getElement());
        row.initialize();
        row.normalizeHeight();
        this.rows.push(row);
        this.refreshData(false, "display");
        this.table.rowManager.adjustTableSize();
        this.styleRows();
      } else {
        console.warn("Freeze Error - Row is already frozen");
      }
    }
    unfreezeRow(row) {
      if (row.modules.frozen) {
        row.modules.frozen = false;
        this.detachRow(row);
        this.table.rowManager.adjustTableSize();
        this.refreshData(false, "display");
        if (this.rows.length) {
          this.styleRows();
        }
      } else {
        console.warn("Freeze Error - Row is already unfrozen");
      }
    }
    detachRow(row) {
      var index = this.rows.indexOf(row);
      if (index > -1) {
        var rowEl = row.getElement();
        if (rowEl.parentNode) {
          rowEl.parentNode.removeChild(rowEl);
        }
        this.rows.splice(index, 1);
      }
    }
    styleRows(row) {
      this.rows.forEach((row2, i) => {
        this.table.rowManager.styleRow(row2, i);
      });
    }
  };

  // node_modules/tabulator-tables/src/js/modules/GroupRows/GroupComponent.js
  var GroupComponent = class {
    constructor(group) {
      this._group = group;
      this.type = "GroupComponent";
      return new Proxy(this, {
        get: function(target, name, receiver) {
          if (typeof target[name] !== "undefined") {
            return target[name];
          } else {
            return target._group.groupManager.table.componentFunctionBinder.handle("group", target._group, name);
          }
        }
      });
    }
    getKey() {
      return this._group.key;
    }
    getField() {
      return this._group.field;
    }
    getElement() {
      return this._group.element;
    }
    getRows() {
      return this._group.getRows(true);
    }
    getSubGroups() {
      return this._group.getSubGroups(true);
    }
    getParentGroup() {
      return this._group.parent ? this._group.parent.getComponent() : false;
    }
    isVisible() {
      return this._group.visible;
    }
    show() {
      this._group.show();
    }
    hide() {
      this._group.hide();
    }
    toggle() {
      this._group.toggleVisibility();
    }
    scrollTo(position, ifVisible) {
      return this._group.groupManager.table.rowManager.scrollToRow(this._group, position, ifVisible);
    }
    _getSelf() {
      return this._group;
    }
    getTable() {
      return this._group.groupManager.table;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/GroupRows/Group.js
  var Group = class _Group {
    constructor(groupManager, parent, level, key, field, generator, oldGroup) {
      this.groupManager = groupManager;
      this.parent = parent;
      this.key = key;
      this.level = level;
      this.field = field;
      this.hasSubGroups = level < groupManager.groupIDLookups.length - 1;
      this.addRow = this.hasSubGroups ? this._addRowToGroup : this._addRow;
      this.type = "group";
      this.old = oldGroup;
      this.rows = [];
      this.groups = [];
      this.groupList = [];
      this.generator = generator;
      this.element = false;
      this.elementContents = false;
      this.height = 0;
      this.outerHeight = 0;
      this.initialized = false;
      this.calcs = {};
      this.initialized = false;
      this.modules = {};
      this.arrowElement = false;
      this.visible = oldGroup ? oldGroup.visible : typeof groupManager.startOpen[level] !== "undefined" ? groupManager.startOpen[level] : groupManager.startOpen[0];
      this.component = null;
      this.createElements();
      this.addBindings();
      this.createValueGroups();
    }
    wipe(elementsOnly) {
      if (!elementsOnly) {
        if (this.groupList.length) {
          this.groupList.forEach(function(group) {
            group.wipe();
          });
        } else {
          this.rows.forEach((row) => {
            if (row.modules) {
              delete row.modules.group;
            }
          });
        }
      }
      this.element = false;
      this.arrowElement = false;
      this.elementContents = false;
    }
    createElements() {
      var arrow = document.createElement("div");
      arrow.classList.add("tabulator-arrow");
      this.element = document.createElement("div");
      this.element.classList.add("tabulator-row");
      this.element.classList.add("tabulator-group");
      this.element.classList.add("tabulator-group-level-" + this.level);
      this.element.setAttribute("role", "rowgroup");
      this.arrowElement = document.createElement("div");
      this.arrowElement.classList.add("tabulator-group-toggle");
      this.arrowElement.appendChild(arrow);
      if (this.groupManager.table.options.movableRows !== false && this.groupManager.table.modExists("moveRow")) {
        this.groupManager.table.modules.moveRow.initializeGroupHeader(this);
      }
    }
    createValueGroups() {
      var level = this.level + 1;
      if (this.groupManager.allowedValues && this.groupManager.allowedValues[level]) {
        this.groupManager.allowedValues[level].forEach((value) => {
          this._createGroup(value, level);
        });
      }
    }
    addBindings() {
      var toggleElement;
      if (this.groupManager.table.options.groupToggleElement) {
        toggleElement = this.groupManager.table.options.groupToggleElement == "arrow" ? this.arrowElement : this.element;
        toggleElement.addEventListener("click", (e) => {
          if (this.groupManager.table.options.groupToggleElement === "arrow") {
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
          setTimeout(() => {
            this.toggleVisibility();
          });
        });
      }
    }
    _createGroup(groupID, level) {
      var groupKey = level + "_" + groupID;
      var group = new _Group(this.groupManager, this, level, groupID, this.groupManager.groupIDLookups[level].field, this.groupManager.headerGenerator[level] || this.groupManager.headerGenerator[0], this.old ? this.old.groups[groupKey] : false);
      this.groups[groupKey] = group;
      this.groupList.push(group);
    }
    _addRowToGroup(row) {
      var level = this.level + 1;
      if (this.hasSubGroups) {
        var groupID = this.groupManager.groupIDLookups[level].func(row.getData()), groupKey = level + "_" + groupID;
        if (this.groupManager.allowedValues && this.groupManager.allowedValues[level]) {
          if (this.groups[groupKey]) {
            this.groups[groupKey].addRow(row);
          }
        } else {
          if (!this.groups[groupKey]) {
            this._createGroup(groupID, level);
          }
          this.groups[groupKey].addRow(row);
        }
      }
    }
    _addRow(row) {
      this.rows.push(row);
      row.modules.group = this;
    }
    insertRow(row, to, after) {
      var data = this.conformRowData({});
      row.updateData(data);
      var toIndex = this.rows.indexOf(to);
      if (toIndex > -1) {
        if (after) {
          this.rows.splice(toIndex + 1, 0, row);
        } else {
          this.rows.splice(toIndex, 0, row);
        }
      } else {
        if (after) {
          this.rows.push(row);
        } else {
          this.rows.unshift(row);
        }
      }
      row.modules.group = this;
      if (this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.options.columnCalcs != "table") {
        this.groupManager.table.modules.columnCalcs.recalcGroup(this);
      }
      this.groupManager.updateGroupRows(true);
    }
    scrollHeader(left) {
      if (this.arrowElement) {
        this.arrowElement.style.marginLeft = left;
        this.groupList.forEach(function(child) {
          child.scrollHeader(left);
        });
      }
    }
    getRowIndex(row) {
    }
    //update row data to match grouping constraints
    conformRowData(data) {
      if (this.field) {
        data[this.field] = this.key;
      } else {
        console.warn("Data Conforming Error - Cannot conform row data to match new group as groupBy is a function");
      }
      if (this.parent) {
        data = this.parent.conformRowData(data);
      }
      return data;
    }
    removeRow(row) {
      var index = this.rows.indexOf(row);
      var el = row.getElement();
      if (index > -1) {
        this.rows.splice(index, 1);
      }
      if (!this.groupManager.table.options.groupValues && !this.rows.length) {
        if (this.parent) {
          this.parent.removeGroup(this);
        } else {
          this.groupManager.removeGroup(this);
        }
        this.groupManager.updateGroupRows(true);
      } else {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        if (!this.groupManager.blockRedraw) {
          this.generateGroupHeaderContents();
          if (this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.options.columnCalcs != "table") {
            this.groupManager.table.modules.columnCalcs.recalcGroup(this);
          }
        }
      }
    }
    removeGroup(group) {
      var groupKey = group.level + "_" + group.key, index;
      if (this.groups[groupKey]) {
        delete this.groups[groupKey];
        index = this.groupList.indexOf(group);
        if (index > -1) {
          this.groupList.splice(index, 1);
        }
        if (!this.groupList.length) {
          if (this.parent) {
            this.parent.removeGroup(this);
          } else {
            this.groupManager.removeGroup(this);
          }
        }
      }
    }
    getHeadersAndRows() {
      var output = [];
      output.push(this);
      this._visSet();
      if (this.calcs.top) {
        this.calcs.top.detachElement();
        this.calcs.top.deleteCells();
      }
      if (this.calcs.bottom) {
        this.calcs.bottom.detachElement();
        this.calcs.bottom.deleteCells();
      }
      if (this.visible) {
        if (this.groupList.length) {
          this.groupList.forEach(function(group) {
            output = output.concat(group.getHeadersAndRows());
          });
        } else {
          if (this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.modules.columnCalcs.hasTopCalcs()) {
            this.calcs.top = this.groupManager.table.modules.columnCalcs.generateTopRow(this.rows);
            output.push(this.calcs.top);
          }
          output = output.concat(this.rows);
          if (this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.modules.columnCalcs.hasBottomCalcs()) {
            this.calcs.bottom = this.groupManager.table.modules.columnCalcs.generateBottomRow(this.rows);
            output.push(this.calcs.bottom);
          }
        }
      } else {
        if (!this.groupList.length && this.groupManager.table.options.columnCalcs != "table") {
          if (this.groupManager.table.modExists("columnCalcs")) {
            if (this.groupManager.table.modules.columnCalcs.hasTopCalcs()) {
              if (this.groupManager.table.options.groupClosedShowCalcs) {
                this.calcs.top = this.groupManager.table.modules.columnCalcs.generateTopRow(this.rows);
                output.push(this.calcs.top);
              }
            }
            if (this.groupManager.table.modules.columnCalcs.hasBottomCalcs()) {
              if (this.groupManager.table.options.groupClosedShowCalcs) {
                this.calcs.bottom = this.groupManager.table.modules.columnCalcs.generateBottomRow(this.rows);
                output.push(this.calcs.bottom);
              }
            }
          }
        }
      }
      return output;
    }
    getData(visible, transform) {
      var output = [];
      this._visSet();
      if (!visible || visible && this.visible) {
        this.rows.forEach((row) => {
          output.push(row.getData(transform || "data"));
        });
      }
      return output;
    }
    getRowCount() {
      var count = 0;
      if (this.groupList.length) {
        this.groupList.forEach((group) => {
          count += group.getRowCount();
        });
      } else {
        count = this.rows.length;
      }
      return count;
    }
    toggleVisibility() {
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    }
    hide() {
      this.visible = false;
      if (this.groupManager.table.rowManager.getRenderMode() == "basic" && !this.groupManager.table.options.pagination) {
        this.element.classList.remove("tabulator-group-visible");
        if (this.groupList.length) {
          this.groupList.forEach((group) => {
            var rows = group.getHeadersAndRows();
            rows.forEach((row) => {
              row.detachElement();
            });
          });
        } else {
          this.rows.forEach((row) => {
            var rowEl = row.getElement();
            rowEl.parentNode.removeChild(rowEl);
          });
        }
        this.groupManager.updateGroupRows(true);
      } else {
        this.groupManager.updateGroupRows(true);
      }
      this.groupManager.table.externalEvents.dispatch("groupVisibilityChanged", this.getComponent(), false);
    }
    show() {
      this.visible = true;
      if (this.groupManager.table.rowManager.getRenderMode() == "basic" && !this.groupManager.table.options.pagination) {
        this.element.classList.add("tabulator-group-visible");
        var prev = this.generateElement();
        if (this.groupList.length) {
          this.groupList.forEach((group) => {
            var rows = group.getHeadersAndRows();
            rows.forEach((row) => {
              var rowEl = row.getElement();
              prev.parentNode.insertBefore(rowEl, prev.nextSibling);
              row.initialize();
              prev = rowEl;
            });
          });
        } else {
          this.rows.forEach((row) => {
            var rowEl = row.getElement();
            prev.parentNode.insertBefore(rowEl, prev.nextSibling);
            row.initialize();
            prev = rowEl;
          });
        }
        this.groupManager.updateGroupRows(true);
      } else {
        this.groupManager.updateGroupRows(true);
      }
      this.groupManager.table.externalEvents.dispatch("groupVisibilityChanged", this.getComponent(), true);
    }
    _visSet() {
      var data = [];
      if (typeof this.visible == "function") {
        this.rows.forEach(function(row) {
          data.push(row.getData());
        });
        this.visible = this.visible(this.key, this.getRowCount(), data, this.getComponent());
      }
    }
    getRowGroup(row) {
      var match = false;
      if (this.groupList.length) {
        this.groupList.forEach(function(group) {
          var result = group.getRowGroup(row);
          if (result) {
            match = result;
          }
        });
      } else {
        if (this.rows.find(function(item) {
          return item === row;
        })) {
          match = this;
        }
      }
      return match;
    }
    getSubGroups(component) {
      var output = [];
      this.groupList.forEach(function(child) {
        output.push(component ? child.getComponent() : child);
      });
      return output;
    }
    getRows(component, includeChildren) {
      var output = [];
      if (includeChildren && this.groupList.length) {
        this.groupList.forEach((group) => {
          output = output.concat(group.getRows(component, includeChildren));
        });
      } else {
        this.rows.forEach(function(row) {
          output.push(component ? row.getComponent() : row);
        });
      }
      return output;
    }
    generateGroupHeaderContents() {
      var data = [];
      var rows = this.getRows(false, true);
      rows.forEach(function(row) {
        data.push(row.getData());
      });
      this.elementContents = this.generator(this.key, this.getRowCount(), data, this.getComponent());
      while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
      if (typeof this.elementContents === "string") {
        this.element.innerHTML = this.elementContents;
      } else {
        this.element.appendChild(this.elementContents);
      }
      this.element.insertBefore(this.arrowElement, this.element.firstChild);
    }
    getPath(path = []) {
      path.unshift(this.key);
      if (this.parent) {
        this.parent.getPath(path);
      }
      return path;
    }
    ////////////// Standard Row Functions //////////////
    getElement() {
      return this.elementContents ? this.element : this.generateElement();
    }
    generateElement() {
      this.addBindings = false;
      this._visSet();
      if (this.visible) {
        this.element.classList.add("tabulator-group-visible");
      } else {
        this.element.classList.remove("tabulator-group-visible");
      }
      for (var i = 0; i < this.element.childNodes.length; ++i) {
        this.element.childNodes[i].parentNode.removeChild(this.element.childNodes[i]);
      }
      this.generateGroupHeaderContents();
      return this.element;
    }
    detachElement() {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
    //normalize the height of elements in the row
    normalizeHeight() {
      this.setHeight(this.element.clientHeight);
    }
    initialize(force) {
      if (!this.initialized || force) {
        this.normalizeHeight();
        this.initialized = true;
      }
    }
    reinitialize() {
      this.initialized = false;
      this.height = 0;
      if (Helpers.elVisible(this.element)) {
        this.initialize(true);
      }
    }
    setHeight(height) {
      if (this.height != height) {
        this.height = height;
        this.outerHeight = this.element.offsetHeight;
      }
    }
    //return rows outer height
    getHeight() {
      return this.outerHeight;
    }
    getGroup() {
      return this;
    }
    reinitializeHeight() {
    }
    calcHeight() {
    }
    setCellHeight() {
    }
    clearCellHeight() {
    }
    deinitializeHeight() {
    }
    rendered() {
    }
    //////////////// Object Generation /////////////////
    getComponent() {
      if (!this.component) {
        this.component = new GroupComponent(this);
      }
      return this.component;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/GroupRows/GroupRows.js
  var GroupRows = class extends Module {
    static moduleName = "groupRows";
    constructor(table) {
      super(table);
      this.groupIDLookups = false;
      this.startOpen = [function() {
        return false;
      }];
      this.headerGenerator = [function() {
        return "";
      }];
      this.groupList = [];
      this.allowedValues = false;
      this.groups = {};
      this.displayHandler = this.getRows.bind(this);
      this.blockRedraw = false;
      this.registerTableOption("groupBy", false);
      this.registerTableOption("groupStartOpen", true);
      this.registerTableOption("groupValues", false);
      this.registerTableOption("groupUpdateOnCellEdit", false);
      this.registerTableOption("groupHeader", false);
      this.registerTableOption("groupHeaderPrint", null);
      this.registerTableOption("groupHeaderClipboard", null);
      this.registerTableOption("groupHeaderHtmlOutput", null);
      this.registerTableOption("groupHeaderDownload", null);
      this.registerTableOption("groupToggleElement", "arrow");
      this.registerTableOption("groupClosedShowCalcs", false);
      this.registerTableFunction("setGroupBy", this.setGroupBy.bind(this));
      this.registerTableFunction("setGroupValues", this.setGroupValues.bind(this));
      this.registerTableFunction("setGroupStartOpen", this.setGroupStartOpen.bind(this));
      this.registerTableFunction("setGroupHeader", this.setGroupHeader.bind(this));
      this.registerTableFunction("getGroups", this.userGetGroups.bind(this));
      this.registerTableFunction("getGroupedData", this.userGetGroupedData.bind(this));
      this.registerComponentFunction("row", "getGroup", this.rowGetGroup.bind(this));
    }
    //initialize group configuration
    initialize() {
      this.subscribe("table-destroy", this._blockRedrawing.bind(this));
      this.subscribe("rows-wipe", this._blockRedrawing.bind(this));
      this.subscribe("rows-wiped", this._restore_redrawing.bind(this));
      if (this.table.options.groupBy) {
        if (this.table.options.groupUpdateOnCellEdit) {
          this.subscribe("cell-value-updated", this.cellUpdated.bind(this));
          this.subscribe("row-data-changed", this.reassignRowToGroup.bind(this), 0);
        }
        this.subscribe("table-built", this.configureGroupSetup.bind(this));
        this.subscribe("row-deleting", this.rowDeleting.bind(this));
        this.subscribe("row-deleted", this.rowsUpdated.bind(this));
        this.subscribe("scroll-horizontal", this.scrollHeaders.bind(this));
        this.subscribe("rows-wipe", this.wipe.bind(this));
        this.subscribe("rows-added", this.rowsUpdated.bind(this));
        this.subscribe("row-moving", this.rowMoving.bind(this));
        this.subscribe("row-adding-index", this.rowAddingIndex.bind(this));
        this.subscribe("rows-sample", this.rowSample.bind(this));
        this.subscribe("render-virtual-fill", this.virtualRenderFill.bind(this));
        this.registerDisplayHandler(this.displayHandler, 20);
        this.initialized = true;
      }
    }
    _blockRedrawing() {
      this.blockRedraw = true;
    }
    _restore_redrawing() {
      this.blockRedraw = false;
    }
    configureGroupSetup() {
      if (this.table.options.groupBy) {
        var groupBy = this.table.options.groupBy, startOpen = this.table.options.groupStartOpen, groupHeader = this.table.options.groupHeader;
        this.allowedValues = this.table.options.groupValues;
        if (Array.isArray(groupBy) && Array.isArray(groupHeader) && groupBy.length > groupHeader.length) {
          console.warn("Error creating group headers, groupHeader array is shorter than groupBy array");
        }
        this.headerGenerator = [function() {
          return "";
        }];
        this.startOpen = [function() {
          return false;
        }];
        this.langBind("groups|item", (langValue, lang) => {
          this.headerGenerator[0] = (value, count, data) => {
            return (typeof value === "undefined" ? "" : value) + "<span>(" + count + " " + (count === 1 ? langValue : lang.groups.items) + ")</span>";
          };
        });
        this.groupIDLookups = [];
        if (groupBy) {
          if (this.table.modExists("columnCalcs") && this.table.options.columnCalcs != "table" && this.table.options.columnCalcs != "both") {
            this.table.modules.columnCalcs.removeCalcs();
          }
        } else {
          if (this.table.modExists("columnCalcs") && this.table.options.columnCalcs != "group") {
            var cols = this.table.columnManager.getRealColumns();
            cols.forEach((col) => {
              if (col.definition.topCalc) {
                this.table.modules.columnCalcs.initializeTopRow();
              }
              if (col.definition.bottomCalc) {
                this.table.modules.columnCalcs.initializeBottomRow();
              }
            });
          }
        }
        if (!Array.isArray(groupBy)) {
          groupBy = [groupBy];
        }
        groupBy.forEach((group, i) => {
          var lookupFunc, column;
          if (typeof group == "function") {
            lookupFunc = group;
          } else {
            column = this.table.columnManager.getColumnByField(group);
            if (column) {
              lookupFunc = function(data) {
                return column.getFieldValue(data);
              };
            } else {
              lookupFunc = function(data) {
                return data[group];
              };
            }
          }
          this.groupIDLookups.push({
            field: typeof group === "function" ? false : group,
            func: lookupFunc,
            values: this.allowedValues ? this.allowedValues[i] : false
          });
        });
        if (startOpen) {
          if (!Array.isArray(startOpen)) {
            startOpen = [startOpen];
          }
          startOpen.forEach((level) => {
            level = typeof level == "function" ? level : function() {
              return true;
            };
          });
          this.startOpen = startOpen;
        }
        if (groupHeader) {
          this.headerGenerator = Array.isArray(groupHeader) ? groupHeader : [groupHeader];
        }
      } else {
        this.groupList = [];
        this.groups = {};
      }
    }
    rowSample(rows, prevValue) {
      if (this.table.options.groupBy) {
        var group = this.getGroups(false)[0];
        prevValue.push(group.getRows(false)[0]);
      }
      return prevValue;
    }
    virtualRenderFill() {
      var el = this.table.rowManager.tableElement;
      var rows = this.table.rowManager.getVisibleRows();
      if (this.table.options.groupBy) {
        rows = rows.filter((row) => {
          return row.type !== "group";
        });
        el.style.minWidth = !rows.length ? this.table.columnManager.getWidth() + "px" : "";
      } else {
        return rows;
      }
    }
    rowAddingIndex(row, index, top) {
      if (this.table.options.groupBy) {
        this.assignRowToGroup(row);
        var groupRows = row.modules.group.rows;
        if (groupRows.length > 1) {
          if (!index || index && groupRows.indexOf(index) == -1) {
            if (top) {
              if (groupRows[0] !== row) {
                index = groupRows[0];
                this.table.rowManager.moveRowInArray(row.modules.group.rows, row, index, !top);
              }
            } else {
              if (groupRows[groupRows.length - 1] !== row) {
                index = groupRows[groupRows.length - 1];
                this.table.rowManager.moveRowInArray(row.modules.group.rows, row, index, !top);
              }
            }
          } else {
            this.table.rowManager.moveRowInArray(row.modules.group.rows, row, index, !top);
          }
        }
        return index;
      }
    }
    trackChanges() {
      this.dispatch("group-changed");
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    setGroupBy(groups) {
      this.table.options.groupBy = groups;
      if (!this.initialized) {
        this.initialize();
      }
      this.configureGroupSetup();
      if (!groups && this.table.modExists("columnCalcs") && this.table.options.columnCalcs === true) {
        this.table.modules.columnCalcs.reinitializeCalcs();
      }
      this.refreshData();
      this.trackChanges();
    }
    setGroupValues(groupValues) {
      this.table.options.groupValues = groupValues;
      this.configureGroupSetup();
      this.refreshData();
      this.trackChanges();
    }
    setGroupStartOpen(values) {
      this.table.options.groupStartOpen = values;
      this.configureGroupSetup();
      if (this.table.options.groupBy) {
        this.refreshData();
        this.trackChanges();
      } else {
        console.warn("Grouping Update - cant refresh view, no groups have been set");
      }
    }
    setGroupHeader(values) {
      this.table.options.groupHeader = values;
      this.configureGroupSetup();
      if (this.table.options.groupBy) {
        this.refreshData();
        this.trackChanges();
      } else {
        console.warn("Grouping Update - cant refresh view, no groups have been set");
      }
    }
    userGetGroups(values) {
      return this.getGroups(true);
    }
    // get grouped table data in the same format as getData()
    userGetGroupedData() {
      return this.table.options.groupBy ? this.getGroupedData() : this.getData();
    }
    ///////////////////////////////////////
    ///////// Component Functions /////////
    ///////////////////////////////////////
    rowGetGroup(row) {
      return row.modules.group ? row.modules.group.getComponent() : false;
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    rowMoving(from, to, after) {
      if (this.table.options.groupBy) {
        if (!after && to instanceof Group) {
          to = this.table.rowManager.prevDisplayRow(from) || to;
        }
        var toGroup = to instanceof Group ? to : to.modules.group;
        var fromGroup = from instanceof Group ? from : from.modules.group;
        if (toGroup === fromGroup) {
          this.table.rowManager.moveRowInArray(toGroup.rows, from, to, after);
        } else {
          if (fromGroup) {
            fromGroup.removeRow(from);
          }
          toGroup.insertRow(from, to, after);
        }
      }
    }
    rowDeleting(row) {
      if (this.table.options.groupBy && row.modules.group) {
        row.modules.group.removeRow(row);
      }
    }
    rowsUpdated(row) {
      if (this.table.options.groupBy) {
        this.updateGroupRows(true);
      }
    }
    cellUpdated(cell) {
      if (this.table.options.groupBy) {
        this.reassignRowToGroup(cell.row);
      }
    }
    //return appropriate rows with group headers
    getRows(rows) {
      if (this.table.options.groupBy && this.groupIDLookups.length) {
        this.dispatchExternal("dataGrouping");
        this.generateGroups(rows);
        if (this.subscribedExternal("dataGrouped")) {
          this.dispatchExternal("dataGrouped", this.getGroups(true));
        }
        return this.updateGroupRows();
      } else {
        return rows.slice(0);
      }
    }
    getGroups(component) {
      var groupComponents = [];
      this.groupList.forEach(function(group) {
        groupComponents.push(component ? group.getComponent() : group);
      });
      return groupComponents;
    }
    getChildGroups(group) {
      var groupComponents = [];
      if (!group) {
        group = this;
      }
      group.groupList.forEach((child) => {
        if (child.groupList.length) {
          groupComponents = groupComponents.concat(this.getChildGroups(child));
        } else {
          groupComponents.push(child);
        }
      });
      return groupComponents;
    }
    wipe() {
      if (this.table.options.groupBy) {
        this.groupList.forEach(function(group) {
          group.wipe();
        });
        this.groupList = [];
        this.groups = {};
      }
    }
    pullGroupListData(groupList) {
      var groupListData = [];
      groupList.forEach((group) => {
        var groupHeader = {};
        groupHeader.level = 0;
        groupHeader.rowCount = 0;
        groupHeader.headerContent = "";
        var childData = [];
        if (group.hasSubGroups) {
          childData = this.pullGroupListData(group.groupList);
          groupHeader.level = group.level;
          groupHeader.rowCount = childData.length - group.groupList.length;
          groupHeader.headerContent = group.generator(group.key, groupHeader.rowCount, group.rows, group);
          groupListData.push(groupHeader);
          groupListData = groupListData.concat(childData);
        } else {
          groupHeader.level = group.level;
          groupHeader.headerContent = group.generator(group.key, group.rows.length, group.rows, group);
          groupHeader.rowCount = group.getRows().length;
          groupListData.push(groupHeader);
          group.getRows().forEach((row) => {
            groupListData.push(row.getData("data"));
          });
        }
      });
      return groupListData;
    }
    getGroupedData() {
      return this.pullGroupListData(this.groupList);
    }
    getRowGroup(row) {
      var match = false;
      if (this.options("dataTree")) {
        row = this.table.modules.dataTree.getTreeParentRoot(row);
      }
      this.groupList.forEach((group) => {
        var result = group.getRowGroup(row);
        if (result) {
          match = result;
        }
      });
      return match;
    }
    countGroups() {
      return this.groupList.length;
    }
    generateGroups(rows) {
      var oldGroups = this.groups;
      this.groups = {};
      this.groupList = [];
      if (this.allowedValues && this.allowedValues[0]) {
        this.allowedValues[0].forEach((value) => {
          this.createGroup(value, 0, oldGroups);
        });
        rows.forEach((row) => {
          this.assignRowToExistingGroup(row, oldGroups);
        });
      } else {
        rows.forEach((row) => {
          this.assignRowToGroup(row, oldGroups);
        });
      }
      Object.values(oldGroups).forEach((group) => {
        group.wipe(true);
      });
    }
    createGroup(groupID, level, oldGroups) {
      var groupKey = level + "_" + groupID, group;
      oldGroups = oldGroups || [];
      group = new Group(this, false, level, groupID, this.groupIDLookups[0].field, this.headerGenerator[0], oldGroups[groupKey]);
      this.groups[groupKey] = group;
      this.groupList.push(group);
    }
    assignRowToExistingGroup(row, oldGroups) {
      var groupID = this.groupIDLookups[0].func(row.getData()), groupKey = "0_" + groupID;
      if (this.groups[groupKey]) {
        this.groups[groupKey].addRow(row);
      }
    }
    assignRowToGroup(row, oldGroups) {
      var groupID = this.groupIDLookups[0].func(row.getData()), newGroupNeeded = !this.groups["0_" + groupID];
      if (newGroupNeeded) {
        this.createGroup(groupID, 0, oldGroups);
      }
      this.groups["0_" + groupID].addRow(row);
      return !newGroupNeeded;
    }
    reassignRowToGroup(row) {
      if (row.type === "row") {
        var oldRowGroup = row.modules.group, oldGroupPath = oldRowGroup.getPath(), newGroupPath = this.getExpectedPath(row), samePath;
        samePath = oldGroupPath.length == newGroupPath.length && oldGroupPath.every((element, index) => {
          return element === newGroupPath[index];
        });
        if (!samePath) {
          oldRowGroup.removeRow(row);
          this.assignRowToGroup(row, this.groups);
          this.refreshData(true);
        }
      }
    }
    getExpectedPath(row) {
      var groupPath = [], rowData = row.getData();
      this.groupIDLookups.forEach((groupId) => {
        groupPath.push(groupId.func(rowData));
      });
      return groupPath;
    }
    updateGroupRows(force) {
      var output = [];
      if (!this.blockRedraw) {
        this.groupList.forEach((group) => {
          output = output.concat(group.getHeadersAndRows());
        });
        if (force) {
          this.refreshData(true);
        }
      }
      return output;
    }
    scrollHeaders(left) {
      if (this.table.options.groupBy) {
        if (this.table.options.renderHorizontal === "virtual") {
          left -= this.table.columnManager.renderer.vDomPadLeft;
        }
        left = left + "px";
        this.groupList.forEach((group) => {
          group.scrollHeader(left);
        });
      }
    }
    removeGroup(group) {
      var groupKey = group.level + "_" + group.key, index;
      if (this.groups[groupKey]) {
        delete this.groups[groupKey];
        index = this.groupList.indexOf(group);
        if (index > -1) {
          this.groupList.splice(index, 1);
        }
      }
    }
    checkBasicModeGroupHeaderWidth() {
      var element = this.table.rowManager.tableElement, onlyGroupHeaders = true;
      this.table.rowManager.getDisplayRows().forEach((row, index) => {
        this.table.rowManager.styleRow(row, index);
        element.appendChild(row.getElement());
        row.initialize(true);
        if (row.type !== "group") {
          onlyGroupHeaders = false;
        }
      });
      if (onlyGroupHeaders) {
        element.style.minWidth = this.table.columnManager.getWidth() + "px";
      } else {
        element.style.minWidth = "";
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/History/defaults/undoers.js
  var undoers_default = {
    cellEdit: function(action) {
      action.component.setValueProcessData(action.data.oldValue);
      action.component.cellRendered();
    },
    rowAdd: function(action) {
      action.component.deleteActual();
      this.table.rowManager.checkPlaceholder();
    },
    rowDelete: function(action) {
      var newRow = this.table.rowManager.addRowActual(action.data.data, action.data.pos, action.data.index);
      if (this.table.options.groupBy && this.table.modExists("groupRows")) {
        this.table.modules.groupRows.updateGroupRows(true);
      }
      this._rebindRow(action.component, newRow);
      this.table.rowManager.checkPlaceholder();
    },
    rowMove: function(action) {
      var after = action.data.posFrom - action.data.posTo > 0;
      this.table.rowManager.moveRowActual(action.component, this.table.rowManager.getRowFromPosition(action.data.posFrom), after);
      this.table.rowManager.regenerateRowPositions();
      this.table.rowManager.reRenderInPosition();
    }
  };

  // node_modules/tabulator-tables/src/js/modules/History/defaults/redoers.js
  var redoers_default = {
    cellEdit: function(action) {
      action.component.setValueProcessData(action.data.newValue);
      action.component.cellRendered();
    },
    rowAdd: function(action) {
      var newRow = this.table.rowManager.addRowActual(action.data.data, action.data.pos, action.data.index);
      if (this.table.options.groupBy && this.table.modExists("groupRows")) {
        this.table.modules.groupRows.updateGroupRows(true);
      }
      this._rebindRow(action.component, newRow);
      this.table.rowManager.checkPlaceholder();
    },
    rowDelete: function(action) {
      action.component.deleteActual();
      this.table.rowManager.checkPlaceholder();
    },
    rowMove: function(action) {
      this.table.rowManager.moveRowActual(action.component, this.table.rowManager.getRowFromPosition(action.data.posTo), action.data.after);
      this.table.rowManager.regenerateRowPositions();
      this.table.rowManager.reRenderInPosition();
    }
  };

  // node_modules/tabulator-tables/src/js/modules/History/extensions/keybindings/bindings.js
  var bindings_default2 = {
    undo: ["ctrl + 90", "meta + 90"],
    redo: ["ctrl + 89", "meta + 89"]
  };

  // node_modules/tabulator-tables/src/js/modules/History/extensions/keybindings/actions.js
  var actions_default2 = {
    undo: function(e) {
      var cell = false;
      if (this.table.options.history && this.table.modExists("history") && this.table.modExists("edit")) {
        cell = this.table.modules.edit.currentCell;
        if (!cell) {
          e.preventDefault();
          this.table.modules.history.undo();
        }
      }
    },
    redo: function(e) {
      var cell = false;
      if (this.table.options.history && this.table.modExists("history") && this.table.modExists("edit")) {
        cell = this.table.modules.edit.currentCell;
        if (!cell) {
          e.preventDefault();
          this.table.modules.history.redo();
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/History/extensions/extensions.js
  var extensions_default2 = {
    keybindings: {
      bindings: bindings_default2,
      actions: actions_default2
    }
  };

  // node_modules/tabulator-tables/src/js/modules/History/History.js
  var History = class _History extends Module {
    static moduleName = "history";
    static moduleExtensions = extensions_default2;
    //load defaults
    static undoers = undoers_default;
    static redoers = redoers_default;
    constructor(table) {
      super(table);
      this.history = [];
      this.index = -1;
      this.registerTableOption("history", false);
    }
    initialize() {
      if (this.table.options.history) {
        this.subscribe("cell-value-updated", this.cellUpdated.bind(this));
        this.subscribe("cell-delete", this.clearComponentHistory.bind(this));
        this.subscribe("row-delete", this.rowDeleted.bind(this));
        this.subscribe("rows-wipe", this.clear.bind(this));
        this.subscribe("row-added", this.rowAdded.bind(this));
        this.subscribe("row-move", this.rowMoved.bind(this));
      }
      this.registerTableFunction("undo", this.undo.bind(this));
      this.registerTableFunction("redo", this.redo.bind(this));
      this.registerTableFunction("getHistoryUndoSize", this.getHistoryUndoSize.bind(this));
      this.registerTableFunction("getHistoryRedoSize", this.getHistoryRedoSize.bind(this));
      this.registerTableFunction("clearHistory", this.clear.bind(this));
    }
    rowMoved(from, to, after) {
      this.action("rowMove", from, { posFrom: from.getPosition(), posTo: to.getPosition(), to, after });
    }
    rowAdded(row, data, pos, index) {
      this.action("rowAdd", row, { data, pos, index });
    }
    rowDeleted(row) {
      var index, rows;
      if (this.table.options.groupBy) {
        rows = row.getComponent().getGroup()._getSelf().rows;
        index = rows.indexOf(row);
        if (index) {
          index = rows[index - 1];
        }
      } else {
        index = row.table.rowManager.getRowIndex(row);
        if (index) {
          index = row.table.rowManager.rows[index - 1];
        }
      }
      this.action("rowDelete", row, { data: row.getData(), pos: !index, index });
    }
    cellUpdated(cell) {
      this.action("cellEdit", cell, { oldValue: cell.oldValue, newValue: cell.value });
    }
    clear() {
      this.history = [];
      this.index = -1;
    }
    action(type, component, data) {
      this.history = this.history.slice(0, this.index + 1);
      this.history.push({
        type,
        component,
        data
      });
      this.index++;
    }
    getHistoryUndoSize() {
      return this.index + 1;
    }
    getHistoryRedoSize() {
      return this.history.length - (this.index + 1);
    }
    clearComponentHistory(component) {
      var index = this.history.findIndex(function(item) {
        return item.component === component;
      });
      if (index > -1) {
        this.history.splice(index, 1);
        if (index <= this.index) {
          this.index--;
        }
        this.clearComponentHistory(component);
      }
    }
    undo() {
      if (this.index > -1) {
        let action = this.history[this.index];
        _History.undoers[action.type].call(this, action);
        this.index--;
        this.dispatchExternal("historyUndo", action.type, action.component.getComponent(), action.data);
        return true;
      } else {
        console.warn(this.options("history") ? "History Undo Error - No more history to undo" : "History module not enabled");
        return false;
      }
    }
    redo() {
      if (this.history.length - 1 > this.index) {
        this.index++;
        let action = this.history[this.index];
        _History.redoers[action.type].call(this, action);
        this.dispatchExternal("historyRedo", action.type, action.component.getComponent(), action.data);
        return true;
      } else {
        console.warn(this.options("history") ? "History Redo Error - No more history to redo" : "History module not enabled");
        return false;
      }
    }
    //rebind rows to new element after deletion
    _rebindRow(oldRow, newRow) {
      this.history.forEach(function(action) {
        if (action.component instanceof Row) {
          if (action.component === oldRow) {
            action.component = newRow;
          }
        } else if (action.component instanceof Cell) {
          if (action.component.row === oldRow) {
            var field = action.component.column.getField();
            if (field) {
              action.component = newRow.getCell(field);
            }
          }
        }
      });
    }
  };

  // node_modules/tabulator-tables/src/js/modules/HtmlTableImport/HtmlTableImport.js
  var HtmlTableImport = class extends Module {
    static moduleName = "htmlTableImport";
    constructor(table) {
      super(table);
      this.fieldIndex = [];
      this.hasIndex = false;
    }
    initialize() {
      this.tableElementCheck();
    }
    tableElementCheck() {
      if (this.table.originalElement && this.table.originalElement.tagName === "TABLE") {
        if (this.table.originalElement.childNodes.length) {
          this.parseTable();
        } else {
          console.warn("Unable to parse data from empty table tag, Tabulator should be initialized on a div tag unless importing data from a table element.");
        }
      }
    }
    parseTable() {
      var element = this.table.originalElement, options = this.table.options, headers = element.getElementsByTagName("th"), rows = element.getElementsByTagName("tbody")[0], data = [];
      this.hasIndex = false;
      this.dispatchExternal("htmlImporting");
      rows = rows ? rows.getElementsByTagName("tr") : [];
      this._extractOptions(element, options);
      if (headers.length) {
        this._extractHeaders(headers, rows);
      } else {
        this._generateBlankHeaders(headers, rows);
      }
      for (var index = 0; index < rows.length; index++) {
        var row = rows[index], cells = row.getElementsByTagName("td"), item = {};
        if (!this.hasIndex) {
          item[options.index] = index;
        }
        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          if (typeof this.fieldIndex[i] !== "undefined") {
            item[this.fieldIndex[i]] = cell.innerHTML;
          }
        }
        data.push(item);
      }
      options.data = data;
      this.dispatchExternal("htmlImported");
    }
    //extract tabulator attribute options
    _extractOptions(element, options, defaultOptions) {
      var attributes = element.attributes;
      var optionsArr = defaultOptions ? Object.keys(defaultOptions) : Object.keys(options);
      var optionsList = {};
      optionsArr.forEach((item) => {
        optionsList[item.toLowerCase()] = item;
      });
      for (var index in attributes) {
        var attrib = attributes[index];
        var name;
        if (attrib && typeof attrib == "object" && attrib.name && attrib.name.indexOf("tabulator-") === 0) {
          name = attrib.name.replace("tabulator-", "");
          if (typeof optionsList[name] !== "undefined") {
            options[optionsList[name]] = this._attribValue(attrib.value);
          }
        }
      }
    }
    //get value of attribute
    _attribValue(value) {
      if (value === "true") {
        return true;
      }
      if (value === "false") {
        return false;
      }
      return value;
    }
    //find column if it has already been defined
    _findCol(title) {
      var match = this.table.options.columns.find((column) => {
        return column.title === title;
      });
      return match || false;
    }
    //extract column from headers
    _extractHeaders(headers, rows) {
      for (var index = 0; index < headers.length; index++) {
        var header = headers[index], exists = false, col = this._findCol(header.textContent), width;
        if (col) {
          exists = true;
        } else {
          col = { title: header.textContent.trim() };
        }
        if (!col.field) {
          col.field = header.textContent.trim().toLowerCase().replaceAll(" ", "_");
        }
        width = header.getAttribute("width");
        if (width && !col.width) {
          col.width = width;
        }
        this._extractOptions(header, col, this.table.columnManager.optionsList.registeredDefaults);
        this.fieldIndex[index] = col.field;
        if (col.field == this.table.options.index) {
          this.hasIndex = true;
        }
        if (!exists) {
          this.table.options.columns.push(col);
        }
      }
    }
    //generate blank headers
    _generateBlankHeaders(headers, rows) {
      for (var index = 0; index < headers.length; index++) {
        var header = headers[index], col = { title: "", field: "col" + index };
        this.fieldIndex[index] = col.field;
        var width = header.getAttribute("width");
        if (width) {
          col.width = width;
        }
        this.table.options.columns.push(col);
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Import/defaults/importers/csv.js
  function csv_default2(input) {
    var data = [], row = 0, col = 0, inQuote = false;
    for (let index = 0; index < input.length; index++) {
      let char = input[index], nextChar = input[index + 1];
      if (!data[row]) {
        data[row] = [];
      }
      if (!data[row][col]) {
        data[row][col] = "";
      }
      if (char == '"' && inQuote && nextChar == '"') {
        data[row][col] += char;
        index++;
        continue;
      }
      if (char == '"') {
        inQuote = !inQuote;
        continue;
      }
      if (char == "," && !inQuote) {
        col++;
        continue;
      }
      if (char == "\r" && nextChar == "\n" && !inQuote) {
        col = 0;
        row++;
        index++;
        continue;
      }
      if ((char == "\r" || char == "\n") && !inQuote) {
        col = 0;
        row++;
        continue;
      }
      data[row][col] += char;
    }
    return data;
  }

  // node_modules/tabulator-tables/src/js/modules/Import/defaults/importers/json.js
  function json_default2(input) {
    try {
      return JSON.parse(input);
    } catch (e) {
      console.warn("JSON Import Error - File contents is invalid JSON", e);
      return Promise.reject();
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Import/defaults/importers/array.js
  function array_default(input) {
    return input;
  }

  // node_modules/tabulator-tables/src/js/modules/Import/defaults/importers/xlsx.js
  function xlsx_default2(input, floop) {
    var workbook2 = XLSX.read(input);
    var sheet = workbook2.Sheets[workbook2.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, {});
  }

  // node_modules/tabulator-tables/src/js/modules/Import/defaults/importers.js
  var importers_default = {
    csv: csv_default2,
    json: json_default2,
    array: array_default,
    xlsx: xlsx_default2
  };

  // node_modules/tabulator-tables/src/js/modules/Import/Import.js
  var Import = class _Import extends Module {
    static moduleName = "import";
    //load defaults
    static importers = importers_default;
    constructor(table) {
      super(table);
      this.registerTableOption("importFormat");
      this.registerTableOption("importReader", "text");
    }
    initialize() {
      this.registerTableFunction("import", this.importFromFile.bind(this));
      if (this.table.options.importFormat) {
        this.subscribe("data-loading", this.loadDataCheck.bind(this), 10);
        this.subscribe("data-load", this.loadData.bind(this), 10);
      }
    }
    loadDataCheck(data) {
      return this.table.options.importFormat && (typeof data === "string" || Array.isArray(data) && data.length && Array.isArray(data));
    }
    loadData(data, params, config, silent, previousData) {
      return this.importData(this.lookupImporter(), data).then(this.structureData.bind(this)).catch((err) => {
        console.error("Import Error:", err || "Unable to import data");
        return Promise.reject(err);
      });
    }
    lookupImporter(importFormat) {
      var importer;
      if (!importFormat) {
        importFormat = this.table.options.importFormat;
      }
      if (typeof importFormat === "string") {
        importer = _Import.importers[importFormat];
      } else {
        importer = importFormat;
      }
      if (!importer) {
        console.error("Import Error - Importer not found:", importFormat);
      }
      return importer;
    }
    importFromFile(importFormat, extension, importReader) {
      var importer = this.lookupImporter(importFormat);
      if (importer) {
        return this.pickFile(extension, importReader).then(this.importData.bind(this, importer)).then(this.structureData.bind(this)).then(this.setData.bind(this)).catch((err) => {
          this.dispatch("import-error", err);
          this.dispatchExternal("importError", err);
          console.error("Import Error:", err || "Unable to import file");
          return Promise.reject(err);
        });
      }
    }
    pickFile(extensions, importReader) {
      return new Promise((resolve, reject) => {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = extensions;
        input.addEventListener("change", (e) => {
          var file = input.files[0], reader = new FileReader();
          this.dispatch("import-importing", input.files);
          this.dispatchExternal("importImporting", input.files);
          switch (importReader || this.table.options.importReader) {
            case "buffer":
              reader.readAsArrayBuffer(file);
              break;
            case "binary":
              reader.readAsBinaryString(file);
              break;
            case "url":
              reader.readAsDataURL(file);
              break;
            case "text":
            default:
              reader.readAsText(file);
          }
          reader.onload = (e2) => {
            resolve(reader.result);
          };
          reader.onerror = (e2) => {
            console.warn("File Load Error - Unable to read file");
            reject();
          };
        });
        this.dispatch("import-choose");
        this.dispatchExternal("importChoose");
        input.click();
      });
    }
    importData(importer, fileContents) {
      var data = importer.call(this.table, fileContents);
      if (data instanceof Promise) {
        return data;
      } else {
        return data ? Promise.resolve(data) : Promise.reject();
      }
    }
    structureData(parsedData) {
      var data = [];
      if (Array.isArray(parsedData) && parsedData.length && Array.isArray(parsedData[0])) {
        if (this.table.options.autoColumns) {
          data = this.structureArrayToObject(parsedData);
        } else {
          data = this.structureArrayToColumns(parsedData);
        }
        return data;
      } else {
        return parsedData;
      }
    }
    structureArrayToObject(parsedData) {
      var columns = parsedData.shift();
      var data = parsedData.map((values) => {
        var row = {};
        columns.forEach((key, i) => {
          row[key] = values[i];
        });
        return row;
      });
      return data;
    }
    structureArrayToColumns(parsedData) {
      var data = [], columns = this.table.getColumns();
      if (columns[0] && parsedData[0][0]) {
        if (columns[0].getDefinition().title === parsedData[0][0]) {
          parsedData.shift();
        }
      }
      parsedData.forEach((rowData) => {
        var row = {};
        rowData.forEach((value, index) => {
          var column = columns[index];
          if (column) {
            row[column.getField()] = value;
          }
        });
        data.push(row);
      });
      return data;
    }
    setData(data) {
      this.dispatch("import-imported", data);
      this.dispatchExternal("importImported", data);
      return this.table.setData(data);
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Interaction/Interaction.js
  var Interaction = class extends Module {
    static moduleName = "interaction";
    constructor(table) {
      super(table);
      this.eventMap = {
        //row events
        rowClick: "row-click",
        rowDblClick: "row-dblclick",
        rowContext: "row-contextmenu",
        rowMouseEnter: "row-mouseenter",
        rowMouseLeave: "row-mouseleave",
        rowMouseOver: "row-mouseover",
        rowMouseOut: "row-mouseout",
        rowMouseMove: "row-mousemove",
        rowMouseDown: "row-mousedown",
        rowMouseUp: "row-mouseup",
        rowTap: "row",
        rowDblTap: "row",
        rowTapHold: "row",
        //cell events
        cellClick: "cell-click",
        cellDblClick: "cell-dblclick",
        cellContext: "cell-contextmenu",
        cellMouseEnter: "cell-mouseenter",
        cellMouseLeave: "cell-mouseleave",
        cellMouseOver: "cell-mouseover",
        cellMouseOut: "cell-mouseout",
        cellMouseMove: "cell-mousemove",
        cellMouseDown: "cell-mousedown",
        cellMouseUp: "cell-mouseup",
        cellTap: "cell",
        cellDblTap: "cell",
        cellTapHold: "cell",
        //column header events
        headerClick: "column-click",
        headerDblClick: "column-dblclick",
        headerContext: "column-contextmenu",
        headerMouseEnter: "column-mouseenter",
        headerMouseLeave: "column-mouseleave",
        headerMouseOver: "column-mouseover",
        headerMouseOut: "column-mouseout",
        headerMouseMove: "column-mousemove",
        headerMouseDown: "column-mousedown",
        headerMouseUp: "column-mouseup",
        headerTap: "column",
        headerDblTap: "column",
        headerTapHold: "column",
        //group header
        groupClick: "group-click",
        groupDblClick: "group-dblclick",
        groupContext: "group-contextmenu",
        groupMouseEnter: "group-mouseenter",
        groupMouseLeave: "group-mouseleave",
        groupMouseOver: "group-mouseover",
        groupMouseOut: "group-mouseout",
        groupMouseMove: "group-mousemove",
        groupMouseDown: "group-mousedown",
        groupMouseUp: "group-mouseup",
        groupTap: "group",
        groupDblTap: "group",
        groupTapHold: "group"
      };
      this.subscribers = {};
      this.touchSubscribers = {};
      this.columnSubscribers = {};
      this.touchWatchers = {
        row: {
          tap: null,
          tapDbl: null,
          tapHold: null
        },
        cell: {
          tap: null,
          tapDbl: null,
          tapHold: null
        },
        column: {
          tap: null,
          tapDbl: null,
          tapHold: null
        },
        group: {
          tap: null,
          tapDbl: null,
          tapHold: null
        }
      };
      this.registerColumnOption("headerClick");
      this.registerColumnOption("headerDblClick");
      this.registerColumnOption("headerContext");
      this.registerColumnOption("headerMouseEnter");
      this.registerColumnOption("headerMouseLeave");
      this.registerColumnOption("headerMouseOver");
      this.registerColumnOption("headerMouseOut");
      this.registerColumnOption("headerMouseMove");
      this.registerColumnOption("headerMouseDown");
      this.registerColumnOption("headerMouseUp");
      this.registerColumnOption("headerTap");
      this.registerColumnOption("headerDblTap");
      this.registerColumnOption("headerTapHold");
      this.registerColumnOption("cellClick");
      this.registerColumnOption("cellDblClick");
      this.registerColumnOption("cellContext");
      this.registerColumnOption("cellMouseEnter");
      this.registerColumnOption("cellMouseLeave");
      this.registerColumnOption("cellMouseOver");
      this.registerColumnOption("cellMouseOut");
      this.registerColumnOption("cellMouseMove");
      this.registerColumnOption("cellMouseDown");
      this.registerColumnOption("cellMouseUp");
      this.registerColumnOption("cellTap");
      this.registerColumnOption("cellDblTap");
      this.registerColumnOption("cellTapHold");
    }
    initialize() {
      this.initializeExternalEvents();
      this.subscribe("column-init", this.initializeColumn.bind(this));
      this.subscribe("cell-dblclick", this.cellContentsSelectionFixer.bind(this));
      this.subscribe("scroll-horizontal", this.clearTouchWatchers.bind(this));
      this.subscribe("scroll-vertical", this.clearTouchWatchers.bind(this));
    }
    clearTouchWatchers() {
      var types = Object.values(this.touchWatchers);
      types.forEach((type) => {
        for (let key in type) {
          type[key] = null;
        }
      });
    }
    cellContentsSelectionFixer(e, cell) {
      var range;
      if (this.table.modExists("edit")) {
        if (this.table.modules.edit.currentCell === cell) {
          return;
        }
      }
      e.preventDefault();
      try {
        if (document.selection) {
          range = document.body.createTextRange();
          range.moveToElementText(cell.getElement());
          range.select();
        } else if (window.getSelection) {
          range = document.createRange();
          range.selectNode(cell.getElement());
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }
      } catch (e2) {
      }
    }
    initializeExternalEvents() {
      for (let key in this.eventMap) {
        this.subscriptionChangeExternal(key, this.subscriptionChanged.bind(this, key));
      }
    }
    subscriptionChanged(key, added) {
      if (added) {
        if (!this.subscribers[key]) {
          if (this.eventMap[key].includes("-")) {
            this.subscribers[key] = this.handle.bind(this, key);
            this.subscribe(this.eventMap[key], this.subscribers[key]);
          } else {
            this.subscribeTouchEvents(key);
          }
        }
      } else {
        if (this.eventMap[key].includes("-")) {
          if (this.subscribers[key] && !this.columnSubscribers[key] && !this.subscribedExternal(key)) {
            this.unsubscribe(this.eventMap[key], this.subscribers[key]);
            delete this.subscribers[key];
          }
        } else {
          this.unsubscribeTouchEvents(key);
        }
      }
    }
    subscribeTouchEvents(key) {
      var type = this.eventMap[key];
      if (!this.touchSubscribers[type + "-touchstart"]) {
        this.touchSubscribers[type + "-touchstart"] = this.handleTouch.bind(this, type, "start");
        this.touchSubscribers[type + "-touchend"] = this.handleTouch.bind(this, type, "end");
        this.subscribe(type + "-touchstart", this.touchSubscribers[type + "-touchstart"]);
        this.subscribe(type + "-touchend", this.touchSubscribers[type + "-touchend"]);
      }
      this.subscribers[key] = true;
    }
    unsubscribeTouchEvents(key) {
      var noTouch = true, type = this.eventMap[key];
      if (this.subscribers[key] && !this.subscribedExternal(key)) {
        delete this.subscribers[key];
        for (let i in this.eventMap) {
          if (this.eventMap[i] === type) {
            if (this.subscribers[i]) {
              noTouch = false;
            }
          }
        }
        if (noTouch) {
          this.unsubscribe(type + "-touchstart", this.touchSubscribers[type + "-touchstart"]);
          this.unsubscribe(type + "-touchend", this.touchSubscribers[type + "-touchend"]);
          delete this.touchSubscribers[type + "-touchstart"];
          delete this.touchSubscribers[type + "-touchend"];
        }
      }
    }
    initializeColumn(column) {
      var def = column.definition;
      for (let key in this.eventMap) {
        if (def[key]) {
          this.subscriptionChanged(key, true);
          if (!this.columnSubscribers[key]) {
            this.columnSubscribers[key] = [];
          }
          this.columnSubscribers[key].push(column);
        }
      }
    }
    handle(action, e, component) {
      this.dispatchEvent(action, e, component);
    }
    handleTouch(type, action, e, component) {
      var watchers = this.touchWatchers[type];
      if (type === "column") {
        type = "header";
      }
      switch (action) {
        case "start":
          watchers.tap = true;
          clearTimeout(watchers.tapHold);
          watchers.tapHold = setTimeout(() => {
            clearTimeout(watchers.tapHold);
            watchers.tapHold = null;
            watchers.tap = null;
            clearTimeout(watchers.tapDbl);
            watchers.tapDbl = null;
            this.dispatchEvent(type + "TapHold", e, component);
          }, 1e3);
          break;
        case "end":
          if (watchers.tap) {
            watchers.tap = null;
            this.dispatchEvent(type + "Tap", e, component);
          }
          if (watchers.tapDbl) {
            clearTimeout(watchers.tapDbl);
            watchers.tapDbl = null;
            this.dispatchEvent(type + "DblTap", e, component);
          } else {
            watchers.tapDbl = setTimeout(() => {
              clearTimeout(watchers.tapDbl);
              watchers.tapDbl = null;
            }, 300);
          }
          clearTimeout(watchers.tapHold);
          watchers.tapHold = null;
          break;
      }
    }
    dispatchEvent(action, e, component) {
      var componentObj = component.getComponent(), callback;
      if (this.columnSubscribers[action]) {
        if (component instanceof Cell) {
          callback = component.column.definition[action];
        } else if (component instanceof Column) {
          callback = component.definition[action];
        }
        if (callback) {
          callback(e, componentObj);
        }
      }
      this.dispatchExternal(action, e, componentObj);
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Keybindings/defaults/bindings.js
  var bindings_default3 = {
    navPrev: "shift + 9",
    navNext: 9,
    navUp: 38,
    navDown: 40,
    navLeft: 37,
    navRight: 39,
    scrollPageUp: 33,
    scrollPageDown: 34,
    scrollToStart: 36,
    scrollToEnd: 35
  };

  // node_modules/tabulator-tables/src/js/modules/Keybindings/defaults/actions.js
  var actions_default3 = {
    keyBlock: function(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    scrollPageUp: function(e) {
      var rowManager = this.table.rowManager, newPos = rowManager.scrollTop - rowManager.element.clientHeight;
      e.preventDefault();
      if (rowManager.displayRowsCount) {
        if (newPos >= 0) {
          rowManager.element.scrollTop = newPos;
        } else {
          rowManager.scrollToRow(rowManager.getDisplayRows()[0]);
        }
      }
      this.table.element.focus();
    },
    scrollPageDown: function(e) {
      var rowManager = this.table.rowManager, newPos = rowManager.scrollTop + rowManager.element.clientHeight, scrollMax = rowManager.element.scrollHeight;
      e.preventDefault();
      if (rowManager.displayRowsCount) {
        if (newPos <= scrollMax) {
          rowManager.element.scrollTop = newPos;
        } else {
          rowManager.scrollToRow(rowManager.getDisplayRows()[rowManager.displayRowsCount - 1]);
        }
      }
      this.table.element.focus();
    },
    scrollToStart: function(e) {
      var rowManager = this.table.rowManager;
      e.preventDefault();
      if (rowManager.displayRowsCount) {
        rowManager.scrollToRow(rowManager.getDisplayRows()[0]);
      }
      this.table.element.focus();
    },
    scrollToEnd: function(e) {
      var rowManager = this.table.rowManager;
      e.preventDefault();
      if (rowManager.displayRowsCount) {
        rowManager.scrollToRow(rowManager.getDisplayRows()[rowManager.displayRowsCount - 1]);
      }
      this.table.element.focus();
    },
    navPrev: function(e) {
      this.dispatch("keybinding-nav-prev", e);
    },
    navNext: function(e) {
      this.dispatch("keybinding-nav-next", e);
    },
    navLeft: function(e) {
      this.dispatch("keybinding-nav-left", e);
    },
    navRight: function(e) {
      this.dispatch("keybinding-nav-right", e);
    },
    navUp: function(e) {
      this.dispatch("keybinding-nav-up", e);
    },
    navDown: function(e) {
      this.dispatch("keybinding-nav-down", e);
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Keybindings/Keybindings.js
  var Keybindings = class _Keybindings extends Module {
    static moduleName = "keybindings";
    //load defaults
    static bindings = bindings_default3;
    static actions = actions_default3;
    constructor(table) {
      super(table);
      this.watchKeys = null;
      this.pressedKeys = null;
      this.keyupBinding = false;
      this.keydownBinding = false;
      this.registerTableOption("keybindings", {});
      this.registerTableOption("tabEndNewRow", false);
    }
    initialize() {
      var bindings = this.table.options.keybindings, mergedBindings = {};
      this.watchKeys = {};
      this.pressedKeys = [];
      if (bindings !== false) {
        Object.assign(mergedBindings, _Keybindings.bindings);
        Object.assign(mergedBindings, bindings);
        this.mapBindings(mergedBindings);
        this.bindEvents();
      }
      this.subscribe("table-destroy", this.clearBindings.bind(this));
    }
    mapBindings(bindings) {
      for (let key in bindings) {
        if (_Keybindings.actions[key]) {
          if (bindings[key]) {
            if (typeof bindings[key] !== "object") {
              bindings[key] = [bindings[key]];
            }
            bindings[key].forEach((binding) => {
              var bindingList = Array.isArray(binding) ? binding : [binding];
              bindingList.forEach((item) => {
                this.mapBinding(key, item);
              });
            });
          }
        } else {
          console.warn("Key Binding Error - no such action:", key);
        }
      }
    }
    mapBinding(action, symbolsList) {
      var binding = {
        action: _Keybindings.actions[action],
        keys: [],
        ctrl: false,
        shift: false,
        meta: false
      };
      var symbols = symbolsList.toString().toLowerCase().split(" ").join("").split("+");
      symbols.forEach((symbol) => {
        switch (symbol) {
          case "ctrl":
            binding.ctrl = true;
            break;
          case "shift":
            binding.shift = true;
            break;
          case "meta":
            binding.meta = true;
            break;
          default:
            symbol = isNaN(symbol) ? symbol.toUpperCase().charCodeAt(0) : parseInt(symbol);
            binding.keys.push(symbol);
            if (!this.watchKeys[symbol]) {
              this.watchKeys[symbol] = [];
            }
            this.watchKeys[symbol].push(binding);
        }
      });
    }
    bindEvents() {
      var self = this;
      this.keyupBinding = function(e) {
        var code = e.keyCode;
        var bindings = self.watchKeys[code];
        if (bindings) {
          self.pressedKeys.push(code);
          bindings.forEach(function(binding) {
            self.checkBinding(e, binding);
          });
        }
      };
      this.keydownBinding = function(e) {
        var code = e.keyCode;
        var bindings = self.watchKeys[code];
        if (bindings) {
          var index = self.pressedKeys.indexOf(code);
          if (index > -1) {
            self.pressedKeys.splice(index, 1);
          }
        }
      };
      this.table.element.addEventListener("keydown", this.keyupBinding);
      this.table.element.addEventListener("keyup", this.keydownBinding);
    }
    clearBindings() {
      if (this.keyupBinding) {
        this.table.element.removeEventListener("keydown", this.keyupBinding);
      }
      if (this.keydownBinding) {
        this.table.element.removeEventListener("keyup", this.keydownBinding);
      }
    }
    checkBinding(e, binding) {
      var match = true;
      if (e.ctrlKey == binding.ctrl && e.shiftKey == binding.shift && e.metaKey == binding.meta) {
        binding.keys.forEach((key) => {
          var index = this.pressedKeys.indexOf(key);
          if (index == -1) {
            match = false;
          }
        });
        if (match) {
          binding.action.call(this, e);
        }
        return true;
      }
      return false;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Menu/Menu.js
  var Menu = class extends Module {
    static moduleName = "menu";
    constructor(table) {
      super(table);
      this.menuContainer = null;
      this.nestedMenuBlock = false;
      this.currentComponent = null;
      this.rootPopup = null;
      this.columnSubscribers = {};
      this.registerTableOption("rowContextMenu", false);
      this.registerTableOption("rowClickMenu", false);
      this.registerTableOption("rowDblClickMenu", false);
      this.registerTableOption("groupContextMenu", false);
      this.registerTableOption("groupClickMenu", false);
      this.registerTableOption("groupDblClickMenu", false);
      this.registerColumnOption("headerContextMenu");
      this.registerColumnOption("headerClickMenu");
      this.registerColumnOption("headerDblClickMenu");
      this.registerColumnOption("headerMenu");
      this.registerColumnOption("headerMenuIcon");
      this.registerColumnOption("contextMenu");
      this.registerColumnOption("clickMenu");
      this.registerColumnOption("dblClickMenu");
    }
    initialize() {
      this.deprecatedOptionsCheck();
      this.initializeRowWatchers();
      this.initializeGroupWatchers();
      this.subscribe("column-init", this.initializeColumn.bind(this));
    }
    deprecatedOptionsCheck() {
    }
    initializeRowWatchers() {
      if (this.table.options.rowContextMenu) {
        this.subscribe("row-contextmenu", this.loadMenuEvent.bind(this, this.table.options.rowContextMenu));
        this.table.on("rowTapHold", this.loadMenuEvent.bind(this, this.table.options.rowContextMenu));
      }
      if (this.table.options.rowClickMenu) {
        this.subscribe("row-click", this.loadMenuEvent.bind(this, this.table.options.rowClickMenu));
      }
      if (this.table.options.rowDblClickMenu) {
        this.subscribe("row-dblclick", this.loadMenuEvent.bind(this, this.table.options.rowDblClickMenu));
      }
    }
    initializeGroupWatchers() {
      if (this.table.options.groupContextMenu) {
        this.subscribe("group-contextmenu", this.loadMenuEvent.bind(this, this.table.options.groupContextMenu));
        this.table.on("groupTapHold", this.loadMenuEvent.bind(this, this.table.options.groupContextMenu));
      }
      if (this.table.options.groupClickMenu) {
        this.subscribe("group-click", this.loadMenuEvent.bind(this, this.table.options.groupClickMenu));
      }
      if (this.table.options.groupDblClickMenu) {
        this.subscribe("group-dblclick", this.loadMenuEvent.bind(this, this.table.options.groupDblClickMenu));
      }
    }
    initializeColumn(column) {
      var def = column.definition;
      if (def.headerContextMenu && !this.columnSubscribers.headerContextMenu) {
        this.columnSubscribers.headerContextMenu = this.loadMenuTableColumnEvent.bind(this, "headerContextMenu");
        this.subscribe("column-contextmenu", this.columnSubscribers.headerContextMenu);
        this.table.on("headerTapHold", this.loadMenuTableColumnEvent.bind(this, "headerContextMenu"));
      }
      if (def.headerClickMenu && !this.columnSubscribers.headerClickMenu) {
        this.columnSubscribers.headerClickMenu = this.loadMenuTableColumnEvent.bind(this, "headerClickMenu");
        this.subscribe("column-click", this.columnSubscribers.headerClickMenu);
      }
      if (def.headerDblClickMenu && !this.columnSubscribers.headerDblClickMenu) {
        this.columnSubscribers.headerDblClickMenu = this.loadMenuTableColumnEvent.bind(this, "headerDblClickMenu");
        this.subscribe("column-dblclick", this.columnSubscribers.headerDblClickMenu);
      }
      if (def.headerMenu) {
        this.initializeColumnHeaderMenu(column);
      }
      if (def.contextMenu && !this.columnSubscribers.contextMenu) {
        this.columnSubscribers.contextMenu = this.loadMenuTableCellEvent.bind(this, "contextMenu");
        this.subscribe("cell-contextmenu", this.columnSubscribers.contextMenu);
        this.table.on("cellTapHold", this.loadMenuTableCellEvent.bind(this, "contextMenu"));
      }
      if (def.clickMenu && !this.columnSubscribers.clickMenu) {
        this.columnSubscribers.clickMenu = this.loadMenuTableCellEvent.bind(this, "clickMenu");
        this.subscribe("cell-click", this.columnSubscribers.clickMenu);
      }
      if (def.dblClickMenu && !this.columnSubscribers.dblClickMenu) {
        this.columnSubscribers.dblClickMenu = this.loadMenuTableCellEvent.bind(this, "dblClickMenu");
        this.subscribe("cell-dblclick", this.columnSubscribers.dblClickMenu);
      }
    }
    initializeColumnHeaderMenu(column) {
      var icon = column.definition.headerMenuIcon, headerMenuEl;
      headerMenuEl = document.createElement("span");
      headerMenuEl.classList.add("tabulator-header-popup-button");
      if (icon) {
        if (typeof icon === "function") {
          icon = icon(column.getComponent());
        }
        if (icon instanceof HTMLElement) {
          headerMenuEl.appendChild(icon);
        } else {
          headerMenuEl.innerHTML = icon;
        }
      } else {
        headerMenuEl.innerHTML = "&vellip;";
      }
      headerMenuEl.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.loadMenuEvent(column.definition.headerMenu, e, column);
      });
      column.titleElement.insertBefore(headerMenuEl, column.titleElement.firstChild);
    }
    loadMenuTableCellEvent(option, e, cell) {
      if (cell._cell) {
        cell = cell._cell;
      }
      if (cell.column.definition[option]) {
        this.loadMenuEvent(cell.column.definition[option], e, cell);
      }
    }
    loadMenuTableColumnEvent(option, e, column) {
      if (column._column) {
        column = column._column;
      }
      if (column.definition[option]) {
        this.loadMenuEvent(column.definition[option], e, column);
      }
    }
    loadMenuEvent(menu, e, component) {
      if (component._group) {
        component = component._group;
      } else if (component._row) {
        component = component._row;
      }
      menu = typeof menu == "function" ? menu.call(this.table, e, component.getComponent()) : menu;
      this.loadMenu(e, component, menu);
    }
    loadMenu(e, component, menu, parentEl, parentPopup) {
      var touch = !(e instanceof MouseEvent), menuEl = document.createElement("div"), popup;
      menuEl.classList.add("tabulator-menu");
      if (!touch) {
        e.preventDefault();
      }
      if (!menu || !menu.length) {
        return;
      }
      if (!parentEl) {
        if (this.nestedMenuBlock) {
          if (this.rootPopup) {
            return;
          }
        } else {
          this.nestedMenuBlock = setTimeout(() => {
            this.nestedMenuBlock = false;
          }, 100);
        }
        if (this.rootPopup) {
          this.rootPopup.hide();
        }
        this.rootPopup = popup = this.popup(menuEl);
      } else {
        popup = parentPopup.child(menuEl);
      }
      menu.forEach((item) => {
        var itemEl = document.createElement("div"), label = item.label, disabled = item.disabled;
        if (item.separator) {
          itemEl.classList.add("tabulator-menu-separator");
        } else {
          itemEl.classList.add("tabulator-menu-item");
          if (typeof label == "function") {
            label = label.call(this.table, component.getComponent());
          }
          if (label instanceof Node) {
            itemEl.appendChild(label);
          } else {
            itemEl.innerHTML = label;
          }
          if (typeof disabled == "function") {
            disabled = disabled.call(this.table, component.getComponent());
          }
          if (disabled) {
            itemEl.classList.add("tabulator-menu-item-disabled");
            itemEl.addEventListener("click", (e2) => {
              e2.stopPropagation();
            });
          } else {
            if (item.menu && item.menu.length) {
              itemEl.addEventListener("click", (e2) => {
                e2.stopPropagation();
                this.loadMenu(e2, component, item.menu, itemEl, popup);
              });
            } else {
              if (item.action) {
                itemEl.addEventListener("click", (e2) => {
                  item.action(e2, component.getComponent());
                });
              }
            }
          }
          if (item.menu && item.menu.length) {
            itemEl.classList.add("tabulator-menu-item-submenu");
          }
        }
        menuEl.appendChild(itemEl);
      });
      menuEl.addEventListener("click", (e2) => {
        if (this.rootPopup) {
          this.rootPopup.hide();
        }
      });
      popup.show(parentEl || e);
      if (popup === this.rootPopup) {
        this.rootPopup.hideOnBlur(() => {
          this.rootPopup = null;
          if (this.currentComponent) {
            this.dispatch("menu-closed", menu, popup);
            this.dispatchExternal("menuClosed", this.currentComponent.getComponent());
            this.currentComponent = null;
          }
        });
        this.currentComponent = component;
        this.dispatch("menu-opened", menu, popup);
        this.dispatchExternal("menuOpened", component.getComponent());
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/MoveColumns/MoveColumns.js
  var MoveColumns = class extends Module {
    static moduleName = "moveColumn";
    constructor(table) {
      super(table);
      this.placeholderElement = this.createPlaceholderElement();
      this.hoverElement = false;
      this.checkTimeout = false;
      this.checkPeriod = 250;
      this.moving = false;
      this.toCol = false;
      this.toColAfter = false;
      this.startX = 0;
      this.autoScrollMargin = 40;
      this.autoScrollStep = 5;
      this.autoScrollTimeout = false;
      this.touchMove = false;
      this.moveHover = this.moveHover.bind(this);
      this.endMove = this.endMove.bind(this);
      this.registerTableOption("movableColumns", false);
    }
    createPlaceholderElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-col");
      el.classList.add("tabulator-col-placeholder");
      return el;
    }
    initialize() {
      if (this.table.options.movableColumns) {
        this.subscribe("column-init", this.initializeColumn.bind(this));
        this.subscribe("alert-show", this.abortMove.bind(this));
      }
    }
    abortMove() {
      clearTimeout(this.checkTimeout);
    }
    initializeColumn(column) {
      var self = this, config = {}, colEl;
      if (!column.modules.frozen && !column.isGroup && !column.isRowHeader) {
        colEl = column.getElement();
        config.mousemove = function(e) {
          if (column.parent === self.moving.parent) {
            if ((self.touchMove ? e.touches[0].pageX : e.pageX) - Helpers.elOffset(colEl).left + self.table.columnManager.contentsElement.scrollLeft > column.getWidth() / 2) {
              if (self.toCol !== column || !self.toColAfter) {
                colEl.parentNode.insertBefore(self.placeholderElement, colEl.nextSibling);
                self.moveColumn(column, true);
              }
            } else {
              if (self.toCol !== column || self.toColAfter) {
                colEl.parentNode.insertBefore(self.placeholderElement, colEl);
                self.moveColumn(column, false);
              }
            }
          }
        }.bind(self);
        colEl.addEventListener("mousedown", function(e) {
          self.touchMove = false;
          if (e.which === 1) {
            self.checkTimeout = setTimeout(function() {
              self.startMove(e, column);
            }, self.checkPeriod);
          }
        });
        colEl.addEventListener("mouseup", function(e) {
          if (e.which === 1) {
            if (self.checkTimeout) {
              clearTimeout(self.checkTimeout);
            }
          }
        });
        self.bindTouchEvents(column);
      }
      column.modules.moveColumn = config;
    }
    bindTouchEvents(column) {
      var colEl = column.getElement(), startXMove = false, nextCol, prevCol, nextColWidth, prevColWidth, nextColWidthLast, prevColWidthLast;
      colEl.addEventListener("touchstart", (e) => {
        this.checkTimeout = setTimeout(() => {
          this.touchMove = true;
          nextCol = column.nextColumn();
          nextColWidth = nextCol ? nextCol.getWidth() / 2 : 0;
          prevCol = column.prevColumn();
          prevColWidth = prevCol ? prevCol.getWidth() / 2 : 0;
          nextColWidthLast = 0;
          prevColWidthLast = 0;
          startXMove = false;
          this.startMove(e, column);
        }, this.checkPeriod);
      }, { passive: true });
      colEl.addEventListener("touchmove", (e) => {
        var diff, moveToCol;
        if (this.moving) {
          this.moveHover(e);
          if (!startXMove) {
            startXMove = e.touches[0].pageX;
          }
          diff = e.touches[0].pageX - startXMove;
          if (diff > 0) {
            if (nextCol && diff - nextColWidthLast > nextColWidth) {
              moveToCol = nextCol;
              if (moveToCol !== column) {
                startXMove = e.touches[0].pageX;
                moveToCol.getElement().parentNode.insertBefore(this.placeholderElement, moveToCol.getElement().nextSibling);
                this.moveColumn(moveToCol, true);
              }
            }
          } else {
            if (prevCol && -diff - prevColWidthLast > prevColWidth) {
              moveToCol = prevCol;
              if (moveToCol !== column) {
                startXMove = e.touches[0].pageX;
                moveToCol.getElement().parentNode.insertBefore(this.placeholderElement, moveToCol.getElement());
                this.moveColumn(moveToCol, false);
              }
            }
          }
          if (moveToCol) {
            nextCol = moveToCol.nextColumn();
            nextColWidthLast = nextColWidth;
            nextColWidth = nextCol ? nextCol.getWidth() / 2 : 0;
            prevCol = moveToCol.prevColumn();
            prevColWidthLast = prevColWidth;
            prevColWidth = prevCol ? prevCol.getWidth() / 2 : 0;
          }
        }
      }, { passive: true });
      colEl.addEventListener("touchend", (e) => {
        if (this.checkTimeout) {
          clearTimeout(this.checkTimeout);
        }
        if (this.moving) {
          this.endMove(e);
        }
      });
    }
    startMove(e, column) {
      var element = column.getElement(), headerElement = this.table.columnManager.getContentsElement(), headersElement = this.table.columnManager.getHeadersElement();
      if (this.table.modules.selectRange && this.table.modules.selectRange.columnSelection) {
        if (this.table.modules.selectRange.mousedown && this.table.modules.selectRange.selecting === "column") {
          return;
        }
      }
      this.moving = column;
      this.startX = (this.touchMove ? e.touches[0].pageX : e.pageX) - Helpers.elOffset(element).left;
      this.table.element.classList.add("tabulator-block-select");
      this.placeholderElement.style.width = column.getWidth() + "px";
      this.placeholderElement.style.height = column.getHeight() + "px";
      element.parentNode.insertBefore(this.placeholderElement, element);
      element.parentNode.removeChild(element);
      this.hoverElement = element.cloneNode(true);
      this.hoverElement.classList.add("tabulator-moving");
      headerElement.appendChild(this.hoverElement);
      this.hoverElement.style.left = "0";
      this.hoverElement.style.bottom = headerElement.clientHeight - headersElement.offsetHeight + "px";
      if (!this.touchMove) {
        this._bindMouseMove();
        document.body.addEventListener("mousemove", this.moveHover);
        document.body.addEventListener("mouseup", this.endMove);
      }
      this.moveHover(e);
      this.dispatch("column-moving", e, this.moving);
    }
    _bindMouseMove() {
      this.table.columnManager.columnsByIndex.forEach(function(column) {
        if (column.modules.moveColumn.mousemove) {
          column.getElement().addEventListener("mousemove", column.modules.moveColumn.mousemove);
        }
      });
    }
    _unbindMouseMove() {
      this.table.columnManager.columnsByIndex.forEach(function(column) {
        if (column.modules.moveColumn.mousemove) {
          column.getElement().removeEventListener("mousemove", column.modules.moveColumn.mousemove);
        }
      });
    }
    moveColumn(column, after) {
      var movingCells = this.moving.getCells();
      this.toCol = column;
      this.toColAfter = after;
      if (after) {
        column.getCells().forEach(function(cell, i) {
          var cellEl = cell.getElement(true);
          if (cellEl.parentNode && movingCells[i]) {
            cellEl.parentNode.insertBefore(movingCells[i].getElement(), cellEl.nextSibling);
          }
        });
      } else {
        column.getCells().forEach(function(cell, i) {
          var cellEl = cell.getElement(true);
          if (cellEl.parentNode && movingCells[i]) {
            cellEl.parentNode.insertBefore(movingCells[i].getElement(), cellEl);
          }
        });
      }
    }
    endMove(e) {
      if (e.which === 1 || this.touchMove) {
        this._unbindMouseMove();
        this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
        this.placeholderElement.parentNode.removeChild(this.placeholderElement);
        this.hoverElement.parentNode.removeChild(this.hoverElement);
        this.table.element.classList.remove("tabulator-block-select");
        if (this.toCol) {
          this.table.columnManager.moveColumnActual(this.moving, this.toCol, this.toColAfter);
        }
        this.moving = false;
        this.toCol = false;
        this.toColAfter = false;
        if (!this.touchMove) {
          document.body.removeEventListener("mousemove", this.moveHover);
          document.body.removeEventListener("mouseup", this.endMove);
        }
      }
    }
    moveHover(e) {
      var columnHolder = this.table.columnManager.getContentsElement(), scrollLeft = columnHolder.scrollLeft, xPos = (this.touchMove ? e.touches[0].pageX : e.pageX) - Helpers.elOffset(columnHolder).left + scrollLeft, scrollPos;
      this.hoverElement.style.left = xPos - this.startX + "px";
      if (xPos - scrollLeft < this.autoScrollMargin) {
        if (!this.autoScrollTimeout) {
          this.autoScrollTimeout = setTimeout(() => {
            scrollPos = Math.max(0, scrollLeft - 5);
            this.table.rowManager.getElement().scrollLeft = scrollPos;
            this.autoScrollTimeout = false;
          }, 1);
        }
      }
      if (scrollLeft + columnHolder.clientWidth - xPos < this.autoScrollMargin) {
        if (!this.autoScrollTimeout) {
          this.autoScrollTimeout = setTimeout(() => {
            scrollPos = Math.min(columnHolder.clientWidth, scrollLeft + 5);
            this.table.rowManager.getElement().scrollLeft = scrollPos;
            this.autoScrollTimeout = false;
          }, 1);
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/MoveRows/defaults/senders.js
  var senders_default = {
    delete: function(fromRow, toRow, toTable) {
      fromRow.delete();
    }
  };

  // node_modules/tabulator-tables/src/js/modules/MoveRows/defaults/receivers.js
  var receivers_default = {
    insert: function(fromRow, toRow, fromTable) {
      this.table.addRow(fromRow.getData(), void 0, toRow);
      return true;
    },
    add: function(fromRow, toRow, fromTable) {
      this.table.addRow(fromRow.getData());
      return true;
    },
    update: function(fromRow, toRow, fromTable) {
      if (toRow) {
        toRow.update(fromRow.getData());
        return true;
      }
      return false;
    },
    replace: function(fromRow, toRow, fromTable) {
      if (toRow) {
        this.table.addRow(fromRow.getData(), void 0, toRow);
        toRow.delete();
        return true;
      }
      return false;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/MoveRows/MoveRows.js
  var MoveRows = class _MoveRows extends Module {
    static moduleName = "moveRow";
    //load defaults
    static senders = senders_default;
    static receivers = receivers_default;
    constructor(table) {
      super(table);
      this.placeholderElement = this.createPlaceholderElement();
      this.hoverElement = false;
      this.checkTimeout = false;
      this.checkPeriod = 150;
      this.moving = false;
      this.toRow = false;
      this.toRowAfter = false;
      this.hasHandle = false;
      this.startY = 0;
      this.startX = 0;
      this.moveHover = this.moveHover.bind(this);
      this.endMove = this.endMove.bind(this);
      this.tableRowDropEvent = false;
      this.touchMove = false;
      this.connection = false;
      this.connectionSelectorsTables = false;
      this.connectionSelectorsElements = false;
      this.connectionElements = [];
      this.connections = [];
      this.connectedTable = false;
      this.connectedRow = false;
      this.registerTableOption("movableRows", false);
      this.registerTableOption("movableRowsConnectedTables", false);
      this.registerTableOption("movableRowsConnectedElements", false);
      this.registerTableOption("movableRowsSender", false);
      this.registerTableOption("movableRowsReceiver", "insert");
      this.registerColumnOption("rowHandle");
    }
    createPlaceholderElement() {
      var el = document.createElement("div");
      el.classList.add("tabulator-row");
      el.classList.add("tabulator-row-placeholder");
      return el;
    }
    initialize() {
      if (this.table.options.movableRows) {
        this.connectionSelectorsTables = this.table.options.movableRowsConnectedTables;
        this.connectionSelectorsElements = this.table.options.movableRowsConnectedElements;
        this.connection = this.connectionSelectorsTables || this.connectionSelectorsElements;
        this.subscribe("cell-init", this.initializeCell.bind(this));
        this.subscribe("column-init", this.initializeColumn.bind(this));
        this.subscribe("row-init", this.initializeRow.bind(this));
      }
    }
    initializeGroupHeader(group) {
      var self = this, config = {};
      config.mouseup = function(e) {
        self.tableRowDrop(e, group);
      }.bind(self);
      config.mousemove = function(e) {
        var rowEl;
        if (e.pageY - Helpers.elOffset(group.element).top + self.table.rowManager.element.scrollTop > group.getHeight() / 2) {
          if (self.toRow !== group || !self.toRowAfter) {
            rowEl = group.getElement();
            rowEl.parentNode.insertBefore(self.placeholderElement, rowEl.nextSibling);
            self.moveRow(group, true);
          }
        } else {
          if (self.toRow !== group || self.toRowAfter) {
            rowEl = group.getElement();
            if (rowEl.previousSibling) {
              rowEl.parentNode.insertBefore(self.placeholderElement, rowEl);
              self.moveRow(group, false);
            }
          }
        }
      }.bind(self);
      group.modules.moveRow = config;
    }
    initializeRow(row) {
      var self = this, config = {}, rowEl;
      config.mouseup = function(e) {
        self.tableRowDrop(e, row);
      }.bind(self);
      config.mousemove = function(e) {
        var rowEl2 = row.getElement();
        if (e.pageY - Helpers.elOffset(rowEl2).top + self.table.rowManager.element.scrollTop > row.getHeight() / 2) {
          if (self.toRow !== row || !self.toRowAfter) {
            rowEl2.parentNode.insertBefore(self.placeholderElement, rowEl2.nextSibling);
            self.moveRow(row, true);
          }
        } else {
          if (self.toRow !== row || self.toRowAfter) {
            rowEl2.parentNode.insertBefore(self.placeholderElement, rowEl2);
            self.moveRow(row, false);
          }
        }
      }.bind(self);
      if (!this.hasHandle) {
        rowEl = row.getElement();
        rowEl.addEventListener("mousedown", function(e) {
          if (e.which === 1) {
            self.checkTimeout = setTimeout(function() {
              self.startMove(e, row);
            }, self.checkPeriod);
          }
        });
        rowEl.addEventListener("mouseup", function(e) {
          if (e.which === 1) {
            if (self.checkTimeout) {
              clearTimeout(self.checkTimeout);
            }
          }
        });
        this.bindTouchEvents(row, row.getElement());
      }
      row.modules.moveRow = config;
    }
    initializeColumn(column) {
      if (column.definition.rowHandle && this.table.options.movableRows !== false) {
        this.hasHandle = true;
      }
    }
    initializeCell(cell) {
      if (cell.column.definition.rowHandle && this.table.options.movableRows !== false) {
        var self = this, cellEl = cell.getElement(true);
        cellEl.addEventListener("mousedown", function(e) {
          if (e.which === 1) {
            self.checkTimeout = setTimeout(function() {
              self.startMove(e, cell.row);
            }, self.checkPeriod);
          }
        });
        cellEl.addEventListener("mouseup", function(e) {
          if (e.which === 1) {
            if (self.checkTimeout) {
              clearTimeout(self.checkTimeout);
            }
          }
        });
        this.bindTouchEvents(cell.row, cellEl);
      }
    }
    bindTouchEvents(row, element) {
      var startYMove = false, nextRow, prevRow, nextRowHeight, prevRowHeight, nextRowHeightLast, prevRowHeightLast;
      element.addEventListener("touchstart", (e) => {
        this.checkTimeout = setTimeout(() => {
          this.touchMove = true;
          nextRow = row.nextRow();
          nextRowHeight = nextRow ? nextRow.getHeight() / 2 : 0;
          prevRow = row.prevRow();
          prevRowHeight = prevRow ? prevRow.getHeight() / 2 : 0;
          nextRowHeightLast = 0;
          prevRowHeightLast = 0;
          startYMove = false;
          this.startMove(e, row);
        }, this.checkPeriod);
      }, { passive: true });
      this.moving, this.toRow, this.toRowAfter;
      element.addEventListener("touchmove", (e) => {
        var diff, moveToRow;
        if (this.moving) {
          e.preventDefault();
          this.moveHover(e);
          if (!startYMove) {
            startYMove = e.touches[0].pageY;
          }
          diff = e.touches[0].pageY - startYMove;
          if (diff > 0) {
            if (nextRow && diff - nextRowHeightLast > nextRowHeight) {
              moveToRow = nextRow;
              if (moveToRow !== row) {
                startYMove = e.touches[0].pageY;
                moveToRow.getElement().parentNode.insertBefore(this.placeholderElement, moveToRow.getElement().nextSibling);
                this.moveRow(moveToRow, true);
              }
            }
          } else {
            if (prevRow && -diff - prevRowHeightLast > prevRowHeight) {
              moveToRow = prevRow;
              if (moveToRow !== row) {
                startYMove = e.touches[0].pageY;
                moveToRow.getElement().parentNode.insertBefore(this.placeholderElement, moveToRow.getElement());
                this.moveRow(moveToRow, false);
              }
            }
          }
          if (moveToRow) {
            nextRow = moveToRow.nextRow();
            nextRowHeightLast = nextRowHeight;
            nextRowHeight = nextRow ? nextRow.getHeight() / 2 : 0;
            prevRow = moveToRow.prevRow();
            prevRowHeightLast = prevRowHeight;
            prevRowHeight = prevRow ? prevRow.getHeight() / 2 : 0;
          }
        }
      });
      element.addEventListener("touchend", (e) => {
        if (this.checkTimeout) {
          clearTimeout(this.checkTimeout);
        }
        if (this.moving) {
          this.endMove(e);
          this.touchMove = false;
        }
      });
    }
    _bindMouseMove() {
      this.table.rowManager.getDisplayRows().forEach((row) => {
        if ((row.type === "row" || row.type === "group") && row.modules.moveRow && row.modules.moveRow.mousemove) {
          row.getElement().addEventListener("mousemove", row.modules.moveRow.mousemove);
        }
      });
    }
    _unbindMouseMove() {
      this.table.rowManager.getDisplayRows().forEach((row) => {
        if ((row.type === "row" || row.type === "group") && row.modules.moveRow && row.modules.moveRow.mousemove) {
          row.getElement().removeEventListener("mousemove", row.modules.moveRow.mousemove);
        }
      });
    }
    startMove(e, row) {
      var element = row.getElement();
      this.setStartPosition(e, row);
      this.moving = row;
      this.table.element.classList.add("tabulator-block-select");
      this.placeholderElement.style.width = row.getWidth() + "px";
      this.placeholderElement.style.height = row.getHeight() + "px";
      if (!this.connection) {
        element.parentNode.insertBefore(this.placeholderElement, element);
        element.parentNode.removeChild(element);
      } else {
        this.table.element.classList.add("tabulator-movingrow-sending");
        this.connectToTables(row);
      }
      this.hoverElement = element.cloneNode(true);
      this.hoverElement.classList.add("tabulator-moving");
      if (this.connection) {
        document.body.appendChild(this.hoverElement);
        this.hoverElement.style.left = "0";
        this.hoverElement.style.top = "0";
        this.hoverElement.style.width = this.table.element.clientWidth + "px";
        this.hoverElement.style.whiteSpace = "nowrap";
        this.hoverElement.style.overflow = "hidden";
        this.hoverElement.style.pointerEvents = "none";
      } else {
        this.table.rowManager.getTableElement().appendChild(this.hoverElement);
        this.hoverElement.style.left = "0";
        this.hoverElement.style.top = "0";
        this._bindMouseMove();
      }
      document.body.addEventListener("mousemove", this.moveHover);
      document.body.addEventListener("mouseup", this.endMove);
      this.dispatchExternal("rowMoving", row.getComponent());
      this.moveHover(e);
    }
    setStartPosition(e, row) {
      var pageX = this.touchMove ? e.touches[0].pageX : e.pageX, pageY = this.touchMove ? e.touches[0].pageY : e.pageY, element, position;
      element = row.getElement();
      if (this.connection) {
        position = element.getBoundingClientRect();
        this.startX = position.left - pageX + window.pageXOffset;
        this.startY = position.top - pageY + window.pageYOffset;
      } else {
        this.startY = pageY - element.getBoundingClientRect().top;
      }
    }
    endMove(e) {
      if (!e || e.which === 1 || this.touchMove) {
        this._unbindMouseMove();
        if (!this.connection) {
          this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
          this.placeholderElement.parentNode.removeChild(this.placeholderElement);
        }
        this.hoverElement.parentNode.removeChild(this.hoverElement);
        this.table.element.classList.remove("tabulator-block-select");
        if (this.toRow) {
          this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter);
        } else {
          this.dispatchExternal("rowMoveCancelled", this.moving.getComponent());
        }
        this.moving = false;
        this.toRow = false;
        this.toRowAfter = false;
        document.body.removeEventListener("mousemove", this.moveHover);
        document.body.removeEventListener("mouseup", this.endMove);
        if (this.connection) {
          this.table.element.classList.remove("tabulator-movingrow-sending");
          this.disconnectFromTables();
        }
      }
    }
    moveRow(row, after) {
      this.toRow = row;
      this.toRowAfter = after;
    }
    moveHover(e) {
      if (this.connection) {
        this.moveHoverConnections.call(this, e);
      } else {
        this.moveHoverTable.call(this, e);
      }
    }
    moveHoverTable(e) {
      var rowHolder = this.table.rowManager.getElement(), scrollTop = rowHolder.scrollTop, yPos = (this.touchMove ? e.touches[0].pageY : e.pageY) - rowHolder.getBoundingClientRect().top + scrollTop;
      this.hoverElement.style.top = Math.min(yPos - this.startY, this.table.rowManager.element.scrollHeight - this.hoverElement.offsetHeight) + "px";
    }
    moveHoverConnections(e) {
      this.hoverElement.style.left = this.startX + (this.touchMove ? e.touches[0].pageX : e.pageX) + "px";
      this.hoverElement.style.top = this.startY + (this.touchMove ? e.touches[0].pageY : e.pageY) + "px";
    }
    elementRowDrop(e, element, row) {
      this.dispatchExternal("movableRowsElementDrop", e, element, row ? row.getComponent() : false);
    }
    //establish connection with other tables
    connectToTables(row) {
      var connectionTables;
      if (this.connectionSelectorsTables) {
        connectionTables = this.commsConnections(this.connectionSelectorsTables);
        this.dispatchExternal("movableRowsSendingStart", connectionTables);
        this.commsSend(this.connectionSelectorsTables, "moveRow", "connect", {
          row
        });
      }
      if (this.connectionSelectorsElements) {
        this.connectionElements = [];
        if (!Array.isArray(this.connectionSelectorsElements)) {
          this.connectionSelectorsElements = [this.connectionSelectorsElements];
        }
        this.connectionSelectorsElements.forEach((query) => {
          if (typeof query === "string") {
            this.connectionElements = this.connectionElements.concat(Array.prototype.slice.call(document.querySelectorAll(query)));
          } else {
            this.connectionElements.push(query);
          }
        });
        this.connectionElements.forEach((element) => {
          var dropEvent = (e) => {
            this.elementRowDrop(e, element, this.moving);
          };
          element.addEventListener("mouseup", dropEvent);
          element.tabulatorElementDropEvent = dropEvent;
          element.classList.add("tabulator-movingrow-receiving");
        });
      }
    }
    //disconnect from other tables
    disconnectFromTables() {
      var connectionTables;
      if (this.connectionSelectorsTables) {
        connectionTables = this.commsConnections(this.connectionSelectorsTables);
        this.dispatchExternal("movableRowsSendingStop", connectionTables);
        this.commsSend(this.connectionSelectorsTables, "moveRow", "disconnect");
      }
      this.connectionElements.forEach((element) => {
        element.classList.remove("tabulator-movingrow-receiving");
        element.removeEventListener("mouseup", element.tabulatorElementDropEvent);
        delete element.tabulatorElementDropEvent;
      });
    }
    //accept incomming connection
    connect(table, row) {
      if (!this.connectedTable) {
        this.connectedTable = table;
        this.connectedRow = row;
        this.table.element.classList.add("tabulator-movingrow-receiving");
        this.table.rowManager.getDisplayRows().forEach((row2) => {
          if (row2.type === "row" && row2.modules.moveRow && row2.modules.moveRow.mouseup) {
            row2.getElement().addEventListener("mouseup", row2.modules.moveRow.mouseup);
          }
        });
        this.tableRowDropEvent = this.tableRowDrop.bind(this);
        this.table.element.addEventListener("mouseup", this.tableRowDropEvent);
        this.dispatchExternal("movableRowsReceivingStart", row, table);
        return true;
      } else {
        console.warn("Move Row Error - Table cannot accept connection, already connected to table:", this.connectedTable);
        return false;
      }
    }
    //close incoming connection
    disconnect(table) {
      if (table === this.connectedTable) {
        this.connectedTable = false;
        this.connectedRow = false;
        this.table.element.classList.remove("tabulator-movingrow-receiving");
        this.table.rowManager.getDisplayRows().forEach((row) => {
          if (row.type === "row" && row.modules.moveRow && row.modules.moveRow.mouseup) {
            row.getElement().removeEventListener("mouseup", row.modules.moveRow.mouseup);
          }
        });
        this.table.element.removeEventListener("mouseup", this.tableRowDropEvent);
        this.dispatchExternal("movableRowsReceivingStop", table);
      } else {
        console.warn("Move Row Error - trying to disconnect from non connected table");
      }
    }
    dropComplete(table, row, success) {
      var sender = false;
      if (success) {
        switch (typeof this.table.options.movableRowsSender) {
          case "string":
            sender = _MoveRows.senders[this.table.options.movableRowsSender];
            break;
          case "function":
            sender = this.table.options.movableRowsSender;
            break;
        }
        if (sender) {
          sender.call(this, this.moving ? this.moving.getComponent() : void 0, row ? row.getComponent() : void 0, table);
        } else {
          if (this.table.options.movableRowsSender) {
            console.warn("Mover Row Error - no matching sender found:", this.table.options.movableRowsSender);
          }
        }
        this.dispatchExternal("movableRowsSent", this.moving.getComponent(), row ? row.getComponent() : void 0, table);
      } else {
        this.dispatchExternal("movableRowsSentFailed", this.moving.getComponent(), row ? row.getComponent() : void 0, table);
      }
      this.endMove();
    }
    tableRowDrop(e, row) {
      var receiver = false, success = false;
      e.stopImmediatePropagation();
      switch (typeof this.table.options.movableRowsReceiver) {
        case "string":
          receiver = _MoveRows.receivers[this.table.options.movableRowsReceiver];
          break;
        case "function":
          receiver = this.table.options.movableRowsReceiver;
          break;
      }
      if (receiver) {
        success = receiver.call(this, this.connectedRow.getComponent(), row ? row.getComponent() : void 0, this.connectedTable);
      } else {
        console.warn("Mover Row Error - no matching receiver found:", this.table.options.movableRowsReceiver);
      }
      if (success) {
        this.dispatchExternal("movableRowsReceived", this.connectedRow.getComponent(), row ? row.getComponent() : void 0, this.connectedTable);
      } else {
        this.dispatchExternal("movableRowsReceivedFailed", this.connectedRow.getComponent(), row ? row.getComponent() : void 0, this.connectedTable);
      }
      this.commsSend(this.connectedTable, "moveRow", "dropcomplete", {
        row,
        success
      });
    }
    commsReceived(table, action, data) {
      switch (action) {
        case "connect":
          return this.connect(table, data.row);
        case "disconnect":
          return this.disconnect(table);
        case "dropcomplete":
          return this.dropComplete(table, data.row, data.success);
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Mutator/defaults/mutators.js
  var mutators_default = {};

  // node_modules/tabulator-tables/src/js/modules/Mutator/Mutator.js
  var Mutator = class _Mutator extends Module {
    static moduleName = "mutator";
    //load defaults
    static mutators = mutators_default;
    constructor(table) {
      super(table);
      this.allowedTypes = ["", "data", "edit", "clipboard"];
      this.enabled = true;
      this.registerColumnOption("mutator");
      this.registerColumnOption("mutatorParams");
      this.registerColumnOption("mutatorData");
      this.registerColumnOption("mutatorDataParams");
      this.registerColumnOption("mutatorEdit");
      this.registerColumnOption("mutatorEditParams");
      this.registerColumnOption("mutatorClipboard");
      this.registerColumnOption("mutatorClipboardParams");
      this.registerColumnOption("mutateLink");
    }
    initialize() {
      this.subscribe("cell-value-changing", this.transformCell.bind(this));
      this.subscribe("cell-value-changed", this.mutateLink.bind(this));
      this.subscribe("column-layout", this.initializeColumn.bind(this));
      this.subscribe("row-data-init-before", this.rowDataChanged.bind(this));
      this.subscribe("row-data-changing", this.rowDataChanged.bind(this));
    }
    rowDataChanged(row, tempData, updatedData) {
      return this.transformRow(tempData, "data", updatedData);
    }
    //initialize column mutator
    initializeColumn(column) {
      var match = false, config = {};
      this.allowedTypes.forEach((type) => {
        var key = "mutator" + (type.charAt(0).toUpperCase() + type.slice(1)), mutator;
        if (column.definition[key]) {
          mutator = this.lookupMutator(column.definition[key]);
          if (mutator) {
            match = true;
            config[key] = {
              mutator,
              params: column.definition[key + "Params"] || {}
            };
          }
        }
      });
      if (match) {
        column.modules.mutate = config;
      }
    }
    lookupMutator(value) {
      var mutator = false;
      switch (typeof value) {
        case "string":
          if (_Mutator.mutators[value]) {
            mutator = _Mutator.mutators[value];
          } else {
            console.warn("Mutator Error - No such mutator found, ignoring: ", value);
          }
          break;
        case "function":
          mutator = value;
          break;
      }
      return mutator;
    }
    //apply mutator to row
    transformRow(data, type, updatedData) {
      var key = "mutator" + (type.charAt(0).toUpperCase() + type.slice(1)), value;
      if (this.enabled) {
        this.table.columnManager.traverse((column) => {
          var mutator, params, component;
          if (column.modules.mutate) {
            mutator = column.modules.mutate[key] || column.modules.mutate.mutator || false;
            if (mutator) {
              value = column.getFieldValue(typeof updatedData !== "undefined" ? updatedData : data);
              if (type == "data" && !updatedData || typeof value !== "undefined") {
                component = column.getComponent();
                params = typeof mutator.params === "function" ? mutator.params(value, data, type, component) : mutator.params;
                column.setFieldValue(data, mutator.mutator(value, data, type, params, component));
              }
            }
          }
        });
      }
      return data;
    }
    //apply mutator to new cell value
    transformCell(cell, value) {
      if (cell.column.modules.mutate) {
        var mutator = cell.column.modules.mutate.mutatorEdit || cell.column.modules.mutate.mutator || false, tempData = {};
        if (mutator) {
          tempData = Object.assign(tempData, cell.row.getData());
          cell.column.setFieldValue(tempData, value);
          return mutator.mutator(value, tempData, "edit", mutator.params, cell.getComponent());
        }
      }
      return value;
    }
    mutateLink(cell) {
      var links = cell.column.definition.mutateLink;
      if (links) {
        if (!Array.isArray(links)) {
          links = [links];
        }
        links.forEach((link) => {
          var linkCell = cell.row.getCell(link);
          if (linkCell) {
            linkCell.setValue(linkCell.getValue(), true, true);
          }
        });
      }
    }
    enable() {
      this.enabled = true;
    }
    disable() {
      this.enabled = false;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Page/defaults/pageCounters/rows.js
  function rows_default(pageSize, currentRow, currentPage, totalRows, totalPages) {
    var el = document.createElement("span"), showingEl = document.createElement("span"), valueEl = document.createElement("span"), ofEl = document.createElement("span"), totalEl = document.createElement("span"), rowsEl = document.createElement("span");
    this.table.modules.localize.langBind("pagination|counter|showing", (value) => {
      showingEl.innerHTML = value;
    });
    this.table.modules.localize.langBind("pagination|counter|of", (value) => {
      ofEl.innerHTML = value;
    });
    this.table.modules.localize.langBind("pagination|counter|rows", (value) => {
      rowsEl.innerHTML = value;
    });
    if (totalRows) {
      valueEl.innerHTML = " " + currentRow + "-" + Math.min(currentRow + pageSize - 1, totalRows) + " ";
      totalEl.innerHTML = " " + totalRows + " ";
      el.appendChild(showingEl);
      el.appendChild(valueEl);
      el.appendChild(ofEl);
      el.appendChild(totalEl);
      el.appendChild(rowsEl);
    } else {
      valueEl.innerHTML = " 0 ";
      el.appendChild(showingEl);
      el.appendChild(valueEl);
      el.appendChild(rowsEl);
    }
    return el;
  }

  // node_modules/tabulator-tables/src/js/modules/Page/defaults/pageCounters/pages.js
  function pages_default(pageSize, currentRow, currentPage, totalRows, totalPages) {
    var el = document.createElement("span"), showingEl = document.createElement("span"), valueEl = document.createElement("span"), ofEl = document.createElement("span"), totalEl = document.createElement("span"), rowsEl = document.createElement("span");
    this.table.modules.localize.langBind("pagination|counter|showing", (value) => {
      showingEl.innerHTML = value;
    });
    valueEl.innerHTML = " " + currentPage + " ";
    this.table.modules.localize.langBind("pagination|counter|of", (value) => {
      ofEl.innerHTML = value;
    });
    totalEl.innerHTML = " " + totalPages + " ";
    this.table.modules.localize.langBind("pagination|counter|pages", (value) => {
      rowsEl.innerHTML = value;
    });
    el.appendChild(showingEl);
    el.appendChild(valueEl);
    el.appendChild(ofEl);
    el.appendChild(totalEl);
    el.appendChild(rowsEl);
    return el;
  }

  // node_modules/tabulator-tables/src/js/modules/Page/defaults/pageCounters.js
  var pageCounters_default = {
    rows: rows_default,
    pages: pages_default
  };

  // node_modules/tabulator-tables/src/js/modules/Page/Page.js
  var Page = class _Page extends Module {
    static moduleName = "page";
    //load defaults
    static pageCounters = pageCounters_default;
    constructor(table) {
      super(table);
      this.mode = "local";
      this.progressiveLoad = false;
      this.element = null;
      this.pageCounterElement = null;
      this.pageCounter = null;
      this.size = 0;
      this.page = 1;
      this.count = 5;
      this.max = 1;
      this.remoteRowCountEstimate = null;
      this.initialLoad = true;
      this.dataChanging = false;
      this.pageSizes = [];
      this.registerTableOption("pagination", false);
      this.registerTableOption("paginationMode", "local");
      this.registerTableOption("paginationSize", false);
      this.registerTableOption("paginationInitialPage", 1);
      this.registerTableOption("paginationCounter", false);
      this.registerTableOption("paginationCounterElement", false);
      this.registerTableOption("paginationButtonCount", 5);
      this.registerTableOption("paginationSizeSelector", false);
      this.registerTableOption("paginationElement", false);
      this.registerTableOption("paginationAddRow", "page");
      this.registerTableOption("progressiveLoad", false);
      this.registerTableOption("progressiveLoadDelay", 0);
      this.registerTableOption("progressiveLoadScrollMargin", 0);
      this.registerTableFunction("setMaxPage", this.setMaxPage.bind(this));
      this.registerTableFunction("setPage", this.setPage.bind(this));
      this.registerTableFunction("setPageToRow", this.userSetPageToRow.bind(this));
      this.registerTableFunction("setPageSize", this.userSetPageSize.bind(this));
      this.registerTableFunction("getPageSize", this.getPageSize.bind(this));
      this.registerTableFunction("previousPage", this.previousPage.bind(this));
      this.registerTableFunction("nextPage", this.nextPage.bind(this));
      this.registerTableFunction("getPage", this.getPage.bind(this));
      this.registerTableFunction("getPageMax", this.getPageMax.bind(this));
      this.registerComponentFunction("row", "pageTo", this.setPageToRow.bind(this));
    }
    initialize() {
      if (this.table.options.pagination) {
        this.subscribe("row-deleted", this.rowsUpdated.bind(this));
        this.subscribe("row-added", this.rowsUpdated.bind(this));
        this.subscribe("data-processed", this.initialLoadComplete.bind(this));
        this.subscribe("table-built", this.calculatePageSizes.bind(this));
        this.subscribe("footer-redraw", this.footerRedraw.bind(this));
        if (this.table.options.paginationAddRow == "page") {
          this.subscribe("row-adding-position", this.rowAddingPosition.bind(this));
        }
        if (this.table.options.paginationMode === "remote") {
          this.subscribe("data-params", this.remotePageParams.bind(this));
          this.subscribe("data-loaded", this._parseRemoteData.bind(this));
        }
        if (this.table.options.progressiveLoad) {
          console.error("Progressive Load Error - Pagination and progressive load cannot be used at the same time");
        }
        this.registerDisplayHandler(this.restOnRenderBefore.bind(this), 40);
        this.registerDisplayHandler(this.getRows.bind(this), 50);
        this.createElements();
        this.initializePageCounter();
        this.initializePaginator();
      } else if (this.table.options.progressiveLoad) {
        this.subscribe("data-params", this.remotePageParams.bind(this));
        this.subscribe("data-loaded", this._parseRemoteData.bind(this));
        this.subscribe("table-built", this.calculatePageSizes.bind(this));
        this.subscribe("data-processed", this.initialLoadComplete.bind(this));
        this.initializeProgressive(this.table.options.progressiveLoad);
        if (this.table.options.progressiveLoad === "scroll") {
          this.subscribe("scroll-vertical", this.scrollVertical.bind(this));
        }
      }
    }
    rowAddingPosition(row, top) {
      var rowManager = this.table.rowManager, displayRows = rowManager.getDisplayRows(), index;
      if (top) {
        if (displayRows.length) {
          index = displayRows[0];
        } else {
          if (rowManager.activeRows.length) {
            index = rowManager.activeRows[rowManager.activeRows.length - 1];
            top = false;
          }
        }
      } else {
        if (displayRows.length) {
          index = displayRows[displayRows.length - 1];
          top = displayRows.length < this.size ? false : true;
        }
      }
      return { index, top };
    }
    calculatePageSizes() {
      var testElRow, testElCell;
      if (this.table.options.paginationSize) {
        this.size = this.table.options.paginationSize;
      } else {
        testElRow = document.createElement("div");
        testElRow.classList.add("tabulator-row");
        testElRow.style.visibility = "hidden";
        testElCell = document.createElement("div");
        testElCell.classList.add("tabulator-cell");
        testElCell.innerHTML = "Page Row Test";
        testElRow.appendChild(testElCell);
        this.table.rowManager.getTableElement().appendChild(testElRow);
        this.size = Math.floor(this.table.rowManager.getElement().clientHeight / testElRow.offsetHeight);
        this.table.rowManager.getTableElement().removeChild(testElRow);
      }
      this.dispatchExternal("pageSizeChanged", this.size);
      this.generatePageSizeSelectList();
    }
    initialLoadComplete() {
      this.initialLoad = false;
    }
    remotePageParams(data, config, silent, params) {
      if (!this.initialLoad) {
        if (this.progressiveLoad && !silent || !this.progressiveLoad && !this.dataChanging) {
          this.reset(true);
        }
      }
      params.page = this.page;
      if (this.size) {
        params.size = this.size;
      }
      return params;
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    userSetPageToRow(row) {
      if (this.table.options.pagination) {
        row = this.table.rowManager.findRow(row);
        if (row) {
          return this.setPageToRow(row);
        }
      }
      return Promise.reject();
    }
    userSetPageSize(size) {
      if (this.table.options.pagination) {
        this.setPageSize(size);
        return this.setPage(1);
      } else {
        return false;
      }
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    scrollVertical(top, dir) {
      var element, diff, margin;
      if (!dir && !this.table.dataLoader.loading) {
        element = this.table.rowManager.getElement();
        diff = element.scrollHeight - element.clientHeight - top;
        margin = this.table.options.progressiveLoadScrollMargin || element.clientHeight * 2;
        if (diff < margin) {
          this.nextPage().catch(() => {
          });
        }
      }
    }
    restOnRenderBefore(rows, renderInPosition) {
      if (!renderInPosition) {
        if (this.mode === "local") {
          this.reset();
        }
      }
      return rows;
    }
    rowsUpdated() {
      this.refreshData(true, "all");
    }
    createElements() {
      var button;
      this.element = document.createElement("span");
      this.element.classList.add("tabulator-paginator");
      this.pagesElement = document.createElement("span");
      this.pagesElement.classList.add("tabulator-pages");
      button = document.createElement("button");
      button.classList.add("tabulator-page");
      button.setAttribute("type", "button");
      button.setAttribute("role", "button");
      button.setAttribute("aria-label", "");
      button.setAttribute("title", "");
      this.firstBut = button.cloneNode(true);
      this.firstBut.setAttribute("data-page", "first");
      this.prevBut = button.cloneNode(true);
      this.prevBut.setAttribute("data-page", "prev");
      this.nextBut = button.cloneNode(true);
      this.nextBut.setAttribute("data-page", "next");
      this.lastBut = button.cloneNode(true);
      this.lastBut.setAttribute("data-page", "last");
      if (this.table.options.paginationSizeSelector) {
        this.pageSizeSelect = document.createElement("select");
        this.pageSizeSelect.classList.add("tabulator-page-size");
      }
    }
    generatePageSizeSelectList() {
      var pageSizes = [];
      if (this.pageSizeSelect) {
        if (Array.isArray(this.table.options.paginationSizeSelector)) {
          pageSizes = this.table.options.paginationSizeSelector;
          this.pageSizes = pageSizes;
          if (this.pageSizes.indexOf(this.size) == -1) {
            pageSizes.unshift(this.size);
          }
        } else {
          if (this.pageSizes.indexOf(this.size) == -1) {
            pageSizes = [];
            for (let i = 1; i < 5; i++) {
              pageSizes.push(this.size * i);
            }
            this.pageSizes = pageSizes;
          } else {
            pageSizes = this.pageSizes;
          }
        }
        while (this.pageSizeSelect.firstChild) this.pageSizeSelect.removeChild(this.pageSizeSelect.firstChild);
        pageSizes.forEach((item) => {
          var itemEl = document.createElement("option");
          itemEl.value = item;
          if (item === true) {
            this.langBind("pagination|all", function(value) {
              itemEl.innerHTML = value;
            });
          } else {
            itemEl.innerHTML = item;
          }
          this.pageSizeSelect.appendChild(itemEl);
        });
        this.pageSizeSelect.value = this.size;
      }
    }
    initializePageCounter() {
      var counter2 = this.table.options.paginationCounter, pageCounter = null;
      if (counter2) {
        if (typeof counter2 === "function") {
          pageCounter = counter2;
        } else {
          pageCounter = _Page.pageCounters[counter2];
        }
        if (pageCounter) {
          this.pageCounter = pageCounter;
          this.pageCounterElement = document.createElement("span");
          this.pageCounterElement.classList.add("tabulator-page-counter");
        } else {
          console.warn("Pagination Error - No such page counter found: ", counter2);
        }
      }
    }
    //setup pagination
    initializePaginator(hidden) {
      var pageSelectLabel, paginationCounterHolder;
      if (!hidden) {
        this.langBind("pagination|first", (value) => {
          this.firstBut.innerHTML = value;
        });
        this.langBind("pagination|first_title", (value) => {
          this.firstBut.setAttribute("aria-label", value);
          this.firstBut.setAttribute("title", value);
        });
        this.langBind("pagination|prev", (value) => {
          this.prevBut.innerHTML = value;
        });
        this.langBind("pagination|prev_title", (value) => {
          this.prevBut.setAttribute("aria-label", value);
          this.prevBut.setAttribute("title", value);
        });
        this.langBind("pagination|next", (value) => {
          this.nextBut.innerHTML = value;
        });
        this.langBind("pagination|next_title", (value) => {
          this.nextBut.setAttribute("aria-label", value);
          this.nextBut.setAttribute("title", value);
        });
        this.langBind("pagination|last", (value) => {
          this.lastBut.innerHTML = value;
        });
        this.langBind("pagination|last_title", (value) => {
          this.lastBut.setAttribute("aria-label", value);
          this.lastBut.setAttribute("title", value);
        });
        this.firstBut.addEventListener("click", () => {
          this.setPage(1);
        });
        this.prevBut.addEventListener("click", () => {
          this.previousPage();
        });
        this.nextBut.addEventListener("click", () => {
          this.nextPage();
        });
        this.lastBut.addEventListener("click", () => {
          this.setPage(this.max);
        });
        if (this.table.options.paginationElement) {
          this.element = this.table.options.paginationElement;
        }
        if (this.pageSizeSelect) {
          pageSelectLabel = document.createElement("label");
          this.langBind("pagination|page_size", (value) => {
            this.pageSizeSelect.setAttribute("aria-label", value);
            this.pageSizeSelect.setAttribute("title", value);
            pageSelectLabel.innerHTML = value;
          });
          this.element.appendChild(pageSelectLabel);
          this.element.appendChild(this.pageSizeSelect);
          this.pageSizeSelect.addEventListener("change", (e) => {
            this.setPageSize(this.pageSizeSelect.value == "true" ? true : this.pageSizeSelect.value);
            this.setPage(1);
          });
        }
        this.element.appendChild(this.firstBut);
        this.element.appendChild(this.prevBut);
        this.element.appendChild(this.pagesElement);
        this.element.appendChild(this.nextBut);
        this.element.appendChild(this.lastBut);
        if (!this.table.options.paginationElement) {
          if (this.table.options.paginationCounter) {
            paginationCounterHolder;
            if (this.table.options.paginationCounterElement) {
              if (this.table.options.paginationCounterElement instanceof HTMLElement) {
                this.table.options.paginationCounterElement.appendChild(this.pageCounterElement);
              } else if (typeof this.table.options.paginationCounterElement === "string") {
                paginationCounterHolder = document.querySelector(this.table.options.paginationCounterElement);
                if (paginationCounterHolder) {
                  paginationCounterHolder.appendChild(this.pageCounterElement);
                } else {
                  console.warn("Pagination Error - Unable to find element matching paginationCounterElement selector:", this.table.options.paginationCounterElement);
                }
              }
            } else {
              this.footerAppend(this.pageCounterElement);
            }
          }
          this.footerAppend(this.element);
        }
        this.page = this.table.options.paginationInitialPage;
        this.count = this.table.options.paginationButtonCount;
      }
      this.mode = this.table.options.paginationMode;
    }
    initializeProgressive(mode) {
      this.initializePaginator(true);
      this.mode = "progressive_" + mode;
      this.progressiveLoad = true;
    }
    trackChanges() {
      this.dispatch("page-changed");
    }
    //calculate maximum page from number of rows
    setMaxRows(rowCount) {
      if (!rowCount) {
        this.max = 1;
      } else {
        this.max = this.size === true ? 1 : Math.ceil(rowCount / this.size);
      }
      if (this.page > this.max) {
        this.page = this.max;
      }
    }
    //reset to first page without triggering action
    reset(force) {
      if (!this.initialLoad) {
        if (this.mode == "local" || force) {
          this.page = 1;
          this.trackChanges();
        }
      }
    }
    //set the maximum page
    setMaxPage(max) {
      max = parseInt(max);
      this.max = max || 1;
      if (this.page > this.max) {
        this.page = this.max;
        this.trigger();
      }
    }
    //set current page number
    setPage(page) {
      switch (page) {
        case "first":
          return this.setPage(1);
        case "prev":
          return this.previousPage();
        case "next":
          return this.nextPage();
        case "last":
          return this.setPage(this.max);
      }
      page = parseInt(page);
      if (page > 0 && page <= this.max || this.mode !== "local") {
        this.page = page;
        this.trackChanges();
        return this.trigger();
      } else {
        console.warn("Pagination Error - Requested page is out of range of 1 - " + this.max + ":", page);
        return Promise.reject();
      }
    }
    setPageToRow(row) {
      var rows = this.displayRows(-1);
      var index = rows.indexOf(row);
      if (index > -1) {
        var page = this.size === true ? 1 : Math.ceil((index + 1) / this.size);
        return this.setPage(page);
      } else {
        console.warn("Pagination Error - Requested row is not visible");
        return Promise.reject();
      }
    }
    setPageSize(size) {
      if (size !== true) {
        size = parseInt(size);
      }
      if (size > 0) {
        this.size = size;
        this.dispatchExternal("pageSizeChanged", size);
      }
      if (this.pageSizeSelect) {
        this.generatePageSizeSelectList();
      }
      this.trackChanges();
    }
    _setPageCounter(totalRows, size, currentRow) {
      var content;
      if (this.pageCounter) {
        if (this.mode === "remote") {
          size = this.size;
          currentRow = (this.page - 1) * this.size + 1;
          totalRows = this.remoteRowCountEstimate;
        }
        content = this.pageCounter.call(this, size, currentRow, this.page, totalRows, this.max);
        switch (typeof content) {
          case "object":
            if (content instanceof Node) {
              while (this.pageCounterElement.firstChild) this.pageCounterElement.removeChild(this.pageCounterElement.firstChild);
              this.pageCounterElement.appendChild(content);
            } else {
              this.pageCounterElement.innerHTML = "";
              if (content != null) {
                console.warn("Page Counter Error - Page Counter has returned a type of object, the only valid page counter object return is an instance of Node, the page counter returned:", content);
              }
            }
            break;
          case "undefined":
            this.pageCounterElement.innerHTML = "";
            break;
          default:
            this.pageCounterElement.innerHTML = content;
        }
      }
    }
    //setup the pagination buttons
    _setPageButtons() {
      let leftSize = Math.floor((this.count - 1) / 2);
      let rightSize = Math.ceil((this.count - 1) / 2);
      let min = this.max - this.page + leftSize + 1 < this.count ? this.max - this.count + 1 : Math.max(this.page - leftSize, 1);
      let max = this.page <= rightSize ? Math.min(this.count, this.max) : Math.min(this.page + rightSize, this.max);
      while (this.pagesElement.firstChild) this.pagesElement.removeChild(this.pagesElement.firstChild);
      if (this.page == 1) {
        this.firstBut.disabled = true;
        this.prevBut.disabled = true;
      } else {
        this.firstBut.disabled = false;
        this.prevBut.disabled = false;
      }
      if (this.page == this.max) {
        this.lastBut.disabled = true;
        this.nextBut.disabled = true;
      } else {
        this.lastBut.disabled = false;
        this.nextBut.disabled = false;
      }
      for (let i = min; i <= max; i++) {
        if (i > 0 && i <= this.max) {
          this.pagesElement.appendChild(this._generatePageButton(i));
        }
      }
      this.footerRedraw();
    }
    _generatePageButton(page) {
      var button = document.createElement("button");
      button.classList.add("tabulator-page");
      if (page == this.page) {
        button.classList.add("active");
      }
      button.setAttribute("type", "button");
      button.setAttribute("role", "button");
      this.langBind("pagination|page_title", (value) => {
        button.setAttribute("aria-label", value + " " + page);
        button.setAttribute("title", value + " " + page);
      });
      button.setAttribute("data-page", page);
      button.textContent = page;
      button.addEventListener("click", (e) => {
        this.setPage(page);
      });
      return button;
    }
    //previous page
    previousPage() {
      if (this.page > 1) {
        this.page--;
        this.trackChanges();
        return this.trigger();
      } else {
        console.warn("Pagination Error - Previous page would be less than page 1:", 0);
        return Promise.reject();
      }
    }
    //next page
    nextPage() {
      if (this.page < this.max) {
        this.page++;
        this.trackChanges();
        return this.trigger();
      } else {
        if (!this.progressiveLoad) {
          console.warn("Pagination Error - Next page would be greater than maximum page of " + this.max + ":", this.max + 1);
        }
        return Promise.reject();
      }
    }
    //return current page number
    getPage() {
      return this.page;
    }
    //return max page number
    getPageMax() {
      return this.max;
    }
    getPageSize(size) {
      return this.size;
    }
    getMode() {
      return this.mode;
    }
    //return appropriate rows for current page
    getRows(data) {
      var actualRowPageSize = 0, output, start, end, actualStartRow;
      var actualRows = data.filter((row) => {
        return row.type === "row";
      });
      if (this.mode == "local") {
        output = [];
        this.setMaxRows(data.length);
        if (this.size === true) {
          start = 0;
          end = data.length;
        } else {
          start = this.size * (this.page - 1);
          end = start + parseInt(this.size);
        }
        this._setPageButtons();
        for (let i = start; i < end; i++) {
          let row = data[i];
          if (row) {
            output.push(row);
            if (row.type === "row") {
              if (!actualStartRow) {
                actualStartRow = row;
              }
              actualRowPageSize++;
            }
          }
        }
        this._setPageCounter(actualRows.length, actualRowPageSize, actualStartRow ? actualRows.indexOf(actualStartRow) + 1 : 0);
        return output;
      } else {
        this._setPageButtons();
        this._setPageCounter(actualRows.length);
        return data.slice(0);
      }
    }
    trigger() {
      var left;
      switch (this.mode) {
        case "local":
          left = this.table.rowManager.scrollLeft;
          this.refreshData();
          this.table.rowManager.scrollHorizontal(left);
          this.dispatchExternal("pageLoaded", this.getPage());
          return Promise.resolve();
        case "remote":
          this.dataChanging = true;
          return this.reloadData(null).finally(() => {
            this.dataChanging = false;
          });
        case "progressive_load":
        case "progressive_scroll":
          return this.reloadData(null, true);
        default:
          console.warn("Pagination Error - no such pagination mode:", this.mode);
          return Promise.reject();
      }
    }
    _parseRemoteData(data) {
      var margin;
      if (typeof data.last_page === "undefined") {
        console.warn("Remote Pagination Error - Server response missing '" + (this.options("dataReceiveParams").last_page || "last_page") + "' property");
      }
      if (data.data) {
        this.max = parseInt(data.last_page) || 1;
        this.remoteRowCountEstimate = typeof data.last_row !== "undefined" ? data.last_row : data.last_page * this.size - (this.page == data.last_page ? this.size - data.data.length : 0);
        if (this.progressiveLoad) {
          switch (this.mode) {
            case "progressive_load":
              if (this.page == 1) {
                this.table.rowManager.setData(data.data, false, this.page == 1);
              } else {
                this.table.rowManager.addRows(data.data);
              }
              if (this.page < this.max) {
                setTimeout(() => {
                  this.nextPage();
                }, this.table.options.progressiveLoadDelay);
              }
              break;
            case "progressive_scroll":
              data = this.page === 1 ? data.data : this.table.rowManager.getData().concat(data.data);
              this.table.rowManager.setData(data, this.page !== 1, this.page == 1);
              margin = this.table.options.progressiveLoadScrollMargin || this.table.rowManager.element.clientHeight * 2;
              if (this.table.rowManager.element.scrollHeight <= this.table.rowManager.element.clientHeight + margin) {
                if (this.page < this.max) {
                  setTimeout(() => {
                    this.nextPage();
                  });
                }
              }
              break;
          }
          return false;
        } else {
          this.dispatchExternal("pageLoaded", this.getPage());
        }
      } else {
        console.warn("Remote Pagination Error - Server response missing '" + (this.options("dataReceiveParams").data || "data") + "' property");
      }
      return data.data;
    }
    //handle the footer element being redrawn
    footerRedraw() {
      var footer = this.table.footerManager.containerElement;
      if (Math.ceil(footer.clientWidth) - footer.scrollWidth < 0) {
        this.pagesElement.style.display = "none";
      } else {
        this.pagesElement.style.display = "";
        if (Math.ceil(footer.clientWidth) - footer.scrollWidth < 0) {
          this.pagesElement.style.display = "none";
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Persistence/defaults/readers.js
  var readers_default = {
    local: function(id, type) {
      var data = localStorage.getItem(id + "-" + type);
      return data ? JSON.parse(data) : false;
    },
    cookie: function(id, type) {
      var cookie = document.cookie, key = id + "-" + type, cookiePos = cookie.indexOf(key + "="), end, data;
      if (cookiePos > -1) {
        cookie = cookie.slice(cookiePos);
        end = cookie.indexOf(";");
        if (end > -1) {
          cookie = cookie.slice(0, end);
        }
        data = cookie.replace(key + "=", "");
      }
      return data ? JSON.parse(data) : false;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Persistence/defaults/writers.js
  var writers_default = {
    local: function(id, type, data) {
      localStorage.setItem(id + "-" + type, JSON.stringify(data));
    },
    cookie: function(id, type, data) {
      var expireDate = /* @__PURE__ */ new Date();
      expireDate.setDate(expireDate.getDate() + 1e4);
      document.cookie = id + "-" + type + "=" + JSON.stringify(data) + "; expires=" + expireDate.toUTCString();
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Persistence/Persistence.js
  var Persistence = class _Persistence extends Module {
    static moduleName = "persistence";
    static moduleInitOrder = -10;
    //load defaults
    static readers = readers_default;
    static writers = writers_default;
    constructor(table) {
      super(table);
      this.mode = "";
      this.id = "";
      this.defWatcherBlock = false;
      this.config = {};
      this.readFunc = false;
      this.writeFunc = false;
      this.registerTableOption("persistence", false);
      this.registerTableOption("persistenceID", "");
      this.registerTableOption("persistenceMode", true);
      this.registerTableOption("persistenceReaderFunc", false);
      this.registerTableOption("persistenceWriterFunc", false);
    }
    // Test for whether localStorage is available for use.
    localStorageTest() {
      var testKey = "_tabulator_test";
      try {
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }
    //setup parameters
    initialize() {
      if (this.table.options.persistence) {
        var mode = this.table.options.persistenceMode, id = this.table.options.persistenceID, retrievedData;
        this.mode = mode !== true ? mode : this.localStorageTest() ? "local" : "cookie";
        if (this.table.options.persistenceReaderFunc) {
          if (typeof this.table.options.persistenceReaderFunc === "function") {
            this.readFunc = this.table.options.persistenceReaderFunc;
          } else {
            if (_Persistence.readers[this.table.options.persistenceReaderFunc]) {
              this.readFunc = _Persistence.readers[this.table.options.persistenceReaderFunc];
            } else {
              console.warn("Persistence Read Error - invalid reader set", this.table.options.persistenceReaderFunc);
            }
          }
        } else {
          if (_Persistence.readers[this.mode]) {
            this.readFunc = _Persistence.readers[this.mode];
          } else {
            console.warn("Persistence Read Error - invalid reader set", this.mode);
          }
        }
        if (this.table.options.persistenceWriterFunc) {
          if (typeof this.table.options.persistenceWriterFunc === "function") {
            this.writeFunc = this.table.options.persistenceWriterFunc;
          } else {
            if (_Persistence.writers[this.table.options.persistenceWriterFunc]) {
              this.writeFunc = _Persistence.writers[this.table.options.persistenceWriterFunc];
            } else {
              console.warn("Persistence Write Error - invalid reader set", this.table.options.persistenceWriterFunc);
            }
          }
        } else {
          if (_Persistence.writers[this.mode]) {
            this.writeFunc = _Persistence.writers[this.mode];
          } else {
            console.warn("Persistence Write Error - invalid writer set", this.mode);
          }
        }
        this.id = "tabulator-" + (id || (this.table.element.getAttribute("id") || ""));
        this.config = {
          sort: this.table.options.persistence === true || this.table.options.persistence.sort,
          filter: this.table.options.persistence === true || this.table.options.persistence.filter,
          headerFilter: this.table.options.persistence === true || this.table.options.persistence.headerFilter,
          group: this.table.options.persistence === true || this.table.options.persistence.group,
          page: this.table.options.persistence === true || this.table.options.persistence.page,
          columns: this.table.options.persistence === true ? ["title", "width", "visible"] : this.table.options.persistence.columns
        };
        if (this.config.page) {
          retrievedData = this.retrieveData("page");
          if (retrievedData) {
            if (typeof retrievedData.paginationSize !== "undefined" && (this.config.page === true || this.config.page.size)) {
              this.table.options.paginationSize = retrievedData.paginationSize;
            }
            if (typeof retrievedData.paginationInitialPage !== "undefined" && (this.config.page === true || this.config.page.page)) {
              this.table.options.paginationInitialPage = retrievedData.paginationInitialPage;
            }
          }
        }
        if (this.config.group) {
          retrievedData = this.retrieveData("group");
          if (retrievedData) {
            if (typeof retrievedData.groupBy !== "undefined" && (this.config.group === true || this.config.group.groupBy)) {
              this.table.options.groupBy = retrievedData.groupBy;
            }
            if (typeof retrievedData.groupStartOpen !== "undefined" && (this.config.group === true || this.config.group.groupStartOpen)) {
              this.table.options.groupStartOpen = retrievedData.groupStartOpen;
            }
            if (typeof retrievedData.groupHeader !== "undefined" && (this.config.group === true || this.config.group.groupHeader)) {
              this.table.options.groupHeader = retrievedData.groupHeader;
            }
          }
        }
        if (this.config.columns) {
          this.table.options.columns = this.load("columns", this.table.options.columns);
          this.subscribe("column-init", this.initializeColumn.bind(this));
          this.subscribe("column-show", this.save.bind(this, "columns"));
          this.subscribe("column-hide", this.save.bind(this, "columns"));
          this.subscribe("column-moved", this.save.bind(this, "columns"));
        }
        this.subscribe("table-built", this.tableBuilt.bind(this), 0);
        this.subscribe("table-redraw", this.tableRedraw.bind(this));
        this.subscribe("filter-changed", this.eventSave.bind(this, "filter"));
        this.subscribe("filter-changed", this.eventSave.bind(this, "headerFilter"));
        this.subscribe("sort-changed", this.eventSave.bind(this, "sort"));
        this.subscribe("group-changed", this.eventSave.bind(this, "group"));
        this.subscribe("page-changed", this.eventSave.bind(this, "page"));
        this.subscribe("column-resized", this.eventSave.bind(this, "columns"));
        this.subscribe("column-width", this.eventSave.bind(this, "columns"));
        this.subscribe("layout-refreshed", this.eventSave.bind(this, "columns"));
      }
      this.registerTableFunction("getColumnLayout", this.getColumnLayout.bind(this));
      this.registerTableFunction("setColumnLayout", this.setColumnLayout.bind(this));
    }
    eventSave(type) {
      if (this.config[type]) {
        this.save(type);
      }
    }
    tableBuilt() {
      var sorters, filters, headerFilters;
      if (this.config.sort) {
        sorters = this.load("sort");
        if (!sorters === false) {
          this.table.options.initialSort = sorters;
        }
      }
      if (this.config.filter) {
        filters = this.load("filter");
        if (!filters === false) {
          this.table.options.initialFilter = filters;
        }
      }
      if (this.config.headerFilter) {
        headerFilters = this.load("headerFilter");
        if (!headerFilters === false) {
          this.table.options.initialHeaderFilter = headerFilters;
        }
      }
    }
    tableRedraw(force) {
      if (force && this.config.columns) {
        this.save("columns");
      }
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    getColumnLayout() {
      return this.parseColumns(this.table.columnManager.getColumns());
    }
    setColumnLayout(layout) {
      this.table.columnManager.setColumns(this.mergeDefinition(this.table.options.columns, layout, true));
      return true;
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    initializeColumn(column) {
      var def, keys;
      if (this.config.columns) {
        this.defWatcherBlock = true;
        def = column.getDefinition();
        keys = this.config.columns === true ? Object.keys(def) : this.config.columns;
        keys.forEach((key) => {
          var props = Object.getOwnPropertyDescriptor(def, key);
          var value = def[key];
          if (props) {
            Object.defineProperty(def, key, {
              set: (newValue) => {
                value = newValue;
                if (!this.defWatcherBlock) {
                  this.save("columns");
                }
                if (props.set) {
                  props.set(newValue);
                }
              },
              get: () => {
                if (props.get) {
                  props.get();
                }
                return value;
              }
            });
          }
        });
        this.defWatcherBlock = false;
      }
    }
    //load saved definitions
    load(type, current) {
      var data = this.retrieveData(type);
      if (current) {
        data = data ? this.mergeDefinition(current, data) : current;
      }
      return data;
    }
    //retrieve data from memory
    retrieveData(type) {
      return this.readFunc ? this.readFunc(this.id, type) : false;
    }
    //merge old and new column definitions
    mergeDefinition(oldCols, newCols, mergeAllNew) {
      var output = [];
      newCols = newCols || [];
      newCols.forEach((column, to) => {
        var from = this._findColumn(oldCols, column), keys;
        if (from) {
          if (mergeAllNew) {
            keys = Object.keys(column);
          } else if (this.config.columns === true || this.config.columns == void 0) {
            keys = Object.keys(from);
            keys.push("width");
          } else {
            keys = this.config.columns;
          }
          keys.forEach((key) => {
            if (key !== "columns" && typeof column[key] !== "undefined") {
              from[key] = column[key];
            }
          });
          if (from.columns) {
            from.columns = this.mergeDefinition(from.columns, column.columns);
          }
          output.push(from);
        }
      });
      oldCols.forEach((column, i) => {
        var from = this._findColumn(newCols, column);
        if (!from) {
          if (output.length > i) {
            output.splice(i, 0, column);
          } else {
            output.push(column);
          }
        }
      });
      return output;
    }
    //find matching columns
    _findColumn(columns, subject) {
      var type = subject.columns ? "group" : subject.field ? "field" : "object";
      return columns.find(function(col) {
        switch (type) {
          case "group":
            return col.title === subject.title && col.columns.length === subject.columns.length;
          case "field":
            return col.field === subject.field;
          case "object":
            return col === subject;
        }
      });
    }
    //save data
    save(type) {
      var data = {};
      switch (type) {
        case "columns":
          data = this.parseColumns(this.table.columnManager.getColumns());
          break;
        case "filter":
          data = this.table.modules.filter.getFilters();
          break;
        case "headerFilter":
          data = this.table.modules.filter.getHeaderFilters();
          break;
        case "sort":
          data = this.validateSorters(this.table.modules.sort.getSort());
          break;
        case "group":
          data = this.getGroupConfig();
          break;
        case "page":
          data = this.getPageConfig();
          break;
      }
      if (this.writeFunc) {
        this.writeFunc(this.id, type, data);
      }
    }
    //ensure sorters contain no function data
    validateSorters(data) {
      data.forEach(function(item) {
        item.column = item.field;
        delete item.field;
      });
      return data;
    }
    getGroupConfig() {
      var data = {};
      if (this.config.group) {
        if (this.config.group === true || this.config.group.groupBy) {
          data.groupBy = this.table.options.groupBy;
        }
        if (this.config.group === true || this.config.group.groupStartOpen) {
          data.groupStartOpen = this.table.options.groupStartOpen;
        }
        if (this.config.group === true || this.config.group.groupHeader) {
          data.groupHeader = this.table.options.groupHeader;
        }
      }
      return data;
    }
    getPageConfig() {
      var data = {};
      if (this.config.page) {
        if (this.config.page === true || this.config.page.size) {
          data.paginationSize = this.table.modules.page.getPageSize();
        }
        if (this.config.page === true || this.config.page.page) {
          data.paginationInitialPage = this.table.modules.page.getPage();
        }
      }
      return data;
    }
    //parse columns for data to store
    parseColumns(columns) {
      var definitions = [], excludedKeys = ["headerContextMenu", "headerMenu", "contextMenu", "clickMenu"];
      columns.forEach((column) => {
        var defStore = {}, colDef = column.getDefinition(), keys;
        if (column.isGroup) {
          defStore.title = colDef.title;
          defStore.columns = this.parseColumns(column.getColumns());
        } else {
          defStore.field = column.getField();
          if (this.config.columns === true || this.config.columns == void 0) {
            keys = Object.keys(colDef);
            keys.push("width");
            keys.push("visible");
          } else {
            keys = this.config.columns;
          }
          keys.forEach((key) => {
            switch (key) {
              case "width":
                defStore.width = column.getWidth();
                break;
              case "visible":
                defStore.visible = column.visible;
                break;
              default:
                if (typeof colDef[key] !== "function" && excludedKeys.indexOf(key) === -1) {
                  defStore[key] = colDef[key];
                }
            }
          });
        }
        definitions.push(defStore);
      });
      return definitions;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Popup/Popup.js
  var Popup2 = class extends Module {
    static moduleName = "popup";
    constructor(table) {
      super(table);
      this.columnSubscribers = {};
      this.registerTableOption("rowContextPopup", false);
      this.registerTableOption("rowClickPopup", false);
      this.registerTableOption("rowDblClickPopup", false);
      this.registerTableOption("groupContextPopup", false);
      this.registerTableOption("groupClickPopup", false);
      this.registerTableOption("groupDblClickPopup", false);
      this.registerColumnOption("headerContextPopup");
      this.registerColumnOption("headerClickPopup");
      this.registerColumnOption("headerDblClickPopup");
      this.registerColumnOption("headerPopup");
      this.registerColumnOption("headerPopupIcon");
      this.registerColumnOption("contextPopup");
      this.registerColumnOption("clickPopup");
      this.registerColumnOption("dblClickPopup");
      this.registerComponentFunction("cell", "popup", this._componentPopupCall.bind(this));
      this.registerComponentFunction("column", "popup", this._componentPopupCall.bind(this));
      this.registerComponentFunction("row", "popup", this._componentPopupCall.bind(this));
      this.registerComponentFunction("group", "popup", this._componentPopupCall.bind(this));
    }
    initialize() {
      this.initializeRowWatchers();
      this.initializeGroupWatchers();
      this.subscribe("column-init", this.initializeColumn.bind(this));
    }
    _componentPopupCall(component, contents, position) {
      this.loadPopupEvent(contents, null, component, position);
    }
    initializeRowWatchers() {
      if (this.table.options.rowContextPopup) {
        this.subscribe("row-contextmenu", this.loadPopupEvent.bind(this, this.table.options.rowContextPopup));
        this.table.on("rowTapHold", this.loadPopupEvent.bind(this, this.table.options.rowContextPopup));
      }
      if (this.table.options.rowClickPopup) {
        this.subscribe("row-click", this.loadPopupEvent.bind(this, this.table.options.rowClickPopup));
      }
      if (this.table.options.rowDblClickPopup) {
        this.subscribe("row-dblclick", this.loadPopupEvent.bind(this, this.table.options.rowDblClickPopup));
      }
    }
    initializeGroupWatchers() {
      if (this.table.options.groupContextPopup) {
        this.subscribe("group-contextmenu", this.loadPopupEvent.bind(this, this.table.options.groupContextPopup));
        this.table.on("groupTapHold", this.loadPopupEvent.bind(this, this.table.options.groupContextPopup));
      }
      if (this.table.options.groupClickPopup) {
        this.subscribe("group-click", this.loadPopupEvent.bind(this, this.table.options.groupClickPopup));
      }
      if (this.table.options.groupDblClickPopup) {
        this.subscribe("group-dblclick", this.loadPopupEvent.bind(this, this.table.options.groupDblClickPopup));
      }
    }
    initializeColumn(column) {
      var def = column.definition;
      if (def.headerContextPopup && !this.columnSubscribers.headerContextPopup) {
        this.columnSubscribers.headerContextPopup = this.loadPopupTableColumnEvent.bind(this, "headerContextPopup");
        this.subscribe("column-contextmenu", this.columnSubscribers.headerContextPopup);
        this.table.on("headerTapHold", this.loadPopupTableColumnEvent.bind(this, "headerContextPopup"));
      }
      if (def.headerClickPopup && !this.columnSubscribers.headerClickPopup) {
        this.columnSubscribers.headerClickPopup = this.loadPopupTableColumnEvent.bind(this, "headerClickPopup");
        this.subscribe("column-click", this.columnSubscribers.headerClickPopup);
      }
      if (def.headerDblClickPopup && !this.columnSubscribers.headerDblClickPopup) {
        this.columnSubscribers.headerDblClickPopup = this.loadPopupTableColumnEvent.bind(this, "headerDblClickPopup");
        this.subscribe("column-dblclick", this.columnSubscribers.headerDblClickPopup);
      }
      if (def.headerPopup) {
        this.initializeColumnHeaderPopup(column);
      }
      if (def.contextPopup && !this.columnSubscribers.contextPopup) {
        this.columnSubscribers.contextPopup = this.loadPopupTableCellEvent.bind(this, "contextPopup");
        this.subscribe("cell-contextmenu", this.columnSubscribers.contextPopup);
        this.table.on("cellTapHold", this.loadPopupTableCellEvent.bind(this, "contextPopup"));
      }
      if (def.clickPopup && !this.columnSubscribers.clickPopup) {
        this.columnSubscribers.clickPopup = this.loadPopupTableCellEvent.bind(this, "clickPopup");
        this.subscribe("cell-click", this.columnSubscribers.clickPopup);
      }
      if (def.dblClickPopup && !this.columnSubscribers.dblClickPopup) {
        this.columnSubscribers.dblClickPopup = this.loadPopupTableCellEvent.bind(this, "dblClickPopup");
        this.subscribe("cell-click", this.columnSubscribers.dblClickPopup);
      }
    }
    initializeColumnHeaderPopup(column) {
      var icon = column.definition.headerPopupIcon, headerPopupEl;
      headerPopupEl = document.createElement("span");
      headerPopupEl.classList.add("tabulator-header-popup-button");
      if (icon) {
        if (typeof icon === "function") {
          icon = icon(column.getComponent());
        }
        if (icon instanceof HTMLElement) {
          headerPopupEl.appendChild(icon);
        } else {
          headerPopupEl.innerHTML = icon;
        }
      } else {
        headerPopupEl.innerHTML = "&vellip;";
      }
      headerPopupEl.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.loadPopupEvent(column.definition.headerPopup, e, column);
      });
      column.titleElement.insertBefore(headerPopupEl, column.titleElement.firstChild);
    }
    loadPopupTableCellEvent(option, e, cell) {
      if (cell._cell) {
        cell = cell._cell;
      }
      if (cell.column.definition[option]) {
        this.loadPopupEvent(cell.column.definition[option], e, cell);
      }
    }
    loadPopupTableColumnEvent(option, e, column) {
      if (column._column) {
        column = column._column;
      }
      if (column.definition[option]) {
        this.loadPopupEvent(column.definition[option], e, column);
      }
    }
    loadPopupEvent(contents, e, component, position) {
      var renderedCallback;
      function onRendered(callback) {
        renderedCallback = callback;
      }
      if (component._group) {
        component = component._group;
      } else if (component._row) {
        component = component._row;
      }
      contents = typeof contents == "function" ? contents.call(this.table, e, component.getComponent(), onRendered) : contents;
      this.loadPopup(e, component, contents, renderedCallback, position);
    }
    loadPopup(e, component, contents, renderedCallback, position) {
      var touch = !(e instanceof MouseEvent), contentsEl, popup;
      if (contents instanceof HTMLElement) {
        contentsEl = contents;
      } else {
        contentsEl = document.createElement("div");
        contentsEl.innerHTML = contents;
      }
      contentsEl.classList.add("tabulator-popup");
      contentsEl.addEventListener("click", (e2) => {
        e2.stopPropagation();
      });
      if (!touch) {
        e.preventDefault();
      }
      popup = this.popup(contentsEl);
      if (typeof renderedCallback === "function") {
        popup.renderCallback(renderedCallback);
      }
      if (e) {
        popup.show(e);
      } else {
        popup.show(component.getElement(), position || "center");
      }
      popup.hideOnBlur(() => {
        this.dispatchExternal("popupClosed", component.getComponent());
      });
      this.dispatchExternal("popupOpened", component.getComponent());
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Print/Print.js
  var Print = class extends Module {
    static moduleName = "print";
    constructor(table) {
      super(table);
      this.element = false;
      this.manualBlock = false;
      this.beforeprintEventHandler = null;
      this.afterprintEventHandler = null;
      this.registerTableOption("printAsHtml", false);
      this.registerTableOption("printFormatter", false);
      this.registerTableOption("printHeader", false);
      this.registerTableOption("printFooter", false);
      this.registerTableOption("printStyled", true);
      this.registerTableOption("printRowRange", "visible");
      this.registerTableOption("printConfig", {});
      this.registerColumnOption("print");
      this.registerColumnOption("titlePrint");
    }
    initialize() {
      if (this.table.options.printAsHtml) {
        this.beforeprintEventHandler = this.replaceTable.bind(this);
        this.afterprintEventHandler = this.cleanup.bind(this);
        window.addEventListener("beforeprint", this.beforeprintEventHandler);
        window.addEventListener("afterprint", this.afterprintEventHandler);
        this.subscribe("table-destroy", this.destroy.bind(this));
      }
      this.registerTableFunction("print", this.printFullscreen.bind(this));
    }
    destroy() {
      if (this.table.options.printAsHtml) {
        window.removeEventListener("beforeprint", this.beforeprintEventHandler);
        window.removeEventListener("afterprint", this.afterprintEventHandler);
      }
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    replaceTable() {
      if (!this.manualBlock) {
        this.element = document.createElement("div");
        this.element.classList.add("tabulator-print-table");
        this.element.appendChild(this.table.modules.export.generateTable(this.table.options.printConfig, this.table.options.printStyled, this.table.options.printRowRange, "print"));
        this.table.element.style.display = "none";
        this.table.element.parentNode.insertBefore(this.element, this.table.element);
      }
    }
    cleanup() {
      document.body.classList.remove("tabulator-print-fullscreen-hide");
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
        this.table.element.style.display = "";
      }
    }
    printFullscreen(visible, style, config) {
      var scrollX = window.scrollX, scrollY = window.scrollY, headerEl = document.createElement("div"), footerEl = document.createElement("div"), tableEl = this.table.modules.export.generateTable(typeof config != "undefined" ? config : this.table.options.printConfig, typeof style != "undefined" ? style : this.table.options.printStyled, visible || this.table.options.printRowRange, "print"), headerContent, footerContent;
      this.manualBlock = true;
      this.element = document.createElement("div");
      this.element.classList.add("tabulator-print-fullscreen");
      if (this.table.options.printHeader) {
        headerEl.classList.add("tabulator-print-header");
        headerContent = typeof this.table.options.printHeader == "function" ? this.table.options.printHeader.call(this.table) : this.table.options.printHeader;
        if (typeof headerContent == "string") {
          headerEl.innerHTML = headerContent;
        } else {
          headerEl.appendChild(headerContent);
        }
        this.element.appendChild(headerEl);
      }
      this.element.appendChild(tableEl);
      if (this.table.options.printFooter) {
        footerEl.classList.add("tabulator-print-footer");
        footerContent = typeof this.table.options.printFooter == "function" ? this.table.options.printFooter.call(this.table) : this.table.options.printFooter;
        if (typeof footerContent == "string") {
          footerEl.innerHTML = footerContent;
        } else {
          footerEl.appendChild(footerContent);
        }
        this.element.appendChild(footerEl);
      }
      document.body.classList.add("tabulator-print-fullscreen-hide");
      document.body.appendChild(this.element);
      if (this.table.options.printFormatter) {
        this.table.options.printFormatter(this.element, tableEl);
      }
      window.print();
      this.cleanup();
      window.scrollTo(scrollX, scrollY);
      this.manualBlock = false;
    }
  };

  // node_modules/tabulator-tables/src/js/modules/ReactiveData/ReactiveData.js
  var ReactiveData = class extends Module {
    static moduleName = "reactiveData";
    constructor(table) {
      super(table);
      this.data = false;
      this.blocked = false;
      this.origFuncs = {};
      this.currentVersion = 0;
      this.registerTableOption("reactiveData", false);
    }
    initialize() {
      if (this.table.options.reactiveData) {
        this.subscribe("cell-value-save-before", this.block.bind(this, "cellsave"));
        this.subscribe("cell-value-save-after", this.unblock.bind(this, "cellsave"));
        this.subscribe("row-data-save-before", this.block.bind(this, "rowsave"));
        this.subscribe("row-data-save-after", this.unblock.bind(this, "rowsave"));
        this.subscribe("row-data-init-after", this.watchRow.bind(this));
        this.subscribe("data-processing", this.watchData.bind(this));
        this.subscribe("table-destroy", this.unwatchData.bind(this));
      }
    }
    watchData(data) {
      var self = this, version;
      this.currentVersion++;
      version = this.currentVersion;
      this.unwatchData();
      this.data = data;
      this.origFuncs.push = data.push;
      Object.defineProperty(this.data, "push", {
        enumerable: false,
        configurable: true,
        value: function() {
          var args = Array.from(arguments), result;
          if (!self.blocked && version === self.currentVersion) {
            self.block("data-push");
            args.forEach((arg) => {
              self.table.rowManager.addRowActual(arg, false);
            });
            result = self.origFuncs.push.apply(data, arguments);
            self.unblock("data-push");
          }
          return result;
        }
      });
      this.origFuncs.unshift = data.unshift;
      Object.defineProperty(this.data, "unshift", {
        enumerable: false,
        configurable: true,
        value: function() {
          var args = Array.from(arguments), result;
          if (!self.blocked && version === self.currentVersion) {
            self.block("data-unshift");
            args.forEach((arg) => {
              self.table.rowManager.addRowActual(arg, true);
            });
            result = self.origFuncs.unshift.apply(data, arguments);
            self.unblock("data-unshift");
          }
          return result;
        }
      });
      this.origFuncs.shift = data.shift;
      Object.defineProperty(this.data, "shift", {
        enumerable: false,
        configurable: true,
        value: function() {
          var row, result;
          if (!self.blocked && version === self.currentVersion) {
            self.block("data-shift");
            if (self.data.length) {
              row = self.table.rowManager.getRowFromDataObject(self.data[0]);
              if (row) {
                row.deleteActual();
              }
            }
            result = self.origFuncs.shift.call(data);
            self.unblock("data-shift");
          }
          return result;
        }
      });
      this.origFuncs.pop = data.pop;
      Object.defineProperty(this.data, "pop", {
        enumerable: false,
        configurable: true,
        value: function() {
          var row, result;
          if (!self.blocked && version === self.currentVersion) {
            self.block("data-pop");
            if (self.data.length) {
              row = self.table.rowManager.getRowFromDataObject(self.data[self.data.length - 1]);
              if (row) {
                row.deleteActual();
              }
            }
            result = self.origFuncs.pop.call(data);
            self.unblock("data-pop");
          }
          return result;
        }
      });
      this.origFuncs.splice = data.splice;
      Object.defineProperty(this.data, "splice", {
        enumerable: false,
        configurable: true,
        value: function() {
          var args = Array.from(arguments), start = args[0] < 0 ? data.length + args[0] : args[0], end = args[1], newRows = args[2] ? args.slice(2) : false, startRow, result;
          if (!self.blocked && version === self.currentVersion) {
            self.block("data-splice");
            if (newRows) {
              startRow = data[start] ? self.table.rowManager.getRowFromDataObject(data[start]) : false;
              if (startRow) {
                newRows.forEach((rowData) => {
                  self.table.rowManager.addRowActual(rowData, true, startRow, true);
                });
              } else {
                newRows = newRows.slice().reverse();
                newRows.forEach((rowData) => {
                  self.table.rowManager.addRowActual(rowData, true, false, true);
                });
              }
            }
            if (end !== 0) {
              var oldRows = data.slice(start, typeof args[1] === "undefined" ? args[1] : start + end);
              oldRows.forEach((rowData, i) => {
                var row = self.table.rowManager.getRowFromDataObject(rowData);
                if (row) {
                  row.deleteActual(i !== oldRows.length - 1);
                }
              });
            }
            if (newRows || end !== 0) {
              self.table.rowManager.reRenderInPosition();
            }
            result = self.origFuncs.splice.apply(data, arguments);
            self.unblock("data-splice");
          }
          return result;
        }
      });
    }
    unwatchData() {
      if (this.data !== false) {
        for (var key in this.origFuncs) {
          Object.defineProperty(this.data, key, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.origFuncs.key
          });
        }
      }
    }
    watchRow(row) {
      var data = row.getData();
      for (var key in data) {
        this.watchKey(row, data, key);
      }
      if (this.table.options.dataTree) {
        this.watchTreeChildren(row);
      }
    }
    watchTreeChildren(row) {
      var self = this, childField = row.getData()[this.table.options.dataTreeChildField], origFuncs = {};
      if (childField) {
        origFuncs.push = childField.push;
        Object.defineProperty(childField, "push", {
          enumerable: false,
          configurable: true,
          value: () => {
            if (!self.blocked) {
              self.block("tree-push");
              var result = origFuncs.push.apply(childField, arguments);
              this.rebuildTree(row);
              self.unblock("tree-push");
            }
            return result;
          }
        });
        origFuncs.unshift = childField.unshift;
        Object.defineProperty(childField, "unshift", {
          enumerable: false,
          configurable: true,
          value: () => {
            if (!self.blocked) {
              self.block("tree-unshift");
              var result = origFuncs.unshift.apply(childField, arguments);
              this.rebuildTree(row);
              self.unblock("tree-unshift");
            }
            return result;
          }
        });
        origFuncs.shift = childField.shift;
        Object.defineProperty(childField, "shift", {
          enumerable: false,
          configurable: true,
          value: () => {
            if (!self.blocked) {
              self.block("tree-shift");
              var result = origFuncs.shift.call(childField);
              this.rebuildTree(row);
              self.unblock("tree-shift");
            }
            return result;
          }
        });
        origFuncs.pop = childField.pop;
        Object.defineProperty(childField, "pop", {
          enumerable: false,
          configurable: true,
          value: () => {
            if (!self.blocked) {
              self.block("tree-pop");
              var result = origFuncs.pop.call(childField);
              this.rebuildTree(row);
              self.unblock("tree-pop");
            }
            return result;
          }
        });
        origFuncs.splice = childField.splice;
        Object.defineProperty(childField, "splice", {
          enumerable: false,
          configurable: true,
          value: () => {
            if (!self.blocked) {
              self.block("tree-splice");
              var result = origFuncs.splice.apply(childField, arguments);
              this.rebuildTree(row);
              self.unblock("tree-splice");
            }
            return result;
          }
        });
      }
    }
    rebuildTree(row) {
      this.table.modules.dataTree.initializeRow(row);
      this.table.modules.dataTree.layoutRow(row);
      this.table.rowManager.refreshActiveData("tree", false, true);
    }
    watchKey(row, data, key) {
      var self = this, props = Object.getOwnPropertyDescriptor(data, key), value = data[key], version = this.currentVersion;
      Object.defineProperty(data, key, {
        set: (newValue) => {
          value = newValue;
          if (!self.blocked && version === self.currentVersion) {
            self.block("key");
            var update = {};
            update[key] = newValue;
            row.updateData(update);
            self.unblock("key");
          }
          if (props.set) {
            props.set(newValue);
          }
        },
        get: () => {
          if (props.get) {
            props.get();
          }
          return value;
        }
      });
    }
    unwatchRow(row) {
      var data = row.getData();
      for (var key in data) {
        Object.defineProperty(data, key, {
          value: data[key]
        });
      }
    }
    block(key) {
      if (!this.blocked) {
        this.blocked = key;
      }
    }
    unblock(key) {
      if (this.blocked === key) {
        this.blocked = false;
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/ResizeColumns/ResizeColumns.js
  var ResizeColumns = class extends Module {
    static moduleName = "resizeColumns";
    constructor(table) {
      super(table);
      this.startColumn = false;
      this.startX = false;
      this.startWidth = false;
      this.latestX = false;
      this.handle = null;
      this.initialNextColumn = null;
      this.nextColumn = null;
      this.initialized = false;
      this.registerColumnOption("resizable", true);
      this.registerTableOption("resizableColumnFit", false);
      this.registerTableOption("resizableColumnGuide", false);
    }
    initialize() {
      this.subscribe("column-rendered", this.layoutColumnHeader.bind(this));
    }
    initializeEventWatchers() {
      if (!this.initialized) {
        this.subscribe("cell-rendered", this.layoutCellHandles.bind(this));
        this.subscribe("cell-delete", this.deInitializeComponent.bind(this));
        this.subscribe("cell-height", this.resizeHandle.bind(this));
        this.subscribe("column-moved", this.columnLayoutUpdated.bind(this));
        this.subscribe("column-hide", this.deInitializeColumn.bind(this));
        this.subscribe("column-show", this.columnLayoutUpdated.bind(this));
        this.subscribe("column-width", this.columnWidthUpdated.bind(this));
        this.subscribe("column-delete", this.deInitializeComponent.bind(this));
        this.subscribe("column-height", this.resizeHandle.bind(this));
        this.initialized = true;
      }
    }
    layoutCellHandles(cell) {
      if (cell.row.type === "row") {
        this.deInitializeComponent(cell);
        this.initializeColumn("cell", cell, cell.column, cell.element);
      }
    }
    layoutColumnHeader(column) {
      if (column.definition.resizable) {
        this.initializeEventWatchers();
        this.deInitializeComponent(column);
        this.initializeColumn("header", column, column, column.element);
      }
    }
    columnLayoutUpdated(column) {
      var prev = column.prevColumn();
      this.reinitializeColumn(column);
      if (prev) {
        this.reinitializeColumn(prev);
      }
    }
    columnWidthUpdated(column) {
      if (column.modules.frozen) {
        if (this.table.modules.frozenColumns.leftColumns.includes(column)) {
          this.table.modules.frozenColumns.leftColumns.forEach((col) => {
            this.reinitializeColumn(col);
          });
        } else if (this.table.modules.frozenColumns.rightColumns.includes(column)) {
          this.table.modules.frozenColumns.rightColumns.forEach((col) => {
            this.reinitializeColumn(col);
          });
        }
      }
    }
    frozenColumnOffset(column) {
      var offset = false;
      if (column.modules.frozen) {
        offset = column.modules.frozen.marginValue;
        if (column.modules.frozen.position === "left") {
          offset += column.getWidth() - 3;
        } else {
          if (offset) {
            offset -= 3;
          }
        }
      }
      return offset !== false ? offset + "px" : false;
    }
    reinitializeColumn(column) {
      var frozenOffset = this.frozenColumnOffset(column);
      column.cells.forEach((cell) => {
        if (cell.modules.resize && cell.modules.resize.handleEl) {
          if (frozenOffset) {
            cell.modules.resize.handleEl.style[column.modules.frozen.position] = frozenOffset;
            cell.modules.resize.handleEl.style["z-index"] = 11;
          }
          cell.element.after(cell.modules.resize.handleEl);
        }
      });
      if (column.modules.resize && column.modules.resize.handleEl) {
        if (frozenOffset) {
          column.modules.resize.handleEl.style[column.modules.frozen.position] = frozenOffset;
        }
        column.element.after(column.modules.resize.handleEl);
      }
    }
    initializeColumn(type, component, column, element) {
      var self = this, variableHeight = false, mode = column.definition.resizable, config = {}, nearestColumn = column.getLastColumn();
      if (type === "header") {
        variableHeight = column.definition.formatter == "textarea" || column.definition.variableHeight;
        config = { variableHeight };
      }
      if ((mode === true || mode == type) && this._checkResizability(nearestColumn)) {
        var handle = document.createElement("span");
        handle.className = "tabulator-col-resize-handle";
        handle.addEventListener("click", function(e) {
          e.stopPropagation();
        });
        var handleDown = function(e) {
          self.startColumn = column;
          self.initialNextColumn = self.nextColumn = nearestColumn.nextColumn();
          self._mouseDown(e, nearestColumn, handle);
        };
        handle.addEventListener("mousedown", handleDown);
        handle.addEventListener("touchstart", handleDown, { passive: true });
        handle.addEventListener("dblclick", (e) => {
          var oldWidth = nearestColumn.getWidth();
          e.stopPropagation();
          nearestColumn.reinitializeWidth(true);
          if (oldWidth !== nearestColumn.getWidth()) {
            self.dispatch("column-resized", nearestColumn);
            self.dispatchExternal("columnResized", nearestColumn.getComponent());
          }
        });
        if (column.modules.frozen) {
          handle.style.position = "sticky";
          handle.style[column.modules.frozen.position] = this.frozenColumnOffset(column);
        }
        config.handleEl = handle;
        if (element.parentNode && column.visible) {
          element.after(handle);
        }
      }
      component.modules.resize = config;
    }
    deInitializeColumn(column) {
      this.deInitializeComponent(column);
      column.cells.forEach((cell) => {
        this.deInitializeComponent(cell);
      });
    }
    deInitializeComponent(component) {
      var handleEl;
      if (component.modules.resize) {
        handleEl = component.modules.resize.handleEl;
        if (handleEl && handleEl.parentElement) {
          handleEl.parentElement.removeChild(handleEl);
        }
      }
    }
    resizeHandle(component, height) {
      if (component.modules.resize && component.modules.resize.handleEl) {
        component.modules.resize.handleEl.style.height = height;
      }
    }
    resize(e, column) {
      var x = typeof e.clientX === "undefined" ? e.touches[0].clientX : e.clientX, startDiff = x - this.startX, moveDiff = x - this.latestX, blockedBefore, blockedAfter;
      this.latestX = x;
      if (this.table.rtl) {
        startDiff = -startDiff;
        moveDiff = -moveDiff;
      }
      blockedBefore = column.width == column.minWidth || column.width == column.maxWidth;
      column.setWidth(this.startWidth + startDiff);
      blockedAfter = column.width == column.minWidth || column.width == column.maxWidth;
      if (moveDiff < 0) {
        this.nextColumn = this.initialNextColumn;
      }
      if (this.table.options.resizableColumnFit && this.nextColumn && !(blockedBefore && blockedAfter)) {
        let colWidth = this.nextColumn.getWidth();
        if (moveDiff > 0) {
          if (colWidth <= this.nextColumn.minWidth) {
            this.nextColumn = this.nextColumn.nextColumn();
          }
        }
        if (this.nextColumn) {
          this.nextColumn.setWidth(this.nextColumn.getWidth() - moveDiff);
        }
      }
      this.table.columnManager.rerenderColumns(true);
      if (!this.table.browserSlow && column.modules.resize && column.modules.resize.variableHeight) {
        column.checkCellHeights();
      }
    }
    calcGuidePosition(e, column, handle) {
      var mouseX = typeof e.clientX === "undefined" ? e.touches[0].clientX : e.clientX, handleX = handle.getBoundingClientRect().x - this.table.element.getBoundingClientRect().x, tableX = this.table.element.getBoundingClientRect().x, columnX = column.element.getBoundingClientRect().left - tableX, mouseDiff = mouseX - this.startX, pos = Math.max(handleX + mouseDiff, columnX + column.minWidth);
      if (column.maxWidth) {
        pos = Math.min(pos, columnX + column.maxWidth);
      }
      return pos;
    }
    _checkResizability(column) {
      return column.definition.resizable;
    }
    _mouseDown(e, column, handle) {
      var self = this, guideEl;
      this.dispatchExternal("columnResizing", column.getComponent());
      if (self.table.options.resizableColumnGuide) {
        guideEl = document.createElement("span");
        guideEl.classList.add("tabulator-col-resize-guide");
        self.table.element.appendChild(guideEl);
        setTimeout(() => {
          guideEl.style.left = self.calcGuidePosition(e, column, handle) + "px";
        });
      }
      self.table.element.classList.add("tabulator-block-select");
      function mouseMove(e2) {
        if (self.table.options.resizableColumnGuide) {
          guideEl.style.left = self.calcGuidePosition(e2, column, handle) + "px";
        } else {
          self.resize(e2, column);
        }
      }
      function mouseUp(e2) {
        if (self.table.options.resizableColumnGuide) {
          self.resize(e2, column);
          guideEl.remove();
        }
        if (self.startColumn.modules.edit) {
          self.startColumn.modules.edit.blocked = false;
        }
        if (self.table.browserSlow && column.modules.resize && column.modules.resize.variableHeight) {
          column.checkCellHeights();
        }
        document.body.removeEventListener("mouseup", mouseUp);
        document.body.removeEventListener("mousemove", mouseMove);
        handle.removeEventListener("touchmove", mouseMove);
        handle.removeEventListener("touchend", mouseUp);
        self.table.element.classList.remove("tabulator-block-select");
        if (self.startWidth !== column.getWidth()) {
          self.table.columnManager.verticalAlignHeaders();
          self.dispatch("column-resized", column);
          self.dispatchExternal("columnResized", column.getComponent());
        }
      }
      e.stopPropagation();
      if (self.startColumn.modules.edit) {
        self.startColumn.modules.edit.blocked = true;
      }
      self.startX = typeof e.clientX === "undefined" ? e.touches[0].clientX : e.clientX;
      self.latestX = self.startX;
      self.startWidth = column.getWidth();
      document.body.addEventListener("mousemove", mouseMove);
      document.body.addEventListener("mouseup", mouseUp);
      handle.addEventListener("touchmove", mouseMove, { passive: true });
      handle.addEventListener("touchend", mouseUp);
    }
  };

  // node_modules/tabulator-tables/src/js/modules/ResizeRows/ResizeRows.js
  var ResizeRows = class extends Module {
    static moduleName = "resizeRows";
    constructor(table) {
      super(table);
      this.startColumn = false;
      this.startY = false;
      this.startHeight = false;
      this.handle = null;
      this.prevHandle = null;
      this.registerTableOption("resizableRows", false);
      this.registerTableOption("resizableRowGuide", false);
    }
    initialize() {
      if (this.table.options.resizableRows) {
        this.subscribe("row-layout-after", this.initializeRow.bind(this));
      }
    }
    initializeRow(row) {
      var self = this, rowEl = row.getElement();
      var handle = document.createElement("div");
      handle.className = "tabulator-row-resize-handle";
      var prevHandle = document.createElement("div");
      prevHandle.className = "tabulator-row-resize-handle prev";
      handle.addEventListener("click", function(e) {
        e.stopPropagation();
      });
      var handleDown = function(e) {
        self.startRow = row;
        self._mouseDown(e, row, handle);
      };
      handle.addEventListener("mousedown", handleDown);
      handle.addEventListener("touchstart", handleDown, { passive: true });
      prevHandle.addEventListener("click", function(e) {
        e.stopPropagation();
      });
      var prevHandleDown = function(e) {
        var prevRow = self.table.rowManager.prevDisplayRow(row);
        if (prevRow) {
          self.startRow = prevRow;
          self._mouseDown(e, prevRow, prevHandle);
        }
      };
      prevHandle.addEventListener("mousedown", prevHandleDown);
      prevHandle.addEventListener("touchstart", prevHandleDown, { passive: true });
      rowEl.appendChild(handle);
      rowEl.appendChild(prevHandle);
    }
    resize(e, row) {
      row.setHeight(this.startHeight + ((typeof e.screenY === "undefined" ? e.touches[0].screenY : e.screenY) - this.startY));
    }
    calcGuidePosition(e, row, handle) {
      var mouseY = typeof e.screenY === "undefined" ? e.touches[0].screenY : e.screenY, handleY = handle.getBoundingClientRect().y - this.table.element.getBoundingClientRect().y, tableY = this.table.element.getBoundingClientRect().y, rowY = row.element.getBoundingClientRect().top - tableY, mouseDiff = mouseY - this.startY;
      return Math.max(handleY + mouseDiff, rowY);
    }
    _mouseDown(e, row, handle) {
      var self = this, guideEl;
      self.dispatchExternal("rowResizing", row.getComponent());
      if (self.table.options.resizableRowGuide) {
        guideEl = document.createElement("span");
        guideEl.classList.add("tabulator-row-resize-guide");
        self.table.element.appendChild(guideEl);
        setTimeout(() => {
          guideEl.style.top = self.calcGuidePosition(e, row, handle) + "px";
        });
      }
      self.table.element.classList.add("tabulator-block-select");
      function mouseMove(e2) {
        if (self.table.options.resizableRowGuide) {
          guideEl.style.top = self.calcGuidePosition(e2, row, handle) + "px";
        } else {
          self.resize(e2, row);
        }
      }
      function mouseUp(e2) {
        if (self.table.options.resizableRowGuide) {
          self.resize(e2, row);
          guideEl.remove();
        }
        document.body.removeEventListener("mouseup", mouseMove);
        document.body.removeEventListener("mousemove", mouseMove);
        handle.removeEventListener("touchmove", mouseMove);
        handle.removeEventListener("touchend", mouseUp);
        self.table.element.classList.remove("tabulator-block-select");
        self.dispatchExternal("rowResized", row.getComponent());
      }
      e.stopPropagation();
      self.startY = typeof e.screenY === "undefined" ? e.touches[0].screenY : e.screenY;
      self.startHeight = row.getHeight();
      document.body.addEventListener("mousemove", mouseMove);
      document.body.addEventListener("mouseup", mouseUp);
      handle.addEventListener("touchmove", mouseMove, { passive: true });
      handle.addEventListener("touchend", mouseUp);
    }
  };

  // node_modules/tabulator-tables/src/js/modules/ResizeTable/ResizeTable.js
  var ResizeTable = class extends Module {
    static moduleName = "resizeTable";
    constructor(table) {
      super(table);
      this.binding = false;
      this.visibilityObserver = false;
      this.resizeObserver = false;
      this.containerObserver = false;
      this.tableHeight = 0;
      this.tableWidth = 0;
      this.containerHeight = 0;
      this.containerWidth = 0;
      this.autoResize = false;
      this.visible = false;
      this.initialized = false;
      this.initialRedraw = false;
      this.registerTableOption("autoResize", true);
    }
    initialize() {
      if (this.table.options.autoResize) {
        var table = this.table, tableStyle;
        this.tableHeight = table.element.clientHeight;
        this.tableWidth = table.element.clientWidth;
        if (table.element.parentNode) {
          this.containerHeight = table.element.parentNode.clientHeight;
          this.containerWidth = table.element.parentNode.clientWidth;
        }
        if (typeof IntersectionObserver !== "undefined" && typeof ResizeObserver !== "undefined" && table.rowManager.getRenderMode() === "virtual") {
          this.initializeVisibilityObserver();
          this.autoResize = true;
          this.resizeObserver = new ResizeObserver((entry) => {
            if (!table.browserMobile || table.browserMobile && (!table.modules.edit || table.modules.edit && !table.modules.edit.currentCell)) {
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
          if (this.table.element.parentNode && !this.table.rowManager.fixedHeight && (tableStyle.getPropertyValue("max-height") || tableStyle.getPropertyValue("min-height"))) {
            this.containerObserver = new ResizeObserver((entry) => {
              if (!table.browserMobile || table.browserMobile && (!table.modules.edit || table.modules.edit && !table.modules.edit.currentCell)) {
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
          this.binding = function() {
            if (!table.browserMobile || table.browserMobile && (!table.modules.edit || table.modules.edit && !table.modules.edit.currentCell)) {
              table.columnManager.rerenderColumns(true);
              table.redraw();
            }
          };
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
    redrawTable(force) {
      if (this.initialized && this.visible) {
        this.table.columnManager.rerenderColumns(true);
        this.table.redraw(force);
      }
    }
    tableResized() {
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
  };

  // src/classes/tabulator/ResizeTable/ResizeTable.js
  var MyResizeTable = class extends ResizeTable {
    static moduleName = "resizeTable";
    initialize() {
      if (this.table.options.autoResize) {
        var table = this.table, tableStyle;
        this.tableHeight = table.element.clientHeight;
        this.tableWidth = table.element.clientWidth;
        if (table.element.parentNode) {
          this.containerHeight = table.element.parentNode.clientHeight;
          this.containerWidth = table.element.parentNode.clientWidth;
        }
        if (typeof IntersectionObserver !== "undefined" && typeof ResizeObserver !== "undefined" && table.rowManager.getRenderMode() === "virtual") {
          this.initializeVisibilityObserver();
          this.autoResize = true;
          this.resizeObserver = new ResizeObserver((entry) => {
            if (!table.browserMobile || table.browserMobile && (!table.modules.edit || table.modules.edit && !table.modules.edit.currentCell)) {
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
          if (this.table.element.parentNode && !this.table.rowManager.fixedHeight && (tableStyle.getPropertyValue("max-height") || tableStyle.getPropertyValue("min-height"))) {
            this.containerObserver = new ResizeObserver((entry) => {
              if (!table.browserMobile || table.browserMobile && (!table.modules.edit || table.modules.edit && !table.modules.edit.currentCell)) {
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
          this.binding = function() {
            if (!table.browserMobile || table.browserMobile && (!table.modules.edit || table.modules.edit && !table.modules.edit.currentCell)) {
              table.columnManager.rerenderColumns(true);
              table.redraw();
            }
          };
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
  };

  // node_modules/tabulator-tables/src/js/modules/ResponsiveLayout/extensions/formatters/responsiveCollapse.js
  function responsiveCollapse_default(cell, formatterParams, onRendered) {
    var el = document.createElement("div"), config = cell.getRow()._row.modules.responsiveLayout;
    el.classList.add("tabulator-responsive-collapse-toggle");
    el.innerHTML = `<svg class='tabulator-responsive-collapse-toggle-open' viewbox="0 0 24 24">
  <line x1="7" y1="12" x2="17" y2="12" fill="none" stroke-width="3" stroke-linecap="round" />
  <line y1="7" x1="12" y2="17" x2="12" fill="none" stroke-width="3" stroke-linecap="round" />
</svg>

<svg class='tabulator-responsive-collapse-toggle-close' viewbox="0 0 24 24">
  <line x1="7" y1="12" x2="17" y2="12"  fill="none" stroke-width="3" stroke-linecap="round" />
</svg>`;
    cell.getElement().classList.add("tabulator-row-handle");
    function toggleList(isOpen) {
      var collapseEl = config.element;
      config.open = isOpen;
      if (collapseEl) {
        if (config.open) {
          el.classList.add("open");
          collapseEl.style.display = "";
        } else {
          el.classList.remove("open");
          collapseEl.style.display = "none";
        }
      }
    }
    el.addEventListener("click", function(e) {
      e.stopImmediatePropagation();
      toggleList(!config.open);
      cell.getTable().rowManager.adjustTableSize();
    });
    toggleList(config.open);
    return el;
  }

  // node_modules/tabulator-tables/src/js/modules/ResponsiveLayout/extensions/extensions.js
  var extensions_default3 = {
    format: {
      formatters: {
        responsiveCollapse: responsiveCollapse_default
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/ResponsiveLayout/ResponsiveLayout.js
  var ResponsiveLayout = class extends Module {
    static moduleName = "responsiveLayout";
    static moduleExtensions = extensions_default3;
    constructor(table) {
      super(table);
      this.columns = [];
      this.hiddenColumns = [];
      this.mode = "";
      this.index = 0;
      this.collapseFormatter = [];
      this.collapseStartOpen = true;
      this.collapseHandleColumn = false;
      this.registerTableOption("responsiveLayout", false);
      this.registerTableOption("responsiveLayoutCollapseStartOpen", true);
      this.registerTableOption("responsiveLayoutCollapseUseFormatters", true);
      this.registerTableOption("responsiveLayoutCollapseFormatter", false);
      this.registerColumnOption("responsive");
    }
    //generate responsive columns list
    initialize() {
      if (this.table.options.responsiveLayout) {
        this.subscribe("column-layout", this.initializeColumn.bind(this));
        this.subscribe("column-show", this.updateColumnVisibility.bind(this));
        this.subscribe("column-hide", this.updateColumnVisibility.bind(this));
        this.subscribe("columns-loaded", this.initializeResponsivity.bind(this));
        this.subscribe("column-moved", this.initializeResponsivity.bind(this));
        this.subscribe("column-add", this.initializeResponsivity.bind(this));
        this.subscribe("column-delete", this.initializeResponsivity.bind(this));
        this.subscribe("table-redrawing", this.tableRedraw.bind(this));
        if (this.table.options.responsiveLayout === "collapse") {
          this.subscribe("row-data-changed", this.generateCollapsedRowContent.bind(this));
          this.subscribe("row-init", this.initializeRow.bind(this));
          this.subscribe("row-layout", this.layoutRow.bind(this));
        }
      }
    }
    tableRedraw(force) {
      if (["fitColumns", "fitDataStretch"].indexOf(this.layoutMode()) === -1) {
        if (!force) {
          this.update();
        }
      }
    }
    initializeResponsivity() {
      var columns = [];
      this.mode = this.table.options.responsiveLayout;
      this.collapseFormatter = this.table.options.responsiveLayoutCollapseFormatter || this.formatCollapsedData;
      this.collapseStartOpen = this.table.options.responsiveLayoutCollapseStartOpen;
      this.hiddenColumns = [];
      if (this.collapseFormatter) {
        this.collapseFormatter = this.collapseFormatter.bind(this.table);
      }
      this.table.columnManager.columnsByIndex.forEach((column, i) => {
        if (column.modules.responsive) {
          if (column.modules.responsive.order && column.modules.responsive.visible) {
            column.modules.responsive.index = i;
            columns.push(column);
            if (!column.visible && this.mode === "collapse") {
              this.hiddenColumns.push(column);
            }
          }
        }
      });
      columns = columns.reverse();
      columns = columns.sort((a, b) => {
        var diff = b.modules.responsive.order - a.modules.responsive.order;
        return diff || b.modules.responsive.index - a.modules.responsive.index;
      });
      this.columns = columns;
      if (this.mode === "collapse") {
        this.generateCollapsedContent();
      }
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
    //define layout information
    initializeColumn(column) {
      var def = column.getDefinition();
      column.modules.responsive = { order: typeof def.responsive === "undefined" ? 1 : def.responsive, visible: def.visible === false ? false : true };
    }
    initializeRow(row) {
      var el;
      if (row.type !== "calc") {
        el = document.createElement("div");
        el.classList.add("tabulator-responsive-collapse");
        row.modules.responsiveLayout = {
          element: el,
          open: this.collapseStartOpen
        };
        if (!this.collapseStartOpen) {
          el.style.display = "none";
        }
      }
    }
    layoutRow(row) {
      var rowEl = row.getElement();
      if (row.modules.responsiveLayout) {
        rowEl.appendChild(row.modules.responsiveLayout.element);
        this.generateCollapsedRowContent(row);
      }
    }
    //update column visibility
    updateColumnVisibility(column, responsiveToggle) {
      if (!responsiveToggle && column.modules.responsive) {
        column.modules.responsive.visible = column.visible;
        this.initializeResponsivity();
      }
    }
    hideColumn(column) {
      var colCount = this.hiddenColumns.length;
      column.hide(false, true);
      if (this.mode === "collapse") {
        this.hiddenColumns.unshift(column);
        this.generateCollapsedContent();
        if (this.collapseHandleColumn && !colCount) {
          this.collapseHandleColumn.show();
        }
      }
    }
    showColumn(column) {
      var index;
      column.show(false, true);
      column.setWidth(column.getWidth());
      if (this.mode === "collapse") {
        index = this.hiddenColumns.indexOf(column);
        if (index > -1) {
          this.hiddenColumns.splice(index, 1);
        }
        this.generateCollapsedContent();
        if (this.collapseHandleColumn && !this.hiddenColumns.length) {
          this.collapseHandleColumn.hide();
        }
      }
    }
    //redraw columns to fit space
    update() {
      var working = true;
      while (working) {
        let width = this.table.modules.layout.getMode() == "fitColumns" ? this.table.columnManager.getFlexBaseWidth() : this.table.columnManager.getWidth();
        let diff = (this.table.options.headerVisible ? this.table.columnManager.element.clientWidth : this.table.element.clientWidth) - width;
        if (diff < 0) {
          let column = this.columns[this.index];
          if (column) {
            this.hideColumn(column);
            this.index++;
          } else {
            working = false;
          }
        } else {
          let column = this.columns[this.index - 1];
          if (column) {
            if (diff > 0) {
              if (diff >= column.getWidth()) {
                this.showColumn(column);
                this.index--;
              } else {
                working = false;
              }
            } else {
              working = false;
            }
          } else {
            working = false;
          }
        }
        if (!this.table.rowManager.activeRowsCount) {
          this.table.rowManager.renderEmptyScroll();
        }
      }
    }
    generateCollapsedContent() {
      var rows = this.table.rowManager.getDisplayRows();
      rows.forEach((row) => {
        this.generateCollapsedRowContent(row);
      });
    }
    generateCollapsedRowContent(row) {
      var el, contents;
      if (row.modules.responsiveLayout) {
        el = row.modules.responsiveLayout.element;
        while (el.firstChild) el.removeChild(el.firstChild);
        contents = this.collapseFormatter(this.generateCollapsedRowData(row));
        if (contents) {
          el.appendChild(contents);
        }
        row.calcHeight(true);
      }
    }
    generateCollapsedRowData(row) {
      var data = row.getData(), output = [], mockCellComponent;
      this.hiddenColumns.forEach((column) => {
        var value = column.getFieldValue(data);
        if (column.definition.title && column.field) {
          if (column.modules.format && this.table.options.responsiveLayoutCollapseUseFormatters) {
            let onRendered = function(callback) {
              callback();
            };
            mockCellComponent = {
              value: false,
              data: {},
              getValue: function() {
                return value;
              },
              getData: function() {
                return data;
              },
              getType: function() {
                return "cell";
              },
              getElement: function() {
                return document.createElement("div");
              },
              getRow: function() {
                return row.getComponent();
              },
              getColumn: function() {
                return column.getComponent();
              },
              getTable: () => {
                return this.table;
              }
            };
            output.push({
              field: column.field,
              title: column.definition.title,
              value: column.modules.format.formatter.call(this.table.modules.format, mockCellComponent, column.modules.format.params, onRendered)
            });
          } else {
            output.push({
              field: column.field,
              title: column.definition.title,
              value
            });
          }
        }
      });
      return output;
    }
    formatCollapsedData(data) {
      var list = document.createElement("table");
      data.forEach((item) => {
        var row = document.createElement("tr");
        var titleData = document.createElement("td");
        var valueData = document.createElement("td");
        var node_content;
        var titleHighlight = document.createElement("strong");
        titleData.appendChild(titleHighlight);
        this.modules.localize.bind("columns|" + item.field, function(text) {
          titleHighlight.innerHTML = text || item.title;
        });
        if (item.value instanceof Node) {
          node_content = document.createElement("div");
          node_content.appendChild(item.value);
          valueData.appendChild(node_content);
        } else {
          valueData.innerHTML = item.value;
        }
        row.appendChild(titleData);
        row.appendChild(valueData);
        list.appendChild(row);
      });
      return Object.keys(data).length ? list : "";
    }
  };

  // src/classes/tabulator/ResponsiveLayout/ResponsiveLayout.js
  var MyResponsiveLayout = class extends ResponsiveLayout {
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
      columns = columns.reverse();
      columns = columns.sort((a, b) => {
        var diff = b.modules.responsive.order - a.modules.responsive.order;
        return diff || b.modules.responsive.index - a.modules.responsive.index;
      });
      this.columns = columns;
      if (this.mode === "collapse") {
        this.generateCollapsedContent();
      }
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
        row.getCells().forEach(function(cell) {
          var el = cell.getElement();
          var title = cell.getColumn().getDefinition().title;
          if (!el) {
            return;
          }
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
        row.getCells().forEach(function(cell) {
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
        if (this.mode === "collapse" || this.mode === "flexCollapse") {
          el = document.createElement("div");
          el.classList.add("tabulator-responsive-collapse");
        }
        row.modules.responsiveLayout = {
          element: el,
          open: this.collapseStartOpen
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
          column.getCells().forEach(function(cell) {
            var el = cell.getElement();
            el.classList.remove("tabulator-responsive-flex-cell");
          });
        }
        if (this.collapseHandleColumn && !this.hiddenColumns.length) {
          this.collapseHandleColumn.hide();
        }
      }
    }
  };
  var ResponsiveLayout_default = MyResponsiveLayout;

  // node_modules/tabulator-tables/src/js/modules/SelectRow/extensions/formatters/rowSelection.js
  function rowSelection_default(cell, formatterParams, onRendered) {
    var checkbox = document.createElement("input");
    var blocked = false;
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", "Select Row");
    if (this.table.modExists("selectRow", true)) {
      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
      });
      if (typeof cell.getRow == "function") {
        var row = cell.getRow();
        if (row instanceof RowComponent) {
          checkbox.addEventListener("change", (e) => {
            if (this.table.options.selectableRowsRangeMode === "click") {
              if (!blocked) {
                row.toggleSelect();
              } else {
                blocked = false;
              }
            } else {
              row.toggleSelect();
            }
          });
          if (this.table.options.selectableRowsRangeMode === "click") {
            checkbox.addEventListener("click", (e) => {
              blocked = true;
              this.table.modules.selectRow.handleComplexRowClick(row._row, e);
            });
          }
          checkbox.checked = row.isSelected && row.isSelected();
          this.table.modules.selectRow.registerRowSelectCheckbox(row, checkbox);
        } else {
          checkbox = "";
        }
      } else {
        checkbox.addEventListener("change", (e) => {
          if (this.table.modules.selectRow.selectedRows.length) {
            this.table.deselectRow();
          } else {
            this.table.selectRow(formatterParams.rowRange);
          }
        });
        this.table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);
      }
    }
    return checkbox;
  }

  // node_modules/tabulator-tables/src/js/modules/SelectRow/extensions/extensions.js
  var extensions_default4 = {
    format: {
      formatters: {
        rowSelection: rowSelection_default
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/SelectRow/SelectRow.js
  var SelectRow = class extends Module {
    static moduleName = "selectRow";
    static moduleExtensions = extensions_default4;
    constructor(table) {
      super(table);
      this.selecting = false;
      this.lastClickedRow = false;
      this.selectPrev = [];
      this.selectedRows = [];
      this.headerCheckboxElement = null;
      this.registerTableOption("selectableRows", "highlight");
      this.registerTableOption("selectableRowsRangeMode", "drag");
      this.registerTableOption("selectableRowsRollingSelection", true);
      this.registerTableOption("selectableRowsPersistence", true);
      this.registerTableOption("selectableRowsCheck", function(data, row) {
        return true;
      });
      this.registerTableFunction("selectRow", this.selectRows.bind(this));
      this.registerTableFunction("deselectRow", this.deselectRows.bind(this));
      this.registerTableFunction("toggleSelectRow", this.toggleRow.bind(this));
      this.registerTableFunction("getSelectedRows", this.getSelectedRows.bind(this));
      this.registerTableFunction("getSelectedData", this.getSelectedData.bind(this));
      this.registerComponentFunction("row", "select", this.selectRows.bind(this));
      this.registerComponentFunction("row", "deselect", this.deselectRows.bind(this));
      this.registerComponentFunction("row", "toggleSelect", this.toggleRow.bind(this));
      this.registerComponentFunction("row", "isSelected", this.isRowSelected.bind(this));
    }
    initialize() {
      this.deprecatedOptionsCheck();
      if (this.table.options.selectableRows === "highlight" && this.table.options.selectableRange) {
        this.table.options.selectableRows = false;
      }
      if (this.table.options.selectableRows !== false) {
        this.subscribe("row-init", this.initializeRow.bind(this));
        this.subscribe("row-deleting", this.rowDeleted.bind(this));
        this.subscribe("rows-wipe", this.clearSelectionData.bind(this));
        this.subscribe("rows-retrieve", this.rowRetrieve.bind(this));
        if (this.table.options.selectableRows && !this.table.options.selectableRowsPersistence) {
          this.subscribe("data-refreshing", this.deselectRows.bind(this));
        }
      }
    }
    deprecatedOptionsCheck() {
    }
    rowRetrieve(type, prevValue) {
      return type === "selected" ? this.selectedRows : prevValue;
    }
    rowDeleted(row) {
      this._deselectRow(row, true);
    }
    clearSelectionData(silent) {
      var prevSelected = this.selectedRows.length;
      this.selecting = false;
      this.lastClickedRow = false;
      this.selectPrev = [];
      this.selectedRows = [];
      if (prevSelected && silent !== true) {
        this._rowSelectionChanged();
      }
    }
    initializeRow(row) {
      var self = this, selectable = self.checkRowSelectability(row), element = row.getElement();
      var endSelect = function() {
        setTimeout(function() {
          self.selecting = false;
        }, 50);
        document.body.removeEventListener("mouseup", endSelect);
      };
      row.modules.select = { selected: false };
      element.classList.toggle("tabulator-selectable", selectable);
      element.classList.toggle("tabulator-unselectable", !selectable);
      if (self.checkRowSelectability(row)) {
        if (self.table.options.selectableRows && self.table.options.selectableRows != "highlight") {
          if (self.table.options.selectableRowsRangeMode === "click") {
            element.addEventListener("click", this.handleComplexRowClick.bind(this, row));
          } else {
            element.addEventListener("click", function(e) {
              if (!self.table.modExists("edit") || !self.table.modules.edit.getCurrentCell()) {
                self.table._clearSelection();
              }
              if (!self.selecting) {
                self.toggleRow(row);
              }
            });
            element.addEventListener("mousedown", function(e) {
              if (e.shiftKey) {
                self.table._clearSelection();
                self.selecting = true;
                self.selectPrev = [];
                document.body.addEventListener("mouseup", endSelect);
                document.body.addEventListener("keyup", endSelect);
                self.toggleRow(row);
                return false;
              }
            });
            element.addEventListener("mouseenter", function(e) {
              if (self.selecting) {
                self.table._clearSelection();
                self.toggleRow(row);
                if (self.selectPrev[1] == row) {
                  self.toggleRow(self.selectPrev[0]);
                }
              }
            });
            element.addEventListener("mouseout", function(e) {
              if (self.selecting) {
                self.table._clearSelection();
                self.selectPrev.unshift(row);
              }
            });
          }
        }
      }
    }
    handleComplexRowClick(row, e) {
      if (e.shiftKey) {
        this.table._clearSelection();
        this.lastClickedRow = this.lastClickedRow || row;
        var lastClickedRowIdx = this.table.rowManager.getDisplayRowIndex(this.lastClickedRow);
        var rowIdx = this.table.rowManager.getDisplayRowIndex(row);
        var fromRowIdx = lastClickedRowIdx <= rowIdx ? lastClickedRowIdx : rowIdx;
        var toRowIdx = lastClickedRowIdx >= rowIdx ? lastClickedRowIdx : rowIdx;
        var rows = this.table.rowManager.getDisplayRows().slice(0);
        var toggledRows = rows.splice(fromRowIdx, toRowIdx - fromRowIdx + 1);
        if (e.ctrlKey || e.metaKey) {
          toggledRows.forEach((toggledRow) => {
            if (toggledRow !== this.lastClickedRow) {
              if (this.table.options.selectableRows !== true && !this.isRowSelected(row)) {
                if (this.selectedRows.length < this.table.options.selectableRows) {
                  this.toggleRow(toggledRow);
                }
              } else {
                this.toggleRow(toggledRow);
              }
            }
          });
          this.lastClickedRow = row;
        } else {
          this.deselectRows(void 0, true);
          if (this.table.options.selectableRows !== true) {
            if (toggledRows.length > this.table.options.selectableRows) {
              toggledRows = toggledRows.slice(0, this.table.options.selectableRows);
            }
          }
          this.selectRows(toggledRows);
        }
        this.table._clearSelection();
      } else if (e.ctrlKey || e.metaKey) {
        this.toggleRow(row);
        this.lastClickedRow = row;
      } else {
        this.deselectRows(void 0, true);
        this.selectRows(row);
        this.lastClickedRow = row;
      }
    }
    checkRowSelectability(row) {
      if (row && row.type === "row") {
        return this.table.options.selectableRowsCheck.call(this.table, row.getComponent());
      }
      return false;
    }
    //toggle row selection
    toggleRow(row) {
      if (this.checkRowSelectability(row)) {
        if (row.modules.select && row.modules.select.selected) {
          this._deselectRow(row);
        } else {
          this._selectRow(row);
        }
      }
    }
    //select a number of rows
    selectRows(rows) {
      var changes = [], rowMatch, change;
      switch (typeof rows) {
        case "undefined":
          rowMatch = this.table.rowManager.rows;
          break;
        case "number":
          rowMatch = this.table.rowManager.findRow(rows);
          break;
        case "string":
          rowMatch = this.table.rowManager.findRow(rows);
          if (!rowMatch) {
            rowMatch = this.table.rowManager.getRows(rows);
          }
          break;
        default:
          rowMatch = rows;
          break;
      }
      if (Array.isArray(rowMatch)) {
        if (rowMatch.length) {
          rowMatch.forEach((row) => {
            change = this._selectRow(row, true, true);
            if (change) {
              changes.push(change);
            }
          });
          this._rowSelectionChanged(false, changes);
        }
      } else {
        if (rowMatch) {
          this._selectRow(rowMatch, false, true);
        }
      }
    }
    //select an individual row
    _selectRow(rowInfo, silent, force) {
      if (!isNaN(this.table.options.selectableRows) && this.table.options.selectableRows !== true && !force) {
        if (this.selectedRows.length >= this.table.options.selectableRows) {
          if (this.table.options.selectableRowsRollingSelection) {
            this._deselectRow(this.selectedRows[0]);
          } else {
            return false;
          }
        }
      }
      var row = this.table.rowManager.findRow(rowInfo);
      if (row) {
        if (this.selectedRows.indexOf(row) == -1) {
          row.getElement().classList.add("tabulator-selected");
          if (!row.modules.select) {
            row.modules.select = {};
          }
          row.modules.select.selected = true;
          if (row.modules.select.checkboxEl) {
            row.modules.select.checkboxEl.checked = true;
          }
          this.selectedRows.push(row);
          if (this.table.options.dataTreeSelectPropagate) {
            this.childRowSelection(row, true);
          }
          this.dispatchExternal("rowSelected", row.getComponent());
          this._rowSelectionChanged(silent, row);
          return row;
        }
      } else {
        if (!silent) {
          console.warn("Selection Error - No such row found, ignoring selection:" + rowInfo);
        }
      }
    }
    isRowSelected(row) {
      return this.selectedRows.indexOf(row) !== -1;
    }
    //deselect a number of rows
    deselectRows(rows, silent) {
      var changes = [], rowMatch, change;
      switch (typeof rows) {
        case "undefined":
          rowMatch = Object.assign([], this.selectedRows);
          break;
        case "number":
          rowMatch = this.table.rowManager.findRow(rows);
          break;
        case "string":
          rowMatch = this.table.rowManager.findRow(rows);
          if (!rowMatch) {
            rowMatch = this.table.rowManager.getRows(rows);
          }
          break;
        default:
          rowMatch = rows;
          break;
      }
      if (Array.isArray(rowMatch)) {
        if (rowMatch.length) {
          rowMatch.forEach((row) => {
            change = this._deselectRow(row, true, true);
            if (change) {
              changes.push(change);
            }
          });
          this._rowSelectionChanged(silent, [], changes);
        }
      } else {
        if (rowMatch) {
          this._deselectRow(rowMatch, silent, true);
        }
      }
    }
    //deselect an individual row
    _deselectRow(rowInfo, silent) {
      var self = this, row = self.table.rowManager.findRow(rowInfo), index, element;
      if (row) {
        index = self.selectedRows.findIndex(function(selectedRow) {
          return selectedRow == row;
        });
        if (index > -1) {
          element = row.getElement();
          if (element) {
            element.classList.remove("tabulator-selected");
          }
          if (!row.modules.select) {
            row.modules.select = {};
          }
          row.modules.select.selected = false;
          if (row.modules.select.checkboxEl) {
            row.modules.select.checkboxEl.checked = false;
          }
          self.selectedRows.splice(index, 1);
          if (this.table.options.dataTreeSelectPropagate) {
            this.childRowSelection(row, false);
          }
          this.dispatchExternal("rowDeselected", row.getComponent());
          self._rowSelectionChanged(silent, void 0, row);
          return row;
        }
      } else {
        if (!silent) {
          console.warn("Deselection Error - No such row found, ignoring selection:" + rowInfo);
        }
      }
    }
    getSelectedData() {
      var data = [];
      this.selectedRows.forEach(function(row) {
        data.push(row.getData());
      });
      return data;
    }
    getSelectedRows() {
      var rows = [];
      this.selectedRows.forEach(function(row) {
        rows.push(row.getComponent());
      });
      return rows;
    }
    _rowSelectionChanged(silent, selected = [], deselected = []) {
      if (this.headerCheckboxElement) {
        if (this.selectedRows.length === 0) {
          this.headerCheckboxElement.checked = false;
          this.headerCheckboxElement.indeterminate = false;
        } else if (this.table.rowManager.rows.length === this.selectedRows.length) {
          this.headerCheckboxElement.checked = true;
          this.headerCheckboxElement.indeterminate = false;
        } else {
          this.headerCheckboxElement.indeterminate = true;
          this.headerCheckboxElement.checked = false;
        }
      }
      if (!silent) {
        if (!Array.isArray(selected)) {
          selected = [selected];
        }
        selected = selected.map((row) => row.getComponent());
        if (!Array.isArray(deselected)) {
          deselected = [deselected];
        }
        deselected = deselected.map((row) => row.getComponent());
        this.dispatchExternal("rowSelectionChanged", this.getSelectedData(), this.getSelectedRows(), selected, deselected);
      }
    }
    registerRowSelectCheckbox(row, element) {
      if (!row._row.modules.select) {
        row._row.modules.select = {};
      }
      row._row.modules.select.checkboxEl = element;
    }
    registerHeaderSelectCheckbox(element) {
      this.headerCheckboxElement = element;
    }
    childRowSelection(row, select) {
      var children = this.table.modules.dataTree.getChildren(row, true, true);
      if (select) {
        for (let child of children) {
          this._selectRow(child, true);
        }
      } else {
        for (let child of children) {
          this._deselectRow(child, true);
        }
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/number.js
  function number_default2(a, b, aRow, bRow, column, dir, params) {
    var alignEmptyValues = params.alignEmptyValues;
    var decimal = params.decimalSeparator;
    var thousand = params.thousandSeparator;
    var emptyAlign = 0;
    a = String(a);
    b = String(b);
    if (thousand) {
      a = a.split(thousand).join("");
      b = b.split(thousand).join("");
    }
    if (decimal) {
      a = a.split(decimal).join(".");
      b = b.split(decimal).join(".");
    }
    a = parseFloat(a);
    b = parseFloat(b);
    if (isNaN(a)) {
      emptyAlign = isNaN(b) ? 0 : -1;
    } else if (isNaN(b)) {
      emptyAlign = 1;
    } else {
      return a - b;
    }
    if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
      emptyAlign *= -1;
    }
    return emptyAlign;
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/string.js
  function string_default(a, b, aRow, bRow, column, dir, params) {
    var alignEmptyValues = params.alignEmptyValues;
    var emptyAlign = 0;
    var locale;
    if (!a) {
      emptyAlign = !b ? 0 : -1;
    } else if (!b) {
      emptyAlign = 1;
    } else {
      switch (typeof params.locale) {
        case "boolean":
          if (params.locale) {
            locale = this.langLocale();
          }
          break;
        case "string":
          locale = params.locale;
          break;
      }
      return String(a).toLowerCase().localeCompare(String(b).toLowerCase(), locale);
    }
    if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
      emptyAlign *= -1;
    }
    return emptyAlign;
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/datetime.js
  function datetime_default3(a, b, aRow, bRow, column, dir, params) {
    var DT = window.DateTime || luxon.DateTime;
    var format = params.format || "dd/MM/yyyy HH:mm:ss", alignEmptyValues = params.alignEmptyValues, emptyAlign = 0;
    if (typeof DT != "undefined") {
      if (!DT.isDateTime(a)) {
        if (format === "iso") {
          a = DT.fromISO(String(a));
        } else {
          a = DT.fromFormat(String(a), format);
        }
      }
      if (!DT.isDateTime(b)) {
        if (format === "iso") {
          b = DT.fromISO(String(b));
        } else {
          b = DT.fromFormat(String(b), format);
        }
      }
      if (!a.isValid) {
        emptyAlign = !b.isValid ? 0 : -1;
      } else if (!b.isValid) {
        emptyAlign = 1;
      } else {
        return a - b;
      }
      if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
        emptyAlign *= -1;
      }
      return emptyAlign;
    } else {
      console.error("Sort Error - 'datetime' sorter is dependant on luxon.js");
    }
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/date.js
  function date_default2(a, b, aRow, bRow, column, dir, params) {
    if (!params.format) {
      params.format = "dd/MM/yyyy";
    }
    return datetime_default3.call(this, a, b, aRow, bRow, column, dir, params);
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/time.js
  function time_default2(a, b, aRow, bRow, column, dir, params) {
    if (!params.format) {
      params.format = "HH:mm";
    }
    return datetime_default3.call(this, a, b, aRow, bRow, column, dir, params);
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/boolean.js
  function boolean_default(a, b, aRow, bRow, column, dir, params) {
    var el1 = a === true || a === "true" || a === "True" || a === 1 ? 1 : 0;
    var el2 = b === true || b === "true" || b === "True" || b === 1 ? 1 : 0;
    return el1 - el2;
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/array.js
  function array_default2(a, b, aRow, bRow, column, dir, params) {
    var type = params.type || "length", alignEmptyValues = params.alignEmptyValues, emptyAlign = 0;
    function calc(value) {
      var result;
      switch (type) {
        case "length":
          result = value.length;
          break;
        case "sum":
          result = value.reduce(function(c, d) {
            return c + d;
          });
          break;
        case "max":
          result = Math.max.apply(null, value);
          break;
        case "min":
          result = Math.min.apply(null, value);
          break;
        case "avg":
          result = value.reduce(function(c, d) {
            return c + d;
          }) / value.length;
          break;
      }
      return result;
    }
    if (!Array.isArray(a)) {
      emptyAlign = !Array.isArray(b) ? 0 : -1;
    } else if (!Array.isArray(b)) {
      emptyAlign = 1;
    } else {
      return calc(b) - calc(a);
    }
    if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
      emptyAlign *= -1;
    }
    return emptyAlign;
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/exists.js
  function exists_default(a, b, aRow, bRow, column, dir, params) {
    var el1 = typeof a == "undefined" ? 0 : 1;
    var el2 = typeof b == "undefined" ? 0 : 1;
    return el1 - el2;
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters/alphanum.js
  function alphanum_default(as, bs, aRow, bRow, column, dir, params) {
    var a, b, a1, b1, i = 0, L, rx = /(\d+)|(\D+)/g, rd = /\d/;
    var alignEmptyValues = params.alignEmptyValues;
    var emptyAlign = 0;
    if (!as && as !== 0) {
      emptyAlign = !bs && bs !== 0 ? 0 : -1;
    } else if (!bs && bs !== 0) {
      emptyAlign = 1;
    } else {
      if (isFinite(as) && isFinite(bs)) return as - bs;
      a = String(as).toLowerCase();
      b = String(bs).toLowerCase();
      if (a === b) return 0;
      if (!(rd.test(a) && rd.test(b))) return a > b ? 1 : -1;
      a = a.match(rx);
      b = b.match(rx);
      L = a.length > b.length ? b.length : a.length;
      while (i < L) {
        a1 = a[i];
        b1 = b[i++];
        if (a1 !== b1) {
          if (isFinite(a1) && isFinite(b1)) {
            if (a1.charAt(0) === "0") a1 = "." + a1;
            if (b1.charAt(0) === "0") b1 = "." + b1;
            return a1 - b1;
          } else return a1 > b1 ? 1 : -1;
        }
      }
      return a.length > b.length;
    }
    if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
      emptyAlign *= -1;
    }
    return emptyAlign;
  }

  // node_modules/tabulator-tables/src/js/modules/Sort/defaults/sorters.js
  var sorters_default = {
    number: number_default2,
    string: string_default,
    date: date_default2,
    time: time_default2,
    datetime: datetime_default3,
    boolean: boolean_default,
    array: array_default2,
    exists: exists_default,
    alphanum: alphanum_default
  };

  // node_modules/tabulator-tables/src/js/modules/Sort/Sort.js
  var Sort = class _Sort extends Module {
    static moduleName = "sort";
    //load defaults
    static sorters = sorters_default;
    constructor(table) {
      super(table);
      this.sortList = [];
      this.changed = false;
      this.registerTableOption("sortMode", "local");
      this.registerTableOption("initialSort", false);
      this.registerTableOption("columnHeaderSortMulti", true);
      this.registerTableOption("sortOrderReverse", false);
      this.registerTableOption("headerSortElement", "<div class='tabulator-arrow'></div>");
      this.registerTableOption("headerSortClickElement", "header");
      this.registerColumnOption("sorter");
      this.registerColumnOption("sorterParams");
      this.registerColumnOption("headerSort", true);
      this.registerColumnOption("headerSortStartingDir");
      this.registerColumnOption("headerSortTristate");
    }
    initialize() {
      this.subscribe("column-layout", this.initializeColumn.bind(this));
      this.subscribe("table-built", this.tableBuilt.bind(this));
      this.registerDataHandler(this.sort.bind(this), 20);
      this.registerTableFunction("setSort", this.userSetSort.bind(this));
      this.registerTableFunction("getSorters", this.getSort.bind(this));
      this.registerTableFunction("clearSort", this.clearSort.bind(this));
      if (this.table.options.sortMode === "remote") {
        this.subscribe("data-params", this.remoteSortParams.bind(this));
      }
    }
    tableBuilt() {
      if (this.table.options.initialSort) {
        this.setSort(this.table.options.initialSort);
      }
    }
    remoteSortParams(data, config, silent, params) {
      var sorters = this.getSort();
      sorters.forEach((item) => {
        delete item.column;
      });
      params.sort = sorters;
      return params;
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    userSetSort(sortList, dir) {
      this.setSort(sortList, dir);
      this.refreshSort();
    }
    clearSort() {
      this.clear();
      this.refreshSort();
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    //initialize column header for sorting
    initializeColumn(column) {
      var sorter = false, colEl, arrowEl;
      switch (typeof column.definition.sorter) {
        case "string":
          if (_Sort.sorters[column.definition.sorter]) {
            sorter = _Sort.sorters[column.definition.sorter];
          } else {
            console.warn("Sort Error - No such sorter found: ", column.definition.sorter);
          }
          break;
        case "function":
          sorter = column.definition.sorter;
          break;
      }
      column.modules.sort = {
        sorter,
        dir: "none",
        params: column.definition.sorterParams || {},
        startingDir: column.definition.headerSortStartingDir || "asc",
        tristate: column.definition.headerSortTristate
      };
      if (column.definition.headerSort !== false) {
        colEl = column.getElement();
        colEl.classList.add("tabulator-sortable");
        arrowEl = document.createElement("div");
        arrowEl.classList.add("tabulator-col-sorter");
        switch (this.table.options.headerSortClickElement) {
          case "icon":
            arrowEl.classList.add("tabulator-col-sorter-element");
            break;
          case "header":
            colEl.classList.add("tabulator-col-sorter-element");
            break;
          default:
            colEl.classList.add("tabulator-col-sorter-element");
            break;
        }
        switch (this.table.options.headerSortElement) {
          case "function":
            break;
          case "object":
            arrowEl.appendChild(this.table.options.headerSortElement);
            break;
          default:
            arrowEl.innerHTML = this.table.options.headerSortElement;
        }
        column.titleHolderElement.appendChild(arrowEl);
        column.modules.sort.element = arrowEl;
        this.setColumnHeaderSortIcon(column, "none");
        if (this.table.options.headerSortClickElement === "icon") {
          arrowEl.addEventListener("mousedown", (e) => {
            e.stopPropagation();
          });
        }
        (this.table.options.headerSortClickElement === "icon" ? arrowEl : colEl).addEventListener("click", (e) => {
          var dir = "", sorters = [], match = false;
          if (column.modules.sort) {
            if (column.modules.sort.tristate) {
              if (column.modules.sort.dir == "none") {
                dir = column.modules.sort.startingDir;
              } else {
                if (column.modules.sort.dir == column.modules.sort.startingDir) {
                  dir = column.modules.sort.dir == "asc" ? "desc" : "asc";
                } else {
                  dir = "none";
                }
              }
            } else {
              switch (column.modules.sort.dir) {
                case "asc":
                  dir = "desc";
                  break;
                case "desc":
                  dir = "asc";
                  break;
                default:
                  dir = column.modules.sort.startingDir;
              }
            }
            if (this.table.options.columnHeaderSortMulti && (e.shiftKey || e.ctrlKey)) {
              sorters = this.getSort();
              match = sorters.findIndex((sorter2) => {
                return sorter2.field === column.getField();
              });
              if (match > -1) {
                sorters[match].dir = dir;
                match = sorters.splice(match, 1)[0];
                if (dir != "none") {
                  sorters.push(match);
                }
              } else {
                if (dir != "none") {
                  sorters.push({ column, dir });
                }
              }
              this.setSort(sorters);
            } else {
              if (dir == "none") {
                this.clear();
              } else {
                this.setSort(column, dir);
              }
            }
            this.refreshSort();
          }
        });
      }
    }
    refreshSort() {
      if (this.table.options.sortMode === "remote") {
        this.reloadData(null, false, false);
      } else {
        this.refreshData(true);
      }
    }
    //check if the sorters have changed since last use
    hasChanged() {
      var changed = this.changed;
      this.changed = false;
      return changed;
    }
    //return current sorters
    getSort() {
      var self = this, sorters = [];
      self.sortList.forEach(function(item) {
        if (item.column) {
          sorters.push({ column: item.column.getComponent(), field: item.column.getField(), dir: item.dir });
        }
      });
      return sorters;
    }
    //change sort list and trigger sort
    setSort(sortList, dir) {
      var self = this, newSortList = [];
      if (!Array.isArray(sortList)) {
        sortList = [{ column: sortList, dir }];
      }
      sortList.forEach(function(item) {
        var column;
        column = self.table.columnManager.findColumn(item.column);
        if (column) {
          item.column = column;
          newSortList.push(item);
          self.changed = true;
        } else {
          console.warn("Sort Warning - Sort field does not exist and is being ignored: ", item.column);
        }
      });
      self.sortList = newSortList;
      this.dispatch("sort-changed");
    }
    //clear sorters
    clear() {
      this.setSort([]);
    }
    //find appropriate sorter for column
    findSorter(column) {
      var row = this.table.rowManager.activeRows[0], sorter = "string", field, value;
      if (row) {
        row = row.getData();
        field = column.getField();
        if (field) {
          value = column.getFieldValue(row);
          switch (typeof value) {
            case "undefined":
              sorter = "string";
              break;
            case "boolean":
              sorter = "boolean";
              break;
            default:
              if (!isNaN(value) && value !== "") {
                sorter = "number";
              } else {
                if (value.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i)) {
                  sorter = "alphanum";
                }
              }
              break;
          }
        }
      }
      return _Sort.sorters[sorter];
    }
    //work through sort list sorting data
    sort(data, sortOnly) {
      var self = this, sortList = this.table.options.sortOrderReverse ? self.sortList.slice().reverse() : self.sortList, sortListActual = [], rowComponents = [];
      if (this.subscribedExternal("dataSorting")) {
        this.dispatchExternal("dataSorting", self.getSort());
      }
      if (!sortOnly) {
        self.clearColumnHeaders();
      }
      if (this.table.options.sortMode !== "remote") {
        sortList.forEach(function(item, i) {
          var sortObj;
          if (item.column) {
            sortObj = item.column.modules.sort;
            if (sortObj) {
              if (!sortObj.sorter) {
                sortObj.sorter = self.findSorter(item.column);
              }
              item.params = typeof sortObj.params === "function" ? sortObj.params(item.column.getComponent(), item.dir) : sortObj.params;
              sortListActual.push(item);
            }
            if (!sortOnly) {
              self.setColumnHeader(item.column, item.dir);
            }
          }
        });
        if (sortListActual.length) {
          self._sortItems(data, sortListActual);
        }
      } else if (!sortOnly) {
        sortList.forEach(function(item, i) {
          self.setColumnHeader(item.column, item.dir);
        });
      }
      if (this.subscribedExternal("dataSorted")) {
        data.forEach((row) => {
          rowComponents.push(row.getComponent());
        });
        this.dispatchExternal("dataSorted", self.getSort(), rowComponents);
      }
      return data;
    }
    //clear sort arrows on columns
    clearColumnHeaders() {
      this.table.columnManager.getRealColumns().forEach((column) => {
        if (column.modules.sort) {
          column.modules.sort.dir = "none";
          column.getElement().setAttribute("aria-sort", "none");
          this.setColumnHeaderSortIcon(column, "none");
        }
      });
    }
    //set the column header sort direction
    setColumnHeader(column, dir) {
      column.modules.sort.dir = dir;
      column.getElement().setAttribute("aria-sort", dir === "asc" ? "ascending" : "descending");
      this.setColumnHeaderSortIcon(column, dir);
    }
    setColumnHeaderSortIcon(column, dir) {
      var sortEl = column.modules.sort.element, arrowEl;
      if (column.definition.headerSort && typeof this.table.options.headerSortElement === "function") {
        while (sortEl.firstChild) sortEl.removeChild(sortEl.firstChild);
        arrowEl = this.table.options.headerSortElement.call(this.table, column.getComponent(), dir);
        if (typeof arrowEl === "object") {
          sortEl.appendChild(arrowEl);
        } else {
          sortEl.innerHTML = arrowEl;
        }
      }
    }
    //sort each item in sort list
    _sortItems(data, sortList) {
      var sorterCount = sortList.length - 1;
      data.sort((a, b) => {
        var result;
        for (var i = sorterCount; i >= 0; i--) {
          let sortItem = sortList[i];
          result = this._sortRow(a, b, sortItem.column, sortItem.dir, sortItem.params);
          if (result !== 0) {
            break;
          }
        }
        return result;
      });
    }
    //process individual rows for a sort function on active data
    _sortRow(a, b, column, dir, params) {
      var el1Comp, el2Comp;
      var el1 = dir == "asc" ? a : b;
      var el2 = dir == "asc" ? b : a;
      a = column.getFieldValue(el1.getData());
      b = column.getFieldValue(el2.getData());
      a = typeof a !== "undefined" ? a : "";
      b = typeof b !== "undefined" ? b : "";
      el1Comp = el1.getComponent();
      el2Comp = el2.getComponent();
      return column.modules.sort.sorter.call(this, a, b, el1Comp, el2Comp, column.getComponent(), dir, params);
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Tooltip/Tooltip.js
  var Tooltip = class extends Module {
    static moduleName = "tooltip";
    constructor(table) {
      super(table);
      this.tooltipSubscriber = null, this.headerSubscriber = null, this.timeout = null;
      this.popupInstance = null;
      this.registerTableOption("tooltipDelay", 300);
      this.registerColumnOption("tooltip");
      this.registerColumnOption("headerTooltip");
    }
    initialize() {
      this.deprecatedOptionsCheck();
      this.subscribe("column-init", this.initializeColumn.bind(this));
    }
    deprecatedOptionsCheck() {
    }
    initializeColumn(column) {
      if (column.definition.headerTooltip && !this.headerSubscriber) {
        this.headerSubscriber = true;
        this.subscribe("column-mousemove", this.mousemoveCheck.bind(this, "headerTooltip"));
        this.subscribe("column-mouseout", this.mouseoutCheck.bind(this, "headerTooltip"));
      }
      if (column.definition.tooltip && !this.tooltipSubscriber) {
        this.tooltipSubscriber = true;
        this.subscribe("cell-mousemove", this.mousemoveCheck.bind(this, "tooltip"));
        this.subscribe("cell-mouseout", this.mouseoutCheck.bind(this, "tooltip"));
      }
    }
    mousemoveCheck(action, e, component) {
      var tooltip = action === "tooltip" ? component.column.definition.tooltip : component.definition.headerTooltip;
      if (tooltip) {
        this.clearPopup();
        this.timeout = setTimeout(this.loadTooltip.bind(this, e, component, tooltip), this.table.options.tooltipDelay);
      }
    }
    mouseoutCheck(action, e, component) {
      if (!this.popupInstance) {
        this.clearPopup();
      }
    }
    clearPopup(action, e, component) {
      clearTimeout(this.timeout);
      this.timeout = null;
      if (this.popupInstance) {
        this.popupInstance.hide();
      }
    }
    loadTooltip(e, component, tooltip) {
      var contentsEl, renderedCallback, coords;
      function onRendered(callback) {
        renderedCallback = callback;
      }
      if (typeof tooltip === "function") {
        tooltip = tooltip(e, component.getComponent(), onRendered);
      }
      if (tooltip instanceof HTMLElement) {
        contentsEl = tooltip;
      } else {
        contentsEl = document.createElement("div");
        if (tooltip === true) {
          if (component instanceof Cell) {
            tooltip = component.value;
          } else {
            if (component.definition.field) {
              this.langBind("columns|" + component.definition.field, (value) => {
                contentsEl.innerHTML = tooltip = value || component.definition.title;
              });
            } else {
              tooltip = component.definition.title;
            }
          }
        }
        contentsEl.innerHTML = tooltip;
      }
      if (tooltip || tooltip === 0 || tooltip === false) {
        contentsEl.classList.add("tabulator-tooltip");
        contentsEl.addEventListener("mousemove", (e2) => e2.preventDefault());
        this.popupInstance = this.popup(contentsEl);
        if (typeof renderedCallback === "function") {
          this.popupInstance.renderCallback(renderedCallback);
        }
        coords = this.popupInstance.containerEventCoords(e);
        this.popupInstance.show(coords.x + 15, coords.y + 15).hideOnBlur(() => {
          this.dispatchExternal("TooltipClosed", component.getComponent());
          this.popupInstance = null;
        });
        this.dispatchExternal("TooltipOpened", component.getComponent());
      }
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Validate/defaults/validators.js
  var validators_default = {
    //is integer
    integer: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      value = Number(value);
      return !isNaN(value) && isFinite(value) && Math.floor(value) === value;
    },
    //is float
    float: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      value = Number(value);
      return !isNaN(value) && isFinite(value) && value % 1 !== 0;
    },
    //must be a number
    numeric: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      return !isNaN(value);
    },
    //must be a string
    string: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      return isNaN(value);
    },
    //must be alphanumeric
    alphanumeric: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      var reg = new RegExp(/^[a-z0-9]+$/i);
      return reg.test(value);
    },
    //maximum value
    max: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      return parseFloat(value) <= parameters;
    },
    //minimum value
    min: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      return parseFloat(value) >= parameters;
    },
    //starts with  value
    starts: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      return String(value).toLowerCase().startsWith(String(parameters).toLowerCase());
    },
    //ends with  value
    ends: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      return String(value).toLowerCase().endsWith(String(parameters).toLowerCase());
    },
    //minimum string length
    minLength: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      return String(value).length >= parameters;
    },
    //maximum string length
    maxLength: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      return String(value).length <= parameters;
    },
    //in provided value list
    in: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      if (typeof parameters == "string") {
        parameters = parameters.split("|");
      }
      return parameters.indexOf(value) > -1;
    },
    //must match provided regex
    regex: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      var reg = new RegExp(parameters);
      return reg.test(value);
    },
    //value must be unique in this column
    unique: function(cell, value, parameters) {
      if (value === "" || value === null || typeof value === "undefined") {
        return true;
      }
      var unique = true;
      var cellData = cell.getData();
      var column = cell.getColumn()._getSelf();
      this.table.rowManager.rows.forEach(function(row) {
        var data = row.getData();
        if (data !== cellData) {
          if (value == column.getFieldValue(data)) {
            unique = false;
          }
        }
      });
      return unique;
    },
    //must have a value
    required: function(cell, value, parameters) {
      return value !== "" && value !== null && typeof value !== "undefined";
    }
  };

  // node_modules/tabulator-tables/src/js/modules/Validate/Validate.js
  var Validate = class _Validate extends Module {
    static moduleName = "validate";
    //load defaults
    static validators = validators_default;
    constructor(table) {
      super(table);
      this.invalidCells = [];
      this.registerTableOption("validationMode", "blocking");
      this.registerColumnOption("validator");
      this.registerTableFunction("getInvalidCells", this.getInvalidCells.bind(this));
      this.registerTableFunction("clearCellValidation", this.userClearCellValidation.bind(this));
      this.registerTableFunction("validate", this.userValidate.bind(this));
      this.registerComponentFunction("cell", "isValid", this.cellIsValid.bind(this));
      this.registerComponentFunction("cell", "clearValidation", this.clearValidation.bind(this));
      this.registerComponentFunction("cell", "validate", this.cellValidate.bind(this));
      this.registerComponentFunction("column", "validate", this.columnValidate.bind(this));
      this.registerComponentFunction("row", "validate", this.rowValidate.bind(this));
    }
    initialize() {
      this.subscribe("cell-delete", this.clearValidation.bind(this));
      this.subscribe("column-layout", this.initializeColumnCheck.bind(this));
      this.subscribe("edit-success", this.editValidate.bind(this));
      this.subscribe("edit-editor-clear", this.editorClear.bind(this));
      this.subscribe("edit-edited-clear", this.editedClear.bind(this));
    }
    ///////////////////////////////////
    ///////// Event Handling //////////
    ///////////////////////////////////
    editValidate(cell, value, previousValue) {
      var valid = this.table.options.validationMode !== "manual" ? this.validate(cell.column.modules.validate, cell, value) : true;
      if (valid !== true) {
        setTimeout(() => {
          cell.getElement().classList.add("tabulator-validation-fail");
          this.dispatchExternal("validationFailed", cell.getComponent(), value, valid);
        });
      }
      return valid;
    }
    editorClear(cell, cancelled) {
      if (cancelled) {
        if (cell.column.modules.validate) {
          this.cellValidate(cell);
        }
      }
      cell.getElement().classList.remove("tabulator-validation-fail");
    }
    editedClear(cell) {
      if (cell.modules.validate) {
        cell.modules.validate.invalid = false;
      }
    }
    ///////////////////////////////////
    ////////// Cell Functions /////////
    ///////////////////////////////////
    cellIsValid(cell) {
      return cell.modules.validate ? cell.modules.validate.invalid || true : true;
    }
    cellValidate(cell) {
      return this.validate(cell.column.modules.validate, cell, cell.getValue());
    }
    ///////////////////////////////////
    ///////// Column Functions ////////
    ///////////////////////////////////
    columnValidate(column) {
      var invalid = [];
      column.cells.forEach((cell) => {
        if (this.cellValidate(cell) !== true) {
          invalid.push(cell.getComponent());
        }
      });
      return invalid.length ? invalid : true;
    }
    ///////////////////////////////////
    ////////// Row Functions //////////
    ///////////////////////////////////
    rowValidate(row) {
      var invalid = [];
      row.cells.forEach((cell) => {
        if (this.cellValidate(cell) !== true) {
          invalid.push(cell.getComponent());
        }
      });
      return invalid.length ? invalid : true;
    }
    ///////////////////////////////////
    ///////// Table Functions /////////
    ///////////////////////////////////
    userClearCellValidation(cells) {
      if (!cells) {
        cells = this.getInvalidCells();
      }
      if (!Array.isArray(cells)) {
        cells = [cells];
      }
      cells.forEach((cell) => {
        this.clearValidation(cell._getSelf());
      });
    }
    userValidate(cells) {
      var output = [];
      this.table.rowManager.rows.forEach((row) => {
        row = row.getComponent();
        var valid = row.validate();
        if (valid !== true) {
          output = output.concat(valid);
        }
      });
      return output.length ? output : true;
    }
    ///////////////////////////////////
    ///////// Internal Logic //////////
    ///////////////////////////////////
    initializeColumnCheck(column) {
      if (typeof column.definition.validator !== "undefined") {
        this.initializeColumn(column);
      }
    }
    //validate
    initializeColumn(column) {
      var self = this, config = [], validator;
      if (column.definition.validator) {
        if (Array.isArray(column.definition.validator)) {
          column.definition.validator.forEach((item) => {
            validator = self._extractValidator(item);
            if (validator) {
              config.push(validator);
            }
          });
        } else {
          validator = this._extractValidator(column.definition.validator);
          if (validator) {
            config.push(validator);
          }
        }
        column.modules.validate = config.length ? config : false;
      }
    }
    _extractValidator(value) {
      var type, params, pos;
      switch (typeof value) {
        case "string":
          pos = value.indexOf(":");
          if (pos > -1) {
            type = value.substring(0, pos);
            params = value.substring(pos + 1);
          } else {
            type = value;
          }
          return this._buildValidator(type, params);
        case "function":
          return this._buildValidator(value);
        case "object":
          return this._buildValidator(value.type, value.parameters);
      }
    }
    _buildValidator(type, params) {
      var func = typeof type == "function" ? type : _Validate.validators[type];
      if (!func) {
        console.warn("Validator Setup Error - No matching validator found:", type);
        return false;
      } else {
        return {
          type: typeof type == "function" ? "function" : type,
          func,
          params
        };
      }
    }
    validate(validators, cell, value) {
      var self = this, failedValidators = [], invalidIndex = this.invalidCells.indexOf(cell);
      if (validators) {
        validators.forEach((item) => {
          if (!item.func.call(self, cell.getComponent(), value, item.params)) {
            failedValidators.push({
              type: item.type,
              parameters: item.params
            });
          }
        });
      }
      if (!cell.modules.validate) {
        cell.modules.validate = {};
      }
      if (!failedValidators.length) {
        cell.modules.validate.invalid = false;
        cell.getElement().classList.remove("tabulator-validation-fail");
        if (invalidIndex > -1) {
          this.invalidCells.splice(invalidIndex, 1);
        }
      } else {
        cell.modules.validate.invalid = failedValidators;
        if (this.table.options.validationMode !== "manual") {
          cell.getElement().classList.add("tabulator-validation-fail");
        }
        if (invalidIndex == -1) {
          this.invalidCells.push(cell);
        }
      }
      return failedValidators.length ? failedValidators : true;
    }
    getInvalidCells() {
      var output = [];
      this.invalidCells.forEach((cell) => {
        output.push(cell.getComponent());
      });
      return output;
    }
    clearValidation(cell) {
      var invalidIndex;
      if (cell.modules.validate && cell.modules.validate.invalid) {
        cell.getElement().classList.remove("tabulator-validation-fail");
        cell.modules.validate.invalid = false;
        invalidIndex = this.invalidCells.indexOf(cell);
        if (invalidIndex > -1) {
          this.invalidCells.splice(invalidIndex, 1);
        }
      }
    }
  };

  // src/classes/tabulator/custom-editors.js
  var custom_editors_exports = {};
  __export(custom_editors_exports, {
    customInput: () => customInput_default,
    external: () => external_default,
    money: () => money_default2
  });

  // src/utils/getGlobalFn.js
  var getGlobalFn_default = (fn) => fn.split(".").reduce((r, p) => r[p], window);

  // src/utils/safeGlobalFn.js
  var safeGlobalFn_default = (fn) => {
    if (typeof fn == "function") {
      return fn;
    }
    if (typeof fn == "object" && fn["__fn"]) {
      return getGlobalFn_default(fn["__fn"]);
    }
    return getGlobalFn_default(fn);
  };

  // src/utils/ce.js
  var ce_default = (tagName) => {
    return document.createElement(tagName);
  };

  // src/classes/tabulator/Edit/editors/external.js
  var counter = 0;
  function external_default(cell, onRendered, success, cancel, editorParams) {
    counter++;
    let tagType = editorParams.tagType || "input";
    let input = ce_default(tagType);
    if (tagType === "input") {
      input.setAttribute("type", "text");
    }
    input.style.cssText = `padding:4px;width:100%;box-sizing:border-box`;
    input.setAttribute("id", "tabulator-editor-" + counter);
    input.value = cell.getValue() || "";
    input.dataset.prevValue = input.value;
    let editor = input;
    if (editorParams.element) {
      let element = ce_default(editorParams.element);
      let elementConfig = editorParams.elementConfig || "{}";
      if (typeof elementConfig === "object") {
        elementConfig = JSON.stringify(elementConfig);
      }
      element.dataset.config = elementConfig;
      element.appendChild(input);
      editor = element;
    }
    onRendered(function() {
      editor.style.height = "100%";
      input.style.height = "100%";
      let el = editorParams.idSelector ? "#" + editor.getAttribute("id") : editor;
      let opts = editorParams.options || {};
      let inst = editorParams.function ? safeGlobalFn_default(editorParams.function)(el, opts) : null;
      if (editorParams.initCallback) {
        safeGlobalFn_default(editorParams.initCallback)(editor, inst, cell);
      }
      setTimeout(() => {
        input.focus({ preventScroll: true });
      }, 1);
    });
    function successFunc() {
      const inputValue = editorParams.rawInput ? input.value.trim() : editor.value.trim();
      if (inputValue == input.dataset.prevValue) {
        cancel();
        if (editorParams.cancelCallback) {
          safeGlobalFn_default(editorParams.cancelCallback)(input, cell);
        }
        return;
      }
      success(inputValue);
      if (editorParams.successCallback) {
        safeGlobalFn_default(editorParams.successCallback)(input, inputValue, cell);
      }
    }
    if (editorParams.inputCallback) {
      const inputCallback = safeGlobalFn_default(editorParams.inputCallback);
      input.addEventListener("focus", (e) => {
        inputCallback(input, e, cell);
      });
      input.addEventListener("keyup", (e) => {
        inputCallback(input, e, cell);
      });
    }
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        successFunc();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    });
    input.addEventListener("change", successFunc);
    input.addEventListener("blur", successFunc);
    return editor;
  }

  // src/utils/parseMoney.js
  var parseMoney_default = (input, locale = "en-US", currency = "USD") => {
    let fmt = String(input);
    const neg = fmt[0] === "-" || fmt[0] === "\u2212";
    fmt = fmt.replace(/[^\d\.,]/g, "");
    do {
      fmt = fmt.replace(/(\.|,)(\d{2,3})(\.|,)/, "$2$3");
    } while (fmt.match(/(\.|,)(\d{2,3})(\.|,)/));
    fmt = fmt.replace(",", ".");
    const pts = fmt.split(".");
    if (pts.length > 1) {
      if (+pts[0] === 0) fmt = pts.join(".");
      else if (pts[1].length === 3) fmt = pts.join("");
    }
    if (neg) {
      fmt = "-" + fmt;
    }
    const number = Number(fmt);
    const isValid = isFinite(number);
    const string = number.toFixed(2);
    const intlNFOpts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency
    }).resolvedOptions();
    const output = number.toLocaleString(locale, {
      ...intlNFOpts,
      style: "decimal"
    });
    return {
      input,
      locale,
      currency,
      isValid,
      string,
      number,
      output
    };
  };

  // src/utils/isNumeric.js
  var isNumeric_default = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  // src/classes/tabulator/Edit/editors/money.js
  function money_default2(cell, onRendered, success, cancel, editorParams) {
    var input = ce_default("input");
    input.setAttribute("type", "text");
    input.setAttribute("inputmode", "decimal");
    input.style.cssText = `padding:4px;width:100%;box-sizing:border-box`;
    input.value = cell.getValue() || "";
    onRendered(function() {
      input.style.height = "100%";
      if (editorParams.selectContents) {
        input.select();
      }
      setTimeout(() => {
        input.focus({ preventScroll: true });
      }, 1);
    });
    function successFunc() {
      input.value = input.value.trim();
      if (input.value || editorParams.notNull) {
        let fmt = parseMoney_default(input.value);
        input.value = fmt.output;
      }
      success(input.value);
    }
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        successFunc();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
      if (e.key.length === 1 && !(isNumeric_default(e.key) || [".", ",", "-"].includes(e.key))) {
        e.preventDefault();
      }
    });
    input.addEventListener("change", successFunc);
    input.addEventListener("blur", successFunc);
    return input;
  }

  // src/classes/tabulator/Edit/editors/customInput.js
  function customInput_default(cell, onRendered, success, cancel, editorParams) {
    var cellValue = cell.getValue(), input = ce_default("input");
    input.setAttribute("type", editorParams.type || "text");
    const inputmode = editorParams.inputmode || (editorParams.type == "email" ? "email" : "text");
    input.setAttribute("inputmode", inputmode);
    input.style.cssText = `padding:4px;width:100%;box-sizing:border-box`;
    input.value = typeof cellValue !== "undefined" ? cellValue : "";
    onRendered(function() {
      if (cell.getType() === "cell") {
        input.focus({ preventScroll: true });
        input.style.height = "100%";
        if (editorParams.selectContents) {
          input.select();
        }
      }
    });
    function onChange(e) {
      if ((cellValue === null || typeof cellValue === "undefined") && input.value !== "" || input.value !== cellValue) {
        if (success(input.value)) {
          cellValue = input.value;
        }
      } else {
        cancel();
      }
    }
    input.addEventListener("change", onChange);
    input.addEventListener("blur", onChange);
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          onChange(e);
          break;
        case 27:
          cancel();
          break;
        case 35:
        case 36:
          e.stopPropagation();
          break;
      }
      if (editorParams.inputmode == "decimal") {
        if (e.key.length === 1 && !(isNumeric_default(e.key) || [".", ",", "-"].includes(e.key))) {
          e.preventDefault();
        }
      }
    });
    return input;
  }

  // src/classes/tabulator/custom-formatters.js
  var custom_formatters_exports = {};
  __export(custom_formatters_exports, {
    button: () => button_default,
    customTickCross: () => customTickCross_default,
    external: () => external_default2,
    flag: () => flag_default,
    responsiveCollapse: () => responsiveCollapse_default2
  });

  // src/classes/tabulator/Format/formatters/responsiveCollapse.js
  function responsiveCollapse_default2(cell, formatterParams, onRendered) {
    var el = document.createElement("div"), config = cell.getRow()._row.modules.responsiveLayout;
    if (!config) {
      console.error("Invalid responsive mode");
      return;
    }
    el.classList.add("tabulator-responsive-collapse-toggle");
    el.innerHTML = `<div><svg class='tabulator-responsive-collapse-toggle-open' viewbox="0 0 24 24">
  <line x1="7" y1="12" x2="17" y2="12" fill="none" stroke-width="3" stroke-linecap="round" />
  <line y1="7" x1="12" y2="17" x2="12" fill="none" stroke-width="3" stroke-linecap="round" />
</svg>
<svg class='tabulator-responsive-collapse-toggle-close' viewbox="0 0 24 24">
  <line x1="7" y1="12" x2="17" y2="12"  fill="none" stroke-width="3" stroke-linecap="round" />
</svg></div>`;
    cell.getElement().classList.add("tabulator-row-handle");
    function toggleList(isOpen) {
      var collapseEl = config.element;
      config.open = isOpen;
      if (config.open) {
        el.classList.add("open");
      } else {
        el.classList.remove("open");
      }
      if (collapseEl) {
        collapseEl.style.display = isOpen ? "" : "none";
      }
    }
    el.addEventListener("click", function(e) {
      e.stopImmediatePropagation();
      toggleList(!config.open);
      cell.getRow()._row.dispatch("row-responsive-toggled", cell.getRow(), config.open);
      cell.getTable().modules.resizeTable.blockRedraw();
      cell.getTable().rowManager.adjustTableSize();
      setTimeout(() => {
        cell.getTable().modules.resizeTable.restoreRedraw();
      }, 250);
    });
    toggleList(config.open);
    return el;
  }

  // src/utils/icons.js
  var iconTick = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M5 13L9 17L19 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var iconCross = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var iconFirst = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" fill="currentColor"/></svg>';
  var iconLast = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" fill="currentColor"/></svg>';
  var iconNext = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>';
  var iconPrev = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>';
  var iconLoader = '<svg width="24" height="24" viewBox="0 0 24 24" xml:space="preserve"><circle fill="currentColor" cx="4" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"/></circle><circle fill="currentColor" cx="12" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"/></circle><circle fill="currentColor" cx="20" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"/></circle></svg>';
  var iconError = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M11.001 10h2v5h-2zM11 16h2v2h-2z" fill="currentColor"></path><path d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.986 1.986 0 0 0 .054 1.968A1.984 1.984 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.989 1.989 0 0 0 .054-1.968L13.768 4.2zM4.661 19 12 5.137 19.344 19H4.661z" fill="currentColor"></path></svg>';

  // src/classes/tabulator/Format/formatters/customTickCross.js
  function customTickCross_default(cell, formatterParams, onRendered) {
    let el;
    let color = formatterParams.color || null;
    let empty = formatterParams.allowEmpty;
    let element = cell.getElement();
    let value = cell.getValue();
    if (value) {
      element.setAttribute("aria-checked", true);
      el = formatterParams.onlyCross ? "" : iconTick;
      color = formatterParams.tickColor || color;
    } else {
      if (empty && (value === "null" || value === "" || value === null || value === void 0)) {
        element.setAttribute("aria-checked", "mixed");
      } else {
        element.setAttribute("aria-checked", false);
        el = formatterParams.onlyTick ? "" : iconCross;
        color = formatterParams.crossColor || color;
      }
    }
    if (formatterParams.size) {
      el = el.replace('width="16"', 'width="' + formatterParams.size + '"');
      el = el.replace('height="16"', 'height="' + formatterParams.size + '"');
    }
    if (color) {
      el = `<span style="color:${color}">${el}</span>`;
    }
    return el;
  }

  // src/classes/tabulator/Format/formatters/flag.js
  var map = {
    uk: "gb"
  };
  function flag_default(cell, formatterParams, onRendered) {
    if (!cell.getValue()) {
      return;
    }
    let iconName = cell.getValue().toLowerCase();
    if (!customElements.get("l-i")) {
      return iconName;
    }
    iconName = map[iconName] ? map[iconName] : iconName;
    return `<l-i name="${iconName}" set="fl" size="16"></l-i>`;
  }

  // src/classes/tabulator/Format/formatters/external.js
  function external_default2(cell, formatterParams, onRendered) {
    const v = cell.getValue();
    const editable = cell.getRow().getData()._editable || false;
    let formatted = "";
    if (v || formatterParams["notNull"]) {
      formatted = safeGlobalFn_default(formatterParams["function"])(v);
    } else if (formatterParams["editPlaceholder"] && editable) {
      formatted = `<em class="tabulator-value-placeholder">${formatterParams["editPlaceholder"]}</em>`;
    } else if (formatterParams["placeholder"]) {
      formatted = `<em class="tabulator-value-placeholder">${formatterParams["placeholder"]}</em>`;
    }
    return formatted;
  }

  // src/utils/interpolate.js
  var interpolate_default = (str, data) => {
    return str.replace(/\{([^\}]+)?\}/g, ($1, $2) => {
      return data[$2] || "";
    });
  };

  // src/classes/tabulator/Format/formatters/button.js
  function button_default(cell, formatterParams, onRendered) {
    let iconName = formatterParams.icon;
    if (formatterParams.showAlt) {
      let showAltField = formatterParams.showAlt;
      let isNot = showAltField[0] == "!";
      showAltField = showAltField.replace("!", "");
      let altValue = cell._cell.row.data[showAltField];
      if (altValue === void 0) {
        return "";
      }
      if (isNot) {
        if (!altValue) {
          iconName = formatterParams.showAltIcon;
        }
      } else {
        if (altValue) {
          iconName = formatterParams.showAltIcon;
        }
      }
    }
    let ajax = formatterParams.ajax || false;
    let title = formatterParams.title;
    let btnClasses = formatterParams.classes;
    let onlyIcon = formatterParams.onlyIcon || false;
    let urlParams = formatterParams.urlParams || {};
    let classes = btnClasses || "btn btn-primary";
    let onClick = formatterParams.onClick;
    let icon = "";
    let btnContent = title;
    if (iconName) {
      if (iconName[0] === "/") {
        icon = `<img src="${iconName}" alt="${title}"/>`;
      } else {
        icon = `<l-i name="${iconName}"></l-i>`;
        if (!customElements.get("l-i")) {
          icon = `<span class="font-icon-${iconName}"></span>`;
        }
      }
      if (onlyIcon || !btnContent) {
        btnContent = icon;
      } else {
        btnContent = `${icon} <span>${btnContent}</span>`;
      }
    }
    let url = formatterParams.url;
    let tag = "a";
    let attrs = {
      class: classes
    };
    if (ajax) {
      if (typeof ajax == "function") {
        console.error("Ajax param must be a string", ajax);
      }
      attrs["data-ajax"] = ajax;
    }
    if (!url) {
      tag = "button";
      attrs["type"] = "button";
    } else {
      url = interpolate_default(url, cell._cell.row.data);
      if (Object.keys(urlParams).length > 0) {
        url += "?" + new URLSearchParams(urlParams).toString();
      }
      attrs["href"] = url;
    }
    let buttonEl = ce_default(tag);
    buttonEl.innerHTML = btnContent;
    for (const [k, v] of Object.entries(attrs)) {
      buttonEl.setAttribute(k, v);
    }
    if (onClick) {
      buttonEl.addEventListener("click", (ev) => {
        onClick(ev, buttonEl, cell);
      });
    }
    return buttonEl;
  }

  // src/classes/tabulator/helpers.js
  var simpleRowFormatter = (row) => {
    const data = row.getData();
    if (data._color) {
      row.getElement().style.backgroundColor = data._color;
    }
    if (data._class) {
      row.getElement().classList.add(data._class);
    }
  };
  var expandTooltips = (e, cell, onRendered) => {
    const el = cell._cell.element;
    const isTruncated = el.scrollWidth > el.clientWidth;
    if (isTruncated) {
      return cell._cell.value;
    }
    return "";
  };

  // src/utils/isString.js
  var isString_default = (v) => {
    return typeof v == "string";
  };

  // src/utils/replaceCallbacks.js
  var replaceCallbacks = (obj) => {
    if (isString_default(obj)) {
      obj = obj[0] == "{" ? JSON.parse(obj) : getGlobalFn_default(obj);
    }
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v == "object") {
        const fn = v["__fn"];
        if (isString_default(fn)) {
          obj[k] = getGlobalFn_default(fn);
        } else {
          replaceCallbacks(v);
        }
      }
    }
    return obj;
  };
  var replaceCallbacks_default = replaceCallbacks;

  // src/utils/simpleConfig.js
  var simpleConfig_default = (str) => {
    if (!str) {
      return {};
    }
    if (str[0] != "{" && str.includes(":")) {
      str = `{${str.replace(/([\w]*)\s*:\s*([\w"'\[\]]*)/g, (m2, p1, p2) => `"${p1}":${p2.replace(/'/g, '"')}`)}}`;
    }
    return str[0] == "{" ? JSON.parse(str) : getGlobalFn_default(str);
  };

  // src/utils/whenParsed.js
  var whenParsed = (el) => {
    let ref = el;
    do {
      if (ref.nextSibling) {
        el.parsedCallback();
        return;
      }
      ref = ref.parentNode;
    } while (ref);
    setTimeout(() => {
      el.parsedCallback();
    });
  };
  var whenParsed_default = whenParsed;

  // src/utils/FormidableElement.js
  var ID_KEY = "__fe_id";
  window[ID_KEY] = window[ID_KEY] || 0;
  var m = /* @__PURE__ */ new Map();
  var FormidableElement = class extends HTMLElement {
    constructor() {
      super();
      this.id = this.id || `fe-${window[ID_KEY]++}`;
      const o = m.get(this.id);
      if (o) {
        if (o != this.innerHTML) {
          this.innerHTML = o;
        }
      } else {
        m.set(this.id, this.innerHTML);
      }
    }
    /**
     * This can get called multiple times
     */
    connectedCallback() {
      if (this._t) {
        clearTimeout(this._t);
      }
      whenParsed_default(this);
    }
    disconnectedCallback() {
      this.disconnected();
      this._t = setTimeout(() => {
        this.destroyed();
        this.config = null;
        if (!document.getElementById(this.id)) {
          m.delete(this.id);
        }
      }, 1e3);
    }
    parsedCallback() {
      if (!this.config) {
        this.config = replaceCallbacks_default(simpleConfig_default(this.dataset.config));
        this.created();
      }
      this.connected();
    }
    /**
     * Called only once in component lifecycle
     * Config is parsed again just before created is called
     */
    created() {
    }
    /**
     * Called if the element is not reconnected quickly after being disconnected
     * Will set config to null
     */
    destroyed() {
    }
    /**
     * Called each time the component is connected (inserted)
     */
    connected() {
    }
    /**
     * Called each time the component is disconnected (removed or destroyed)
     */
    disconnected() {
    }
  };
  var FormidableElement_default = FormidableElement;

  // src/utils/EventfulElement.js
  var observer = new window.IntersectionObserver((entries, obs) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      const target = entry.target;
      obs.unobserve(target);
      target.doCreate();
    });
  });
  var EventfulElement = class extends FormidableElement_default {
    get events() {
      return [];
    }
    parsedCallback() {
      this.lazy = this.hasAttribute("lazy");
      if (!this.config) {
        if (this.lazy) {
          observer.observe(this);
        } else {
          this.doCreate();
        }
      }
      if (this.config) {
        this.connected();
      }
    }
    doCreate() {
      this.config = replaceCallbacks_default(simpleConfig_default(this.dataset.config));
      this.created();
    }
    connectedCallback() {
      super.connectedCallback();
      this.events.forEach((t) => this.addEventListener(t, this));
    }
    trackFocus(ev) {
      if (ev.type == "focusin") {
        this.classList.add("has-focus");
      } else if (ev.type == "focusout") {
        this.classList.remove("has-focus");
      }
    }
    // Use arrow function to make sure that the scope is always this and cannot be rebound
    // Automatically call any $event method (don't use "on" as prefix as it will collide with existing handler)
    handleEvent = (ev) => {
      this.trackFocus(ev);
      this[`$${ev.type}`](ev);
    };
    disconnectedCallback() {
      if (this.lazy && this.config) {
        observer.unobserve(this);
      }
      this.events.forEach((t) => this.removeEventListener(t, this));
      super.disconnectedCallback();
    }
  };
  var EventfulElement_default = EventfulElement;

  // src/utils/parseBool.js
  var parseBool_default = (value) => ["true", "false", "1", "0", true, false].includes(value) && !!JSON.parse(value);

  // src/utils/getDelete.js
  var getDelete_default = (obj, k, defaults = null) => {
    const v = obj[k] ?? defaults;
    delete obj[k];
    return v;
  };

  // src/classes/TabulatorGrid.js
  var TabulatorFull = class extends Tabulator_default {
    static extendModule() {
      Tabulator_default.initializeModuleBinder(optional_exports);
      Tabulator_default._extendModule(...arguments);
    }
    static registerModule() {
      Tabulator_default.initializeModuleBinder(optional_exports);
      Tabulator_default._registerModule(...arguments);
    }
    constructor(element, options, modules) {
      super(element, options, optional_exports);
    }
  };
  TabulatorFull.extendModule("edit", "editors", custom_editors_exports);
  TabulatorFull.extendModule("format", "formatters", custom_formatters_exports);
  var TabulatorGrid = class extends EventfulElement_default {
    /**
     * @returns {HTMLDivElement}
     */
    get el() {
      return this.firstElementChild;
    }
    created() {
      if (!this.el) {
        this.innerHTML = "<div></div>";
      }
      const el = this.el;
      const config = this.config;
      if (!config.columns) {
        config.autoColumns = true;
      }
      if (!config.columnDefaults) {
        config.columnDefaults = {
          //@link https://tabulator.info/docs/6.2/menu#tooltips-cell
          tooltip: expandTooltips,
          headerFilter: parseBool_default(this.dataset.filter)
        };
      }
      if (config.data && typeof config.data == "function") {
        config.data = config.data();
      }
      if (!config.locale) {
        config.locale = navigator.language.split("-")[0];
      }
      if (!config.rowFormatter) {
        config.rowFormatter = simpleRowFormatter;
      }
      if (!config.renderVertical) {
      }
      if (config.locale) {
        if (!config.langs || !config.langs[config.locale]) {
          config.langs = config.langs || {};
          config.langs[config.locale] = {
            pagination: {},
            data: {}
          };
        }
        if (config.langs[config.locale].pagination) {
          Object.assign(config.langs[config.locale].pagination, {
            first: iconFirst,
            last: iconLast,
            next: iconNext,
            prev: iconPrev
          });
        }
        if (config.langs[config.locale].data) {
          Object.assign(config.langs[config.locale].data, {
            loading: iconLoader,
            error: iconError
          });
        }
      }
      const initCallback = getDelete_default(config, "_initCallback");
      const configCallback = getDelete_default(config, "_configCallback");
      const state = getDelete_default(config, "_state", {});
      const ajaxURL = getDelete_default(config, "ajaxURL");
      const form = el.closest("form");
      let hiddenInput = this.querySelector("input");
      if (configCallback) {
        configCallback(config);
      }
      const tabulator = new TabulatorFull(el, this.config);
      const updateHiddenInput = () => {
        if (hiddenInput) {
          hiddenInput.value = JSON.stringify(tabulator.getData());
        }
      };
      if (hiddenInput) {
        tabulator.on("cellEdited", updateHiddenInput);
      }
      const rowClickTriggersAction = parseBool_default(this.dataset.rowClickTriggersAction);
      if (rowClickTriggersAction) {
        tabulator.on("rowClick", function(e, row) {
          const target = e.target.closest(".tabulator-cell");
          if (!target || target.classList.contains("tabulator-editable") || target.classList.contains("tabulator-cell-btn")) {
            return;
          }
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
      tabulator.on("tableBuilt", () => {
        if (state.limit) {
          tabulator.setPageSize(state.limit);
        }
        if (state.page > 1) {
          tabulator.setPage(state.page);
        }
        let promise = null;
        if (ajaxURL) {
          promise = tabulator.setData(ajaxURL);
        } else if (hiddenInput && hiddenInput.value) {
          promise = tabulator.setData(JSON.parse(hiddenInput.value));
        }
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
      tabulator.on("dataLoading", (data) => {
        el.classList.add(`tabulator-loading`);
      });
      tabulator.on("dataLoaded", (data) => {
        el.classList.remove(`tabulator-loading`);
      });
      tabulator.on("dataLoadError", (error) => {
        el.classList.remove(`tabulator-loading`);
      });
      const fixedPaginatedHeight = parseBool_default(this.dataset.fixedPaginatedHeight);
      const usePxHeight = config.height && config.height.includes("px");
      tabulator.on("renderStarted", () => {
        const holder = tabulator.element.querySelector(".tabulator-tableholder");
        const table = tabulator.element.querySelector(".tabulator-table");
        holder.style.overflowAnchor = "none";
        if (config.responsiveLayout && !usePxHeight) {
          holder.style.overflowY = "hidden";
        }
      });
      tabulator.on("renderComplete", () => {
        const holder = tabulator.element.querySelector(".tabulator-tableholder");
        const table = tabulator.element.querySelector(".tabulator-table");
        let height = Math.min(holder.clientHeight, table.clientHeight);
        let paginatedHeight = 0;
        if (tabulator.options.pagination && fixedPaginatedHeight && table.firstChild) {
          paginatedHeight = this.config.paginationSize * table.firstChild.offsetHeight;
        }
        if (paginatedHeight > 0) {
          if (height > 0) {
            holder.style.height = `${height}px`;
          }
          holder.style.minHeight = `${paginatedHeight}px`;
        }
      });
      const navigatorClass = tabulator.browserMobile ? "mobile" : "desktop";
      el.classList.add(`tabulator-navigator-${navigatorClass}`);
      if (this.hasAttribute("sticky")) {
        el.classList.add(`tabulator-sticky`);
      }
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
      const addRow = this.querySelector(".tabulator-add-row");
      const removeRow = this.querySelector(".tabulator-remove-selected");
      if (addRow) {
        addRow.addEventListener("click", (event) => {
          tabulator.addRow({}, false);
        });
      }
      if (removeRow) {
        removeRow.addEventListener("click", (event) => {
          tabulator.getSelectedRows().forEach((row) => {
            row.delete();
          });
          updateHiddenInput();
        });
      }
      const listeners = this.dataset.listeners ? JSON.parse(this.dataset.listeners) : {};
      for (const listenerName in listeners) {
        var cb = getGlobalFn_default(listeners[listenerName]);
        if (cb) {
          tabulator.on(listenerName, cb);
        }
      }
      this.tabulator = tabulator;
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
  };
  var TabulatorGrid_default = TabulatorGrid;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // node_modules/tabulator-tables/dist/css/tabulator_bootstrap5.min.css
  var tabulator_bootstrap5_min_default = '.tabulator{border:1px solid #dee2e6;font-size:16px;overflow:hidden;position:relative;text-align:left;-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-ms-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0)}.tabulator[tabulator-layout=fitDataFill] .tabulator-tableholder .tabulator-table{min-width:100%}.tabulator[tabulator-layout=fitDataTable]{display:inline-block}.tabulator.tabulator-block-select,.tabulator.tabulator-ranges .tabulator-cell:not(.tabulator-editing){user-select:none}.tabulator .tabulator-header{background-color:#fff;border-bottom:1px solid #dee2e6;box-sizing:border-box;color:#555;font-weight:700;outline:none;overflow:hidden;position:relative;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap;width:100%}.tabulator .tabulator-header.tabulator-header-hidden{display:none}.tabulator .tabulator-header .tabulator-header-contents{overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-header-contents .tabulator-headers{display:inline-block}.tabulator .tabulator-header .tabulator-col{background:#fff;border-right:1px solid #aaa;box-sizing:border-box;display:inline-flex;flex-direction:column;justify-content:flex-start;overflow:hidden;position:relative;text-align:left;vertical-align:bottom}.tabulator .tabulator-header .tabulator-col.tabulator-moving{background:#e6e6e6;border:1px solid #dee2e6;pointer-events:none;position:absolute}.tabulator .tabulator-header .tabulator-col.tabulator-range-highlight{background-color:#d6d6d6;color:#000}.tabulator .tabulator-header .tabulator-col.tabulator-range-selected{background-color:#3876ca;color:#fff}.tabulator .tabulator-header .tabulator-col .tabulator-col-content{box-sizing:border-box;padding:4px;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button{padding:0 8px}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button:hover{cursor:pointer;opacity:.6}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title-holder{position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title{box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;white-space:nowrap;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title.tabulator-col-title-wrap{text-overflow:clip;white-space:normal}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-title-editor{background:#fff;border:1px solid #999;box-sizing:border-box;padding:1px;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-header-popup-button+.tabulator-title-editor{width:calc(100% - 22px)}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{align-items:center;bottom:0;display:flex;position:absolute;right:4px;top:0}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-left:6px solid transparent;border-right:6px solid transparent;height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{border-top:1px solid #aaa;display:flex;margin-right:-1px;overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter{box-sizing:border-box;margin-top:2px;position:relative;text-align:center;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter textarea{height:auto!important}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter svg{margin-top:3px}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input::-ms-clear{height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-right:25px}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable.tabulator-col-sorter-element:hover{background-color:#e6e6e6;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter{color:#bbb}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #666;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-top:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:none;border-top:6px solid #666;color:#666}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical .tabulator-col-content .tabulator-col-title{align-items:center;display:flex;justify-content:center;text-orientation:mixed;writing-mode:vertical-rl}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-col-vertical-flip .tabulator-col-title{transform:rotate(180deg)}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-title{padding-right:0;padding-top:20px}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-vertical-flip .tabulator-col-title{padding-bottom:20px;padding-right:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-sorter{bottom:auto;justify-content:center;left:0;right:0;top:4px}.tabulator .tabulator-header .tabulator-frozen{left:0;position:sticky;z-index:11}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-left{border-right:2px solid #dee2e6}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right{border-left:2px solid #dee2e6}.tabulator .tabulator-header .tabulator-calcs-holder{background:#fff!important;border-bottom:1px solid #aaa;border-top:1px solid #dee2e6;box-sizing:border-box;display:inline-block}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row{background:#fff!important}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-header .tabulator-frozen-rows-holder{display:inline-block}.tabulator .tabulator-header .tabulator-frozen-rows-holder:empty{display:none}.tabulator .tabulator-tableholder{-webkit-overflow-scrolling:touch;overflow:auto;position:relative;white-space:nowrap;width:100%}.tabulator .tabulator-tableholder:focus{outline:none}.tabulator .tabulator-tableholder .tabulator-placeholder{align-items:center;box-sizing:border-box;display:flex;justify-content:center;min-width:100%;width:100%}.tabulator .tabulator-tableholder .tabulator-placeholder[tabulator-render-mode=virtual]{min-height:100%}.tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents{color:#ccc;display:inline-block;font-size:20px;font-weight:700;padding:10px;text-align:center;white-space:normal}.tabulator .tabulator-tableholder .tabulator-table{background-color:#fff;color:#333;display:inline-block;overflow:visible;position:relative;white-space:nowrap}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs{background:#dadfe4!important;font-weight:700}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-top{border-bottom:2px solid #dee2e6}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-bottom{border-top:2px solid #dee2e6}.tabulator .tabulator-tableholder .tabulator-range-overlay{inset:0;pointer-events:none;position:absolute;z-index:10}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range{border:1px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:"";height:6px;position:absolute;right:-3px;width:6px}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range-cell-active{border:2px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-footer{background-color:#e6e6e6;border-top:1px solid #dee2e6;color:#555;font-weight:700;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap}.tabulator .tabulator-footer .tabulator-footer-contents{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:5px 10px}.tabulator .tabulator-footer .tabulator-footer-contents:empty{display:none}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs{margin-top:-5px;overflow-x:auto}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab{border:1px solid #dee2e6;border-bottom-left-radius:5px;border-bottom-right-radius:5px;border-top:none;display:inline-block;font-size:.9em;padding:5px}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab:hover{cursor:pointer;opacity:.7}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab.tabulator-spreadsheet-tab-active{background:#fff}.tabulator .tabulator-footer .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #dee2e6;border-top:1px solid #dee2e6;box-sizing:border-box;overflow:hidden;text-align:left;width:100%}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important;display:inline-block}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-footer .tabulator-calcs-holder:only-child{border-bottom:none;margin-bottom:-5px}.tabulator .tabulator-footer>*+.tabulator-page-counter{margin-left:10px}.tabulator .tabulator-footer .tabulator-page-counter{font-weight:400}.tabulator .tabulator-footer .tabulator-paginator{color:#555;flex:1;font-family:inherit;font-size:inherit;font-weight:inherit;text-align:right}.tabulator .tabulator-footer .tabulator-page-size{border:1px solid #dee2e6;border-radius:3px;display:inline-block;margin:0 5px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-pages{margin:0 7px}.tabulator .tabulator-footer .tabulator-page{background:hsla(0,0%,100%,.2);border:1px solid #dee2e6;border-radius:3px;display:inline-block;margin:0 2px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-page:disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-footer .tabulator-page:not(disabled):hover{background:rgba(0,0,0,.2);color:#fff;cursor:pointer}}.tabulator .tabulator-col-resize-handle{display:inline-block;margin-left:-3px;margin-right:-3px;position:relative;vertical-align:middle;width:6px;z-index:11}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-col-resize-handle:hover{cursor:ew-resize}}.tabulator .tabulator-col-resize-handle:last-of-type{margin-right:0;width:3px}.tabulator .tabulator-col-resize-guide{background-color:#999;height:100%;margin-left:-.5px;opacity:.5;position:absolute;top:0;width:4px}.tabulator .tabulator-row-resize-guide{background-color:#999;height:4px;left:0;margin-top:-.5px;opacity:.5;position:absolute;width:100%}.tabulator .tabulator-alert{align-items:center;background:rgba(0,0,0,.4);display:flex;height:100%;left:0;position:absolute;text-align:center;top:0;width:100%;z-index:100}.tabulator .tabulator-alert .tabulator-alert-msg{background:#fff;border-radius:10px;display:inline-block;font-size:16px;font-weight:700;margin:0 auto;padding:10px 20px}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-msg{border:4px solid #333;color:#000}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-error{border:4px solid #d00;color:#590000}.tabulator-row{background-color:#fff;box-sizing:border-box;min-height:24px;position:relative}.tabulator-row.tabulator-row-even{background-color:#e9ecef}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selectable:hover{background-color:#ced4da;cursor:pointer}}.tabulator-row.tabulator-selected{background-color:#9abcea}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selected:hover{background-color:#769bcc;cursor:pointer}}.tabulator-row.tabulator-row-moving{background:#fff;border:1px solid #000}.tabulator-row.tabulator-moving{border-bottom:1px solid #dee2e6;border-top:1px solid #dee2e6;pointer-events:none;position:absolute;z-index:15}.tabulator-row.tabulator-range-highlight .tabulator-cell.tabulator-range-row-header{background-color:#d6d6d6;color:#000}.tabulator-row.tabulator-range-highlight.tabulator-range-selected .tabulator-cell.tabulator-range-row-header,.tabulator-row.tabulator-range-selected .tabulator-cell.tabulator-range-row-header{background-color:#3876ca;color:#fff}.tabulator-row .tabulator-row-resize-handle{bottom:0;height:5px;left:0;position:absolute;right:0}.tabulator-row .tabulator-row-resize-handle.prev{bottom:auto;top:0}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-row-resize-handle:hover{cursor:ns-resize}}.tabulator-row .tabulator-responsive-collapse{border-bottom:1px solid #dee2e6;border-top:1px solid #dee2e6;box-sizing:border-box;padding:5px}.tabulator-row .tabulator-responsive-collapse:empty{display:none}.tabulator-row .tabulator-responsive-collapse table{font-size:16px}.tabulator-row .tabulator-responsive-collapse table tr td{position:relative}.tabulator-row .tabulator-responsive-collapse table tr td:first-of-type{padding-right:10px}.tabulator-row .tabulator-cell{border-right:1px solid #dee2e6;box-sizing:border-box;display:inline-block;outline:none;overflow:hidden;padding:4px;position:relative;text-overflow:ellipsis;vertical-align:middle;white-space:nowrap}.tabulator-row .tabulator-cell.tabulator-row-header{border-bottom:1px solid #dee2e6}.tabulator-row .tabulator-cell.tabulator-frozen{background-color:inherit;display:inline-block;left:0;position:sticky;z-index:11}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-right:2px solid #dee2e6}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-left:2px solid #dee2e6}.tabulator-row .tabulator-cell.tabulator-editing{border:1px solid #1d68cd;outline:none;padding:0}.tabulator-row .tabulator-cell.tabulator-editing input,.tabulator-row .tabulator-cell.tabulator-editing select{background:transparent;border:1px;outline:none}.tabulator-row .tabulator-cell.tabulator-validation-fail{border:1px solid #d00}.tabulator-row .tabulator-cell.tabulator-validation-fail input,.tabulator-row .tabulator-cell.tabulator-validation-fail select{background:transparent;border:1px;color:#d00}.tabulator-row .tabulator-cell.tabulator-row-handle{align-items:center;display:inline-flex;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box{width:80%}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box .tabulator-row-handle-bar{background:#666;height:3px;margin-top:2px;width:100%}.tabulator-row .tabulator-cell.tabulator-range-selected:not(.tabulator-range-only-cell-selected):not(.tabulator-range-row-header){background-color:#9abcea}.tabulator-row .tabulator-cell .tabulator-data-tree-branch-empty{display:inline-block;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom:2px solid #dee2e6;border-bottom-left-radius:1px;border-left:2px solid #dee2e6;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control{align-items:center;background:rgba(0,0,0,.1);border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-data-tree-control:hover{background:rgba(0,0,0,.2);cursor:pointer}}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:"";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:"";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle{align-items:center;background:#666;border-radius:20px;color:#fff;display:inline-flex;font-size:1.1em;font-weight:700;height:15px;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;width:15px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle:hover{cursor:pointer;opacity:.7}}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-close{display:initial}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-open{display:none}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle svg{stroke:#fff}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle .tabulator-responsive-collapse-toggle-close{display:none}.tabulator-row .tabulator-cell .tabulator-traffic-light{border-radius:14px;display:inline-block;height:14px;width:14px}.tabulator-row.tabulator-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #dee2e6;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-group:hover{background-color:rgba(0,0,0,.1);cursor:pointer}}.tabulator-row.tabulator-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-row.tabulator-group.tabulator-group-level-1{padding-left:30px}.tabulator-row.tabulator-group.tabulator-group-level-2{padding-left:50px}.tabulator-row.tabulator-group.tabulator-group-level-3{padding-left:70px}.tabulator-row.tabulator-group.tabulator-group-level-4{padding-left:90px}.tabulator-row.tabulator-group.tabulator-group-level-5{padding-left:110px}.tabulator-row.tabulator-group .tabulator-group-toggle{display:inline-block}.tabulator-row.tabulator-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-row.tabulator-group span{color:#d00;margin-left:10px}.tabulator-toggle{background:#dcdcdc;border:1px solid #ccc;box-sizing:border-box;display:flex;flex-direction:row}.tabulator-toggle.tabulator-toggle-on{background:#1c6cc2}.tabulator-toggle .tabulator-toggle-switch{background:#fff;border:1px solid #ccc;box-sizing:border-box}.tabulator-popup-container{-webkit-overflow-scrolling:touch;border:1px solid #dee2e6;box-shadow:0 0 5px 0 rgba(0,0,0,.2);box-sizing:border-box;display:inline-block;font-size:16px;overflow-y:auto;position:absolute;z-index:10000}.tabulator-popup{border-radius:3px;padding:5px}.tabulator-tooltip{border-radius:2px;box-shadow:none;font-size:12px;max-width:Min(500px,100%);padding:3px 5px;pointer-events:none}.tabulator-menu .tabulator-menu-item{box-sizing:border-box;padding:5px 10px;position:relative;user-select:none}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator-menu .tabulator-menu-item:not(.tabulator-menu-item-disabled):hover{background:#e9ecef;cursor:pointer}}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu{padding-right:25px}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu:after{border-color:#dee2e6;border-style:solid;border-width:1px 1px 0 0;content:"";display:inline-block;height:7px;position:absolute;right:10px;top:calc(5px + .4em);transform:rotate(45deg);vertical-align:top;width:7px}.tabulator-menu .tabulator-menu-separator{border-top:1px solid #dee2e6}.tabulator-edit-list{-webkit-overflow-scrolling:touch;font-size:16px;max-height:200px;overflow-y:auto}.tabulator-edit-list .tabulator-edit-list-item{color:#333;outline:none;padding:4px}.tabulator-edit-list .tabulator-edit-list-item.active{background:#1d68cd}.tabulator-edit-list .tabulator-edit-list-item.focused{outline:1px solid #1d68cd}@media (hover:hover) and (pointer:fine){.tabulator-edit-list .tabulator-edit-list-item:hover{background:#1d68cd;color:#fff;cursor:pointer}}.tabulator-edit-list .tabulator-edit-list-placeholder{color:#333;padding:4px;text-align:center}.tabulator-edit-list .tabulator-edit-list-group{border-bottom:1px solid #dee2e6;color:#333;font-weight:700;padding:6px 4px 4px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-2,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-2{padding-left:12px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-3,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-3{padding-left:20px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-4,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-4{padding-left:28px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-5,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-5{padding-left:36px}.tabulator.tabulator-ltr{direction:ltr}.tabulator.tabulator-rtl{direction:rtl;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col{border-left:1px solid #aaa;border-right:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{margin-left:-1px;margin-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-left:25px;padding-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{left:8px;right:auto}.tabulator.tabulator-rtl .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:"";height:6px;left:-3px;position:absolute;right:auto;width:6px}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell{border-left:1px solid #dee2e6;border-right:initial}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom-left-radius:0;border-bottom-right-radius:1px;border-left:initial;border-right:2px solid #dee2e6;margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-control{margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-left:2px solid #dee2e6}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-right:2px solid #dee2e6}.tabulator.tabulator-rtl .tabulator-row .tabulator-col-resize-handle:last-of-type{margin-left:0;margin-right:-3px;width:3px}.tabulator.tabulator-rtl .tabulator-footer .tabulator-calcs-holder{text-align:initial}.tabulator-print-fullscreen{bottom:0;left:0;position:absolute;right:0;top:0;z-index:10000}body.tabulator-print-fullscreen-hide>:not(.tabulator-print-fullscreen){display:none!important}.tabulator-print-table{border-collapse:collapse}.tabulator-print-table .tabulator-data-tree-branch{border-bottom:2px solid #dee2e6;border-bottom-left-radius:1px;border-left:2px solid #dee2e6;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-print-table .tabulator-print-table-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #dee2e6;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-print-table-group:hover{background-color:rgba(0,0,0,.1);cursor:pointer}}.tabulator-print-table .tabulator-print-table-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-1 td{padding-left:30px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-2 td{padding-left:50px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-3 td{padding-left:70px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-4 td{padding-left:90px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-5 td{padding-left:110px!important}.tabulator-print-table .tabulator-print-table-group .tabulator-group-toggle{display:inline-block}.tabulator-print-table .tabulator-print-table-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-print-table .tabulator-print-table-group span{color:#d00;margin-left:10px}.tabulator-print-table .tabulator-data-tree-control{align-items:center;background:rgba(0,0,0,.1);border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-data-tree-control:hover{background:rgba(0,0,0,.2);cursor:pointer}}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:"";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:"";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator{background-color:#fff;border:none}.tabulator .tabulator-header{border-bottom:2px solid #dee2e6;border-top:1px solid #dee2e6;color:inherit}.tabulator .tabulator-header .tabulator-col{background-color:#fff;border-right:none}.tabulator .tabulator-header .tabulator-col .tabulator-col-content{padding:12px}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{right:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{border-top:1px solid #dee2e6}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input{background-clip:padding-box;background-color:#fff;border:1px solid #ced4da;border-radius:.25rem;color:#495057;font-size:1rem;line-height:1.5;padding:.375rem .75rem;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input:focus{background-color:#fff;border:1px solid #1d68cd;color:#495057;outline:0}.tabulator .tabulator-header .tabulator-calcs-holder{border-bottom:1px solid #dee2e6;width:100%}.tabulator .tabulator-tableholder .tabulator-placeholder span{color:#000}.tabulator .tabulator-footer,.tabulator .tabulator-tableholder .tabulator-table{color:inherit}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab{background-color:#fff;font-weight:400}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab.tabulator-spreadsheet-tab-active{background-color:#0d6efd;color:#fff}.tabulator .tabulator-footer .tabulator-paginator{color:inherit}.tabulator .tabulator-footer .tabulator-pages{margin:0}.tabulator .tabulator-footer .tabulator-page{margin:5px 0 0;padding:8px 12px}.tabulator .tabulator-footer .tabulator-page[data-page=first]{border-bottom-left-radius:4px;border-top-left-radius:4px}.tabulator .tabulator-footer .tabulator-page[data-page=last]{border:1px solid #dee2e6;border-bottom-right-radius:4px;border-top-right-radius:4px}.tabulator .tabulator-footer .tabulator-page.active{background-color:#0d6efd;border-color:#0d6efd;color:#fff}.tabulator .tabulator-footer .tabulator-page:disabled{background:#fff;border-color:#dee2e6;color:#6c757d}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-footer .tabulator-page:not(.disabled):hover{background:#e9ecef;border-color:#dee2e6;color:#0a58ca}}.tabulator.thead-dark .tabulator-header,.tabulator.thead-dark .tabulator-header .tabulator-col{background-color:#fff;border-color:#dee2e6;color:#212529}.tabulator.table{background-color:#fff}.tabulator.table:not(.thead-light) .tabulator-header,.tabulator.table:not(.thead-light) .tabulator-header .tabulator-col{background-color:#fff;border-color:#dee2e6;color:#212529}.tabulator.table .tabulator-tableholder{color:#212529}.tabulator.table .tabulator-row{background-color:#fff;border-color:#dee2e6;color:#212529}@media (hover:hover) and (pointer:fine){.tabulator.table .tabulator-row:hover{background-color:#dee2e6}.tabulator.table .tabulator-row:hover .tabulator-cell{background-color:#ced4da}}.tabulator.table .tabulator-row.tabulator-selected{background-color:#9abcea}.tabulator.table .tabulator-footer{border-color:#dee2e6!important}.tabulator.table .tabulator-footer .tabulator-calcs-holder{background:#fff!important;border-color:#dee2e6!important}.tabulator.table .tabulator-footer .tabulator-calcs-holder .tabulator-row{background-color:#fff!important;border-color:#dee2e6!important;color:#212529!important}.tabulator.table-striped:not(.table) .tabulator-row.tabulator-row-even{background-color:#e9ecef}.tabulator.table-striped:not(.table) .tabulator-row.tabulator-row-even.tabulator-selected{background-color:#9abcea}@media (hover:hover) and (pointer:fine){.tabulator.table-striped:not(.table) .tabulator-row.tabulator-row-even.tabulator-selectable:hover{background-color:#ced4da;cursor:pointer}.tabulator.table-striped:not(.table) .tabulator-row.tabulator-row-even.tabulator-selected:hover{background-color:#769bcc;cursor:pointer}}.tabulator.table-striped.table .tabulator-row:nth-child(2n) .tabulator-cell{background-color:transparent}.tabulator.table-bordered{border:1px solid #dee2e6}.tabulator.table-bordered .tabulator-header .tabulator-col,.tabulator.table-bordered .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell{border-right:1px solid #dee2e6}.tabulator.table-borderless .tabulator-header,.tabulator.table-borderless .tabulator-row{border:none}.tabulator.table-sm .tabulator-header .tabulator-col .tabulator-col-content{padding:5px!important}.tabulator.table-sm .tabulator-tableholder .tabulator-table .tabulator-row{min-height:26px}.tabulator.table-sm .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell{padding:5px!important}.tabulator.table-sm .tabulator-row{padding-bottom:0;padding-top:0}.tabulator.table-sm .tabulator-col-resize-handle{padding:0}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table-primary{background:#cfe2ff!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table-secondary{background:#e2e3e5!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table-success{background:#d1e7dd!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table-info{background:#cff4fc!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table-warning{background:#fff3cd!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table-danger{background:#f8d7da!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table-light{background:#f8f9fa!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table{background:#212529!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.table-active{background:#6c757d!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-primary{background:#cfe2ff!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-secondary{background:#e2e3e5!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-success{background:#d1e7dd!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-info{background:#cff4fc!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-warning{background:#fff3cd!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-danger{background:#f8d7da!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-light{background:#f8f9fa!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-dark{background:#212529!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.bg-active{background:#6c757d!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table-primary{background:#cfe2ff!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table-secondary{background:#e2e3e5!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table-success{background:#d1e7dd!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table-info{background:#cff4fc!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table-warning{background:#fff3cd!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table-danger{background:#f8d7da!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table-light{background:#f8f9fa!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table{background:#212529!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.table-active{background:#6c757d!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-primary{background:#cfe2ff!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-secondary{background:#e2e3e5!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-success{background:#d1e7dd!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-info{background:#cff4fc!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-warning{background:#fff3cd!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-danger{background:#f8d7da!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-light{background:#f8f9fa!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-dark{background:#212529!important}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.bg-active{background:#6c757d!important}.tabulator-row{border-bottom:1px solid #dee2e6;min-height:40px}.tabulator-row .tabulator-cell{border-right:none;padding:12px}.tabulator-row .tabulator-cell:last-of-type{border-right:none}.tabulator-row .tabulator-cell.tabulator-row-header{background:#fff;border-bottom:none;border-right:1px solid #dee2e6}.tabulator-row .tabulator-cell .tabulator-data-tree-control{border:1px solid #ccc}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after,.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand,.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#ccc}.tabulator-row.tabulator-group{background:#fafafa}.tabulator-row.tabulator-group span{color:#666}.tabulator-edit-select-list{background:#fff}.tabulator-edit-select-list .tabulator-edit-select-list-item.active{color:#fff}.tabulator-edit-select-list .tabulator-edit-select-list-item.active.focused{outline:1px solid hsla(0,0%,100%,.5)}@media (hover:hover) and (pointer:fine){.tabulator-edit-select-list .tabulator-edit-select-list-item:hover{color:#fff}}.tabulator-edit-select-list .tabulator-edit-select-list-group,.tabulator-edit-select-list .tabulator-edit-select-list-notice{color:inherit}.tabulator.tabulator-rtl .tabulator-header .tabulator-col{border-left:initial;text-align:initial}.tabulator-print-table .tabulator-print-table-group{background:#fafafa}.tabulator-print-table .tabulator-print-table-group span{color:#666}.tabulator-print-table .tabulator-data-tree-control{color:inherit}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after,.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand,.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#ccc}.tabulator-popup-container{background:#fff}.tabulator-edit-list .tabulator-edit-list-item.active{color:#fff}.tabulator-edit-list .tabulator-edit-list-item.active.focused{outline:1px solid hsla(0,0%,100%,.5)}@media (hover:hover) and (pointer:fine){.tabulator-edit-list .tabulator-edit-list-item:hover{color:#fff}}\n/*# sourceMappingURL=tabulator_bootstrap5.min.css.map */';

  // src/css/tabulator-grid.min.css
  var tabulator_grid_min_default = 'tabulator-grid{display:block}.tabulator{--tabulator-gray:var(--bs-gray, #666);--tabulator-light-gray:var(--bs-gray-400, #bbb);--tabulator-primary-color:var(--bs-link-color, #0071c4);--tabulator-primary-hover-color:var(--bs-link-hover-color, #0062ab);--tabulator-valid-color:#d6fbe5;--tabulator-invalid-color:#fde1e5;--tabulator-highlight-color:#faf0d8;--tabulator-responsive-label-width:100px;--tabulator-responsive-label-fs:12px;--tabulator-margin:12px;--tabulator-narrow-margin:calc(var(--tabulator-margin) * 0.5);--tabulator-padded-margin:calc(var(--tabulator-margin) - 4px);--tabulator-icon-size:16px;font-size:inherit}.tabulator .tabulator-alert{background:rgba(255,255,255,.6)}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-msg{border:0;background-color:rgba(255,255,255,.85);box-shadow:0 .5rem 1rem rgb(0 0 0 / 15%);border-radius:.5rem;padding:.5rem 1rem}@keyframes tabulatorShow{0%{opacity:0}100%{opacity:1}}@keyframes tabulatorShowBg{0%{background:0 0}100%{background:rgba(255,255,255,.6)}}.tabulator.tabulator-loading .tabulator-alert{background:0 0;animation-name:tabulatorShowBg;animation-timing-function:ease-in;animation-fill-mode:forwards;animation-duration:.5s;animation-delay:1s}.tabulator.tabulator-loading .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-msg{min-height:48px;min-width:48px;padding:0;border-radius:24px;display:flex;align-items:center;justify-content:center;opacity:0;animation-name:tabulatorShow;animation-timing-function:ease-in;animation-fill-mode:forwards;animation-duration:.5s;animation-delay:.25s}.tabulator-navigator-desktop .tabulator-tableholder{scroll-behavior:smooth;scrollbar-color:#c1c1c1 transparent;scrollbar-width:thin}.tabulator-navigator-desktop .tabulator-tableholder::-webkit-scrollbar{width:8px;height:8px}.tabulator-navigator-desktop .tabulator-tableholder::-webkit-scrollbar-track{background:var(--bs-gray-100,#f8f9f9)}.tabulator-navigator-desktop .tabulator-tableholder::-webkit-scrollbar-thumb{background:#c1c1c1}.tabulator-navigator-desktop .tabulator-tableholder::-webkit-scrollbar-thumb:hover{background:#a1a1a1}.tabulator,.tabulator .tabulator-header,.tabulator .tabulator-header .tabulator-col{background:0 0}.tabulator-sticky{overflow:unset}.tabulator-sticky .tabulator-header{z-index:2;position:-webkit-sticky;position:sticky;top:0;background:#fff}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{--sorter-size:4px;--sorter-active:var(--tabulator-primary-color);--sorter-inactive:var(--tabulator-light-gray);height:0;border:0;position:relative;margin-top:var(--sorter-size)}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow::after,.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow::before{content:"";width:0;height:0;right:0;position:absolute;border-left:var(--sorter-size) solid transparent;border-right:var(--sorter-size) solid transparent}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow::before{top:calc(var(--sorter-size) * -1 - 1px);border-top:none;border-bottom:var(--sorter-size) solid var(--sorter-inactive)}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow::after{bottom:calc(var(--sorter-size) * -1 - 1px);border-bottom:none;border-top:var(--sorter-size) solid var(--sorter-inactive)}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow:before{border-bottom-color:var(--sorter-active);top:0}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow:after{border:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow:before{border:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow:after{border-top-color:var(--sorter-active);bottom:0;bottom:calc(var(--sorter-size)/ 2)}.tabulator-tooltip{background:#fff}.tabulator-row .tabulator-responsive-collapse table{font-size:inherit}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle{width:100%;height:100%;position:absolute;border-radius:0;background:0 0}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle>div{border-radius:var(--tabulator-icon-size);background:var(--tabulator-gray);display:inline-flex;align-items:center;justify-content:center;width:var(--tabulator-icon-size);height:var(--tabulator-icon-size);border-radius:var(--tabulator-icon-size);background:var(--tabulator-gray)}.tabulator .tabulator-header .tabulator-col .tabulator-col-content{padding:var(--tabulator-margin)}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input{font-size:unset}.tabulator .tabulator-header{border-top:0;border-bottom-width:1px;font-weight:400;text-transform:uppercase;font-size:.8em}.tabulator-row{background:#fff}.tabulator-row.tabulator-row-even{background:var(--bs-gray-100,#f8f9f9)}.tabulator-row.tabulator-row-even.tabulator-selected{background:#9abcea}.tabulator-cell-btn .btn>*{pointer-events:none}.tabulator-row .tabulator-cell.tabulator-cell-btn{padding:6px;display:inline-flex;align-items:center;justify-content:center}.tabulator-row .tabulator-cell.tabulator-cell-btn .btn{width:100%;min-height:30px;line-height:1;padding:0 .75rem;display:inline-flex;align-items:center;justify-content:center}.tabulator-row .tabulator-cell.tabulator-cell-btn .btn l-i+span{margin-left:.25rem}.tabulator-row .tabulator-cell.tabulator-cell-btn input[type=checkbox]{margin:0}.tabulator .tabulator-footer{background-color:transparent;border-top:0}.tabulator .tabulator-footer .tabulator-page{border-radius:0;margin-top:0}.tabulator .tabulator-footer .tabulator-page svg{width:1em;height:1em}.tabulator .tabulator-footer .tabulator-page.active{background-color:var(--tabulator-primary-color);border-color:var(--tabulator-primary-color)}.tabulator .tabulator-footer .tabulator-footer-contents{flex-wrap:wrap}.tabulator .tabulator-footer .tabulator-page-counter{min-height:32px;display:flex;align-items:center}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input:focus{border-color:var(--tabulator-primary-hover-color)}.tabulator .tabulator-footer .tabulator-page:not(.disabled):hover{color:var(--tabulator-primary-hover-color)}.tabulator-row .editing-only{visibility:hidden}.tabulator-row.tabulator-row-editing .editing-only{visibility:visible}.tabulator-row .edited-only{visibility:hidden}.tabulator-row.tabulator-row-edited .edited-only{visibility:visible}.tabulator-row .tabulator-editable{cursor:text}.tabulator-row .tabulator-editable>span{display:inline-block;margin:var(--tabulator-padded-margin)}.tabulator-row .tabulator-editable>*>input,.tabulator-row .tabulator-editable>input{margin-left:var(--tabulator-padded-margin)}.tabulator-row .tabulator-editable>input[type=checkbox]{position:absolute;width:var(--tabulator-icon-size);height:var(--tabulator-icon-size);margin-left:var(--tabulator-margin);margin-top:var(--tabulator-margin)!important}.tabulator-row .tabulator-cell.tabulator-editing{border:0;box-shadow:inset 0 0 0 1px var(--tabulator-primary-hover-color)}.tabulator.tabulator-table-editing .tabulator-row-editing .tabulator-editable,.tabulator:not(.tabulator-table-editing) .tabulator-row:hover .tabulator-editable{background:var(--tabulator-highlight-color)}.tabulator-row.tabulator-row-invalid .tabulator-editable{background:var(--tabulator-invalid-color)}.tabulator-row.tabulator-row-valid .tabulator-editable{background:var(--tabulator-valid-color)}em.tabulator-value-placeholder{color:#bbb}.tabulator-row .tabulator-cell.tabulator-cell-narrow{padding-left:var(--tabulator-narrow-margin);padding-right:var(--tabulator-narrow-margin)}.tabulator-cell-right{text-align:right}.tabulator-cell-right input{text-align:right}.tabulator-cell img{margin:0;display:block}.tabulator-responsive-flex-open{display:flex;flex-wrap:wrap}.tabulator-responsive-flex-cell{order:9999;text-align:left!important}.tabulator-responsive-flex-cell input{text-align:left!important}.tabulator-responsive-flex-cell[data-label]::before{content:attr(data-label);width:var(--tabulator-responsive-label-width);display:inline-flex;height:100%;align-items:center;float:left;font-weight:700;text-align:left!important;font-size:var(--tabulator-responsive-label-fs)!important}.tabulator-editing.tabulator-responsive-flex-cell::before{margin-left:var(--tabulator-margin);width:calc(var(--tabulator-responsive-label-width) - var(--tabulator-margin))}.tabulator-editing.tabulator-responsive-flex-cell input,.tabulator-editing.tabulator-responsive-flex-cell select{max-width:calc(100% - var(--tabulator-responsive-label-width) - var(--tabulator-margin))}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box .tabulator-row-handle-bar{height:2px}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box{width:16px}.tabulator-group{display:flex;align-items:center}.tabulator-row.tabulator-group .tabulator-arrow{display:inline-block;width:0;height:0;margin-right:var(--tabulator-icon-size);border-top:6px solid transparent;border-bottom:6px solid transparent;border-right:0;border-left:6px solid #666;vertical-align:middle}.tabulator-row.tabulator-group.tabulator-group-visible .tabulator-arrow{transform:rotate(90deg);margin-right:var(--tabulator-icon-size);border-top:6px solid transparent;border-bottom:6px solid transparent;border-right:0;border-left:6px solid #666}.tabulator-distinct-tree .tabulator-tree-level-1+.tabulator-tree-level-0{border-top:1px solid #666}.tabulator-row:not(.tabulator-tree-level-0) .tree-0-only{visibility:hidden}.tabulator-row:not(.tabulator-tree-level-1) .tree-1-only{visibility:hidden}.tabulator-row .tabulator-cell .tabulator-data-tree-control{background:rgba(0,0,0,.1);border:1px solid #666;height:14px;margin-right:6px;width:14px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after,.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand,.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#666}.tabulator-row .tabulator-cell .tabulator-data-tree-control:hover{background:#fff}';

  // src/utils/injectStyles.js
  var injectStyles_default = (name, styles) => {
    if (!document.head.querySelector(`#${name}-style`)) {
      const style = document.createElement("style");
      style.id = `${name}-style`;
      style.innerText = styles;
      document.head.append(style);
    }
  };

  // src/tabulator-grid.js
  injectStyles_default("tabulator-grid", tabulator_bootstrap5_min_default.replace("/*# sourceMappingURL=tabulator_bootstrap5.min.css.map */", "") + tabulator_grid_min_default);
  defineEl_default("tabulator-grid", TabulatorGrid_default);
  var tabulator_grid_default = TabulatorGrid_default;
})();
