document.addEventListener("DOMContentLoaded", () => {
  const keywordInput = document.getElementById("keywordInput");
  const keywordsTable = document
    .getElementById("keywordsTable")
    .querySelector("tbody");
  const filterToggle = document.getElementById("filterToggle");
  const adFilterToggle = document.getElementById("adFilterToggle");
  const logToggle = document.getElementById("logToggle");
  const saveButton = document.getElementById("save");
  const addPoliticsKeywordsButton = document.getElementById(
    "addPoliticsKeywords"
  );

  const predefinedKeywords = {
    politics: [
      "trump",
      "biden",
      "politics",
      "republican",
      "republicans",
      "democrat",
      "democrats",
      "election",
      "senate",
      "congress",
      "government",
      "policy",
      "maga",
      "politcal",
      "vote",
      "voting",
      "voters",
      "voter",
      "president",
      "campaign",
      "debate",
      "republic",
      "democracy",
      "lib",
      "libs",
      "conservative",
    ],
  };

  function updateKeywordsTable(keywords) {
    keywordsTable.innerHTML = "";
    keywords.forEach((keyword, index) => {
      const row = keywordsTable.insertRow();
      const cellKeyword = row.insertCell(0);
      const cellAction = row.insertCell(1);
      cellKeyword.textContent = keyword;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";
      deleteButton.addEventListener("click", () => {
        keywords.splice(index, 1);
        chrome.storage.sync.set({ keywords });
        updateKeywordsTable(keywords);
      });
      cellAction.appendChild(deleteButton);
    });
  }

  chrome.storage.sync.get(
    ["keywords", "filterEnabled", "adFilterEnabled", "loggingEnabled"],
    (data) => {
      const keywords = data.keywords || [];
      updateKeywordsTable(keywords);
      if (data.filterEnabled !== undefined) {
        filterToggle.checked = data.filterEnabled;
      }
      if (data.adFilterEnabled !== undefined) {
        adFilterToggle.checked = data.adFilterEnabled;
      }
      if (data.loggingEnabled !== undefined) {
        logToggle.checked = data.loggingEnabled;
      }
    }
  );

  keywordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && keywordInput.value.trim() !== "") {
      chrome.storage.sync.get("keywords", (data) => {
        const keywords = data.keywords || [];
        if (!keywords.includes(keywordInput.value.trim())) {
          keywords.push(keywordInput.value.trim());
          chrome.storage.sync.set({ keywords });
          updateKeywordsTable(keywords);
        }
        keywordInput.value = "";
      });
    }
  });

  addPoliticsKeywordsButton.addEventListener("click", () => {
    chrome.storage.sync.get("keywords", (data) => {
      const keywords = data.keywords || [];
      predefinedKeywords.politics.forEach((keyword) => {
        if (!keywords.includes(keyword)) {
          keywords.push(keyword);
        }
      });
      chrome.storage.sync.set({ keywords });
      updateKeywordsTable(keywords);
    });
  });

  saveButton.addEventListener("click", () => {
    const filterEnabled = filterToggle.checked;
    const adFilterEnabled = adFilterToggle.checked;
    const loggingEnabled = logToggle.checked;

    chrome.storage.sync.set(
      { filterEnabled, adFilterEnabled, loggingEnabled },
      () => {
        console.log(
          `Settings saved: filterEnabled = ${filterEnabled}, adFilterEnabled = ${adFilterEnabled}, loggingEnabled = ${loggingEnabled}`
        );
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.reload(tabs[0].id);
        });
      }
    );
  });
});
