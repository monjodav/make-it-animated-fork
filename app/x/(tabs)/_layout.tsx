import { TabsContext } from "@/providers/x/TabsProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { FC, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { Animated as RNAnimated, StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum Tab {
  Home = "home",
  Search = "search",
  Grok = "grok",
  Community = "community",
  Notifications = "notifications",
  Messages = "messages",
}

export type RouteParams = {
  isBottomBlurVisible?: "true" | "false";
};

type AnimatedIconWrapperProps = {
  scale: SharedValue<number>;
};

const AnimatedIconWrapper: FC<PropsWithChildren<AnimatedIconWrapperProps>> = ({
  children,
  scale,
}) => {
  return (
    <Animated.View
      onTouchStart={() => {
        scale.value = withTiming(0.8);
      }}
      onTouchEnd={() => {
        scale.value = withTiming(1);
      }}
      style={{ transform: [{ scale }] }}
    >
      {children}
    </Animated.View>
  );
};

const TabsLayout = () => {
  const { isBottomBlurVisible, setIsBottomBlurVisible } = useContext(TabsContext);

  const insets = useSafeAreaInsets();

  const homeIconScale = useSharedValue(1);
  const searchIconScale = useSharedValue(1);
  const grokIconScale = useSharedValue(1);
  const communityIconScale = useSharedValue(1);
  const notificationsIconScale = useSharedValue(1);
  const messagesIconScale = useSharedValue(1);

  const tabBarOpacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(tabBarOpacity, {
      toValue: isBottomBlurVisible ? 1 : 0.25,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isBottomBlurVisible]);

  const rBlurContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isBottomBlurVisible ? 1 : 0),
    };
  });

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        initialRouteName={Tab.Home}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#D9D9D9",
          tabBarInactiveTintColor: "#D9D9D9",
          tabBarStyle: {
            position: "absolute",
            left: 0,
            bottom: 0,
            elevation: 0,
            overflow: "hidden",
            paddingTop: 8,
            paddingBottom: insets.bottom + 16,
            borderTopColor: "#ffffff20",
            backgroundColor: "#00000000",
            opacity: tabBarOpacity,
          },
          tabBarBackground: () => (
            <Animated.View style={[StyleSheet.absoluteFillObject, rBlurContainerStyle]}>
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
            </Animated.View>
          ),
        }}
        screenListeners={{
          tabPress: () => setIsBottomBlurVisible(true),
        }}
      >
        <Tabs.Screen
          name={Tab.Home}
          options={{
            tabBarIcon: ({ color, focused }) => {
              return (
                <AnimatedIconWrapper scale={homeIconScale}>
                  {focused ? (
                    <Foundation name="home" size={22} color={color} />
                  ) : (
                    <Octicons name="home" size={20} color={color} />
                  )}
                </AnimatedIconWrapper>
              );
            },
          }}
        />
        <Tabs.Screen
          name={Tab.Search}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIconWrapper scale={searchIconScale}>
                <Feather name="search" size={22} color={color} />
              </AnimatedIconWrapper>
            ),
          }}
        />
        <Tabs.Screen
          name={Tab.Grok}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIconWrapper scale={grokIconScale}>
                <AntDesign
                  name={focused ? "minussquare" : "minussquareo"}
                  size={20}
                  color={color}
                />
              </AnimatedIconWrapper>
            ),
          }}
        />
        <Tabs.Screen
          name={Tab.Community}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIconWrapper scale={communityIconScale}>
                <MaterialCommunityIcons
                  name={focused ? "account-multiple" : "account-multiple-outline"}
                  size={24}
                  color={color}
                />
              </AnimatedIconWrapper>
            ),
          }}
        />
        <Tabs.Screen
          name={Tab.Notifications}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIconWrapper scale={notificationsIconScale}>
                <Octicons name={focused ? "bell-fill" : "bell"} size={20} color={color} />
              </AnimatedIconWrapper>
            ),
          }}
        />
        <Tabs.Screen
          name={Tab.Messages}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIconWrapper scale={messagesIconScale}>
                <Ionicons name={focused ? "mail" : "mail-outline"} size={22} color={color} />
              </AnimatedIconWrapper>
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
