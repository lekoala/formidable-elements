import parseMoney from "../../../../utils/parseMoney.js";
import isNumeric from "../../../../utils/isNumeric.js";
import ce from "../../../../utils/ce.js";

export default function (cell, onRendered, success, cancel, editorParams) {
  //create and style editor
  var input = ce("input");

  input.setAttribute("type", "text");
  input.setAttribute("inputmode", "decimal");

  //create and style input
  input.style.cssText = `padding:4px;width:100%;box-sizing:border-box`;

  //Set value of editor to the current value of the cell
  input.value = cell.getValue() || "";

  //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
  onRendered(function () {
    input.style.height = "100%";
    if (editorParams.selectContents) {
      input.select();
    }
    setTimeout(() => {
      input.focus({ preventScroll: true });
    }, 1);
  });

  //when the value has been set, trigger the cell to update
  function successFunc() {
    input.value = input.value.trim();
    if (input.value || editorParams.notNull) {
      let fmt = parseMoney(input.value);
      input.value = fmt.output;
    }
    success(input.value);
  }

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      successFunc();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
    // Only allow monetary input
    if (e.key.length === 1 && !(isNumeric(e.key) || [".", ",", "-"].includes(e.key))) {
      e.preventDefault();
    }
  });

  input.addEventListener("change", successFunc);
  input.addEventListener("blur", successFunc);

  //return the editor element
  return input;
}
