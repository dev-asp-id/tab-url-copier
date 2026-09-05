document.addEventListener("DOMContentLoaded", () => {
  // Translate UI dynamically using chrome.i18n
  applyI18n();

  const separatorSelect = document.getElementById("separator");
  const customContainer = document.getElementById("custom-input-container");
  const customInput = document.getElementById("custom-separator");
  const copyBtn = document.getElementById("copy-btn");
  const statusMsg = document.getElementById("status-msg");
  const repoLink = document.getElementById("repo-link");

  // Open GitHub link in new tab
  if (repoLink) {
    repoLink.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: repoLink.href });
    });
  }

  // Toggle custom separator input
  separatorSelect.addEventListener("change", () => {
    if (separatorSelect.value === "custom") {
      customContainer.classList.remove("hidden");
    } else {
      customContainer.classList.add("hidden");
    }
  });

  // Copy URLs to clipboard
  copyBtn.addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const urls = tabs.map((tab) => tab.url);

    let delimiter = "\n";
    const selectedType = separatorSelect.value;

    switch (selectedType) {
      case "newline":
        delimiter = "\n";
        break;
      case "semicolon":
        delimiter = "; ";
        break;
      case "comma":
        delimiter = ", ";
        break;
      case "space":
        delimiter = " ";
        break;
      case "custom":
        delimiter = customInput.value || "\n";
        break;
    }

    const resultText = urls.join(delimiter);

    try {
      await navigator.clipboard.writeText(resultText);

      statusMsg.classList.remove("hidden");
      setTimeout(() => {
        statusMsg.classList.add("hidden");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });
});

// Function to translate elements with data-i18n attribute
function applyI18n() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const message = chrome.i18n.getMessage(key);
    if (message) {
      element.textContent = message;
    }
  });
}
