import { FC } from "react";

import { Pencil } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";

// colorsapp-palette-picker-color-change-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

type Props = {
  color: SharedValue<string>;
  handleEditPress?: () => void;
};

export const ColorItem: FC<Props> = ({ color, handleEditPress }) => {
  const rContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(color.value, { duration: 100 }),
  }));

  const rColor = useDerivedValue(() => {
    return color.value.toUpperCase();
  });

  return (
    <View className="flex-1">
      <ReText text={rColor} style={styles.text} />
      <View className="h-1" />
      <AnimatedPressable
        activeOpacity={handleEditPress ? 0.8 : 1}
        onPress={handleEditPress}
        className="w-full aspect-square rounded-lg items-center justify-center"
        style={rContainerStyle}
      >
        {handleEditPress && (
          <View className="w-6 h-6 rounded-full bg-zinc-800/30 items-center justify-center">
            <Pencil size={10} color="white" />
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    width: "100%",
    fontFamily: "p-l",
    fontSize: 12,
    color: "white",
    letterSpacing: 0.1,
    textAlign: "center",
  },
});

// colorsapp-palette-picker-color-change-animation 🔼
