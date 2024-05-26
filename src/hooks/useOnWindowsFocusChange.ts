import { useEffect } from "react";

//
export function useOnWindowsFocusChange() {
  useEffect(() => {
    function onWindowsFocusChange() {
      window.close();
    }
    const startListeningWindowsFocusChange = async () => {
      browser.windows.onFocusChanged.addListener(onWindowsFocusChange);
    };

    startListeningWindowsFocusChange();

    return () => {
      // this now gets called when the component unmounts
      browser.windows.onFocusChanged.removeListener(onWindowsFocusChange);
    };
  }, []);
}
