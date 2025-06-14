import { createSelectors } from "@/src/shared/lib/utils/create-selectors";
import { create } from "zustand";
import { IndexView } from "../types/app";

interface State {
  isVersionChecked: boolean;
  isNewVersionAvailable: boolean;
  isOtaUpdateAvailable: boolean;
  indexView: IndexView;
}

interface Actions {
  setIsVersionChecked: (isVersionChecked: boolean) => void;
  setIsNewVersionAvailable: (isNewVersionAvailable: boolean) => void;
  setIsOtaUpdateAvailable: (isOtaUpdateAvailable: boolean) => void;
  setIndexView: (indexView: IndexView) => void;
}

export const initialState: State = {
  isVersionChecked: false,
  isNewVersionAvailable: false,
  isOtaUpdateAvailable: false,
  indexView: "home",
};

const appStore = create<State & Actions>()((set) => ({
  ...initialState,
  setIsVersionChecked: (isVersionChecked) => {
    set((state) => ({
      ...state,
      isVersionChecked,
    }));
  },
  setIsNewVersionAvailable: (isNewVersionAvailable) => {
    set((state) => ({
      ...state,
      isNewVersionAvailable,
    }));
  },
  setIsOtaUpdateAvailable: (isOtaUpdateAvailable) => {
    set((state) => ({
      ...state,
      isOtaUpdateAvailable,
    }));
  },
  setIndexView: (indexView) => {
    set((state) => ({
      ...state,
      indexView,
    }));
  },
}));

export const useAppStore = createSelectors(appStore);
