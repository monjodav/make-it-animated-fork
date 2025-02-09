import { useNavigation } from "expo-router";
import React, { FC, PropsWithChildren, RefObject, useEffect } from "react";
import { Pressable, View, StyleSheet, FlatList } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

// google-chrome-top-tabs-indicator-animation 🔽

const _tabButtonWidth = 60;
const _tabButtonHeight = 40;
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

type Props = {
  listRef: RefObject<FlatList>;
  tabIndex: SharedValue<number>;
};

export const useHeaderTabs = ({ listRef, tabIndex }: Props) => {
  const navigation = useNavigation();

  const rIndicatorContainerStyle = useAnimatedStyle(() => {
    return {
      left: interpolate(
        tabIndex.value,
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
            tabIndex.value,
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
      opacity: withTiming(tabIndex.value > 1 ? 1 : 0, { duration: 50 }),
    };
  });

  const rRightVerticalLineStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(tabIndex.value < 1 ? 1 : 0, { duration: 50 }),
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View
            className="self-center flex-row items-center justify-center rounded-2xl bg-neutral-700"
            style={styles.borderCurve}
          >
            {/* Tabs */}
            <TabButton onPress={() => listRef.current?.scrollToIndex({ index: 0 })}>
              <MaterialCommunityIcons name="incognito" size={24} color="lightgray" />
            </TabButton>
            <TabButton onPress={() => listRef.current?.scrollToIndex({ index: 1 })}>
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
            <TabButton onPress={() => listRef.current?.scrollToIndex({ index: 2 })}>
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
      },
    });
  }, [navigation]);
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

// google-chrome-top-tabs-indicator-animation 🔼
