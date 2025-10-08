import React, { createContext, useState, useCallback, use } from "react";
import { View, Pressable, type LayoutChangeEvent, GestureResponderEvent } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type {
  SegmentedControlContextValue,
  SegmentedControlProps,
  SegmentedControlItemProps,
  SegmentedControlIndicatorProps,
  ItemMeasurements,
} from "./types";
import { cn } from "../../lib/utils/cn";

const SegmentedControlContext = createContext<SegmentedControlContextValue>({
  value: "",
  onValueChange: () => {},
  measurements: {},
  setMeasurements: () => {},
});

const SegmentedControlRoot = ({
  value,
  onValueChange,
  className,
  children,
  ...props
}: SegmentedControlProps) => {
  const [measurements, setMeasurementsState] = useState<Record<string, ItemMeasurements>>({});

  const setMeasurements = useCallback((key: string, newMeasurements: ItemMeasurements) => {
    setMeasurementsState((prev) => ({
      ...prev,
      [key]: newMeasurements,
    }));
  }, []);

  const contextValue: SegmentedControlContextValue = {
    value,
    onValueChange,
    measurements,
    setMeasurements,
  };

  return (
    <SegmentedControlContext value={contextValue}>
      <View className={cn("flex-row", className)} {...props}>
        {children}
      </View>
    </SegmentedControlContext>
  );
};

const SegmentedControlItem = ({
  value,
  children,
  className,
  onPress,
  pressScale,
  ...props
}: SegmentedControlItemProps) => {
  const { onValueChange, setMeasurements, value: activeValue } = use(SegmentedControlContext);
  const isActive = activeValue === value;
  const scale = useSharedValue(1);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height, x } = event.nativeEvent.layout;
      setMeasurements(value, { width, height, x });
    },
    [value, setMeasurements]
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      onValueChange(value);
      onPress?.(event);
    },
    [value, onValueChange, onPress]
  );

  const handlePressIn = useCallback(() => {
    if (pressScale && pressScale > 0 && pressScale <= 1) {
      scale.value = withTiming(pressScale, { duration: 120 });
    }
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    if (pressScale && pressScale > 0 && pressScale <= 1) {
      scale.value = withTiming(1, { duration: 140 });
    }
  }, [pressScale]);

  const rScaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const content = typeof children === "function" ? children({ isActive }) : children;

  return (
    <Pressable
      className={className}
      onLayout={handleLayout}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityState={{ selected: isActive }}
      {...props}
    >
      {pressScale ? <Animated.View style={rScaleStyle}>{content}</Animated.View> : content}
    </Pressable>
  );
};

const SegmentedControlIndicator = ({
  className,
  style,
  ...props
}: SegmentedControlIndicatorProps) => {
  const { value, measurements } = use(SegmentedControlContext);

  const activeMeasurements = measurements[value];
  const hasMeasured = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    if (!activeMeasurements) {
      return {
        width: 0,
        height: 0,
        left: 0,
        opacity: 0,
      };
    }

    if (!hasMeasured.value) {
      hasMeasured.value = true;
      return {
        width: activeMeasurements.width,
        height: activeMeasurements.height,
        left: activeMeasurements.x,
        opacity: 1,
      };
    }

    return {
      width: withTiming(activeMeasurements.width),
      height: withTiming(activeMeasurements.height),
      left: withTiming(activeMeasurements.x),
      opacity: withTiming(1),
    };
  }, [activeMeasurements]);

  return (
    <Animated.View
      className={cn("absolute", className)}
      style={[animatedStyle, style]}
      {...props}
    />
  );
};

SegmentedControlRoot.displayName = "SegmentedControl";
SegmentedControlItem.displayName = "SegmentedControl.Item";
SegmentedControlIndicator.displayName = "SegmentedControl.Indicator";

const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Item: SegmentedControlItem,
  Indicator: SegmentedControlIndicator,
});

export default SegmentedControl;
