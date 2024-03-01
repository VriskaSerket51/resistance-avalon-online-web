import * as Colyseus from "colyseus.js";

const client = new Colyseus.Client("ws://localhost:2567");
const roomName = "game_room";

export function getAvailableRooms() {
  return client.getAvailableRooms(roomName);
}

export function createRoom() {
  return client.create(roomName);
}
