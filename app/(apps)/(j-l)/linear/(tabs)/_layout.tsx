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

const clamp = (x: number, min: number, max: number) => {
  "worklet";
  return Math.max(min, Math.min(max, x));
};
const smoothStep = (t: number) => {
  "worklet";
  return t * t * (3 - 2 * t);
};

const TabsLayout = () => {
  const { scrollY, title } = useScrollContext();

  const HeaderLeftAnimated = () => {
    const progress = useSharedValue(0);

    useDerivedValue(() => {
      const target = scrollY.get() >= TITLE_SWITCH_OFFSET ? 1 : 0;
      if (progress.get() !== target) {
        progress.set(withTiming(target, { duration: 300, easing: Easing.out(Easing.cubic) }));
      }
    });

    const rOutgoingStyle = useAnimatedStyle(() => {
      const p = progress.get();
      const angle = 90 * p;
      const ty = -TITLE_ROW_HEIGHT * p;
      const start = MID - WIDTH * 0.5;
      const end = MID + WIDTH * 0.5;
      const t = clamp((p - start) / (end - start), 0, 1);
      const smooth = smoothStep(t);
      return {
        opacity: 1 - smooth,
        transform: [{ perspective: 700 }, { rotateX: `${angle}deg` }, { translateY: ty }],
        backfaceVisibility: "hidden",
      };
    });

    const rIncomingStyle = useAnimatedStyle(() => {
      const p = progress.get();
      const angle = -90 * (1 - p);
      const ty = TITLE_ROW_HEIGHT * (1 - p);
      const start = MID - WIDTH * 0.5;
      const end = MID + WIDTH * 0.5;
      const t = clamp((p - start) / (end - start), 0, 1);
      const smooth = smoothStep(t);
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
          style={[rOutgoingStyle, { position: "absolute", left: 0, top: 0 }]}
          className="text-[#777777] text-lg font-bold"
        >
          Title
        </Animated.Text>

        <Animated.Text
          style={[rIncomingStyle, { position: "absolute", left: 0, top: 0 }]}
          className="text-[#777777] text-lg font-bold"
        >
          {title}
        </Animated.Text>
      </View>
    );
  };

  const headerLeft = () => <HeaderLeftAnimated />;

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
        headerLeft,
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
