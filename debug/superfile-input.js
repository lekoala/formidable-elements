(() => {
  // node_modules/superfile/superfile.js
  var BASE_CLASS = "superfile";
  var PREVIEW_CLASS = "superfile-preview";
  var PREVIEW_ACTIVE_CLASS = "superfile-preview-active";
  var CLEAR_CLASS = "superfile-clear";
  var WEBCAM_CLASS = "superfile-webcam";
  var READY_CLASS = "superfile-ready";
  var DRAG_CLASS = "superfile-drag";
  var CLONE_CLASS = "superfile-clone";
  var MAX_WIDTH = 1920;
  var MAX_HEIGHT = 1920;
  var QUALITY = 1;
  var Superfile = class _Superfile {
    /**
     * @param {HTMLInputElement} inputElement
     */
    constructor(inputElement) {
      this.inputElement = inputElement;
      this.holderElement = inputElement.parentElement;
      if (!this.holderElement.classList.contains(BASE_CLASS)) {
        this.holderElement = this.holderElement.parentElement;
      }
      this.previewElement = this.holderElement.querySelector("img." + PREVIEW_CLASS);
      this.clearElement = this.holderElement.querySelector("." + CLEAR_CLASS);
      this.webcamElement = this.holderElement.querySelector("." + WEBCAM_CLASS);
      const data = inputElement.dataset;
      this.disableResize = data.disableResize ? true : false;
      this.maxWidth = data.maxWidth ? parseInt(data.maxWidth) : MAX_WIDTH;
      this.maxHeight = data.maxHeight ? parseInt(data.maxHeight) : MAX_HEIGHT;
      this.hideClear = data.hideClear ? true : false;
      this.imageRatio = data.ratio ? data.ratio.split(/\/|:/) : null;
      this.quality = data.quality ? parseInt(data.quality) : QUALITY;
      if (this.quality > 1) {
        this.quality = this.quality / 100;
      }
      if (this.clearElement && this.hideClear) {
        this.clearElement.dataset.originalDisplay = this.clearElement.style.display ? this.clearElement.style.display : "block";
        this.clearElement.style.display = "none";
      }
      if (this.previewElement && this.previewElement.getAttribute("src")) {
        this.showPreview();
      }
      this.inputElement.addEventListener("change", this);
      if (this.clearElement) {
        this.clearElement.addEventListener("click", this);
      }
      if (this.webcamElement) {
        this.webcamElement.addEventListener("click", this);
      }
      ["dragleave", "dragover", "drop"].forEach((type) => this.holderElement.addEventListener(type, this));
      this.holderElement.classList.add(READY_CLASS);
    }
    dispose() {
      this.inputElement.removeEventListener("change", this);
      if (this.clearElement) {
        this.clearElement.removeEventListener("click", this);
      }
      if (this.webcamElement) {
        this.webcamElement.addEventListener("click", this);
      }
      ["dragleave", "dragover", "drop"].forEach((type) => this.holderElement.removeEventListener(type, this));
    }
    /**
     * Attach to all elements matched by the selector
     * @param {string} selector
     */
    static init(selector = "input[type=file]") {
      let list = document.querySelectorAll(selector);
      for (let i = 0; i < list.length; i++) {
        let el = list[i];
        let inst = new _Superfile(el);
      }
    }
    handleEvent(e) {
      this[`$${e.type}`](e);
    }
    /**
     * This is attached to input element
     * @param {*} e
     */
    $change(e) {
      this.processFiles(() => {
        this.showPreview();
      });
    }
    /**
     * This is attached to clear/webcam element
     * @param {*} e
     */
    $click(e) {
      const btn = e.target.closest("button");
      if (!btn) {
        return;
      }
      if (btn.classList.contains(CLEAR_CLASS)) {
        this.clearPreview();
      }
      if (btn.classList.contains(WEBCAM_CLASS)) {
        this.takePicture();
      }
    }
    /**
     * This is attached to holder element
     * @param {DragEvent} e
     */
    $drop(e) {
      e.stopPropagation();
      e.preventDefault();
      this.inputElement.files = e.dataTransfer.files;
      this.inputElement.dispatchEvent(new Event("change"));
      this.holderElement.classList.remove(DRAG_CLASS);
    }
    /**
     * This is attached to holder element
     * @param {DragEvent} e
     */
    $dragover(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!this.holderElement.classList.contains(DRAG_CLASS)) {
        this.holderElement.classList.add(DRAG_CLASS);
      }
      e.dataTransfer.dropEffect = "copy";
    }
    /**
     * This is attached to holder element
     * @param {DragEvent} e
     */
    $dragleave(e) {
      e.stopPropagation();
      e.preventDefault();
      this.holderElement.classList.remove(DRAG_CLASS);
    }
    showPreview() {
      if (!this.previewElement) {
        return;
      }
      this.holderElement.classList.add(PREVIEW_ACTIVE_CLASS);
      if (this.clearElement && this.clearElement.dataset.originalDisplay) {
        this.clearElement.style.display = this.clearElement.dataset.originalDisplay;
      }
      let previewHolder = this.previewElement.parentElement;
      for (let i = 0; i < this.inputElement.files.length; i++) {
        let file = this.inputElement.files[i];
        if (!file.type.match(/image.*/)) {
          continue;
        }
        let previewEl = previewHolder.querySelectorAll("." + PREVIEW_CLASS)[i];
        if (!previewEl) {
          previewEl = this.previewElement.cloneNode(true);
          previewEl.classList.add(CLONE_CLASS);
          previewHolder.appendChild(previewEl);
        }
        previewEl.src = URL.createObjectURL(file);
      }
    }
    clearPreview() {
      if (this.previewElement) {
        this.holderElement.classList.remove(PREVIEW_ACTIVE_CLASS);
        this.previewElement.removeAttribute("src");
        if (this.hideClear) {
          this.clearElement.style.display = "none";
        }
        let clones = this.holderElement.querySelectorAll("." + CLONE_CLASS);
        for (let i = 0; i < clones.length; i++) {
          clones[i].parentElement.removeChild(clones[i]);
        }
      }
      this.inputElement.value = null;
    }
    takePicture() {
      const video = document.createElement("video");
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
        video.srcObject = stream;
      }).catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
      const onCanPlay = (ev) => {
        video.play();
        let zoom = 0.8;
        let width = video.videoWidth;
        let height = video.videoHeight;
        let sw = width;
        let sh = height;
        let currentRatio = width / height;
        let targetRatio = this.getTargetRatio() || currentRatio;
        width *= zoom;
        height *= zoom;
        if (currentRatio > targetRatio) {
          width = height * targetRatio;
        } else if (currentRatio < targetRatio) {
          height = width / targetRatio;
        }
        let sx = (sw - width) / 2;
        let sy = (sh - height) / 2;
        let canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, sx, sy, width, height, 0, 0, width, height);
        ctx.canvas.toBlob(
          (blob) => {
            this.createProcessedFile(
              {
                type: "image/jpg",
                name: "webcam"
              },
              blob,
              () => {
                this.showPreview();
                video.removeEventListener("canplay", onCanPlay, false);
                video.srcObject.getTracks().forEach((track) => track.stop());
                video.remove();
              }
            );
          },
          "image/jpg",
          this.quality
        );
      };
      video.addEventListener("canplay", onCanPlay, false);
    }
    /**
     * @param {File} file
     * @param {HTMLImageElement} img
     * @param {Function} callback
     * @returns {void}
     */
    resizeImage(file, img, callback) {
      let sw = img.naturalWidth || img.width;
      let sh = img.naturalHeight || img.height;
      let sx = 0;
      let sy = 0;
      let cropWidth = sw;
      let cropHeight = sh;
      let width = sw;
      let height = sh;
      let needResize = width > this.maxWidth || height > this.maxHeight;
      let currentRatio = width / height;
      let targetRatio = this.getTargetRatio() || currentRatio;
      let needCrop = currentRatio !== targetRatio;
      if (!needResize && !needCrop) {
        callback();
        return;
      }
      if (needCrop) {
        if (currentRatio > targetRatio) {
          width = height * targetRatio;
        } else if (currentRatio < targetRatio) {
          height = width / targetRatio;
        }
        sx = (sw - width) / 2;
        sy = (sh - height) / 2;
      }
      if (width > this.maxWidth) {
        cropWidth *= this.maxWidth / width;
        cropHeight *= this.maxWidth / width;
        height *= this.maxWidth / width;
        width = this.maxWidth;
      }
      if (height > this.maxHeight) {
        cropWidth *= this.maxHeight / height;
        cropHeight *= this.maxHeight / height;
        width *= this.maxHeight / height;
        height = this.maxHeight;
      }
      width = Math.round(width);
      height = Math.round(height);
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      if (needCrop) {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cropWidth, cropHeight);
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      ctx.canvas.toBlob(
        (blob) => {
          this.createProcessedFile(file, blob, callback);
        },
        file.type,
        this.quality
      );
    }
    /**
     * @returns {Number}
     */
    getTargetRatio() {
      if (!this.imageRatio) {
        return 0;
      }
      return parseInt(this.imageRatio[0]) / parseInt(this.imageRatio[1]);
    }
    /**
     * @param {File} file
     * @param {Function} callback
     */
    handleResizeImage(file, callback) {
      if (!file.type.match(/image.*/)) {
        callback();
        return;
      }
      if (this.disableResize) {
        callback();
        return;
      }
      let reader = new FileReader();
      reader.onload = (ev) => {
        let img = new Image();
        img.onload = () => {
          this.resizeImage(file, img, callback);
        };
        img.onerror = (ev2) => {
        };
        img.src = ev.target.result;
      };
      reader.onerror = (ev) => {
        console.log(ev);
      };
      reader.readAsDataURL(file);
    }
    /**
     * This will rotate the file and drop exif metadata
     * @param {File|Object} file we use type and name properties
     * @param {Blob} blob
     * @param {Function} callback
     */
    createProcessedFile(file, blob, callback) {
      let resizedFile = new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now()
      });
      let container = new DataTransfer();
      for (let i = 0; i < this.inputElement.files.length; i++) {
        let fileItem = this.inputElement.files[i];
        if (fileItem.name === file.name) {
          container.items.add(resizedFile);
        } else {
          container.items.add(fileItem);
        }
      }
      if (!file.lastModified) {
        container.items.add(resizedFile);
      }
      this.inputElement.files = container.files;
      callback();
    }
    /**
     * @param {Function} callback
     */
    processFiles(callback) {
      let files = this.inputElement.files;
      if (!files.length) {
        callback();
        return;
      }
      for (let i = 0; i < files.length; i++) {
        this.handleResizeImage(files[i], callback);
      }
    }
  };
  var superfile_default = Superfile;

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

  // src/classes/SuperfileElement.js
  var SuperfileElement = class extends FormidableElement_default {
    /**
     * @returns {HTMLInputElement}
     */
    get el() {
      return this.querySelector("input");
    }
    created() {
      const input = this.el;
      this.superfile = new superfile_default(input);
    }
    destroyed() {
      this.superfile.dispose();
      this.superfile = null;
    }
  };
  var SuperfileElement_default = SuperfileElement;

  // src/utils/defineEl.js
  var registry = customElements;
  var defineEl_default = (name, cls) => {
    if (!registry.get(name)) {
      registry.define(name, cls);
    }
  };

  // src/utils/injectStyles.js
  var injectStyles_default = (name, styles) => {
    if (!document.head.querySelector(`#${name}-style`)) {
      const style = document.createElement("style");
      style.id = `${name}-style`;
      style.innerText = styles;
      document.head.append(style);
    }
  };

  // src/superfile-input.js
  injectStyles_default(
    "superfile-input",
    `img:not([src]) {
    display: none;
  }
  .superfile:not(.superfile-ready) {
    visibility: hidden;
  }
  .superfile-drag input {
    background: var(--bs-highlight-bg, palegoldenrod);
  }`
  );
  defineEl_default("superfile-input", SuperfileElement_default);
  var superfile_input_default = SuperfileElement_default;
})();
