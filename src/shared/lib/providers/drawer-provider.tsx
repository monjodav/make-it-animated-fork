import { createContext, FC, PropsWithChildren, useContext, useRef } from "react";
import { TextInput } from "react-native";

type ContextValue = {
  drawerTextInputRef: React.RefObject<TextInput | null>;
};

const DrawerContext = createContext<ContextValue>({} as ContextValue);

export const DrawerProvider: FC<PropsWithChildren> = ({ children }) => {
  const drawerTextInputRef = useRef<TextInput>(null);

  const value = {
    drawerTextInputRef,
  };

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("useDrawer must be used within an DrawerProvider");
  }

  return context;
};
