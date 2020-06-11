const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const playbackRate = 3.0;

const func = () => {
    const video = Array.from(document.getElementsByTagName("video"));
    video.forEach(element => {
        console.debug("Processing for Video elements");

        // element.addEventListener('loadeddata', () => video.playbackRate = playbackRate, false);
        element.playbackRate = playbackRate;

        // niconico fix
        Object.defineProperty(element, 'playbackRate', {
            get: () => { console.debug("geted"); return 1.0 },
            set: x => { console.debug(`set x: ${x}`) }
        })

        // Auto tab close
        element.addEventListener('ended', () => {
            console.debug("Listen ended event");
            chrome.runtime.sendMessage({ videoEnded: true })
        }, false);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.audiostarted) {
        console.debug("Executing content process");
        func();
    }
})