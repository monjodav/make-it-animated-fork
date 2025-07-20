import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type ContextValue = {
  isMenuOpen: SharedValue<boolean>;
};

const AttachFileMenuContext = createContext<ContextValue>({} as ContextValue);

export const AttachFileMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const isMenuOpen = useSharedValue(false);

  const value = { isMenuOpen };

  return <AttachFileMenuContext.Provider value={value}>{children}</AttachFileMenuContext.Provider>;
};

export const useAttachFileMenu = () => {
  const context = useContext(AttachFileMenuContext);

  if (!context) {
    throw new Error("useAttachFileMenu must be used within an AttachFileMenuProvider");
  }

  return context;
};
