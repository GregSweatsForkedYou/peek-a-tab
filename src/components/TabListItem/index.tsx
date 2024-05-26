import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { IconContext } from "react-icons";

// utils
import { getBrowserName } from "../../utils/getBrowserName.ts";

// hooks

// styles
import "./styles.css";

// store
import { RootState } from "../../store/store.ts";

// images
import { MdOutlineClose } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
// import { PiSpeakerHighBold } from "react-icons/pi";
// import { PiSpeakerSlashBold } from "react-icons/pi";
import { MdOutlineCommentsDisabled } from "react-icons/md";

// types
type Props = {
  tab: browser.tabs.Tab;
  active: boolean;
  onTabClick: ({ tab }: { tab: browser.tabs.Tab }) => void;
  onTabDoubleClick: ({ tab }: { tab: browser.tabs.Tab }) => void;
  closeTab: ({ tab }: { tab: browser.tabs.Tab }) => void;
  muteUnmuteTab: ({ tab }: { tab: browser.tabs.Tab }) => void;
};

function removeHttpHttpsFromURL(url: string) {
  // Use a regular expression to remove "http://" or "https://"
  url = url.replace(/^(https?)(:\/\/)/, "");
  url = url.replace(/^www\./, "");
  return url.replace(/\/$/, "");
}

function replaceSearchTextWithHighlightedText({
  str = "",
  searchText = "",
}: {
  str: string | undefined;
  searchText: string | undefined;
}) {
  const searchTextCleaned = searchText.trim().toLowerCase();
  const startIndex = str.toLowerCase().indexOf(searchTextCleaned);

  if (searchTextCleaned && startIndex === -1) {
    return null;
  } else if (!searchTextCleaned) {
    return <span>{str}</span>;
  }

  const endIndex = startIndex + searchText.length;

  const firstPart = str.substring(0, startIndex);
  const secondPart = str.substring(endIndex);

  const substring = str.substring(startIndex, endIndex);

  return (
    <span>
      {firstPart}
      <span className="highlight">{substring}</span>
      {secondPart}
    </span>
  );
}

function TabListItem({
  tab,
  active,
  onTabClick,
  onTabDoubleClick,
  closeTab,
}: // muteUnmuteTab,
Props) {
  const ref = useRef<HTMLInputElement>(null);

  const searchInputText = useSelector(
    (state: RootState) => state.data.searchInputText
  );

  useEffect(() => {
    if (active && ref.current) {
      ref.current?.focus();
    }
  }, [active, ref]);

  const tabTitle = replaceSearchTextWithHighlightedText({
    str: removeHttpHttpsFromURL(tab.title || ""),
    searchText: searchInputText,
  });

  const tabUrl = replaceSearchTextWithHighlightedText({
    str: removeHttpHttpsFromURL(tab.url || ""),
    searchText: searchInputText,
  });

  if (!tabTitle && !tabUrl) {
    return null;
  }

  let tabFaviconUrl = tab.favIconUrl;

  if (!tabFaviconUrl && tab.url?.toLowerCase().startsWith("http")) {
    tabFaviconUrl = `https://www.google.com/s2/favicons?sz=32&domain_url=${removeHttpHttpsFromURL(
      tab.url
    )}`;
  }

  const browserName = getBrowserName();

  if (tab.audible || tab.mutedInfo?.muted) {
    console.log("tab.audible: ", tab.audible);
  }

  return (
    <IconContext.Provider value={{ size: "16px", className: "tabButtonIcon" }}>
      <div
        data-tabId={tab.id}
        tabIndex={0} // to make focus work
        ref={ref}
        className={`tab ${active ? "active" : ""} ${
          tab.discarded ? "discarded" : ""
        }`}
        onClick={() => {
          onTabClick({ tab });
        }}
        onDoubleClick={() => {
          onTabDoubleClick({ tab });
        }}
      >
        <div className="tab-icon-container">
          <img className="tab-icon" src={tabFaviconUrl} />
          {/* {tab.audible || tab.mutedInfo?.muted ? (
            <button
              onClick={(e) => {
                muteUnmuteTab({ tab });
                e.stopPropagation();
              }}
              className="tabAudioButton"
            >
              {tab.mutedInfo?.muted ? (
                <PiSpeakerSlashBold />
              ) : (
                <PiSpeakerHighBold />
              )}
            </button>
          ) : null} */}
        </div>
        <div className="tab-texts">
          <p className="tab-title" title={tab.title}>
            {tabTitle || tab.title}
          </p>
          <p className="tab-url" title={tab.url}>
            {tabUrl || tab.url}
          </p>
        </div>
        <div className="tabButtonsContainer">
          {browserName != "Safari" ? (
            <>
              {tab.discarded ? (
                <button
                  onClick={(e) => {
                    if (tab.id) {
                      browser.tabs.reload(tab.id);
                    }
                    e.stopPropagation();
                  }}
                  className="tabButton tabButtonRefresh"
                  title="Make the tab active, will refresh the tab"
                >
                  <MdRefresh />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    if (tab.id) {
                      browser.tabs.discard(tab.id);
                    }
                    e.stopPropagation();
                  }}
                  className="tabButton tabButtonRefresh"
                  title="Make the tab inactive"
                >
                  <MdOutlineCommentsDisabled />
                </button>
              )}
            </>
          ) : null}
          <button
            onClick={(e) => {
              closeTab({ tab });
              e.stopPropagation();
            }}
            className="tabButton tabButtonClose"
            title="Close the tab"
          >
            <MdOutlineClose />
          </button>
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default TabListItem;
