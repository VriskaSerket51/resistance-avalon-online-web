import { create } from "zustand";

import * as Storage from "@/utils/Storage";

type NicknameProps = {
  nickname: string;
};

export const useNickname = create<NicknameProps>(() => ({
  nickname: Storage.getNickname(),
}));

export function changeNickname(nickname: string) {
  useNickname.setState({
    nickname: nickname,
  });
  Storage.setNickname(nickname);
}
