import { createContext, FC, PropsWithChildren, useContext } from "react";
import { View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { Menu } from "../../components/menu";
import { Button } from "../../components/button";

// shopify-menu-transition-animation 🔽

type ContextValue = {
  menuProgress: SharedValue<number>;
};

const MenuContext = createContext<ContextValue>({} as ContextValue);

export const MenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const menuProgress = useSharedValue(0);

  const value = { menuProgress };

  return (
    <MenuContext.Provider value={value}>
      {/* 
        Root container for menu animation context.
        Children are rendered below the menu and button overlays.
        The menuProgress shared value is used by Menu/Button for coordinated transitions.
      */}
      <View className="flex-1 bg-black">
        <View className="flex-1">{children}</View>
        {/* 
          Menu and Button components consume menuProgress for animated transitions.
          They should use interpolation to animate opacity, translation, etc.
        */}
        <Menu />
        <Button />
      </View>
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used within an MenuProvider");
  }
  return context;
};

// shopify-menu-transition-animation 🔼
