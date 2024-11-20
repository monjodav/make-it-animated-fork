import React, { FC } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Tab } from "./tab-bar";

const _duration = 300;

type Props = {
  activeTab: Tab;
  tabBarOffsetX: SharedValue<number>;
  allIssuesWidth: SharedValue<number>;
  activeWidth: SharedValue<number>;
  backlogWidth: SharedValue<number>;
  triageWidth: SharedValue<number>;
  currentCycleWidth: SharedValue<number>;
  upcomingCycleWidth: SharedValue<number>;
  allIssuesX: SharedValue<number>;
  activeX: SharedValue<number>;
  backlogX: SharedValue<number>;
  triageX: SharedValue<number>;
  currentCycleX: SharedValue<number>;
  upcomingCycleX: SharedValue<number>;
  isScrolling: SharedValue<boolean>;
};

export const TabIndicator: FC<Props> = ({
  activeTab,
  tabBarOffsetX,
  allIssuesWidth,
  activeWidth,
  backlogWidth,
  triageWidth,
  currentCycleWidth,
  upcomingCycleWidth,
  allIssuesX,
  activeX,
  backlogX,
  triageX,
  currentCycleX,
  upcomingCycleX,
  isScrolling,
}) => {
  const width = useDerivedValue(() => {
    return activeTab === Tab.AllIssues
      ? allIssuesWidth.value
      : activeTab === Tab.Active
        ? activeWidth.value
        : activeTab === Tab.Backlog
          ? backlogWidth.value
          : activeTab === Tab.Triage
            ? triageWidth.value
            : activeTab === Tab.CurrentCycle
              ? currentCycleWidth.value
              : upcomingCycleWidth.value;
  });

  const left = useDerivedValue(() => {
    return withTiming(
      -tabBarOffsetX.value +
        (activeTab === Tab.AllIssues
          ? allIssuesX.value
          : activeTab === Tab.Active
            ? activeX.value
            : activeTab === Tab.Backlog
              ? backlogX.value
              : activeTab === Tab.Triage
                ? triageX.value
                : activeTab === Tab.CurrentCycle
                  ? currentCycleX.value
                  : upcomingCycleX.value),
      { duration: isScrolling.value ? 0 : _duration }
    );
  });

  const rIndicatorStyle = useAnimatedStyle(() => {
    return { left: left.value, width: width.value };
  });

  return (
    <Animated.View className="absolute h-full rounded-lg bg-[#28282D]" style={rIndicatorStyle} />
  );
};
