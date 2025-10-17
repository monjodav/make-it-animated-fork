import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue, withSpring } from "react-native-reanimated";

type ContextValue = {
  transitionProgress: SharedValue<number>;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
};

const SearchContext = createContext<ContextValue>({} as ContextValue);

export const SearchProvider: FC<PropsWithChildren> = ({ children }) => {
  const transitionProgress = useSharedValue(0);

  const openSearch = () => {
    transitionProgress.set(withSpring(1));
  };
  const closeSearch = () => {
    transitionProgress.set(withSpring(0));
  };
  const toggleSearch = () => {
    if (transitionProgress.get() > 0) closeSearch();
    else openSearch();
  };

  const value = { transitionProgress, openSearch, closeSearch, toggleSearch };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
