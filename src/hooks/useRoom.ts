import { Room } from "colyseus.js";
import { create } from "zustand";

import * as Storage from "@/utils/Storage";
import { GameRoomState } from "@/lib/schemas/GameRoomState";

type RoomProps = {
  room?: Room<GameRoomState>;
  enter: (room: Room<GameRoomState>) => void;
  leave: VoidFunction;
};

export const useRoom = create<RoomProps>((set) => ({
  enter: (room) => {
    set({ room: room });
    Storage.setReconnectToken(room.reconnectionToken);
  },
  leave: () => {
    Storage.setReconnectToken("");
    set({
      room: undefined,
    });
  },
}));
