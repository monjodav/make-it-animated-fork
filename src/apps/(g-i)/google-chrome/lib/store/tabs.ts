import { createSelectors } from "@/src/shared/lib/utils/create-selectors";
import { create } from "zustand";
import { TabName } from "../types";

interface State {
  focusedTabName: TabName;
}

interface Actions {
  setFocusedTabName: (focusedTabName: TabName) => void;
}

export const initialState: State = {
  focusedTabName: TabName.Main,
};

const tabsStore = create<State & Actions>()((set) => ({
  ...initialState,
  setFocusedTabName: (focusedTabName) => {
    set((state) => ({
      ...state,
      focusedTabName,
    }));
  },
}));

export const useTabsStore = createSelectors(tabsStore);
