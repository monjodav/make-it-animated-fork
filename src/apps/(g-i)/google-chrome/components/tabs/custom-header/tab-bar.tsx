import React, { FC, PropsWithChildren } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { TabBarProps } from "react-native-collapsible-tab-view";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { TabName } from "../../../lib/types";
import { BlurView } from "expo-blur";
import { cn } from "@/src/shared/lib/utils/cn";

const _tabButtonWidth = 60;
const _tabButtonHeight = 42;
const _padding = 2;

type TabButtonProps = {
  onPress?: () => void;
};

const TabButton: FC<PropsWithChildren<TabButtonProps>> = ({ onPress, children }) => {
  return (
    <Pressable
      className="items-center justify-center"
      style={styles.tabButtonContainer}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

type Props = Pick<TabBarProps<string>, "indexDecimal" | "onTabPress">;

export const TabBar: FC<Props> = ({ indexDecimal, onTabPress }) => {
  const rIndicatorContainerStyle = useAnimatedStyle(() => {
    return {
      left: interpolate(
        indexDecimal.value,
        [0, 1, 2],
        [_padding, _tabButtonWidth, 2 * _tabButtonWidth - _padding],
        Extrapolation.CLAMP
      ),
    };
  });

  const rIndicatorContentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            indexDecimal.value,
            [0, 1, 2],
            [0, -_tabButtonWidth, -2 * _tabButtonWidth],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const rLeftVerticalLineStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(indexDecimal.value > 1 ? 1 : 0, { duration: 50 }),
    };
  });

  const rRightVerticalLineStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(indexDecimal.value < 1 ? 1 : 0, { duration: 50 }),
    };
  });

  return (
    <View
      className={cn(
        "flex-row items-center justify-center rounded-2xl  overflow-hidden",
        Platform.OS === "android" && "bg-neutral-700/75"
      )}
      style={styles.borderCurve}
    >
      {Platform.OS === "ios" && (
        <BlurView tint="systemUltraThinMaterialLight" style={StyleSheet.absoluteFill} />
      )}
      {/* Tabs */}
      <TabButton onPress={() => onTabPress(TabName.Incognito)}>
        <MaterialCommunityIcons name="incognito" size={24} color="lightgray" />
      </TabButton>
      <TabButton onPress={() => onTabPress(TabName.Main)}>
        <Animated.View
          className="absolute left-0 h-6"
          style={[styles.verticalLine, rLeftVerticalLineStyle]}
        />
        <FontAwesome name="square-o" size={24} color="lightgray" />
        <Animated.View
          className="absolute right-0 h-6"
          style={[styles.verticalLine, rRightVerticalLineStyle]}
        />
      </TabButton>
      <TabButton onPress={() => onTabPress(TabName.Groups)}>
        <Ionicons name="grid-outline" size={24} color="lightgray" />
      </TabButton>
      {/* Indicator */}
      <Animated.View
        className="absolute top-[2px] bg-white rounded-2xl overflow-hidden"
        style={[styles.indicator, styles.borderCurve, rIndicatorContainerStyle]}
      >
        <Animated.View className="flex-row items-center" style={rIndicatorContentStyle}>
          <View className="items-center justify-center" style={styles.indicator}>
            <MaterialCommunityIcons name="incognito" size={24} color="black" />
          </View>
          <View className="items-center justify-center" style={styles.indicator}>
            <FontAwesome name="square-o" size={24} color="black" />
          </View>
          <View className="items-center justify-center" style={styles.indicator}>
            <Ionicons name="grid-outline" size={24} color="black" />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
  tabButtonContainer: {
    width: _tabButtonWidth,
    height: _tabButtonHeight,
  },
  verticalLine: {
    width: 1,
    backgroundColor: "lightgray",
  },
  indicator: {
    width: _tabButtonWidth,
    height: _tabButtonHeight - 2 * _padding,
  },
});
