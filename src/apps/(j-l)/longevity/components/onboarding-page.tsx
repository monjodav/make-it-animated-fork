import { View, Text } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

type Props = {
  width: number;
  heightDotsBlock: SharedValue<number>;
  title: string;
  body: string;
};

export const OnboardingPage: React.FC<Props> = ({ width, heightDotsBlock, title, body }) => {
  const rTextBlockStyle = useAnimatedStyle(() => {
    return { marginBottom: heightDotsBlock.get() - 700 };
  });

  return (
    <View style={[{ width }]} className="h-full bg-[#161522]">
      <Animated.View
        style={[rTextBlockStyle]}
        className="flex-1 items-center justify-end px-8 pb-12"
      >
        <Text className="text-white text-4xl text-center">{title}</Text>
        <Text className="text-white text-xl mt-5 text-center">{body}</Text>
      </Animated.View>
    </View>
  );
};
