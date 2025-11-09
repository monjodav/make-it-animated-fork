import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { RubberContainer } from "../rubber-container";
import { cn } from "@/src/shared/lib/utils/cn";
import { Gesture } from "react-native-gesture-handler";

const SLIDER_WIDTH = Dimensions.get("window").width * 0.65;
const SLIDER_HEIGHT = 44;

const TimeSlider = () => {
  const minutes = Array.from({ length: 13 }, (_, index) => ({
    id: index,
    value: index * 5,
  }));

  const hours = Array.from({ length: 23 }, (_, index) => ({
    id: index,
    value: (index + 2) * 60,
  }));

  const gesture = Gesture.Pan().onChange((event) => {
    console.log(event.x);
  });

  return (
    <RubberContainer width={SLIDER_WIDTH} height={SLIDER_HEIGHT} gestures={[gesture]}>
      <View
        style={styles.container}
        className="flex-1 border border-neutral-800 rounded-2xl overflow-hidden py-2.5"
      >
        {Platform.OS === "ios" && (
          <BlurView style={StyleSheet.absoluteFillObject} tint="systemUltraThinMaterialLight" />
        )}
        <View className="flex-row">
          {minutes.map((minute, index) => (
            <View key={minute.id} className="flex-1 items-start justify-center">
              <View
                className={cn(
                  "bg-neutral-700 w-[2px] rounded-full",
                  index === 0 ? "h-full opacity-0" : index % 2 === 0 ? "h-full" : "h-1/2 opacity-70"
                )}
              />
            </View>
          ))}
          {hours.map((hour, index) => (
            <View key={hour.id} className="flex-1 items-start justify-center">
              <View
                className={cn(
                  "bg-neutral-700 w-[2px] rounded-full",
                  index === 0 ? "h-1/2 opacity-70" : index % 2 === 0 ? "h-1/2 opacity-70" : "h-full"
                )}
              />
            </View>
          ))}
        </View>
      </View>
    </RubberContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});

export default TimeSlider;
