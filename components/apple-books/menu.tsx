import { cn } from "@/utils/cn";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Bookmark, Logs, Rows3, Search } from "lucide-react-native";
import React, { FC } from "react";
import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { AnimatedRow } from "./animated-row";
import { MenuButton } from "./menu-button";
import { MenuButtonsWrapper } from "./menu-buttons-wrapper";

const _iconSize = 20;
const _iconColor = "#d4d4d4";

const className = {
  button: "flex-row items-center justify-between",
  text: "text-stone-100 text-lg",
};

type Props = {
  isOpen: boolean;
};

export const Menu: FC<Props> = ({ isOpen }) => {
  const containerHeight = useSharedValue(0);

  return (
    <View className="gap-1" onLayout={(e) => (containerHeight.value = e.nativeEvent.layout.height)}>
      <MenuButtonsWrapper isOpen={isOpen}></MenuButtonsWrapper>
      <AnimatedRow isOpen={isOpen} rowNumber={0} totalRows={4} containerHeight={containerHeight}>
        <MenuButton className={cn(className.button, "bg-neutral-600")}>
          <Text className={className.text}>Contents • 0%</Text>
          <Logs size={_iconSize} color={_iconColor} />
        </MenuButton>
      </AnimatedRow>
      <AnimatedRow isOpen={isOpen} rowNumber={1} totalRows={4} containerHeight={containerHeight}>
        <MenuButton className={className.button}>
          <Text className={className.text}>Search Book</Text>
          <Search size={_iconSize} color={_iconColor} />
        </MenuButton>
      </AnimatedRow>
      <AnimatedRow isOpen={isOpen} rowNumber={2} totalRows={4} containerHeight={containerHeight}>
        <MenuButton className={className.button}>
          <Text className={className.text}>Themes & Settings</Text>
          <View className="flex-row items-center">
            <Text className="text-[14px] text-neutral-100 mt-1 font-semibold">A</Text>
            <Text className="text-[20px] text-neutral-100 font-medium">A</Text>
          </View>
        </MenuButton>
      </AnimatedRow>
      <AnimatedRow isOpen={isOpen} rowNumber={3} totalRows={4} containerHeight={containerHeight}>
        <View className="flex-row gap-1">
          <MenuButton>
            <Feather name="share" size={_iconSize} color={_iconColor} />
          </MenuButton>
          <MenuButton>
            <MaterialIcons name="lock-reset" size={_iconSize} color={_iconColor} />
          </MenuButton>
          <MenuButton>
            <Rows3 size={_iconSize} color={_iconColor} />
          </MenuButton>
          <MenuButton>
            <Bookmark size={_iconSize} color={_iconColor} />
          </MenuButton>
        </View>
      </AnimatedRow>
    </View>
  );
};
