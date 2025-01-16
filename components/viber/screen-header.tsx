import React, { FC } from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// viber-chats-header-animation 🔽

type Props = {
  title: string;
  onRightButton1Press?: () => void;
  rightIcon1?: React.ReactNode;
  onRightButton2Press?: () => void;
  rightIcon2?: React.ReactNode;
  isHeaderTitleVisible: SharedValue<boolean>;
};

export const ScreenHeader: FC<Props> = ({
  title,
  rightIcon1,
  rightIcon2,
  onRightButton1Press,
  onRightButton2Press,
  isHeaderTitleVisible,
}) => {
  const insets = useSafeAreaInsets();

  const rTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isHeaderTitleVisible.value ? 1 : 0),
    };
  });

  return (
    <View className="items-center px-5 pb-2" style={{ paddingTop: insets.top + 8 }}>
      <Animated.Text className="text-lg text-neutral-300 font-semibold" style={rTitleStyle}>
        {title}
      </Animated.Text>
      <View className="absolute right-5 bottom-2 flex-row items-center gap-5">
        <TouchableOpacity activeOpacity={0.9} hitSlop={15} onPress={onRightButton1Press}>
          {rightIcon1}
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} hitSlop={15} onPress={onRightButton2Press}>
          {rightIcon2}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// viber-chats-header-animation 🔼
