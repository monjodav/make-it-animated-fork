import { Animated, View } from "react-native";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReanimatedTopTabsIndex } from "@/src/shared/lib/hooks/use-reanimated-top-tabs-index";
import { TabItem } from "./tab-item";
import { Logo } from "../logo";
import { TabIndicator } from "./tab-indicator";

// threads-home-header-tabs-animation 🔽

const TABS_HORIZONTAL_PADDING = 16;

type Props = MaterialTopTabBarProps;

export function HomeTopTabs({ state, descriptors, navigation, position }: Props) {
  const insets = useSafeAreaInsets();

  const { activeTabIndex, dummyOpacity } = useReanimatedTopTabsIndex({
    position,
    state,
  });

  return (
    <Animated.View
      style={{ opacity: dummyOpacity, paddingTop: insets.top }}
      className="bg-neutral-950 border-b-[0.5px] border-neutral-800"
    >
      <View className="items-center justify-center">
        <Logo width={24} />
      </View>
      <View className="flex-row pb-2" style={{ paddingHorizontal: TABS_HORIZONTAL_PADDING }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              index={index}
              activeTabIndex={activeTabIndex}
              isFocused={isFocused}
              options={options}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
      <TabIndicator
        activeTabIndex={activeTabIndex}
        numberOfTabs={state.routes.length}
        tabsHorizontalPadding={TABS_HORIZONTAL_PADDING}
      />
    </Animated.View>
  );
}

// threads-home-header-tabs-animation 🔼
