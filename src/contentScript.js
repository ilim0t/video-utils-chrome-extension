const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playbackRate = 3.0;

let domains = [];

const file = "default_sites.json";
fetch(chrome.extension.getURL(file))
  .then(async (response) => {
    domains = await response.json();
  })
  .catch((e) => {
    console.error(e);
  });

async function inject(element) {
  console.log(
    `[jnject] ${element.src}, readyState: ${
      element.readyState
    }, time: ${Date.now().toLocaleString()}`
  );
  element.playbackRate = playbackRate;

  element.addEventListener(
    "loadeddata",
    (event) => {
      // element.playbackRate = playbackRate;
      console.log(
        `[loadeddata] ${element.src}, readyState: ${
          element.readyState
        }, time: ${Date.now().toLocaleString()}`
      );

      // niconico fix
      // const descriptor = Object.create(null); // 意図しないキーの継承を防止します。
      // descriptor.value = 3.0;

      // 既定で継承不可、変更不可、書換不可のプロパティとなります。
      // Object.defineProperty(document.getElementsByTagName("video")[0], 'playbackRate', descriptor);
      // Object.defineProperty(element, "playbackRate", {
      //     get: () => { console.debug("geted"); return 1.0 },
      //     set: x => { console.debug(`set x: ${x}`) }
      // })
    },
    false
  );

  // Auto tab close
  element.addEventListener(
    "ended",
    () => {
      console.log(
        `[ended] ${element.src}, readyState: ${
          element.readyState
        }, time: ${Date.now().toLocaleString()}`
      );
      // await wait(500);

      if (!domains.includes(document.domain)) {
        return;
      }
      if (element.currentTime < element.duration) {
        return;
      }
      chrome.runtime.sendMessage({ videoEnded: true });
    },
    false
  );
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      const { tagName, parentElement, src } = addedNode;
      if (!parentElement || !src) {
        continue;
      }
      if (tagName == "AUDIO" || tagName == "VIDEO") {
        inject(addedNode);
      }
    }
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});

Array.from(document.getElementsByTagName("video")).forEach((element) =>
  inject(element)
);
