import { createContext, useContext } from "react";
import Animated, { SharedValue } from "react-native-reanimated";

export interface ScrollProviderType {
  scrollY: SharedValue<number> | null;
  setScrollY: (value: SharedValue<number>) => void;
}

export const ScrollProvider = createContext<ScrollProviderType>({
  scrollY: null,
  setScrollY: () => {},
});

export const useScrollContext = () => {
  const context = useContext(ScrollProvider);
  if (!context) {
    throw new Error("useScrollContext must be used within ScrollProvider");
  }
  return context;
};
