import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

// grok-attach-file-menu-animation 🔽

// Central animation state management for attach file menu
// SharedValue enables UI thread animations without bridge communication
type ContextValue = {
  isMenuOpen: SharedValue<boolean>; // Drives all menu animations synchronously
};

const AttachFileMenuContext = createContext<ContextValue>({} as ContextValue);

export const AttachFileMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  // SharedValue for worklet-optimized animations across all menu components
  // Boolean state coordinates: backdrop blur, menu items slide-in, overlay effects
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

// grok-attach-file-menu-animation 🔼
