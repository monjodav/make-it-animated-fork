import { ScrollProvider, useScrollContext } from "@/src/apps/(j-l)/linear/lib/scroll-provider";
import Foundation from "@expo/vector-icons/Foundation";
import { router, Tabs } from "expo-router";
import { Inbox, Scan, Search, Settings, SquarePen } from "lucide-react-native";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

enum Tab {
  Home = "home",
  Inbox = "inbox",
  Search = "search",
  Issues = "issues",
  Profile = "profile",
}
const TITLE_SWITCH_OFFSET = 30;
const TITLE_ROW_HEIGHT = 28;

const MID = 0.5;
const WIDTH = 0.24;
const START = MID - WIDTH / 2;
const END = MID + WIDTH / 2;

const TabsLayout = () => {
  const { scrollY, title } = useScrollContext();

  const HeaderLeftAnimated = ({ title }: { title: string }) => {
    const progress = useSharedValue(0);
    useDerivedValue(() => {
      const target = scrollY.value >= TITLE_SWITCH_OFFSET ? 1 : 0;
      if (progress.value !== target) {
        progress.value = withTiming(target, { duration: 300, easing: Easing.out(Easing.cubic) });
      }
    });

    const outgoingStyle = useAnimatedStyle(() => {
      const p = progress.value;
      const angle = 90 * p;
      const ty = -TITLE_ROW_HEIGHT * p;

      const t = Math.max(0, Math.min(1, (p - START) / (END - START)));
      const smooth = t * t * (3 - 2 * t);
      return {
        opacity: 1 - smooth,
        transform: [{ perspective: 700 }, { rotateX: `${angle}deg` }, { translateY: ty }],
        backfaceVisibility: "hidden",
      };
    });

    const incomingStyle = useAnimatedStyle(() => {
      const p = progress.value;
      const angle = -90 * (1 - p);
      const ty = TITLE_ROW_HEIGHT * (1 - p);

      const t = Math.max(0, Math.min(1, (p - START) / (END - START)));
      const smooth = t * t * (3 - 2 * t);
      return {
        opacity: smooth,
        transform: [{ perspective: 700 }, { rotateX: `${angle}deg` }, { translateY: ty }],
        backfaceVisibility: "hidden",
      };
    });

    return (
      <View
        style={{
          left: 15,
          overflow: "hidden",
          height: TITLE_ROW_HEIGHT,
          justifyContent: "center",
          minWidth: 80,
        }}
      >
        <Animated.Text
          style={[outgoingStyle, { position: "absolute", left: 0, top: 0 }]}
          className="text-[#777777] text-lg font-bold"
        >
          Title
        </Animated.Text>

        <Animated.Text
          style={[incomingStyle, { position: "absolute", left: 0, top: 0 }]}
          className="text-[#777777]  text-lg font-bold"
        >
          {title}
        </Animated.Text>
      </View>
    );
  };

  const headerLeftFor = (_routeName: string) => {
    return () => <HeaderLeftAnimated title={title} />;
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "black" },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: "#000",
        },
        tabBarButton: (props) => (
          <Pressable onPress={props.onPress} style={props.style}>
            {props.children}
          </Pressable>
        ),
        headerRight: () => (
          <Pressable className="flex-row items-center mr-4" onPress={router.back}>
            <Settings size={28} color="#777777" />
          </Pressable>
        ),
        headerLeft: headerLeftFor(route.name),
      })}
    >
      <Tabs.Screen
        name={Tab.Home}
        options={{
          tabBarIcon: ({ color }) => <Foundation name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Inbox}
        options={{
          tabBarIcon: ({ color }) => <Inbox size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Search}
        options={{
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Issues}
        options={{
          tabBarIcon: ({ color }) => <Scan size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name={Tab.Profile}
        options={{
          tabBarIcon: ({ color }) => <SquarePen size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default function LinearLayout() {
  return (
    <ScrollProvider>
      <TabsLayout />
    </ScrollProvider>
  );
}
