chrome.runtime.onInstalled.addListener(() => {
  const defaultKeywords = [
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
  ];
  chrome.storage.sync.set(
    {
      keywords: defaultKeywords,
      filterEnabled: true,
      adFilterEnabled: true,
      loggingEnabled: true,
    },
    () => {
      console.log(
        `Default settings set: keywords = ${defaultKeywords}, filterEnabled = true, adFilterEnabled = true, loggingEnabled = true`
      );
    }
  );
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveKeywords") {
    chrome.storage.sync.set(
      {
        keywords: request.keywords,
        filterEnabled: request.filterEnabled,
        adFilterEnabled: request.adFilterEnabled,
        loggingEnabled: request.loggingEnabled,
      },
      () => {
        console.log(
          `Settings saved: keywords = ${request.keywords}, filterEnabled = ${request.filterEnabled}, adFilterEnabled = ${request.adFilterEnabled}, loggingEnabled = ${request.loggingEnabled}`
        );
        sendResponse({ status: "success" });
      }
    );
    return true;
  }
});
