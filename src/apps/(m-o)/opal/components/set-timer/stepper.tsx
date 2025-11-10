import React, { FC, PropsWithChildren } from "react";
import { View, StyleSheet, Pressable, Platform, Dimensions } from "react-native";
import { TimerStep } from "../../lib/types";
import {
  SharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { _borderCurve } from "@/src/apps/(j-l)/linear/components/tab-item";
import { BlurView } from "expo-blur";
import { Minus, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated from "react-native-reanimated";

const WIDTH = Dimensions.get("window").width * 0.25;
const HEIGHT = 40;

type StepperButtonProps = {
  onPress: () => void;
};

const StepperButton: FC<PropsWithChildren<StepperButtonProps>> = ({ onPress, children }) => {
  return (
    <Pressable
      className="aspect-square rounded-full border border-neutral-700 items-center justify-center overflow-hidden"
      style={{ height: HEIGHT }}
      onPress={onPress}
      onPressIn={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      }}
    >
      {Platform.OS === "ios" && (
        <BlurView style={StyleSheet.absoluteFillObject} tint="systemUltraThinMaterialLight" />
      )}
      {children}
    </Pressable>
  );
};

type Props = {
  data: TimerStep[];
  value: SharedValue<number>;
  onPressHandler: () => void;
  progress: SharedValue<number>;
};

export const Stepper: FC<Props> = ({ data, value, onPressHandler, progress }) => {
  const stringValue = useDerivedValue(() => {
    if (value.get() < 60) return `${value.get()}m`;
    return `${Math.floor(value.get() / 60)}h`;
  });

  const handlePress = () => {
    onPressHandler();
  };

  const rStepperButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - progress.get(),
    };
  });

  const rCenterButtonStyle = useAnimatedStyle(() => {
    const targetX = -progress.get() * (HEIGHT + 6);
    const translateX = withSpring(targetX, {
      damping: 25,
      stiffness: 300,
      mass: 1,
    });

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View className="flex-row items-center justify-center gap-2">
      <Animated.View style={rStepperButtonStyle}>
        <StepperButton
          onPress={() => {
            const currentIndex = data.findIndex((item) => item.value === value.get());
            if (currentIndex === 1) return;
            value.set(data[currentIndex - 1].value);
          }}
        >
          <Minus size={16} color="#f5f5f5" />
        </StepperButton>
      </Animated.View>
      <Animated.View style={rCenterButtonStyle}>
        <Pressable
          className="rounded-2xl items-center justify-center bg-white"
          style={[styles.borderCurve, { height: HEIGHT, width: WIDTH }]}
          onPressIn={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            handlePress();
          }}
        >
          <ReText
            text={stringValue}
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 16,
              lineHeight: 20,
              color: "black",
              fontWeight: "medium",
              pointerEvents: "none",
            }}
          />
        </Pressable>
      </Animated.View>
      <Animated.View style={rStepperButtonStyle}>
        <StepperButton
          onPress={() => {
            const currentIndex = data.findIndex((item) => item.value === value.get());
            if (currentIndex === data.length - 1) return;
            value.set(data[currentIndex + 1].value);
          }}
        >
          <Plus size={16} color="#f5f5f5" />
        </StepperButton>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: _borderCurve,
  },
});
