export const MOUSE_BEHAVIOR = {
  HOVER: "hover",
  SINGLE_CLICK: "singleClick",
  DOUBLE_CLICK: "doubleClick",
} as const;

export type MOUSE_BEHAVIOR_KEY = keyof typeof MOUSE_BEHAVIOR;
export type MOUSE_BEHAVIOR_VALUE = (typeof MOUSE_BEHAVIOR)[MOUSE_BEHAVIOR_KEY];
