import { TabNavigationState, ParamListBase } from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { HomeTopTabs } from "@/src/apps/(s-t)/threads/components/home-top-tabs";

// threads-home-header-tabs-animation 🔽

const { Navigator } = createMaterialTopTabNavigator();

const Tabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function HomeLayout() {
  return (
    <Tabs
      tabBar={(props) => <HomeTopTabs {...props} />}
      screenOptions={{ sceneStyle: { backgroundColor: "#0a0a0a" } }}
      pagerStyle={{ backgroundColor: "#0a0a0a" }}
    >
      <Tabs.Screen name="for-you" options={{ title: "For you" }} />
      <Tabs.Screen name="following" options={{ title: "Following" }} />
    </Tabs>
  );
}

// threads-home-header-tabs-animation 🔼
