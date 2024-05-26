import { useEffect, useState } from "react";
//
export function useBrowserWindows() {
  const [windows, setWindows] = useState<browser.windows.Window[]>([]);

  useEffect(() => {
    const getWindows = async () => {
      const windows = await browser.windows.getAll({ populate: true });
      setWindows(windows);
    };

    browser.tabs.onHighlighted.addListener(getWindows);
    browser.tabs.onRemoved.addListener(getWindows);
    browser.tabs.onUpdated.addListener(getWindows);

    getWindows();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return { windows };
}
