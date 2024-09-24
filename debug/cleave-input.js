(() => {
  // node_modules/cleave-es6/src/CleaveUtils.js
  var CleaveUtils = class {
    static strip(value, re) {
      return value.replace(re, "");
    }
    static filterByRegex(str, expr, delimiters = []) {
      const regex = new RegExp(expr);
      return str.split("").filter((char, i) => {
        if (delimiters.includes(char)) {
          return true;
        }
        return regex.test(char);
      }).join("");
    }
    static getPostDelimiter(value, delimiter, delimiters) {
      if (delimiters.length === 0) {
        return value.slice(-delimiter.length) === delimiter ? delimiter : "";
      }
      let matchedDelimiter = "";
      for (let i = 0; i < delimiters.length; i++) {
        let current = delimiters[i];
        if (value.slice(-current.length) === current) {
          matchedDelimiter = current;
          break;
        }
      }
      return matchedDelimiter;
    }
    static getDelimiterREByDelimiter(delimiter) {
      return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), "g");
    }
    static getNextCursorPosition(prevPos, oldValue, newValue, delimiter, delimiters) {
      if (oldValue.length === prevPos) {
        return newValue.length;
      }
      return prevPos + this.getPositionOffset(prevPos, oldValue, newValue, delimiter, delimiters);
    }
    static getPositionOffset(prevPos, oldValue, newValue, delimiter, delimiters) {
      let oldRawValue, newRawValue, lengthOffset;
      oldRawValue = this.stripDelimiters(oldValue.slice(0, prevPos), delimiter, delimiters);
      newRawValue = this.stripDelimiters(newValue.slice(0, prevPos), delimiter, delimiters);
      lengthOffset = oldRawValue.length - newRawValue.length;
      return lengthOffset !== 0 ? lengthOffset / Math.abs(lengthOffset) : 0;
    }
    static stripDelimiters(value, delimiter, delimiters) {
      if (delimiters.length === 0) {
        let delimiterRE = delimiter ? this.getDelimiterREByDelimiter(delimiter) : "";
        return value.replace(delimiterRE, "");
      }
      delimiters.forEach((current) => {
        current.split("").forEach((letter) => {
          value = value.replace(this.getDelimiterREByDelimiter(letter), "");
        });
      });
      return value;
    }
    static headStr(str, length) {
      return str.slice(0, length);
    }
    /**
     * Get raw max length
     * @param {Array} blocks
     * @returns {Number}
     */
    static getMaxLength(blocks) {
      return blocks.reduce((previous, current) => {
        return previous + current;
      }, 0);
    }
    // strip prefix
    // Before type  |   After type    |     Return value
    // PEFIX-...    |   PEFIX-...     |     ''
    // PREFIX-123   |   PEFIX-123     |     123
    // PREFIX-123   |   PREFIX-23     |     23
    // PREFIX-123   |   PREFIX-1234   |     1234
    static getPrefixStrippedValue(value, prefix, prefixLength, prevResult, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix) {
      if (prefixLength === 0) {
        return value;
      }
      if (value === prefix && value !== "") {
        return "";
      }
      if (signBeforePrefix && value.slice(0, 1) == "-") {
        let prev = prevResult.slice(0, 1) == "-" ? prevResult.slice(1) : prevResult;
        return "-" + this.getPrefixStrippedValue(
          value.slice(1),
          prefix,
          prefixLength,
          prev,
          delimiter,
          delimiters,
          noImmediatePrefix,
          tailPrefix,
          signBeforePrefix
        );
      }
      if (prevResult.slice(0, prefixLength) !== prefix && !tailPrefix) {
        if (noImmediatePrefix && !prevResult && value) return value;
        return "";
      } else if (prevResult.slice(-prefixLength) !== prefix && tailPrefix) {
        if (noImmediatePrefix && !prevResult && value) return value;
        return "";
      }
      let prevValue = this.stripDelimiters(prevResult, delimiter, delimiters);
      if (value.slice(0, prefixLength) !== prefix && !tailPrefix) {
        return prevValue.slice(prefixLength);
      } else if (value.slice(-prefixLength) !== prefix && tailPrefix) {
        return prevValue.slice(0, -prefixLength - 1);
      }
      return tailPrefix ? value.slice(0, -prefixLength) : value.slice(prefixLength);
    }
    static getFirstDiffIndex(prev, current) {
      let index = 0;
      while (prev.charAt(index) === current.charAt(index)) {
        if (prev.charAt(index++) === "") {
          return -1;
        }
      }
      return index;
    }
    static getFormattedValue(value, blocks, blocksLength, delimiter, delimiters, delimiterLazyShow) {
      let result = "", multipleDelimiters = delimiters.length > 0, currentDelimiter = "";
      if (blocksLength === 0) {
        return value;
      }
      blocks.forEach((length, index) => {
        if (value.length > 0) {
          let sub = value.slice(0, length), rest = value.slice(length);
          if (multipleDelimiters) {
            currentDelimiter = delimiters[delimiterLazyShow ? index - 1 : index] || currentDelimiter;
          } else {
            currentDelimiter = delimiter;
          }
          if (delimiterLazyShow) {
            if (index > 0) {
              result += currentDelimiter;
            }
            result += sub;
          } else {
            result += sub;
            if (sub.length === length && index < blocksLength - 1) {
              result += currentDelimiter;
            }
          }
          value = rest;
        }
      });
      return result;
    }
    /**
     * Move cursor to the end the first time user focuses on an input with prefix
     * @param {HTMLElement} el
     * @param {string} prefix
     * @param {string} delimiter
     * @param {Array} delimiters
     * @param {Boolean} tailPrefix
     * @returns {void}
     */
    static fixPrefixCursor(el, prefix, delimiter, delimiters, tailPrefix = false) {
      if (!el) {
        return;
      }
      let val = el.value, appendix = delimiter || delimiters[0] || " ";
      if (!el.setSelectionRange || !prefix) {
        return;
      }
      if (!tailPrefix && prefix.length + appendix.length <= val.length) {
        return;
      }
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = tailPrefix ? el.value.length - prefix.length : el.value.length;
      }, 0);
    }
    /**
     * Check if input field is fully selected
     * @param {*} value
     * @returns {Boolean}
     */
    static checkFullSelection(value) {
      try {
        let selection = window.getSelection() || document.getSelection() || {};
        return selection.toString().length === value.length;
      } catch (ex) {
      }
      return false;
    }
    static setSelection(element, position, doc) {
      if (element !== this.getActiveElement(doc)) {
        return;
      }
      if (element && element.value.length <= position) {
        return;
      }
      if (element.createTextRange) {
        let range = element.createTextRange();
        range.move("character", position);
        range.select();
      } else {
        try {
          element.setSelectionRange(position, position);
        } catch (e) {
          console.warn("The input element type does not support selection");
        }
      }
    }
    static getActiveElement(parent) {
      let activeElement = parent.activeElement;
      if (activeElement && activeElement.shadowRoot) {
        return this.getActiveElement(activeElement.shadowRoot);
      }
      return activeElement;
    }
    // static isAndroid() {
    //   return navigator && /android/i.test(navigator.userAgent);
    // }
    static getDateTimeValue(value, dateFormatter, timeFormatter, delimiters) {
      let splitDelimiterIndex = dateFormatter.getBlocks().length - 1;
      let splitDelimiter = delimiters[splitDelimiterIndex];
      let dateMaxStringLength = dateFormatter.getMaxStringLength();
      let splittedValues = value.split(splitDelimiter);
      if (splittedValues.length == 1 && value.length > dateMaxStringLength) {
        splittedValues = [value.substring(0, dateMaxStringLength), value.substring(dateMaxStringLength)];
      }
      let dateValue = splittedValues[0] ? dateFormatter.getValidatedDate(splittedValues[0]) : "";
      let timeValue = splittedValues[1] ? timeFormatter.getValidatedTime(splittedValues[1]) : "";
      if (timeValue) value = dateValue + timeValue;
      else value = dateValue;
      return value;
    }
  };
  var CleaveUtils_default = CleaveUtils;

  // node_modules/cleave-es6/src/CleaveDate.js
  var CleaveDate = class {
    constructor(datePattern, dateMin, dateMax) {
      this.date = [];
      this.blocks = [];
      this.datePattern = datePattern;
      this.dateMin = dateMin.split("-").reverse().map((x) => {
        return parseInt(x, 10);
      });
      if (this.dateMin.length === 2) this.dateMin.unshift(0);
      this.dateMax = dateMax.split("-").reverse().map((x) => {
        return parseInt(x, 10);
      });
      if (this.dateMax.length === 2) this.dateMax.unshift(0);
      this.initBlocks();
    }
    initBlocks() {
      this.datePattern.forEach((value) => {
        if (value === "Y") {
          this.blocks.push(4);
        } else {
          this.blocks.push(2);
        }
      });
    }
    getISOFormatDate() {
      let date = this.date;
      return date[2] ? date[2] + "-" + this.addLeadingZero(date[1]) + "-" + this.addLeadingZero(date[0]) : "";
    }
    getBlocks() {
      return this.blocks;
    }
    getMaxStringLength() {
      return this.getBlocks().reduce(function(a, b) {
        return a + b;
      }, 0);
    }
    getValidatedDate(value) {
      let result = "";
      value = value.replace(/[^\d]/g, "");
      this.blocks.forEach((length, index) => {
        if (value.length > 0) {
          let sub = value.slice(0, length), sub0 = sub.slice(0, 1), rest = value.slice(length);
          switch (this.datePattern[index]) {
            case "d":
              if (sub === "00") {
                sub = "01";
              } else if (parseInt(sub0, 10) > 3) {
                sub = "0" + sub0;
              } else if (parseInt(sub, 10) > 31) {
                sub = "31";
              }
              break;
            case "m":
              if (sub === "00") {
                sub = "01";
              } else if (parseInt(sub0, 10) > 1) {
                sub = "0" + sub0;
              } else if (parseInt(sub, 10) > 12) {
                sub = "12";
              }
              break;
          }
          result += sub;
          value = rest;
        }
      });
      return this.getFixedDateString(result);
    }
    getFixedDateString(value) {
      let datePattern = this.datePattern, date = [], dayIndex = 0, monthIndex = 0, yearIndex = 0, dayStartIndex = 0, monthStartIndex = 0, yearStartIndex = 0, day, month, year, fullYearDone = false;
      if (value.length === 4 && datePattern[0].toLowerCase() !== "y" && datePattern[1].toLowerCase() !== "y") {
        dayStartIndex = datePattern[0] === "d" ? 0 : 2;
        monthStartIndex = 2 - dayStartIndex;
        day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
        month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
        date = this.getFixedDate(day, month, 0);
      }
      if (value.length === 8) {
        datePattern.forEach((type, index) => {
          switch (type) {
            case "d":
              dayIndex = index;
              break;
            case "m":
              monthIndex = index;
              break;
            default:
              yearIndex = index;
              break;
          }
        });
        yearStartIndex = yearIndex * 2;
        dayStartIndex = dayIndex <= yearIndex ? dayIndex * 2 : dayIndex * 2 + 2;
        monthStartIndex = monthIndex <= yearIndex ? monthIndex * 2 : monthIndex * 2 + 2;
        day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
        month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
        year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);
        fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;
        date = this.getFixedDate(day, month, year);
      }
      if (value.length === 4 && (datePattern[0] === "y" || datePattern[1] === "y")) {
        monthStartIndex = datePattern[0] === "m" ? 0 : 2;
        yearStartIndex = 2 - monthStartIndex;
        month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
        year = parseInt(value.slice(yearStartIndex, yearStartIndex + 2), 10);
        fullYearDone = value.slice(yearStartIndex, yearStartIndex + 2).length === 2;
        date = [0, month, year];
      }
      if (value.length === 6 && (datePattern[0] === "Y" || datePattern[1] === "Y")) {
        monthStartIndex = datePattern[0] === "m" ? 0 : 4;
        yearStartIndex = 2 - 0.5 * monthStartIndex;
        month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
        year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);
        fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;
        date = [0, month, year];
      }
      date = this.getRangeFixedDate(date);
      this.date = date;
      let result = date.length === 0 ? value : datePattern.reduce((previous, current) => {
        switch (current) {
          case "d":
            return previous + (date[0] === 0 ? "" : this.addLeadingZero(date[0]));
          case "m":
            return previous + (date[1] === 0 ? "" : this.addLeadingZero(date[1]));
          case "y":
            return previous + (fullYearDone ? this.addLeadingZeroForYear(date[2], false) : "");
          case "Y":
            return previous + (fullYearDone ? this.addLeadingZeroForYear(date[2], true) : "");
        }
      }, "");
      return result;
    }
    getRangeFixedDate(date) {
      let datePattern = this.datePattern, dateMin = this.dateMin || [], dateMax = this.dateMax || [];
      if (!date.length || dateMin.length < 3 && dateMax.length < 3) return date;
      if (datePattern.find((x) => {
        return x.toLowerCase() === "y";
      }) && date[2] === 0)
        return date;
      if (dateMax.length && (dateMax[2] < date[2] || dateMax[2] === date[2] && (dateMax[1] < date[1] || dateMax[1] === date[1] && dateMax[0] < date[0])))
        return dateMax;
      if (dateMin.length && (dateMin[2] > date[2] || dateMin[2] === date[2] && (dateMin[1] > date[1] || dateMin[1] === date[1] && dateMin[0] > date[0])))
        return dateMin;
      return date;
    }
    getFixedDate(day, month, year) {
      day = Math.min(day, 31);
      month = Math.min(month, 12);
      year = parseInt(year || 0, 10);
      if (month < 7 && month % 2 === 0 || month > 8 && month % 2 === 1) {
        day = Math.min(day, month === 2 ? this.isLeapYear(year) ? 29 : 28 : 30);
      }
      return [day, month, year];
    }
    isLeapYear(year) {
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }
    addLeadingZero(number) {
      return (number < 10 ? "0" : "") + number;
    }
    addLeadingZeroForYear(number, fullYearMode) {
      if (fullYearMode) {
        return (number < 10 ? "000" : number < 100 ? "00" : number < 1e3 ? "0" : "") + number;
      }
      return (number < 10 ? "0" : "") + number;
    }
  };
  var CleaveDate_default = CleaveDate;

  // node_modules/cleave-es6/src/CleaveTime.js
  var CleaveTime = class {
    constructor(timePattern, timeFormat) {
      this.time = [];
      this.blocks = [];
      this.timePattern = timePattern;
      this.timeFormat = timeFormat;
      this.initBlocks();
    }
    initBlocks() {
      this.timePattern.forEach(() => {
        this.blocks.push(2);
      });
    }
    getISOFormatTime() {
      let time = this.time;
      return time[2] ? this.addLeadingZero(time[0]) + ":" + this.addLeadingZero(time[1]) + ":" + this.addLeadingZero(time[2]) : "";
    }
    getBlocks() {
      return this.blocks;
    }
    getTimeFormatOptions() {
      if (String(this.timeFormat) === "12") {
        return {
          maxHourFirstDigit: 1,
          maxHours: 12,
          maxMinutesFirstDigit: 5,
          maxMinutes: 60
        };
      }
      return {
        maxHourFirstDigit: 2,
        maxHours: 23,
        maxMinutesFirstDigit: 5,
        maxMinutes: 60
      };
    }
    getValidatedTime(value) {
      let result = "";
      value = value.replace(/[^\d]/g, "");
      let timeFormatOptions = this.getTimeFormatOptions();
      this.blocks.forEach((length, index) => {
        if (value.length > 0) {
          let sub = value.slice(0, length), sub0 = sub.slice(0, 1), rest = value.slice(length);
          switch (this.timePattern[index]) {
            case "h":
              if (parseInt(sub0, 10) > timeFormatOptions.maxHourFirstDigit) {
                sub = "0" + sub0;
              } else if (parseInt(sub, 10) > timeFormatOptions.maxHours) {
                sub = timeFormatOptions.maxHours + "";
              }
              break;
            case "m":
            case "s":
              if (parseInt(sub0, 10) > timeFormatOptions.maxMinutesFirstDigit) {
                sub = "0" + sub0;
              } else if (parseInt(sub, 10) > timeFormatOptions.maxMinutes) {
                sub = timeFormatOptions.maxMinutes + "";
              }
              break;
          }
          result += sub;
          value = rest;
        }
      });
      return this.getFixedTimeString(result);
    }
    getFixedTimeString(value) {
      let timePattern = this.timePattern, time = [], secondIndex = 0, minuteIndex = 0, hourIndex = 0, secondStartIndex = 0, minuteStartIndex = 0, hourStartIndex = 0, second, minute, hour;
      if (value.length === 6) {
        timePattern.forEach((type, index) => {
          switch (type) {
            case "s":
              secondIndex = index * 2;
              break;
            case "m":
              minuteIndex = index * 2;
              break;
            case "h":
              hourIndex = index * 2;
              break;
          }
        });
        hourStartIndex = hourIndex;
        minuteStartIndex = minuteIndex;
        secondStartIndex = secondIndex;
        second = parseInt(value.slice(secondStartIndex, secondStartIndex + 2), 10);
        minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
        hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);
        time = this.getFixedTime(hour, minute, second);
      }
      if (value.length === 4 && this.timePattern.indexOf("s") < 0) {
        timePattern.forEach((type, index) => {
          switch (type) {
            case "m":
              minuteIndex = index * 2;
              break;
            case "h":
              hourIndex = index * 2;
              break;
          }
        });
        hourStartIndex = hourIndex;
        minuteStartIndex = minuteIndex;
        second = 0;
        minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
        hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);
        time = this.getFixedTime(hour, minute, second);
      }
      this.time = time;
      return time.length === 0 ? value : timePattern.reduce((previous, current) => {
        switch (current) {
          case "s":
            return previous + this.addLeadingZero(time[2]);
          case "m":
            return previous + this.addLeadingZero(time[1]);
          case "h":
            return previous + this.addLeadingZero(time[0]);
        }
      }, "");
    }
    getFixedTime(hour, minute, second) {
      second = Math.min(parseInt(second || 0, 10), 60);
      minute = Math.min(minute, 60);
      hour = Math.min(hour, 60);
      return [hour, minute, second];
    }
    addLeadingZero(number) {
      return (number < 10 ? "0" : "") + number;
    }
  };
  var CleaveTime_default = CleaveTime;

  // node_modules/cleave-es6/src/CleaveNumber.js
  var groupStyle = {
    thousand: "thousand",
    lakh: "lakh",
    wan: "wan",
    none: "none"
  };
  var CleaveNumber = class {
    constructor(numeralDecimalMark, numeralIntegerScale, numeralDecimalScale, numeralThousandsGroupStyle, numeralPositiveOnly, stripLeadingZeroes, prefix, signBeforePrefix, tailPrefix, delimiter) {
      this.numeralDecimalMark = numeralDecimalMark || ".";
      this.numeralIntegerScale = numeralIntegerScale > 0 ? numeralIntegerScale : 0;
      this.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
      this.numeralThousandsGroupStyle = numeralThousandsGroupStyle || groupStyle.thousand;
      this.numeralPositiveOnly = !!numeralPositiveOnly;
      this.stripLeadingZeroes = stripLeadingZeroes !== false;
      this.prefix = prefix || prefix === "" ? prefix : "";
      this.signBeforePrefix = !!signBeforePrefix;
      this.tailPrefix = !!tailPrefix;
      this.delimiter = delimiter || delimiter === "" ? delimiter : ",";
      this.delimiterRE = delimiter ? new RegExp("\\" + delimiter, "g") : "";
    }
    getRawValue(value) {
      return value.replace(this.delimiterRE, "").replace(this.numeralDecimalMark, ".");
    }
    /**
     * @param {string} value
     * @returns {string}
     */
    padDecimal(value) {
      if (this.numeralDecimalScale === 0) {
        return value;
      }
      value = value.toString();
      let partInteger = value;
      let partDecimal = "";
      if (value.indexOf(this.numeralDecimalMark) >= 0) {
        let parts = value.split(this.numeralDecimalMark);
        partInteger = parts[0];
        partDecimal = this.numeralDecimalMark + parts[1].slice(0, this.numeralDecimalScale);
      }
      if (partInteger.toString() === "") {
        partInteger = "0";
      }
      partDecimal = String(partDecimal === "" ? this.numeralDecimalMark : partDecimal).padEnd(
        this.numeralDecimalScale + this.numeralDecimalMark.length,
        "0"
      );
      return partInteger + partDecimal;
    }
    format(value) {
      let parts, partSign, partSignAndPrefix, partInteger, partDecimal = "";
      if (typeof this.prefix !== "undefined") {
        value = value.replace(this.prefix, "");
      }
      value = value.replace(/[A-Za-z]/g, "").replace(this.numeralDecimalMark, "M").replace(/[^\dM-]/g, "").replace(/^\-/, "N").replace(/\-/g, "").replace("N", this.numeralPositiveOnly ? "" : "-").replace("M", this.numeralDecimalMark);
      if (this.stripLeadingZeroes) {
        value = value.replace(/^(-)?0+(?=\d)/, "$1");
      }
      partSign = value.slice(0, 1) === "-" ? "-" : "";
      if (typeof this.prefix != "undefined") {
        if (this.signBeforePrefix) {
          partSignAndPrefix = partSign + this.prefix;
        } else {
          partSignAndPrefix = this.prefix + partSign;
        }
      } else {
        partSignAndPrefix = partSign;
      }
      partInteger = value;
      if (value.indexOf(this.numeralDecimalMark) >= 0) {
        parts = value.split(this.numeralDecimalMark);
        partInteger = parts[0];
        partDecimal = this.numeralDecimalMark + parts[1].slice(0, this.numeralDecimalScale);
      }
      if (partSign === "-") {
        partInteger = partInteger.slice(1);
      }
      if (this.numeralIntegerScale > 0) {
        partInteger = partInteger.slice(0, this.numeralIntegerScale);
      }
      switch (this.numeralThousandsGroupStyle) {
        case groupStyle.lakh:
          partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, "$1" + this.delimiter);
          break;
        case groupStyle.wan:
          partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, "$1" + this.delimiter);
          break;
        case groupStyle.thousand:
          partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, "$1" + this.delimiter);
          break;
      }
      if (this.tailPrefix) {
        return partSign + partInteger.toString() + (this.numeralDecimalScale > 0 ? partDecimal.toString() : "") + this.prefix;
      }
      return partSignAndPrefix + partInteger.toString() + (this.numeralDecimalScale > 0 ? partDecimal.toString() : "");
    }
  };
  var CleaveNumber_default = CleaveNumber;

  // node_modules/cleave-es6/src/Cleave.js
  var defaultConfig = {
    // time
    time: false,
    timePattern: ["h", "m", "s"],
    timeFormat: "24",
    timeFormatter: null,
    // date
    date: false,
    datePattern: ["d", "m", "Y"],
    dateMin: "",
    dateMax: "",
    dateFormatter: null,
    // numeral
    numeral: false,
    numeralIntegerScale: 0,
    numeralDecimalScale: 2,
    numeralDecimalMark: ".",
    numeralThousandsGroupStyle: "thousand",
    numeralDecimalPadding: false,
    numeralPositiveOnly: false,
    numeralPositiveStrict: false,
    stripLeadingZeroes: false,
    signBeforePrefix: false,
    tailPrefix: false,
    numeralFormatter: null,
    // other
    swapHiddenInput: false,
    numericOnly: false,
    hexadecimalOnly: false,
    uppercase: false,
    lowercase: false,
    ucfirst: false,
    prefix: "",
    noImmediatePrefix: false,
    rawValueTrimPrefix: false,
    copyDelimiter: false,
    delimiter: "",
    delimiterLazyShow: false,
    delimiters: [],
    blocks: [],
    allowedChars: null,
    onValueChanged: null,
    onBeforeInput: null,
    onAfterInput: null,
    maxLength: 0
  };
  var events = ["input", "keydown", "focus", "cut", "copy", "blur", "compositionstart", "compositionend"];
  var instances = /* @__PURE__ */ new WeakMap();
  var Cleave = class {
    /**
     *
     * @param {HTMLInputElement} el
     * @param {CleaveConfig} opts
     */
    constructor(el, opts = {}) {
      if (!(el instanceof HTMLInputElement)) {
        console.error("Invalid element");
        return;
      }
      this.config = Object.assign(
        {},
        defaultConfig,
        {
          delimiter: this.getDefaultDelimiter(opts)
        },
        opts
      );
      if (this.isDate() || this.isTime() && this.config.timeFormat === "24") {
        this.config.numericOnly = true;
      }
      if ((this.config.numericOnly || this.config.numeral) && !el.hasAttribute("inputmode")) {
        el.setAttribute("inputmode", "decimal");
      }
      this.initValue = el.value;
      this.element = el;
      instances.set(el, this);
      this.result = "";
      this.init();
    }
    /**
     * @param {HTMLElement} el
     * @returns {Cleave}
     */
    static getInstance(el) {
      if (instances.has(el)) {
        return instances.get(el);
      }
    }
    /**
     * @returns {Boolean}
     */
    isTime() {
      return this.config.time === true;
    }
    /**
     * @returns {Boolean}
     */
    isDate() {
      return this.config.date === true;
    }
    /**
     * @returns {Boolean}
     */
    isNumeral() {
      return this.config.numeral === true;
    }
    /**
     * @param {CleaveConfig} opts
     * @returns {string|Array}
     */
    getDefaultDelimiter(opts) {
      if (opts.date && opts.time) {
        return [this.getDelimitersFromPattern(opts.datePattern, "/"), " ", this.getDelimitersFromPattern(opts.timePattern, ":")].flat();
      }
      return opts.date ? "/" : opts.time ? ":" : opts.numeral ? "," : " ";
    }
    /**
     *
     * @param {Array} patternArray
     * @param {string} delimiterToInsert
     * @returns {string}
     */
    getDelimitersFromPattern(patternArray, delimiterToInsert) {
      return patternArray.flatMap(function(value, index) {
        if (index == 0) return [];
        return delimiterToInsert;
      });
    }
    init() {
      this.lastInputValue = "";
      this.isBackward = false;
      this.isComposition = false;
      this.initSwapHiddenInput();
      this.handleEvent = (event) => {
        this._handleEvent(event);
      };
      events.forEach((type) => {
        this.element.addEventListener(type, this);
      });
      this.setBlocks();
      if (this.initValue || this.config.prefix && !this.config.noImmediatePrefix) {
        this.setRawValue(this.initValue);
      }
    }
    handleEvent(event) {
      this._handleEvent(event);
    }
    _handleEvent(event) {
      if (events.includes(event.type)) {
        this[`on${event.type}`](event);
      }
    }
    setBlocks(blocks = null) {
      if (blocks) {
        this.config.blocks = blocks;
      }
      this.config.maxLength = CleaveUtils_default.getMaxLength(this.config.blocks);
      this.initDateFormatter();
      this.initTimeFormatter();
      this.initNumeralFormatter();
    }
    setConfig(k, v) {
      this.config[k] = v;
    }
    initSwapHiddenInput() {
      if (!this.config.swapHiddenInput) {
        return;
      }
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = this.element.name;
      hiddenInput.value = this.initValue;
      this.element.parentNode.insertBefore(hiddenInput, this.element.nextSibling);
      this.elementSwapHidden = hiddenInput;
      this.element.name = `cleave_${this.element.name}`;
    }
    initNumeralFormatter() {
      const pps = this.config;
      if (!pps.numeral) {
        return;
      }
      pps.numeralFormatter = new CleaveNumber_default(
        pps.numeralDecimalMark,
        pps.numeralIntegerScale,
        pps.numeralDecimalScale,
        pps.numeralThousandsGroupStyle,
        pps.numeralPositiveOnly,
        pps.stripLeadingZeroes,
        pps.prefix,
        pps.signBeforePrefix,
        pps.tailPrefix,
        pps.delimiter
      );
    }
    initTimeFormatter() {
      const pps = this.config;
      if (!pps.time) {
        return;
      }
      pps.timeFormatter = new CleaveTime_default(pps.timePattern, pps.timeFormat);
      const timeFormatterBlocks = pps.timeFormatter.getBlocks();
      if (!pps.date) {
        pps.blocks = timeFormatterBlocks;
      } else {
        pps.blocks = pps.blocks.concat(timeFormatterBlocks);
      }
      pps.maxLength = CleaveUtils_default.getMaxLength(pps.blocks);
    }
    initDateFormatter() {
      const pps = this.config;
      if (!pps.date) {
        return;
      }
      pps.dateFormatter = new CleaveDate_default(pps.datePattern, pps.dateMin, pps.dateMax);
      pps.blocks = pps.dateFormatter.getBlocks();
      pps.maxLength = CleaveUtils_default.getMaxLength(pps.blocks);
    }
    onkeydown(event) {
      const pps = this.config;
      const charCode = event.which || event.keyCode;
      this.lastInputValue = this.element.value;
      this.isBackward = charCode === 8;
    }
    oncompositionstart(event) {
      this.isComposition = true;
    }
    oncompositionend(event) {
      this.isComposition = false;
      this.oninput(event);
    }
    onblur(event) {
      const pps = this.config;
      let value = parseFloat(this.getRawValue(true));
      if (this.element.value.length > 0) {
        if (pps.numeral && (isNaN(value) || // if `.` only entered
        pps.numeralPositiveStrict && value === 0)) {
          this.result = "";
          this.updateValueState();
          return;
        }
        if (pps.numeral && pps.numeralDecimalPadding && pps.numeralDecimalScale > 0) {
          this.result = pps.numeralFormatter.padDecimal(this.element.value);
          this.updateValueState();
        }
      }
    }
    oninput(event) {
      const pps = this.config;
      this.dispatch("beforeinput", {
        event
      });
      if (pps.onBeforeInput) {
        const res = pps.onBeforeInput(this);
        if (res === false) {
          return;
        }
      }
      if (pps.allowedChars) {
        const data = this.element.value;
        if (data) {
          const del = pps.delimiters.slice();
          del.push(pps.delimiter);
          this.element.value = CleaveUtils_default.filterByRegex(this.element.value, pps.allowedChars, del);
          if (this.element.value != data && event.inputType == "insertText") {
            return;
          }
        }
      }
      if (this.isComposition) {
        this.result = event.target.value;
        this.updateValueState();
        return;
      }
      this.isBackward = this.isBackward || event.inputType === "deleteContentBackward";
      let postDelimiter = CleaveUtils_default.getPostDelimiter(this.lastInputValue, pps.delimiter, pps.delimiters);
      if (this.isBackward && postDelimiter) {
        pps.postDelimiterBackspace = postDelimiter;
      } else {
        pps.postDelimiterBackspace = false;
      }
      this.formatInput(this.element.value);
      this.dispatch("afterinput", {
        event
      });
      if (pps.onAfterInput) {
        pps.onAfterInput(this);
      }
    }
    dispatch(name, detail = {}) {
      const bubbles = true;
      this.element.dispatchEvent(
        new CustomEvent("cleave." + name, {
          bubbles,
          detail
        })
      );
    }
    onfocus() {
      const pps = this.config;
      this.lastInputValue = this.element.value;
      if (pps.prefix && pps.noImmediatePrefix && !this.element.value) {
        this.formatInput(pps.prefix);
      }
      CleaveUtils_default.fixPrefixCursor(this.element, pps.prefix, pps.delimiter, pps.delimiters, pps.tailPrefix);
    }
    oncut(e) {
      if (!CleaveUtils_default.checkFullSelection(this.element.value)) return;
      this.copyClipboardData(e);
      if (!this.element.readonly) {
        this.formatInput("");
      }
    }
    oncopy(e) {
      if (!CleaveUtils_default.checkFullSelection(this.element.value)) return;
      this.copyClipboardData(e);
    }
    copyClipboardData(e) {
      const pps = this.config;
      let inputValue = this.element.value;
      let textToCopy = "";
      if (!pps.copyDelimiter) {
        textToCopy = CleaveUtils_default.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
      } else {
        textToCopy = inputValue;
      }
      try {
        if (e.clipboardData) {
          e.clipboardData.setData("Text", textToCopy);
        } else {
          window.clipboardData.setData("Text", textToCopy);
        }
        e.preventDefault();
      } catch (ex) {
      }
    }
    formatInput(value) {
      let pps = this.config;
      let postDelimiterAfter = CleaveUtils_default.getPostDelimiter(value, pps.delimiter, pps.delimiters);
      if (!pps.numeral && pps.postDelimiterBackspace && !postDelimiterAfter) {
        value = CleaveUtils_default.headStr(value, value.length - pps.postDelimiterBackspace.length);
      }
      if (this.isBackward && !value && pps.prefix) {
        value = pps.prefix;
      }
      if (pps.numeral) {
        if (pps.prefix && pps.noImmediatePrefix && value.length === 0) {
          this.result = "";
        } else {
          this.result = pps.numeralFormatter.format(value);
        }
        this.updateValueState();
        return;
      }
      if (pps.date && pps.time) {
        value = CleaveUtils_default.getDateTimeValue(value, pps.dateFormatter, pps.timeFormatter, pps.delimiters);
      } else if (pps.date) {
        value = pps.dateFormatter.getValidatedDate(value);
      } else if (pps.time) {
        value = pps.timeFormatter.getValidatedTime(value);
      }
      value = CleaveUtils_default.stripDelimiters(value, pps.delimiter, pps.delimiters);
      value = CleaveUtils_default.getPrefixStrippedValue(
        value,
        pps.prefix,
        pps.prefix.length,
        this.result,
        pps.delimiter,
        pps.delimiters,
        pps.noImmediatePrefix,
        pps.tailPrefix,
        pps.signBeforePrefix
      );
      value = pps.numericOnly ? CleaveUtils_default.strip(value, /[^\d]/g) : value;
      value = pps.hexadecimalOnly ? CleaveUtils_default.strip(value, /[^0-9a-fA-F]/g) : value;
      value = pps.uppercase ? value.toUpperCase() : value;
      value = pps.lowercase ? value.toLowerCase() : value;
      value = pps.ucfirst && value.length > 1 ? value[0].toUpperCase() + value.substring(1).toLowerCase() : value;
      if (pps.prefix) {
        if (pps.tailPrefix) {
          value = value + pps.prefix;
        } else {
          value = pps.prefix + value;
        }
        if (pps.blocks.length === 0) {
          this.result = value;
          this.updateValueState();
          return;
        }
      }
      value = CleaveUtils_default.headStr(value, pps.maxLength);
      this.result = CleaveUtils_default.getFormattedValue(value, pps.blocks, pps.blocks.length, pps.delimiter, pps.delimiters, pps.delimiterLazyShow);
      this.updateValueState();
    }
    /**
     * Assign this.result to element value and calls value changed
     * @returns
     */
    updateValueState() {
      const pps = this.config;
      if (!this.element) {
        return;
      }
      let endPos = this.element.selectionEnd;
      let oldValue = "" + this.element.value;
      let newValue = this.result;
      const doc = this.element.ownerDocument;
      endPos = CleaveUtils_default.getNextCursorPosition(endPos, oldValue, newValue, pps.delimiter, pps.delimiters);
      if (pps.tailPrefix && endPos >= oldValue.length) {
        endPos -= pps.prefix.length;
      }
      this.element.value = newValue;
      if (pps.swapHiddenInput) {
        this.elementSwapHidden.value = this.getRawValue();
      }
      CleaveUtils_default.setSelection(this.element, endPos, doc, false);
      this.dispatch("valuechanged", {
        oldValue,
        newValue
      });
      if (this.config.onValueChanged) {
        this.config.onValueChanged(this);
      }
    }
    setRawValue(value) {
      const pps = this.config;
      value = value !== void 0 && value !== null ? value.toString() : "";
      if (pps.numeral) {
        value = value.replace(".", pps.numeralDecimalMark);
        if (pps.numeralDecimalPadding) {
          value = pps.numeralFormatter.padDecimal(value);
        }
      }
      pps.postDelimiterBackspace = false;
      this.element.value = value;
      this.formatInput(value);
    }
    /**
     * @param {Boolean} trimPrefix
     * @returns {String}
     */
    getRawValue(trimPrefix = false) {
      const pps = this.config;
      let rawValue = this.element.value;
      if (pps.rawValueTrimPrefix || trimPrefix) {
        rawValue = CleaveUtils_default.getPrefixStrippedValue(
          rawValue,
          pps.prefix,
          pps.prefix.length,
          this.result,
          pps.delimiter,
          pps.delimiters,
          pps.noImmediatePrefix,
          pps.tailPrefix,
          pps.signBeforePrefix
        );
      }
      if (pps.numeral) {
        rawValue = pps.numeralFormatter.getRawValue(rawValue);
      } else {
        rawValue = CleaveUtils_default.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
      }
      return rawValue;
    }
    getISOFormatDate() {
      const pps = this.config;
      return pps.date ? pps.dateFormatter.getISOFormatDate() : "";
    }
    getISOFormatTime() {
      const pps = this.config;
      return pps.time ? pps.timeFormatter.getISOFormatTime() : "";
    }
    getISOFormatDateTime() {
      const pps = this.config;
      if (pps.date) {
        const date = this.getISOFormatDate();
        const time = this.getISOFormatTime() || "00:00:00";
        return `${date}T${time}`;
      }
      return "";
    }
    getFormattedValue() {
      return this.element.value;
    }
    destroy() {
      events.forEach((type) => {
        this.element.removeEventListener(type, this);
      });
      instances.delete(this.element);
    }
    toString() {
      return "[Cleave Object]";
    }
  };
  var Cleave_default = Cleave;

  // src/utils/isString.js
  var isString_default = (v) => {
    return typeof v == "string";
  };

  // src/utils/getGlobalFn.js
  var getGlobalFn_default = (fn) => fn.split(".").reduce((r, p) => r[p], window);

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

  // src/classes/CleaveInput.js
  var CleaveInput = class extends FormidableElement_default {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
      return this.querySelector("input");
    }
    get value() {
      return this.cleave.getRawValue(true);
    }
    get type() {
      return this.getAttribute("type");
    }
    created() {
      const type = this.type;
      if (type === "datetime") {
        this.config.date = true;
        this.config.time = true;
      } else if (type) {
        this.config[type] = true;
      }
      this.cleave = new Cleave_default(this.el, this.config);
    }
    destroyed() {
      if (this.cleave) {
        this.cleave.destroy();
        this.cleave = null;
      }
    }
  };
  var CleaveInput_default = CleaveInput;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/cleave-input.js
  defineEl_default("cleave-input", CleaveInput_default);
  var cleave_input_default = CleaveInput_default;
})();
