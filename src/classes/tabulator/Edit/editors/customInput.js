import ce from "../../../../utils/ce.js";
import isNumeric from "../../../../utils/isNumeric.js";

export default function (cell, onRendered, success, cancel, editorParams) {
  //create and style input
  var cellValue = cell.getValue(),
    input = ce("input");

  input.setAttribute("type", editorParams.type || "text");

  const inputmode = editorParams.inputmode || (editorParams.type == "email" ? "email" : "text");
  input.setAttribute("inputmode", inputmode);

  input.style.cssText = `padding:4px;width:100%;box-sizing:border-box`;

  input.value = typeof cellValue !== "undefined" ? cellValue : "";

  onRendered(function () {
    if (cell.getType() === "cell") {
      input.focus({ preventScroll: true });
      input.style.height = "100%";

      if (editorParams.selectContents) {
        input.select();
      }
    }
  });

  function onChange(e) {
    if (((cellValue === null || typeof cellValue === "undefined") && input.value !== "") || input.value !== cellValue) {
      if (success(input.value)) {
        cellValue = input.value; //persist value if successfully validated incase editor is used as header filter
      }
    } else {
      cancel();
    }
  }

  //submit new value on blur or change
  input.addEventListener("change", onChange);
  input.addEventListener("blur", onChange);

  //submit new value on enter
  input.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      // case 9:
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

    // Only allow monetary input
    if (editorParams.inputmode == "decimal") {
      if (e.key.length === 1 && !(isNumeric(e.key) || [".", ",", "-"].includes(e.key))) {
        e.preventDefault();
      }
    }
  });

  return input;
}
