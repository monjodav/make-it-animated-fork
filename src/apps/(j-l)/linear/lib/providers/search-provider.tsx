import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { TIMING_CONFIG } from "../constants/timing-config";

type ContextValue = {
  searchProgress: SharedValue<number>;
  openSearch: () => void;
  closeSearch: () => void;
};

const SearchContext = createContext<ContextValue>({} as ContextValue);

export const SearchProvider: FC<PropsWithChildren> = ({ children }) => {
  const searchProgress = useSharedValue(0);

  const openSearch = () => {
    searchProgress.set(withTiming(1, TIMING_CONFIG));
  };
  const closeSearch = () => {
    searchProgress.set(withTiming(0, TIMING_CONFIG));
  };

  const value = { searchProgress, openSearch, closeSearch };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
