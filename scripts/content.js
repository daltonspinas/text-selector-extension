///////
//SCRIPT SETUP//
//////
createPopup();
let skills = [];
document.onmouseup = debounce(getSelectedText, 250);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // TODO: Pass selected skill to API and close the extension
  if (request.message === "save-and-close") destroyPopup();
});

///////
// LOGIC/UI HANDLERS  //
//////

function getSelectedText() {
  let selectedSkill = window.getSelection().toString();
  if (selectedSkill && !skills.find((x) => x == selectedSkill)) {
    skills.push(selectedSkill);
    updateSkillsHTML();
  }
}

function updateSkillsHTML() {
  // TODO: find a way to add/remove skills without re-doing all HTML elements in the list
  const skillList = document.getElementById("skill-list");
  skillsHTML = skills.map((x, idx) => {
    listElement = createListElement(x, idx);
    return listElement;
  });
  skillList.replaceChildren(...skillsHTML);
}

function createListElement(skill, idx) {
  // TODO: better way to set attributes in bulk in vanilla javascript?
  let listElement = document.createElement("li");
  listElement.innerText = skill;
  listElement.className = "skill-list-item";
  listElement.setAttribute("data-index", idx);
  listElement.appendChild(createButtonElement(idx));
  return listElement;
}

function createButtonElement(idx) {
  let btn = document.createElement("button");
  btn.innerText = "X";
  btn.className = "skill-list-item-bn";
  btn.setAttribute("data-index", idx);
  btn.addEventListener("click", function (e) {
    removeSelection(idx);
  });
  return btn;
}

function removeSelection(idx) {
  skills.splice(idx, 1);
  updateSkillsHTML();
}

function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

///////
//POPUP HANDLERS//
//////

function createPopup() {
  // grab the html file to inject into web page
  fetch(chrome.runtime.getURL("/overlay/overlay.html"))
    .then((r) => r.text())
    .then((html) => {
      document.body.insertAdjacentHTML("afterbegin", html);

      // Want to clear selection when the user is on the popup to avoid conflict
      document
        .getElementById("skill-overlay")
        .addEventListener("mouseover", () => {
          window.getSelection().empty();
        });
    });
}

function destroyPopup() {
  document.getElementById("skill-overlay").remove();
}
