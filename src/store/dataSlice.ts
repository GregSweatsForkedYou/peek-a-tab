import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// constants
import { MOUSE_BEHAVIOR, MOUSE_BEHAVIOR_VALUE } from "../constants";
import { chromeStorage } from "./chromeStorage";

const urlParams = new URLSearchParams(window.location.search);

const initialState = {
  activeTabId: urlParams.get("tabId") ? Number(urlParams.get("tabId")) : null,
  mouseBehavior: MOUSE_BEHAVIOR.DOUBLE_CLICK as MOUSE_BEHAVIOR_VALUE,
  searchInputText: "",
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setActiveTabId: (state, action: PayloadAction<number>) => {
      state.activeTabId = action.payload;
      return state;
    },
    setMouseBehavior: (state, action: PayloadAction<MOUSE_BEHAVIOR_VALUE>) => {
      state.mouseBehavior = action.payload;
      chromeStorage.setMouseBehavior(action.payload);
    },
    setSearchInputText: (state, action: PayloadAction<string>) => {
      state.searchInputText = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActiveTabId, setMouseBehavior, setSearchInputText } =
  dataSlice.actions;

export default dataSlice;
