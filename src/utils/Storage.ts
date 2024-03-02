import { v4 as uuid } from "uuid";

export function getDeviceUuid() {
  let deviceUUid = localStorage.getItem("device-id");
  if (!deviceUUid) {
    deviceUUid = uuid();
    localStorage.setItem("device-id", deviceUUid);
  }
  return deviceUUid;
}

export function getReconnectToken() {
  return localStorage.getItem("reconnect-token");
}

export function setReconnectToken(reconnectToken: string) {
  localStorage.setItem("reconnect-token", reconnectToken);
}

export function getNickname() {
  let nickname = localStorage.getItem("nickname");
  if (!nickname) {
    nickname = `원탁의 기사 ${Math.round(Math.random() * 1000)}`;
    setNickname(nickname);
  }
  return nickname;
}

export function setNickname(nickname: string) {
  localStorage.setItem("nickname", nickname);
}
