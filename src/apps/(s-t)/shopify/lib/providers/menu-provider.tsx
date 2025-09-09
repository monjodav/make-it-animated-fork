import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

// shopify-menu-transition-animation 🔽

type ContextValue = {
  menuProgress: SharedValue<number>;
};

const MenuContext = createContext<ContextValue>({} as ContextValue);

/**
 * Context provider for menu animation state
 * Provides shared menuProgress value to coordinate animations across components
 */
export const MenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const menuProgress = useSharedValue(0);

  const value = { menuProgress };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used within an MenuProvider");
  }
  return context;
};

// shopify-menu-transition-animation 🔼
