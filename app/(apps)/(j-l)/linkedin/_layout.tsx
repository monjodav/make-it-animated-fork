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
import { colorKit } from "reanimated-color-picker";

// linkedin-bottom-tabs-indicator-animation 🔽

// Tab enum defines route names for type-safe navigation and animation state management
enum Tab {
  Home = "home",
  Video = "video",
  MyNetwork = "my-network",
  Notifications = "notifications",
  Jobs = "jobs",
}

// Base tab bar height excluding safe area - matches LinkedIn's compact design
const TAB_BAR_HEIGHT_WITHOUT_INSET = 40;
// Indicator height: 2px creates subtle underline without overwhelming tab content
const ANIMATED_BAR_HEIGHT = 2;

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Safe area calculation: bottom inset + 16px padding ensures proper spacing on all devices
  const tabBarPaddingBottom = insets.bottom + 16;
  const tabBarHeight = tabBarPaddingBottom + TAB_BAR_HEIGHT_WITHOUT_INSET;
  // Equal width distribution: screen width divided by tab count for consistent indicator sizing
  const animatedBarWidth = width / Object.keys(Tab).length;

  // Shared value tracks current tab for smooth indicator animation coordination
  const currentTab = useSharedValue(Tab.Home);

  // Position mapping: calculates precise left offset for indicator animation
  // Uses 2px edge padding to prevent indicator from touching screen boundaries
  const left: Record<Tab, number> = {
    [Tab.Home]: 2, // 2px left margin prevents edge collision
    [Tab.Video]: animatedBarWidth, // 1x width = second tab position
    [Tab.MyNetwork]: animatedBarWidth * 2, // 2x width = third tab position
    [Tab.Notifications]: animatedBarWidth * 3, // 3x width = fourth tab position
    [Tab.Jobs]: animatedBarWidth * 4 - 2, // 4x width - 2px right margin for symmetry
  };

  // Animated style hook: drives indicator position based on currentTab shared value
  const rAnimatedBarStyle = useAnimatedStyle(() => {
    return {
      // withTiming creates smooth position transitions between tab selections
      left: withTiming(left[currentTab.value], {
        duration: 200, // 200ms duration provides responsive feel without being jarring
        easing: Easing.inOut(Easing.quad), // Quad easing: gentle acceleration/deceleration for natural motion
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
          // LinkedIn color scheme: light gray active, darker gray inactive for subtle contrast
          tabBarActiveTintColor: "#C4C6C7", // Active: light gray (#C4C6C7) for prominence
          tabBarInactiveTintColor: "#96999b", // Inactive: muted gray (#96999b) for hierarchy
          tabBarStyle: {
            height: tabBarHeight, // Dynamic height accounts for safe area variations
            overflow: "hidden", // Clips indicator animation within tab bar bounds
            paddingBottom: tabBarPaddingBottom, // Safe area + 16px ensures proper spacing
            borderColor: colorKit.setAlpha("#ffffff", 0.3).hex(), // 30% white opacity for subtle top border
            backgroundColor: "#21262E", // Dark background matches LinkedIn's professional theme
          },
          // Custom tab button: Pressable wrapper enables custom press handling for animation
          tabBarButton: (props) => (
            <Pressable
              onPress={props.onPress}
              style={props.style}
              android_ripple={{ color: "transparent" }} // Disables Android ripple to prevent visual conflicts with indicator
            >
              {props.children}
            </Pressable>
          ),
        }}
        // Tab press listener: updates shared value to trigger indicator animation
        screenListeners={{
          tabPress: (e) => {
            // Route name detection: updates currentTab shared value based on pressed tab
            // This triggers the rAnimatedBarStyle recalculation and smooth position transition
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
      {/* Animated indicator: positioned absolutely to slide smoothly between tabs */}
      <Animated.View
        className="absolute left-0 right-0 rounded-full bg-[#C4C6C7]"
        style={[
          rAnimatedBarStyle, // Applies animated left position from useAnimatedStyle
          {
            width: animatedBarWidth, // Matches individual tab width for perfect alignment
            height: ANIMATED_BAR_HEIGHT, // 2px height creates subtle underline effect
            bottom: tabBarHeight - ANIMATED_BAR_HEIGHT, // Positions at tab bar bottom edge
          },
        ]}
      />
    </>
  );
};

export default TabsLayout;

// linkedin-bottom-tabs-indicator-animation 🔼
