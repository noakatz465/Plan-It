import { create } from "zustand";

type MessageType = "success" | "error";

interface MessageState {
  message: string | null;
  type: MessageType | null;
  setMessage: (message: string, type: MessageType) => void;
  clearMessage: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  message: null,
  type: null,
  setMessage: (message, type) => {
    set({ message, type });
    setTimeout(() => {
      set({ message: null, type: null }); // איפוס לאחר 3 שניות
    }, 3000);
  },
  clearMessage: () => set({ message: null, type: null }),
}));
