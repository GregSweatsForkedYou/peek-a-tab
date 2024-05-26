const tabIdentifier = "sdg9878CIU7f87yq9jxf8yaf987jxakuh89j78HU";

function urlHasTabIdentifier(url) {
  return url.includes(tabIdentifier);
}

browser = (function () {
  if (chrome) return chrome;
  else return browser;
})();

browser.action.onClicked.addListener((tab) => {
  console.log("clicked");
  browser.storage.sync.get(null, function (items) {
    console.log("items: ", JSON.stringify(items));

    let width = 400;

    if (typeof items.windowWidth == "number") {
      width = items.windowWidth;
    }

    browser.windows.get(tab.windowId, {}, (window) => {
      browser.windows.create({
        url: browser.runtime.getURL(
          `dist/index.html?tabId=${tab.id}&tabIdentifier=${tabIdentifier}`
        ),
        type: "popup",
        focused: true,
        width: width,
        height: window.height,
        left: window.left + window.width - width,
        top: window.top,
      });
    });
  });
});

async function setBadge() {
  const tabs = await browser.tabs.query({});

  const tabsLength = tabs.filter((tab) => !urlHasTabIdentifier(tab.url)).length;

  browser.action.setBadgeText({
    text: "" + tabsLength,
  });

  browser.action.setBadgeTextColor({ color: "#fff" });
  browser.action.setBadgeBackgroundColor({ color: "#FF4F44" }); // safari shows this color by default and it can't be overwritten, so we are using this color.

  // browser.action.setIcon({
  //   path: { 64: "../images/icon-64.png" },
  // });
}

async function setBadgeWithDelay() {
  setTimeout(() => {
    // with this delay, tabs are fully populated and peek-a-tab tab is identified properly
    setBadge();
  }, 200);
}

setBadge();

browser.tabs.onRemoved.addListener(setBadgeWithDelay);
browser.tabs.onCreated.addListener(setBadgeWithDelay);
browser.tabs.onActivated.addListener(setBadgeWithDelay);
