import { useEffect, useState } from "react";

export const getBrowserTabs = async () => {
  // let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  return await browser.tabs.query({ currentWindow: true });
};

//
export function useBrowserTabs() {
  const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);

  useEffect(() => {
    const getTabs = async () => {
      const tabs = await browser.tabs.query({});
      setTabs(tabs);
    };

    getTabs();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return { tabs };
}
