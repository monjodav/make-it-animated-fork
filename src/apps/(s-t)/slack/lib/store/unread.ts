import { createSelectors } from "@/src/shared/lib/utils/create-selectors";
import { create } from "zustand";
import { Channel, ChannelStatus } from "../types";

const initialData: Channel[] = [
  {
    id: "1",
    name: "channel-1",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
  {
    id: "2",
    name: "channel-2",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
  {
    id: "3",
    name: "channel-3",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
  {
    id: "4",
    name: "channel-4",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
  {
    id: "5",
    name: "channel-5",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
];

interface State {
  unreadChannels: Channel[];
}

interface Actions {
  reset: () => void;
  popChannel: (status: ChannelStatus) => void;
}

export const initialState: State = {
  unreadChannels: initialData,
};

const unreadStore = create<State & Actions>()((set) => ({
  ...initialState,
  reset: () => {
    set(initialState);
  },
  // NOTE: we can handle status of the channel here
  popChannel: (status: ChannelStatus) => {
    set((state) => ({
      ...state,
      unreadChannels: state.unreadChannels.slice(0, -1),
    }));
  },
}));

export const useUnreadStore = createSelectors(unreadStore);
