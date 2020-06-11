chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.videoEnded) {
        chrome.tabs.remove(sender.tab.id);
    }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    console.debug("Detected tab updated");
    const { audible } = changeInfo;
    if (!audible) {
        return;
    }
    console.debug("Detected audio started");
    chrome.tabs.sendMessage(tabId, { audiostarted: true });
});