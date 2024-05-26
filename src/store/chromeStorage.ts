import { MOUSE_BEHAVIOR_VALUE } from "../constants";

export const chromeStorage = {
  setWindowWidth: (newWidth: string) => {
    browser.storage.sync.set({
      windowWidth: newWidth,
    });
  },

  getWindowWidth: () => {
    return browser.storage.sync.get("windowWidth");
  },

  setMouseBehavior: (newMouseBehavior: MOUSE_BEHAVIOR_VALUE) => {
    console.log("setting newMouseBehavior: ", newMouseBehavior);
    browser.storage.sync.set({
      mouseBehavior: newMouseBehavior,
    });
  },

  getMouseBehavior: async () => {
    const items = await browser.storage.sync.get();
    return items["mouseBehavior"];
  },
};
