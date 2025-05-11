import { createSelectors } from "@/src/shared/lib/utils/create-selectors";
import { create } from "zustand";
import { TabItem, TabName } from "../types";

interface State {
  focusedTabName: TabName;
  mainTabData: TabItem[];
  mainTabActiveTabItemId: string | null;
  incognitoTabData: TabItem[];
  incognitoTabActiveTabItemId: string | null;
}

interface Actions {
  setFocusedTabName: (focusedTabName: TabName) => void;
  setMainTabActiveTabItemId: (id: string | null) => void;
  setIncognitoTabActiveTabItemId: (id: string | null) => void;
  addTabItem: (tabName: TabName) => void;
  removeTabItem: (tabName: TabName, id: string) => void;
}

export const initialState: State = {
  focusedTabName: TabName.Main,
  mainTabData: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }],
  mainTabActiveTabItemId: "3",
  incognitoTabData: [{ id: "1" }, { id: "2" }],
  incognitoTabActiveTabItemId: "1",
};

const tabsStore = create<State & Actions>()((set) => ({
  ...initialState,
  setFocusedTabName: (focusedTabName) => {
    set((state) => ({
      ...state,
      focusedTabName,
    }));
  },
  setMainTabActiveTabItemId: (id) => {
    set((state) => ({
      ...state,
      mainTabActiveTabItemId: id,
    }));
  },
  setIncognitoTabActiveTabItemId: (id) => {
    set((state) => ({
      ...state,
      incognitoTabActiveTabItemId: id,
    }));
  },
  addTabItem: (tabName) => {
    set((state) => {
      const id = new Date().toISOString();

      if (tabName === TabName.Main) {
        return {
          ...state,
          mainTabData: [...state.mainTabData, { id }],
          mainTabActiveTabItemId: id,
        };
      }

      return {
        ...state,
        incognitoTabData: [...state.incognitoTabData, { id }],
        incognitoTabActiveTabItemId: id,
      };
    });
  },
  removeTabItem: (tabName, id) => {
    set((state) => {
      if (tabName === TabName.Main) {
        return {
          ...state,
          mainTabData: state.mainTabData.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        incognitoTabData: state.incognitoTabData.filter((item) => item.id !== id),
      };
    });
  },
}));

export const useTabsStore = createSelectors(tabsStore);
