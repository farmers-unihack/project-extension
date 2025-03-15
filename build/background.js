let startTime = null;
let endTime = null;
let running = false;
let block = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ startTime: null, endTime: null, running: false, targetTimeMinutes: 0, block: false});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    startTime = message.startTime;
    endTime = message.endTime;
    running = message.running;

    chrome.storage.local.set({startTime, endTime, running});
  } else if (message.action === "stop") {
    chrome.storage.local.set({startTime: null, endTime: null, running: false, block: false});
  }
});