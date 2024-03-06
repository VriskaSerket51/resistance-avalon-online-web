import { create } from "zustand";

type Chat = {
  name: string;
  text: string;
  datetime: number;
};

type ChatWindowProps = {
  isOpened: boolean;
  count: number;
  addCount: VoidFunction;
  open: VoidFunction;
  close: VoidFunction;
  chats: Chat[];
};

export const useChatWindow = create<ChatWindowProps>((set, get) => ({
  isOpened: false,
  count: 0,
  chats: [],
  addCount: () => {
    const { isOpened, count } = get();
    if (!isOpened) {
      set({ count: count + 1 });
    }
  },
  open: () => {
    set({ count: 0, isOpened: true });
  },
  close: () => {
    set({ isOpened: false });
  },
}));

export function addChat(chat: Chat) {
  const { chats } = useChatWindow.getState();
  useChatWindow.setState({
    chats: [...chats, chat],
  });
}
