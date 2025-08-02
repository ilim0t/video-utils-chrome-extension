chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.videoEnded) {
    chrome.tabs.remove(sender.tab.id);
  }
  return false;
});
