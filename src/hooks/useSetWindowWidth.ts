import { useEffect } from "react";

//
export function useSetWindowWidth() {
  useEffect(() => {
    function onWindowsSizeChange() {
      let widthToStore = document.documentElement.clientWidth;

      if (widthToStore <= 300) {
        widthToStore = 300;
      }
      browser.storage.sync.set({
        windowWidth: widthToStore,
      });
    }
    const startListeningWindowResizeChange = async () => {
      window.addEventListener("resize", onWindowsSizeChange);
    };

    startListeningWindowResizeChange();

    return () => {
      // this now gets called when the component unmounts
      window.removeEventListener("resize", onWindowsSizeChange);
    };
  }, []);
}
