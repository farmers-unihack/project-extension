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
    blockedURLS: [],
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
        if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
          chrome.tabs.reload(tab.id, () => {
            if (chrome.runtime.lastError) {
              console.error("Failed to refresh tab", chrome.runtime.lastError);
            }
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
  else if (message.action === "update_metrics") {
    clickCount = message.clickCount;  
    wordCount = message.wordCount;   
    chrome.storage.local.set({
      clickCount: clickCount,
      wordCount: wordCount
    });
  }

  sendResponse({ status: "received" });
  return true;
});
