import React, { FC, PropsWithChildren } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { TimerStep } from "../../lib/types";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { _borderCurve } from "@/src/apps/(j-l)/linear/components/tab-item";
import { BlurView } from "expo-blur";
import { Minus, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";

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
};

export const Stepper: FC<Props> = ({ data, value }) => {
  const stringValue = useDerivedValue(() => {
    if (value.get() < 60) return `${value.get()}m`;
    return `${Math.floor(value.get() / 60)}h`;
  });

  return (
    <View className="flex-row items-center justify-center gap-2">
      <StepperButton
        onPress={() => {
          const currentIndex = data.findIndex((item) => item.value === value.get());
          if (currentIndex === 1) return;
          value.set(data[currentIndex - 1].value);
        }}
      >
        <Minus size={16} color="#f5f5f5" />
      </StepperButton>
      <Pressable
        className="w-20 rounded-2xl items-center justify-center bg-white"
        style={[styles.borderCurve, { height: HEIGHT }]}
        onPressIn={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
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
          }}
        />
      </Pressable>
      <StepperButton
        onPress={() => {
          const currentIndex = data.findIndex((item) => item.value === value.get());
          if (currentIndex === data.length - 1) return;
          value.set(data[currentIndex + 1].value);
        }}
      >
        <Plus size={16} color="#f5f5f5" />
      </StepperButton>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: _borderCurve,
  },
});
