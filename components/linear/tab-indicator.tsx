import React, { FC } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Tab } from "./tab-bar";
import { _borderColor, _borderCurve, _borderRadius } from "./tab-item";

const _duration = 200;

type Props = {
  activeTab: Tab;
  tabBarOffsetX: SharedValue<number>;
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
};

export const TabIndicator: FC<Props> = ({ activeTab, tabBarOffsetX, tabWidths, tabOffsets }) => {
  const rIndicatorStyle = useAnimatedStyle(() => {
    const left = withTiming(
      interpolate(activeTab, Object.keys(tabOffsets.value).map(Number), tabOffsets.value),
      {
        duration: _duration,
      }
    );

    const width = withTiming(
      interpolate(activeTab, Object.keys(tabWidths.value).map(Number), tabWidths.value),
      {
        duration: _duration,
      }
    );

    return {
      left,
      width,
      transform: [{ translateX: -tabBarOffsetX.value }],
    };
  });

  return <Animated.View className="absolute h-full" style={[rIndicatorStyle, styles.container]} />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: _borderColor,
    borderRadius: _borderRadius,
    borderCurve: _borderCurve,
  },
});
