import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Pressable, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// linkedin-bottom-tabs-indicator-animation 🔽

enum Tab {
  Home = "home",
  Video = "video",
  MyNetwork = "my-network",
  Notifications = "notifications",
  Jobs = "jobs",
}

const TAB_BAR_HEIGHT_WITHOUT_INSET = 40;
const ANIMATED_BAR_HEIGHT = 2;

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const tabBarPaddingBottom = insets.bottom + 16;
  const tabBarHeight = tabBarPaddingBottom + TAB_BAR_HEIGHT_WITHOUT_INSET;
  const animatedBarWidth = width / Object.keys(Tab).length;

  const currentTab = useSharedValue(Tab.Home);

  const left: Record<Tab, number> = {
    [Tab.Home]: 2, // Value is 2 to keep a small gap between the animated bar and left edge of the screen
    [Tab.Video]: animatedBarWidth,
    [Tab.MyNetwork]: animatedBarWidth * 2,
    [Tab.Notifications]: animatedBarWidth * 3,
    [Tab.Jobs]: animatedBarWidth * 4 - 2, // Value is -2 to keep a small gap between the animated bar and right edge of the screen
  };

  const rAnimatedBarStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(left[currentTab.value], {
        duration: 200,
        easing: Easing.inOut(Easing.quad),
      }),
    };
  });

  return (
    <>
      <Tabs
        initialRouteName={Tab.Home}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#C4C6C7",
          tabBarInactiveTintColor: "#96999b",
          tabBarStyle: {
            height: tabBarHeight,
            overflow: "hidden",
            paddingBottom: tabBarPaddingBottom,
            borderTopColor: "#ffffff20",
            backgroundColor: "#21262E",
          },
          tabBarButton: (props) => (
            <Pressable
              onPress={props.onPress}
              style={props.style}
              android_ripple={{ color: "transparent" }}
            >
              {props.children}
            </Pressable>
          ),
        }}
        screenListeners={{
          tabPress: (e) => {
            if (e.target?.includes(Tab.Home)) {
              currentTab.value = Tab.Home;
            } else if (e.target?.includes(Tab.Video)) {
              currentTab.value = Tab.Video;
            } else if (e.target?.includes(Tab.MyNetwork)) {
              currentTab.value = Tab.MyNetwork;
            } else if (e.target?.includes(Tab.Notifications)) {
              currentTab.value = Tab.Notifications;
            } else if (e.target?.includes(Tab.Jobs)) {
              currentTab.value = Tab.Jobs;
            }
          },
        }}
      >
        <Tabs.Screen
          name={Tab.Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <Entypo name="home" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name={Tab.Video}
          options={{
            tabBarLabel: "Video",
            tabBarIcon: ({ color }) => <Entypo name="folder-video" size={20} color={color} />,
          }}
        />
        <Tabs.Screen
          name={Tab.MyNetwork}
          options={{
            tabBarLabel: "My Network",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-multiple" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name={Tab.Notifications}
          options={{
            tabBarLabel: "Notifications",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bell" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name={Tab.Jobs}
          options={{
            tabBarLabel: "Jobs",
            tabBarIcon: ({ color }) => <Ionicons name="bag" size={20} color={color} />,
          }}
        />
      </Tabs>
      <Animated.View
        className="absolute left-0 right-0 rounded-full bg-[#C4C6C7]"
        style={[
          rAnimatedBarStyle,
          {
            width: animatedBarWidth,
            height: ANIMATED_BAR_HEIGHT,
            bottom: tabBarHeight - ANIMATED_BAR_HEIGHT,
          },
        ]}
      />
    </>
  );
};

export default TabsLayout;

// linkedin-bottom-tabs-indicator-animation 🔼
