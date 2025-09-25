import { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type ContextValue = {
  scrollY: SharedValue<number>;
  title: string;
  setTitle: (title: string) => void;
};

const ScrollContext = createContext<ContextValue>({} as ContextValue);

export const ScrollProvider: FC<PropsWithChildren> = ({ children }) => {
  const scrollY = useSharedValue(0);
  const [title, setTitle] = useState<string>("Title");

  const value = { scrollY, title, setTitle };

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error("useScrollContext must be used within ScrollProvider");
  }
  return context;
};
