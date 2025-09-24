import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type ContextValue = {
  scrollY: SharedValue<number>;
};

const ScrollContext = createContext<ContextValue>({} as ContextValue);

export const ScrollProvider: FC<PropsWithChildren> = ({ children }) => {
  const scrollY = useSharedValue(0);

  const value = { scrollY };

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error("useScrollContext must be used within ScrollProvider");
  }
  return context;
};
