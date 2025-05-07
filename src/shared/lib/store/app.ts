import { createSelectors } from "@/src/shared/lib/utils/create-selectors";
import { create } from "zustand";

interface State {
  isVersionChecked: boolean;
  isNewVersionAvailable: boolean;
  isOtaUpdateAvailable: boolean;
}

interface Actions {
  setIsVersionChecked: (isVersionChecked: boolean) => void;
  setIsNewVersionAvailable: (isNewVersionAvailable: boolean) => void;
  setIsOtaUpdateAvailable: (isOtaUpdateAvailable: boolean) => void;
}

export const initialState: State = {
  isVersionChecked: false,
  isNewVersionAvailable: false,
  isOtaUpdateAvailable: false,
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
}));

export const useAppStore = createSelectors(appStore);
