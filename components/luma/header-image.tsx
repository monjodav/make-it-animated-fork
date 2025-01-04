import React, { FC } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import { _headerHeight, _headerWidth, _topOffset } from "./header";
import { BlurredImage } from "./blurred-image";
// NOTE: The image must be portrait orientation
import DubaiImage from "@/assets/images/misc/dubai.png";

type Props = {
  scrollY: SharedValue<number>;
};

export const HeaderImage: FC<Props> = ({ scrollY }) => {
  const { height } = useWindowDimensions();

  const rImageBgStyle = useAnimatedStyle(() => {
    return {
      top: -_topOffset,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-_topOffset, 0, height],
            [_topOffset, 0, -height],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-height, -_topOffset, 0],
            [2, 1, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      className="absolute"
      style={[
        rImageBgStyle,
        { width: _headerWidth, height: _headerHeight, transformOrigin: "top" },
      ]}
    >
      <BlurredImage imageSource={DubaiImage} />
    </Animated.View>
  );
};
