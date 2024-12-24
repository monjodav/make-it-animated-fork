import { HomeHeader } from "@/components/x/home-header";
import { HomeList } from "@/components/x/home-list";
import { useHeaderAnimation } from "@/hooks/x/use-header-animation";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { BlurView } from "expo-blur";
import { useContext, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated from "react-native-reanimated";

// x-bottom-tabs-background-animation 🔽

type PostList = {
  title: string;
};

const posts: PostList[] = [
  {
    title: "All",
  },
  {
    title: "ColorsApp",
  },
  {
    title: "project 1",
  },
];

export default function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const { tabBarHeight, scrollDirection, handleXTabsOnScroll } = useContext(XTabsContext);

  const { width } = useWindowDimensions();

  // x-home-header-animation 🔽
  const { rHeaderStyle, rBlurViewStyle, scrollHandler } = useHeaderAnimation({
    headerHeight,
    scrollDirection,
    handleXTabsOnScroll,
  });
  // x-home-header-animation 🔼

  return (
    <View className="flex-1 bg-x-back">
      {/* x-home-header-animation 🔽 */}
      <Animated.View
        style={rHeaderStyle}
        className="absolute top-0 left-0 right-0 z-50"
        onLayout={({ nativeEvent }) => {
          setHeaderHeight(nativeEvent.layout.height);
        }}
      >
        {/* BlurView is experimental on Android and should be used with caution */}
        {/* To apply blur effect on Android, you need use experimentalBlurMethod prop */}
        <Animated.View style={[StyleSheet.absoluteFillObject, rBlurViewStyle]}>
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
        </Animated.View>
        <HomeHeader />
      </Animated.View>
      {/* x-home-header-animation 🔼 */}
      <Animated.FlatList
        data={posts}
        keyExtractor={(item) => item.title}
        renderItem={() => (
          <View style={{ width }}>
            <HomeList
              headerHeight={headerHeight}
              tabBarHeight={tabBarHeight}
              scrollHandler={scrollHandler}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
      />
    </View>
  );
}

// x-bottom-tabs-background-animation 🔼
