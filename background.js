const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.insertCSS({
    files: ["/overlay/overlay.css"],
    target: { tabId: tab.id },
  });

  chrome.commands.onCommand.addListener((command) => {
    if (command === "save-and-close") {
      chrome.tabs.sendMessage(tab.id, { message: "save-and-close" });
    }
  });

  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: prevState === "OFF" ? "ON" : "OFF",
  });

  //chrome.action.setPopup({popup: 'popup.html'})

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: ["scripts/content.js"],
    })
    .then(() => console.log("script injected"));
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "update-skills") {
    // do something
  }
});
