chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.videoEnded) {
    chrome.tabs.remove(sender.tab.id);
  }
});
