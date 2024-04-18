import { Room } from "colyseus.js";
import { create } from "zustand";

import * as Storage from "@/utils/Storage";
import { GameRoomState } from "@/lib/schemas/GameRoomState";

type RoomProps = {
  room?: Room<GameRoomState>;
};

export const useRoom = create<RoomProps>(() => ({}));

export function enterRoom(room: Room<GameRoomState>) {
  useRoom.setState({ room: room });
  Storage.setReconnectToken(room.reconnectionToken);
}

export function leaveRoom() {
  Storage.setReconnectToken("");
  useRoom.setState({ room: undefined });
}
