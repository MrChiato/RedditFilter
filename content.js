function log(message) {
  chrome.storage.sync.get("loggingEnabled", ({ loggingEnabled }) => {
    if (loggingEnabled) {
      console.log(message);
    }
  });
}

function filterPosts(keywords) {
  const posts = document.querySelectorAll("[aria-label]");
  log(`Found ${posts.length} posts with aria-label`);

  posts.forEach((post) => {
    const postText = post.getAttribute("aria-label").toLowerCase();
    keywords.forEach((keyword) => {
      if (postText.includes(keyword.toLowerCase())) {
        log(`Hiding post containing keyword: ${keyword}`);
        post.style.display = "none";
      }
    });
  });
}

function filterPromotedPosts() {
  const promotedPosts = document.querySelectorAll(
    ".promotedlink, [shreddit-ad-post]"
  );
  log(`Found ${promotedPosts.length} ad posts`);

  promotedPosts.forEach((post) => {
    log(`Hiding ad post`);
    post.style.display = "none";
  });
}

chrome.storage.sync.get(
  ["keywords", "filterEnabled", "adFilterEnabled"],
  ({ keywords, filterEnabled, adFilterEnabled }) => {
    if (filterEnabled && keywords) {
      log(`Keywords loaded: ${keywords}`);
      filterPosts(keywords);
    } else {
      log("Keyword filter is disabled or no keywords found");
    }
    if (adFilterEnabled) {
      filterPromotedPosts();
    } else {
      log("ad post filter is disabled");
    }
  }
);

const observer = new MutationObserver(() => {
  chrome.storage.sync.get(
    ["keywords", "filterEnabled", "adFilterEnabled"],
    ({ keywords, filterEnabled, adFilterEnabled }) => {
      if (filterEnabled && keywords) {
        filterPosts(keywords);
      }
      if (adFilterEnabled) {
        filterPromotedPosts();
      }
    }
  );
});

observer.observe(document.body, { childList: true, subtree: true });
