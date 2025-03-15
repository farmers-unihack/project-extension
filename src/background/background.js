let startTime = null;
let endTime = null;
let running = false;
let block = false;
let clickCount = 0;
let wordCount = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    startTime: null,
    endTime: null,
    running: false,
    targetTimeMinutes: 0,
    block: false,
    clickCount: 0,
    wordCount: 0,
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    startTime = message.startTime;
    endTime = message.endTime;
    running = message.running;

    chrome.storage.local.set({ startTime, endTime, running, clickCount: 0, wordCount: 0, block: true });
    chrome.tabs.query({}, (tabs) => {
      for (let tab of tabs) {
        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["src/background/content.js"],
          });
        }
      }
    });
    
  } 
  else if (message.action === "stop") {
    chrome.storage.local.set({
      startTime: null,
      endTime: null,
      running: false,
      block: false,
    });
  } 
  else if (message.action === "trackWord") {
    chrome.storage.local.get(["wordCount"], (data) => {
      let updatedWordCount = (data.wordCount || 0) + 1;
      chrome.storage.local.set({ wordCount: updatedWordCount });
    });
  } 
  else if (message.action === "trackClick") {
    chrome.storage.local.get(["clickCount"], (data) => {
      let updatedClickCount = (data.clickCount || 0) + 1;
      chrome.storage.local.set({ clickCount: updatedClickCount });
    });
  }

  sendResponse({ status: "received" });
  return true;
});