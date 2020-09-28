const checkbox = document.getElementById("autoclose");
checkbox.addEventListener("change", (event) => {
  const { checked } = event.target;
  console.log(`change to ${checked}`);
  chrome.storage.sync.set({ autoclose: checked });
});

chrome.storage.sync.get("autoclose", (value) => {
  const { autoclose } = value;
  checkbox.checked = autoclose;
  console.log(`restore to ${autoclose}`);
});
