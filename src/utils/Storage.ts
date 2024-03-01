import { v4 as uuid } from "uuid";

export const getDeviceUuid = () => {
  let deviceUUid = localStorage.getItem("device-id");
  if (!deviceUUid) {
    deviceUUid = uuid();
    localStorage.setItem("device-id", deviceUUid);
  }
  return deviceUUid;
};

export type ColorScheme = "light" | "dark";

export const getColorScheme = () => {
  if (localStorage.getItem("color-scheme") == "dark") {
    return "dark";
  }
  return "light";
};

export const setColorScheme = (scheme: ColorScheme) => {
  localStorage.setItem("color-scheme", scheme);
};
