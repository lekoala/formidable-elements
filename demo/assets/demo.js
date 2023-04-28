// test disconnected
document.querySelector(".delete-btn").addEventListener("click", (e) => {
  const el = document.querySelector(e.currentTarget.dataset.name);
  if (el) {
    console.log("removing element", el);
    // calls disconnectedCallback
    el.parentElement.remove();
    console.log("removed element");
  } else {
    console.log("no element to remove");
  }
});

// test move
document.querySelector(".move-btn").addEventListener("click", (e) => {
  const el = document.querySelector(e.currentTarget.dataset.name);
  if (el) {
    const parent = el.parentElement;
    const target = document.querySelector("#target");
    // this basically calls disconnectedCallback => connectedCallback
    target.appendChild(parent);
    console.log("moved element", el);
  } else {
    console.log("no element to move");
  }
});

// test connected / cloning
let cloneCount = 0;
document.querySelector(".copy-btn").addEventListener("click", (e) => {
  const el = document.querySelector(e.currentTarget.dataset.name);
  if (el) {
    cloneCount++;
    const parent = el.parentElement;

    const newElement = parent.cloneNode(true);
    newElement.querySelectorAll("[name],[id]").forEach((input) => {
      if (input.name) {
        // strip formatted prefix
        if (input.name.indexOf("formatted_") === 0) {
          input.name = input.name.replace("formatted_", "");
        }
        input.name = `clone_${cloneCount}_${input.name}`;
      }
      if (input.id) {
        input.id = `clone_${cloneCount}_${input.id}`;
      }
    });
    // replace name/id
    const label = newElement.querySelector("label");
    if (label) {
      label.innerHTML = `${label.innerHTML} (${cloneCount})`;
    }
    // calls connectedCallback on new element
    parent.parentNode.insertBefore(newElement, parent.nextSibling);

    console.log("copied element", newElement);
  } else {
    console.log("no element to copy");
  }
});
