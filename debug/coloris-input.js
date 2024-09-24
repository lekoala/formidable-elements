(() => {
  // node_modules/@melloware/coloris/dist/esm/coloris.js
  var Coloris = (() => {
    return ((window2, document2, Math2, undefined) => {
      const ctx = document2.createElement("canvas").getContext("2d");
      const currentColor = { r: 0, g: 0, b: 0, h: 0, s: 0, v: 0, a: 1 };
      let container, picker, colorArea, colorMarker, colorPreview, colorValue, clearButton, closeButton, hueSlider, hueMarker, alphaSlider, alphaMarker, currentEl, currentFormat, oldColor, keyboardNav, colorAreaDims = {};
      const settings = {
        el: "[data-coloris]",
        parent: "body",
        theme: "default",
        themeMode: "light",
        rtl: false,
        wrap: true,
        margin: 2,
        format: "hex",
        formatToggle: false,
        swatches: [],
        swatchesOnly: false,
        alpha: true,
        forceAlpha: false,
        focusInput: true,
        selectInput: false,
        inline: false,
        defaultColor: "#000000",
        clearButton: false,
        clearLabel: "Clear",
        closeButton: false,
        closeLabel: "Close",
        onChange: () => undefined,
        a11y: {
          open: "Open color picker",
          close: "Close color picker",
          clear: "Clear the selected color",
          marker: "Saturation: {s}. Brightness: {v}.",
          hueSlider: "Hue slider",
          alphaSlider: "Opacity slider",
          input: "Color value field",
          format: "Color format",
          swatch: "Color swatch",
          instruction: "Saturation and brightness selector. Use up, down, left and right arrow keys to select."
        }
      };
      const instances = {};
      let currentInstanceId = "";
      let defaultInstance = {};
      let hasInstance = false;
      function configure(options) {
        if (typeof options !== "object") {
          return;
        }
        for (const key in options) {
          switch (key) {
            case "el":
              bindFields(options.el);
              if (options.wrap !== false) {
                wrapFields(options.el);
              }
              break;
            case "parent":
              container = options.parent instanceof HTMLElement ? options.parent : document2.querySelector(options.parent);
              if (container) {
                container.appendChild(picker);
                settings.parent = options.parent;
                if (container === document2.body) {
                  container = undefined;
                }
              }
              break;
            case "themeMode":
              settings.themeMode = options.themeMode;
              if (options.themeMode === "auto" && window2.matchMedia && window2.matchMedia("(prefers-color-scheme: dark)").matches) {
                settings.themeMode = "dark";
              }
            case "theme":
              if (options.theme) {
                settings.theme = options.theme;
              }
              picker.className = "clr-picker clr-" + settings.theme + " clr-" + settings.themeMode;
              if (settings.inline) {
                updatePickerPosition();
              }
              break;
            case "rtl":
              settings.rtl = !!options.rtl;
              Array.from(document2.getElementsByClassName("clr-field")).forEach((field) => field.classList.toggle("clr-rtl", settings.rtl));
              break;
            case "margin":
              options.margin *= 1;
              settings.margin = !isNaN(options.margin) ? options.margin : settings.margin;
              break;
            case "wrap":
              if (options.el && options.wrap) {
                wrapFields(options.el);
              }
              break;
            case "formatToggle":
              settings.formatToggle = !!options.formatToggle;
              getEl("clr-format").style.display = settings.formatToggle ? "block" : "none";
              if (settings.formatToggle) {
                settings.format = "auto";
              }
              break;
            case "swatches":
              if (Array.isArray(options.swatches)) {
                const swatchesContainer = getEl("clr-swatches");
                const swatches = document2.createElement("div");
                swatchesContainer.textContent = "";
                options.swatches.forEach((swatch, i) => {
                  const button = document2.createElement("button");
                  button.setAttribute("type", "button");
                  button.setAttribute("id", "clr-swatch-" + i);
                  button.setAttribute("aria-labelledby", "clr-swatch-label clr-swatch-" + i);
                  button.style.color = swatch;
                  button.textContent = swatch;
                  swatches.appendChild(button);
                });
                if (options.swatches.length) {
                  swatchesContainer.appendChild(swatches);
                }
                settings.swatches = options.swatches.slice();
              }
              break;
            case "swatchesOnly":
              settings.swatchesOnly = !!options.swatchesOnly;
              picker.setAttribute("data-minimal", settings.swatchesOnly);
              break;
            case "alpha":
              settings.alpha = !!options.alpha;
              picker.setAttribute("data-alpha", settings.alpha);
              break;
            case "inline":
              settings.inline = !!options.inline;
              picker.setAttribute("data-inline", settings.inline);
              if (settings.inline) {
                const defaultColor = options.defaultColor || settings.defaultColor;
                currentFormat = getColorFormatFromStr(defaultColor);
                updatePickerPosition();
                setColorFromStr(defaultColor);
              }
              break;
            case "clearButton":
              if (typeof options.clearButton === "object") {
                if (options.clearButton.label) {
                  settings.clearLabel = options.clearButton.label;
                  clearButton.innerHTML = settings.clearLabel;
                }
                options.clearButton = options.clearButton.show;
              }
              settings.clearButton = !!options.clearButton;
              clearButton.style.display = settings.clearButton ? "block" : "none";
              break;
            case "clearLabel":
              settings.clearLabel = options.clearLabel;
              clearButton.innerHTML = settings.clearLabel;
              break;
            case "closeButton":
              settings.closeButton = !!options.closeButton;
              if (settings.closeButton) {
                picker.insertBefore(closeButton, colorPreview);
              } else {
                colorPreview.appendChild(closeButton);
              }
              break;
            case "closeLabel":
              settings.closeLabel = options.closeLabel;
              closeButton.innerHTML = settings.closeLabel;
              break;
            case "a11y":
              const labels = options.a11y;
              let update = false;
              if (typeof labels === "object") {
                for (const label in labels) {
                  if (labels[label] && settings.a11y[label]) {
                    settings.a11y[label] = labels[label];
                    update = true;
                  }
                }
              }
              if (update) {
                const openLabel = getEl("clr-open-label");
                const swatchLabel = getEl("clr-swatch-label");
                openLabel.innerHTML = settings.a11y.open;
                swatchLabel.innerHTML = settings.a11y.swatch;
                closeButton.setAttribute("aria-label", settings.a11y.close);
                clearButton.setAttribute("aria-label", settings.a11y.clear);
                hueSlider.setAttribute("aria-label", settings.a11y.hueSlider);
                alphaSlider.setAttribute("aria-label", settings.a11y.alphaSlider);
                colorValue.setAttribute("aria-label", settings.a11y.input);
                colorArea.setAttribute("aria-label", settings.a11y.instruction);
              }
              break;
            default:
              settings[key] = options[key];
          }
        }
      }
      function setVirtualInstance(selector, options) {
        if (typeof selector === "string" && typeof options === "object") {
          instances[selector] = options;
          hasInstance = true;
        }
      }
      function removeVirtualInstance(selector) {
        delete instances[selector];
        if (Object.keys(instances).length === 0) {
          hasInstance = false;
          if (selector === currentInstanceId) {
            resetVirtualInstance();
          }
        }
      }
      function attachVirtualInstance(element) {
        if (hasInstance) {
          const unsupportedOptions = ["el", "wrap", "rtl", "inline", "defaultColor", "a11y"];
          for (let selector in instances) {
            const options = instances[selector];
            if (element.matches(selector)) {
              currentInstanceId = selector;
              defaultInstance = {};
              unsupportedOptions.forEach((option) => delete options[option]);
              for (let option in options) {
                defaultInstance[option] = Array.isArray(settings[option]) ? settings[option].slice() : settings[option];
              }
              configure(options);
              break;
            }
          }
        }
      }
      function resetVirtualInstance() {
        if (Object.keys(defaultInstance).length > 0) {
          configure(defaultInstance);
          currentInstanceId = "";
          defaultInstance = {};
        }
      }
      function bindFields(selector) {
        if (selector instanceof HTMLElement) {
          selector = [selector];
        }
        if (Array.isArray(selector)) {
          selector.forEach((field) => {
            addListener(field, "click", openPicker);
            addListener(field, "input", updateColorPreview);
          });
        } else {
          addListener(document2, "click", selector, openPicker);
          addListener(document2, "input", selector, updateColorPreview);
        }
      }
      function openPicker(event) {
        if (settings.inline) {
          return;
        }
        attachVirtualInstance(event.target);
        currentEl = event.target;
        oldColor = currentEl.value;
        currentFormat = getColorFormatFromStr(oldColor);
        picker.classList.add("clr-open");
        updatePickerPosition();
        setColorFromStr(oldColor);
        if (settings.focusInput || settings.selectInput) {
          colorValue.focus({ preventScroll: true });
          colorValue.setSelectionRange(currentEl.selectionStart, currentEl.selectionEnd);
        }
        if (settings.selectInput) {
          colorValue.select();
        }
        if (keyboardNav || settings.swatchesOnly) {
          getFocusableElements().shift().focus();
        }
        currentEl.dispatchEvent(new Event("open", { bubbles: true }));
      }
      function updatePickerPosition() {
        if (!picker || !currentEl && !settings.inline) return;
        const parent = container;
        const scrollY = window2.scrollY;
        const pickerWidth = picker.offsetWidth;
        const pickerHeight = picker.offsetHeight;
        const reposition = { left: false, top: false };
        let parentStyle, parentMarginTop, parentBorderTop;
        let offset = { x: 0, y: 0 };
        if (parent) {
          parentStyle = window2.getComputedStyle(parent);
          parentMarginTop = parseFloat(parentStyle.marginTop);
          parentBorderTop = parseFloat(parentStyle.borderTopWidth);
          offset = parent.getBoundingClientRect();
          offset.y += parentBorderTop + scrollY;
        }
        if (!settings.inline) {
          const coords = currentEl.getBoundingClientRect();
          let left = coords.x;
          let top = scrollY + coords.y + coords.height + settings.margin;
          if (parent) {
            left -= offset.x;
            top -= offset.y;
            if (left + pickerWidth > parent.clientWidth) {
              left += coords.width - pickerWidth;
              reposition.left = true;
            }
            if (top + pickerHeight > parent.clientHeight - parentMarginTop) {
              if (pickerHeight + settings.margin <= coords.top - (offset.y - scrollY)) {
                top -= coords.height + pickerHeight + settings.margin * 2;
                reposition.top = true;
              }
            }
            top += parent.scrollTop;
          } else {
            if (left + pickerWidth > document2.documentElement.clientWidth) {
              left += coords.width - pickerWidth;
              reposition.left = true;
            }
            if (top + pickerHeight - scrollY > document2.documentElement.clientHeight) {
              if (pickerHeight + settings.margin <= coords.top) {
                top = scrollY + coords.y - pickerHeight - settings.margin;
                reposition.top = true;
              }
            }
          }
          picker.classList.toggle("clr-left", reposition.left);
          picker.classList.toggle("clr-top", reposition.top);
          picker.style.left = left + "px";
          picker.style.top = top + "px";
          offset.x += picker.offsetLeft;
          offset.y += picker.offsetTop;
        }
        colorAreaDims = {
          width: colorArea.offsetWidth,
          height: colorArea.offsetHeight,
          x: colorArea.offsetLeft + offset.x,
          y: colorArea.offsetTop + offset.y
        };
      }
      function wrapFields(selector) {
        if (selector instanceof HTMLElement) {
          wrapColorField(selector);
        } else if (Array.isArray(selector)) {
          selector.forEach(wrapColorField);
        } else {
          document2.querySelectorAll(selector).forEach(wrapColorField);
        }
      }
      function wrapColorField(field) {
        const parentNode = field.parentNode;
        if (!parentNode.classList.contains("clr-field")) {
          const wrapper = document2.createElement("div");
          let classes = "clr-field";
          if (settings.rtl || field.classList.contains("clr-rtl")) {
            classes += " clr-rtl";
          }
          wrapper.innerHTML = '<button type="button" aria-labelledby="clr-open-label"></button>';
          parentNode.insertBefore(wrapper, field);
          wrapper.className = classes;
          wrapper.style.color = field.value;
          wrapper.appendChild(field);
        }
      }
      function updateColorPreview(event) {
        const parent = event.target.parentNode;
        if (parent.classList.contains("clr-field")) {
          parent.style.color = event.target.value;
        }
      }
      function closePicker(revert) {
        if (currentEl && !settings.inline) {
          const prevEl = currentEl;
          if (revert) {
            currentEl = undefined;
            if (oldColor !== prevEl.value) {
              prevEl.value = oldColor;
              prevEl.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
          setTimeout(() => {
            if (oldColor !== prevEl.value) {
              prevEl.dispatchEvent(new Event("change", { bubbles: true }));
            }
          });
          picker.classList.remove("clr-open");
          if (hasInstance) {
            resetVirtualInstance();
          }
          prevEl.dispatchEvent(new Event("close", { bubbles: true }));
          if (settings.focusInput) {
            prevEl.focus({ preventScroll: true });
          }
          currentEl = undefined;
        }
      }
      function setColorFromStr(str) {
        const rgba = strToRGBA(str);
        const hsva = RGBAtoHSVA(rgba);
        updateMarkerA11yLabel(hsva.s, hsva.v);
        updateColor(rgba, hsva);
        hueSlider.value = hsva.h;
        picker.style.color = "hsl(" + hsva.h + ", 100%, 50%)";
        hueMarker.style.left = hsva.h / 360 * 100 + "%";
        colorMarker.style.left = colorAreaDims.width * hsva.s / 100 + "px";
        colorMarker.style.top = colorAreaDims.height - colorAreaDims.height * hsva.v / 100 + "px";
        alphaSlider.value = hsva.a * 100;
        alphaMarker.style.left = hsva.a * 100 + "%";
      }
      function getColorFormatFromStr(str) {
        const format = str.substring(0, 3).toLowerCase();
        if (format === "rgb" || format === "hsl") {
          return format;
        }
        return "hex";
      }
      function pickColor(color) {
        color = color !== undefined ? color : colorValue.value;
        if (currentEl) {
          currentEl.value = color;
          currentEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (settings.onChange) {
          settings.onChange.call(window2, color, currentEl);
        }
        document2.dispatchEvent(new CustomEvent("coloris:pick", { detail: { color, currentEl } }));
      }
      function setColorAtPosition(x, y) {
        const hsva = {
          h: hueSlider.value * 1,
          s: x / colorAreaDims.width * 100,
          v: 100 - y / colorAreaDims.height * 100,
          a: alphaSlider.value / 100
        };
        const rgba = HSVAtoRGBA(hsva);
        updateMarkerA11yLabel(hsva.s, hsva.v);
        updateColor(rgba, hsva);
        pickColor();
      }
      function updateMarkerA11yLabel(saturation, value) {
        let label = settings.a11y.marker;
        saturation = saturation.toFixed(1) * 1;
        value = value.toFixed(1) * 1;
        label = label.replace("{s}", saturation);
        label = label.replace("{v}", value);
        colorMarker.setAttribute("aria-label", label);
      }
      function getPointerPosition(event) {
        return {
          pageX: event.changedTouches ? event.changedTouches[0].pageX : event.pageX,
          pageY: event.changedTouches ? event.changedTouches[0].pageY : event.pageY
        };
      }
      function moveMarker(event) {
        const pointer = getPointerPosition(event);
        let x = pointer.pageX - colorAreaDims.x;
        let y = pointer.pageY - colorAreaDims.y;
        if (container) {
          y += container.scrollTop;
        }
        setMarkerPosition(x, y);
        event.preventDefault();
        event.stopPropagation();
      }
      function moveMarkerOnKeydown(offsetX, offsetY) {
        let x = colorMarker.style.left.replace("px", "") * 1 + offsetX;
        let y = colorMarker.style.top.replace("px", "") * 1 + offsetY;
        setMarkerPosition(x, y);
      }
      function setMarkerPosition(x, y) {
        x = x < 0 ? 0 : x > colorAreaDims.width ? colorAreaDims.width : x;
        y = y < 0 ? 0 : y > colorAreaDims.height ? colorAreaDims.height : y;
        colorMarker.style.left = x + "px";
        colorMarker.style.top = y + "px";
        setColorAtPosition(x, y);
        colorMarker.focus();
      }
      function updateColor(rgba, hsva) {
        if (rgba === void 0) {
          rgba = {};
        }
        if (hsva === void 0) {
          hsva = {};
        }
        let format = settings.format;
        for (const key in rgba) {
          currentColor[key] = rgba[key];
        }
        for (const key in hsva) {
          currentColor[key] = hsva[key];
        }
        const hex = RGBAToHex(currentColor);
        const opaqueHex = hex.substring(0, 7);
        colorMarker.style.color = opaqueHex;
        alphaMarker.parentNode.style.color = opaqueHex;
        alphaMarker.style.color = hex;
        colorPreview.style.color = hex;
        colorArea.style.display = "none";
        colorArea.offsetHeight;
        colorArea.style.display = "";
        alphaMarker.nextElementSibling.style.display = "none";
        alphaMarker.nextElementSibling.offsetHeight;
        alphaMarker.nextElementSibling.style.display = "";
        if (format === "mixed") {
          format = currentColor.a === 1 ? "hex" : "rgb";
        } else if (format === "auto") {
          format = currentFormat;
        }
        switch (format) {
          case "hex":
            colorValue.value = hex;
            break;
          case "rgb":
            colorValue.value = RGBAToStr(currentColor);
            break;
          case "hsl":
            colorValue.value = HSLAToStr(HSVAtoHSLA(currentColor));
            break;
        }
        document2.querySelector('.clr-format [value="' + format + '"]').checked = true;
      }
      function setHue() {
        const hue = hueSlider.value * 1;
        const x = colorMarker.style.left.replace("px", "") * 1;
        const y = colorMarker.style.top.replace("px", "") * 1;
        picker.style.color = "hsl(" + hue + ", 100%, 50%)";
        hueMarker.style.left = hue / 360 * 100 + "%";
        setColorAtPosition(x, y);
      }
      function setAlpha() {
        const alpha = alphaSlider.value / 100;
        alphaMarker.style.left = alpha * 100 + "%";
        updateColor({ a: alpha });
        pickColor();
      }
      function HSVAtoRGBA(hsva) {
        const saturation = hsva.s / 100;
        const value = hsva.v / 100;
        let chroma = saturation * value;
        let hueBy60 = hsva.h / 60;
        let x = chroma * (1 - Math2.abs(hueBy60 % 2 - 1));
        let m2 = value - chroma;
        chroma = chroma + m2;
        x = x + m2;
        const index = Math2.floor(hueBy60) % 6;
        const red = [chroma, x, m2, m2, x, chroma][index];
        const green = [x, chroma, chroma, x, m2, m2][index];
        const blue = [m2, m2, x, chroma, chroma, x][index];
        return {
          r: Math2.round(red * 255),
          g: Math2.round(green * 255),
          b: Math2.round(blue * 255),
          a: hsva.a
        };
      }
      function HSVAtoHSLA(hsva) {
        const value = hsva.v / 100;
        const lightness = value * (1 - hsva.s / 100 / 2);
        let saturation;
        if (lightness > 0 && lightness < 1) {
          saturation = Math2.round((value - lightness) / Math2.min(lightness, 1 - lightness) * 100);
        }
        return {
          h: hsva.h,
          s: saturation || 0,
          l: Math2.round(lightness * 100),
          a: hsva.a
        };
      }
      function RGBAtoHSVA(rgba) {
        const red = rgba.r / 255;
        const green = rgba.g / 255;
        const blue = rgba.b / 255;
        const xmax = Math2.max(red, green, blue);
        const xmin = Math2.min(red, green, blue);
        const chroma = xmax - xmin;
        const value = xmax;
        let hue = 0;
        let saturation = 0;
        if (chroma) {
          if (xmax === red) {
            hue = (green - blue) / chroma;
          }
          if (xmax === green) {
            hue = 2 + (blue - red) / chroma;
          }
          if (xmax === blue) {
            hue = 4 + (red - green) / chroma;
          }
          if (xmax) {
            saturation = chroma / xmax;
          }
        }
        hue = Math2.floor(hue * 60);
        return {
          h: hue < 0 ? hue + 360 : hue,
          s: Math2.round(saturation * 100),
          v: Math2.round(value * 100),
          a: rgba.a
        };
      }
      function strToRGBA(str) {
        const regex = /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i;
        let match, rgba;
        ctx.fillStyle = "#000";
        ctx.fillStyle = str;
        match = regex.exec(ctx.fillStyle);
        if (match) {
          rgba = {
            r: match[3] * 1,
            g: match[4] * 1,
            b: match[5] * 1,
            a: match[6] * 1
          };
        } else {
          match = ctx.fillStyle.replace("#", "").match(/.{2}/g).map((h) => parseInt(h, 16));
          rgba = {
            r: match[0],
            g: match[1],
            b: match[2],
            a: 1
          };
        }
        return rgba;
      }
      function RGBAToHex(rgba) {
        let R = rgba.r.toString(16);
        let G = rgba.g.toString(16);
        let B = rgba.b.toString(16);
        let A = "";
        if (rgba.r < 16) {
          R = "0" + R;
        }
        if (rgba.g < 16) {
          G = "0" + G;
        }
        if (rgba.b < 16) {
          B = "0" + B;
        }
        if (settings.alpha && (rgba.a < 1 || settings.forceAlpha)) {
          const alpha = rgba.a * 255 | 0;
          A = alpha.toString(16);
          if (alpha < 16) {
            A = "0" + A;
          }
        }
        return "#" + R + G + B + A;
      }
      function RGBAToStr(rgba) {
        if (!settings.alpha || rgba.a === 1 && !settings.forceAlpha) {
          return "rgb(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ")";
        } else {
          return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
        }
      }
      function HSLAToStr(hsla) {
        if (!settings.alpha || hsla.a === 1 && !settings.forceAlpha) {
          return "hsl(" + hsla.h + ", " + hsla.s + "%, " + hsla.l + "%)";
        } else {
          return "hsla(" + hsla.h + ", " + hsla.s + "%, " + hsla.l + "%, " + hsla.a + ")";
        }
      }
      function init() {
        if (document2.getElementById("clr-picker")) return;
        container = undefined;
        picker = document2.createElement("div");
        picker.setAttribute("id", "clr-picker");
        picker.className = "clr-picker";
        picker.innerHTML = '<input id="clr-color-value" name="clr-color-value" class="clr-color" type="text" value="" spellcheck="false" aria-label="' + settings.a11y.input + '">' + ('<div id="clr-color-area" class="clr-gradient" role="application" aria-label="' + settings.a11y.instruction + '">') + '<div id="clr-color-marker" class="clr-marker" tabindex="0"></div></div><div class="clr-hue">' + ('<input id="clr-hue-slider" name="clr-hue-slider" type="range" min="0" max="360" step="1" aria-label="' + settings.a11y.hueSlider + '">') + '<div id="clr-hue-marker"></div></div><div class="clr-alpha">' + ('<input id="clr-alpha-slider" name="clr-alpha-slider" type="range" min="0" max="100" step="1" aria-label="' + settings.a11y.alphaSlider + '">') + '<div id="clr-alpha-marker"></div><span></span></div><div id="clr-format" class="clr-format"><fieldset class="clr-segmented">' + ("<legend>" + settings.a11y.format + "</legend>") + '<input id="clr-f1" type="radio" name="clr-format" value="hex"><label for="clr-f1">Hex</label><input id="clr-f2" type="radio" name="clr-format" value="rgb"><label for="clr-f2">RGB</label><input id="clr-f3" type="radio" name="clr-format" value="hsl"><label for="clr-f3">HSL</label><span></span></fieldset></div><div id="clr-swatches" class="clr-swatches"></div>' + ('<button type="button" id="clr-clear" class="clr-clear" aria-label="' + settings.a11y.clear + '">' + settings.clearLabel + "</button>") + '<div id="clr-color-preview" class="clr-preview">' + ('<button type="button" id="clr-close" class="clr-close" aria-label="' + settings.a11y.close + '">' + settings.closeLabel + "</button>") + "</div>" + ('<span id="clr-open-label" hidden>' + settings.a11y.open + "</span>") + ('<span id="clr-swatch-label" hidden>' + settings.a11y.swatch + "</span>");
        document2.body.appendChild(picker);
        colorArea = getEl("clr-color-area");
        colorMarker = getEl("clr-color-marker");
        clearButton = getEl("clr-clear");
        closeButton = getEl("clr-close");
        colorPreview = getEl("clr-color-preview");
        colorValue = getEl("clr-color-value");
        hueSlider = getEl("clr-hue-slider");
        hueMarker = getEl("clr-hue-marker");
        alphaSlider = getEl("clr-alpha-slider");
        alphaMarker = getEl("clr-alpha-marker");
        bindFields(settings.el);
        wrapFields(settings.el);
        addListener(picker, "mousedown", (event) => {
          picker.classList.remove("clr-keyboard-nav");
          event.stopPropagation();
        });
        addListener(colorArea, "mousedown", (event) => {
          addListener(document2, "mousemove", moveMarker);
        });
        addListener(colorArea, "contextmenu", (event) => {
          event.preventDefault();
        });
        addListener(colorArea, "touchstart", (event) => {
          document2.addEventListener("touchmove", moveMarker, { passive: false });
        });
        addListener(colorMarker, "mousedown", (event) => {
          addListener(document2, "mousemove", moveMarker);
        });
        addListener(colorMarker, "touchstart", (event) => {
          document2.addEventListener("touchmove", moveMarker, { passive: false });
        });
        addListener(colorValue, "change", (event) => {
          const value = colorValue.value;
          if (currentEl || settings.inline) {
            const color = value === "" ? value : setColorFromStr(value);
            pickColor(color);
          }
        });
        addListener(clearButton, "click", (event) => {
          pickColor("");
          closePicker();
        });
        addListener(closeButton, "click", (event) => {
          pickColor();
          closePicker();
        });
        addListener(getEl("clr-format"), "click", ".clr-format input", (event) => {
          currentFormat = event.target.value;
          updateColor();
          pickColor();
        });
        addListener(picker, "click", ".clr-swatches button", (event) => {
          setColorFromStr(event.target.textContent);
          pickColor();
          if (settings.swatchesOnly) {
            closePicker();
          }
        });
        addListener(document2, "mouseup", (event) => {
          document2.removeEventListener("mousemove", moveMarker);
        });
        addListener(document2, "touchend", (event) => {
          document2.removeEventListener("touchmove", moveMarker);
        });
        addListener(document2, "mousedown", (event) => {
          keyboardNav = false;
          picker.classList.remove("clr-keyboard-nav");
          closePicker();
        });
        addListener(document2, "keydown", (event) => {
          const key = event.key;
          const target = event.target;
          const shiftKey = event.shiftKey;
          const navKeys = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
          if (key === "Escape") {
            closePicker(true);
          } else if (navKeys.includes(key)) {
            keyboardNav = true;
            picker.classList.add("clr-keyboard-nav");
          }
          if (key === "Tab" && target.matches(".clr-picker *")) {
            const focusables = getFocusableElements();
            const firstFocusable = focusables.shift();
            const lastFocusable = focusables.pop();
            if (shiftKey && target === firstFocusable) {
              lastFocusable.focus();
              event.preventDefault();
            } else if (!shiftKey && target === lastFocusable) {
              firstFocusable.focus();
              event.preventDefault();
            }
          }
        });
        addListener(document2, "click", ".clr-field button", (event) => {
          if (hasInstance) {
            resetVirtualInstance();
          }
          event.target.nextElementSibling.dispatchEvent(new Event("click", { bubbles: true }));
        });
        addListener(colorMarker, "keydown", (event) => {
          const movements = {
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0]
          };
          if (Object.keys(movements).includes(event.key)) {
            moveMarkerOnKeydown(...movements[event.key]);
            event.preventDefault();
          }
        });
        addListener(colorArea, "click", moveMarker);
        addListener(hueSlider, "input", setHue);
        addListener(alphaSlider, "input", setAlpha);
      }
      function getFocusableElements() {
        const controls = Array.from(picker.querySelectorAll("input, button"));
        const focusables = controls.filter((node) => !!node.offsetWidth);
        return focusables;
      }
      function getEl(id) {
        return document2.getElementById(id);
      }
      function addListener(context, type, selector, fn) {
        const matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
        if (typeof selector === "string") {
          context.addEventListener(type, (event) => {
            if (matches.call(event.target, selector)) {
              fn.call(event.target, event);
            }
          });
        } else {
          fn = selector;
          context.addEventListener(type, fn);
        }
      }
      function DOMReady(fn, args) {
        args = args !== undefined ? args : [];
        if (document2.readyState !== "loading") {
          fn(...args);
        } else {
          document2.addEventListener("DOMContentLoaded", () => {
            fn(...args);
          });
        }
      }
      if (NodeList !== undefined && NodeList.prototype && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
      }
      function setColor(color, target) {
        currentEl = target;
        oldColor = currentEl.value;
        attachVirtualInstance(target);
        currentFormat = getColorFormatFromStr(color);
        updatePickerPosition();
        setColorFromStr(color);
        pickColor();
        if (oldColor !== color) {
          currentEl.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      const Coloris2 = (() => {
        const methods = {
          init,
          set: configure,
          wrap: wrapFields,
          close: closePicker,
          setInstance: setVirtualInstance,
          setColor,
          removeInstance: removeVirtualInstance,
          updatePosition: updatePickerPosition,
          ready: DOMReady
        };
        function Coloris3(options) {
          DOMReady(() => {
            if (options) {
              if (typeof options === "string") {
                bindFields(options);
              } else {
                configure(options);
              }
            }
          });
        }
        for (const key in methods) {
          Coloris3[key] = function() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            DOMReady(methods[key], args);
          };
        }
        DOMReady(() => {
          window2.addEventListener("resize", (event) => {
            Coloris3.updatePosition();
          });
          window2.addEventListener("scroll", (event) => {
            Coloris3.updatePosition();
          });
        });
        return Coloris3;
      })();
      Coloris2.coloris = Coloris2;
      return Coloris2;
    })(window, document, Math);
  })();
  var _coloris = Coloris.coloris;
  var _init = Coloris.init;
  var _set = Coloris.set;
  var _wrap = Coloris.wrap;
  var _close = Coloris.close;
  var _setInstance = Coloris.setInstance;
  var _removeInstance = Coloris.removeInstance;
  var _updatePosition = Coloris.updatePosition;
  var coloris_default = Coloris;

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

  // src/utils/setId.js
  var counter = 0;
  var setId_default = (el, name2) => {
    counter++;
    const id = el.id || `${name2}-${counter}`;
    el.id = id;
    return id;
  };

  // src/utils/isRTL.js
  var isRTL_default = (el = document.documentElement) => {
    return getComputedStyle(el).direction === "rtl";
  };

  // src/classes/ColorisInput.js
  var themeMode = document.documentElement.dataset.bsTheme || "auto";
  var rtl = isRTL_default();
  var name = "coloris-input";
  coloris_default.init();
  var ColorisInput = class extends FormidableElement_default {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
      return this.querySelector("input");
    }
    get value() {
      return this.el.value;
    }
    created() {
      const id = setId_default(this.el, name);
      this.el.autocomplete = "off";
      coloris_default.coloris({
        el: `#${id}`,
        rtl,
        themeMode
      });
      coloris_default.set(`#${id}`, this.config);
    }
    destroyed() {
      const id = this.el.id;
      coloris_default.removeInstance(`#${id}`);
    }
  };
  var ColorisInput_default = ColorisInput;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name2, cls) => {
    if (!registry.get(name2)) {
      registry.define(name2, cls);
    }
  };

  // node_modules/@melloware/coloris/dist/coloris.min.css
  var coloris_min_default = ".clr-picker{display:none;flex-wrap:wrap;position:absolute;width:200px;z-index:1000;border-radius:10px;background-color:#fff;justify-content:flex-end;direction:ltr;box-shadow:0 0 5px rgba(0,0,0,.05),0 5px 20px rgba(0,0,0,.1);-moz-user-select:none;-webkit-user-select:none;user-select:none}.clr-picker.clr-open,.clr-picker[data-inline=true]{display:flex}.clr-picker[data-inline=true]{position:relative}.clr-gradient{position:relative;width:100%;height:100px;margin-bottom:15px;border-radius:3px 3px 0 0;background-image:linear-gradient(rgba(0,0,0,0),#000),linear-gradient(90deg,#fff,currentColor);cursor:pointer}.clr-marker{position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;border:1px solid #fff;border-radius:50%;background-color:currentColor;cursor:pointer}.clr-picker input[type=range]::-webkit-slider-runnable-track{width:100%;height:16px}.clr-picker input[type=range]::-webkit-slider-thumb{width:16px;height:16px;-webkit-appearance:none}.clr-picker input[type=range]::-moz-range-track{width:100%;height:16px;border:0}.clr-picker input[type=range]::-moz-range-thumb{width:16px;height:16px;border:0}.clr-hue{background-image:linear-gradient(to right,red 0,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red 100%)}.clr-alpha,.clr-hue{position:relative;width:calc(100% - 40px);height:8px;margin:5px 20px;border-radius:4px}.clr-alpha span{display:block;height:100%;width:100%;border-radius:inherit;background-image:linear-gradient(90deg,rgba(0,0,0,0),currentColor)}.clr-alpha input[type=range],.clr-hue input[type=range]{position:absolute;width:calc(100% + 32px);height:16px;left:-16px;top:-4px;margin:0;background-color:transparent;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none}.clr-alpha div,.clr-hue div{position:absolute;width:16px;height:16px;left:0;top:50%;margin-left:-8px;transform:translateY(-50%);border:2px solid #fff;border-radius:50%;background-color:currentColor;box-shadow:0 0 1px #888;pointer-events:none}.clr-alpha div:before{content:'';position:absolute;height:100%;width:100%;left:0;top:0;border-radius:50%;background-color:currentColor}.clr-format{display:none;order:1;width:calc(100% - 40px);margin:0 20px 20px}.clr-segmented{display:flex;position:relative;width:100%;margin:0;padding:0;border:1px solid #ddd;border-radius:15px;box-sizing:border-box;color:#999;font-size:12px}.clr-segmented input,.clr-segmented legend{position:absolute;width:100%;height:100%;margin:0;padding:0;border:0;left:0;top:0;opacity:0;pointer-events:none}.clr-segmented label{flex-grow:1;margin:0;padding:4px 0;font-size:inherit;font-weight:400;line-height:initial;text-align:center;cursor:pointer}.clr-segmented label:first-of-type{border-radius:10px 0 0 10px}.clr-segmented label:last-of-type{border-radius:0 10px 10px 0}.clr-segmented input:checked+label{color:#fff;background-color:#666}.clr-swatches{order:2;width:calc(100% - 32px);margin:0 16px}.clr-swatches div{display:flex;flex-wrap:wrap;padding-bottom:12px;justify-content:center}.clr-swatches button{position:relative;width:20px;height:20px;margin:0 4px 6px 4px;padding:0;border:0;border-radius:50%;color:inherit;text-indent:-1000px;white-space:nowrap;overflow:hidden;cursor:pointer}.clr-swatches button:after{content:'';display:block;position:absolute;width:100%;height:100%;left:0;top:0;border-radius:inherit;background-color:currentColor;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}input.clr-color{order:1;width:calc(100% - 80px);height:32px;margin:15px 20px 20px auto;padding:0 10px;border:1px solid #ddd;border-radius:16px;color:#444;background-color:#fff;font-family:sans-serif;font-size:14px;text-align:center;box-shadow:none}input.clr-color:focus{outline:0;border:1px solid #1e90ff}.clr-clear,.clr-close{display:none;order:2;height:24px;margin:0 20px 20px;padding:0 20px;border:0;border-radius:12px;color:#fff;background-color:#666;font-family:inherit;font-size:12px;font-weight:400;cursor:pointer}.clr-close{display:block;margin:0 20px 20px auto}.clr-preview{position:relative;width:32px;height:32px;margin:15px 0 20px 20px;border-radius:50%;overflow:hidden}.clr-preview:after,.clr-preview:before{content:'';position:absolute;height:100%;width:100%;left:0;top:0;border:1px solid #fff;border-radius:50%}.clr-preview:after{border:0;background-color:currentColor;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}.clr-preview button{position:absolute;width:100%;height:100%;z-index:1;margin:0;padding:0;border:0;border-radius:50%;outline-offset:-2px;background-color:transparent;text-indent:-9999px;cursor:pointer;overflow:hidden}.clr-alpha div,.clr-color,.clr-hue div,.clr-marker{box-sizing:border-box}.clr-field{display:inline-block;position:relative;color:transparent}.clr-field input{margin:0;direction:ltr}.clr-field.clr-rtl input{text-align:right}.clr-field button{position:absolute;width:30px;height:100%;right:0;top:50%;transform:translateY(-50%);margin:0;padding:0;border:0;color:inherit;text-indent:-1000px;white-space:nowrap;overflow:hidden;pointer-events:none}.clr-field.clr-rtl button{right:auto;left:0}.clr-field button:after{content:'';display:block;position:absolute;width:100%;height:100%;left:0;top:0;border-radius:inherit;background-color:currentColor;box-shadow:inset 0 0 1px rgba(0,0,0,.5)}.clr-alpha,.clr-alpha div,.clr-field button,.clr-preview:before,.clr-swatches button{background-image:repeating-linear-gradient(45deg,#aaa 25%,transparent 25%,transparent 75%,#aaa 75%,#aaa),repeating-linear-gradient(45deg,#aaa 25%,#fff 25%,#fff 75%,#aaa 75%,#aaa);background-position:0 0,4px 4px;background-size:8px 8px}.clr-marker:focus{outline:0}.clr-keyboard-nav .clr-alpha input:focus+div,.clr-keyboard-nav .clr-hue input:focus+div,.clr-keyboard-nav .clr-marker:focus,.clr-keyboard-nav .clr-segmented input:focus+label{outline:0;box-shadow:0 0 0 2px #1e90ff,0 0 2px 2px #fff}.clr-picker[data-alpha=false] .clr-alpha{display:none}.clr-picker[data-minimal=true]{padding-top:16px}.clr-picker[data-minimal=true] .clr-alpha,.clr-picker[data-minimal=true] .clr-color,.clr-picker[data-minimal=true] .clr-gradient,.clr-picker[data-minimal=true] .clr-hue,.clr-picker[data-minimal=true] .clr-preview{display:none}.clr-dark{background-color:#444}.clr-dark .clr-segmented{border-color:#777}.clr-dark .clr-swatches button:after{box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}.clr-dark input.clr-color{color:#fff;border-color:#777;background-color:#555}.clr-dark input.clr-color:focus{border-color:#1e90ff}.clr-dark .clr-preview:after{box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}.clr-dark .clr-alpha,.clr-dark .clr-alpha div,.clr-dark .clr-preview:before,.clr-dark .clr-swatches button{background-image:repeating-linear-gradient(45deg,#666 25%,transparent 25%,transparent 75%,#888 75%,#888),repeating-linear-gradient(45deg,#888 25%,#444 25%,#444 75%,#888 75%,#888)}.clr-picker.clr-polaroid{border-radius:6px;box-shadow:0 0 5px rgba(0,0,0,.1),0 5px 30px rgba(0,0,0,.2)}.clr-picker.clr-polaroid:before{content:'';display:block;position:absolute;width:16px;height:10px;left:20px;top:-10px;border:solid transparent;border-width:0 8px 10px 8px;border-bottom-color:currentColor;box-sizing:border-box;color:#fff;filter:drop-shadow(0 -4px 3px rgba(0,0,0,.1));pointer-events:none}.clr-picker.clr-polaroid.clr-dark:before{color:#444}.clr-picker.clr-polaroid.clr-left:before{left:auto;right:20px}.clr-picker.clr-polaroid.clr-top:before{top:auto;bottom:-10px;transform:rotateZ(180deg)}.clr-polaroid .clr-gradient{width:calc(100% - 20px);height:120px;margin:10px;border-radius:3px}.clr-polaroid .clr-alpha,.clr-polaroid .clr-hue{width:calc(100% - 30px);height:10px;margin:6px 15px;border-radius:5px}.clr-polaroid .clr-alpha div,.clr-polaroid .clr-hue div{box-shadow:0 0 5px rgba(0,0,0,.2)}.clr-polaroid .clr-format{width:calc(100% - 20px);margin:0 10px 15px}.clr-polaroid .clr-swatches{width:calc(100% - 12px);margin:0 6px}.clr-polaroid .clr-swatches div{padding-bottom:10px}.clr-polaroid .clr-swatches button{width:22px;height:22px}.clr-polaroid input.clr-color{width:calc(100% - 60px);margin:10px 10px 15px auto}.clr-polaroid .clr-clear{margin:0 10px 15px 10px}.clr-polaroid .clr-close{margin:0 10px 15px auto}.clr-polaroid .clr-preview{margin:10px 0 15px 10px}.clr-picker.clr-large{width:275px}.clr-large .clr-gradient{height:150px}.clr-large .clr-swatches button{width:22px;height:22px}.clr-picker.clr-pill{width:380px;padding-left:180px;box-sizing:border-box}.clr-pill .clr-gradient{position:absolute;width:180px;height:100%;left:0;top:0;margin-bottom:0;border-radius:3px 0 0 3px}.clr-pill .clr-hue{margin-top:20px}";

  // src/utils/injectStyles.js
  var injectStyles_default = (name2, styles) => {
    if (!document.head.querySelector(`#${name2}-style`)) {
      const style = document.createElement("style");
      style.id = `${name2}-style`;
      style.innerText = styles;
      document.head.append(style);
    }
  };

  // src/coloris-input.js
  injectStyles_default(
    "coloris-input",
    `${coloris_min_default} 
    .clr-field {display: block;width: 4em;border-radius: var(--bs-border-radius, 0.25rem);overflow: hidden;}
    .clr-field input {cursor: pointer;}
    .clr-field button {width:100%;}`
  );
  defineEl_default("coloris-input", ColorisInput_default);
  var coloris_input_default = ColorisInput_default;
})();
/*! Bundled license information:

@melloware/coloris/dist/esm/coloris.js:
  (*!
  * Copyright (c) 2021-2024 Momo Bassit.
  * Licensed under the MIT License (MIT)
  * https://github.com/mdbassit/Coloris
  * Version: 0.24.0
  * NPM: https://github.com/melloware/coloris-npm
  *)
*/
