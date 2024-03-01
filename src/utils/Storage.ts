import { v4 as uuid } from "uuid";

export function getDeviceUuid() {
  let deviceUUid = localStorage.getItem("device-id");
  if (!deviceUUid) {
    deviceUUid = uuid();
    localStorage.setItem("device-id", deviceUUid);
  }
  return deviceUUid;
}

export type ColorScheme = "light" | "dark";

export function getColorScheme() {
  if (localStorage.getItem("color-scheme") == "dark") {
    return "dark";
  }
  return "light";
}

export function setColorScheme(scheme: ColorScheme) {
  localStorage.setItem("color-scheme", scheme);
}
