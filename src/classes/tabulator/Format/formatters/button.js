import interpolate from "../../../../utils/interpolate.js";
import ce from "../../../../utils/ce.js";

export default function (cell, formatterParams, onRendered) {
  let iconName = formatterParams.icon;
  // We can show alternative icons based on simple state on the row
  if (formatterParams.showAlt) {
    let showAltField = formatterParams.showAlt;
    let isNot = showAltField[0] == "!";
    showAltField = showAltField.replace("!", "");
    let altValue = cell._cell.row.data[showAltField];
    if (altValue === undefined) {
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
    // It can be an url or an icon name
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
    class: classes,
  };
  if (ajax) {
    attrs["data-ajax"] = ajax;
  }

  if (!url) {
    tag = "button";
    attrs["type"] = "button";
  } else {
    url = interpolate(url, cell._cell.row.data);
    if (Object.keys(urlParams).length > 0) {
      url += "?" + new URLSearchParams(urlParams).toString();
    }
    attrs["href"] = url;
  }

  let buttonEl = ce(tag);
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
