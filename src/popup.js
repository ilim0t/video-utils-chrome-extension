const checkbox = document.getElementById("autoclose");
const statusText = document.getElementById("status");
const siteList = document.getElementById("siteList");

// チェックボックスの状態変更時の処理
checkbox.addEventListener("change", (event) => {
  const { checked } = event.target;
  chrome.storage.sync.set({ autoclose: checked });
  updateStatus(checked);
});

// 状態の更新
function updateStatus(enabled) {
  statusText.textContent = enabled ? "有効" : "無効";
  statusText.className = enabled
    ? "font-medium text-green-600"
    : "font-medium text-gray-600";
}

// 対象URLリストの表示
fetch(chrome.runtime.getURL("default_sites.json"))
  .then((response) => response.json())
  .then((targetUrls) => {
    targetUrls.forEach((url) => {
      const li = document.createElement("li");
      li.textContent = url;
      li.className = "text-sm text-gray-600";
      siteList.appendChild(li);
    });
  })
  .catch(console.error);

// 保存された状態の復元
chrome.storage.sync.get("autoclose", (value) => {
  const autoclose = value.autoclose ?? false;
  checkbox.checked = autoclose;
  updateStatus(autoclose);
});
