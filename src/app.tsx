// hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// import { useSetMouseBehaviorFromStorage } from "./hooks/useSetMouseBehaviorFromStorage.ts";

// components
import Header from "./components/Header";

// styles
import "./app.css";
import TabListItem from "./components/TabListItem/index.tsx";

// store
import { RootState } from "./store/store.ts";
import { setActiveTabId } from "./store/dataSlice.ts";

// constants
import { MOUSE_BEHAVIOR } from "./constants.ts";
// import { useOnWindowsFocusChange } from "./hooks/useOnWindowsFocusChange.ts";
import { useSetWindowWidth } from "./hooks/useSetWindowWidth.ts";

let closeWindowOnFocusChange = true;
let platformOS = ""; // mac || win || linux || something else
browser.runtime.getPlatformInfo().then((platformInfo) => {
  platformOS = platformInfo.os;
});

/**
 *
 * @returns
 */
export function App() {
  const [currentWindowId, setCurrentWindowId] = useState<number | null>(null);
  const [windows, setWindows] = useState<browser.windows.Window[]>([]);
  useSetWindowWidth();
  // useOnWindowsFocusChange();
  // useSetMouseBehaviorFromStorage();

  const dispatch = useDispatch();

  const { mouseBehavior, activeTabId } = useSelector(
    (state: RootState) => state.data
  );

  const getWindows = async () => {
    const windows = await browser.windows.getAll({ populate: true });
    setWindows(windows);
  };

  // browser.tabs.onRemoved.addListener(getWindows);
  // browser.tabs.onUpdated.addListener(getWindows);

  const switchTab = async ({ tab }: { tab: browser.tabs.Tab }) => {
    if (tab.id) {
      browser.tabs.update(tab.id, { active: true });
      dispatch(setActiveTabId(tab.id));
    }

    if (activeTabId && tab.windowId) {
      const activeTab = await browser.tabs.get(activeTabId);
      if (tab.windowId != activeTab.windowId && currentWindowId) {
        closeWindowOnFocusChange = false;
        await browser.windows.update(tab.windowId, { focused: true });
        await browser.windows.update(currentWindowId, { focused: true });
        closeWindowOnFocusChange = true;
      }
    }
  };

  const closeThisWindow = () => {
    window.close();
  };

  const onTabClick = ({ tab }: { tab: browser.tabs.Tab }) => {
    switchTab({ tab });
  };

  const onTabDoubleClick = ({ tab }: { tab: browser.tabs.Tab }) => {
    // console.log("tab double clicked: ", tab);
    if (mouseBehavior == MOUSE_BEHAVIOR.DOUBLE_CLICK) {
      switchTab({ tab });
      closeThisWindow();
    }
  };

  const muteUnmuteTab = ({ tab }: { tab: browser.tabs.Tab }) => {
    if (tab.id) {
      browser.tabs.update(tab.id, { muted: !tab.mutedInfo?.muted });
      getWindows();
    }
  };

  const closeTab = ({ tab }: { tab: browser.tabs.Tab }) => {
    if (tab.id) {
      console.log("tab id to remove: ", tab.id);
      browser.tabs.remove(tab.id);
      getWindows();
    }
  };

  const closeTabIfActiveElement = () => {
    if (
      document.activeElement &&
      document.activeElement.classList.contains("tab")
    ) {
      const closeBtn = document.activeElement.querySelector(".tabButtonClose");
      if (closeBtn) {
        (closeBtn as HTMLButtonElement).click();
      }
    }
  };

  const windowsToRender = windows.filter((w) => w.type !== "popup");
  const totalTabsCount = windowsToRender.reduce((totalTabs, window) => {
    totalTabs = totalTabs + (window.tabs?.length || 0);
    return totalTabs;
  }, 0);

  function getActiveTabIndexAndTabElementsLength() {
    const tabEls = document.getElementsByClassName("tab");

    let tabIndex;

    for (tabIndex = 0; tabIndex < tabEls.length; tabIndex++) {
      if (tabEls[tabIndex].classList.contains("active")) {
        return { tabIndex, tabElementsLength: tabEls.length };
      }
    }

    return { tabIndex: -1, tabElementsLength: 0 };
  }

  function makeTabIndexActive(tabIndex: number) {
    const tabElement = document.getElementsByClassName("tab")[tabIndex];
    (tabElement as HTMLButtonElement).click();
  }

  function makeNextTabActive() {
    const { tabIndex, tabElementsLength } =
      getActiveTabIndexAndTabElementsLength();

    if (tabIndex < tabElementsLength - 1) {
      makeTabIndexActive(tabIndex + 1);
      return;
    }
    makeTabIndexActive(0);
  }

  function makePreviousTabActive() {
    const { tabIndex, tabElementsLength } =
      getActiveTabIndexAndTabElementsLength();

    if (tabIndex == 0) {
      makeTabIndexActive(tabElementsLength - 1);
      return;
    }

    makeTabIndexActive(tabIndex - 1);
  }

  useEffect(() => {
    getWindows();

    browser.windows.getCurrent().then((window) => {
      if (window.id) {
        setCurrentWindowId(window.id);
      }
    });

    browser.tabs.onUpdated.addListener(() => {
      getWindows();
    });

    browser.tabs.onHighlighted.addListener((highlightInfo) => {
      if (highlightInfo.tabIds.length > 0) {
        dispatch(setActiveTabId(highlightInfo.tabIds[0]));
      }
      getWindows();
    });

    function onWindowsFocusChange() {
      if (closeWindowOnFocusChange) {
        closeThisWindow();
      }
    }

    browser.windows.onFocusChanged.addListener(onWindowsFocusChange);

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          makePreviousTabActive();
          break;
        case "ArrowDown":
          event.preventDefault();
          makeNextTabActive();
          break;
        case "Tab":
          event.preventDefault();
          makeNextTabActive();
          break;
        case "Space":
          if (document.activeElement) {
            (document.activeElement as HTMLButtonElement).click();
          }
          break;
        case "Enter": //enter
          // open first tab when where is no active tab
          if (!document.activeElement) {
            break;
          }

          if (document.activeElement.classList.contains("tab")) {
            if (document.activeElement.classList.contains("active")) {
              closeThisWindow();
            } else {
              (document.activeElement as HTMLButtonElement).click();
            }
          } else if (document.activeElement.tagName == "INPUT") {
            makeTabIndexActive(0);
          }
          break;
        case "Escape": //esc
          closeThisWindow();
          break;
        case "Backspace": //backspace
          if (
            (platformOS == "mac" && event.metaKey) ||
            (platformOS != "mac" && event.shiftKey)
          ) {
            closeTabIfActiveElement();
          }
          break;
        case "Delete": //delete
          closeTabIfActiveElement();
          break;
        default:
        //if search input is not focused and space or any of alphanumeric keys is pressed
        // if (document.activeElement != searchInput) {
        //   searchInput.focus();
        //   // searchInput.value = searchInput.value + String.fromCharCode(e.keyCode)
        // }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
      browser.windows.onFocusChanged.removeListener(onWindowsFocusChange);
    };
  }, []);

  return (
    <>
      <div className="app-header-container">
        <Header totalTabsCount={totalTabsCount} />
      </div>
      <div className="app-windows-list-container">
        {windows
          .filter((w) => w.type !== "popup")
          .map((window, index) => (
            <div className="window-list-item-container">
              <p className="window-list-item-heading">
                Window {index + 1} ({window.tabs?.length} tabs)
              </p>
              <div className="window-list-item-body">
                <p className="window-list-item-no-tab-msg">No tab found</p>

                <div className="tabs-list">
                  {window.tabs?.map((tab) => (
                    <TabListItem
                      key={tab.id}
                      tab={tab}
                      onTabClick={onTabClick}
                      onTabDoubleClick={onTabDoubleClick}
                      closeTab={closeTab}
                      muteUnmuteTab={muteUnmuteTab}
                      active={tab.id == activeTabId}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
