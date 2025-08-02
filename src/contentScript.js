const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playbackRate = 3.0;

// サイトリストの初期化
let domains = [];
let isInitialized = false;

// サイトリストの読み込み
const file = "default_sites.json";
fetch(chrome.runtime.getURL(file))
  .then(async (response) => {
    domains = await response.json();
    isInitialized = true;
  })
  .catch((e) => {
    console.error('Failed to load site list:', e);
    isInitialized = true;
  });

async function inject(element) {
  console.log(
    `[jnject] ${element.src}, readyState: ${
      element.readyState
    }, time: ${Date.now().toLocaleString()}`
  );
  // element.playbackRate = playbackRate;

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

      // 初期化が完了していない場合は終了
      if (!isInitialized) {
        return;
      }

      // 対象ドメインでない場合は終了
      if (!domains.includes(document.domain)) {
        return;
      }

      // 動画が最後まで再生されていない場合は終了
      if (element.currentTime < element.duration) {
        return;
      }

      // 自動クローズの状態を確認
      chrome.storage.sync.get("autoclose", value => {
        if (value.autoclose) {
          chrome.runtime.sendMessage({ videoEnded: true });
        }
      });
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
