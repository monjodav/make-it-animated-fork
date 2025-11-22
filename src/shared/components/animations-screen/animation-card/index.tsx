import { FC, useMemo, useRef, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Video, { VideoRef } from "react-native-video";
import { useAnimationsStore } from "../../../lib/store/animations";
import { Header } from "./header";
import { Animation } from "../../../lib/types/app";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { DotsLoader } from "./loader";

const getRandomRotation = () => {
  return Math.floor(Math.random() * 9) - 4;
};

type AnimationCardProps = {
  animation: Animation;
  index: number;
  visibleItemIndices: Set<number>;
};

const AnimationCard: FC<AnimationCardProps> = ({ animation, index, visibleItemIndices }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const videoRef = useRef<VideoRef>(null);

  const playbackId = animation.video.dev.playback_id;

  const url = `https://stream.mux.com/${playbackId}.m3u8`;

  const rotation = useMemo(() => getRandomRotation(), []);

  const viewMode = useAnimationsStore((state) => state.viewMode);

  // Pause/resume video based on visibility
  useEffect(() => {
    const isVisible = visibleItemIndices.has(index);
    setIsPaused(!isVisible);
  }, [visibleItemIndices, index]);

  const rVideoContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isLoaded ? 1 : 0),
    };
  });

  // List view
  if (viewMode === "list") {
    return (
      <View className="py-4">
        <Header animation={animation} rotation={0} />
      </View>
    );
  }

  // Grid view
  return (
    <View className="py-8 gap-4">
      <Header animation={animation} rotation={rotation} />
      <View
        className="w-full aspect-square rounded-[32px] bg-foreground overflow-hidden"
        style={styles.borderCurve}
      >
        {!isLoaded && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="absolute inset-0 items-center justify-center"
          >
            <DotsLoader size="lg" />
          </Animated.View>
        )}
        <Animated.View className="size-full" style={rVideoContainerStyle}>
          <Video
            ref={videoRef}
            source={{ uri: url }}
            style={styles.video}
            repeat
            paused={isPaused}
            onLoad={() => setIsLoaded(true)}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
  },
  borderCurve: {
    borderCurve: "continuous",
  },
});

export default AnimationCard;
