import * as Colyseus from "colyseus.js";

import { ClientOption, GameRoomOption, RoomMetadata } from "@/lib/types";
import { GameRoomState } from "@/lib/schemas/GameRoomState";

const client = new Colyseus.Client(import.meta.env.VITE_HOST);
const roomName = "game_room";

export function getAvailableRooms() {
  return client.getAvailableRooms<RoomMetadata>(roomName);
}

export function createRoom(
  roomOption: GameRoomOption,
  clientOption: ClientOption
) {
  return client.create<GameRoomState>(roomName, {
    ...roomOption,
    ...clientOption,
  });
}

export function joinRoom(roomId: string, clientOption: ClientOption) {
  return client.joinById<GameRoomState>(roomId, clientOption);
}

export function reconnectRoom(reconnectToken: string) {
  return client.reconnect<GameRoomState>(reconnectToken);
}
