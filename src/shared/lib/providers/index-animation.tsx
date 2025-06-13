import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type ContextValue = {
  state: SharedValue<number>;
};

const IndexAnimationContext = createContext<ContextValue>({} as ContextValue);

export const IndexAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const state = useSharedValue<number>(0);

  const value = { state };

  return <IndexAnimationContext.Provider value={value}>{children}</IndexAnimationContext.Provider>;
};

export const useIndexAnimation = () => {
  const context = useContext(IndexAnimationContext);

  if (!context) {
    throw new Error("useIndexAnimation must be used within an IndexAnimationProvider");
  }

  return context;
};
