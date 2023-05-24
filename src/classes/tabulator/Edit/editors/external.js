import safeGlobalFn from "../../../../utils/safeGlobalFn.js";
import ce from "../../../../utils/ce.js";

let counter = 0;

export default function (cell, onRendered, success, cancel, editorParams) {
  counter++;

  //create and style editor
  let tagType = editorParams.tagType || "input";
  let input = ce(tagType);
  if (tagType === "input") {
    input.setAttribute("type", "text");
  }

  //create and style tag
  input.style.cssText = `padding:4px;width:100%;box-sizing:border-box`;
  input.setAttribute("id", "tabulator-editor-" + counter);

  //Set value of editor to the current value of the cell
  input.value = cell.getValue() || "";
  input.dataset.prevValue = input.value;

  //Wrap in custom element that must implement a value getter
  let editor = input;
  if (editorParams.element) {
    let element = ce(editorParams.element);
    let elementConfig = editorParams.elementConfig || "{}";
    if (typeof elementConfig === "object") {
      elementConfig = JSON.stringify(elementConfig);
    }
    element.dataset.config = elementConfig;
    element.appendChild(input);
    editor = element;
  }

  //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
  onRendered(function () {
    editor.style.height = "100%";
    input.style.height = "100%";

    //init external editor through a custom function that returns an instance
    let el = editorParams.idSelector ? "#" + editor.getAttribute("id") : editor;
    let opts = editorParams.options || {};
    let inst = editorParams.function ? safeGlobalFn(editorParams.function)(el, opts) : null;

    if (editorParams.initCallback) {
      safeGlobalFn(editorParams.initCallback)(editor, inst, cell);
    }

    setTimeout(() => {
      input.focus({ preventScroll: true });
    }, 1);
  });

  //when the value has been set, trigger the cell to update
  function successFunc() {
    const inputValue = editorParams.rawInput ? input.value.trim() : editor.value.trim();

    // Prevent success if value hasn't changed
    if (inputValue == input.dataset.prevValue) {
      cancel();

      if (editorParams.cancelCallback) {
        safeGlobalFn(editorParams.cancelCallback)(input, cell);
      }
      return;
    }
    success(inputValue);
    if (editorParams.successCallback) {
      safeGlobalFn(editorParams.successCallback)(input, inputValue, cell);
    }
  }

  if (editorParams.inputCallback) {
    const inputCallback = safeGlobalFn(editorParams.inputCallback);
    input.addEventListener("focus", (e) => {
      inputCallback(input, e, cell);
    });
    // We listen on keyup this way editor.value contains the actual value
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

  //return the editor element
  return editor;
}
