import { ActivityIndicator, Pressable, View } from "react-native";
import { useEffect, useState } from "react";
import Animated, { FadeIn } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MIN_BUTTON_WIDTH = 65;
const MOCK_LOADING_DURATION = 3000;

const UpgradeButton = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), MOCK_LOADING_DURATION);
    }
  }, [loading]);

  return (
    <View className="mx-5 mb-5 justify-center items-center">
      <AnimatedPressable
        onPress={() => setLoading(true)}
        className="h-[54px] rounded-full bg-white justify-center items-center"
        style={{
          transitionProperty: "width",
          transitionDuration: 400,
          transitionTimingFunction: "ease-out",
          width: loading ? MIN_BUTTON_WIDTH : "100%",
          borderCurve: "continuous",
        }}
        disabled={loading}
      />
      <View className="absolute pointer-events-none">
        {loading ? (
          <Animated.View key="loader" entering={FadeIn}>
            <ActivityIndicator color="black" />
          </Animated.View>
        ) : (
          <Animated.Text
            key="text"
            entering={FadeIn}
            className="text-black text-xl text-nowrap font-medium"
          >
            Upgrade to SuperGrok
          </Animated.Text>
        )}
      </View>
    </View>
  );
};

export default UpgradeButton;
